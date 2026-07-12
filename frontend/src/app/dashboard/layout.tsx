"use client";

import React from 'react';
import { Building2, FileText, CreditCard, Settings, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const API = "http://localhost:8000";

const NAV = [
  { href: "/dashboard",         label: "Dashboard", icon: Building2 },
  { href: "/dashboard/users",   label: "Users",     icon: Users     },
  { href: "/dashboard/reports", label: "Reports",   icon: FileText  },
  { href: "/dashboard/billing", label: "Billing",   icon: CreditCard },
  { href: "/dashboard/settings",label: "Settings",  icon: Settings  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch(`${API}/api/auth/xero/logout`, { method: 'POST' }).catch(() => {});
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Wealcco</h1>
          <p className="text-sm text-gray-500">Client Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
