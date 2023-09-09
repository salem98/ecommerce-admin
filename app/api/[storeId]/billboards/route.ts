import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'
import { useParams } from 'next/navigation'


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

        
        const billboard = await prismadb.billboard.create( {
                data: {
                    label,
                    imageURL,
                    storeId: params.storeId
                }
        } )
        console.log(billboard)
        
        return NextResponse.json( billboard )
    } catch ( error )
    {
        console.log( '[BILLBOARD_POST]', error )
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
        

        
        const billboard = await prismadb.billboard.findMany( {
               where: {
                    storeId: params.storeId
                }
        } )
       
        
        return NextResponse.json( billboard )
    } catch ( error )
    {
        console.log( '[BILLBOARD_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}