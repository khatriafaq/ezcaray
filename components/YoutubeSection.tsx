import React from "react";

const YoutubeSection = () => {
  return (
    <>
      {/* new started */}
      <div className="main-container" id="benefit ">
        <div className="text-white rounded-[57px] mt-10 relative ">
          <div className="grid grid-cols-12 mt-5 gap-8">
            <div className=" col-span-12 xl:col-span-7 xxl:col-span-6 ">
              <div className=" p-6 sm:p-14 xxl:p-20">
                <h1 className="md:text-4xl text-2xl font-bold xl:text-6xl text-orange-100">
                  Your Quick Guide to Securing{" "}
                  <span className="text-brandColor">MYGT Tokens </span>Now!
                </h1>
                <p className="my-2 pr-10 sm:my-10 text-[#8A8A8E] font-bold xxl:text-[22px] xxl:leading-[33px]">
                  Welcome to the gateway of financial empowerment!.
                </p>
                <p className="my-2 pr-10 sm:my-10 text-[#8A8A8E] font-bold xxl:text-[22px] xxl:leading-[33px]">
                  Our latest video is your ticket to seamlessly acquiring MYGT
                  tokens, the key to a revolutionary digital future. In just a
                  few minutes, you'll master the art of purchasing MYGT tokens
                  through MetaMask, opening doors to endless possibilities.
                </p>
              </div>
            </div>
            <div className="col-span-12 xl:col-span-5 xxl:col-span-6 relative flex items-center justify-center">
              <iframe
                width="560"
                height="460"
                src="https://www.youtube.com/embed/w7DG9OkWbnQ?si=lxDpD1fsNSyj3cMT"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="max-w-full max-h-full" // Ensure iframe does not exceed the parent div's dimensions
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      {/* new ended */}
    </>
  );
};

export default YoutubeSection;
