'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, X, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DataTableProps {
  tableName: string;
  onClose: () => void;
}

export default function DataTable({ tableName, onClose }: DataTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const limit = 10;

  useEffect(() => {
    fetchSchema();
    fetchData();
  }, [tableName, page, search]);

  const fetchSchema = async () => {
    try {
      const response = await fetch(`/api/schema?table=${tableName}`);
      const result = await response.json();
      setColumns(result.columns || []);
    } catch (error) {
      toast.error('Failed to fetch schema');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/data?table=${tableName}&limit=${limit}&offset=${page * limit}&search=${search}`
      );
      const result = await response.json();
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRow(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (row: any) => {
    setEditingRow(row);
    setFormData(row);
    setShowModal(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm('Delete this record?')) return;

    const primaryKey = columns.find((col) => col.column_name.includes('id'))?.column_name;
    const id = row[primaryKey];

    try {
      const response = await fetch(`/api/data?table=${tableName}&id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingRow ? 'PUT' : 'POST';
      const primaryKey = columns.find((col) => col.column_name.includes('id'))?.column_name;
      const id = editingRow ? editingRow[primaryKey] : null;
      const url = editingRow ? `/api/data?table=${tableName}&id=${id}` : `/api/data?table=${tableName}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`${editingRow ? 'Updated' : 'Created'} successfully`);
        setShowModal(false);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: 'white',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '12px 16px',
        },
      }} />

      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-light text-gray-900 capitalize">
                  {tableName.replace('mast_', '').replace('_', ' ')}
                </h1>
                <p className="text-sm text-gray-500 font-light">{total} records</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-light"
            >
              <Plus size={18} />
              Add New
            </button>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-light"
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.column_name}
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.column_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 font-light">
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-400 font-light">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      {columns.map((col) => (
                        <td key={col.column_name} className="px-6 py-4 text-sm text-gray-700 font-light">
                          {row[col.column_name]?.toString() || '-'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500 font-light">
            Page {page + 1} of {totalPages} • Showing {page * limit + 1}-{Math.min((page + 1) * limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-2xl font-light text-gray-900">
                {editingRow ? 'Edit Record' : 'New Record'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {columns
                  .filter((col) => !col.column_default?.includes('nextval'))
                  .map((col) => (
                    <div key={col.column_name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {col.column_name}
                      </label>
                      <input
                        type="text"
                        value={formData[col.column_name] || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [col.column_name]: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-light"
                      />
                    </div>
                  ))}
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-light"
                >
                  {editingRow ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
