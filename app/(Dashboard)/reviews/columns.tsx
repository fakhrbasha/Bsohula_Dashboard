import {
  ReviewItem,
  useDeleteReviewMutation,
} from '@/redux/features/Review/reviewApis';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  Star,
  Building2,
  Calendar,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface ActionsProps {
  reviewId: string;
  onEdit: (id: string) => void;
}

const ActionsCell = ({ reviewId, onEdit }: ActionsProps) => {
  const [deleteReview] = useDeleteReviewMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReview(reviewId).unwrap();
      setShowDialog(false);
      setShowDropdown(false);
    } catch (err) {
      console.error('خطأ في الحذف:', err);
      alert('حدث خطأ في حذف التقييم');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />

          <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => {
                onEdit(reviewId);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
            >
              <Edit2 className="h-4 w-4" />
              تعديل
            </button>

            <button
              onClick={() => {
                setShowDialog(true);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </button>
          </div>
        </>
      )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد أنك تريد حذف هذا التقييم؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="animate-spin h-4 w-4" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const reviewColumns: ColumnDef<ReviewItem>[] = [
  {
    id: 'facility',
    header: 'المنشأة',
    cell: ({ row }) => {
      // Check if we have facilityName added from parent component
      const facilityName = (row.original as any).facilityName;

      if (facilityName && facilityName !== 'غير محدد') {
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-800">{facilityName}</span>
          </div>
        );
      }

      // Fallback: If facilityId is a populated object
      const facility = row.original.facilityId;

      if (typeof facility === 'object' && facility !== null) {
        const facObj = facility as any;
        const displayName = facObj.name?.ar || facObj.name?.en || 'غير محدد';
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-800">{displayName}</span>
          </div>
        );
      }

      // If it's just a string ID
      if (typeof facility === 'string' && facility) {
        return (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-mono">
              {facility.substring(0, 10)}...
            </span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-300" />
          <span className="text-sm text-gray-400">غير محدد</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'rating',
    header: 'التقييم',
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number;
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={18}
                className={`${
                  index < rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 fill-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            {rating}/5
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: 'التعليق',
    cell: ({ row }) => {
      const comment = row.getValue('comment') as string;
      return (
        <div className="max-w-md">
          {comment ? (
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {comment}
            </p>
          ) : (
            <span className="text-sm text-gray-400 italic">لا يوجد تعليق</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الإضافة',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-green-100 rounded-lg">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-700">
              {new Date(createdAt).toLocaleDateString('ar-EG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'آخر تحديث',
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string;
      const createdAt = row.getValue('createdAt') as string;
      const isUpdated =
        new Date(updatedAt).getTime() !== new Date(createdAt).getTime();

      return (
        <div className="text-sm">
          {isUpdated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-blue-700">
                  {new Date(updatedAt).toLocaleDateString('ar-EG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-xs text-blue-500">
                  {new Date(updatedAt).toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center">
                <span className="text-gray-300">—</span>
              </div>
              <span className="text-gray-400 text-xs">لم يتم التعديل</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const reviewId = row.original._id || '';
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell reviewId={reviewId} onEdit={onEdit} />;
    },
  },
];
