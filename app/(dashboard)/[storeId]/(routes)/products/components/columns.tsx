"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


export type ProductColumn = {
    id: string
    name: string
    price: String
    isFeatured: boolean
    isArchived: boolean
    size: string
    color: string
    category: string
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "isArchived",
        header: "Archived",
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ( { row } ) =>
        {
            const color = row.original.color
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
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: "Price",
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
