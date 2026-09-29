import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Reserveren | Agenda',description:'Boek een afspraak op een beschikbaar tijdstip.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="nl"><body>{children}</body></html>}
