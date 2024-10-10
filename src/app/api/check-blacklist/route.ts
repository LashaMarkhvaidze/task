import { NextResponse } from 'next/server';

const fetchWithRetry = async (url: string, options: RequestInit, retries: number = 3): Promise<unknown> => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error fetching data from lookup API:', errorResponse);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... attempts left: ${retries}`);
            await new Promise(res => setTimeout(res, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        console.error('Failed to fetch after retries:', error);
        throw error; 
    }
};

export async function POST(req: Request) {
    try {
        const { numbers }: { numbers?: string[] } = await req.json();

        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return NextResponse.json({ error: 'Invalid input: No phone numbers provided' }, { status: 400 });
        }

        const apiKey = process.env.BLACKLIST_API_KEY;
        const results = await Promise.all(numbers.map(async (phone) => {
            const url = `https://api.blacklistalliance.net/lookup?key=${apiKey}&phone=${phone}`;
            return fetchWithRetry(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            }).then(data => ({ phone, data }))
              .catch(error => ({ phone, error: error.message || 'Unknown error' }));
        }));

        console.log(results);
        return NextResponse.json(results);

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Server error', details: error || 'Unknown error' }, { status: 500 });
    }
}
