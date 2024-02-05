import { OurTeam } from "@/data/TeamData";
import Image from "next/image";
import React from "react";

const TeamSection = () => {
  return (
    <section className="main-container text-orange-100 mt-18" id="partner">
      <h1 className="text-4xl md:text-6xl xl:text-[65px] font-bold text-center mb-10">
        Partners
      </h1>

      {/* team member container */}
      <div className="flex flex-wrap justify-between items-center gap-y-6 md:gap-y-8 xl:gap-8 xl:px-10">
        {OurTeam.map((item, index) => {
          return (
            <div
              className="mx-auto bg-brandColor border border-brandColor rounded-[20px] text-center px-10 md:px-16 py-5 transition-all"
              key={index}
            >
              <div className="">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={item.photo}
                    alt=""
                    className="rounded-full w-40 h-40"
                  />
                </a>
              </div>
              <h3 className="text-xl font-bold mt-4">{item.name}</h3>
              <p className="text-sm text-[#757575]">{item.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;
