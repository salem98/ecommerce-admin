"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Billboard, Category } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import
    {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
    } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object( {
    name: z.string().min( 2 ),
    billboardId: z.string().min( 1 ),
} )

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps
{
    initialData: Category | null
    billboards: Billboard[]
};

export const CategoryForm: React.FC<CategoryFormProps> = ( {
    initialData,
    billboards
} ) =>
{
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState( false )
    const [loading, setLoading] = useState( false )

    const title = initialData ? 'Edit category' : 'Create category'
    const description = initialData ? 'Edit a category.' : 'Add a new category'
    const toastMessage = initialData ? 'Category updated.' : 'Category created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<CategoryFormValues>( {
        resolver: zodResolver( formSchema ),
        defaultValues: initialData || {
            name: '',
            billboardId: '',
        }
    } )

    const onSubmit = async ( data: CategoryFormValues ) =>
    {
        try
        {
            setLoading( true )
            if ( initialData )
            {
                await axios.patch( `/api/${ params.storeId }/categories/${ params.categoryId }`, data )
            } else
            {
                await axios.post( `/api/${ params.storeId }/categories`, data )
            }
            router.refresh()
            router.push( `/${ params.storeId }/categories` )
            toast.success( toastMessage )
        } catch ( error: any )
        {
            toast.error( 'Something went wrong.' )
        } finally
        {
            setLoading( false )
        }
    }

    const onDelete = async () =>
    {
        try
        {
            setLoading( true )
            await axios.delete( `/api/${ params.storeId }/categories/${ params.categoryId }` )
            router.refresh()
            router.push( `/${ params.storeId }/categories` )
            toast.success( 'Category deleted.' )
        } catch ( error: any )
        {
            toast.error( 'Make sure you removed all products using this category first.' )
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
                <Heading title={title} description={description} />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen( true )}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map( ( billboard ) => (
                                                <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                                            ) )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
};
/*'use client'
import AlertModal from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import useOrigin from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Category } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from 'zod'




interface CategoryFormProps
{
    initialData: Category | null
    billboards: Billboard[]
}

type CategoryFormmValues = z.infer<typeof formSchema>

const formSchema = z.object(
    {
        name: z.string().min( 1 ),
        billboardId: z.string().min( 1 )
    }
)


export const CategoryForm = ( { initialData, billboards }: CategoryFormProps ) =>
{

    //Este open es para controlar el AlertModal
    const [open, setOpen] = useState( false )
    const [loading, setLoading] = useState( false )
    const form = useForm<CategoryFormmValues>(
        {
            resolver: zodResolver( formSchema ),
            defaultValues: initialData || { name: '', billboardId: '' }
        }
    )
    const title = initialData ? "Edit category" : "Create categoty"
    const description = initialData ? "Edit category" : "Add a new category"
    const toastMessage = initialData ? "Category updated." : "Category created."
    const action = initialData ? "Sava changes" : "Create"
    const params = useParams()

    const router = useRouter()
    const origin = useOrigin()

    const onSubmit = async ( values: CategoryFormmValues ) =>
    {
        //Create or update categoty 
        console.log( values )
        try
        {

            setLoading( true )
            //si hay datos se actualizan, sino se crean
            if ( initialData )
            {

                const resp = await axios.patch( `/api/${ params.storeId }/categories/${ params.categoryId }`, values )
            } else
            {
                console.log( values )
                console.log( 'http://localhost:3000/api/f2c8939b-ae4c-41a5-87ef-d71a5d4bb309/categories' )
                console.log( `/api/${ params.storeId }/categories` )
                const resp = await axios.post( `/api/${ params.storeId }/categories`, values )



            }


            router.refresh()
            router.push( `/${ params.storeId }/categories` )
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
            await axios.delete( `/api/${ params.storeId }/categories/${ params.categoryId }` )
            router.refresh()
            router.push( '/' )
            toast.success( `Category deleted` )
        } catch ( error )
        {
            toast.error( "make sure you removed all products using this category first." )
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
                                            placeholder="Category Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='billboardId'
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>
                                        Billboard
                                    </FormLabel>
                                    <Select
                                        disabled={loading}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select..."
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map( ( billboard ) =>
                                            {
                                                return (
                                                    <SelectItem
                                                        key={billboard.id} value={billboard.label}
                                                    >
                                                        {billboard.label}
                                                    </SelectItem>
                                                )
                                            } )
                                            }

                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        You can manage email addresses in your{" "}

                                    </FormDescription>
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

*/