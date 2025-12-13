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
import { useGetFacilitiesQuery } from '@/redux/features/facility/facilityApi';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { offerColumns } from './columns';
import {
  CreateOfferDto,
  Offer,
  UpdateOfferDto,
  useAddOfferMutation,
  useGetOffersQuery,
  useUpdateOfferMutation,
} from '@/redux/features/offers/offersApi';

export default function OffersPage() {
  const [filterActive, setFilterActive] = useState('');
  const [filterFacilityId, setFilterFacilityId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterLocationId, setFilterLocationId] = useState('');

  const { data: offersData, isLoading, error } = useGetOffersQuery();
  const { data: facilitiesData } = useGetFacilitiesQuery({
    page: currentPage,
    limit: pageSize,
    categoryId: filterCategoryId || undefined,
    locationId: filterLocationId || undefined,
    search: searchQuery || undefined,
  });
  const [addOffer] = useAddOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'percentage',
    discountPercentage: 0,
    discountAmount: 0,
    facilityId: '',
    startDate: '',
    endDate: '',
    isActive: true,
    isFeatured: false,
    termsAndConditions: '',
    image: null as File | null,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Extract data safely
  const offers = Array.isArray(offersData?.data) ? offersData.data : [];
  const facilities = Array.isArray(facilitiesData?.data)
    ? facilitiesData.data
    : [];

  // Filter offers
  const filteredOffers = useMemo(() => {
    return offers.filter((offer: Offer) => {
      const matchesSearch =
        searchQuery === '' ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesActive =
        filterActive === '' ||
        (filterActive === 'active' && offer.isActive) ||
        (filterActive === 'inactive' && !offer.isActive);

      const matchesFacility =
        filterFacilityId === '' || offer.facilityId === filterFacilityId;

      return matchesSearch && matchesActive && matchesFacility;
    });
  }, [offers, searchQuery, filterActive, filterFacilityId]);

  const totalPages = Math.ceil(filteredOffers.length / pageSize);
  const paginatedOffers = filteredOffers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const offersWithActions = useMemo(
    () =>
      paginatedOffers.map((offer: Offer) => ({
        ...offer,
        onEdit: (id: string) =>
          openModal(offers.find((o: Offer) => o.id === id)),
      })),
    [paginatedOffers, offers]
  );

  const table = useReactTable({
    data: offersWithActions,
    columns: offerColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const openModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description,
        type: offer.type,
        discountPercentage: offer.discountPercentage || 0,
        discountAmount: offer.discountAmount || 0,
        facilityId: offer.facilityId || '',
        startDate: offer.startDate.split('T')[0],
        endDate: offer.endDate.split('T')[0],
        isActive: offer.isActive,
        isFeatured: offer.isFeatured,
        termsAndConditions: offer.termsAndConditions || '',
        image: null,
      });
      setImagePreview(offer.image || null);
    } else {
      setEditingOffer(null);
      setFormData({
        title: '',
        description: '',
        type: 'percentage',
        discountPercentage: 0,
        discountAmount: 0,
        facilityId: '',
        startDate: '',
        endDate: '',
        isActive: true,
        isFeatured: false,
        termsAndConditions: '',
        image: null,
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOffer(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const submitData: any = {
        ...formData,
        discountPercentage:
          formData.type === 'percentage'
            ? formData.discountPercentage
            : undefined,
        discountAmount:
          formData.type === 'amount' ? formData.discountAmount : undefined,
      };

      if (editingOffer) {
        await updateOffer({
          id: editingOffer.id,
          data: submitData as UpdateOfferDto,
        }).unwrap();
      } else {
        await addOffer(submitData as CreateOfferDto).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error('خطأ في حفظ العرض:', err);
      alert('حدث خطأ في حفظ العرض');
    }
  };

  const handleClearFilters = () => {
    setFilterCategoryId('');
    setFilterLocationId('');
    setFilterActive('');
    setFilterFacilityId('');
    setSearchQuery('');
    setSearchInput('');
    setCurrentPage(1);
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

  const getFacilityName = (facilityId: string | null) => {
    if (!facilityId) return 'غير محدد';
    const facility = facilities.find((f: any) => f._id === facilityId);
    return facility?.name?.ar || 'غير محدد';
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">العروض</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                  {filteredOffers.length}
                </span>
                إجمالي العروض
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              إضافة عرض جديد
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
              placeholder="ابحث في العروض... (سيبدأ البحث تلقائياً)"
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
                حالة العرض
              </label>
              <div className="relative group">
                <select
                  value={filterActive}
                  onChange={(e) => {
                    setFilterActive(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-all font-medium shadow-sm"
                >
                  <option value="">جميع العروض</option>
                  <option value="active">العروض النشطة</option>
                  <option value="inactive">العروض غير النشطة</option>
                </select>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors">
                  <ChevronDown className="text-blue-600" size={18} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                المنشأة
              </label>
              <div className="relative group">
                <select
                  value={filterFacilityId}
                  onChange={(e) => {
                    setFilterFacilityId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer hover:border-blue-300 transition-all font-medium shadow-sm"
                >
                  <option value="">جميع المنشآت</option>
                  {facilities.map((facility: any) => (
                    <option key={facility._id} value={facility._id}>
                      {facility.name?.ar || 'غير متوفر'}
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
          {(filterActive || filterFacilityId || searchQuery) && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-900 font-semibold transition-colors"
              >
                <X size={16} />
                مسح جميع الفلاتر
              </button>
              <span className="text-xs text-blue-600">
                ({filteredOffers.length} نتيجة)
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
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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

        {filteredOffers.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md mt-6 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-semibold mb-2">
              {searchQuery || filterActive || filterFacilityId
                ? 'لا توجد نتائج مطابقة للبحث'
                : 'لا توجد عروض حالياً'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchQuery || filterActive || filterFacilityId
                ? 'حاول تغيير معايير البحث'
                : 'قم بإضافة عرض جديد للبدء'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold">
                {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Title and Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    عنوان العرض *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="أدخل عنوان العرض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الوصف *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="أدخل وصف العرض"
                  />
                </div>
              </div>

              {/* Discount Type and Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    نوع الخصم *
                  </label>
                  <div className="relative group">
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-4 py-3.5 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none cursor-pointer"
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="amount">مبلغ ثابت (ج.م)</option>
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="text-gray-400" size={18} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    قيمة الخصم *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={
                      formData.type === 'percentage'
                        ? formData.discountPercentage
                        : formData.discountAmount
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ...(formData.type === 'percentage'
                          ? { discountPercentage: Number(e.target.value) }
                          : { discountAmount: Number(e.target.value) }),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={
                      formData.type === 'percentage'
                        ? 'أدخل النسبة المئوية'
                        : 'أدخل المبلغ'
                    }
                  />
                </div>
              </div>

              {/* Facility */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  المنشأة *
                </label>
                <div className="relative group">
                  <select
                    required
                    value={formData.facilityId}
                    onChange={(e) =>
                      setFormData({ ...formData, facilityId: e.target.value })
                    }
                    className="w-full px-4 py-3.5 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none cursor-pointer hover:border-blue-400 shadow-sm"
                  >
                    <option value="" className="text-gray-500">
                      اختر المنشأة
                    </option>
                    {facilities.map((facility: any) => (
                      <option
                        key={facility._id}
                        value={facility._id}
                        className="text-gray-900"
                      >
                        {facility?.name?.ar || 'غير متوفر'}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors">
                    <ChevronDown className="text-blue-600" size={18} />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تاريخ البداية *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تاريخ النهاية *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الشروط والأحكام
                </label>
                <textarea
                  value={formData.termsAndConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termsAndConditions: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="أدخل الشروط والأحكام (اختياري)"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  صورة العرض
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="w-full
                        max-h-64
                        object-cover
                        rounded-xl
                        border-2
                        border-gray-200"
                    />
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  {editingOffer ? 'تحديث العرض' : 'إضافة العرض'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
