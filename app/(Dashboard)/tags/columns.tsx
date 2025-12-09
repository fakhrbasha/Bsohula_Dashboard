import { TagItem, useDeleteTagMutation } from '@/redux/features/tags/tagsApi';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  Tag as TagIcon,
} from 'lucide-react';
import { useState } from 'react';

interface ActionsProps {
  tagId: string;
  onEdit: (id: string) => void;
}

const ActionsCell = ({ tagId, onEdit }: ActionsProps) => {
  const [deleteTag] = useDeleteTagMutation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTag(tagId).unwrap();
      setShowDialog(false);
      setShowDropdown(false);
    } catch (err) {
      console.error('خطأ في الحذف:', err);
      alert('حدث خطأ في حذف الوسم');
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
                onEdit(tagId);
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
              هل أنت متأكد أنك تريد حذف هذا الوسم؟ لا يمكن التراجع عن هذا
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

export const tagColumns: ColumnDef<TagItem>[] = [
  {
    accessorKey: 'icon',
    header: 'الأيقونة',
    cell: ({ row }) => {
      const icon = row.getValue('icon') as string;
      const colorHex = row.original.colorHex;

      return (
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2"
          style={{
            backgroundColor: `${colorHex}20`,
            borderColor: colorHex,
            color: colorHex,
          }}
        >
          {icon || '🏷️'}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'الاسم التقني',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return (
        <div className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: 'displayName',
    header: 'الاسم المعروض',
    cell: ({ row }) => {
      const displayName = row.getValue('displayName') as string;
      const colorHex = row.original.colorHex;

      // Check if displayName is a string or object
      if (typeof displayName === 'object' && displayName !== null) {
        const names = displayName as any;
        return (
          <div>
            <p className="font-semibold text-gray-800">
              {names.ar || displayName}
            </p>
            <p className="text-sm text-gray-500">{names.en || ''}</p>
          </div>
        );
      }

      return (
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: `${colorHex}15`,
            color: colorHex,
          }}
        >
          <TagIcon className="w-4 h-4" />
          {displayName}
        </span>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'الوصف',
    cell: ({ row }) => {
      const description = row.getValue('description') as
        | string
        | { en: string; ar: string };

      if (typeof description === 'object' && description !== null) {
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-700 truncate">{description.ar}</p>
            <p className="text-xs text-gray-500 truncate">{description.en}</p>
          </div>
        );
      }

      return (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 truncate">
            {description || 'لا يوجد وصف'}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'colorHex',
    header: 'اللون',
    cell: ({ row }) => {
      const colorHex = row.getValue('colorHex') as string;
      return (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm"
            style={{ backgroundColor: colorHex }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-mono text-gray-600 uppercase">
              {colorHex}
            </span>
            <span className="text-xs text-gray-400">HEX</span>
          </div>
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
    id: 'preview',
    header: 'معاينة',
    cell: ({ row }) => {
      const displayName = row.original.displayName;
      const colorHex = row.original.colorHex;
      const icon = row.original.icon;

      const name =
        typeof displayName === 'object' ? (displayName as any).ar : displayName;

      return (
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm"
          style={{
            backgroundColor: colorHex,
            color: '#ffffff',
          }}
        >
          <span className="text-lg">{icon || '🏷️'}</span>
          {name}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row }) => {
      const tagId = row.original._id;
      const onEdit = (row.original as any).onEdit || (() => {});
      return <ActionsCell tagId={tagId} onEdit={onEdit} />;
    },
  },
];
