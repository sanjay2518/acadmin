"use client";

import React from 'react';
import Pricing from '@/components/Pricing';

export default function BillingPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Billing & Plans</h2>
        <p className="text-gray-500 mt-1">Manage your subscription and billing details.</p>
      </header>
      
      <div className="-mx-8">
        <Pricing />
      </div>
    </div>
  );
}
