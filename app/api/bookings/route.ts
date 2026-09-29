import { env } from 'cloudflare:workers';
import { allowed } from '@/lib/booking';
export async function POST(request:Request) {
  let data:Record<string,unknown>;
  try {data=await request.json() as Record<string,unknown>;} catch {return Response.json({error:'Ongeldige invoer.'},{status:400});}
  const {day,hour,name,email}=data;
  if (typeof day!=='string'||typeof hour!=='string'||!allowed(day,hour)||typeof name!=='string'||name.trim().length<2||name.length>100||typeof email!=='string'||email.length>254||!/^\S+@\S+\.\S+$/.test(email)) return Response.json({error:'Controleer datum, tijd, naam en e-mailadres.'},{status:400});
  const id=crypto.randomUUID(), token=crypto.randomUUID()+crypto.randomUUID();
  try {
    await env.DB.prepare('INSERT INTO bookings (id,day,hour,name,email,cancel_token,created_at) VALUES (?,?,?,?,?,?,?)').bind(id,day,hour,name.trim(),email.trim(),token,new Date().toISOString()).run();
    return Response.json({day,hour,name:name.trim(),cancelUrl:`${new URL(request.url).origin}/annuleren?token=${token}`},{status:201});
  } catch (e) {
    if (String(e).includes('UNIQUE')) return Response.json({error:'Dit tijdslot is net geboekt. Kies een ander tijdstip.'},{status:409});
    return Response.json({error:'Reserveren lukt momenteel niet. Probeer het later opnieuw.'},{status:503});
  }
}
