import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function PATCH (
    req: Request,
    { params }: { params: {billboardId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { billboardId, storeId } = params
        const { label, imageURL } = body

        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        if (!label )
        { 
            return new NextResponse('Label is required', {status:400} )
        }
        if (!imageURL )
        { 
            return new NextResponse('Image is required', {status:400} )
        }
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !billboardId )
        { 
            return new NextResponse('Billboard is required', {status:400} )
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
        
        const billboard = await prismadb.billboard.updateMany( {
            where: {
                id: billboardId
            },
            data: {
                label,
                imageURL
            }
            
        } )
        return NextResponse.json( billboard )
    } catch ( error )
    {
        console.log( '[BILLBOARD_PATCH]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {billboardId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
       
        const { storeId, billboardId } = params
       
        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !billboardId )
        { 
            return new NextResponse('Billboard is required', {status:400} )
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

        
        const billboard = await prismadb.billboard.deleteMany( {
            where: {
                id: billboardId
            }
            
        } )
        return NextResponse.json( billboard )
    } catch ( error )
    {
        console.log( '[BILLBOARD_DELETE]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function GET (
    req: Request,
    { params }: { params: {billboardId: string} }
)
{
    try
    {
        
        const { billboardId } = params
       
        
        if ( !billboardId )
        { 
            return new NextResponse('Billboard is required', {status:400} )
        }
        
        const billboard = await prismadb.billboard.findUnique( {
            where: {
                id: billboardId
            }
            
        } )
        return NextResponse.json( billboard )
    } catch ( error )
    {
        console.log( '[BILLBOARD_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}