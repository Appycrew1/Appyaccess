export function formatDistance(m?:number){if(m==null)return"—";if(m<1000)return`${Math.round(m)} m`;return`${(m/1000).toFixed(1)} km`}
export function formatDuration(s?:number){if(s==null)return"—";const m=Math.round(s/60);if(m<60)return`${m} min`;const h=Math.floor(m/60),r=m%60;return r?`${h} hr ${r} min`:`${h} hr`}
export function clsx(...v:(string|false|null|undefined)[]){return v.filter(Boolean).join(" ")}
