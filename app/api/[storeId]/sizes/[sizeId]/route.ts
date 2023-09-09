import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function PATCH (
    req: Request,
    { params }: { params: {sizeId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { sizeId, storeId } = params
        const { name, value } = body

        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        if (!name )
        { 
            return new NextResponse('Name is required', {status:400} )
        }
        if (!value )
        { 
            return new NextResponse('Value is required', {status:400} )
        }
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !sizeId )
        { 
            return new NextResponse('Size is required', {status:400} )
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
        
        const billboard = await prismadb.size.updateMany( {
            where: {
                id: sizeId
            },
            data: {
                name,
                value
            }
            
        } )
        return NextResponse.json( billboard )
    } catch ( error )
    {
        console.log( '[SIZE_PATCH]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {sizeId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
       
        const { storeId, sizeId } = params
       
        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !sizeId )
        { 
            return new NextResponse('Size is required', {status:400} )
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

        
        const size = await prismadb.size.deleteMany( {
            where: {
                id: sizeId
            }
            
        } )
        return NextResponse.json( size )
    } catch ( error )
    {
        console.log( '[SIZE_DELETE]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function GET (
    req: Request,
    { params }: { params: {sizeId: string} }
)
{
    try
    {
        
        const { sizeId } = params
       
        
        if ( !sizeId )
        { 
            return new NextResponse('Size is required', {status:400} )
        }
        
        const size = await prismadb.size.findUnique( {
            where: {
                id: sizeId
            }
            
        } )
        return NextResponse.json( size )
    } catch ( error )
    {
        console.log( '[SIZE_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}