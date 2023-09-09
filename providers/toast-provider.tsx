'use client'

import { Toaster } from 'react-hot-toast'
//en lugar de usar directamente el StoreModal, para evitar que de error de servidor se hace este truco con el useEffect
export const ToasterProvider = () =>
{
    return <Toaster />
}