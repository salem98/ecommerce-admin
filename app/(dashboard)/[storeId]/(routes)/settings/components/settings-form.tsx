'use client'
import AlertModal from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import useOrigin from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from 'zod'




interface SettingsFormProps
{
    params: {
        initialData: Store

    }
}

type SettingsFormmValues = z.infer<typeof formSchema>

const formSchema = z.object(
    {
        name: z.string().min( 1 )
    }
)


export const SettingsForm = ( { params }: SettingsFormProps ) =>
{
    //Este open es para controlar el AlertModal
    const [open, setOpen] = useState( false )
    const [loading, setLoading] = useState( false )
    const form = useForm<SettingsFormmValues>(
        {
            resolver: zodResolver( formSchema ),
            defaultValues: params.initialData
        }
    )
    const urlParams = useParams()

    const router = useRouter()
    const origin = useOrigin()

    const onSubmit = async ( values: SettingsFormmValues ) =>
    {
        //Update Store 
        console.log( values )
        try
        {

            setLoading( true )
            await axios.patch( `/api/stores/${ urlParams.storeId }`, values )
            router.refresh()
            toast.success( `Store name: ${ values.name } updated successfully` )
            //Create a settings?
            //const response = await axios.post( '/api/stores', values )
        } catch ( error )
        {
            toast.error( "Something went wrong" )
        } finally { setLoading( false ) }
    }
    const onDelete = async () =>
    {

        try
        {

            setLoading( true )
            await axios.delete( `/api/stores/${ urlParams.storeId }` )
            router.refresh()
            router.push( '/' )
            toast.success( `Store deleted successfully` )
        } catch ( error )
        {
            toast.error( "Make sure you removed all products and categories first" )
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
            <div className="flex items-center justify-between">
                <Heading
                    title="Settings"
                    description="Manage store settings"

                />
                <Button
                    disabled={loading}
                    variant='destructive'
                    size="sm"
                    onClick={() => { setOpen( true ) }}
                >
                    <Trash className="h-4 w-4" />
                </Button>

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit( onSubmit )}
                    className="space-y-8 w-full"
                >
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name='name'
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading}
                                            placeholder="Store Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading}
                        className="ml-auto" type='submit'
                    >
                        Save Changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert
                title='NEXT_PUBLIC_API_URL'
                description={`${ origin }/api/${ urlParams.storeId }`}
                variant="public" />
        </>

    )
}