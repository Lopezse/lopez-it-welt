"use client";

import { useEffect, useState, useRef } from "react";
import { FaUser, FaSignOutAlt, FaShieldAlt, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface UserData {
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role_id: number;
    status: string;
  };
  session: {
    userId: number;
    username: string;
    email: string;
    expiresAt: string;
  };
  roles: string[];
  permissions: string[];
  twoFactor: {
    enabled: boolean;
    required: boolean;
  };
}

export default function UserInfo() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Lade Benutzer-Daten
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserData(data.data);
          }
        }
      } catch (error) {
        console.error("❌ Fehler beim Laden der Benutzer-Daten:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Schließe Menü bei Klick außerhalb
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout-Funktion
  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
      
      if (sessionToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionToken }),
        });
      }

      // Session-Daten löschen
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("sessionToken");

      // Weiterleitung zur Login-Seite
      router.push("/login");
    } catch (error) {
      console.error("❌ Fehler beim Logout:", error);
      // Trotzdem weiterleiten
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="hidden md:block">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  const displayName = `${userData.user.first_name} ${userData.user.last_name}`;
  const roleName = userData.roles[0] || "Benutzer";
  const initials = `${userData.user.first_name.charAt(0)}${userData.user.last_name.charAt(0)}`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-3 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{initials}</span>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">{displayName}</div>
          <div className="text-xs text-gray-500">{roleName}</div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${showMenu ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
          {/* Benutzer-Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{userData.user.email}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center text-xs text-gray-600">
                <FaUser className="w-3 h-3 mr-2" />
                <span>@{userData.user.username}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <FaShieldAlt className={`w-3 h-3 mr-2 ${userData.twoFactor.enabled ? "text-green-500" : "text-gray-400"}`} />
                <span>2FA: {userData.twoFactor.enabled ? "Aktiviert" : "Deaktiviert"}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <FaClock className="w-3 h-3 mr-2" />
                <span>Rolle: {roleName}</span>
              </div>
            </div>
          </div>

          {/* Menü-Optionen */}
          <div className="py-1">
            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/admin/profile");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaUser className="w-4 h-4 mr-2" />
              Mein Konto
            </button>
            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/admin/settings");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaShieldAlt className="w-4 h-4 mr-2" />
              Einstellungen
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
            >
              <FaSignOutAlt className="w-4 h-4 mr-2" />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}







