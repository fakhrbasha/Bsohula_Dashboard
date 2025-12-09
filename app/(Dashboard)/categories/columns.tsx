import {
  Category,
  useDeleteCategoryMutation,
} from '@/redux/features/categores/categoresApi';
import { ColumnDef } from '@tanstack/react-table';
import { MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ActionsProps {
  categoryId: string;
  onEdit: (id: string) => void;
}

const ActionsCell = ({ categoryId, onEdit }: ActionsProps) => {
  const [deleteCategory] = useDeleteCategoryMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryId).unwrap();
      setShowDialog(false);
      setShowDropdown(false);
    } catch (err) {
      console.error('خطأ في الحذف:', err);
      alert('حدث خطأ في حذف التصنيف');
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
                onEdit(categoryId);
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
              هل أنت متأكد أنك تريد حذف هذا التصنيف؟ لا يمكن التراجع عن هذا
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

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: 'iconUrl',
    header: 'الصورة',
    cell: ({ row }) => {
      const iconUrl = row.getValue('iconUrl') as string;
      return (
        <img
          src={iconUrl}
          alt="Category"
          className="w-12 h-12 rounded-lg object-cover border-2 border-gray-100"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/48?text=صورة';
          }}
        />
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
    accessorKey: 'parentId',
    header: 'التصنيف الأب',
    cell: ({ row }) => {
      const parentId = row.getValue('parentId') as string | undefined;
      return (
        <div className="text-center">
          {parentId ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              تصنيف فرعي
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              تصنيف رئيسي
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
      const categoryId = row.original._id;
      // سيتم تمرير دالة onEdit من الصفحة الرئيسية
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell categoryId={categoryId} onEdit={onEdit} />;
    },
  },
];
