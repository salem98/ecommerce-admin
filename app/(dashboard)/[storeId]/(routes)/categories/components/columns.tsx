"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "../components/cell-action"


export type CategoryColumn = {
    id: string
    name: string
    billboardLabel: string
    createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "billboard",
        header: "Billboard",
        cell: ( { row } ) =>
        {
            const column = row.original.billboardLabel
            return (
                column
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
