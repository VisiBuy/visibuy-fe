import React, { useState, useEffect } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { message, Modal, Input, Select, DatePicker } from "antd";
import graph from "../../public/icons/graph-icon.svg";
import mingcute from "../../public/icons/mingcute_time-line.svg";
import copy from "../../public/icons/solar_copy-broken.svg";
import eye from "../../public/icons/Group.svg";
import reload from "../../public/icons/reload.svg";
import dayjs from "dayjs";
import {
  useCreateApiKeyMutation,
  useGetApiKeysQuery,
} from "@/features/auth/apiKeyApi";

const { Option } = Select;

const AVAILABLE_PERMISSIONS = [
  "verifications:read",
  "verifications:write",
  "users:read",
  "users:write",
  "transactions:read",
  "transactions:write",
  "analytics:read",
  "settings:read",
  "api-keys:read",
  "api-keys:write",
  "audit:read",
  "billing:read",
];

// Remove the duplicate interface - use the one from apiKeyApi
type ApiKey = any; // This will use the type from the API

export default function ApiPage(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState("");
  const [newApiKeyData, setNewApiKeyData] = useState({
    name: "",
    permissions: [
      "verifications:read",
      "verifications:write",
      "users:read",
    ] as string[],
    expiresAt: "",
  });

  const { data: apiKeysData, isLoading, refetch } = useGetApiKeysQuery();
  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();

  const apiKeys: any[] = apiKeysData || [];
  console.log({apiKeys})

  const latestApiKey = apiKeys.length > 0 ? apiKeys[0] : null;
  const displayKey = latestApiKey?.key || latestApiKey?.id || "";
  const masked = "*".repeat(displayKey.length);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("API key copied");
    } catch (e) {
      message.error("Unable to copy");
    }
  };

  const handleCreateApiKey = async () => {
    if (!newApiKeyData.name.trim()) {
      message.error("Please enter a name for the API key");
      return;
    }

    try {
      const result = await createApiKey({
        name: newApiKeyData.name,
        permissions: newApiKeyData.permissions,
        expiresAt:
          newApiKeyData.expiresAt || dayjs().add(1, "year").toISOString(),
      }).unwrap();

      if (result.key) {
        setNewlyCreatedKey(result.key);
        setShowNewKey(true);
        setIsCreateModalVisible(false);
        refetch();

        setNewApiKeyData({
          name: "",
          permissions: [
            "verifications:read",
            "verifications:write",
            "users:read",
          ],
          expiresAt: "",
        });
      } else {
        message.error("Failed to get new API key from response");
      }
    } catch (error) {
      console.error("Create API Key Error:", error);
      message.error("Failed to create API key");
    }
  };

  const handleCloseNewKeyModal = () => {
    setShowNewKey(false);
    setNewlyCreatedKey("");
  };

  const handlePermissionPreset = (preset: "basic" | "standard" | "full") => {
    const presets = {
      basic: ["verifications:read", "users:read"],
      standard: [
        "verifications:read",
        "verifications:write",
        "users:read",
        "transactions:read",
      ],
      full: [
        "verifications:read",
        "verifications:write",
        "users:read",
        "users:write",
        "transactions:read",
        "transactions:write",
        "analytics:read",
      ],
    };
    setNewApiKeyData({ ...newApiKeyData, permissions: presets[preset] });
  };

  const getPermissionDescription = (permission: string) => {
    const descriptions: { [key: string]: string } = {
      "verifications:read": "View verification requests and results",
      "verifications:write": "Create and update verification requests",
      "users:read": "View user information and profiles",
      "users:write": "Create and update user accounts",
      "transactions:read": "View transaction history and details",
      "transactions:write": "Create and process transactions",
      "analytics:read": "Access analytics and reporting data",
      "settings:read": "View system settings and configuration",
      "api-keys:read": "View API key information",
      "api-keys:write": "Create and manage API keys",
      "audit:read": "Access audit logs and history",
      "billing:read": "View billing and usage information",
    };
    return descriptions[permission] || "No description available";
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white rounded-md p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">Loading API keys...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white rounded-md p-4 sm:p-6">
      {/* API Key Section - Single Card */}
      <div className="bg-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">API Key</h2>

        {latestApiKey ? (
          <div className="bg-gray-50 border p-4 rounded-2xl shadow-md border-[#D9D9D9]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="bg-white border rounded-lg px-4 py-3 w-full text-sm tracking-wide text-gray-700 select-text flex items-center justify-between">
                <div className="truncate">
                  <span className="font-mono text-sm inline-block min-w-[200px] !overflow-hidden">
                    {visible ? displayKey : masked}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <div>
                      <button
                        onClick={() => setVisible((v) => !v)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-[#000000]"
                        aria-label={visible ? "Hide API key" : "Show API key"}
                      >
                        <img
                          src={eye}
                          alt="toggle visibility"
                          className="w-[27px] h-[27px] transform hover:scale-110 transition-transform duration-300"
                          draggable="false"
                        />
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => handleCopy(displayKey)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-[#000000]"
                        aria-label="Copy API key"
                      >
                        <img
                          src={copy}
                          alt="copy"
                          className="w-[27px] h-[27px] transform hover:scale-110 transition-transform duration-300"
                          draggable="false"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Mobile buttons - hidden on desktop */}
                  <div className="flex gap-2 sm:hidden">
                    <div>
                      <button
                        onClick={() => setVisible((v) => !v)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                      >
                        {visible ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )}
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={() => handleCopy(displayKey)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                      >
                        <CopyOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCreateModalVisible(true)}
              className="mt-4 bg-[#000000] text-white py-2 w-full rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <img
                src={reload}
                alt="generate new"
                className="w-[13px] h-[13px] transform hover:scale-110 transition-transform duration-300"
                draggable="false"
              />
              Generate New Key
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border p-4 rounded-2xl shadow-md border-[#D9D9D9]">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No API key created yet</p>
              <button
                onClick={() => setIsCreateModalVisible(true)}
                className="bg-[#000000] text-white py-2 px-6 rounded-xl flex items-center justify-center gap-2 text-sm mx-auto"
              >
                <PlusOutlined />
                Create Your First API Key
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined className="text-green-500" />
            <span className="text-lg font-semibold">Create New API Key</span>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width={600}
        closeIcon={
          <CloseOutlined className="text-gray-500 hover:text-gray-700" />
        }
      >
        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Production API Key, Development Key"
              value={newApiKeyData.name}
              onChange={(e) =>
                setNewApiKeyData({ ...newApiKeyData, name: e.target.value })
              }
              size="large"
              className="rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handlePermissionPreset("basic")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition-colors"
              >
                Basic
              </button>
              <button
                onClick={() => handlePermissionPreset("standard")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition-colors"
              >
                Standard
              </button>
              <button
                onClick={() => handlePermissionPreset("full")}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 transition-colors"
              >
                Full Access
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions <span className="text-red-500">*</span>
            </label>
            <Select
              mode="multiple"
              placeholder="Select permissions"
              value={newApiKeyData.permissions}
              onChange={(value) =>
                setNewApiKeyData({ ...newApiKeyData, permissions: value })
              }
              size="large"
              className="w-full rounded-lg"
              optionLabelProp="label"
              listHeight={200}
            >
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <Option key={permission} value={permission} label={permission}>
                  <div className="flex flex-col">
                    <span className="font-medium">{permission}</span>
                    <span className="text-xs text-gray-500">
                      {getPermissionDescription(permission)}
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              {newApiKeyData.permissions.length} permissions selected
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date
            </label>
            <DatePicker
              value={
                newApiKeyData.expiresAt ? dayjs(newApiKeyData.expiresAt) : null
              }
              onChange={(date) =>
                setNewApiKeyData({
                  ...newApiKeyData,
                  expiresAt: date ? date.toISOString() : "",
                })
              }
              format="YYYY-MM-DD"
              placeholder="Select expiration date (optional)"
              className="w-full rounded-lg"
              size="large"
              disabledDate={(current) =>
                current && current < dayjs().endOf("day")
              }
            />
            <p className="text-xs text-gray-500 mt-2">
              If not set, the key will expire in 1 year
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsCreateModalVisible(false)}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateApiKey}
              disabled={
                isCreating ||
                !newApiKeyData.name.trim() ||
                newApiKeyData.permissions.length === 0
              }
              className="flex-1 py-3 px-4 bg-[#000000] text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <ReloadOutlined className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusOutlined />
                  Create API Key
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-green-600">
            <CheckOutlined />
            <span className="text-lg font-semibold">
              API Key Created Successfully!
            </span>
          </div>
        }
        open={showNewKey}
        onCancel={handleCloseNewKeyModal}
        footer={null}
        width={500}
        closeIcon={
          <CloseOutlined className="text-gray-500 hover:text-gray-700" />
        }
      >
        <div className="py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              ⚠️ Important
            </p>
            <p className="text-xs text-yellow-700">
              Make sure to copy your API key now. You won't be able to see it
              again!
            </p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Your API Key:
              </span>
              <button
                onClick={() => handleCopy(newlyCreatedKey)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <CopyOutlined />
                Copy
              </button>
            </div>
            <div className="bg-white border rounded p-3">
              <code className="text-sm font-mono break-all">
                {newlyCreatedKey}
              </code>
            </div>
          </div>

          <button
            onClick={handleCloseNewKeyModal}
            className="w-full py-3 bg-[#000000] text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            I've Saved My API Key
          </button>
        </div>
      </Modal>

      {/* Rest of the sections remain the same */}
      <div className="bg-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Usage Statistics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 flex items-start gap-4 rounded-2xl bg-white border-[#D9D9D9] shadow-md ">
            <div className="p-3 ">
              <img
                src={graph}
                alt="graph"
                className="w-[39px] h-[40px] transform hover:scale-110 transition-transform duration-300"
                draggable="false"
              />
            </div>
            <div>
              <div className="text-xl font-bold">1,234</div>
              <div className="text-xs text-gray-500 mt-1">This Month</div>
            </div>
          </div>

          <div className="rounded-2xl p-5 flex items-start gap-4 border-[#D9D9D9] shadow-md bg-white">
            <div className="p-3">
              <img
                src={mingcute}
                alt="time"
                className="w-[39px] h-[40px] transform hover:scale-110 transition-transform duration-300"
                draggable="false"
              />
            </div>
            <div>
              <div className="text-xl font-bold">156ms</div>
              <div className="text-xs text-gray-500 mt-1">Avg. Response</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Recent Calls</h3>
          <button className="text-[#007AFF] text-base font-bold">
            View All
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center border rounded-xl p-4 bg-white">
            <div>
              <div className="font-medium text-sm">POST /verifications</div>
              <div className="text-xs text-gray-500">October 9, 2025</div>
            </div>
            <span className="bg-[#28A745] text-white px-3 py-1 rounded-lg text-sm">
              Success
            </span>
          </div>

          <div className="flex justify-between items-center border rounded-xl p-4 bg-white">
            <div>
              <div className="font-medium text-sm">
                PUT /verifications/VB-002
              </div>
              <div className="text-xs text-gray-500">October 8, 2025</div>
            </div>
            <span className="bg-[#F41414] text-red-100 px-3 py-1 rounded-lg text-sm">
              Error
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100  p-5 mb-6">
        <h3 className="text-base font-semibold mb-4">Billing & Credits</h3>
        <div className="rounded-2xl bg-white shadow-md border-[#D9D9D9] p-5">
          <div className="mb-3 text-xs text-gray-500">Remaining Credits</div>

          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-500 h-full" style={{ width: "85%" }}></div>
          </div>

          <div className="text-xs text-gray-500 mb-4">
            85,000 / 100,000 • Next Renewal: November 1, 2025
          </div>

          <button className="bg-[#000000] text-white py-2 w-full rounded-xl text-sm">
            Manage Billing
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-2xl shadow-md border-[#D9D9D9] p-5">
        <h3 className="text-base font-semibold mb-3">API Documentation</h3>
        <div className="rounded-2xl shadow-md border-[#D9D9D9] p-5 bg-white">
          <p className="text-xs text-gray-600 mb-4">
            Check out our detailed documentation to integrate the API
          </p>
          <button className="bg-[#000000] text-white py-2 w-full rounded-xl text-sm">
            View Documentation
          </button>
        </div>
      </div>
      
    </div>
  );
}