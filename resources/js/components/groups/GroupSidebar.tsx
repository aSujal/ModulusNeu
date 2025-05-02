import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import { Group } from '@/types';
import SidebarButton from '../layout/SidebarItem';
import GroupHeader from './GroupHeader';
import { UserItem } from '../UserItem';

interface GroupSidebar {
    group: Group;
}

const GroupSidebar = ({ group }: GroupSidebar) => {

    if (false) {
        return (
            <div className='flex flex-col justify-center items-center bg-[#5E2C5F] h-full' >
                <Loader className='size-5 text-white animate-spin' />
            </div>
        )
    }
    if (!group) {
        return (
            <div className='flex flex-col justify-center items-center gap-2 bg-[#dadada] dark:bg-[#090a0a] h-full' >
                <AlertTriangle className='size-5 text-white' />
                <p className='text-white text-sm'>Something went wrong</p>
            </div>
        )
    }

    return (
        <div className='flex flex-col bg-secondary h-full'>
            <div className='flex flex-col items-center'>
                <GroupHeader group={group} />
            </div>
            <div>
                {group?.groupMembers?.map((item) => (
                    <UserItem key={item.id}
                        label={item.user}
                        id={item.id}
                    />
                ))}
            </div>
        </div>
    )
}

export default GroupSidebar