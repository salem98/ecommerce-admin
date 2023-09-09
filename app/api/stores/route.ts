import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import prismadb from '@/lib/prismadb'

export async function POST (
    req:Request,
)
{
    try
    {
        const { userId } = auth()  
        const body = await req.json()
        const { name } = body
        
        console.log( 'userId: ' + userId )
        if ( !userId )
        { 
            return new NextResponse('Unauthorized', {status:403} )
        }
        if (!name )
        { 
            return new NextResponse('Name is required', {status:400} )
        }

        
        const store = await prismadb.store.create( {
                data: {
                    name,
                    userId 
                }
        } )
       
        
        return NextResponse.json( store )
    } catch ( error )
    {
        console.log( '[STORES_POST]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}

export async function GET (
    req:Request,
)
{
    /*
    INFO: Clerk: The request to /api/stores is being redirected because there is no signed-in user, and the path is not included in `ignoredRoutes` or `publicRoutes`. To prevent this behavior, choose one of:

1. To make the route accessible to both signed in and signed out users, pass `publicRoutes: ["/api/stores"]` to authMiddleware
2. To prevent Clerk authentication from running at all, pass `ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)", "/api/stores"]` to authMiddleware
3. Pass a custom `afterAuth` to authMiddleware, and replace Clerk's default behavior of redirecting unless a route is included in publicRoutes

For additional information about middleware, please visit https://clerk.com/docs/nextjs/middleware
*/
    try
    {
        

        
        const store = await prismadb.store.findMany( {
                
        } )
       
        
        return NextResponse.json( store )
    } catch ( error )
    {
        console.log( '[STORES_GET]', error )
        return new NextResponse( "Interal error", {status:500} )    
    }
}