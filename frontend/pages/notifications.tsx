"use client";
import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import Head from "next/head";
import { Bell, ShieldAlert, CloudLightning, Info, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Heavy Rain Alert",
    message: "Expect heavy rainfall incoming around 4:00 PM today. Don't forget your umbrella!",
    time: "2 hours ago",
    type: "warning",
    icon: CloudLightning,
    read: false,
  },
  {
    id: 2,
    title: "Weekend Forecast Ready",
    message: "Your personalized weekend weather report for Florida is now available. Looks like a sunny weekend ahead.",
    time: "5 hours ago",
    type: "info",
    icon: Info,
    read: false,
  },
  {
    id: 3,
    title: "Server Maintenance Completed",
    message: "The backend services have been updated successfully. Enjoy faster forecast fetching.",
    time: "1 day ago",
    type: "success",
    icon: CheckCircle2,
    read: true,
  },
  {
    id: 4,
    title: "Extreme UV Index Warning",
    message: "UV index in Canberra is dangerously high right now (11+). Limit sun exposure between 10 AM and 4 PM.",
    time: "2 days ago",
    type: "critical",
    icon: ShieldAlert,
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <SidebarLayout>
      <Head>
        <title>Notifications - Weather App</title>
      </Head>
      <div className="flex-1 flex flex-col p-8 overflow-y-auto gap-6 z-10 w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between pb-6 border-b border-white/5">
          <div>
            <h1 className="font-display text-3xl text-text-primary flex items-center gap-3">
              <Bell className="text-accent-blue" />
              Notifications
            </h1>
            <p className="text-text-muted mt-1 font-sans">
              Stay updated with weather alerts and system updates.
            </p>
          </div>
          <button className="text-sm text-accent-blue hover:text-blue-400 transition-colors font-medium">
            Mark all as read
          </button>
        </header>

        <div className="flex flex-col gap-3">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className={clsx(
                "p-5 rounded-2xl flex gap-4 transition-all relative overflow-hidden group border",
                notif.read 
                  ? "bg-bg-card/50 border-transparent hover:bg-bg-hover" 
                  : "bg-bg-card border-white/10 hover:border-white/20 shadow-lg"
              )}
            >
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue" />
              )}
              
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                notif.type === "warning" && "bg-orange-500/20 text-orange-400",
                notif.type === "info" && "bg-blue-500/20 text-blue-400",
                notif.type === "success" && "bg-green-500/20 text-green-400",
                notif.type === "critical" && "bg-red-500/20 text-red-400"
              )}>
                <notif.icon size={22} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={clsx(
                    "text-base font-sans font-semibold",
                    notif.read ? "text-text-secondary" : "text-text-primary"
                  )}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-text-muted whitespace-nowrap ml-4 mt-1 font-mono">
                    {notif.time}
                  </span>
                </div>
                <p className={clsx(
                  "text-sm leading-relaxed",
                  notif.read ? "text-text-muted" : "text-text-secondary"
                )}>
                  {notif.message}
                </p>
              </div>
            </div>
          ))}

          {/* Empty state backup */}
          {MOCK_NOTIFICATIONS.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Bell size={24} className="text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary">You're all caught up!</h3>
              <p className="text-text-muted text-sm mt-1">No new notifications at this time.</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
