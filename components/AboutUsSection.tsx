import Image from "next/image";
import React from "react";
import Thumbnail from "~/aboutThumbnail.svg";
import ezcaray from "~/ezcaray.jpeg";

const AboutUsSection = () => {
  return (
    <>
      {/* new started */}
      <div className="main-container" id="about">
        <div className="text-white rounded-[57px] mt-10 relative border-white">
          <div className="grid grid-cols-12 mt-5 gap-8">
            {/* Image container */}
            <div className="col-span-12 xl:col-span-5 xxl:col-span-6 relative order-2 xl:order-1">
              <img
                src="/images/AgaGoldy-logo-primary.jpeg"
                className="xl:absolute xl:bottom-0 items-center ml-auto mr-auto xl:w-[76%] w-[800px] md:h-[563px] xl:right-[53px] xxl:w-[80%] rounded-3xl"
              />
            </div>
            {/* Text container */}
            <div className="col-span-12 xl:col-span-7 xxl:col-span-6 order-1 xl:order-2">
              <div className="p-6 sm:p-14 xxl:p-20">
                <h1 className="md:text-4xl text-2xl font-bold xl:text-6xl text-orange-100">
                  About Us
                </h1>
                <p className="my-2 pr-10 sm:my-10 text-[#8A8A8E] font-bold xxl:text-[22px] xxl:leading-[33px]">
                  At My Gold Token, we believe in combining the timeless
                  stability of gold with the efficiency and innovation of
                  digital asset. Our mission is to provide you with a secure and
                  reliable financial instrument that bridges the gap between
                  traditional value and the digital future. As the pioneers of
                  gold-backed security token, we bring you My Gold Token – a
                  revolutionary asset designed to empower your transactions with
                  unparalleled stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* new ended */}
    </>
  );
};

export default AboutUsSection;
