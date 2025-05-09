"use client";

import { useState } from "react";
import Toast from "../../components/ui/Toast";

export default function Settings() {
  const [email, setEmail] = useState("user@email.com");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast({ message: "Settings saved!", type: "success" });
      setTimeout(() => setToast(null), 2000);
    }, 1000);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mt-6 relative">
      <h2 className="text-xl font-bold text-white mb-4">Settings & Preferences</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="notifications"
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            className="accent-purple-600"
          />
          <label htmlFor="notifications" className="text-gray-400 text-sm">Enable email notifications</label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
