import React, { useState } from 'react'
import { BookPlus, Info, PlusIcon, Search } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Group } from '@/types';
import JoinGroupModal from '@/components/groups/JoinGroupModal';


const Toolbar = () => {
    const groups = usePage().props.groups as Group[] || [];
    const [open, setOpen] = useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <JoinGroupModal open={open} onClose={() => setOpen(false)} />
            <nav className='flex justify-between items-center bg-primary/80 p-1.5'>
                <div className='flex flex-1 items-center'>
                    <a
                        href={route("dashboard")}
                        className="flex items-center"
                    >
                        <i className="mr-2 text-2xl fa-solid fa-graduation-cap"></i>
                    </a>
                </div>
                <div className='min-w-[280px] max-[642px] grow-[2] shrink'>
                    <Button size={"sm"} className='justify-start bg-accent/25 hover:bg-accent/25 px-2 w-full h-7 text-white' >
                        <Search className='mr-2 w-4 h-4' />
                        <span className='flex items-center gap-1 text-xs'>
                            Search Groups
                            <kbd className="inline-flex items-center gap-1 bg-[#141415]/50 opacity-100 px-1.5 border rounded h-5 font-mono font-medium text-[10px] text-muted-foreground pointer-events-none select-none">
                                ⌘ K
                            </kbd>
                        </span>
                    </Button>
                </div>
                <div className='flex flex-1 justify-end items-center ml-auto'>
                    <Button variant="secondary" className='bg-muted/90 hover:bg-muted/60 text-white' onClick={() => setOpen(true)}>
                        <PlusIcon className='size-5' />
                    </Button>
                </div>
            </nav>
        </>
    )
}

export default Toolbar