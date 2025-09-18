import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
  return (
    <div className='w-full flex justify-center bg-[--color-1] mt-16'>
        <div className='w-full h-fit my-2 max-w-[65em] gap-2 flex items-center mx-[5vw] justify-center'>
          <div className='w-full border-[1px]'>
            <div className='w-full h-fit border-b-[var(--color-3)] border-b-[5px]'>
              <Image src={'/images/home-cover.jpg'} alt='' height={0} width={0} sizes='100vw' className='w-full min-h-[25vh] sm:min-h-fit sm:h-fit object-cover'/>
              <div>
                <h3 className=' text-[18px] lg:text-[24px] font-[600] tracking-[0.03em] text-[--color-5] my-[24px] mx-[32px]'>WELCOME TO IBOL</h3>
                <h3 className=' text-[24px] lg:text-[28px] font-bold text-[--color-heading] my-[24px] mx-[32px]'>Bioinformatics Lab, Department of Computer Science and Engineering</h3>
              </div>
            </div>

          </div>
        </div>
    </div>
  )
}

export default HeroSection