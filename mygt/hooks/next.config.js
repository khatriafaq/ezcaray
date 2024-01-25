const { config } = require('process')

/** @type {import('next').NextConfig} */
const nextConfig = {
   "output": "export",
    // images : {
    //     domains : ["localhost"]
    // }

    reactStrictMode : true,
    webpack: config =>
    {
        config.resolve.fallback = {fs : false, net : false, tls : false};
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },

};

module.exports = nextConfig 