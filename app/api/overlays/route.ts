import { NextResponse } from "next/server";
async function fetchGeo(url?:string){if(!url)return null;try{const r=await fetch(url,{cache:"no-store"});if(!r.ok)return null;return await r.json();}catch{return null;}}
export async function GET(){const ulez=await fetchGeo(process.env.ULEZ_GEOJSON_URL);const lez=await fetchGeo(process.env.LEZ_GEOJSON_URL);const llcs=await fetchGeo(process.env.LLCS_GEOJSON_URL);return NextResponse.json({ulez,lez,llcs});}
