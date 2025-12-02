"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreVertical, Pencil, PlusCircle, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SortCell from "@/components/shared/SortCell";
import { TableDropdown } from "@/components/dashboard/shared/TableDropdown";
import ProductCell from "@/components/dashboard/shared/ProductCell";
import { SortDropdown } from "@/components/dashboard/shared/SortDropdown";
import DataTable from "@/components/dashboard/shared/DataTable";
import { columns, IProduct } from "./columns";
import { useTanstackTable } from "@/hooks/use-tanstack-table";

// Sample data
const data: IProduct[] = [
  {
    id: "81096124",
    price: 125.0,
    status: "success",
    email: "john.doe@example.com",
    customer: "جون دو",
    date: "2023-05-04",
    department: "المبيعات",
  },
  {
    id: "12451566",
    price: 250.5,
    status: "processing",
    email: "jane.smith@example.com",
    customer: "جين سميث",
    date: "2023-05-05",
    department: "التسويق",
  },
  {
    id: "15251252",
    price: 450.25,
    status: "success",
    email: "robert.johnson@example.com",
    customer: "روبرت جونسون",
    date: "2023-05-06",
    department: "الهندسة",
  },
  {
    id: "23623673",
    price: 550.0,
    status: "failed",
    email: "emily.davis@example.com",
    customer: "إيميلي ديفيس",
    date: "2023-05-07",
    department: "الدعم",
  },
  {
    id: "72356901",
    price: 200.75,
    status: "pending",
    email: "michael.wilson@example.com",
    customer: "مايكل ويلسون",
    date: "2023-05-08",
    department: "المبيعات",
  },
  {
    id: "17327842",
    price: 175.5,
    status: "success",
    email: "sarah.brown@example.com",
    customer: "سارة براون",
    date: "2023-05-09",
    department: "التسويق",
  },
  {
    id: "34863853",
    price: 300.0,
    status: "processing",
    email: "david.miller@example.com",
    customer: "ديفيد ميلر",
    date: "2023-05-10",
    department: "الهندسة",
  },
  {
    id: "45678904",
    price: 425.0,
    status: "success",
    email: "lisa.taylor@example.com",
    customer: "ليزا تايلور",
    date: "2023-05-11",
    department: "المبيعات",
  },
  {
    id: "56789015",
    price: 275.25,
    status: "pending",
    email: "james.anderson@example.com",
    customer: "جيمس أندرسون",
    date: "2023-05-12",
    department: "التسويق",
  },
  {
    id: "67890126",
    price: 600.75,
    status: "failed",
    email: "emma.white@example.com",
    customer: "إيما وايت",
    date: "2023-05-13",
    department: "الهندسة",
  },
  {
    id: "78901237",
    price: 150.25,
    status: "success",
    email: "william.clark@example.com",
    customer: "وليام كلارك",
    date: "2023-05-14",
    department: "الدعم",
  },
  {
    id: "89012348",
    price: 325.5,
    status: "processing",
    email: "olivia.martin@example.com",
    customer: "أوليفيا مارتن",
    date: "2023-05-15",
    department: "المبيعات",
  },
  {
    id: "90123459",
    price: 475.0,
    status: "success",
    email: "noah.thompson@example.com",
    customer: "نوح طومسون",
    date: "2023-05-16",
    department: "التسويق",
  },
  {
    id: "01234560",
    price: 225.75,
    status: "pending",
    email: "ava.garcia@example.com",
    customer: "آفا غارسيا",
    date: "2023-05-17",
    department: "الهندسة",
  },
  {
    id: "12345671",
    price: 550.25,
    status: "failed",
    email: "ethan.rodriguez@example.com",
    customer: "إيثان رودريغيز",
    date: "2023-05-18",
    department: "الدعم",
  },
  {
    id: "23456782",
    price: 375.0,
    status: "success",
    email: "sophia.lee@example.com",
    customer: "صوفيا لي",
    date: "2023-05-19",
    department: "المبيعات",
  },
  {
    id: "34567893",
    price: 625.5,
    status: "processing",
    email: "mason.walker@example.com",
    customer: "ماسون ووكر",
    date: "2023-05-20",
    department: "التسويق",
  },
  {
    id: "45678904",
    price: 275.25,
    status: "success",
    email: "isabella.hall@example.com",
    customer: "إيزابيلا هول",
    date: "2023-05-21",
    department: "الهندسة",
  },
  {
    id: "56789015",
    price: 400.75,
    status: "pending",
    email: "lucas.allen@example.com",
    customer: "لوكاس ألين",
    date: "2023-05-22",
    department: "الدعم",
  },
  {
    id: "67890126",
    price: 175.0,
    status: "failed",
    email: "mia.young@example.com",
    customer: "ميا يونغ",
    date: "2023-05-23",
    department: "المبيعات",
  },
  {
    id: "78901237",
    price: 525.25,
    status: "success",
    email: "alexander.king@example.com",
    customer: "ألكسندر كينغ",
    date: "2023-05-24",
    department: "التسويق",
  },
  {
    id: "89012348",
    price: 350.5,
    status: "processing",
    email: "charlotte.wright@example.com",
    customer: "شارلوت رايت",
    date: "2023-05-25",
    department: "الهندسة",
  },
  {
    id: "90123459",
    price: 450.0,
    status: "success",
    email: "henry.lopez@example.com",
    customer: "هنري لوبيز",
    date: "2023-05-26",
    department: "الدعم",
  },
  {
    id: "01234560",
    price: 200.75,
    status: "pending",
    email: "amelia.hill@example.com",
    customer: "أميليا هيل",
    date: "2023-05-27",
    department: "المبيعات",
  },
  {
    id: "12345671",
    price: 575.25,
    status: "failed",
    email: "sebastian.scott@example.com",
    customer: "سيباستيان سكوت",
    date: "2023-05-28",
    department: "التسويق",
  },
  {
    id: "23456782",
    price: 325.0,
    status: "success",
    email: "victoria.green@example.com",
    customer: "فيكتوريا غرين",
    date: "2023-05-29",
    department: "الهندسة",
  },
  {
    id: "34567893",
    price: 650.5,
    status: "processing",
    email: "jack.adams@example.com",
    customer: "جاك آدمز",
    date: "2023-05-30",
    department: "الدعم",
  },
  {
    id: "45678904",
    price: 250.25,
    status: "success",
    email: "scarlett.baker@example.com",
    customer: "سكارليت بيكر",
    date: "2023-05-31",
    department: "المبيعات",
  },
  {
    id: "56789015",
    price: 425.75,
    status: "pending",
    email: "owen.gonzalez@example.com",
    customer: "أوين غونزاليس",
    date: "2023-06-01",
    department: "التسويق",
  },
  {
    id: "67890126",
    price: 500.0,
    status: "failed",
    email: "zoey.nelson@example.com",
    customer: "زوي نيلسون",
    date: "2023-06-02",
    department: "الهندسة",
  },
  {
    id: "78901237",
    price: 375.25,
    status: "success",
    email: "gabriel.carter@example.com",
    customer: "غابرييل كارتر",
    date: "2023-06-03",
    department: "الدعم",
  },
  {
    id: "89012348",
    price: 275.5,
    status: "processing",
    email: "madison.mitchell@example.com",
    customer: "ماديسون ميتشل",
    date: "2023-06-04",
    department: "المبيعات",
  },
  {
    id: "90123459",
    price: 600.0,
    status: "success",
    email: "leo.perez@example.com",
    customer: "ليو بيريز",
    date: "2023-06-05",
    department: "التسويق",
  },
  {
    id: "01234560",
    price: 225.75,
    status: "pending",
    email: "penelope.roberts@example.com",
    customer: "بينيلوبي روبرتس",
    date: "2023-06-06",
    department: "الهندسة",
  },
  {
    id: "12345671",
    price: 525.25,
    status: "failed",
    email: "julian.turner@example.com",
    customer: "جوليان تيرنر",
    date: "2023-06-07",
    department: "الدعم",
  },
  {
    id: "23456782",
    price: 350.0,
    status: "success",
    email: "claire.phillips@example.com",
    customer: "كلير فيليبس",
    date: "2023-06-08",
    department: "المبيعات",
  },
  {
    id: "34567893",
    price: 675.5,
    status: "processing",
    email: "maxwell.campbell@example.com",
    customer: "ماكسويل كامبل",
    date: "2023-06-09",
    department: "التسويق",
  },
  {
    id: "45678904",
    price: 300.25,
    status: "success",
    email: "audrey.parker@example.com",
    customer: "أودري باركر",
    date: "2023-06-10",
    department: "الهندسة",
  },
  {
    id: "56789015",
    price: 450.75,
    status: "pending",
    email: "thomas.evans@example.com",
    customer: "توماس إيفانز",
    date: "2023-06-11",
    department: "الدعم",
  },
  {
    id: "67890126",
    price: 550.0,
    status: "failed",
    email: "lucy.edwards@example.com",
    customer: "لوسي إدواردز",
    date: "2023-06-12",
    department: "المبيعات",
  },
  {
    id: "78901237",
    price: 400.25,
    status: "success",
    email: "christopher.collins@example.com",
    customer: "كريستوفر كولينز",
    date: "2023-06-13",
    department: "التسويق",
  },
  {
    id: "89012348",
    price: 325.5,
    status: "processing",
    email: "elena.stewart@example.com",
    customer: "إيلينا ستيوارت",
    date: "2023-06-14",
    department: "الهندسة",
  },
  {
    id: "90123459",
    price: 625.0,
    status: "success",
    email: "nathan.morris@example.com",
    customer: "ناثان موريس",
    date: "2023-06-15",
    department: "الدعم",
  },
  {
    id: "01234560",
    price: 275.75,
    status: "pending",
    email: "hannah.murphy@example.com",
    customer: "حنا مورفي",
    date: "2023-06-16",
    department: "المبيعات",
  },
  {
    id: "12345671",
    price: 500.25,
    status: "failed",
    email: "adrian.rogers@example.com",
    customer: "أدريان روجرز",
    date: "2023-06-17",
    department: "التسويق",
  },
  {
    id: "23456782",
    price: 375.0,
    status: "success",
    email: "sophie.reed@example.com",
    customer: "صوفي ريد",
    date: "2023-06-18",
    department: "الهندسة",
  },
  {
    id: "34567893",
    price: 700.5,
    status: "processing",
    email: "isaac.cook@example.com",
    customer: "إسحاق كوك",
    date: "2023-06-19",
    department: "الدعم",
  },
  {
    id: "45678904",
    price: 350.25,
    status: "success",
    email: "ruby.morgan@example.com",
    customer: "روبي مورغان",
    date: "2023-06-20",
    department: "المبيعات",
  },
  {
    id: "56789015",
    price: 475.75,
    status: "pending",
    email: "ryan.bell@example.com",
    customer: "ريان بيل",
    date: "2023-06-21",
    department: "التسويق",
  },
  {
    id: "67890126",
    price: 575.0,
    status: "failed",
    email: "julia.sanders@example.com",
    customer: "جوليا ساندرز",
    date: "2023-06-22",
    department: "الهندسة",
  },
  {
    id: "78901237",
    price: 425.25,
    status: "success",
    email: "dominic.price@example.com",
    customer: "دومينيك برايس",
    date: "2023-06-23",
    department: "الدعم",
  },
  {
    id: "89012348",
    price: 350.5,
    status: "processing",
    email: "grace.wood@example.com",
    customer: "غريس وود",
    date: "2023-06-24",
    department: "المبيعات",
  },
  {
    id: "90123459",
    price: 650.0,
    status: "success",
    email: "felix.barnes@example.com",
    customer: "فيليكس بارنز",
    date: "2023-06-25",
    department: "التسويق",
  },
  {
    id: "01234560",
    price: 300.75,
    status: "pending",
    email: "violet.ross@example.com",
    customer: "فيوليت روس",
    date: "2023-06-26",
    department: "الهندسة",
  },
  {
    id: "12345671",
    price: 525.25,
    status: "failed",
    email: "oscar.henderson@example.com",
    customer: "أوسكار هندرسون",
    date: "2023-06-27",
    department: "الدعم",
  },
  {
    id: "23456782",
    price: 400.0,
    status: "success",
    email: "stella.coleman@example.com",
    customer: "ستيلا كولمان",
    date: "2023-06-28",
    department: "المبيعات",
  },
  {
    id: "34567893",
    price: 725.5,
    status: "processing",
    email: "xavier.jenkins@example.com",
    customer: "كزافييه جنكينز",
    date: "2023-06-29",
    department: "التسويق",
  },
  {
    id: "45678904",
    price: 375.25,
    status: "success",
    email: "iris.howard@example.com",
    customer: "آيريس هوارد",
    date: "2023-06-30",
    department: "الهندسة",
  },
];

const SearchMechanisms = [
  { label: "رقم المنتج", value: "id" },
  { label: "البريد الإلكتروني", value: "email" },
  { label: "اسم العميل", value: "customer" },
];

const SORT_OPTIONS = [
  { label: "الأحدث أولاً", value: "newest" },
  { label: "الأقدم أولاً", value: "oldest" },
  { label: "السعر: من الأعلى إلى الأقل", value: "price-desc" },
  { label: "السعر: من الأقل إلى الأعلى", value: "price-asc" },
  { label: "الكمية: من الأعلى إلى الأقل", value: "quantity-desc" },
  { label: "الكمية: من الأقل إلى الأعلى", value: "quantity-asc" },
];

export default function ProductsPage() {
  // States and Hooks
  const [searchMechanism, setSearchMechanism] = useState(SearchMechanisms[0]);
  const { table, setSorting, getSearchVal, setSearchVal } = useTanstackTable({
    columns,
    data,
    features: ["sort", "selection", "pagination", "multiSelection", "filter"],
  });

  // Functions
  const handleSortChange = (value: string) => {
    switch (value) {
      case "newest":
        setSorting([{ id: "createdAt", desc: true }]);
        break;
      case "oldest":
        setSorting([{ id: "createdAt", desc: false }]);
        break;
      case "price-desc":
        setSorting([{ id: "price", desc: true }]);
        break;
      case "price-asc":
        setSorting([{ id: "price", desc: false }]);
        break;
      case "quantity-desc":
        setSorting([{ id: "quantity", desc: true }]);
        break;
      case "quantity-asc":
        setSorting([{ id: "quantity", desc: false }]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full px-2 md:px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between flex-col gap-2 sm:flex-row  border-y py-2 mb-4">
        <h1 className="text-32 font-semibold">المنتجات</h1>
        <Button
          icon={<PlusCircle />}
          dir="ltr"
          className="rounded-lg h-10 px-6"
        >
          اضف منتج جديد
        </Button>
      </div>
      <div className="border rounded-lg ">
        {/* Table Header */}
        <div className="flex items-center gap-4 md:gap-0 flex-col md:flex-row-reverse justify-between p-4">
          <div className="flex gap-2 self-start md:self-end">
            <Select
              defaultValue={SearchMechanisms[0].value}
              onValueChange={(value) =>
                setSearchMechanism(
                  SearchMechanisms.find((s) => s.value === value)!
                )
              }
            >
              <SelectTrigger className="w-[110px] lg:w-[180px]">
                <SelectValue placeholder="البحث حسب" />
              </SelectTrigger>
              <SelectContent>
                {SearchMechanisms.map(({ label, value }, ix) => (
                  <SelectItem value={value} key={ix}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={`البحث عن طريق ${searchMechanism.label}...`}
              value={getSearchVal(searchMechanism.value)}
              onChange={(e) =>
                setSearchVal(searchMechanism.value, e.target.value)
              }
              className="max-w-44 lg:max-w-sm bg-gray-50 border shadow-none"
            />
          </div>

          <SortDropdown
            title="ترتيب حسب"
            onChange={handleSortChange}
            align="end"
            className="self-start md:self-end"
            sortOptions={SORT_OPTIONS}
          />
        </div>

        <DataTable table={table} />
      </div>
    </div>
  );
}
