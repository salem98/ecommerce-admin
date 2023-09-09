import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function PATCH (
    req: Request,
    { params }: { params: {colorId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { colorId, storeId } = params
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
        if ( !colorId )
        { 
            return new NextResponse('Color is required', {status:400} )
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
        
        const color = await prismadb.color.updateMany( {
            where: {
                id: colorId
            },
            data: {
                name,
                value
            }
            
        } )
        return NextResponse.json( color )
    } catch ( error )
    {
        console.log( '[COLOR_PATCH]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {colorId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
       
        const { storeId, colorId } = params
       
        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !colorId )
        { 
            return new NextResponse('Color is required', {status:400} )
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

        
        const color = await prismadb.color.deleteMany( {
            where: {
                id: colorId
            }
            
        } )
        return NextResponse.json( color )
    } catch ( error )
    {
        console.log( '[COLOR_DELETE]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function GET (
    req: Request,
    { params }: { params: {colorId: string} }
)
{
    try
    {
        
        const { colorId } = params
       
        
        if ( !colorId )
        { 
            return new NextResponse('Color is required', {status:400} )
        }
        
        const size = await prismadb.color.findUnique( {
            where: {
                id: colorId
            }
            
        } )
        return NextResponse.json( size )
    } catch ( error )
    {
        console.log( '[COLOR_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}