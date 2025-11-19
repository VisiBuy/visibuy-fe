import React, { useState, useEffect } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  PlusOutlined,
  CloseOutlined,
  CheckOutlined,
  ReloadOutlined,
  EyeOutlined as ViewIcon,
  DeleteOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  message,
  Modal,
  Input,
  Select,
  DatePicker,
  Card,
  Tag,
  Button,
  Space,
} from "antd";
import graph from "../../../public/icons/graph-icon.svg";
import mingcute from "../../../public/icons/mingcute_time-line.svg";
import copy from "../../../public/icons/solar_copy-broken.svg";
import eye from "../../../public/icons/Group.svg";
import reload from "../../../public/icons/reload.svg";
import dayjs from "dayjs";
import {
  useCreateApiKeyMutation,
  useGetApiKeysQuery,
  useDeleteApiKeyMutation,
  useRevokeApiKeyMutation,
} from "@/features/auth/apiKeyApi";
import { ApiKey } from "@/types/apiKey";
import RecentCalls from "./RecentCalls";
import BillingCredits from "./BillingCredits";
import ApiDocumentation from "./ApiDocumentation";
import UsageStatistics from "./UsageStatistics";

const { Option } = Select;
const { confirm } = Modal;

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

export default function ApiPage() {
  const [visible, setVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isViewAllModalVisible, setIsViewAllModalVisible] = useState(false);
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

  const { data: apiKeysResponse, isLoading, refetch } = useGetApiKeysQuery();
  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();
  const [deleteApiKey] = useDeleteApiKeyMutation();
  const [revokeApiKey] = useRevokeApiKeyMutation();

  const apiKeys: ApiKey[] = React.useMemo(() => {
    if (!apiKeysResponse) return [];

    if (Array.isArray(apiKeysResponse)) {
      return apiKeysResponse;
    }

    if (
      apiKeysResponse &&
      typeof apiKeysResponse === "object" &&
      "apiKeys" in apiKeysResponse
    ) {
      return (apiKeysResponse as any).apiKeys || [];
    }

    return [];
  }, [apiKeysResponse]);

  const sortedApiKeys = [...apiKeys].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestApiKey = sortedApiKeys[0];

  const displayKey = latestApiKey?.key || latestApiKey?.id || "";
  const masked = "*".repeat(displayKey.length);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("API key copied to clipboard");
    } catch (e) {
      message.error("Unable to copy to clipboard");
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
        message.success("API key created successfully!");
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

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM D, YYYY");
  };

  const showRevokeConfirm = (apiKey: ApiKey) => {
    confirm({
      title: "Are you sure you want to revoke this API key?",
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently disable the API key "${
        apiKey.name || apiKey.id.substring(0, 8)
      }". Any applications using this key will stop working.`,
      okText: "Yes, Revoke Key",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleRevoke(apiKey.id);
      },
    });
  };

  const showDeleteConfirm = (apiKey: ApiKey) => {
    confirm({
      title: "Are you sure you want to delete this API key?",
      icon: <ExclamationCircleOutlined />,
      content: `This action cannot be undone. The API key "${
        apiKey.name || apiKey.id.substring(0, 8)
      }" will be permanently deleted.`,
      okText: "Yes, Delete Key",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(apiKey.id);
      },
    });
  };

  const handleRevoke = async (apiKeyId: string) => {
    try {
      await revokeApiKey(apiKeyId).unwrap();
      message.success("API key revoked successfully");
      refetch();
    } catch (error: any) {
      console.error("Revoke API Key Error:", error);

      if (error?.data?.message) {
        message.error(`Failed to revoke API key: ${error.data.message}`);
      } else {
        message.error("Failed to revoke API key. Please try again.");
      }
    }
  };

  const handleDelete = async (apiKeyId: string) => {
    try {
      await deleteApiKey(apiKeyId).unwrap();
      message.success("API key deleted successfully");
      refetch();
    } catch (error: any) {
      console.error("Delete API Key Error:", error);

      if (error?.data?.message) {
        message.error(`Failed to delete API key: ${error.data.message}`);
      } else {
        message.error("Failed to delete API key. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white rounded-md p-4 sm:p-6 flex items-center justify-center">
        <LoadingOutlined style={{ fontSize: 48 }} spin />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white rounded-md p-4 sm:p-6">
      <div className="bg-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold">API Key</h2>
          {apiKeys.length > 1 && (
            <button
              onClick={() => setIsViewAllModalVisible(true)}
              className="text-[#007AFF] text-sm font-medium flex items-center gap-1"
            >
              <ViewIcon />
              View All ({apiKeys.length})
            </button>
          )}
        </div>

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

                  {/* Mobile buttons */}
                  <div className="flex gap-2 sm:hidden">
                    <div>
                      <button
                        onClick={() => setVisible((v) => !v)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                      >
                        {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
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

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setIsCreateModalVisible(true)}
                className="flex-1 bg-[#000000] text-white py-2 rounded-xl flex items-center justify-center gap-2 text-sm"
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

      {/* Create api key Modal */}
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

      {/* View created api keys Modal Card !!!  */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ViewIcon />
            <span className="text-lg font-semibold">
              All API Keys ({apiKeys.length})
            </span>
          </div>
        }
        open={isViewAllModalVisible}
        onCancel={() => setIsViewAllModalVisible(false)}
        footer={null}
        width={900}
        closeIcon={
          <CloseOutlined className="text-gray-500 hover:text-gray-700" />
        }
      >
        <div className="py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {sortedApiKeys.map((apiKey) => (
              <Card
                key={apiKey.id}
                className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                size="small"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {apiKey.name ||
                          `API Key ${apiKey.id.substring(0, 8)}...`}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Created {formatDate(apiKey.createdAt)}
                      </p>
                    </div>
                    <Tag
                      color={apiKey.revoked ? "red" : "green"}
                      className="text-xs"
                    >
                      {apiKey.revoked ? "Revoked" : "Active"}
                    </Tag>
                  </div>

                  {/* API Key */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">API Key</p>
                    <div className="bg-gray-50 border rounded px-3 py-2">
                      <code className="text-xs font-mono break-all">
                        {apiKey.key || apiKey.id}
                      </code>
                    </div>
                  </div>

                  {/* Permissions c */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Permissions</p>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.scopes.map((scope: string) => (
                        <Tag key={scope} color="blue" className="text-xs">
                          {scope}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <Space size="small">
                      <Button
                        type="link"
                        size="small"
                        icon={<StopOutlined />}
                        disabled={apiKey.revoked}
                        onClick={() => showRevokeConfirm(apiKey)}
                        className="text-xs"
                      >
                        Revoke
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => showDeleteConfirm(apiKey)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
                    </Space>
                    <Button
                      type="link"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(apiKey.key || apiKey.id)}
                      className="text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {apiKeys.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No API keys found</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Success Modal !!*/}
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

      <UsageStatistics />
      <RecentCalls />
      <BillingCredits />
      <ApiDocumentation />
    </div>
  );
}
