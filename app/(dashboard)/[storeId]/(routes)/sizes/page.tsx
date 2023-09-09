import prismadb from "@/lib/prismadb"
import BillboardClient from "./components/client"
import { SizeColumn } from "./components/columns"
import { format } from 'date-fns'
import SizeClient from "./components/client"


const SizesPage = async ( { params }: { params: { storeId: string } } ) =>
//const SettingsPage: React.FC<SettingsPageProps> = ( { params} ) =>
{
    const sizes = await prismadb.size.findMany( {
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    } )
    const formattedSizes: SizeColumn[] = sizes.map( size =>
    {
        return (
            {
                id: size.id,
                name: size.name,
                value: size.value,
                createdAt: format( size.createdAt, "MMMM do, yyyy" )
            }
        )
    } )
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedSizes} />
            </div>

        </div>
    )
}

export default SizesPage