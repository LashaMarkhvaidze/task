import { useState } from 'react';
import { generateRandomPhoneNumbers } from "@/utils/generateRandomPhoneNumbers";
import { BlacklistLookupResultProps } from './BlacklistLookup.types';

const useBlacklistLookup = () => {
    const [results, setResults] = useState<BlacklistLookupResultProps | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeTaken, setTimeTaken] = useState<number | null>(null);
    const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);

    const handleGenerateNumbers = () => {
        const numbers = generateRandomPhoneNumbers(900, 1200);
        setGeneratedNumbers(numbers);
        setResults(null);
        setTimeTaken(null);
    };

    const handleCheckBlacklist = async () => {
        setLoading(true);
        setResults(null);
        setTimeTaken(null);

        // Measure time
        const startTime = performance.now();

        try {
            const response = await fetch('/api/check-blacklist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numbers: generatedNumbers }), // Use generated numbers
            });

            const data: BlacklistLookupResultProps = await response.json();
            const endTime = performance.now();
            setTimeTaken(endTime - startTime);
            setResults(data);
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
