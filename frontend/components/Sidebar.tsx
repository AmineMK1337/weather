"use client";
import { LayoutDashboard, User, Bell, Compass, Star, Clock, Settings, Power, MapPin } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { icon: LayoutDashboard, path: "/" },
  { icon: User, path: "/profile" },
  { icon: Bell, path: "/notifications" },
  { icon: Compass, path: "/explore" },
  { icon: Star, path: "/saved" },
  { icon: Clock, path: "/history" },
  { icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-16 flex flex-col items-center py-6 gap-2 bg-bg-secondary border-r border-white/5">
      {/* Logo */}
      <Link href="/" className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
        <MapPin className="w-5 h-5 text-white" />
      </Link>

      {/* Nav Icons */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map(({ icon: Icon, path }) => {
          const active = router.pathname === path;
          return (
            <Link
              key={path}
              href={path}
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                active
                  ? "bg-accent-blue/20 text-accent-blue shadow-sm"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-hover"
              )}
            >
              <Icon className="w-4.5 h-4.5" size={18} />
            </Link>
          );
        })}
      </nav>

      {/* Power */}
      <button className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all mt-auto">
        <Power size={18} />
      </button>
    </aside>
  );
}
