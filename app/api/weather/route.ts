import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code`;

  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: "Weather fetch failed" }, { status: 500 });

  const data = await r.json();

  const current = data?.current;
  return NextResponse.json({
    temperature: current?.temperature_2m,
    windspeed: current?.wind_speed_10m,
    winddirection: current?.wind_direction_10m,
    weathercode: current?.weather_code
  });
}
