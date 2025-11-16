"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Bell, 
  AlertTriangle, 
  RefreshCw, 
  Key, 
  Database, 
  Download, 
  Upload,
  Save,
  Check,
  X
} from "lucide-react";

interface SettingsState {
  profile: {
    name: string;
    email: string;
    role: string;
  };
  notifications: {
    emailAlerts: boolean;
    spikeAlerts: boolean;
    competitorAlerts: boolean;
    queryAlerts: boolean;
    digestFrequency: string;
  };
  alerts: {
    spikeThreshold: number;
    competitorImpactLevel: string;
    queryUrgentPriority: boolean;
    autoEscalateHours: number;
  };
  refresh: {
    dashboardInterval: number;
    autoRefresh: boolean;
  };
  api: {
    openaiKey: string;
    webhookUrl: string;
  };
  data: {
    retentionDays: number;
    autoArchive: boolean;
  };
}

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  
  // Load settings from localStorage on mount
  const loadSettings = (): SettingsState => {
    try {
      const saved = localStorage.getItem("brandWatchSettings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    // Default settings
    return {
      profile: {
        name: "John Doe",
        email: "john@example.com",
        role: "analyst",
      },
      notifications: {
        emailAlerts: true,
        spikeAlerts: true,
        competitorAlerts: true,
        queryAlerts: true,
        digestFrequency: "daily",
      },
      alerts: {
        spikeThreshold: 3,
        competitorImpactLevel: "HIGH",
        queryUrgentPriority: true,
        autoEscalateHours: 24,
      },
      refresh: {
        dashboardInterval: 5,
        autoRefresh: true,
      },
      api: {
        openaiKey: "",
        webhookUrl: "",
      },
      data: {
        retentionDays: 90,
        autoArchive: true,
      },
    };
  };

  const [settings, setSettings] = useState<SettingsState>(loadSettings());

  const handleSave = () => {
    // Save to localStorage
    try {
      localStorage.setItem("brandWatchSettings", JSON.stringify(settings));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("settingsUpdated"));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "refresh", label: "Auto-Refresh", icon: RefreshCw },
    { id: "api", label: "API Keys", icon: Key },
    { id: "data", label: "Data Management", icon: Database },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <nav className="space-y-1 rounded-xl border border-slate-200 bg-white p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your account information and preferences
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, name: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, email: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    value={settings.profile.role}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        profile: { ...settings.profile, role: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="analyst" className="text-slate-900">Analyst</option>
                    <option value="manager" className="text-slate-900">Manager</option>
                    <option value="admin" className="text-slate-900">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Configure how and when you receive alerts
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Email Alerts</p>
                    <p className="text-sm text-slate-500">Receive alerts via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailAlerts: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Spike Alerts</p>
                    <p className="text-sm text-slate-500">Alert when mention activity spikes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.spikeAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          spikeAlerts: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Competitor Alerts</p>
                    <p className="text-sm text-slate-500">Alert for high-impact competitor actions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.competitorAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          competitorAlerts: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Query Alerts</p>
                    <p className="text-sm text-slate-500">Alert for urgent queries</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.queryAlerts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          queryAlerts: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Digest Frequency
                  </label>
                  <select
                    value={settings.notifications.digestFrequency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          digestFrequency: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="realtime" className="text-slate-900">Real-time</option>
                    <option value="hourly" className="text-slate-900">Hourly</option>
                    <option value="daily" className="text-slate-900">Daily</option>
                    <option value="weekly" className="text-slate-900">Weekly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Alert Settings */}
          {activeTab === "alerts" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Alert Configuration</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Configure alert thresholds and triggers
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Spike Detection Threshold (multiplier)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={settings.alerts.spikeThreshold}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? 1 : parseFloat(value);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
                        setSettings({
                          ...settings,
                          alerts: {
                            ...settings.alerts,
                            spikeThreshold: numValue,
                          },
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Alert when activity exceeds {settings.alerts.spikeThreshold}x the average
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Competitor Impact Level
                  </label>
                  <select
                    value={settings.alerts.competitorImpactLevel}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          competitorImpactLevel: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="LOW" className="text-slate-900">Low</option>
                    <option value="MEDIUM" className="text-slate-900">Medium</option>
                    <option value="HIGH" className="text-slate-900">High</option>
                    <option value="CRITICAL" className="text-slate-900">Critical</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Minimum impact level to trigger alerts
                  </p>
                </div>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Auto-Escalate Urgent Queries</p>
                    <p className="text-sm text-slate-500">Automatically escalate old queries</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.alerts.queryUrgentPriority}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          queryUrgentPriority: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Auto-Escalate After (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.alerts.autoEscalateHours}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? 1 : parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 168) {
                        setSettings({
                          ...settings,
                          alerts: {
                            ...settings.alerts,
                            autoEscalateHours: numValue,
                          },
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Escalate queries to URGENT after {settings.alerts.autoEscalateHours} hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Auto-Refresh Settings */}
          {activeTab === "refresh" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Auto-Refresh Settings</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Configure automatic data refresh intervals
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Enable Auto-Refresh</p>
                    <p className="text-sm text-slate-500">Automatically refresh dashboard data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.refresh.autoRefresh}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        refresh: {
                          ...settings.refresh,
                          autoRefresh: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Dashboard Refresh Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.refresh.dashboardInterval}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? 1 : parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 1 && numValue <= 60) {
                        setSettings({
                          ...settings,
                          refresh: {
                            ...settings.refresh,
                            dashboardInterval: numValue,
                          },
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Dashboard will refresh every {settings.refresh.dashboardInterval} minutes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Settings */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">API Configuration</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage API keys and integrations
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settings.api.openaiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        api: { ...settings.api, openaiKey: e.target.value },
                      })
                    }
                    placeholder="sk-..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Used for advanced sentiment analysis. Leave empty to use keyword-based fallback.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={settings.api.webhookUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        api: { ...settings.api, webhookUrl: e.target.value },
                      })
                    }
                    placeholder="https://example.com/webhook"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Receive real-time alerts via webhook
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Settings */}
          {activeTab === "data" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Data Management</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Configure data retention and archival
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Data Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={settings.data.retentionDays}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === "" ? 7 : parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 7 && numValue <= 365) {
                        setSettings({
                          ...settings,
                          data: {
                            ...settings.data,
                            retentionDays: numValue,
                          },
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Data older than {settings.data.retentionDays} days will be archived
                  </p>
                </div>

                <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">Auto-Archive</p>
                    <p className="text-sm text-slate-500">Automatically archive old data</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.data.autoArchive}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        data: {
                          ...settings.data,
                          autoArchive: e.target.checked,
                        },
                      })
                    }
                    className="h-5 w-5 rounded border-slate-300"
                  />
                </label>

                <div className="flex gap-3 pt-4">
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Download size={16} />
                    Export Data
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Upload size={16} />
                    Import Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
            {saved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Check size={16} />
                Settings saved
              </div>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

