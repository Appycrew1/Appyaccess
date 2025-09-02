"use client";

import type { Checklist } from "@/types";

type Props = {
  value: Checklist;
  onChange: (v: Checklist) => void;
};

export default function Checklist({ value, onChange }: Props) {
  const upd = (k: keyof Checklist, v: any) => onChange({ ...value, [k]: v });

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="flex items-center gap-3">
        <input type="checkbox" className="size-4" checked={value.hasLift} onChange={e => upd("hasLift", e.target.checked)} />
        <span className="text-sm">Lift available</span>
      </label>

      <label className="flex items-center gap-3">
        <span className="text-sm w-40">Flights of stairs</span>
        <input type="number" min={0} className="input" value={value.stairsFlights} onChange={e => upd("stairsFlights", Number(e.target.value))} />
      </label>

      <label className="flex items-center gap-3">
        <input type="checkbox" className="size-4" checked={value.narrowDoor} onChange={e => upd("narrowDoor", e.target.checked)} />
        <span className="text-sm">Narrow doorways</span>
      </label>

      <label className="flex items-center gap-3">
        <input type="checkbox" className="size-4" checked={value.rearAccess} onChange={e => upd("rearAccess", e.target.checked)} />
        <span className="text-sm">Rear access available</span>
      </label>

      <label className="flex items-center gap-3">
        <input type="checkbox" className="size-4" checked={value.parkingAvailable} onChange={e => upd("parkingAvailable", e.target.checked)} />
        <span className="text-sm">Parking available on site</span>
      </label>

      <label className="flex items-center gap-3">
        <input type="checkbox" className="size-4" checked={value.largeVehicleAccess} onChange={e => upd("largeVehicleAccess", e.target.checked)} />
        <span className="text-sm">Large vehicle access</span>
      </label>
    </div>
  );
}
