import { ColumnDef } from '@tanstack/react-table';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  MapPin,
  Tag,
} from 'lucide-react';
import { useState } from 'react';
import {
  useDeleteLocationMutation,
  Location,
} from '@/redux/features/location/locationApi';
interface ActionsProps {
  locationId: string;
  onEdit: (id: string) => void;
}

const ActionsCell = ({ locationId, onEdit }: ActionsProps) => {
  const [deleteLocation] = useDeleteLocationMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLocation(locationId).unwrap();
      setShowDialog(false);
      setShowDropdown(false);
    } catch (err) {
      console.error('خطأ في الحذف:', err);
      alert('حدث خطأ في حذف الموقع');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => {
                onEdit(locationId);
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

      {/* Delete Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد أنك تريد حذف هذا الموقع؟ لا يمكن التراجع عن هذا
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

export const locationColumns: ColumnDef<Location>[] = [
  {
    accessorKey: 'mapUrl',
    header: 'الخريطة',
    cell: ({ row }) => {
      const mapUrl = row.getValue('mapUrl') as string;
      return (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border-2 border-blue-100"
        >
          <MapPin className="w-6 h-6 text-blue-600" />
        </a>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'الاسم',
    cell: ({ row }) => {
      const name = row.getValue('name') as { en: string; ar: string };
      const parentId = row.original.parentId;
      return (
        <div>
          {parentId && <span className="text-gray-400 ml-2">└─</span>}
          <div>
            <p className="font-semibold text-gray-800">{name.ar}</p>
            <p className="text-sm text-gray-500">{name.en}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'النوع',
    cell: ({ row }) => {
      const type = row.getValue('type') as { en: string; ar: string };
      return (
        <div>
          <p className="font-medium text-gray-700">{type.ar}</p>
          <p className="text-xs text-gray-500">{type.en}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'الوصف',
    cell: ({ row }) => {
      const description = row.getValue('description') as {
        en: string;
        ar: string;
      };
      return (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 truncate">{description.ar}</p>
          <p className="text-xs text-gray-500 truncate">{description.en}</p>
        </div>
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
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{tags.length - 3}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'parentId',
    header: 'نوع الموقع',
    cell: ({ row }) => {
      const parentId = row.getValue('parentId') as string | undefined;
      return (
        <div className="text-center">
          {parentId ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              موقع فرعي
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              موقع رئيسي
            </span>
          )}
        </div>
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
      const locationId = row.original._id;
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell locationId={locationId} onEdit={onEdit} />;
    },
  },
];
