import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import type { AIResult, AnalysisPayload } from "@/types";

const payloadSchema = z.object({
  depot: z.object({ description: z.string(), place_id: z.string(), lat: z.number(), lng: z.number(), address: z.string().optional() }),
  customer: z.object({ description: z.string(), place_id: z.string(), lat: z.number(), lng: z.number(), address: z.string().optional() }),
  route: z.object({ distance_m: z.number(), duration_s: z.number() }).nullable(),
  weather: z.object({ temperature: z.number(), windspeed: z.number(), winddirection: z.number(), weathercode: z.number() }).nullable(),
  checklist: z.object({
    hasLift: z.boolean(),
    stairsFlights: z.number().int().min(0),
    narrowDoor: z.boolean(),
    rearAccess: z.boolean(),
    parkingAvailable: z.boolean(),
    largeVehicleAccess: z.boolean()
  }),
  building: z.object({
    doorWidthCm: z.number().min(0).nullable().optional(),
    stairWidthCm: z.number().min(0).nullable().optional(),
    floors: z.number().int().min(0).nullable().optional(),
  })
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const payload = payloadSchema.parse(json) as AnalysisPayload;

    const prompt = `You are an operations planner for a moving/delivery crew.
Given this structured data, produce concise, actionable planning guidance.

RETURN JSON with keys: summary (string), crewRecommendation (string), equipment (string[]),
riskLevel ("Low"|"Medium"|"High"), keyRisks (string[]), parkingNotes (string), complianceChecklist (string[]).

Data:
- Depot: ${payload.depot.description} (${payload.depot.lat}, ${payload.depot.lng})
- Customer: ${payload.customer.description} (${payload.customer.lat}, ${payload.customer.lng})
- Route: ${payload.route ? `${payload.route.distance_m} meters, ${payload.route.duration_s} seconds` : "unknown"}
- Weather: ${payload.weather ? `Temp ${payload.weather.temperature}°C, Wind ${payload.weather.windspeed} km/h` : "unknown"}
- Checklist: ${JSON.stringify(payload.checklist)}
- Building: ${JSON.stringify(payload.building)}

Consider:
- If no lift & stairsFlights >= 2 -> increase crew, recommend stair-climber.
- If narrowDoor -> mention door removal/hinge-pin tools; measure width vs item sizes.
- If no parkingAvailable or no largeVehicleAccess -> suggest shuttle vehicle/dolly distance plan.
- Route distance/duration informs fatigue & timings.
- Weather: Rain/wind -> handling risks & coverings.

Be brief but specific. Respond ONLY with JSON.`;

    // Use Chat Completions for broad compatibility
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You produce concise JSON-only operational guidance with no extra text." },
        { role: "user", content: prompt }
      ]
    });

    const content = completion.choices[0]?.message?.content?.trim() || "{}";
    let parsed: AIResult;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Attempt to extract JSON block if model returned decoration
      const match = content.match(/\{[\s\S]*\}$/);
      parsed = match ? JSON.parse(match[0]) : {
        summary: "AI summary unavailable.",
        crewRecommendation: "2-person crew by default.",
        equipment: [],
        riskLevel: "Medium",
        keyRisks: [],
        parkingNotes: "",
        complianceChecklist: []
      };
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 400 });
  }
}
