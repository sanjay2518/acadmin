"use client";

import React, { useState } from "react";
import { Bell, Check, Globe2, Save, User } from "lucide-react";

export default function SettingsPage() {
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("admin_settings", JSON.stringify({ currency, timezone, notifications }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account and workspace preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600"><User className="w-5 h-5" /></div>
          <div><h3 className="text-lg font-semibold text-gray-900">Admin account</h3><p className="text-sm text-gray-500">Your administrator profile</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label><input value="Nikhil" readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input value="nikhil@wealcco.com" readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700" /></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><Globe2 className="w-5 h-5" /></div>
          <div><h3 className="text-lg font-semibold text-gray-900">Workspace preferences</h3><p className="text-sm text-gray-500">Set how information appears in the portal</p></div>
        </div>
        <div className="space-y-5">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label><select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"><option value="INR">Indian Rupee (₹)</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label><select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"><option value="Asia/Kolkata">India Standard Time (IST)</option><option value="UTC">Coordinated Universal Time (UTC)</option></select></div>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition"><span className="flex items-center gap-3"><Bell className="w-5 h-5 text-gray-500" /><span><span className="block text-sm font-medium text-gray-800">Email notifications</span><span className="block text-xs text-gray-500 mt-0.5">Receive updates about client activity</span></span></span><input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="w-4 h-4 accent-blue-600" /></label>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100"><span className={`text-sm text-green-600 transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}><Check className="inline w-4 h-4 mr-1" />Saved</span><button onClick={saveSettings} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"><Save className="w-4 h-4" />Save changes</button></div>
      </div>
    </div>
  );
}
