'use client'
import AlertModal from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import useOrigin from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Color, Size } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from 'zod'




interface ColorFormProps
{
    initialData: Color | null
}

type ColorFormmValues = z.infer<typeof formSchema>

const formSchema = z.object(
    {
        name: z.string().min( 1 ),
        value: z.string().min( 4 ).regex( /^#/, {
            message: 'Color has to be a valid hex code'
        } )
    }
)


export const ColorForm = ( { initialData }: ColorFormProps ) =>
{

    //Este open es para controlar el AlertModal
    const [open, setOpen] = useState( false )
    const [loading, setLoading] = useState( false )
    const form = useForm<ColorFormmValues>(
        {
            resolver: zodResolver( formSchema ),
            defaultValues: initialData || { name: '', value: '' }
        }
    )
    const title = initialData ? "Edit color" : "Create color"
    const description = initialData ? "Edit color" : "Add a new color"
    const toastMessage = initialData ? "Color updated." : "Color created."
    const action = initialData ? "Sava changes" : "Create"
    const params = useParams()

    const router = useRouter()
    const origin = useOrigin()

    const onSubmit = async ( values: ColorFormmValues ) =>
    {
        //Create or update billboard 
        console.log( values )
        try
        {

            setLoading( true )
            //si hay datos se actualizan, sino se crean
            if ( initialData )
            {

                const resp = await axios.patch( `/api/${ params.storeId }/colors/${ params.colorId }`, values )
            } else
            {

                const resp = await axios.post( `/api/${ params.storeId }/colors`, values )

            }


            router.refresh()
            router.push( `/${ params.storeId }/colors` )
            toast.success( toastMessage )
            //Create a settings?
            //const response = await axios.post( '/api/stores', values )
        } catch ( error )
        {
            console.log( error )
            toast.error( "Something went wrong" )
        } finally { setLoading( false ) }
    }
    const onDelete = async () =>
    {

        try
        {

            setLoading( true )
            await axios.delete( `/api/${ params.storeId }/sizes/${ params.colorId }` )
            router.refresh()
            router.push( '/' )
            toast.success( `Color deleted` )
        } catch ( error )
        {
            toast.error( "Make sure you removed all products using this Color" )
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
                    title={title}
                    description={description}

                />
                {initialData && <Button
                    disabled={loading}
                    variant='destructive'
                    size="sm"
                    onClick={() => { setOpen( true ) }}
                >
                    <Trash className="h-4 w-4" />
                </Button>}


            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit( onSubmit )}
                    className="space-y-8 w-full"
                >
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
                                        placeholder="Color Name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name='value'
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>
                                        Value
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input className="w-[200px]"
                                                disabled={loading}
                                                placeholder="Color Value"
                                                {...field}
                                            />
                                            <div
                                                className="p-4 rounded-full border"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={loading}
                        className="ml-auto" type='submit'
                    >
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert
                title='NEXT_PUBLIC_API_URL'
                description={`${ origin }/api/${ params.storeId }`}
                variant="public" />
        </>

    )
}