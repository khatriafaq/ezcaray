import Image from 'next/image';
import React from 'react';
import Thumbnail from '~/aboutThumbnail.svg'

const AboutUsSection = () => {
  return (
    <>



      {/* new started */}
      <div className='main-container' id='about' >
        <div className='text-white rounded-[57px] bg-[#1C1C1E] mt-10  relative ' >
          <div className='grid grid-cols-12 mt-5 gap-8   ' >
            <div className=' col-span-12 xl:col-span-7 xxl:col-span-6 ' >
              <div className=' p-6 sm:p-14 xxl:p-20 ' >
                <h1 className='md:text-4xl text-2xl font-bold xl:text-6xl text-white'>About Us</h1>
                <p className=' my-2 sm:my-10 text-[#8A8A8E] font-bold  xxl:text-[22px] xxl:leading-[33px] '>Virtual X is a decentralized, blockchain powered mobile phone network. Virtual X is poised to revolutionize the mobile network landscape in the UK and EU as the first 5G network to integrate blockchain technology. This ground-breaking initiative leverages the power of eSIM technology, allowing users to activate their mobile services instantly without the need for a physical SIM card.</p>
              </div>
            </div>
            <div className=' col-span-12 xl:col-span-5 xxl:col-span-6  relative ' >
              <img src='/images/Frame 6.png' className=' xl:absolute  xl:bottom-0 w-[60%] ml-auto mr-auto  xl:w-[76%] h-auto xl:right-[53px] xxl:w-[80%]  ' />
            </div>
          </div>

        </div>
      </div>
      {/* new ended */}
    </>
  );
};

export default AboutUsSection;