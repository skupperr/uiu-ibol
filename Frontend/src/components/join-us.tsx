import React from 'react'

const JoinUs = () => {
  return (
        <div className='flex w-full justify-center'>
            <div className='h-auto w-full max-w-[65em] pb-[60px] mx-[5vw]' id='Research'>
                <h3 className=' my-10 text-[30px] md:text-[35px] lg:text-[40px] tracking-[0.03em] font-[200] text-[--color-5]'>JOIN US</h3>
                
                <div className='col-span-1 md:col-span-3 mb-12'>
                    <div className='w-full border-b-2 mb-5'>
                        <h4 className='font-bold text-xl'>Join Us</h4>
                    </div>

                    <div className='w-[100%]'>
                        <p className=' text-justify'>We always welcome students, researchers, and people from diverse research backgrounds to join us and do collaborative work on our common interests. For undergraduate or graduate students with research interests, please email us at <strong>riasat@cse.uiu.ac.bd</strong> with research interests that also align with ours. Before emailing, we suggest that you read any one of the latest works to get the idea.</p>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-10'>
                    <div className='col-span-1 md:col-span-3 '>
                            <div className='w-full border-b-2 mb-5'>
                                <h4 className='font-bold text-xl'>Location </h4>
                            </div>

                        <div className='w-[100%]'>
                            <iframe width="100%" height="400"  src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=United%20International%20University,%20United%20City,%20Madani%20Avenue,%20Badda,%20Dhaka,%20Dhaka%201212,%20Bangladesh+(United%20International%20University)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/collections/drones/">drones ireland</a></iframe>
                        </div>
                    </div>
                    <div className='col-span-1 md:col-span-2 flex flex-col gap-3'>
                        <div className='w-full border-b-2 mb-1.5'>
                            <h4 className='font-bold text-xl'>Office </h4>
                        </div>
                        <p><strong>Room:</strong> 337(1-3) A, United International University</p>
                        <p className=''> <strong>Location: </strong>United City, Madani Avenue, Badda, Dhaka, Dhaka 1212, Bangladesh</p>
                        <p className=''><strong>Email:</strong> riasat@cse.uiu.ac.bd</p>

                        
                    </div>
                </div>
    
            </div>
        </div>
  )
}

export default JoinUs