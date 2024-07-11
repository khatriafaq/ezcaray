import Image from "next/image";
import Phone from "../public/Phone.jpeg";
import PhoneDisply from "../public/PhoneDisply.jpeg";
import TeamSection from "@/components/TeamSection";
import AboutUsSection from "@/components/AboutUsSection";
import Faqs from "@/components/Faqs/Faqs";
import { FaqsData } from "@/components/Faqs/FaqsData";
import RoadMapSection from "@/components/RoadMapSection";
import BenefitSection from "@/components/BenefitSection";
import YoutubeSection from "@/components/YoutubeSection";
import WhatsApp from "@/components/WhatsApp";
import CountdownClock from "@/components/CountdownClock";

export default function Home() {
  return (
    <main className="overflow-x-hidden -mt-14">
      <div className="flex justify-center align-center">
        <button className="btn my-6 text-xl md:text-2xl xxl:text-4xl xxl:my-8 text-yellow-500">
          MYGT Tokens Originally $78, Now at $65 in MATIC – Grab the Discount!
        </button>
      </div>
      <section
        className="main-container mb-0 xl:flex xxl:items-start justify-between text-orange-100"
        id="hero"
      >
        {/* hero text container */}
        <div className=" text-center lg:text-left xl:pt-10">
          <div>
            <h2 className="xl:whitespace-nowrap text-[28px] -tracking-[1.54px] md:text-[32px] lg:tracking-normal lg:text-[40px] xl:-mt-10 xxl:-mt-10">
              {" "}
              My <span className="text-brandColor">GOLD</span> Token is
              launching...
            </h2>
          </div>
          <div>
            <h1 className="mt-4 text-[44.89px] -tracking-[2.469px] md:text-[85px] xl:tracking-normal xxl:text-[90px] xxl:tracking-[-5.934px] xl:whitespace-nowrap hero-text">
              digital token <span className="text-brandColor">backed</span>
            </h1>
          </div>
          <h1 className="text-[44.89px] -tracking-[2.469px] leading-[105%] md:text-[85px] xl:tracking-normal xl:text-[65px] xxl:text-[90px] xxl:tracking-[-1.934px] xl:whitespace-nowrap hero-text">
            by<span className="text-dark2"></span>{" "}
            <span className="text-brandColor">GOLD</span> <br />
          </h1>
          <button className="btn my-6 text-xl md:text-2xl xxl:text-4xl xxl:my-8 text-yellow-500">
            Secured by Gold, Powered by Trust.
          </button>
          <p className="sub-title-large xl:pb-2 xxl:pb-20">
            Shaping Tomorrow's Finances, Backed by the Timeless Value of Gold.
            powered by blockchain technology & <br /> artificial intelligence.
            <br />
            <p className="text-brandColor">
              TOKEN ADDRESS: 0xEC0D3Fde1939e554123Ace9644ec6ae635B0256a
            </p>
          </p>
        </div>

        {/* hand image container*/}
        <div className="w-[390px] pt-2 md:w-full md:-ml-14 xl:-ml-0 xl:flex xl:left-[127px] xl:-mt-20 xl:pt-2 xl:-mb-[4rem] xl:-mr-2 xxl:-mt-24 xxl:mb-[3rem] xxl:-mr-10 xxl:left-[112px]">
          <Image
            src={Phone}
            alt="phone"
            quality={90}
            className="rounded-3xl scale-99 md:scale-125 xl:scale-75"
          />
        </div>
      </section>

      <section className="main-container flex flex-col items-center md:flex-row md:pb-10 md:px-2 md:mb-40 xl:pb-0 xxl:-mt-16  xxl:top-[-6px]">
        <div className="flex items-end order-2 md:order-1 md:absolute md:-bottom-1 md:right-0 md:w-1/2 xl:w-[60%] xl:-ml- xl:static ">
          <Image
            src={PhoneDisply}
            alt="phoneDisply"
            className="h-[350px] md:h-[700px] md:w-[800px] rounded-3xl"
          />
        </div>

        <div className="xl:w-[40%] my-8 order-1 xl:order-2">
          <div className="xl:text-4xl text-2xl font-bold xxl:text-6xl">
            <span className="text-brandColor">MYGOLD TOKEN</span> <br />
            <p className="text-orange-100 pt">
              Your Asset, Anchored in Precious Trust
            </p>
          </div>
          <p className="text-dark2 font-bold xxl:text-2xl my-6 pr-10">
            Become yourself a gold miner with MyGold Token. The crypto backed by
            gold and powered by trust.
          </p>
          <p className="text-dark2 font-bold xxl:text-2xl pr-10">
            Ezcaray Mining Corp does the work on African ground and MyGold Token
            is a business share much beyond old-fashioned opportunities for the
            rich. Start with 65 USDT/Token.
          </p>

          {/* <button className="font-SourceSans3 bg-brandColor mt-8 text-2xl px-8 font-bold leading-150 hover:bg-transparent border border-brandColor hover:text-brandColor text-white py-4 rounded-2xl">Buy PreSale</button> */}
        </div>
      </section>

      <BenefitSection />

      <AboutUsSection />

      <YoutubeSection />

      <RoadMapSection />

      <TeamSection />

      <WhatsApp />

      <Faqs faqs={FaqsData} />
    </main>
  );
}
