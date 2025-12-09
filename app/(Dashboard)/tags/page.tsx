'use client';
import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import {
  useGetTagsQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  Tag,
  TagItem,
} from '@/redux/features/tags/tagsApi';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { tagColumns } from './columns';
const PRESET_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#14B8A6',
  '#06B6D4',
  '#84CC16',
  '#A855F7',
  '#F43F5E',
  '#22C55E',
  '#0EA5E9',
];

const PRESET_ICONS = [
  '🏷️',
  '⭐',
  '🔥',
  '💎',
  '🎯',
  '🚀',
  '💡',
  '🎨',
  '📌',
  '✨',
  '🌟',
  '💫',
  '🏆',
  '🎪',
  '🎭',
];

export default function TagsPage() {
  const { data, isLoading, error } = useGetTagsQuery();
  const [addTag] = useAddTagMutation();
  const [updateTag] = useUpdateTagMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const [formData, setFormData] = useState<Tag>({
    name: '',
    displayName: { en: '', ar: '' },
    description: { en: '', ar: '' },
    colorHex: '#3B82F6',
    icon: '🏷️',
    status: true,
  });

  const tags = data?.data || [];

  const tagsWithActions = useMemo(
    () =>
      Array.isArray(tags)
        ? tags.map((tag: TagItem) => ({
            ...tag,
            onEdit: (id: string) =>
              openModal(tags.find((t: TagItem) => t._id === id)),
          }))
        : [],
    [tags]
  );

  const table = useReactTable({
    data: tagsWithActions,
    columns: tagColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleSubmit = async () => {
    try {
      if (editingTag && editingTag._id) {
        await updateTag({
          id: editingTag._id,
          data: formData,
        }).unwrap();
      } else {
        await addTag(formData).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error('خطأ في حفظ الوسم:', err);
      alert('حدث خطأ في حفظ الوسم');
    }
  };

  const openModal = (tag?: TagItem) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name,
        displayName:
          typeof tag.displayName === 'object'
            ? tag.displayName
            : { en: tag.displayName, ar: tag.displayName },
        description:
          typeof tag.description === 'object'
            ? tag.description
            : { en: tag.description, ar: tag.description },
        colorHex: tag.colorHex,
        icon: tag.icon,
        status: true,
      });
    } else {
      setEditingTag(null);
      setFormData({
        name: '',
        displayName: { en: '', ar: '' },
        description: { en: '', ar: '' },
        colorHex: '#3B82F6',
        icon: '🏷️',
        status: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTag(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <div className="text-xl text-red-600 font-semibold mb-2">
            حدث خطأ في تحميل البيانات
          </div>
          <p className="text-red-500">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">الوسوم</h1>
              <p className="text-gray-600">
                إجمالي الوسوم:{' '}
                {data?.data?.total || (Array.isArray(tags) ? tags.length : 0)}
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={20} />
              إضافة وسم جديد
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="ابحث في الوسوم..."
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-right text-sm font-semibold text-gray-700"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none hover:text-blue-600'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                الصفحة{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} من{' '}
                  {table.getPageCount()}
                </strong>
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {[10, 20, 30, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    عرض {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {Array.isArray(tags) && tags.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm mt-6">
            <p className="text-gray-500 text-lg font-medium mb-2">
              لا توجد وسوم حالياً
            </p>
            <p className="text-gray-400 text-sm">قم بإضافة وسم جديد للبدء</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl z-10">
              <h2 className="text-2xl font-bold">
                {editingTag ? 'تعديل الوسم' : 'إضافة وسم جديد'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Technical Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم التقني (Technical Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="tag_name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  استخدم أحرف إنجليزية صغيرة وشرطة سفلية فقط
                </p>
              </div>

              {/* Display Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الاسم المعروض بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayName: {
                          ...formData.displayName,
                          ar: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="الاسم بالعربية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Display Name in English *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayName: {
                          ...formData.displayName,
                          en: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Display name"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الوصف بالعربية
                  </label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: {
                          ...formData.description,
                          ar: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="وصف الوسم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description in English
                  </label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: {
                          ...formData.description,
                          en: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Tag description"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  اللون *
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <input
                    type="color"
                    value={formData.colorHex}
                    onChange={(e) =>
                      setFormData({ ...formData, colorHex: e.target.value })
                    }
                    className="w-20 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.colorHex}
                    onChange={(e) =>
                      setFormData({ ...formData, colorHex: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                    placeholder="#3B82F6"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: formData.colorHex }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setFormData({ ...formData, colorHex: color })
                      }
                      className="w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: color,
                        borderColor:
                          formData.colorHex === color ? '#1F2937' : '#E5E7EB',
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الأيقونة *
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl border-2"
                    style={{
                      backgroundColor: `${formData.colorHex}20`,
                      borderColor: formData.colorHex,
                    }}
                  >
                    {formData.icon}
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-2xl text-center"
                    placeholder="🏷️"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className="w-12 h-12 rounded-lg border-2 hover:scale-110 transition-transform text-2xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          formData.icon === icon
                            ? `${formData.colorHex}20`
                            : '#F3F4F6',
                        borderColor:
                          formData.icon === icon
                            ? formData.colorHex
                            : '#E5E7EB',
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="border-t pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  معاينة الوسم
                </label>
                <div className="flex gap-4 items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <span
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold shadow-lg"
                    style={{
                      backgroundColor: formData.colorHex,
                      color: '#ffffff',
                    }}
                  >
                    <span className="text-2xl">{formData.icon}</span>
                    {formData.displayName.ar || 'اسم الوسم'}
                  </span>
                  <span
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold shadow-lg"
                    style={{
                      backgroundColor: formData.colorHex,
                      color: '#ffffff',
                    }}
                  >
                    <span className="text-2xl">{formData.icon}</span>
                    {formData.displayName.en || 'Tag Name'}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg"
                >
                  {editingTag ? '💾 حفظ التعديلات' : '✨ إضافة الوسم'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3.5 rounded-lg hover:bg-gray-300 transition-all font-bold"
                >
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
