import { useState } from 'react';
import { generateRandomPhoneNumbers } from "@/utils/generateRandomPhoneNumbers";
import { BlacklistLookupResultProps } from './BlacklistLookup.types';

const useBlacklistLookup = () => {
    const [results, setResults] = useState<{
        [phone: string]: BlacklistLookupResultProps;
    }>({});
    const [loading, setLoading] = useState(false);
    const [timeTaken, setTimeTaken] = useState<number | null>(null);
    const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);

    const handleGenerateNumbers = () => {
        const numbers = generateRandomPhoneNumbers(900, 1200);
        setGeneratedNumbers(numbers);
        setResults({});
        setTimeTaken(null);
    };

    const handleCheckBlacklist = async () => {
        setLoading(true);
        setResults({});
        setTimeTaken(null);

        const startTime = performance.now();

        try {
            const response = await fetch('/api/check-blacklist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numbers: generatedNumbers }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error fetching data from API:', errorResponse);
                setResults({}); 
            } else {
                const data = await response.json();
                const formattedObject = data.reduce((acc: { [phone: string]: BlacklistLookupResultProps }, { phone, data }: { phone: string, data: BlacklistLookupResultProps }) => {
                    acc[phone] = data;
                    return acc;
                  }, {});
                setResults(formattedObject); 
            }

            const endTime = performance.now();
            setTimeTaken(endTime - startTime);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        results,
        loading,
        timeTaken,
        generatedNumbers,
        handleGenerateNumbers,
        handleCheckBlacklist,
    };
};

export default useBlacklistLookup;
