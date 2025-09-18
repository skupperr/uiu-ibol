'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React, { useState } from 'react'
import { Copy } from "lucide-react"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from "@/context/AuthContext";
import UserPopover from '@/components/ui/userPopover'
import { logOut } from "@/lib/auth";


const NavBar = () => {
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);
    const pathname = usePathname()
    const { backendUser, loading } = useAuth();


    return (
        <div className='w-full h-fit'>

            <div className='w-full flex justify-center bg-[--color-3]'>
                <div className='w-full h-fit my-2 max-w-[71em] gap-2 flex items-center mx-[5vw]'>
                    <Image src={'/images/uiu_logo.png'} alt='' height={0} width={0} sizes='100vw' className='w-[40px]' />
                    <Link target='_blank' href={'https://www.uiu.ac.bd/'} className='text-[18px] lg:text-[20px] font-bold font-[OpenSans] text-white'>United International University</Link>
                </div>

                {/* Right side - auth */}
                {!loading && (
                    <div className="flex items-center gap-4">
                        {backendUser ? (
                            <UserPopover user={backendUser} />
                        ) : (
                            <Link
                                href="/auth"
                                className="whitespace-nowrap text-base sm:text-xl text-white px-2 sm:px-4 py-1 rounded-3xl hover:bg-orange-400 transition-colors mb-4 sm:mb-0 mt-4 mr-2 sm:mt-0 w-full sm:w-auto text-center"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </div>
            <div className='w-full flex justify-center border-b-2 shadow-sm lg:shadow-none lg:border-none'>
                <div className='w-full h-fit max-w-[71em] gap-2 flex items-center justify-between py-5 mx-[5vw]'>
                    <div className='flex items-center gap-5'>
                        {/* <Image src={'/images/logo.jpg'} alt='' height={0} width={0} sizes='100vw' className='w-[40px]'/> */}
                        <Link href={'/'} className='text-[22px] md:text-[24px] lg:text-[30px] font-bold font-[LibreBaskerville] text-[--color-heading-2]'>Intelligent Bioinformatics and Omics Laboratory</Link>
                    </div>
                    <button className='block ml-5 lg:hidden' onClick={() => setIsOpenSidebar(!isOpenSidebar)}>

                        <svg className="h-6 w-6 fill-[--color-3]" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
                            <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div className='flex w-full justify-center bg-[--color-bg-1]'>
                <div className=' hidden lg:flex w-full h-fit max-w-[71em] gap-2 items-center mx-[5vw]'>
                    <div className=' flex text-white gap-2'>
                        <Link
                            className=
                            {
                                cn('hover:underline hover:bg-[--color-6] font-semibold tracking-[0.07em] transition-all text-[13px] px-4 py-3 ',
                                    pathname == '/' ? 'underline bg-[--color-6]' : '')
                            }
                            href='/'>
                            HOME
                        </Link>
                        <Link
                            className=
                            {
                                cn('hover:underline hover:bg-[--color-6] font-semibold tracking-[0.07em] transition-all text-[13px] px-4 py-3 ',
                                    pathname.startsWith('/news') ? 'underline bg-[--color-6]' : '')
                            }
                            href='/news'>
                            NEWS
                        </Link>
                        <Link
                            className=
                            {
                                cn('hover:underline hover:bg-[--color-6] font-semibold tracking-[0.07em] transition-all text-[13px] px-4 py-3 ',
                                    pathname.startsWith('/people') ? 'underline bg-[--color-6]' : '')
                            }
                            href='/people'>
                            PEOPLE
                        </Link>
                        <Link
                            className=
                            {
                                cn('hover:underline hover:bg-[--color-6] font-semibold tracking-[0.07em] transition-all text-[13px] px-4 py-3 ',
                                    pathname.startsWith('/research') ? 'underline bg-[--color-6]' : '')
                            }
                            href='/research'>
                            RESEARCH
                        </Link>
                        <Link
                            className=
                            {
                                cn('hover:underline hover:bg-[--color-6] font-semibold tracking-[0.07em] transition-all text-[13px] px-4 py-3 ',
                                    pathname.startsWith('/publications') ? 'underline bg-[--color-6]' : '')
                            }
                            href='/publications'>
                            PUBLICATIONS
                        </Link>
                        <Link
                            className=
                            {
                                cn('hover:underline hover:bg-[--color-6] font-semibold tracking-[0.07em] transition-all text-[13px] px-4 py-3 ',
                                    pathname.startsWith('/join-us') ? 'underline bg-[--color-6]' : '')
                            }
                            href='/join-us'>
                            JOIN US
                        </Link>
                    </div>
                </div>
                <Dialog open={isOpenSidebar} onOpenChange={setIsOpenSidebar}>

                    <DialogContent className="sm:max-w-md bg-[--color-5] border-none">
                        <DialogHeader>
                            <DialogTitle className='text-white font-normal'>MENU</DialogTitle>
                        </DialogHeader>
                        <div className=' flex flex-col text-white gap-2'>
                            <Link
                                className=
                                {
                                    cn('hover:underline border-b-[1px] border-[--color-6] font-normal tracking-[0.05em] transition-all text-[14px] px-4 py-3 ',
                                        pathname == '/' ? 'underline ' : '')
                                }
                                href='/'>
                                HOME
                            </Link>
                            <Link
                                className=
                                {
                                    cn('hover:underline border-b-[1px] border-[--color-6] font-normal tracking-[0.05em] transition-all text-[14px] px-4 py-3 ',
                                        pathname.startsWith('/news') ? 'underline ' : '')
                                }
                                href='/news'>
                                NEWS
                            </Link>
                            <Link
                                className=
                                {
                                    cn('hover:underline border-b-[1px] border-[--color-6] font-normal tracking-[0.05em] transition-all text-[14px] px-4 py-3 ',
                                        pathname.startsWith('/people') ? 'underline ' : '')
                                }
                                href='/people'>
                                PEOPLE
                            </Link>
                            <Link
                                className=
                                {
                                    cn('hover:underline border-b-[1px] border-[--color-6] font-normal tracking-[0.05em] transition-all text-[14px] px-4 py-3 ',
                                        pathname.startsWith('/research') ? 'underline ' : '')
                                }
                                href='/research'>
                                RESEARCH
                            </Link>
                            <Link
                                className=
                                {
                                    cn('hover:underline border-b-[1px] border-[--color-6] font-normal tracking-[0.05em] transition-all text-[14px] px-4 py-3 ',
                                        pathname.startsWith('/publications') ? 'underline ' : '')
                                }
                                href='/publications'>
                                PUBLICATIONS
                            </Link>
                            <Link
                                className=
                                {
                                    cn('hover:underline border-b-[1px] border-[--color-6] font-normal tracking-[0.05em] transition-all text-[14px] px-4 py-3 ',
                                        pathname.startsWith('/join-us') ? 'underline ' : '')
                                }
                                href='/join-us'>
                                JOIN US
                            </Link>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default NavBar







