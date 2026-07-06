"use client";

import React, { useState } from 'react';
import { 
  FileText, Link2, Download, Filter, Search, CheckCircle2 
} from 'lucide-react';

export default function ReportsPage() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectXero = () => {
    // Redirect to the Python backend OAuth URL
    window.location.href = 'http://localhost:8000/api/auth/xero/login';
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Financial Reports</h2>
        <p className="text-gray-500 mt-1">Generate and download detailed financial reports for your firm.</p>
      </header>
      
      {!isConnected ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-16">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Link2 className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect your accounting software</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            To view and generate reports, please securely connect your Xero account. We only request read-only access to your financial data.
          </p>
          <button 
            onClick={handleConnectXero}
            className="bg-[#13b5ea] hover:bg-[#10a1d1] text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm text-lg"
          >
            Connect Xero
          </button>
          <p className="text-xs text-gray-400 mt-6">
            Secure connection via OAuth 2.0. We never store your Xero password.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center mb-8">
             <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
             <span className="text-green-800 font-medium">Successfully connected to Xero (Demo Company Ltd). Data is syncing.</span>
           </div>

           <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div className="relative">
               <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search reports..." 
                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
               />
             </div>
             <button className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
               <Filter className="w-4 h-4" />
               <span>Filter</span>
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ReportCard 
               title="Profit & Loss" 
               description="Detailed breakdown of your revenue and expenses."
               date="Last synced: Today, 10:30 AM"
             />
             <ReportCard 
               title="Balance Sheet" 
               description="Snapshot of your assets, liabilities, and equity."
               date="Last synced: Today, 10:30 AM"
             />
             <ReportCard 
               title="Aged Receivables" 
               description="Summary of outstanding invoices owed to you."
               date="Last synced: Today, 10:30 AM"
             />
             <ReportCard 
               title="Aged Payables" 
               description="Summary of bills and expenses you owe."
               date="Last synced: Today, 10:30 AM"
             />
           </div>
        </div>
      )}
    </div>
  );
}

function ReportCard({ title, description, date }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <button className="text-gray-400 hover:text-blue-600 transition" title="Download PDF">
          <Download className="w-5 h-5" />
        </button>
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
}
