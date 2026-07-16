"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Phone, MapPin, Loader2, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

const API = "https://acadmin-seven.vercel.app/";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  is_customer: boolean;
  is_supplier: boolean;
  balance: number;
  city: string;
}

export default function UsersPage() {
  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`${API}/api/users`)
      .then(r => r.json())
      .then(d => setUsers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-500 mt-1">Contacts synced from your Xero account</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Contacts</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.is_customer).length}</p>
          <p className="text-sm text-gray-500 mt-1">Customers</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.is_supplier).length}</p>
          <p className="text-sm text-gray-500 mt-1">Suppliers</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No users found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Phone</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">City</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Type</th>
                <th className="text-right px-6 py-3 text-gray-500 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr
                  key={user.id}
                  onClick={() => setSelected(user)}
                  className="hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.email || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{user.phone || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">{user.city || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {user.is_customer && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Customer</span>
                      )}
                      {user.is_supplier && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Supplier</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    <span className={user.balance > 0 ? "text-green-600" : user.balance < 0 ? "text-red-600" : "text-gray-400"}>
                      £{Number(user.balance).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {selected.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                <div className="flex gap-1 mt-1">
                  {selected.is_customer && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Customer</span>}
                  {selected.is_supplier && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Supplier</span>}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {selected.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selected.email}</span>
                </div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selected.phone}</span>
                </div>
              )}
              {selected.city && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selected.city}</span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Outstanding Balance</p>
              <div className="flex items-center gap-2">
                {selected.balance >= 0
                  ? <TrendingUp className="w-5 h-5 text-green-600" />
                  : <TrendingDown className="w-5 h-5 text-red-600" />
                }
                <span className={`text-2xl font-bold ${selected.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  £{Number(selected.balance).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
