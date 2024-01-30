import React from 'react';

const RoadMapSection = () => {
  const preLaunchData = [{
    no: 1,
    title: "1st quarter of 2024 - Research",
    desc: `Market Research, Goals, Vision & Mission.`,
    status: 'completed',
  }, {
    no: 2,
    title: "1st quarter of 2024 - Company",
    desc: "Company Formation",
    status: 'completed',
  }, {
    no: 3,
    title: "1st quarter of 2024 - Pre-Lauch Development",
    desc: "Smart Contract Development, Integration with BNB Smart Chain, Website Prototyping, Whitepaper Release",
    status: 'completed',
  }, {
    no: 4,
    title: "1st quarter of 2024 - Launch of MYGT",
    desc: "MYGT Token Sale",
    status: 'upcoming',
  }, {
    no: 5,
    title: "2nd quarter of 2024 - Exchange Listing",
    desc: "Wallet and exchang facilites",
    status: 'upcoming',
  }, {
    no: 6,
    title: "3rd quarter of 2024 - AI Integration and Testing",
    desc: "Develop and implement the software connecting Mineral Global Yield AI with MYGOLD.",
  }]

  const postLaunchData = [{
    no: 7,
    title: "Mining Expansion - Permit Approval",
    desc: "Obtain permits for the expansion of mining operations into a 50 square kilometer area.",
  }, {
    no: 8,
    title: "Expansion into South Africa",
    desc: "Plan and initiate the expansion of operations into South Africa. Establish initial infrastructure and partnerships.",
  }, {
    no: 9,
    title: "Exploration of New Gold Fields",
    desc: "Identify and explore new gold fields in Peru, Colombia, Chile, and Ecuador. Conduct feasibility studies and assessments.",
  }, {
    no: 10,
    title: "Onboarding Preparation",
    desc: "Prepare the framework for onboarding gold mining corporations and associates. Establish communication channels for collaboration.",
  }, {
    no: 11,
    title: "Collaborative Agreements",
    desc: "Establish collaborative agreements with mining entities. Define roles and responsibilities for the associates joining the MYGT group ",
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
                  <div className={`number-container before:w-10 before:h-10 text-black ${item.status === 'completed' && "before:bg-[#EAB308] after:border-l-[#EAB308]"} ${item.status === 'running' && "before:w-14 before:h-14"} ${item.no !== preLaunchData.length && "number-after"}`} >{item.no}</div>
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
                  <div className={`number-container before:w-10 before:h-10 text-black ${item.status === 'completed' && "before:bg-[#EAB308] after:border-l-[#EAB308]"} ${item.status === 'running' && "before:w-14 before:h-14"} ${item.no !== preLaunchData.length + 1 && "number-after"}`} >{item.no}</div>
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