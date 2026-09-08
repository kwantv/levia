export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address!)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&limit=1`,
  );
  const data = await res.json();
  const coords = data.features?.[0]?.center; // [lng, lat] — note the order!
  if (!coords) return Response.json(null);
  return Response.json({ lat: coords[1], lng: coords[0] });
}
