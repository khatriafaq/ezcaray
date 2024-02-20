import React from "react";

const BenefitSection = () => {
  return (
    <>
      {/* new started */}
      <div className="main-container" id="about">
        <div className="text-white rounded-[57px] mt-10 relative">
          <div className="grid grid-cols-12 mt-5 gap-8">
            <div className=" col-span-12 xl:col-span-7 xxl:col-span-6">
              <div className=" p-6 sm:p-14 xxl:p-20">
                <h1 className="md:text-4xl text-2xl font-bold xl:text-6xl text-orange-100">
                  Unlock the Future:{" "}
                  <span className="text-brandColor">3000%</span> Growth
                  Potential & Beyond!
                </h1>
                <p className="my-2 pr-10 sm:my-10 text-[#8A8A8E] font-bold xxl:text-[22px] xxl:leading-[33px]">
                  At MYGT, our commitment extends beyond the preservation of
                  capital; it's a journey into the heart of prosperity.
                </p>
                <p className="my-2 pr-10 sm:my-10 text-[#8A8A8E] font-bold xxl:text-[22px] xxl:leading-[33px]">
                  We are actively exploring and tapping into verified gold
                  fields, unveiling new avenues for growth—all without trading.
                  This approach ensures MYGT's upward trajectory, fostering a
                  flourishing future without sacrificing the steadfast stability
                  that defines our core commitment.
                </p>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-5 xxl:col-span-6 relative">
              <img
                src="/images/Growth-gold-coin.jpg"
                className="m-auto mt-[84px] xl:w-[76%] w-[800px] md:h-[563px] xl:right-[53px] xxl:w-[80%] rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
      {/* new ended */}
    </>
  );
};

export default BenefitSection;
