import prismadb from "@/lib/prismadb"


const getSalesCount = async ( storeId: string ) =>
{
    const totalPaidOrders = await prismadb.order.count( {
        where: {
            storeId: storeId,
            isPaid: true
        }
        
    } )
    return totalPaidOrders
   
 }

export default getSalesCount