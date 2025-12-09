'use client';
import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
} from 'lucide-react';

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
import {
  Facility,
  useAddFacilityMutation,
  useGetFacilitiesQuery,
  useUpdateFacilityMutation,
} from '@/redux/features/facility/facilityApi';
import { useGetCategoriesQuery } from '@/redux/features/categores/categoresApi';
import { useGetLocationsQuery } from '@/redux/features/location/locationApi';
import { facilityColumns } from './columns';

export default function FacilitiesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useGetFacilitiesQuery({ page, limit });
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: locationsData } = useGetLocationsQuery();

  const [addFacility] = useAddFacilityMutation();
  const [updateFacility] = useUpdateFacilityMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  const [formData, setFormData] = useState<Facility>({
    name: { en: '', ar: '' },
    description: {},
    categoryId: '',
    locationId: '',
    address: '',
    phone: '',
    website: '',
    opening_hours: {},
    tags: [],
    map_url: '',
    images: [],
    status: true,
  });

  const facilities = data?.data || [];
  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  const facilitiesWithActions = useMemo(
    () =>
      (Array.isArray(facilities) ? facilities : []).map(
        (facility: Facility) => ({
          ...facility,
          onEdit: (id: string) =>
            openModal(
              (Array.isArray(facilities) ? facilities : []).find(
                (f: Facility) => f._id === id
              )
            ),
        })
      ),
    [facilities]
  );

  const table = useReactTable({
    data: facilitiesWithActions,
    columns: facilityColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const facility = row.original as Facility;

      // Search in Arabic and English names
      const nameAr = facility.name?.ar?.toLowerCase() || '';
      const nameEn = facility.name?.en?.toLowerCase() || '';
      const address = facility.address?.toLowerCase() || '';
      const phone = facility.phone?.toLowerCase() || '';

      // Search in tags
      const tagsMatch =
        facility.tags?.some((tag) => tag.toLowerCase().includes(searchValue)) ||
        false;

      return (
        nameAr.includes(searchValue) ||
        nameEn.includes(searchValue) ||
        address.includes(searchValue) ||
        phone.includes(searchValue) ||
        tagsMatch
      );
    },
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
      if (editingFacility && editingFacility._id) {
        await updateFacility({
          id: editingFacility._id,
          data: formData,
        }).unwrap();
      } else {
        await addFacility(formData).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error('خطأ في حفظ المنشأة:', err);
      alert('حدث خطأ في حفظ المنشأة');
    }
  };

  const openModal = (facility?: Facility) => {
    if (facility) {
      setEditingFacility(facility);
      setFormData({
        ...facility,
        tags: facility.tags || [],
        images: facility.images || [],
      });
    } else {
      setEditingFacility(null);
      setFormData({
        name: { en: '', ar: '' },
        description: {},
        categoryId: '',
        locationId: '',
        address: '',
        phone: '',
        website: '',
        opening_hours: {},
        tags: [],
        map_url: '',
        images: [],
        status: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFacility(null);
    setTagInput('');
    setImageInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images?.includes(imageInput.trim())) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageInput.trim()],
      });
      setImageInput('');
    }
  };

  const removeImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((img) => img !== imageToRemove) || [],
    });
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">المنشآت</h1>
              <p className="text-gray-600">
                إجمالي المنشآت:{' '}
                {data?.data?.total ||
                  (Array.isArray(facilities) ? facilities.length : 0)}
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={20} />
              إضافة منشأة جديدة
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
              placeholder="ابحث في المنشآت..."
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

        {Array.isArray(facilities) && facilities.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm mt-6">
            <p className="text-gray-500 text-lg font-medium mb-2">
              لا توجد منشآت حالياً
            </p>
            <p className="text-gray-400 text-sm">قم بإضافة منشأة جديدة للبدء</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl z-10">
              <h2 className="text-2xl font-bold">
                {editingFacility ? 'تعديل المنشأة' : 'إضافة منشأة جديدة'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الاسم بالعربية *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name.ar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, ar: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل الاسم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Name in English *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name.en}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: { ...formData.name, en: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    التصنيف *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">اختر التصنيف</option>
                    {Array.isArray(categories) &&
                      categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name.ar}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموقع *
                  </label>
                  <select
                    required
                    value={formData.locationId}
                    onChange={(e) =>
                      setFormData({ ...formData, locationId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">اختر الموقع</option>
                    {Array.isArray(locations) &&
                      locations.map((loc: any) => (
                        <option key={loc._id} value={loc._id}>
                          {loc.name.ar}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+20 123 456 7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموقع الإلكتروني
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رابط الخريطة
                  </label>
                  <input
                    type="url"
                    value={formData.map_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, map_url: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل العنوان الكامل"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="status"
                  className="text-sm font-bold text-gray-700"
                >
                  المنشأة نشطة
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الوسوم
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أضف وسم واضغط Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الصور
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="أضف رابط الصورة واضغط Enter"
                  />
                  <button
                    onClick={addImage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Upload size={18} />
                    إضافة
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {formData.images?.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/100?text=صورة';
                        }}
                      />
                      <button
                        onClick={() => removeImage(img)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg"
                >
                  {editingFacility ? '💾 حفظ التعديلات' : '✨ إضافة المنشأة'}
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
