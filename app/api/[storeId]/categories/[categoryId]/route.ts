import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function PATCH (
    req: Request,
    { params }: { params: {categoryId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { categoryId, storeId } = params
        const { name, billboardId } = body

        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        if (!name )
        { 
            return new NextResponse('Label is required', {status:400} )
        }
        if (!billboardId )
        { 
            return new NextResponse('Billboard id is required', {status:400} )
        }
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !categoryId )
        { 
            return new NextResponse('Category is required', {status:400} )
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
        
        const category = await prismadb.category.updateMany( {
            where: {
                id: categoryId
            },
            data: {
                name,
                billboardId
            }
            
        } )
        return NextResponse.json( category )
    } catch ( error )
    {
        console.log( '[CATEGORY_PATCH]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {categoryId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
       
        const { storeId, categoryId } = params
       
        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !categoryId )
        { 
            return new NextResponse('Category is required', {status:400} )
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

        
        const category = await prismadb.category.deleteMany( {
            where: {
                id: categoryId
            }
            
        } )
        return NextResponse.json( category )
    } catch ( error )
    {
        console.log( '[CATEGORY_DELETE]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function GET (
    req: Request,
    { params }: { params: {categoryId: string} }
)
{
    try
    {
        
        const { categoryId } = params
       
        
        if ( !categoryId )
        { 
            return new NextResponse('Category is required', {status:400} )
        }
        
        const category = await prismadb.category.findUnique( {
            where: {
                id: categoryId
            }, include: {
                billboard: true
            }
            
        } )
        return NextResponse.json( category )
    } catch ( error )
    {
        console.log( '[CATEGORY_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}