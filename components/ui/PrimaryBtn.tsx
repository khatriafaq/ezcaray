import React from 'react';

interface PrimaryBtnProps {
  text: string;
  action?: React.MouseEventHandler<HTMLButtonElement>;
  download? : boolean,
}

const PrimaryBtn = ({ text, action,download }: PrimaryBtnProps) => {
  return (
    (download === true ? <button className="font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-3xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink" onClick={action}><a href='/whitepaper.pdf' target="_blank">{text}</a></button>
:     <button className="font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-3xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink" onClick={action}>{text}</button>
)
  );
};

export default PrimaryBtn;