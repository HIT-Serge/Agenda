import { env } from 'cloudflare:workers';
export async function GET(request:Request) {
  const token=new URL(request.url).searchParams.get('token');
  if (!token || !/^[\da-f-]{72}$/.test(token)) return Response.json({error:'Ongeldige annuleringslink.'},{status:400});
  try {
    const item=await env.DB.prepare('SELECT day,hour,cancelled_at FROM bookings WHERE cancel_token=?').bind(token).first<{day:string,hour:string,cancelled_at:string|null}>();
    if (!item) return Response.json({error:'Reservering niet gevonden.'},{status:404});
    return Response.json({day:item.day,hour:item.hour,cancelled:!!item.cancelled_at});
  } catch {return Response.json({error:'Reservering tijdelijk niet bereikbaar.'},{status:503});}
}
export async function POST(request:Request) {
  const {token}=await request.json() as {token?:string};
  if (!token || !/^[\da-f-]{72}$/.test(token)) return Response.json({error:'Ongeldige annuleringslink.'},{status:400});
  try {
    const result=await env.DB.prepare('UPDATE bookings SET cancelled_at=? WHERE cancel_token=? AND cancelled_at IS NULL').bind(new Date().toISOString(),token).run();
    if (!result.meta.changes) return Response.json({error:'Deze reservering is niet actief.'},{status:404});
    return Response.json({cancelled:true});
  } catch {return Response.json({error:'Annuleren lukt momenteel niet.'},{status:503});}
}
