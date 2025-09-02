export type PlaceLite = {
  description: string;
  place_id: string;
  lat: number;
  lng: number;
  address?: string;
};

export type RouteInfo = {
  distance_m: number;
  duration_s: number;
};

export type Weather = {
  temperature: number; // °C
  windspeed: number;   // km/h
  winddirection: number;
  weathercode: number;
};


export type Checklist = {
  hasLift: boolean;
  stairsFlights: number;
  narrowDoor: boolean;
  rearAccess: boolean;
  parkingAvailable: boolean;
  largeVehicleAccess: boolean;
};

export type AnalysisPayload = {
  depot: PlaceLite;
  customer: PlaceLite;
  route: RouteInfo | null;
  weather: Weather | null;
  checklist: Checklist;
  building: {
    doorWidthCm?: number | null;
    stairWidthCm?: number | null;
    floors?: number | null;
  }
};

export type AIResult = {
  summary: string;
  crewRecommendation: string;
  equipment: string[];
  riskLevel: "Low" | "Medium" | "High";
  keyRisks: string[];
  parkingNotes: string;
  complianceChecklist: string[];
};
