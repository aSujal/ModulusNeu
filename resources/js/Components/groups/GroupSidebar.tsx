import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import { Group } from '@/types';
import SidebarButton from '../layout/SidebarItem';
import GroupHeader from './GroupHeader';

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
        <div className='flex flex-col bg-[#5E2C5F] h-full'>
            <div className='flex flex-col mt-3 px-2'>
                <GroupHeader group={group} />
                <SidebarButton icon={SendHorizonal} label="Draft & Sent" onClick={() => ""} />
                <SidebarButton icon={MessageSquareText} label="Threads" onClick={() => ""} />
            </div>
            <div className='flex flex-col bg-[#f0f0f0] dark:bg-[#090a0a] h-full'>
                <div>
                    {group?.groupMembers?.map((item) => (
                        // <UserItem key={item._id}
                        //     user={item.user}
                        //     label={item.user.name}
                        //     id={item._id}
                        // />
                        <div key={item.id}>
                            {item?.user}
                        </div>
                    ))}
                </div>
            </div>
            )
}

            export default GroupSidebar