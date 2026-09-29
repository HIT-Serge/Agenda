export const ZONE = 'Europe/Amsterdam';
export function localNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).filter(p => p.type !== 'literal').map(p => [p.type,p.value]));
  return {day:`${parts.year}-${parts.month}-${parts.day}`, hour:Number(parts.hour), minute:Number(parts.minute)};
}
export function allowed(day:string, hour:string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^(09|10|11|12|13|14|15|16):00$/.test(hour)) return false;
  const date = new Date(`${day}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0,10)!==day || [0,6].includes(date.getUTCDay())) return false;
  const now=localNow();
  const days=(Date.parse(`${day}T00:00:00Z`)-Date.parse(`${now.day}T00:00:00Z`))/86400000;
  return days>=0 && days<=14 && (days>0 || Number(hour.slice(0,2))>now.hour || Number(hour.slice(0,2))===now.hour && now.minute===0);
}
