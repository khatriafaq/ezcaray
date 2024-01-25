exports.id = 8285;
exports.ids = [8285];
exports.modules = {

/***/ 25906:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 51444))

/***/ }),

/***/ 24123:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 31232, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 52987, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 50831, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 56926, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 44282, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 16505, 23))

/***/ }),

/***/ 51444:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app/layout.tsx","import":"Space_Grotesk","arguments":[{"subsets":["latin"],"display":"auto"}],"variableName":"space"}
var layout_tsx_import_Space_Grotesk_arguments_subsets_latin_display_auto_variableName_space_ = __webpack_require__(95694);
var layout_tsx_import_Space_Grotesk_arguments_subsets_latin_display_auto_variableName_space_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Space_Grotesk_arguments_subsets_latin_display_auto_variableName_space_);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app/layout.tsx","import":"Source_Sans_3","arguments":[{"subsets":["latin"],"display":"auto","variable":"--font-source-sans-3"}],"variableName":"btnFont"}
var layout_tsx_import_Source_Sans_3_arguments_subsets_latin_display_auto_variable_font_source_sans_3_variableName_btnFont_ = __webpack_require__(84835);
var layout_tsx_import_Source_Sans_3_arguments_subsets_latin_display_auto_variable_font_source_sans_3_variableName_btnFont_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Source_Sans_3_arguments_subsets_latin_display_auto_variable_font_source_sans_3_variableName_btnFont_);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(52451);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
;// CONCATENATED MODULE: ./public/images/VirtualXLogo-1- 1.svg
/* harmony default export */ const VirtualXLogo_1_1 = ({"src":"/_next/static/media/VirtualXLogo-1- 1.f839b283.svg","height":68,"width":218,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./components/ui/PrimaryBtn.tsx


const PrimaryBtn = ({ text, action, download })=>{
    return download === true ? /*#__PURE__*/ jsx_runtime_.jsx("button", {
        className: "font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-3xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink",
        onClick: action,
        children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
            href: "/whitepaper.pdf",
            target: "_blank",
            children: text
        })
    }) : /*#__PURE__*/ jsx_runtime_.jsx("button", {
        className: "font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-3xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink",
        onClick: action,
        children: text
    });
};
/* harmony default export */ const ui_PrimaryBtn = (PrimaryBtn);

// EXTERNAL MODULE: ./node_modules/@rainbow-me/rainbowkit/dist/chunk-VAJWZI5T.js + 8 modules
var chunk_VAJWZI5T = __webpack_require__(96357);
;// CONCATENATED MODULE: ./components/common/config.json
const config_namespaceObject = JSON.parse('{"contractAddress":"0x093581490f08847B7D414322B1eE48e4B86eE487","ABI":[{"inputs":[{"internalType":"uint256","name":"rate","type":"uint256"},{"internalType":"address payable","name":"wallet","type":"address"},{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"tokenDecimals","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"purchaser","type":"address"},{"indexed":false,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensPurchased","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_contributions","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_rate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_wallet","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_weiRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"availableTokensICO","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"checkContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endICO","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setAvailableTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"setRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"newWallet","type":"address"}],"name":"setWalletReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"endDate","type":"uint256"}],"name":"startICO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"stopICO","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"weiRaised","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"tokenAddress","type":"address"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]}');
// EXTERNAL MODULE: ./node_modules/@rainbow-me/rainbowkit/dist/index.js + 3 modules
var dist = __webpack_require__(72305);
// EXTERNAL MODULE: ./node_modules/@rainbow-me/rainbowkit/dist/wallets/walletConnectors/chunk-7TYS3UTW.js
var chunk_7TYS3UTW = __webpack_require__(90632);
// EXTERNAL MODULE: ./node_modules/@rainbow-me/rainbowkit/dist/wallets/walletConnectors/chunk-WAKZTN2N.js
var chunk_WAKZTN2N = __webpack_require__(10254);
// EXTERNAL MODULE: ./node_modules/@rainbow-me/rainbowkit/dist/wallets/walletConnectors/chunk-2X2KWBQI.js
var chunk_2X2KWBQI = __webpack_require__(76607);
// EXTERNAL MODULE: ./node_modules/@wagmi/core/dist/chunk-LAFZBYO7.js + 75 modules
var chunk_LAFZBYO7 = __webpack_require__(21039);
// EXTERNAL MODULE: ./node_modules/wagmi/dist/index.js + 25 modules
var wagmi_dist = __webpack_require__(40965);
// EXTERNAL MODULE: ./node_modules/viem/_esm/chains/definitions/bsc.js
var bsc = __webpack_require__(55590);
// EXTERNAL MODULE: ./node_modules/@wagmi/core/dist/providers/public.js
var providers_public = __webpack_require__(81033);
// EXTERNAL MODULE: ./node_modules/viem/_esm/utils/unit/parseEther.js + 1 modules
var parseEther = __webpack_require__(81882);
;// CONCATENATED MODULE: ./components/common/Header.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 












const projectId = "da2ffc3f8eb0b295ff1ec21d73e08f8a";
const { chains, publicClient } = (0,chunk_LAFZBYO7/* configureChains */.QB)([
    bsc/* bsc */.e
], [
    (0,providers_public/* publicProvider */.I)()
]);
const { wallets } = (0,dist/* getDefaultWallets */.wo)({
    appName: "Virtual X",
    projectId,
    chains
});
const VirtualXInfo = {
    appName: "Virtual X"
};
const connectors = (0,dist/* connectorsForWallets */.a3)([
    ...wallets,
    {
        groupName: "Recommended",
        wallets: [
            (0,chunk_7TYS3UTW/* injectedWallet */.U)({
                chains
            }),
            (0,chunk_WAKZTN2N/* rainbowWallet */.u)({
                projectId,
                chains
            }),
            (0,chunk_2X2KWBQI/* walletConnectWallet */.D)({
                projectId,
                chains
            })
        ]
    }
]);
const wagmiConfig = (0,wagmi_dist/* createConfig */._g)({
    autoConnect: true,
    connectors,
    publicClient
});
const Header = ()=>{
    const { contractAddress, ABI } = config_namespaceObject;
    const { address, isConnecting, isDisconnected } = (0,wagmi_dist/* useAccount */.mA)();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0,react_.useState)(false);
    const Address = address;
    const [tokensToSend, setTokensToSend] = (0,react_.useState)("");
    const { data, isLoading, isSuccess, sendTransaction } = (0,wagmi_dist/* useSendTransaction */.pQ)({
        to: config_namespaceObject.contractAddress,
        value: (0,parseEther/* parseEther */.f)(tokensToSend)
    });
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("header", {
        className: "main-container bg-dark flex justify-between items-center rounded-[38px] mt-10 py-[13px] px-[28px] relative z-20",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "logo",
                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                    src: VirtualXLogo_1_1,
                    alt: "logo",
                    className: "w-28 md:w-[218px]"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "block lg:hidden",
                children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                    className: "text-white",
                    onClick: ()=>setIsMobileMenuOpen(!isMobileMenuOpen),
                    children: isMobileMenuOpen ? /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                        className: "rotate-90 transition-all w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M6 18L18 6M6 6l12 12"
                        })
                    }) : /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                        className: "w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M4 6h16M4 12h16m-7 6h7"
                        })
                    })
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "hidden lg:flex space-x-4",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(wagmi_dist/* WagmiConfig */.eM, {
                        config: wagmiConfig,
                        children: /*#__PURE__*/ jsx_runtime_.jsx(chunk_VAJWZI5T/* RainbowKitProvider */.pj, {
                            chains: chains,
                            appInfo: VirtualXInfo,
                            modalSize: "compact",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(chunk_VAJWZI5T/* ConnectButton */.NL, {})
                            })
                        })
                    }),
                    ")",
                    /*#__PURE__*/ jsx_runtime_.jsx(ui_PrimaryBtn, {
                        download: true,
                        text: "Whitepaper"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        value: tokensToSend,
                        type: "number",
                        style: {
                            WebkitAppearance: "none"
                        },
                        className: "font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-3xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink",
                        placeholder: "BNB's To Invest",
                        onChange: (e)=>{
                            setTokensToSend(e.target.value);
                        }
                    })
                ]
            }),
            isMobileMenuOpen && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `w-full pt-6 pb-4 lg:hidden absolute left-0 -bottom-48  bg-dark transition-all rounded-[42px] fade-right`,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex flex-col mx-auto gap-3 w-[200px]",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(wagmi_dist/* WagmiConfig */.eM, {
                            config: wagmiConfig,
                            children: /*#__PURE__*/ jsx_runtime_.jsx(chunk_VAJWZI5T/* RainbowKitProvider */.pj, {
                                chains: chains,
                                appInfo: VirtualXInfo,
                                modalSize: "compact",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    children: /*#__PURE__*/ jsx_runtime_.jsx(chunk_VAJWZI5T/* ConnectButton */.NL, {})
                                })
                            })
                        }),
                        ")",
                        /*#__PURE__*/ jsx_runtime_.jsx(ui_PrimaryBtn, {
                            download: true,
                            text: "Whitepaper"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("input", {
                            value: tokensToSend,
                            type: "number",
                            style: {
                                WebkitAppearance: "none"
                            },
                            className: "font-SourceSans3 bg-brandColor border-[3px] border-brandColor button-small text-white rounded-3xl px-4 py-2 hover:bg-dark active:border-b-[3px] active:border-lightPink",
                            placeholder: "BNB's To Invest",
                            onChange: (e)=>{
                                setTokensToSend(e.target.value);
                            }
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const common_Header = (Header);

// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(4047);
;// CONCATENATED MODULE: ./public/VirtualXLogo-1.svg
/* harmony default export */ const VirtualXLogo_1 = ({"src":"/_next/static/media/VirtualXLogo-1.f839b283.svg","height":68,"width":218,"blurWidth":0,"blurHeight":0});
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./public/telegram.svg
/* harmony default export */ const telegram = ({"src":"/_next/static/media/telegram.0fd45f91.svg","height":24,"width":24,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./public/Facebook.svg
/* harmony default export */ const Facebook = ({"src":"/_next/static/media/Facebook.328cd72c.svg","height":29,"width":29,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./public/Twitter.svg
/* harmony default export */ const Twitter = ({"src":"/_next/static/media/Twitter.857e7027.svg","height":29,"width":29,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./public/Github.svg
/* harmony default export */ const Github = ({"src":"/_next/static/media/Github.00e726a0.svg","height":13,"width":14,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./components/common/Footer.tsx








const Footer = ()=>{
    const SocialLink = [
        {
            "name": "Twitter",
            "icon": Twitter,
            "link": "https://www.twitter.com/virtualxuk"
        },
        {
            "name": "Facebook",
            "icon": Facebook,
            "link": "#"
        },
        {
            "name": "Telegram",
            "icon": telegram,
            "link": "https://t.me/VirtualXuk"
        },
        {
            "name": "Github",
            "icon": Github,
            "link": "#"
        }
    ];
    const Company = [
        {
            "name": "About",
            "link": "/#about"
        },
        {
            "name": "Team",
            "link": "/#team"
        },
        {
            "name": "Features",
            "link": "/#"
        },
        {
            "name": "Road map",
            "link": "/#roadmap"
        }
    ];
    const Home = [
        {
            "name": "Terms & Conditions",
            "link": "/terms"
        },
        {
            "name": "Privacy Policy",
            "link": "/privacy"
        },
        {
            "name": "FAQ",
            "link": "/#faq"
        }
    ];
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "bg-black py-16 lg:px-52 md:px-8 px-8 flex justify-center flex-col ",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex justify-center md:justify-between text-white flex-col md:flex-row",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "py-4",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                src: VirtualXLogo_1,
                                alt: "logo",
                                className: "mb-5",
                                width: 197.26,
                                height: 60.67
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                                className: "font-normal text-dark2",
                                children: [
                                    "The future of Mobile is here",
                                    /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                                    " powered by cryptocurrencies &",
                                    /*#__PURE__*/ jsx_runtime_.jsx("br", {}),
                                    " blockchain technology"
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "flex mt-[48px]",
                                children: SocialLink.map((data, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "bg-dark2 hover:bg-brandColor hover:border border-white mr-4 h-[28px] w-[28px] rounded-full flex items-center justify-center",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                href: data.link,
                                                target: "_blank",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                                    src: data.icon,
                                                    alt: data.name
                                                })
                                            })
                                        })
                                    }, index))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "py-5",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "text-brandColor uppercase my-3",
                                children: "Company"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "flex flex-col items-start",
                                children: Company.map((data, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "text-dark2 my-3",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                href: data.link,
                                                className: "hover:text-white active:text-brandColor transition-all",
                                                children: data.name
                                            })
                                        })
                                    }, index))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "py-5",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "text-brandColor uppercase my-3",
                                children: "Resources"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "flex flex-col items-start",
                                children: Home.map((data, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "text-dark2 my-3",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: data.link,
                                                className: "hover:text-white active:text-brandColor transition-all",
                                                children: data.name
                                            })
                                        })
                                    }, index))
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: /*#__PURE__*/ jsx_runtime_.jsx("hr", {
                    className: "bg-[#E2E8F0] h-px my-5"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "text-dark2 flex justify-center text-center",
                children: [
                    "\xa9 Copyright ",
                    new Date().getFullYear(),
                    ", All Rights Reserved by VIRTUALX"
                ]
            })
        ]
    });
};
/* harmony default export */ const common_Footer = (Footer);

// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"components/CountdownClock.tsx","import":"Poppins","arguments":[{"weight":"400","subsets":["latin"],"variable":"--font-blackops"}],"variableName":"clockFont"}
var CountdownClock_tsx_import_Poppins_arguments_weight_400_subsets_latin_variable_font_blackops_variableName_clockFont_ = __webpack_require__(66343);
var CountdownClock_tsx_import_Poppins_arguments_weight_400_subsets_latin_variable_font_blackops_variableName_clockFont_default = /*#__PURE__*/__webpack_require__.n(CountdownClock_tsx_import_Poppins_arguments_weight_400_subsets_latin_variable_font_blackops_variableName_clockFont_);
;// CONCATENATED MODULE: ./components/CountdownClock.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 


function CountdownClock() {
    const calculateTimeLeft = ()=>{
        const targetDate = new Date("2023-09-29T17:00:00Z"); // Replace with your target end date
        const currentDate = new Date();
        const timeDifference = targetDate - currentDate;
        if (timeDifference > 0) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor(timeDifference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            const minutes = Math.floor(timeDifference % (1000 * 60 * 60) / (1000 * 60));
            const seconds = Math.floor(timeDifference % (1000 * 60) / 1000);
            return {
                days,
                hours,
                minutes,
                seconds
            };
        } else {
            // If the target date has passed, return all zeros
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
    };
    const [timeLeft, setTimeLeft] = (0,react_.useState)(calculateTimeLeft);
    (0,react_.useEffect)(()=>{
        const timer = setInterval(()=>{
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
        }, 1000);
        return ()=>clearInterval(timer);
    }, []);
    // Calculate the values within the 0-99 range
    const daysValue = Math.max(0, Math.min(99, timeLeft.days));
    const hoursValue = Math.max(0, Math.min(99, timeLeft.hours));
    const minutesValue = Math.max(0, Math.min(99, timeLeft.minutes));
    const secondsValue = Math.max(0, Math.min(99, timeLeft.seconds));
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        style: {
            textShadow: "5px 5px 20px #FF69B4"
        },
        className: `justify-center md:my-3 text-base text-white flex md:gap-x-5 gap-x-2 ${(CountdownClock_tsx_import_Poppins_arguments_weight_400_subsets_latin_variable_font_blackops_variableName_clockFont_default()).variable}`
    });
} /******************** */  // import useWindowWidth from '@/hooks/useWindowWidth';
 // import React, { useCallback, useEffect, useRef, useState } from "react";
 // import { Poppins } from 'next/font/google';
 // const clockFont = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-blackops' })
 // export default function CountdownClock() {
 //   const [timeLeft, setTimeLeft] = useState({
 //     days: 3,
 //     hours: 0,
 //     minutes: 0,
 //     seconds: 0,
 //   });
 //   //const clockFont = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-blackops' })
 //   // Calculate the values within the 0-99 range
 //   const daysValue = Math.max(0, Math.min(99, timeLeft.days));
 //   const hoursValue = Math.max(0, Math.min(99, timeLeft.hours));
 //   const minutesValue = Math.max(0, Math.min(99, timeLeft.minutes));
 //   const secondsValue = Math.max(0, Math.min(99, timeLeft.seconds));
 //   return (
 //     <div className="justify-center md:my-3 text-base text-white filter: drop-shadow(0 1px 1px ring-amber-600) flex md:gap-x-5 gap-x-2 ${clockFont.variable}">
 //     <div>
 //       <h4 className=" my-0.5 md:text-3xl text-sm">PRESALE STARTS IN: </h4>
 //     </div>
 //       <div>
 //         <span className="countdown md:text-4xl text-sm">
 //           <span>{daysValue}</span>
 //         </span>
 //         days
 //       </div>
 //       <div>
 //         <span className="countdown md:text-4xl text-sm">
 //           <span>{hoursValue}</span>
 //         </span>
 //         hours
 //       </div>
 //       <div>
 //         <span className="countdown md:text-4xl text-sm">
 //           <span>{minutesValue}</span>
 //         </span>
 //         min
 //       </div>
 //       <div>
 //         <span className="countdown md:text-4xl text-sm">
 //           <span>{secondsValue}</span>
 //         </span>
 //         sec
 //       </div>
 //     </div>
 //   );
 // }
 //////////////////////*************************** */
 // 'use client'
 // import { useState, useEffect } from 'react'
 // import { Poppins } from 'next/font/google';
 // import useWindowWidth from '@/hooks/useWindowWidth';
 // const clockFont = Poppins({ weight: "400", subsets: ['latin'], variable: '--font-blackops' })
 // export default function CountdownClock() {
 //   const windowWidth = useWindowWidth();
 //   const [timeLeft, setTimeLeft] = useState({
 //     days: 0,
 //     hours: 0,
 //     minutes: 0,
 //     seconds: 0,
 //   })
 //   const [progress, setProgress] = useState(100)
 //   const progressStart = new Date('Aug 4, 2023 15:37:25').getTime()
 //   const startTime = new Date().getTime()
 //   const endTime = new Date('Dec 5, 2023 15:37:25').getTime()
 //   const totalTime = endTime - startTime
 //   const progressTotal = endTime - progressStart;
 //   useEffect(() => {
 //     let interval = setInterval(() => {
 //       updateTimer()
 //     }, 1000)
 //     return () => clearInterval(interval)
 //     function updateTimer() {
 //       const now = new Date().getTime()
 //       const distance = endTime - now
 //       const days = Math.floor(distance / (1000 * 60 * 60 * 24))
 //       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
 //       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
 //       const seconds = Math.floor((distance % (1000 * 60)) / 1000)
 //       if (distance < 0) {
 //         clearInterval(interval)
 //         setProgress(0)
 //         return
 //       }
 //       setTimeLeft({
 //         days,
 //         hours,
 //         minutes,
 //         seconds,
 //       })
 //       setProgress(Math.floor((distance / progressTotal) * 100))
 //     }
 //   }, [endTime, totalTime, progressTotal])
 //   return (
 //     <section className={`main-container py-10 md:mb-40 xxl:my-56 ${clockFont.variable}`}>
 //       {/* UI version #5 */}
 //       <div className='clock-wrapper relative'>
 //         <span className='hidden md:block extra-cercles'></span>
 //         <h1 className='text-2xl text-white text-center pl-2'>Presale Coming Soon</h1>
 //         <div className='py-8 max-w-[405px] mx-auto'>
 //           <ul className="grid grid-cols-4 text-white">
 //             <li className="clock-list time-divider">
 //               <span className="clock-counts">{timeLeft.days}</span>
 //               <span className="clock-names">Days</span>
 //             </li>
 //             <li className="clock-list time-divider">
 //               <span className="clock-counts">{timeLeft.hours}</span>
 //               <span className="clock-names">Hours</span>
 //             </li>
 //             <li className="clock-list time-divider">
 //               <span className="clock-counts">{timeLeft.minutes}</span>
 //               <span className="clock-names">Minutes</span>
 //             </li>
 //             <li className="clock-list">
 //               <span className="clock-counts">{timeLeft.seconds}</span>
 //               <span className="clock-names">Seconds</span>
 //             </li>
 //           </ul>
 //           <div className="token-status-bar">
 //             <div className="token-status-percent" style={{width:`${progress}%`}}></div>
 //             <span className="token-status-point" style={{left:"25%"}}>presale</span>
 //             <span className="token-status-point" style={{left:"55%"}}>soft cap</span>
 //             <span className="token-status-point" style={{left:"80%"}}>bonus</span>
 //           </div>
 //           <div className='text-center z-20'>
 //             <button className="font-SourceSans3 bg-brandColor mt-8 text px-8 font-bold leading-150 hover:bg-transparent border border-brandColor hover:text-brandColor text-white py-3 rounded-full uppercase">Buy PreSale now</button>
 //           </div>
 //         </div>
 //       </div>
 //     </section>
 //   )
 // }

// EXTERNAL MODULE: ./node_modules/@rainbow-me/rainbowkit/dist/index.css
var rainbowkit_dist = __webpack_require__(35548);
;// CONCATENATED MODULE: ./app/layout.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 












const layout_projectId = "da2ffc3f8eb0b295ff1ec21d73e08f8a";
const { chains: layout_chains, publicClient: layout_publicClient } = (0,chunk_LAFZBYO7/* configureChains */.QB)([
    bsc/* bsc */.e
], [
    (0,providers_public/* publicProvider */.I)()
]);
const { wallets: layout_wallets } = (0,dist/* getDefaultWallets */.wo)({
    appName: "Virtual X",
    projectId: layout_projectId,
    chains: layout_chains
});
const layout_VirtualXInfo = {
    appName: "Virtual X"
};
const layout_connectors = (0,dist/* connectorsForWallets */.a3)([
    ...layout_wallets,
    {
        groupName: "Recommended",
        wallets: [
            (0,chunk_7TYS3UTW/* injectedWallet */.U)({
                chains: layout_chains
            }),
            (0,chunk_WAKZTN2N/* rainbowWallet */.u)({
                projectId: layout_projectId,
                chains: layout_chains
            }),
            (0,chunk_2X2KWBQI/* walletConnectWallet */.D)({
                projectId: layout_projectId,
                chains: layout_chains
            })
        ]
    }
]);
const layout_wagmiConfig = (0,wagmi_dist/* createConfig */._g)({
    autoConnect: true,
    connectors: layout_connectors,
    publicClient: layout_publicClient
});
function RootLayout({ children }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("html", {
        lang: "en",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("head", {
                children: /*#__PURE__*/ jsx_runtime_.jsx("link", {
                    rel: "icon",
                    href: "/favicon.ico"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("body", {
                className: `${(layout_tsx_import_Space_Grotesk_arguments_subsets_latin_display_auto_variableName_space_default()).className} overflow-x-hidden ${(layout_tsx_import_Source_Sans_3_arguments_subsets_latin_display_auto_variable_font_source_sans_3_variableName_btnFont_default()).variable}`,
                style: {
                    paddingLeft: "2%"
                },
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(wagmi_dist/* WagmiConfig */.eM, {
                        config: layout_wagmiConfig,
                        children: /*#__PURE__*/ jsx_runtime_.jsx(chunk_VAJWZI5T/* RainbowKitProvider */.pj, {
                            chains: layout_chains,
                            appInfo: layout_VirtualXInfo,
                            modalSize: "compact",
                            children: /*#__PURE__*/ jsx_runtime_.jsx(common_Header, {})
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        style: {
                            position: "relative",
                            top: "-20px"
                        },
                        children: /*#__PURE__*/ jsx_runtime_.jsx(CountdownClock, {})
                    }),
                    children,
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "dekstop_styling ",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(common_Footer, {})
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 51921:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $$typeof: () => (/* binding */ $$typeof),
/* harmony export */   __esModule: () => (/* binding */ __esModule),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61363);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/home/afaq/Downloads/virtualX-Final/hooks/app/layout.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__default__);

/***/ }),

/***/ 57481:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80085);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/x-icon","sizes":"141x148"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "favicon.ico")

    return [{
      ...imageData,
      url: imageUrl + "",
    }]
  });

/***/ }),

/***/ 4047:
/***/ (() => {



/***/ })

};
;