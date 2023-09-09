import prismadb from "@/lib/prismadb"


const getTotalRevenue = async ( storeId: string ) =>
{
    const paidOrders = await prismadb.order.findMany( {
        where: {
            storeId: storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    } )
    const getTotalRevenue = paidOrders.reduce( ( total, order ) => total+order.orderItems.reduce( ( orderTotal, item ) => orderTotal+item.product.price.toNumber(), 0 ), 0 )
    return getTotalRevenue
 }

export default getTotalRevenue