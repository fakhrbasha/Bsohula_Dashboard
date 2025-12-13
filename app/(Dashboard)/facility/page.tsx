'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  useGetFacilitiesQuery,
  useAddFacilityMutation,
  useUpdateFacilityMutation,
  Facility,
  CreateFacilityDto,
  UpdateFacilityDto,
} from '@/redux/features/facility/facilityApi';
import { useGetLocationsQuery } from '@/redux/features/location/locationApi';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { facilityColumns } from './columns';
import { useGetCategoriesQuery } from '@/redux/features/categores/categoresApi';
import { useGetTagsQuery } from '@/redux/features/tags/tagsApi';

export default function FacilitiesPage() {
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterLocationId, setFilterLocationId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Local state for input
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error } = useGetFacilitiesQuery({
    page: currentPage,
    limit: pageSize,
    categoryId: filterCategoryId || undefined,
    locationId: filterLocationId || undefined,
    search: searchQuery || undefined,
  });

  const { data: locationsData } = useGetLocationsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();
  const [addFacility] = useAddFacilityMutation();
  const [updateFacility] = useUpdateFacilityMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [formData, setFormData] = useState({
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    categoryId: '',
    locationId: '',
    address: '',
    phone: '',
    website: '',
    map_url: '',
    tags: [] as string[],
    images: [] as string[],
  });

  // Safely extract facilities data
  const facilities = Array.isArray(data?.data) ? data.data : [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Safely extract locations - handle nested data structure
  const locations = Array.isArray(locationsData?.data?.data)
    ? locationsData.data.data
    : Array.isArray(locationsData?.data)
    ? locationsData.data
    : [];

  // Safely extract categories - handle nested data structure
  const categories = Array.isArray(categoriesData?.data?.data)
    ? categoriesData.data.data
    : Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];

  // Safely extract tags - handle nested data structure
  const tags = Array.isArray(tagsData?.data?.data)
    ? tagsData.data.data
    : Array.isArray(tagsData?.data)
    ? tagsData.data
    : [];

  const facilitiesWithActions = useMemo(
    () =>
      facilities.map((fac: Facility) => ({
        ...fac,
        onEdit: (id: string) =>
          openModal(facilities.find((f: Facility) => f._id === id)),
      })),
    [facilities]
  );

  const table = useReactTable({
    data: facilitiesWithActions,
    columns: facilityColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: totalPages,
  });

  const handleSubmit = async () => {
    try {
      if (editingFacility) {
        await updateFacility({
          id: editingFacility._id,
          data: formData as UpdateFacilityDto,
        }).unwrap();
      } else {
        await addFacility(formData as CreateFacilityDto).unwrap();
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
        name: facility.name || { en: '', ar: '' },
        description: facility.description || { en: '', ar: '' },
        categoryId: facility.categoryId || '',
        locationId: facility.locationId || '',
        address: facility.address || '',
        phone: facility.phone || '',
        website: facility.website || '',
        map_url: facility.map_url || '',
        tags: facility.tags?.map((t) => t._id) || [],
        images: facility.images || [],
      });
    } else {
      setEditingFacility(null);
      setFormData({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        categoryId: '',
        locationId: '',
        address: '',
        phone: '',
        website: '',
        map_url: '',
        tags: [],
        images: [],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFacility(null);
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleClearFilters = () => {
    setFilterCategoryId('');
    setFilterLocationId('');
    setSearchQuery('');
    setSearchInput('');
    setCurrentPage(1);
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">المنشآت</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                  {totalItems}
                </span>
                إجمالي المنشآت
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              إضافة منشأة جديدة
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث في المنشآت... (سيبدأ البحث تلقائياً)"
              className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-300"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                تصفية حسب التصنيف
              </label>
              <div className="relative group">
                <select
                  value={filterCategoryId}
                  onChange={(e) => {
                    setFilterCategoryId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-all font-medium shadow-sm"
                >
                  <option value="" className="text-gray-500">
                    جميع التصنيفات
                  </option>
                  {categories.map((cat: any) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="text-gray-900 py-2"
                    >
                      {cat?.name?.ar || 'غير متوفر'}
                    </option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors">
                  <ChevronDown className="text-blue-600" size={18} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                تصفية حسب الموقع
              </label>
              <div className="relative group">
                <select
                  value={filterLocationId}
                  onChange={(e) => {
                    setFilterLocationId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-all font-medium shadow-sm"
                >
                  <option value="" className="text-gray-500">
                    جميع المواقع
                  </option>
                  {locations.map((loc: any) => (
                    <option
                      key={loc._id}
                      value={loc._id}
                      className="text-gray-900 py-2"
                    >
                      {loc?.name?.ar || 'غير متوفر'}
                    </option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors">
                  <ChevronDown className="text-blue-600" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(filterCategoryId || filterLocationId || searchQuery) && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-semibold transition-colors"
              >
                <X size={16} />
                مسح جميع الفلاتر
              </button>
              <span className="text-xs text-blue-600">
                ({totalItems} نتيجة)
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-right text-sm font-bold text-gray-700"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none hover:text-blue-600 transition-colors flex items-center gap-2'
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
                    className="hover:bg-blue-50 transition-colors"
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
          <div className="px-6 py-4 border-t-2 border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm disabled:hover:bg-transparent disabled:hover:border-gray-300"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm disabled:hover:bg-transparent disabled:hover:border-gray-300"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                الصفحة{' '}
                <strong className="text-blue-600">
                  {totalPages === 0 ? 0 : currentPage}
                </strong>{' '}
                من <strong className="text-blue-600">{totalPages}</strong>
              </span>
              <div className="relative group">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm appearance-none cursor-pointer hover:border-blue-500 transition-all bg-white shadow-sm font-medium"
                >
                  {[10, 20, 30, 50].map((size) => (
                    <option key={size} value={size}>
                      عرض {size}
                    </option>
                  ))}
                </select>
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-0.5 group-hover:bg-blue-100 transition-colors">
                  <ChevronDown className="text-blue-600" size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {facilities.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md mt-6 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">
              {searchQuery || filterCategoryId || filterLocationId
                ? 'لا توجد نتائج مطابقة للبحث'
                : 'لا توجد منشآت حالياً'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchQuery || filterCategoryId || filterLocationId
                ? 'حاول تغيير معايير البحث'
                : 'قم بإضافة منشأة جديدة للبدء'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الوصف بالعربية *
                  </label>
                  <textarea
                    required
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="أدخل الوصف"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description in English *
                  </label>
                  <textarea
                    required
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Enter description"
                  />
                </div>
              </div>

              {/* Category and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    التصنيف *
                  </label>
                  <div className="relative group">
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className="w-full px-4 py-3.5 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none cursor-pointer hover:border-blue-400 shadow-sm"
                    >
                      <option value="" className="text-gray-500">
                        اختر التصنيف
                      </option>
                      {categories.map((cat: any) => (
                        <option
                          key={cat._id}
                          value={cat._id}
                          className="text-gray-900"
                        >
                          {cat?.name?.ar || 'غير متوفر'}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors">
                      <ChevronDown className="text-blue-600" size={18} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموقع *
                  </label>
                  <div className="relative group">
                    <select
                      required
                      value={formData.locationId}
                      onChange={(e) =>
                        setFormData({ ...formData, locationId: e.target.value })
                      }
                      className="w-full px-4 py-3.5 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none cursor-pointer hover:border-blue-400 shadow-sm"
                    >
                      <option value="" className="text-gray-500">
                        اختر الموقع
                      </option>
                      {locations.map((loc: any) => (
                        <option
                          key={loc._id}
                          value={loc._id}
                          className="text-gray-900"
                        >
                          {loc?.name?.ar || 'غير متوفر'}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors">
                      <ChevronDown className="text-blue-600" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="أدخل العنوان"
                />
              </div>

              {/* Phone and Website */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموقع الإلكتروني
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Map URL */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  رابط الخريطة *
                </label>
                <input
                  type="url"
                  required
                  value={formData.map_url}
                  onChange={(e) =>
                    setFormData({ ...formData, map_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الوسوم (اختياري)
                </label>
                <div className="flex flex-wrap gap-2 p-4 border-2 border-gray-300 rounded-lg min-h-[60px]">
                  {tags.length === 0 ? (
                    <p className="text-gray-500 text-sm">لا توجد وسوم متاحة</p>
                  ) : (
                    tags.map((tag: any) => (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => toggleTag(tag._id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          formData.tags.includes(tag._id)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={
                          formData.tags.includes(tag._id)
                            ? { backgroundColor: tag.colorHex }
                            : {}
                        }
                      >
                        {tag?.displayName?.ar || tag?.name || 'وسم'}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  {editingFacility ? 'حفظ التعديلات' : 'إضافة المنشأة'}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3.5 rounded-lg hover:bg-gray-300 transition-all font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
