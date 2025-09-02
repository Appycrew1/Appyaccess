export type PlaceLite={description:string;place_id:string;lat:number;lng:number;address?:string};
export type RouteInfo={distance_m:number;duration_s:number;duration_in_traffic_s?:number};
export type Weather={temperature:number;windspeed:number;winddirection:number;weathercode:number};
export type Checklist={hasLift:boolean;stairsFlights:number;narrowDoor:boolean;rearAccess:boolean;parkingAvailable:boolean;largeVehicleAccess:boolean};
export type AnalysisPayload={origin:PlaceLite;destination:PlaceLite;route:RouteInfo|null;weather:Weather|null;checklist:Checklist;building:{doorWidthCm?:number|null;stairWidthCm?:number|null;floors?:number|null}};
export type AIResult={summary:string;crewRecommendation:string;equipment:string[];riskLevel:"Low"|"Medium"|"High";keyRisks:string[];parkingNotes:string;complianceChecklist:string[];originVsDest:string;autoChecklist:Checklist};
