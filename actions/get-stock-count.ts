import prismadb from "@/lib/prismadb"


const getStockCount = async ( storeId: string ) =>
{
    const totalStockCount = await prismadb.product.count( {
        where: {
            storeId: storeId,
            isArchived: false
        }
        
    } )
    return totalStockCount
   
 }

export default getStockCount