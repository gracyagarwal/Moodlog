import React from 'react'
import Button from './Button';
import Calendar from './Calendar';
import { Fugaz_One } from 'next/font/google';
import Link from 'next/link';
import CallToAction from './CallToAction';
const fugaz = Fugaz_One({subsets: ["latin"], weight: ['400']});

export default function Hero() {
  return (
    <div className='py-4 md:py-10 flex flex-col gap-8 sm:gap-10 '>
        <h1 className={'text-5xl sm:text-6xl md:text-7xl text-center text-slate-700 '+ fugaz.className}>
        <span className='textGradient'>Moodlog</span> helps you track your 
        <span className='textGradient'> mood</span></h1>

        <p className='text-lg text-slate-700 sm:text-xl md:text-2xl text-center w-full 
        mx-auto max-w-[550px]'>Create your mood record and see 
        how you feel on <span className='font-semibold'>every day of every year.</span></p>

        <CallToAction />
        <Calendar demo />
    </div>
  )
}
