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

export type Exam = {
    idexamSubject: string
    subjectName: string
    type: string,
    examPeriodId: string
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
            <div className="flex justify-start items-center w-4">
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
        accessorKey: "subjectName",
        header: ({column}) => <Button 
            variant={"ghost"} 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Predmet
                <ArrowUpDown/>
            </Button>,
        cell: ({ row }) => (
            <div className="w-full max-w-full overflow-x-scroll">{row.getValue("subjectName")}</div>
        ),
    },
    {
        accessorKey: "type",
        header: () => <div className="text-right">Tip</div>,
        cell: ({ row }) => <div className="flex flex-row justify-end ">
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

export function DataTableDemo({setRowSelectionData, data} : {data: Exam[], setRowSelectionData: React.Dispatch<React.SetStateAction<any>>}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    // const [rowSelection, setRowSelection] = React.useState({})

    function handleRowSelectionChange(updater: any) {
        const newValue = typeof updater === "function" ? updater(rowSelection) : updater

        const rowSelectionData = Object.keys(newValue).map((key) => data[Number(key)])

        setRowSelection(newValue)
        setRowSelectionData(rowSelectionData)
    }

    const table = useReactTable({
        data: data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
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
        setRowSelectionData([])
    }, [])

    return (
        <div className="w-full relative overflow-x-hidden">
            {/* <Button onClick={() => {console.log(rowSelection)}}></Button> */}
            <div className="flex items-center py-2">
                <Input
                    placeholder="Pretraži ispite..."
                    value={(table.getColumn("subjectName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("subjectName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden w-full rounded-md border">
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
                                    className=""
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="">
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
                    {table.getPreFilteredRowModel().rows.length} ispit(a) izabran(a).
                </div>
            </div>
        </div>
    )
}
