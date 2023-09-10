'use client'

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { useParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { columns, type OrderColumn } from '../components/columns'
import { ApiList } from "@/components/ui/api-list"




interface OrderClientProps
{
    data: OrderColumn[]
}

const OrderClient: React.FC<OrderClientProps> = ( { data } ) =>
{
    const router = useRouter()
    const params = useParams()
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Orders (${ data.length })`}
                    description="Manage orders for your store"
                />

            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="phone" />





        </>
    )
}

export default OrderClient