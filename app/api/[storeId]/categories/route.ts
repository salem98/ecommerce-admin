import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

//params sale de la ruta de folders en VSCode
export async function POST (
    req: Request,
    { params }: { params: {storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        
        const { name, billboardId } = body
        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        if (!name )
        { 
            return new NextResponse('Name is required', {status:400} )
        }
        if (!billboardId  )
        { 
            return new NextResponse('Billboard id is required', {status:400} )
        }
        if (!params.storeId )
        { 
            return new NextResponse('Store does not exist!', {status:400} )
        }
        const storeOwner = await prismadb.store.findFirst( {
            where: {
                userId,
                id: params.storeId
            }
        } )
        if (!storeOwner )
        { 
            return new NextResponse('Unauthorized', {status:403} )
        }

        console.log('Empiezo a el POST')
        const category = await prismadb.category.create( {
                data: {
                    name,
                    billboardId ,
                    storeId: params.storeId
                }
        } )
        console.log(category)
        
        return NextResponse.json( category )
    } catch ( error )
    {
        console.log( '[CATEGORY_POST]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function GET (
    req: Request,
    { params }: { params: {storeId: string} }
)
{
    try
    {
        if (!params.storeId )
        { 
            return new NextResponse('Store does not exist!', {status:400} )
        }
        const categories = await prismadb.category.findMany( {
               where: {
                    storeId: params.storeId
                }
        } )
        return NextResponse.json( categories )
    } catch ( error )
    {
        console.log( '[CATEGORY_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}