import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const AboutUs = () => {
  return (
    <div className='h-auto w-full flex justify-center pt-[80px]' id='About'>
        <div className='h-auto w-full max-w-[65em] mx-[5vw]'>
            
            <div className='flex'>
                <div className=' w-full lg:w-[60%] xl:w-[60%] flex flex-col justify-center'>
                    {/* <h1 className=' text-2xl md:text-3xl font-bold text-[--color-heading]'>Intelligent Bioinformatics and Omics Laboratory - IBOL</h1> */}
                    <div>
                        <p className='text-[--color-p] text-base text-justify'>
                            <strong>I</strong>ntelligent <strong>B</strong>ioinformatics and <strong>O</strong>mics <strong>L</strong>aboratory <strong>(IBOL)</strong>, 
                            a cutting-edge research hub dedicated to advancing computational biology and multi-omics analysis. Under the guidance of <strong>Dr. Riasat Azim</strong>, our lab integrates 
                            artificial intelligence, machine learning, and statistical modeling to unravel complex biological phenomena.
                        </p>
                        <p className='mt-2 text-[--color-p] text-base text-justify'>At IBOL, we focus on:</p>
                        <ul>
                            <li>
                                <p className='text-[--color-p] text-base text-justify'>🔬<strong>Single-cell RNA sequencing analysis</strong> - Understanding cellular heterogeneity and gene expression at an unprecedented resolution.</p>
                            </li>
                            <li>
                                <p className='text-[--color-p] text-base text-justify'>🔗<strong>Multi-omics research</strong> – Integrating genomics, transcriptomics, epigenomics, proteomics, and metabolomics to uncover holistic insights into biological systems.</p>
                            </li>
                            <li>
                                <p className='text-[--color-p] text-base text-justify'>🗺️<strong>Spatial transcriptomics</strong> – Mapping gene expression in tissue architecture to decode cellular interactions.</p>
                            </li>
                            <li>
                                <p className='text-[--color-p] text-base text-justify'>🧬<strong>miRNA, snoRNA, and lncRNA-disease associations</strong> – Identifying non-coding RNA roles in disease mechanisms and therapeutic targets.</p>
                            </li>
                            <li>
                                <p className='text-[--color-p] text-base text-justify'>💊<strong>Computational drug design</strong> – Leveraging AI-driven approaches for drug discovery and precision medicine.</p>
                            </li>

                        </ul>
                        <p className='mt-5 text-[--color-p] text-base text-justify'>Our mission is to bridge computational power with biomedical insights, fostering breakthroughs in personalized medicine, disease diagnostics, and therapeutic interventions. 
                                By collaborating with researchers worldwide, we aim to push the boundaries of bioinformatics and omics research.
                                For more, visit the <Link className='text-blue-400 underline' href={'/research'}>research</Link> section.</p>

                    </div>
                    <div className='block my-10 lg:hidden w-full md:w-[80%]'>
                        <Image src={'/images/about-us.png'} alt='' height={0} width={0} sizes='100vw' className='w-full h-auto'/>
                    </div>

                    
                </div>
                <div className='hidden lg:block w-[40%] xl:w-[40%] pt-16 px-2'>
                    <div className='w-full'>
                        <Image src={'/images/about-us.png'} alt='' height={0} width={0} sizes='100vw' className='w-full h-auto'/>
                    </div>
                </div>
            </div>
            <div>
                        <h3 className='text-xl font-bold text-[--color-p] mt-5 md:mt-10'>Interests</h3>
                        <div className='flex flex-wrap w-full gap-x-8 gap-y-4 mt-2'>
                            <div className='flex items-center gap-2'>
                                <div className='h-[10px] w-[10px] rounded-full bg-[--color-heading]'></div>
                                <p className='text-[--color-p]'>Single-cell Analysis</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='h-[10px] w-[10px] rounded-full bg-[--color-heading]'></div>
                                <p className='text-[--color-p]'>Spatial Transcriptomics</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='h-[10px] w-[10px] rounded-full bg-[--color-heading]'></div>
                                <p className='text-[--color-p]'>Multi-omics Research</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='h-[10px] w-[10px] rounded-full bg-[--color-heading]'></div>
                                <p className='text-[--color-p]'>Machine Learning and AI</p>
                            </div>
                        </div>
            </div>

        </div>
    </div>
  )
}

export default AboutUs