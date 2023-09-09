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

        
        const size = await prismadb.color.create( {
                data: {
                    name,
                    value,
                    storeId: params.storeId
                }
        } )
        console.log(size)
        
        return NextResponse.json( size )
    } catch ( error )
    {
        console.log( '[COLOR_POST]', error )
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
        

        
        const size = await prismadb.color.findMany( {
               where: {
                    storeId: params.storeId
                }
        } )
       
        
        return NextResponse.json( size )
    } catch ( error )
    {
        console.log( '[COLOR_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}