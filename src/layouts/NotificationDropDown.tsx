"use client"

import React, { useState, useRef, useEffect } from "react"
import { FiBell, FiCheck, FiInfo, FiAlertTriangle } from "react-icons/fi"

const mockNotifications = [
  {
    id: "n1",
    text: "John requested a MacBook Pro replacement",
    type: "pending",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: "n2",
    text: "Dell UltraSharp Monitor assigned to Alice",
    type: "active",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "n3",
    text: "HP LaserJet maintenance complete",
    type: "maintenance",
    time: "Yesterday",
    unread: false,
  },
]

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "pending": return <FiAlertTriangle className="text-amber-500" size={16} />
      case "active": return <FiCheck className="text-green-500" size={16} />
      default: return <FiInfo className="text-blue-500" size={16} />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-100"
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-900 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 flex gap-3 items-start transition-colors hover:bg-slate-50/70 ${
                    item.unread ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="p-1.5 bg-white border border-slate-100 rounded-lg shadow-2xs shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className={`text-xs text-slate-700 leading-normal ${item.unread ? "font-medium text-slate-900" : ""}`}>
                      {item.text}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                All clear! No notifications found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}