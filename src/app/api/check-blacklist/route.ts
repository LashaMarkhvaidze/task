import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { numbers }: { numbers?: string[] } = await req.json();

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: 'Invalid input: No phone numbers provided' }, { status: 400 });
    }

    const body = {
      phones: numbers,
    };

    const apiKey = process.env.BLACKLIST_API_KEY;
    const url = `https://api.blacklistalliance.net/bulklookup?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error fetching data from bulk lookup API:', errorResponse);
      return NextResponse.json({ error: errorResponse }, { status: response.status });
    }

    const results = await response.json();
    return NextResponse.json(results);

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
}
