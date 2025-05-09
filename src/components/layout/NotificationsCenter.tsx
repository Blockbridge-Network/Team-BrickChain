"use client";

import { useState } from "react";

const mockNotifications = [
  { id: 1, message: "Your investment in Beachfront Villa is now live!", read: false },
  { id: 2, message: "You received 20 BCT as a reward.", read: false },
  { id: 3, message: "Fractional ownership transfer completed.", read: true },
];

export default function NotificationsCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        className="relative p-2 rounded-full hover:bg-gray-800 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <span className="text-xl text-purple-400">🔔</span>
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
            <span className="font-semibold text-white">Notifications</span>
            <button className="text-xs text-purple-400 hover:underline" onClick={markAllRead}>Mark all as read</button>
          </div>
          <ul className="max-h-64 overflow-y-auto divide-y divide-gray-800">
            {notifications.length === 0 ? (
              <li className="p-4 text-gray-400 text-sm text-center">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li key={n.id} className={`px-4 py-3 text-sm ${n.read ? "text-gray-400" : "text-white font-semibold"}`}>{n.message}</li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
