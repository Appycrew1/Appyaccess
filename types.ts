export type PlaceLite={description:string;place_id:string;lat:number;lng:number;address?:string;types?:string[]};
export type RouteInfo={distance_m:number;duration_s:number;duration_in_traffic_s?:number};
export type WeatherDaily={date:string;tmax:number;tmin:number;windspeed:number;precipitation_mm:number};
export type Checklist={hasLift:boolean;stairsFlights:number;narrowDoor:boolean;rearAccess:boolean;parkingAvailable:boolean;largeVehicleAccess:boolean};
export type AnalysisPayload={origin:PlaceLite;destination:PlaceLite;moveDateISO:string;vehicleType:string;route:RouteInfo|null;weather:WeatherDaily|null;checklist:Checklist};
export type AIResult={summary:string;crewRecommendation:string;equipment:string[];riskLevel:"Low"|"Medium"|"High";keyRisks:string[];parkingNotes:string;complianceChecklist:string[];originVsDest:string;autoChecklist:Checklist};
