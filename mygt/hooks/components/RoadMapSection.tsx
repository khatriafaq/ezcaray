import React from 'react';

const RoadMapSection = () => {
  const preLaunchData = [{
    no: 1,
    title: "Research",
    desc: `Market Research, Goals, Vision & Mission.`,
    status: 'completed',
  }, {
    no: 2,
    title: "Company",
    desc: "Company Formation & Formal Team Assembly",
    status: 'completed',
  }, {
    no: 3,
    title: "Pre- Lauch Development",
    desc: "Smart Contract Development, Integration with BNB Smart Chain, Website Prototyping, Whitepaper Release",
    status: 'completed',
  }, {
    no: 4,
    title: "ITO",
    desc: "VRL Token Sale ( Seed, Public PreSale)",
    status: 'running',
  }, {
    no: 5,
    title: "Exchange Listing ",
    desc: "VRL Listing on CEX",
    status: 'upcoming',
  }, {
    no: 6,
    title: "Partnership ",
    desc: "Partnership With One Of The UK's Biggest 5G Network",
  }]

  const postLaunchData = [{
    no: 7,
    title: "Network Deployment",
    desc: "VMobile Website & App Development, Crypto Wallet Integration, e-SIM Development, Integration & Testing, VMobile Physical SIM Production",
  }, {
    no: 8,
    title: "Marketing",
    desc: "Nationwide Marketing Compaign",
  }, {
    no: 9,
    title: "Network Launch",
    desc: "VMobile UK's First Ever Blockchain Powered Mobile Phone Network Launches In Early 2024",
  }, {
    no: 10,
    title: "EU Expansion",
    desc: "Partnerships With Mobile Phone Networks Across Europe & County By Country Systematic Launch",
  }, {
    no: 11,
    title: "USA & Canada Expansion",
    desc: "Possibility Of Expansion to USA & Canada",
  }, {
    no: 12,
    title: "Sky Is The Limit",
    desc: "Possibility Of Expansion to Other Parts of the World",
  }
  ]
  return (
    <section className='main-container mt-40' id='roadmap'>
      <div className='max-w-[1440px] mx-auto roadmap-bg text-white'>
        <h1 className='text-center text-6xl md:text-8xl xl:text-[140px] gradient-text uppercase mb-20'>Roadmap</h1>
        <div className='md:flex justify-between items-start px-8 md:px-0'>
          <div className='hidden md:block'>
            {preLaunchData.map((item, index) => {
              return (
                <div className='mx-auto flex items-start gap-4 mt-4 max-w-[360px] h-[120px]' key={index}>
                  <div className={`number-container before:w-10 before:h-10 text-black ${item.status === 'completed' && "before:bg-[#25A0FF] after:border-l-[#25A0FF]"} ${item.status === 'running' && "before:w-14 before:h-14"} ${item.no !== preLaunchData.length && "number-after"}`} >{item.no}</div>
                  <div>
                    <h4 className='text-lg whitespace-nowrap'>{item.title}</h4>
                    <p className='text-dark2 min-h-[80px] leading-[20px]'>{item.desc}</p>
                  </div>
                </div>)
            })}
          </div>
          <div className='md:hidden'>
            {preLaunchData.map((item, index) => {
              return (
                <div className='mx-auto flex items-start gap-4 mt-4 max-w-[360px] h-[120px]' key={index}>
                  <div className={`number-container before:w-10 before:h-10 text-black ${item.status === 'completed' && "before:bg-[#25A0FF] after:border-l-[#25A0FF]"} ${item.status === 'running' && "before:w-14 before:h-14"} ${item.no !== preLaunchData.length + 1 && "number-after"}`} >{item.no}</div>
                  <div>
                    <h4 className='text-lg whitespace-nowrap'>{item.title}</h4>
                    <p className='text-dark2 min-h-[80px] leading-[20px]'>{item.desc}</p>
                  </div>
                </div>)
            })}
          </div>
          <div className='ml-0 md:ml-6 xl:ml-0'>
            {postLaunchData.map((item, index) => {
              return (
                <div className={`mx-auto flex items-start gap-4 mt-4 max-w-[360px] h-[120px] ${item.no === 7 && 'h-[140px] md:h-[120px]'}`} key={index}>
                  <div className={`number-container before:w-10 before:h-10 text-black ${index !== preLaunchData.length - 1 && "number-after"} ${item.no === 10 && "right-1"} ${item.no === 7 && 'after:h-[100px] md:after:h-[80px]'}`}>{item.no === 6 && <span className='block md:hidden connecter-line'></span>}{item.no}</div>
                  <div className={`${item.no > 9 && '-ml-2'}`}>
                    <h4 className='text-lg whitespace-nowrap'>{item.title}</h4>
                    <p className='text-dark2 min-h-[80px] leading-[20px] md:leading-6'>{item.desc}</p>
                  </div>
                </div>)
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadMapSection;