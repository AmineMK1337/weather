"use client";
import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import Head from "next/head";
import { User, Mail, Shield, Camera, Award, Clock } from "lucide-react";

export default function ProfilePage() {
  return (
    <SidebarLayout>
      <Head>
        <title>Profile - Weather App</title>
      </Head>
      <div className="flex-1 flex flex-col p-8 overflow-y-auto gap-8 z-10 w-full max-w-5xl mx-auto">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-text-primary flex items-center gap-3">
              <User className="text-accent-blue" />
              Your Profile
            </h1>
            <p className="text-text-muted mt-1 font-sans">
              Manage your personal information and account security.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-accent-blue text-white font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 text-sm">
            Save Changes
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-8 rounded-[24px] flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-5">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-bg-secondary bg-slate-800">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sazid&backgroundColor=4f8ef7" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <h2 className="text-xl font-display text-text-primary">Sazid M.</h2>
              <p className="text-sm text-text-muted mt-1">Weather Enthusiast</p>
              
              <div className="w-full h-px bg-white/10 my-6" />
              
              <div className="flex justify-around w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-blue-500/10 text-accent-blue mb-2">
                    <Clock size={18} />
                  </div>
                  <p className="text-lg font-mono text-text-primary">124</p>
                  <p className="text-xs text-text-muted">Searches</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-orange-500/10 text-orange-400 mb-2">
                    <Award size={18} />
                  </div>
                  <p className="text-lg font-mono text-text-primary">Pro</p>
                  <p className="text-xs text-text-muted">Status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="card p-8 rounded-[24px]">
              <h3 className="text-lg font-display text-text-primary mb-6 flex items-center gap-2">
                <User size={18} className="text-text-muted" /> Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                  <input type="text" defaultValue="Sazid" className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 text-text-primary focus:outline-none focus:border-accent-blue/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                  <input type="text" defaultValue="M." className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 text-text-primary focus:outline-none focus:border-accent-blue/50 transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input type="email" defaultValue="sazid@example.com" className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-secondary border border-white/5 text-text-primary focus:outline-none focus:border-accent-blue/50 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="card p-8 rounded-[24px]">
              <h3 className="text-lg font-display text-text-primary mb-6 flex items-center gap-2">
                <Shield size={18} className="text-text-muted" /> Security
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-bg-secondary/50">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Password</h4>
                    <p className="text-xs text-text-muted mt-1">Last changed 3 months ago</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-text-primary transition-colors border border-white/10">
                    Change
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-bg-secondary/50">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Two-Factor Authentication</h4>
                    <p className="text-xs text-text-muted mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 text-sm font-medium transition-colors border border-accent-blue/20">
                    Enable
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
