import { NextResponse } from 'next/server';

// Define the HTTP GET method handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const startLon = searchParams.get('startLon');
  const startLat = searchParams.get('startLat');
  const endLon = searchParams.get('endLon');
  const endLat = searchParams.get('endLat');

  if (!startLon || !startLat || !endLon || !endLat) {
    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  }

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false`;

  try {
    const osrmResponse = await fetch(osrmUrl);
    if (!osrmResponse.ok) {
      throw new Error(`OSRM API error: ${osrmResponse.statusText}`);
    }
    const data = await osrmResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching data from OSRM API' }, { status: 500 });
  }
}
