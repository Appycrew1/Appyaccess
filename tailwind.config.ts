import type { Config } from "tailwindcss";
const config:Config={content:["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],theme:{extend:{colors:{brand:{50:"#eef7ff",100:"#d9ecff",200:"#bfe0ff",300:"#9cd0ff",400:"#6ab8ff",500:"#3a9bff",600:"#1f7df2",700:"#1a64c5",800:"#1c559d",900:"#1b497f"}}}},plugins:[]};
export default config;
