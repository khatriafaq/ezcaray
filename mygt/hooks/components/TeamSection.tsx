import { OurTeam } from '@/data/TeamData';
import Image from 'next/image';
import React from 'react';

const TeamSection = () => {
  return (
    <section className="main-container text-white mt-32 " id='team'>
      <h1 className='text-4xl md:text-6xl xl:text-[65px] font-bold text-center mb-10'>Meet Our Team</h1>

      {/* team member container */}
      <div className='flex flex-wrap justify-between items-center gap-y-6 md:gap-y-8 xl:gap-8 xl:px-10'>
        {OurTeam.map((item, index) => {
          return (
            <div className='mx-auto bg-brandColor border border-brandColor rounded-[20px] text-center px-10 md:px-16 py-5 transition-all' key={index}>
              <div className='grayscale'>
                <Image src={item.photo} alt="" className='rounded-full w-40 h-40' />
              </div>
              <h3 className='text-xl font-bold mt-4'>{item.name}</h3>
              <p className='text-sm text-[#adacac]'>{item.title}</p>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default TeamSection;