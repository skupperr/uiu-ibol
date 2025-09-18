'use client'
import React from 'react'
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import Link from 'next/link'
import { cn } from '@/lib/utils'
// import { NewsList } from '@/data/news'

import { useEffect, useState } from "react";
import { makeRequest } from "@/utils/api"; 
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'


const RecentPosts = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  // const { makeRequest } = useApi();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
 
  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  type NewsItem = {
    type: string;
    link: string;
    title: string;
    by: string;
    date: string;
    desc: string;
    linkHeading: string;
  };

  const [NewsList, setNewsList] = useState<NewsItem[]>([]);
  
    useEffect(() => {
      fetchNews();
    }, []);
  
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const res = await makeRequest("get-all-news");
        if (res.status === "success") {
          setNewsList(res.data)
        } else {
          setError("Failed to load News.");
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("❌ Error fetching meals:", err.message);
        } else {
          console.error("❌ Error fetching meals:", err);
        }
        setError("Permission denied or network error.");
      } finally {
        setIsLoading(false);
      }
    };


  return (
    <div className='h-auto w-full flex justify-center pt-[80px] pb-[60px]' id='About'>
        <div className='h-auto w-full max-w-[65em] mx-[5vw]'>
          <h3 className=' text-center text-[22px] lg:text-[28px] font-[600] tracking-[0.03em] text-[--color-5] mb-14'>RECENT POSTS</h3>
        
          <div className=''>
            <div className=" flex items-center flex-col">
              <Carousel 
                setApi={setApi} 
                className="w-[90%]"
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {NewsList.map((news, i) => (
                    <CarouselItem key={i}>
                      <Card>
                        <CardContent className='border-none'>
                          <div className='py-5 '>
                            <p className='font-[600] text-[--color-5] tracking-[0.05em] transition-all text-[14px]'>{news.type}</p>
                            <Link target='_blank' href={news.link} className='mt-2 text-[18px] md:text-[20px] tracking-[0.05em] font-bold text-[--color-heading] cursor-pointer hover:underline'>{news.title}</Link>
                            <p className=' mt-2 italic text-[--color-5] tracking-[0.05em] transition-all text-[14px]'>
                              By <span className='text-[--color-heading] underline'>{news.by}</span> | {news.date}
                            </p>
                            <p className=' mt-4 text-[--color-p] tracking-[0.05em] transition-all text-[14px]'>
                            {news.desc}
                            </p>
                            {
                              news.linkHeading? (<p className=' mt-4 text-[--color-p] tracking-[0.05em] transition-all text-[14px]'>
                              {news.linkHeading}
                              </p>) : ''
                            }
                            <Link target='_blank' className=' text-blue-400 underline break-all' href={news.link}>{news.link}</Link>
                            
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='hidden lg:block' />
                <CarouselNext className='hidden lg:block' />
              </Carousel>
              <div className="py-2 flex gap-3 items-center">
                {
                  NewsList.map((_, i)=>(
                    <div key={i} className={cn('rounded-full', current == i+1? 'w-[14px] h-[14px] bg-[--color-4]': 'w-3 h-3 border-2 border-gray-200')}></div>
                  ))
                }
              </div>
            </div>
          </div>
        
        
      </div>
    </div>
  )
}

export default RecentPosts

