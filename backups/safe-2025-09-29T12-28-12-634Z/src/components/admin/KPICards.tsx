"use client";

import React from "react";
import { FaChartLine, FaClock, FaExclamationTriangle, FaProjectDiagram } from "react-icons/fa";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  color,
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-gruen";
      case "negative":
        return "text-rot";
      default:
        return "text-hellgrau";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return "↗";
      case "negative":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <div className="backdrop-blur-xl bg-weiss/10 rounded-2xl border border-weiss/20 p-6 shadow-2xl hover:bg-weiss/20 transition-all duration-500 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-hellgrau">{title}</p>
          <p className="text-2xl font-bold text-weiss mt-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${getChangeColor()}`}>
              {getChangeIcon()} {change}
            </p>
          )}
        </div>
        <div className={`relative p-3 rounded-xl ${color} shadow-lg`}>
          {icon}
          <div className="absolute -inset-1 bg-gradient-to-r from-weiss/20 to-transparent rounded-xl blur opacity-25 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

interface KPICardsProps {
  stats?: {
    totalSessions?: number;
    activeSessions?: number;
    totalTime?: number;
    todayTime?: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ stats }) => {
  const defaultStats = {
    totalSessions: 0,
    activeSessions: 0,
    totalTime: 0,
    todayTime: 0,
  };

  const currentStats = { ...defaultStats, ...stats };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        title="Gesamte Sessions"
        value={currentStats.totalSessions}
        change="+12%"
        changeType="positive"
        icon={<FaClock className="h-6 w-6 text-weiss" />}
        color="bg-gradient-to-r from-hauptblau to-akzentblau"
      />

      <KPICard
        title="Aktive Sessions"
        value={currentStats.activeSessions}
        change="+5%"
        changeType="positive"
        icon={<FaProjectDiagram className="h-6 w-6 text-weiss" />}
        color="bg-gradient-to-r from-gruen to-akzentblau"
      />

      <KPICard
        title="Gesamtzeit (Std)"
        value={Math.round(currentStats.totalTime / 60)}
        change="+8%"
        changeType="positive"
        icon={<FaChartLine className="h-6 w-6 text-weiss" />}
        color="bg-gradient-to-r from-gelb to-orange"
      />

      <KPICard
        title="Heute (Min)"
        value={currentStats.todayTime}
        change="-3%"
        changeType="negative"
        icon={<FaExclamationTriangle className="h-6 w-6 text-weiss" />}
        color="bg-gradient-to-r from-rot to-orange"
      />
    </div>
  );
};

export default KPICards;
