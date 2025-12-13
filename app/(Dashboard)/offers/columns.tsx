import {
  Offer,
  useDeleteOfferMutation,
} from '@/redux/features/offers/offersApi';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle,
  XCircle,
  Star,
  ImageIcon,
} from 'lucide-react';
import { useState } from 'react';

interface ActionsProps {
  offerId: string;
  onEdit: (id: string) => void;
}

const ActionsCell = ({ offerId, onEdit }: ActionsProps) => {
  const [deleteOffer] = useDeleteOfferMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOffer(offerId).unwrap();
      setShowDialog(false);
      setShowDropdown(false);
    } catch (err) {
      console.error('خطأ في الحذف:', err);
      alert('حدث خطأ في حذف العرض');
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
                onEdit(offerId);
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
              هل أنت متأكد أنك تريد حذف هذا العرض؟ لا يمكن التراجع عن هذا
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

export const offerColumns: ColumnDef<Offer>[] = [
  {
    accessorKey: 'image',
    header: 'الصورة',
    cell: ({ row }) => {
      const image = row.getValue('image') as string | undefined;
      return (
        <div>
          {image ? (
            <img
              src={image}
              alt={row.original.title}
              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'العنوان',
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      const description = row.original.description;
      return (
        <div>
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'نوع الخصم',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const discountPercentage = row.original.discountPercentage;
      const discountAmount = row.original.discountAmount;

      return type === 'percentage' ? (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Percent className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-green-600">{discountPercentage}%</p>
            <p className="text-xs text-gray-500">نسبة مئوية</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-blue-600">{discountAmount} ج.م</p>
            <p className="text-xs text-gray-500">مبلغ ثابت</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'facilityId',
    header: 'المنشأة',
    cell: ({ row }) => {
      const facilityId = row.getValue('facilityId') as string | null;
      // You would typically fetch the facility name from the facilities list
      return (
        <p className="text-sm text-gray-700">{facilityId || 'غير محدد'}</p>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: 'الفترة',
    cell: ({ row }) => {
      const startDate = row.getValue('startDate') as string;
      const endDate = row.original.endDate;
      return (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-gray-700">
              {new Date(startDate).toLocaleDateString('ar-EG')}
            </p>
            <p className="text-gray-500">
              {new Date(endDate).toLocaleDateString('ar-EG')}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'الحالة',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;
      return isActive ? (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          نشط
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          غير نشط
        </span>
      );
    },
  },
  {
    accessorKey: 'isFeatured',
    header: 'مميز',
    cell: ({ row }) => {
      const isFeatured = row.getValue('isFeatured') as boolean;
      return isFeatured ? (
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      ) : (
        <Star className="w-5 h-5 text-gray-300" />
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الإنشاء',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string;
      return (
        <div className="text-sm text-gray-600">
          {new Date(createdAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const offerId = row.original.id;
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell offerId={offerId} onEdit={onEdit} />;
    },
  },
];
