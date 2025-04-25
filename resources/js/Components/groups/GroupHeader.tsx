import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import React from 'react'
import { ChevronDown, ListFilter, Square, SquarePen } from 'lucide-react'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/button'
import { Group } from '@/types'
import { group } from 'console'

interface GroupHeaderProps {
    group: Group
}

const WorkspaceHeader = ({ group }: GroupHeaderProps) => {
    const [preferencesOpen, setPreferencesOpen] = React.useState(false);
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const isAdmin = true
    return (
        <>
            {/* <InviteModal open={inviteOpen} setOpen={setInviteOpen} id={workspace._id} name={workspace.name} joinCode={workspace.joinCode} /> */}
            {/* <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name} id={workspace._id} /> */}
            <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className='font-semibold text-lg w-auto p-1.5 overflow-hidden'>
                            <span className='truncate'>{group.name}</span>
                            <ChevronDown className='size-4 ml-1 shrink-0' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start' className='w-64'>
                        <DropdownMenuItem className='cursor-pointer'>
                            <div className='size-9 relative overflow-hidden bg-[#616161] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
                                {group.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='truncate font-bold'>{group?.name}</p>
                                <p className='text-xs text-muted-foreground'>Active group</p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isAdmin &&
                            <>
                                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => setInviteOpen(true)}>
                                    Invite people to {group?.name}
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => setPreferencesOpen(true)}>
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}

export default WorkspaceHeader