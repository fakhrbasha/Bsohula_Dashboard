import { ColumnDef } from '@tanstack/react-table';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import {
  useDeleteReviewMutation,
  ReviewItem,
} from '../../../redux/features/Review/reviewApis';

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
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => {
                onEdit(reviewId);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              تعديل
            </button>
            <button
              onClick={() => {
                setShowDialog(true);
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export const reviewColumns: ColumnDef<ReviewItem>[] = [
  {
    accessorKey: 'rating',
    header: 'التقييم',
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number;
      return (
        <div className="flex flex-col gap-2">
          <RatingStars rating={rating} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">{rating}</span>
            <span className="text-sm text-gray-500">من 5</span>
          </div>
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
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700 line-clamp-3">{comment}</p>
          </div>
          {comment && comment.length > 100 && (
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              عرض المزيد
            </button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'facilityId',
    header: 'المنشأة',
    cell: ({ row }) => {
      const facilityId = row.getValue('facilityId') as string;
      // يمكنك هنا جلب اسم المنشأة من store إذا كان متاح
      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {facilityId.slice(0, 8)}...
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ التقييم',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      const date = new Date(createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let relativeTime = '';
      if (diffDays === 0) relativeTime = 'اليوم';
      else if (diffDays === 1) relativeTime = 'أمس';
      else if (diffDays < 7) relativeTime = `منذ ${diffDays} أيام`;
      else if (diffDays < 30)
        relativeTime = `منذ ${Math.floor(diffDays / 7)} أسابيع`;
      else if (diffDays < 365)
        relativeTime = `منذ ${Math.floor(diffDays / 30)} أشهر`;
      else relativeTime = `منذ ${Math.floor(diffDays / 365)} سنة`;

      return (
        <div className="text-sm">
          <p className="text-gray-700 font-medium">{relativeTime}</p>
          <p className="text-xs text-gray-500">
            {date.toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'آخر تحديث',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      const updatedAt = row.getValue('updatedAt') as string;
      const isEdited = createdAt !== updatedAt;

      if (!isEdited) {
        return <span className="text-sm text-gray-400">لم يتم التعديل</span>;
      }

      return (
        <div className="text-sm">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            تم التعديل
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(updatedAt).toLocaleDateString('ar-EG', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      );
    },
  },
  {
    id: 'sentiment',
    header: 'التقدير',
    cell: ({ row }) => {
      const rating = row.original.rating;
      let sentiment = '';
      let bgColor = '';
      let textColor = '';
      let emoji = '';

      if (rating >= 4.5) {
        sentiment = 'ممتاز';
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        emoji = '🌟';
      } else if (rating >= 3.5) {
        sentiment = 'جيد';
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        emoji = '😊';
      } else if (rating >= 2.5) {
        sentiment = 'متوسط';
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        emoji = '😐';
      } else if (rating >= 1.5) {
        sentiment = 'ضعيف';
        bgColor = 'bg-orange-100';
        textColor = 'text-orange-800';
        emoji = '😕';
      } else {
        sentiment = 'سيء';
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        emoji = '😞';
      }

      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${bgColor} ${textColor}`}
        >
          <span className="text-lg">{emoji}</span>
          {sentiment}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const reviewId = row.original._id;
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell reviewId={reviewId} onEdit={onEdit} />;
    },
  },
];
