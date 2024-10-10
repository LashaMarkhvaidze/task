import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { numbers }: { numbers?: string[] } = await req.json();

        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return NextResponse.json({ error: 'Invalid input: No phone numbers provided' }, { status: 400 });
        }

        const apiKey = process.env.BLACKLIST_API_KEY;
        const results = await Promise.all(numbers.map(async (phone) => {
            const response = await fetch(`https://api.blacklistalliance.net/lookup?key=${apiKey}&phone=${phone}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error fetching data from lookup API:', errorResponse);
                return { phone, error: errorResponse };
            }

            return { phone, data: await response.json() };
        }));
        console.log(results)

        return NextResponse.json(results);

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
    }
}
