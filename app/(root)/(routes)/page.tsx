'use client'
import { Button } from "@/components/ui/button"
//import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import useStoreModal from "@/hooks/use-store-modal"
import { UserButton } from "@clerk/nextjs"
import { useEffect } from "react"

//
const BlankHome = () =>
{
    const onOpen = useStoreModal( ( state ) => state.onOpen )
    const isOpen = useStoreModal( ( state ) => state.isOpen )


    useEffect( () =>
    {
        if ( !isOpen )
        {
            onOpen()
        }
    }, [isOpen, onOpen] )

    return null

}

export default BlankHome
// <UserButton afterSignOutUrl="/" />
//<Modal title='Test' isOpen onClose={() => { }}> Children </Modal>

/*<Modal description='description' title='Test' isOpen onClose={() => { }}>
                Children
            </Modal>
            */

/*
  return (
<div className="p-4">
<UserButton afterSignOutUrl="/" />
</div>

)*/