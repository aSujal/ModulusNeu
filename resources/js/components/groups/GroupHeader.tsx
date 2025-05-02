import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import React from 'react'
import { ChevronDown } from 'lucide-react'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/button'
import { Group } from '@/types'
import PreferencesModal from './PreferencesModal'
import InviteModal from './InviteModal'

interface GroupHeaderProps {
    group: Group
}

const GroupHeader = ({ group }: GroupHeaderProps) => {
    const [preferencesOpen, setPreferencesOpen] = React.useState(false);
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const isAdmin = true
    return (
        <>
            <InviteModal open={inviteOpen} setOpen={setInviteOpen} name={group.name} groupId={group.id} />
            <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={group.name} groupId={group.id} />
            <div className='flex justify-between items-center gap-0.5 px-4 h-[49px]'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className='hover:bg-muted/20 p-1.5 w-auto overflow-hidden font-semibold text-lg'>
                            <span className='truncate'>{group.name}</span>
                            <ChevronDown className='ml-1 size-4 shrink-0' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start' className='w-64'>
                        <DropdownMenuItem className='cursor-pointer'>
                            <div className='relative flex justify-center items-center bg-[#616161] mr-2 rounded-md size-9 overflow-hidden font-semibold text-white text-xl'>
                                {group.name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col items-start'>
                                <p className='font-bold truncate'>{group?.name}</p>
                                <p className='text-muted-foreground text-xs'>Active group</p>
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isAdmin &&
                            <>
                                <DropdownMenuItem className='py-2 cursor-pointer' onClick={() => setInviteOpen(true)}>
                                    Invite people to {group?.name}
                                </DropdownMenuItem>
                                <DropdownMenuItem className='py-2 cursor-pointer' onClick={() => setPreferencesOpen(true)}>
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

export default GroupHeader