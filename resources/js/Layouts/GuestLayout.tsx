import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex min-h-screen overflow-hidden items-center justify-center bg-background">
            {/* Background Circle */}
            <div className="absolute z-0 sm:left-0 sm:translate-x-[-50%] sm:w-[65%] sm:h-[110%]  bg-[#009951] rounded-full"></div>
            <div className="absolute z-0 sm:left-0 sm:translate-x-[-50%] sm:w-[25%] sm:h-[45%]  bg-[#2DB484] rounded-full"></div>

            {/* Content Container */}
            <div className='relative z-10  flex flex-col items-center justify-center gap-3 px-4 sm:px-0'>
                <Link href="/">
                    <a href={route('dashboard')} className="flex items-center ps-2.5 mb-5">
                        <i className="fa-solid fa-graduation-cap text-4xl text-green-300 mr-2"></i>
                        <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">Modulus</span>
                    </a>
                </Link>
                <div className="sm:min-w-[400px] px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg bg-muted">
                    {children}
                </div>
            </div>
        </div>
    );
}
