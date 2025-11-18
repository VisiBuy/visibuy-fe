import React, { useState } from "react";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ReloadOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Tooltip, message } from "antd";
import graph from "../../public/icons/graph-icon.svg";
import mingcute from "../../public/icons/mingcute_time-line.svg";
import copy from "../../public/icons/solar_copy-broken.svg";
import eye from "../../public/icons/Group.svg";
import reload from "../../public/icons/reload.svg";

const API_PLACEHOLDER = "1234-5678-9012-3456";

export default function ApiPage(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [apiKey] = useState(API_PLACEHOLDER);

  const masked = "*".repeat(apiKey.length);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      message.success("API key copied");
    } catch (e) {
      message.error("Unable to copy");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white rounded-md p-4 sm:p-6">
      <div className="bg-gray-100  p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">API Key</h2>

        <div className="bg-gray-50 border p-4 rounded-2xl shadow-md border-[#D9D9D9]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="bg-white border rounded-lg px-4 py-3 w-full text-sm tracking-wide text-gray-700 select-text flex items-center justify-between">
              <div className="truncate">
                <span className="font-mono text-sm inline-block min-w-[200px] !overflow-hidden">
                  {visible ? apiKey : masked}
                </span>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="div">
                    <button
                      onClick={() => setVisible((v) => !v)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition text-[#000000]"
                      aria-label={visible ? "Hide API key" : "Show API key"}
                    >
                      {visible ? (
                        // <Eye  className="text-[27px] !font-light" />
                        <img
                          src={eye}
                          alt="lock"
                          className="w-[27px] h-[27px] transform hover:scale-110 transition-transform duration-300"
                          draggable="false"
                        />
                      ) : (
                        //  <Eye className="text-[27px] !font-light" />
                        <img
                          src={eye}
                          alt="lock"
                          className="w-[27px] h-[27px] transform hover:scale-110 transition-transform duration-300"
                          draggable="false"
                        />
                      )}
                    </button>
                  </div>
                  <div className="div">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-gray-100 transition text-[#000000]"
                      aria-label="Copy API key"
                    >
                      <img
                        src={copy}
                        alt="lock"
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
                        <EyeInvisibleOutlined className="text-[]" />
                      ) : (
                        <EyeOutlined className="" />
                      )}
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
                    >
                      <CopyOutlined />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-4 bg-[#000000] text-white py-2 w-full rounded-xl flex items-center justify-center gap-2 text-sm">
            {/* <ReloadOutlined /> */}
             <img
                          src={reload}
                          alt="lock"
                          className="w-[13px] h-[13px] transform hover:scale-110 transition-transform duration-300"
                          draggable="false"
                        />
             Generate New Key
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Usage Statistics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 flex items-start gap-4 rounded-2xl bg-white border-[#D9D9D9] shadow-md ">
            <div className="p-3 ">
              <img
                src={graph}
                alt="lock"
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
                alt="lock"
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
