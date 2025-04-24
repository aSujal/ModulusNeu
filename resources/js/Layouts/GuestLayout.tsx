import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex justify-center items-center bg-background min-h-screen overflow-hidden">
            {/* Background Circle */}
            <div className="sm:left-0 z-0 absolute bg-[#009951] rounded-full sm:w-[65%] sm:h-[110%] sm:translate-x-[-50%]"></div>
            <div className="sm:left-0 z-0 absolute bg-[#2DB484] rounded-full sm:w-[25%] sm:h-[45%] sm:translate-x-[-50%]"></div>

            {/* Content Container */}
            <div className='z-10 relative flex flex-col justify-center items-center gap-3 px-4 sm:px-0'>
                <Link href="/">
                    <a href={route('dashboard')} className="flex items-center mb-5 ps-2.5">
                        <i className="mr-2 text-green-300 text-4xl fa-solid fa-graduation-cap"></i>
                        <span className="self-center font-semibold dark:text-white text-3xl whitespace-nowrap">Modulus</span>
                    </a>
                </Link>
                <div className="bg-muted shadow-md px-6 py-4 sm:rounded-lg sm:min-w-[400px] sm:max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
