'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface DataTableProps {
  tableName: string;
  onClose: () => void;
}

type RowData = Record<string, any>;

type ColumnSchema = {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
};

// Detect primary key correctly (auto-id or *_code)
function getSchemaPrimaryKey(columns: ColumnSchema[]) {
  const pk = columns.find((c) => c.column_default?.includes('nextval'));
  if (pk) return pk.column_name;
  const codePk = columns.find((c) => c.column_name.toLowerCase().endsWith('_code'));
  if (codePk) return codePk.column_name;
  return columns[0]?.column_name ?? null;
}

export default function DataTable({ tableName, onClose }: DataTableProps) {
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<ColumnSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<RowData | null>(null);
  const [formData, setFormData] = useState<RowData>({});
  const limit = 10;

  const primaryKey = getSchemaPrimaryKey(columns);

  useEffect(() => {
    fetchSchema();
  }, [tableName]);

  useEffect(() => {
    fetchData();
  }, [tableName, page, search]);

  const fetchSchema = async () => {
    try {
      const response = await fetch(`/api/schema?table=${tableName}`);
      const result = await response.json();
      setColumns(result.columns || []);
    } catch {
      toast.error('Failed to fetch schema');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/data?table=${tableName}&limit=${limit}&offset=${
          page * limit
        }&search=${encodeURIComponent(search)}`
      );
      const result = await response.json();
      setData(result.data || []);
      setTotal(result.total || 0);
    } catch {
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

  const handleEdit = (row: RowData) => {
    setEditingRow(row);
    setFormData(row);
    setShowModal(true);
  };

  const handleDelete = async (row: RowData) => {
    if (!primaryKey) return toast.error('Cannot detect PK');
    if (!confirm('Delete this record?')) return;

    const value = row[primaryKey];

    try {
      const response = await fetch(
        `/api/data?table=${tableName}&id=${encodeURIComponent(String(value))}`,
        { method: 'DELETE' }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Deleted');
        fetchData();
      } else toast.error(result.error || 'Cannot delete');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEdit = !!editingRow;
    const url = isEdit
      ? `/api/data?table=${tableName}&id=${encodeURIComponent(
          String(editingRow?.[primaryKey!])
        )}`
      : `/api/data?table=${tableName}`;

    // Convert numeric fields safely
    const converted: RowData = {};
    columns.forEach((c) => {
      let v = formData[c.column_name];
      if (
        ['integer', 'bigint', 'smallint', 'smallserial', 'serial'].includes(
          c.data_type
        )
      ) {
        v = v === '' || v === null || v === undefined ? null : Number(v);
      }
      converted[c.column_name] = v;
    });

    try {
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(converted),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success(isEdit ? 'Updated' : 'Created');
        setShowModal(false);
        setEditingRow(null);
        setFormData({});
        fetchData();
      } else toast.error(result.error || 'Operation failed');
    } catch {
      toast.error('Operation failed');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* HEADER */}
      <header className="bg-white sticky top-0 border-b p-4 flex justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded bg-gray-100">
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-medium capitalize">
            {tableName.replace('mast_', '')}
          </h1>
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">
          <Plus size={18} /> Add
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search..."
            className="w-full pl-10 border p-2 rounded"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="p-4">
        <div className="border rounded overflow-x-auto bg-white">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Actions</th>
                {columns.map((c) => (
                  <th key={c.column_name} className="p-2">
                    {c.column_name.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-4 text-center">
                    No Data
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-2 flex gap-2">
                      <button onClick={() => handleEdit(row)} className="text-blue-600">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(row)} className="text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                    {columns.map((c) => (
                      <td key={`${c.column_name}-${idx}`} className="p-2">
                        {row[c.column_name] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-3 flex justify-between">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft />
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-xl mb-4">{editingRow ? 'Edit' : 'Add'} Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {columns.map((c) => {
                  const isNumeric = [
                    'integer',
                    'bigint',
                    'smallint',
                    'smallserial',
                    'serial',
                  ].includes(c.data_type);

                  return (
                    <div key={c.column_name}>
                      <label className="text-sm">
                        {c.column_name}
                        <input
                          type={isNumeric ? 'number' : 'text'}
                          value={formData[c.column_name] ?? ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [c.column_name]: e.target.value,
                            })
                          }
                          className="w-full border p-2 rounded mt-1"
                        />
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
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
