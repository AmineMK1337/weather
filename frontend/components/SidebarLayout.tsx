"use client";
import Sidebar from "./Sidebar";
import React from "react";
import PmAcceleratorFooter from "./PmAcceleratorFooter";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
        <PmAcceleratorFooter />
      </div>
    </div>
  );
}
