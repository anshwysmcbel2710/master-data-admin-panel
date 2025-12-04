'use client';

import { useState } from 'react';
import { masterTables } from '@/lib/tables';
import DataTable from '@/components/DataTable';
import { Database, Sparkles } from 'lucide-react';

export default function Home() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  if (selectedTable) {
    return <DataTable tableName={selectedTable} onClose={() => setSelectedTable(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Database className="text-blue-600" size={40} strokeWidth={1.5} />
                <Sparkles className="absolute -top-1 -right-1 text-amber-400" size={16} />
              </div>
              <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">Master Tables</h1>
                <p className="text-sm text-gray-500 font-light mt-0.5">Centralized data management</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-light text-blue-600">{masterTables.length}</div>
                <div className="text-xs text-gray-500 font-light">Tables</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-green-600">31</div>
                <div className="text-xs text-gray-500 font-light">Active</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Categories */}
        <div className="space-y-12">
          {/* Geographic Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-light text-gray-800 mb-1">Geographic Data</h2>
              <div className="h-px w-24 bg-gradient-to-r from-blue-400 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {masterTables.filter(t => ['mast_country', 'mast_region', 'mast_state', 'mast_district', 'mast_pincode', 'mast_place'].includes(t.name)).map((table) => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{table.icon}</div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{table.label}</h3>
                  <p className="text-xs text-gray-400 font-light">{table.name}</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
                </button>
              ))}
            </div>
          </section>

          {/* Master Data Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-light text-gray-800 mb-1">Master Data</h2>
              <div className="h-px w-24 bg-gradient-to-r from-purple-400 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {masterTables.filter(t => !['mast_country', 'mast_region', 'mast_state', 'mast_district', 'mast_pincode', 'mast_place', 'users', 'user_template'].includes(t.name)).map((table) => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{table.icon}</div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{table.label}</h3>
                  <p className="text-xs text-gray-400 font-light">{table.name}</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
                </button>
              ))}
            </div>
          </section>

          {/* User Management Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-light text-gray-800 mb-1">User Management</h2>
              <div className="h-px w-24 bg-gradient-to-r from-emerald-400 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {masterTables.filter(t => ['users', 'user_template'].includes(t.name)).map((table) => (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{table.icon}</div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{table.label}</h3>
                  <p className="text-xs text-gray-400 font-light">{table.name}</p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 pb-8 text-center">
        <p className="text-sm text-gray-400 font-light"> 2025 Master Table System</p>
      </footer>
    </div>
  );
}
