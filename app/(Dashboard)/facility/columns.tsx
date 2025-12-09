import {
  Facility,
  useDeleteFacilityMutation,
} from '@/redux/features/facility/facilityApi';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  MapPin,
  Phone,
  Globe,
  Star,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
interface ActionsProps {
  facilityId: string;
  onEdit: (id: string) => void;
}

const ActionsCell = ({ facilityId, onEdit }: ActionsProps) => {
  const [deleteFacility] = useDeleteFacilityMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFacility(facilityId).unwrap();
      setShowDialog(false);
      setShowDropdown(false);
    } catch (err) {
      console.error('خطأ في الحذف:', err);
      alert('حدث خطأ في حذف المنشأة');
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
                onEdit(facilityId);
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
              هل أنت متأكد أنك تريد حذف هذه المنشأة؟ لا يمكن التراجع عن هذا
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

export const facilityColumns: ColumnDef<Facility>[] = [
  {
    accessorKey: 'images',
    header: 'الصورة',
    cell: ({ row }) => {
      const images = row.getValue('images') as string[] | undefined;
      const imageUrl = images && images.length > 0 ? images[0] : null;

      if (imageUrl) {
        return (
          <img
            src={imageUrl}
            alt="Facility"
            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/64?text=صورة';
            }}
          />
        );
      }

      return (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'الاسم',
    cell: ({ row }) => {
      const name = row.getValue('name') as { en: string; ar: string };
      return (
        <div>
          <p className="font-semibold text-gray-800">{name.ar}</p>
          <p className="text-sm text-gray-500">{name.en}</p>
        </div>
      );
    },
  },
  // {
  //   accessorKey: 'categoryId',
  //   header: 'التصنيف',
  //   cell: ({ row }) => {
  //     const categoryId = row.getValue('categoryId') as string;
  //     return (
  //       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  //         {categoryId}
  //       </span>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'locationId',
  //   header: 'الموقع',
  //   cell: ({ row }) => {
  //     const locationId = row.getValue('locationId') as string;
  //     return (
  //       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
  //         {locationId}dd
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: 'address',
    header: 'العنوان',
    cell: ({ row }) => {
      const address = row.getValue('address') as string | undefined;
      return address ? (
        <p className="text-sm text-gray-700 max-w-xs truncate">{address}</p>
      ) : (
        <span className="text-gray-400 text-sm">لا يوجد</span>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'الهاتف',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | undefined;
      return phone ? (
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <Phone className="w-3 h-3" />
          {phone}
        </a>
      ) : (
        <span className="text-gray-400 text-sm">لا يوجد</span>
      );
    },
  },
  {
    accessorKey: 'website',
    header: 'الموقع الإلكتروني',
    cell: ({ row }) => {
      const website = row.getValue('website') as string | undefined;
      return website ? (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <Globe className="w-3 h-3" />
          رابط
        </a>
      ) : (
        <span className="text-gray-400 text-sm">لا يوجد</span>
      );
    },
  },
  {
    accessorKey: 'avgRating',
    header: 'التقييم',
    cell: ({ row }) => {
      const rating = row.getValue('avgRating') as number | undefined;
      return rating ? (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-semibold text-gray-700">
            {rating.toFixed(1)}
          </span>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">لا يوجد</span>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'الوسوم',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[] | undefined;
      if (!tags || tags.length === 0) {
        return <span className="text-gray-400 text-sm">لا يوجد</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{tags.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ row }) => {
      const status = row.getValue('status') as boolean | undefined;
      return (
        <div className="text-center">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {status ? 'نشط' : 'غير نشط'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'تاريخ الإنشاء',
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string | undefined;
      return createdAt ? (
        <div className="text-sm text-gray-600">
          {new Date(createdAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ) : (
        <span className="text-gray-400 text-sm">لا يوجد</span>
      );
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const facilityId = row.original._id || '';
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell facilityId={facilityId} onEdit={onEdit} />;
    },
  },
];
