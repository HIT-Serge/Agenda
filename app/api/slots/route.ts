import { env } from 'cloudflare:workers';
import { allowed } from '@/lib/booking';
export async function GET(request:Request) {
  const day=new URL(request.url).searchParams.get('day')??'';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return Response.json({error:'Ongeldige datum.'},{status:400});
  try {
    const rows=await env.DB.prepare('SELECT hour FROM bookings WHERE day = ? AND cancelled_at IS NULL').bind(day).all<{hour:string}>();
    const busy=new Set(rows.results.map(x=>x.hour));
    const slots=Array.from({length:8},(_,i)=>`${String(i+9).padStart(2,'0')}:00`).map(hour=>({hour,available:allowed(day,hour)&&!busy.has(hour)}));
    return Response.json({slots});
  } catch { return Response.json({error:'Beschikbaarheid tijdelijk niet bereikbaar.'},{status:503}); }
}
