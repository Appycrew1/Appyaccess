"use client";
import { Loader } from "@googlemaps/js-api-loader";import { useEffect, useRef, useState } from "react";
export function useGoogleMaps(){const [ready,setReady]=useState(false);const loaderRef=useRef<Loader|null>(null);useEffect(()=>{const key=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string|undefined;if(!key){console.warn("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set");return;}if(!loaderRef.current){loaderRef.current=new Loader({apiKey:key,version:"weekly",libraries:["places"]});}loaderRef.current.load().then(()=>setReady(true)).catch(console.error);},[]);return ready;}
