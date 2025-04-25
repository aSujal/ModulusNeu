import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import { Group } from '@/types';
import SidebarButton from '../layout/SidebarItem';

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
            <div className='flex flex-col justify-center items-center gap-2 bg-[#1d1d1d] h-full' >
                <AlertTriangle className='size-5 text-white' />
                <p className='text-white text-sm'>Something went wrong</p>
            </div>
        )
    }

    return (
        <div className='flex flex-col bg-[#0c0c0c] h-full'>
            <div className='flex flex-col mt-3 px-2'>
                <SidebarButton icon={SendHorizonal} label="Draft & Sent" onClick={() => ""} />
                <SidebarButton icon={MessageSquareText} label="Threads" onClick={() => ""} />
            </div>
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