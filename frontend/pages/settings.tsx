"use client";
import React, { useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import Head from "next/head";
import { Settings, Moon, Sun, BellRing, Map, Thermometer } from "lucide-react";
import clsx from "clsx";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [unit, setUnit] = useState("C");
  const [notifications, setNotifications] = useState(true);

  return (
    <SidebarLayout>
      <Head>
        <title>Settings - Weather App</title>
      </Head>
      <div className="flex-1 flex flex-col p-8 overflow-y-auto gap-8 z-10 w-full max-w-4xl mx-auto">
        <header className="flex items-center justify-between pb-6 border-b border-white/5">
          <div>
            <h1 className="font-display text-3xl text-text-primary flex items-center gap-3">
              <Settings className="text-accent-blue" />
              Settings
            </h1>
            <p className="text-text-muted mt-1 font-sans">
              Customize your app experience.
            </p>
          </div>
        </header>

        <div className="space-y-6">
          
          {/* Appearance Section */}
          <section className="card p-8 rounded-[24px]">
            <div className="mb-6">
              <h2 className="text-xl font-display text-text-primary mb-1">Appearance</h2>
              <p className="text-sm text-text-muted">Choose your preferred lighting mode.</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setTheme("dark")} 
                className={clsx(
                  "flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all",
                  theme === "dark" ? "border-accent-blue bg-accent-blue/10" : "border-white/10 bg-bg-secondary hover:bg-white/5"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-inner">
                  <Moon size={20} className="text-blue-400" />
                </div>
                <span className="font-medium text-sm text-text-primary">Dark Mode</span>
              </button>
              
              <button 
                onClick={() => setTheme("light")} 
                className={clsx(
                  "flex-1 p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all",
                  theme === "light" ? "border-accent-blue bg-accent-blue/10" : "border-white/10 bg-bg-secondary hover:bg-white/5"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow-inner">
                  <Sun size={20} className="text-orange-500" />
                </div>
                <span className="font-medium text-sm text-text-primary">Light Mode</span>
              </button>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="card p-8 rounded-[24px]">
            <div className="mb-6">
              <h2 className="text-xl font-display text-text-primary mb-1">Preferences</h2>
              <p className="text-sm text-text-muted">Set up defaults for a better experience.</p>
            </div>
            
            <div className="space-y-4">
              {/* Temp Units */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Thermometer size={18} className="text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-text-primary">Temperature Unit</h3>
                    <p className="text-xs text-text-muted mt-0.5">Choose Celsius or Fahrenheit natively</p>
                  </div>
                </div>
                <div className="flex bg-bg-card border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setUnit("C")} 
                    className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-all", unit === "C" ? "bg-accent-blue text-white shadow-md" : "text-text-muted hover:text-text-secondary")}
                  >°C</button>
                  <button 
                    onClick={() => setUnit("F")} 
                    className={clsx("px-4 py-1.5 rounded-lg text-sm font-medium transition-all", unit === "F" ? "bg-accent-blue text-white shadow-md" : "text-text-muted hover:text-text-secondary")}
                  >°F</button>
                </div>
              </div>

              {/* Default Location */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Map size={18} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-text-primary">Default Location</h3>
                    <p className="text-xs text-text-muted mt-0.5">Which city loads explicitly on launch</p>
                  </div>
                </div>
                <input 
                  type="text" 
                  defaultValue="Florida, US" 
                  className="px-4 py-2 rounded-xl bg-bg-card border border-white/10 text-sm text-text-primary text-right focus:outline-none focus:border-accent-blue/50 w-40" 
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <BellRing size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-text-primary">Push Alerts</h3>
                    <p className="text-xs text-text-muted mt-0.5">Get notified about extreme weather events</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)} 
                  className={clsx(
                    "w-12 h-6 rounded-full p-1 transition-colors relative", 
                    notifications ? "bg-accent-blue" : "bg-white/20"
                  )}
                >
                  <div className={clsx(
                    "w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm",
                    notifications ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="card p-8 rounded-[24px] border border-red-500/20 bg-gradient-to-b from-bg-card to-red-500/5">
            <h2 className="text-xl font-display text-red-400 mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm text-text-primary">Delete All Data</h3>
                <p className="text-xs text-text-muted mt-1 max-w-sm">
                  Permanently remove your saved locations, search history, and account preferences. This cannot be undone.
                </p>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 font-medium text-sm transition-all">
                Delete Account
              </button>
            </div>
          </section>

        </div>
      </div>
    </SidebarLayout>
  );
}
