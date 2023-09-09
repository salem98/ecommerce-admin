import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { storeId } = params
        //const pathname = usePathname()
        //const params = useParams()
        const { name } = body

        if ( !userId )
        { 
            return new NextResponse('Unauthorized', {status:401} )
        }
        if (!name )
        { 
            return new NextResponse('Name is required', {status:400} )
        }
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }

        
        const store = await prismadb.store.updateMany( {
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
            
        } )
        return NextResponse.json( store )
    } catch ( error )
    {
        console.log( '[STORES_PATCH]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string} }
)
{
    try
    {
        const { userId } = auth()  
       
        const { storeId } = params
       
        if ( !userId )
        { 
            return new NextResponse('Unauthorized', {status:401} )
        }
      
        if ( !storeId )
        { 
            return new NextResponse('Store is required', {status:400} )
        }

        
        const store = await prismadb.store.deleteMany( {
            where: {
                id: storeId,
                userId
            }
            
        } )
        return NextResponse.json( store )
    } catch ( error )
    {
        console.log( '[STORES_DELETE]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

