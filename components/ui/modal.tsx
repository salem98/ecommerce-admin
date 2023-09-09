'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"

interface ModalProps
{
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ( { title, description, isOpen, onClose, children } ) =>
{
    const onChange = ( open: boolean ) =>
    {
        if ( !open ) return onClose()
    }
    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogHeader>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </DialogHeader>
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )

}