import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function PATCH (
    req: Request,
    { params }: { params: {productId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { productId, storeId } = params
        const { 
            name,
            price,
            colorId,
            categoryId,
            sizeId,
            images,
            isFeatured,
            isArchived
        
        } = body
        

        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        if (!name )
        { 
            return new NextResponse('Name is required', {status:400} )
        }
        if (!colorId )
        { 
            return new NextResponse('Color is required', {status:400} )
        }
        if (!categoryId )
        { 
            return new NextResponse('Category is required', {status:400} )
        }
        if (!sizeId )
        { 
            return new NextResponse('Size is required', {status:400} )
        }
        if (!price )
        { 
            return new NextResponse('Price is required', {status:400} )
        }
        if (!images || !images.length )
        { 
            return new NextResponse('Images are required', {status:400} )
        }
        if (!storeId )
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
        
        await prismadb.product.update( {
            where: {
                id: productId
            },
            data: {
                name,
                price,
                colorId,
                categoryId,
                sizeId,
                images: { deleteMany: {} },
                isFeatured,
                isArchived,
                storeId: params.storeId
            }
            
        } )
        const product = await prismadb.product.update( {
            where: {
                id: productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map( ( image: { url: string } ) => image )
                        ]
                    }
                }
            }
            
        } )
        return NextResponse.json( product )
    } catch ( error )
    {
        console.log( '[PRODUCT_PATCH]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {productId: string, storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
       
        const { storeId, productId } = params
       
        if ( !userId )
        { 
            return new NextResponse('Unauthenticated', {status:401} )
        }
        
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }
        if ( !productId )
        { 
            return new NextResponse('Product is required', {status:400} )
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

        
        const product = await prismadb.product.deleteMany( {
            where: {
                id: productId
            }
            
        } )
        return NextResponse.json( product )
    } catch ( error )
    {
        console.log( '[PRODUCT_DELETE]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

        

export async function GET (
    req: Request,
    { params }: { params: {productId: string} }
)
{
    try
    {
        
        const { productId } = params
       
        
        if ( !productId )
        { 
            return new NextResponse('Product is required', {status:400} )
        }
        
        const product = await prismadb.product.findUnique( {
            where: {
                id: productId
            },
            include: {
                images: true,
                category:true,
                color: true,
                size: true
            }
            
        } )
        return NextResponse.json( product )
    } catch ( error )
    {
        console.log( '[PRODUCT_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}