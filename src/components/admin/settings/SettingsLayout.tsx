"use client";

import { useState } from "react";
import {
  FaUser,
  FaShieldAlt,
  FaBuilding,
  FaRobot,
  FaBell,
  FaCog,
} from "react-icons/fa";

interface SettingsLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "profile", label: "Benutzerprofil", icon: FaUser },
  { id: "security", label: "Sicherheit & Account", icon: FaShieldAlt },
  { id: "company", label: "Unternehmen & Branding", icon: FaBuilding },
  { id: "ai", label: "KI-Einstellungen", icon: FaRobot },
  { id: "notifications", label: "Benachrichtigungen", icon: FaBell },
  { id: "system", label: "System", icon: FaCog },
];

export function SettingsLayout({ children, activeTab, onTabChange }: SettingsLayoutProps) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#050509" }}>
      {/* Tab-Navigation (IBM Carbon Style) */}
      <div className="border-b" style={{ backgroundColor: "#111217", borderColor: "#272a33" }}>
        <div className="px-6">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:ring-offset-2 focus:ring-offset-[#111217]"
                  style={{
                    borderBottomColor: isActive ? "#c99700" : "transparent",
                    color: isActive ? "#c99700" : "#b3b3b3",
                    backgroundColor: isActive ? "#1f2329" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#1f2329";
                      e.currentTarget.style.color = "#f4f4f4";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#b3b3b3";
                    }
                  }}
                >
                  <Icon style={{ width: "20px", height: "20px" }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content-Bereich */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}

