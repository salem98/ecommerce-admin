import prismadb from "@/lib/prismadb"
import ProductClient from "./components/client"
import { ProductColumn } from "./components/columns"
import { format } from 'date-fns'
import { formatter } from "@/lib/utils"


const ProductsPage = async ( { params }: { params: { storeId: string } } ) =>
//const SettingsPage: React.FC<SettingsPageProps> = ( { params} ) =>
{
    const products = await prismadb.product.findMany( {
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    } )
    const formattedProducts: ProductColumn[] = products.map( product =>
    {
        return (
            {
                id: product.id,
                name: product.name,
                price: formatter.format( product.price.toNumber() ),
                category: product.category.name,
                size: product.size.name,
                color: product.color.value,
                isFeatured: product.isFeatured,
                isArchived: product.isArchived,
                createdAt: format( product.createdAt, "MMMM do, yyyy" )
            }
        )
    } )
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>

        </div>
    )
}

export default ProductsPage