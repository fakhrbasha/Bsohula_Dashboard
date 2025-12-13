'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Building2,
  Plus,
  X,
  MessageSquare,
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
import { useGetFacilitiesQuery } from '@/redux/features/facility/facilityApi';
import {
  ReviewItem,
  useGetReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
} from '@/redux/features/Review/reviewApis';
import { reviewColumns } from './columns';

export default function ReviewsPage() {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    facilityId: '',
    rating: 0,
    comment: '',
  });

  const { data: facilitiesData, isLoading: loadingFacilities } =
    useGetFacilitiesQuery({
      page: 1,
      limit: 100,
    });

  const {
    data: reviewsData,
    isLoading: loadingReviews,
    error: reviewsError,
  } = useGetReviewsQuery(selectedFacilityId, { skip: !selectedFacilityId });

  const [addReview] = useAddReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const facilities = facilitiesData?.data || [];

  // Convert reviews data to array
  const reviews = useMemo(() => {
    if (!reviewsData?.data) return [];
    return reviewsData.data;
  }, [reviewsData]);

  const reviewsWithActions = useMemo(
    () =>
      Array.isArray(reviews)
        ? reviews.map((review: ReviewItem) => ({
            ...review,
            onEdit: (id: string) =>
              openModal(reviews.find((r: ReviewItem) => r._id === id)),
          }))
        : [],
    [reviews]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return { avgRating: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const total = reviews.length;
    const sum = reviews.reduce(
      (acc: number, r: ReviewItem) => acc + r.rating,
      0
    );
    const avgRating = sum / total;

    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r: ReviewItem) => {
      const index = Math.floor(r.rating) - 1;
      if (index >= 0 && index < 5) {
        distribution[index]++;
      }
    });

    return { avgRating, total, distribution };
  }, [reviews]);

  const table = useReactTable({
    data: reviewsWithActions,
    columns: reviewColumns,
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

  const handleFacilityChange = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.facilityId) {
        alert('الرجاء اختيار منشأة');
        return;
      }
      if (formData.rating === 0) {
        alert('الرجاء اختيار تقييم');
        return;
      }
      if (!formData.comment.trim()) {
        alert('الرجاء كتابة تعليق');
        return;
      }

      if (editingReview && editingReview._id) {
        await updateReview({
          id: editingReview._id,
          data: formData,
        }).unwrap();
      } else {
        await addReview(formData).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error('خطأ في حفظ التقييم:', err);
      alert('حدث خطأ في حفظ التقييم');
    }
  };

  const openModal = (review?: ReviewItem) => {
    if (review) {
      setEditingReview(review);

      // Extract facility ID if it's an object
      const facilityId =
        typeof review.facilityId === 'object' && review.facilityId !== null
          ? (review.facilityId as any)._id
          : review.facilityId;

      setFormData({
        facilityId: facilityId || '',
        rating: review.rating || 0,
        comment: review.comment || '',
      });
      setRating(review.rating || 0);
    } else {
      setEditingReview(null);
      setFormData({
        facilityId: selectedFacilityId || '',
        rating: 0,
        comment: '',
      });
      setRating(0);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReview(null);
    setRating(0);
    setHoverRating(0);
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    setFormData({ ...formData, rating: value });
  };

  // Get selected facility details
  const selectedFacility = Array.isArray(facilities)
    ? facilities.find((f: any) => f._id === selectedFacilityId)
    : null;

  const isLoading = loadingFacilities || loadingReviews;

  if (loadingFacilities) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">جاري تحميل المنشآت...</div>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                تقييمات المنشآت
              </h1>
              <p className="text-gray-600">
                اختر منشأة لعرض تقييماتها والإحصائيات الخاصة بها
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus size={20} />
              إضافة تقييم جديد
            </button>
          </div>

          {/* Facility Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <span>اختر المنشأة لعرض تقييماتها</span>
            </label>
            <div className="relative">
              <select
                value={selectedFacilityId}
                onChange={(e) => handleFacilityChange(e.target.value)}
                className="w-full px-5 py-4 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gradient-to-r from-white to-gray-50 shadow-md hover:shadow-lg transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233B82F6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 1rem center',
                  backgroundSize: '1.5rem',
                  paddingLeft: '3rem',
                }}
              >
                <option value="" className="text-gray-500 bg-gray-50">
                  اختر منشأة من القائمة...
                </option>
                {Array.isArray(facilities)
                  ? facilities.map((facility: any) => (
                      <option
                        key={facility._id}
                        value={facility._id}
                        className="py-3 text-gray-800 hover:bg-blue-50"
                      >
                        🏢 {facility.name.ar} • {facility.name.en}
                      </option>
                    ))
                  : null}
              </select>
              {!selectedFacilityId && (
                <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-blue-600 text-sm font-medium animate-pulse">
                    ← ابدأ من هنا
                  </span>
                </div>
              )}
            </div>
            {!selectedFacilityId && (
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                قم باختيار منشأة لعرض جميع تقييماتها والإحصائيات التفصيلية
              </p>
            )}
          </div>

          {/* Selected Facility Info */}
          {selectedFacility && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-blue-200 mb-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                      ✓ محددة
                    </span>
                    <span className="text-xs text-gray-500">
                      {stats.total} تقييم متاح
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {selectedFacility.name.ar}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {selectedFacility.name.en}
                  </p>
                </div>
                {stats.avgRating > 0 && (
                  <div className="text-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.avgRating.toFixed(1)}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= Math.round(stats.avgRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {selectedFacilityId && stats.total > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <h3 className="text-sm font-semibold text-yellow-900">
                    متوسط التقييم
                  </h3>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-yellow-700">
                    {stats.avgRating.toFixed(1)}
                  </span>
                  <span className="text-lg text-yellow-600 mb-1">من 5</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(stats.avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <h3 className="text-sm font-semibold text-blue-900">
                    إجمالي التقييمات
                  </h3>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-blue-700">
                    {stats.total}
                  </span>
                  <span className="text-lg text-blue-600 mb-1">تقييم</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h3 className="text-sm font-semibold text-green-900 mb-3">
                  توزيع التقييمات
                </h3>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-green-700 w-3">
                      {star}
                    </span>
                    <Star className="w-3 h-3 fill-green-500 text-green-500" />
                    <div className="flex-1 bg-green-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            stats.total > 0
                              ? (stats.distribution[star - 1] / stats.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-green-600 w-8 text-left">
                      {stats.distribution[star - 1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          {selectedFacilityId &&
            Array.isArray(reviews) &&
            reviews.length > 0 && (
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="ابحث في التقييمات..."
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
        </div>

        {/* Loading State */}
        {loadingReviews && selectedFacilityId && (
          <div className="flex items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">
                جاري تحميل التقييمات...
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {reviewsError && selectedFacilityId && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-center bg-red-50 p-8 rounded-lg inline-block">
              <div className="text-xl text-red-600 font-semibold mb-2">
                حدث خطأ في تحميل التقييمات
              </div>
              <p className="text-red-500">يرجى المحاولة مرة أخرى</p>
            </div>
          </div>
        )}

        {/* Empty State - No Facility Selected */}
        {!selectedFacilityId && (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-medium mb-2">
              لم يتم اختيار منشأة
            </p>
            <p className="text-gray-400 text-base">
              يرجى اختيار منشأة من القائمة أعلاه لعرض تقييماتها
            </p>
          </div>
        )}

        {/* Empty State - No Reviews */}
        {selectedFacilityId &&
          !loadingReviews &&
          Array.isArray(reviews) &&
          reviews.length === 0 &&
          !reviewsError && (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                لا توجد تقييمات لهذه المنشأة
              </p>
              <p className="text-gray-400 text-sm">
                {selectedFacility?.name.ar} ليس لديها تقييمات بعد
              </p>
            </div>
          )}

        {/* Table */}
        {selectedFacilityId &&
          Array.isArray(reviews) &&
          reviews.length > 0 &&
          !loadingReviews && (
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
                                }[header.column.getIsSorted() as string] ??
                                  null}
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
          )}
      </div>

      {/* Add/Edit Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare size={28} />
                {editingReview ? 'تعديل التقييم' : 'إضافة تقييم جديد'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Facility Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Building2 size={18} />
                  المنشأة *
                </label>
                <select
                  required
                  value={formData.facilityId}
                  onChange={(e) =>
                    setFormData({ ...formData, facilityId: e.target.value })
                  }
                  disabled={!!editingReview}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">اختر المنشأة</option>
                  {Array.isArray(facilities) &&
                    facilities.map((facility: any) => (
                      <option key={facility._id} value={facility._id}>
                        {facility.name?.ar || facility.name?.en || 'غير محدد'}
                      </option>
                    ))}
                </select>
                {editingReview && (
                  <p className="text-xs text-gray-500 mt-1">
                    لا يمكن تغيير المنشأة عند التعديل
                  </p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Star size={18} className="text-yellow-500" />
                  التقييم *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={40}
                        className={`${
                          value <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="mr-4 text-2xl font-bold text-gray-700">
                    {rating > 0 ? `${rating}/5` : 'لم يتم التقييم'}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare size={18} />
                  التعليق *
                </label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="شارك تجربتك مع هذه المنشأة..."
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    اكتب تعليقاً مفصلاً عن تجربتك
                  </p>
                  <p className="text-xs text-gray-500">
                    {formData.comment.length} حرف
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg"
                >
                  {editingReview ? '💾 حفظ التعديلات' : '✨ إضافة التقييم'}
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
