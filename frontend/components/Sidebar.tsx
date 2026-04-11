"use client";
import { LayoutDashboard, User, Bell, Compass, Star, Clock, Settings, Power, MapPin } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, active: true },
  { icon: User },
  { icon: Bell },
  { icon: Compass },
  { icon: Star },
  { icon: Clock },
  { icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-16 flex flex-col items-center py-6 gap-2 bg-bg-secondary border-r border-white/5">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
        <MapPin className="w-5 h-5 text-white" />
      </div>

      {/* Nav Icons */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ icon: Icon, active }, i) => (
          <button
            key={i}
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              active
                ? "bg-accent-blue/20 text-accent-blue shadow-sm"
                : "text-text-muted hover:text-text-secondary hover:bg-bg-hover"
            )}
          >
            <Icon className="w-4.5 h-4.5" size={18} />
          </button>
        ))}
      </nav>

      {/* Power */}
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all mt-auto">
        <Power size={18} />
      </button>
    </aside>
  );
}
