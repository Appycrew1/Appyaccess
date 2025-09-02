"use client";

import { useEffect, useMemo, useState } from "react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import MapRoute from "@/components/MapRoute";
import Checklist from "@/components/Checklist";
import PdfExport from "@/components/PdfExport";
import type { AnalysisPayload, AIResult, Checklist as ChecklistType, PlaceLite, Weather } from "@/types";
import { clsx } from "@/lib/utils";

export default function Page() {
  const [depotText, setDepotText] = useState("");
  const [addrText, setAddrText] = useState("");

  const [depot, setDepot] = useState<PlaceLite | null>(null);
  const [customer, setCustomer] = useState<PlaceLite | null>(null);

  const [route, setRoute] = useState<{ distance_m: number; duration_s: number } | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  const [checklist, setChecklist] = useState<ChecklistType>({
    hasLift: false,
    stairsFlights: 0,
    narrowDoor: false,
    rearAccess: false,
    parkingAvailable: true,
    largeVehicleAccess: true
  });

  const [buildingDoorWidth, setBuildingDoorWidth] = useState<number | "">("");
  const [buildingStairWidth, setBuildingStairWidth] = useState<number | "">("");
  const [buildingFloors, setBuildingFloors] = useState<number | "">("");

  const [ai, setAI] = useState<AIResult | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload: AnalysisPayload | null = useMemo(() => {
    if (!depot || !customer) return null;
    return {
      depot,
      customer,
      route,
      weather,
      checklist,
      building: {
        doorWidthCm: typeof buildingDoorWidth === "number" ? buildingDoorWidth : null,
        stairWidthCm: typeof buildingStairWidth === "number" ? buildingStairWidth : null,
        floors: typeof buildingFloors === "number" ? buildingFloors : null
      }
    };
  }, [depot, customer, route, weather, checklist, buildingDoorWidth, buildingStairWidth, buildingFloors]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!customer) return;
      try {
        const url = `/api/weather?lat=${customer.lat}&lng=${customer.lng}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        setWeather(data);
      } catch (e: any) {
        console.error(e);
      }
    };
    fetchWeather();
  }, [customer?.place_id]);

  const analyze = async () => {
    if (!payload) return;
    setLoadingAI(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(await res.text());
      const data: AIResult = await res.json();
      setAI(data);
    } catch (e: any) {
      setError(e?.message || "Analysis failed");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card p-4">
          <h2 className="text-lg font-semibold mb-4">Inputs</h2>

          <div className="space-y-4">
            <AddressAutocomplete
              id="depot"
              label="Depot"
              placeholder="Enter depot name or address"
              value={depotText}
              onChange={setDepotText}
              onPlaceResolved={setDepot}
            />
            <AddressAutocomplete
              id="address"
              label="Customer Address"
              placeholder="Enter customer location"
              value={addrText}
              onChange={setAddrText}
              onPlaceResolved={setCustomer}
            />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Door width (cm)</label>
                <input className="input" type="number" min={0} value={buildingDoorWidth} onChange={(e) => setBuildingDoorWidth(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Stair width (cm)</label>
                <input className="input" type="number" min={0} value={buildingStairWidth} onChange={(e) => setBuildingStairWidth(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Floors</label>
                <input className="input" type="number" min={0} value={buildingFloors} onChange={(e) => setBuildingFloors(e.target.value === "" ? "" : Number(e.target.value))} />
              </div>
            </div>

            <div>
              <p className="label mb-2">Risk & Access Checklist</p>
              <Checklist value={checklist} onChange={setChecklist} />
            </div>

            <div className="flex gap-3">
              <button
                className={clsx("btn btn-primary", !(depot && customer) && "opacity-50 pointer-events-none")}
                onClick={analyze}
              >
                {loadingAI ? "Analyzing..." : "Analyze Address"}
              </button>
              <PdfExport ai={ai} payload={payload} />
            </div>

            {error && <p className="text-rose-400 text-sm">{error}</p>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3">Route</h2>
            <MapRoute depot={depot} customer={customer} onRoute={setRoute} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-4">
              <h3 className="font-semibold mb-2">Weather</h3>
              {weather ? (
                <div className="text-sm grid grid-cols-2 gap-2">
                  <div className="badge">Temperature <strong className="ml-1">{weather.temperature} °C</strong></div>
                  <div className="badge">Wind <strong className="ml-1">{weather.windspeed} km/h</strong></div>
                  <div className="badge">Direction <strong className="ml-1">{Math.round(weather.winddirection)}°</strong></div>
                  <div className="badge">Code <strong className="ml-1">{weather.weathercode}</strong></div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Enter a customer address to see live weather.</p>
              )}
            </div>

            <div className="card p-4">
              <h3 className="font-semibold mb-2">AI Summary</h3>
              {ai ? (
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-400">Risk:</span> <span className={clsx("font-semibold", ai.riskLevel === "High" && "text-rose-300", ai.riskLevel === "Medium" && "text-amber-300", ai.riskLevel === "Low" && "text-emerald-300")}>{ai.riskLevel}</span></p>
                  <p className="text-slate-300">{ai.summary}</p>
                  <div>
                    <p className="text-slate-400">Crew:</p>
                    <p>{ai.crewRecommendation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">Click <em>Analyze Address</em> for AI recommendations.</p>
              )}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2">Details</h3>
            {ai ? (
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Equipment</p>
                  <ul className="list-disc ml-5 space-y-1">{ai.equipment.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Key Risks</p>
                  <ul className="list-disc ml-5 space-y-1">{ai.keyRisks.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Parking Notes</p>
                  <p>{ai.parkingNotes || "—"}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">AI details will appear here.</p>
            )}
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-2">Compliance Checklist</h3>
            {ai ? (
              <ol className="list-decimal ml-5 space-y-1 text-sm">
                {ai.complianceChecklist.map((c, i) => <li key={i}>{c}</li>)}
              </ol>
            ) : (
              <p className="text-slate-400 text-sm">AI will suggest documents and compliance steps here.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
