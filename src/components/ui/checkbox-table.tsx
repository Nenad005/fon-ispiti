"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect } from "react"

const dataMock: Exam[] = [
    {
        id: "Matematika 1P",
        subject: "Matematika 1",
        type: "P"
    },
    {
        id: "Matematika 1U",
        subject: "Matematika 1",
        type: "U"
    },
    {
        id: "Principi ProgramiranjaU",
        subject: "Principi Programiranja",
        type: "U"
    },
    {
        id: "Matematika 2P",
        subject: "Matematika 2",
        type: "P"
    },
    {
        id: "Matematika 2U",
        subject: "Matematika 2",
        type: "U"
    },
    {
        id: "Principi ProgramiranjaP",
        subject: "Principi Programiranja",
        type: "P"
    },
    {
        id: "Osnovi ElektrotehnikeP",
        subject: "Osnovi Elektrotehnike",
        type: "P"
    },
    {
        id: "Osnovi ElektrotehnikeU",
        subject: "Osnovi Elektrotehnike",
        type: "U"
    },
    {
        id: "FizikaP",
        subject: "Fizika",
        type: "P"
    },
    {
        id: "FizikaU",
        subject: "Fizika",
        type: "U"
    },
    {
        id: "Algoritmi i Strukture PodatakaP",
        subject: "Algoritmi i Strukture Podataka",
        type: "P"
    },
    {
        id: "Algoritmi i Strukture PodatakaU",
        subject: "Algoritmi i Strukture Podataka",
        type: "U"
    },
    {
        id: "Matematika 3P",
        subject: "Matematika 3",
        type: "P"
    },
    {
        id: "Matematika 3U",
        subject: "Matematika 3",
        type: "U"
    },
    {
        id: "Baze PodatakaP",
        subject: "Baze Podataka",
        type: "P"
    },
    {
        id: "Baze PodatakaU",
        subject: "Baze Podataka",
        type: "U"
    }
]

export type Exam = {
    id: string
    subject: string
    type: string
}

export const columns: ColumnDef<Exam>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex justify-start items-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    disabled={true}
                    aria-label="Izabrano"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-start items-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Izaberi ispit"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "subject",
        header: ({column}) => <Button 
            variant={"ghost"} 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Predmet
                <ArrowUpDown/>
            </Button>,
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("subject")}</div>
        ),
    },
    {
        accessorKey: "type",
        header: () => <div className="text-right">Tip</div>,
        cell: ({ row }) => <div className="flex flex-row justify-end">
            <div className={`text-right w-6 h-6 font-semibold rounded-[50%] flex items-center justify-center
                ${row.getValue("type") == "P" ? "bg-green-400" 
                : row.getValue("type") == "U" ? "bg-blue-400"
                : "bg-yellow-400"}`}
            >
                {row.getValue("type")}
            </div>
        </div>
    },
]

export function DataTableDemo({rowSelection, setRowSelection, data} : {data: Exam[], rowSelection: {}, setRowSelection: React.Dispatch<React.SetStateAction<{}>>}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    // const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: data,
        columns,
        paginateExpandedRows: false,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: data.length
            }
        }
    })

    useEffect(() => {
        // table.setPageSize(table.getPreFilteredRowModel().rows.length)
    }, [])

    return (
        <div className="w-full relative">
            {/* <Button onClick={() => {console.log(rowSelection)}}></Button> */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filtriraj ispite..."
                    value={(table.getColumn("subject")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("subject")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="sticky">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Nema rezultata.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getSelectedRowModel().rows.length} od{" "}
                    {table.getPreFilteredRowModel().rows.length} ispit(a) izabran(o).
                </div>
            </div>
        </div>
    )
}
