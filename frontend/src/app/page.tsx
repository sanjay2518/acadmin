"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, BarChart3, FileText, Shield } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://acadmin-seven.vercel.app";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If already connected, go straight to dashboard
    fetch(`${API}/api/auth/xero/status`)
      .then(r => r.json())
      .then(d => { if (d.connected) router.replace("/dashboard"); })
      .finally(() => setChecking(false));
  }, []);

  if (checking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wealcco</h1>
        <p className="text-gray-500 mb-8">Client Portal — Connect your Xero account to get started</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-xl">
            <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Live Dashboard</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Reports</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Secure OAuth</p>
          </div>
        </div>

        <a
          href={`${API}/api/auth/xero/login`}
          className="block w-full bg-[#13b5ea] hover:bg-[#10a1d1] text-white font-semibold py-3 px-6 rounded-xl transition shadow-sm text-lg"
        >
          Connect with Xero
        </a>

        <p className="text-xs text-gray-400 mt-4">
          Secure connection via OAuth 2.0 · Read-only access · We never store your password
        </p>
      </div>
    </div>
  );
}
