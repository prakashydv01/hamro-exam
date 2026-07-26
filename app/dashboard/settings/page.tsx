"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Monitor, Palette, Type, Globe, Bell, Shield, Eye, Volume2, Languages, ChevronRight } from "lucide-react";

/* ================= TYPES ================= */
type ThemeMode = "light" | "dark" | "system";

type Settings = {
  theme: ThemeMode;
  fontSize: "small" | "medium" | "large";
  language: string;
  notifications: boolean;
  sound: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
};

type SettingsSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
};

/* ================= SETTINGS PAGE ================= */
export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("appearance");
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    fontSize: "medium",
    language: "english",
    notifications: true,
    sound: true,
    reducedMotion: false,
    highContrast: false,
  });

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse settings");
      }
    }
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    if (!mounted) return;

    // Save to localStorage
    localStorage.setItem("app-settings", JSON.stringify(settings));

    // Apply theme to document
    const root = document.documentElement;
    
    if (settings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.toggle("dark", systemTheme === "dark");
    } else {
      root.classList.toggle("dark", settings.theme === "dark");
    }

    // Apply font size
    root.style.fontSize = 
      settings.fontSize === "small" ? "14px" : 
      settings.fontSize === "large" ? "18px" : "16px";

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }
  }, [settings, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || settings.theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [settings.theme, mounted]);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections: SettingsSection[] = [
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      description: "Customize the look and feel of the application",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      icon: Eye,
      description: "Accessibility options for better usability",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Manage your notification preferences",
    },
    {
      id: "language",
      title: "Language & Region",
      icon: Globe,
      description: "Set your preferred language and regional settings",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      description: "Control your privacy and security settings",
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Manage your application preferences and account settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-20">
              <nav className="p-2">
                {sections.map(section => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{section.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 hidden md:block">
                          {section.description}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        isActive ? "rotate-90" : ""
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
              {/* Appearance Section */}
              {activeSection === "appearance" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance Settings
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Theme Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Theme Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: "light", label: "Light", icon: Sun },
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "system", label: "System", icon: Monitor },
                        ].map(option => {
                          const Icon = option.icon;
                          const isSelected = settings.theme === option.value;
                          
                          return (
                            <button
                              key={option.value}
                              onClick={() => updateSetting("theme", option.value as ThemeMode)}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                              }`}
                            >
                              <Icon className={`w-5 h-5 ${
                                isSelected
                                  ? "text-blue-500 dark:text-blue-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`} />
                              <span className={`text-sm font-medium ${
                                isSelected
                                  ? "text-blue-700 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}>
                                {option.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Font Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "small", label: "Small", size: "text-sm" },
                          { value: "medium", label: "Medium", size: "text-base" },
                          { value: "large", label: "Large", size: "text-lg" },
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => updateSetting("fontSize", option.value as "small" | "medium" | "large")}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              settings.fontSize === option.value
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <span className={`block text-center font-medium ${
                              settings.fontSize === option.value
                                ? "text-blue-700 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300"
                            } ${option.size}`}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Accessibility Section */}
              {activeSection === "accessibility" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Accessibility Settings
                  </h2>
                  
                  <div className="space-y-4">
                    {/* High Contrast */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          High Contrast
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <button
                        id="high-contrast"
                        onClick={() => updateSetting("highContrast", !settings.highContrast)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.highContrast ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings.highContrast ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Reduced Motion */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reduced Motion
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Minimize animations and transitions
                        </p>
                      </div>
                      <button
                        id="reduced-motion"
                        onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.reducedMotion ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings.reducedMotion ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Push Notifications */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <label htmlFor="notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Push Notifications
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Receive notifications about test updates and results
                        </p>
                      </div>
                      <button
                        id="notifications"
                        onClick={() => updateSetting("notifications", !settings.notifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings.notifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <label htmlFor="sound" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sound Effects
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Play sounds for notifications and alerts
                        </p>
                      </div>
                      <button
                        id="sound"
                        onClick={() => updateSetting("sound", !settings.sound)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.sound ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            settings.sound ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Section */}
              {activeSection === "language" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Language & Region
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Language Selection */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Display Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting("language", e.target.value)}
                        className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Español</option>
                        <option value="french">Français</option>
                        <option value="german">Deutsch</option>
                        <option value="chinese">中文</option>
                        <option value="hindi">हिन्दी</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your privacy settings and data preferences
                    </p>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                        Data Storage
                      </h3>
                      <p className="text-xs text-yellow-700 dark:text-yellow-500">
                        Your settings are stored locally on your device. No data is sent to servers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset to Defaults */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    if (confirm("Reset all settings to default values?")) {
                      setSettings({
                        theme: "system",
                        fontSize: "medium",
                        language: "english",
                        notifications: true,
                        sound: true,
                        reducedMotion: false,
                        highContrast: false,
                      });
                    }
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}