"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type ColorColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

export const columns: ColumnDef<ColorColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    }, {
        accessorKey: "value",
        header: "Value",
        cell: ( { row } ) =>
        {
            const color = row.original.value
            return (
                <div className="flex items-center gap-x-2">
                    <div
                        className="h-6 w-6 rounded-full border"
                        style={{ backgroundColor: color }}
                    />
                </div>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "action",
        cell: ( { row } ) =>
        {
            const columns = row.original
            return (
                <CellAction data={columns} />
            )
        }

    }

]
