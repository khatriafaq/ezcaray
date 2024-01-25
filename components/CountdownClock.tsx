"use client";
import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google"; // Correct import for Poppins

const clockFont = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-blackops",
});

export default function CountdownClock() {
  const calculateTimeLeft = () => {
    const targetDate: any = new Date("2023-09-29T17:00:00Z"); // Replace with your target end date
    const currentDate: any = new Date();
    const timeDifference = targetDate - currentDate;

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
      };
    } else {
      // If the target date has passed, return all zeros
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate the values within the 0-99 range
  const daysValue = Math.max(0, Math.min(99, timeLeft.days));
  const hoursValue = Math.max(0, Math.min(99, timeLeft.hours));
  const minutesValue = Math.max(0, Math.min(99, timeLeft.minutes));
  const secondsValue = Math.max(0, Math.min(99, timeLeft.seconds));

  return (
    <div
      style={{ textShadow: "5px 5px 20px #FF69B4" }}
      className={`justify-center md:my-3 text-base text-white flex md:gap-x-5 gap-x-2 ${clockFont.variable}`}
    >
      {/* <div>
        <h4 className="my-0.5 md:text-4xl text-sm sm:text-base text-center">
          PRESALE IS LIVE NOW !!
          <span className="text-sm sm:text-base md:text-2xl">
            ( Token Address : 0xa975Be9202cE26ddE8bcE29034bE42bcD4861E36 )
          </span>
        </h4>
      </div> */}

      {/* <div>
        <span className="countdown md:text-4xl text-sm">
          <span>{daysValue}</span>
        </span>
        days
      </div>
      <div>
        <span className="countdown md:text-4xl text-sm">
          <span>{hoursValue}</span>
        </span>
        hours
      </div>
      <div>
        <span className="countdown md:text-4xl text-sm">
          <span>{minutesValue}</span>
        </span>
        min
      </div>
      <div>
        <span className="countdown md:text-4xl text-sm">
          <span>{secondsValue}</span>
        </span>
        sec
      </div> */}
    </div>
  );
}

/******************** */

// import useWindowWidth from '@/hooks/useWindowWidth';
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Poppins } from 'next/font/google';
// const clockFont = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-blackops' })

// export default function CountdownClock() {

//   const [timeLeft, setTimeLeft] = useState({
//     days: 3,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   //const clockFont = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-blackops' })
//   // Calculate the values within the 0-99 range
//   const daysValue = Math.max(0, Math.min(99, timeLeft.days));
//   const hoursValue = Math.max(0, Math.min(99, timeLeft.hours));
//   const minutesValue = Math.max(0, Math.min(99, timeLeft.minutes));
//   const secondsValue = Math.max(0, Math.min(99, timeLeft.seconds));

//   return (

//     <div className="justify-center md:my-3 text-base text-white filter: drop-shadow(0 1px 1px ring-amber-600) flex md:gap-x-5 gap-x-2 ${clockFont.variable}">
//     <div>
//       <h4 className=" my-0.5 md:text-3xl text-sm">PRESALE STARTS IN: </h4>
//     </div>
//       <div>
//         <span className="countdown md:text-4xl text-sm">
//           <span>{daysValue}</span>
//         </span>
//         days
//       </div>
//       <div>
//         <span className="countdown md:text-4xl text-sm">
//           <span>{hoursValue}</span>
//         </span>
//         hours
//       </div>
//       <div>
//         <span className="countdown md:text-4xl text-sm">
//           <span>{minutesValue}</span>
//         </span>
//         min
//       </div>
//       <div>
//         <span className="countdown md:text-4xl text-sm">
//           <span>{secondsValue}</span>
//         </span>
//         sec
//       </div>
//     </div>
//   );
// }

//////////////////////*************************** */

// 'use client'
// import { useState, useEffect } from 'react'
// import { Poppins } from 'next/font/google';
// import useWindowWidth from '@/hooks/useWindowWidth';

// const clockFont = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-blackops' })

// export default function CountdownClock() {
//   const windowWidth = useWindowWidth();

//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   })

//   const [progress, setProgress] = useState(100)

//   const progressStart = new Date('Aug 4, 2023 15:37:25').getTime()
//   const startTime = new Date().getTime()
//   const endTime = new Date('Dec 5, 2023 15:37:25').getTime()
//   const totalTime = endTime - startTime
//   const progressTotal = endTime - progressStart;

//   useEffect(() => {
//     let interval = setInterval(() => {
//       updateTimer()
//     }, 1000)

//     return () => clearInterval(interval)

//     function updateTimer() {
//       const now = new Date().getTime()
//       const distance = endTime - now

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24))
//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
//       const seconds = Math.floor((distance % (1000 * 60)) / 1000)

//       if (distance < 0) {
//         clearInterval(interval)
//         setProgress(0)
//         return
//       }

//       setTimeLeft({
//         days,
//         hours,
//         minutes,
//         seconds,
//       })
//       setProgress(Math.floor((distance / progressTotal) * 100))
//     }
//   }, [endTime, totalTime, progressTotal])

//   return (
//     <section className={`main-container py-10 md:mb-40 xxl:my-56 ${clockFont.variable}`}>

//       {/* UI version #5 */}
//       <div className='clock-wrapper relative'>
//         <span className='hidden md:block extra-cercles'></span>
//         <h1 className='text-2xl text-white text-center pl-2'>Presale Coming Soon</h1>
//         <div className='py-8 max-w-[405px] mx-auto'>
//           <ul className="grid grid-cols-4 text-white">
//             <li className="clock-list time-divider">
//               <span className="clock-counts">{timeLeft.days}</span>
//               <span className="clock-names">Days</span>
//             </li>
//             <li className="clock-list time-divider">
//               <span className="clock-counts">{timeLeft.hours}</span>
//               <span className="clock-names">Hours</span>
//             </li>
//             <li className="clock-list time-divider">
//               <span className="clock-counts">{timeLeft.minutes}</span>
//               <span className="clock-names">Minutes</span>
//             </li>
//             <li className="clock-list">
//               <span className="clock-counts">{timeLeft.seconds}</span>
//               <span className="clock-names">Seconds</span>
//             </li>
//           </ul>

//           <div className="token-status-bar">
//             <div className="token-status-percent" style={{width:`${progress}%`}}></div>
//             <span className="token-status-point" style={{left:"25%"}}>presale</span>
//             <span className="token-status-point" style={{left:"55%"}}>soft cap</span>
//             <span className="token-status-point" style={{left:"80%"}}>bonus</span>
//           </div>

//           <div className='text-center z-20'>
//             <button className="font-SourceSans3 bg-brandColor mt-8 text px-8 font-bold leading-150 hover:bg-transparent border border-brandColor hover:text-brandColor text-white py-3 rounded-full uppercase">Buy PreSale now</button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
