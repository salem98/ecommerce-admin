"use client"


import { BillboardColumn } from "../components/columns"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import
{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import AlertModal from "@/components/modals/alert-modal"


interface CellActionProps
{
    data: BillboardColumn
}

export const CellAction: React.FC<CellActionProps> = ( { data } ) =>
// ...
{
    const [open, setOpen] = useState( false )
    const [loading, setLoading] = useState( false )
    const router = useRouter()
    const params = useParams()
    const onCopy = () =>
    {
        navigator.clipboard.writeText( data.id )
        toast.success( "Billboard Id Copied" )
    }
    const onUpdate = ( bilboardId: string ) =>
    {
        router.push( `/${ params.storeId }/billboards/${ bilboardId }` )
    }
    const onDelete = async () =>
    {
        try
        {

            setLoading( true )
            await axios.delete( `/api/${ params.storeId }/billboards/${ data.id }` )
            router.refresh()
            //router.push( '/' )
            toast.success( `Billboard deleted` )
        } catch ( error )
        {
            toast.error( "Make sure you removed all categories using this billboard" )
        } finally
        {
            setLoading( false )
            setOpen( false )
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen( false )}
                onConfirm={onDelete}
                loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={onCopy}
                    >
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => onUpdate( data.id )}
                    >
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => { setOpen( true ) }}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>

    )
}

// ...

