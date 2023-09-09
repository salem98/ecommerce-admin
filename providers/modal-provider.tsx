'use client'

import { StoreModal } from "@/components/modals/store-modal"
import { useEffect, useState } from "react"

//en lugar de usar directamente el StoreModal, para evitar que de error de servidor se hace este truco con el useEffect
export const ModalProvider = () =>

    {
        const [isMounted, setIsMounted] = useState( false )

        useEffect( () =>
        {
            setIsMounted( true )

        }, [] )

        //para evitar hydration error
        //no se activa a menos que se ejecute en useEffect que solo para en el cliente
        if ( !isMounted )
        {
            return null
        }
        return (
            <>
                <StoreModal />
            </>
        )
    }