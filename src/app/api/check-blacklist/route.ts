import { BlacklistLookupResultProps } from '@/components/blacklist-lookup/BlacklistLookup.types';
import { NextResponse } from 'next/server';

const BATCH_SIZE = 200; // Define the batch size for concurrent requests

async function fetchData(url: string, apiKey: string, phone: string) {
    const response = await fetch(`${url}?key=${apiKey}&phone=${phone}`, {
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
}

async function fetchInBatches(numbers: string[], apiKey: string) {
    const results: { phone: string; data?: BlacklistLookupResultProps; error?: unknown }[] = [];

    for (let i = 0; i < numbers.length; i += BATCH_SIZE) {
        const batch = numbers.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(batch.map(phone => fetchData('https://api.blacklistalliance.net/lookup', apiKey, phone)));
        results.push(...batchResults);
    }

    return results;
}

export async function POST(req: Request) {
    try {
        const { numbers }: { numbers?: string[] } = await req.json();

        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return NextResponse.json({ error: 'Invalid input: No phone numbers provided' }, { status: 400 });
        }

        const apiKey = process.env.BLACKLIST_API_KEY as string;
        const results = await fetchInBatches(numbers, apiKey);

        console.log(results);
        return NextResponse.json(results);

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
    }
}
