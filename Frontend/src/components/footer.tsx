import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='h-auto bg-[--color-5] w-full pt-[50px] pb-[30px] flex justify-center' id='Contact'>
        <div className='h-auto w-full max-w-[71em] mx-[5vw]'>
            <div className='flex flex-col md:flex-row gap-5 w-full'>
                <div className='flex items-center justify-center md:justify-start w-full h-full md:w-[55%] mb-5'>
                    <Image src={'/images/logo.png'} alt='' height={0} width={0} sizes='100vw' className='w-full max-w-[300px] md:ml-[5vw]'/>
                </div>
                <div className='flex flex-col sm:flex-row  gap-5 w-full md:w-[45%] px-[15vw] sm:p-0'>
                    <div className='flex flex-col w-full sm:w-[40%]'>
                        <h4 className='text-lg sm:text-xl font-bold text-white border-b-[2px] border-b-[--color-7]'>Links</h4>
                        <div className=' flex flex-col gap-[10px] text-white mt-5'>
                            <Link 
                                className='hover:underline tracking-[0.05em] transition-all text-[14px] '
                                href='/'>
                                HOME
                            </Link>
                            <Link 
                                className='hover:underline tracking-[0.05em] transition-all text-[14px] '
                                href='/news'>
                                NEWS
                            </Link>
                            <Link 
                                className='hover:underline tracking-[0.05em] transition-all text-[14px] '
                                href='/people'>
                                PEOPLE
                            </Link>
                            <Link 
                                className='hover:underline tracking-[0.05em] transition-all text-[14px] '
                                href='/research'>
                                RESEARCH
                            </Link>
                            <Link 
                                className='hover:underline tracking-[0.05em] transition-all text-[14px] '
                                href='/publications'>
                                PUBLICATIONS
                            </Link>
                            <Link 
                                className='hover:underline tracking-[0.05em] transition-all text-[14px] '
                                href='/join-us'>
                                JOIN US
                            </Link>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 w-full sm:w-[60%]'>
                        <h4 className='text-lg sm:text-xl font-bold text-white border-b-[2px] border-b-[--color-7]'>Get In Touch</h4>
                        <div className='text-white flex gap-2 mt-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[25px] min-w-[25px] stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            

                            <p className='text-white'>riasat@cse.uiu.ac.bd</p>
                        </div>
                        <div className='text-white flex gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[25px] min-w-[25px] stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <p className='text-white'>United City, Madani Avenue, Badda, Dhaka, Dhaka 1212, Bangladesh</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-[1px] bg-[--color-7] my-8'></div>
            <p className='text-white text-center'>© 2025 All Rights Reserved by Intelligent Bioinformatics and Omics Laboratory™ | developed by <a className='underline text-blue-500' target='_blank' href='https://github.com/srniloy'>SRN</a> and <a className='underline text-blue-500' target='_blank' href='https://github.com/skupperr'>ASIF</a></p>
        </div>
    </div>
  )
}

export default Footer