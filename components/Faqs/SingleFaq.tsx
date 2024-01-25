import ChevronDown from "../../public/chevron-down.svg";
import Image from "next/image";
import React from "react";

interface Faq {
  queNo: number;
  question: string;
  answer: string;
}

interface SingleFaqProps {
  faq: Faq;
  isOpen: boolean;
  toggleFaq: () => void;
}

const SingleFaq = ({ faq, isOpen, toggleFaq }: SingleFaqProps) => {
  return (
    <div className="border border-[#1A1A1A] mb-3 overflow-hidden rounded-lg transition-all ">
      <div
        className="flex justify-between items-center bg-[#1A1A1A] bg-gradient-to-r hover:from-purple-600 hover:to-fuchsia-500 px-3 py-2 cursor-pointer text-white"
        onClick={toggleFaq}
      >
        <h3 className="text-base md:text-xl">{faq.queNo}. {faq.question}</h3>
        <div className={`transition-all duration-300 ${isOpen && "rotate-180"}`}>
          <Image src={ChevronDown} alt="" />
        </div>
      </div>
      {isOpen && <p className="px-2 pt-2 pb-6 text-sm md:text-lg text-gray-300">{faq.answer}</p>}
    </div>
  );
};

export default SingleFaq;
