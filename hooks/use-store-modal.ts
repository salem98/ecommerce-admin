import { create } from 'zustand'

interface useStoreModalStore
{
    isOpen: boolean
    onOpen: () => void
    onClose: () => void


}

export const useStoreModal = create<useStoreModalStore>( ( set ) =>
{
    return {
        isOpen: false,
        onOpen: () => { set( { isOpen: true } ) },
        onClose: () => { set( { isOpen: false } ) }
    }
} )

export default useStoreModal