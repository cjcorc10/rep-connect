import { NextResponse } from 'next/server';
import { getDistricts, getCoordinates } from '@/app/lib/util';
import { getHouseReps } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { street, zip } = (await req.json()) as {
      street: string;
      zip: string;
    };
    if (!zip)
      return NextResponse.json(
        { error: 'ZIP code is required' },
        { status: 400 }
      );

    const address = street ? `${street}, ${zip}` : zip;
    const geo = await getCoordinates(address);
    const g = geo?.results?.[0]?.geometry;
    if (!g)
      return NextResponse.json(
        { error: 'Failed to get coordinates' },
        { status: 500 }
      );

    const { northeast, southwest } = g.bounds;
    const { state, districts } = await getDistricts({
      northeast,
      southwest,
    });
    const reps = await getHouseReps(districts, state);

    return NextResponse.json({ state, districts, reps });
  } catch (error) {
    return NextResponse.json({ error: 'Server' }, { status: 500 });
  }
}
