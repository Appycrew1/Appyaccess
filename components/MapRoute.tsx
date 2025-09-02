"use client";

import { useEffect, useRef, useState } from "react";
import { useGoogleMaps } from "./GoogleLoader";
import type { PlaceLite, RouteInfo } from "@/types";
import { formatDistance, formatDuration } from "@/lib/utils";

type Props = {
  depot: PlaceLite | null;
  customer: PlaceLite | null;
  onRoute: (info: RouteInfo | null) => void;
};

export default function MapRoute({ depot, customer, onRoute }: Props) {
  const ready = useGoogleMaps();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const mapObjRef = useRef<google.maps.Map | null>(null);
  const dirRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const dirServiceRef = useRef<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (!ready || !mapRef.current || mapObjRef.current) return;
    mapObjRef.current = new google.maps.Map(mapRef.current, {
      center: { lat: 51.509865, lng: -0.118092 }, // London default
      zoom: 8,
      mapId: "DEMO_MAP_ID"
    });
    dirRendererRef.current = new google.maps.DirectionsRenderer();
    dirRendererRef.current.setMap(mapObjRef.current);
    dirServiceRef.current = new google.maps.DirectionsService();
  }, [ready]);

  useEffect(() => {
    if (!ready || !mapObjRef.current || !dirServiceRef.current || !dirRendererRef.current) return;

    const canRoute = depot && customer;
    if (!canRoute) {
      setDistance(null);
      setDuration(null);
      onRoute(null);
      return;
    }

    const origin = new google.maps.LatLng(depot!.lat, depot!.lng);
    const destination = new google.maps.LatLng(customer!.lat, customer!.lng);

    dirServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result) {
          dirRendererRef.current!.setDirections(result);
          const leg = result.routes[0]?.legs[0];
          const dist = leg?.distance?.value ?? null; // meters
          const dur = leg?.duration?.value ?? null; // seconds
          setDistance(dist);
          setDuration(dur);
          onRoute(dist && dur ? { distance_m: dist, duration_s: dur } : null);
        } else {
          setDistance(null);
          setDuration(null);
          onRoute(null);
        }
      }
    );
  }, [depot?.place_id, customer?.place_id, ready]);

  return (
    <div className="space-y-3">
      <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-700 card">
        <div ref={mapRef} className="h-full w-full" />
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <span className="badge">Distance: <strong className="ml-1">{distance !== null ? formatDistance(distance) : "—"}</strong></span>
        <span className="badge">ETA: <strong className="ml-1">{duration !== null ? formatDuration(duration) : "—"}</strong></span>
      </div>
    </div>
  );
}
