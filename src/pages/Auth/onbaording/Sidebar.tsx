import React from "react";
import {
  UserOutlined,
  ShopOutlined,
  CarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import clsx from "clsx";

interface SidebarProps {
  currentStep: number;
  setCurrentStep: (index: number) => void;
}

const sidebarItems = [
  { title: "Personal Information", icon: <UserOutlined /> },
  { title: "Business Information", icon: <ShopOutlined /> },
  { title: "Create Rider", icon: <CarOutlined /> },
  { title: "Setup your store front", icon: <ShoppingCartOutlined /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentStep, setCurrentStep }) => {
  return (
    <div className="w-72 bg-white border-r flex flex-col py-8">
      <ul className="space-y-3">
        {sidebarItems.map((item, index) => (
          <li
            key={index}
            onClick={() => setCurrentStep(index)}
            className={clsx(
              "flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer transition-all duration-200",
              currentStep === index
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
