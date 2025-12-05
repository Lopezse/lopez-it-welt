"use client";

import { useEffect, useState } from "react";
import { FaCheck, FaShieldAlt, FaEye, FaEdit, FaBriefcase, FaWrench, FaCheckCircle } from "react-icons/fa";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { WarningBannerSimple } from "@/components/ui/WarningBannerSimple";
import { logger } from "@/lib/logger";

interface RoleTemplate {
  id: string;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  category: string;
  icon: string;
}

interface RoleTemplatesProps {
  onSelectTemplate: (template: RoleTemplate) => void;
  selectedTemplate?: RoleTemplate | null;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  shield: FaShieldAlt,
  eye: FaEye,
  edit: FaEdit,
  briefcase: FaBriefcase,
  wrench: FaWrench,
  "shield-check": FaCheckCircle,
};

export function RoleTemplates({ onSelectTemplate, selectedTemplate }: RoleTemplatesProps) {
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/roles/templates");
      const result = await response.json();

      if (result.success) {
        setTemplates(result.data || []);
      } else {
        setError(result.message || "Fehler beim Laden der Templates");
      }
    } catch (err) {
      logger.error("Fehler beim Laden der Rollen-Templates", err);
      setError("Fehler beim Laden der Templates");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Rollen-Templates
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Wählen Sie ein Template als Vorlage für eine neue Rolle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const IconComponent = iconMap[template.icon] || FaShieldAlt;
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h4>
                </div>
                {isSelected && (
                  <FaCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {template.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  {template.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {template.permissions.length} Berechtigungen
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



