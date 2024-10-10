'use client';

import React, { useState } from "react";
import useBlacklistLookup from "./BlacklistLookup.hooks";
import { BlacklistLookupResultProps, Carrier } from "./BlacklistLookup.types";
import { blacklist_lookup_table_keys, blacklist_lookup_table_labels } from "./BlacklistLookup.constants";

const BlacklistLookup = () => {
    const {
        results,
        loading,
        timeTaken,
        generatedNumbers,
        handleGenerateNumbers,
        handleCheckBlacklist,
    } = useBlacklistLookup();

    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);

    const handleCarrierClick = (result: string) => {
        if (results[result] && results[result].carrier) {
            setSelectedCarrier(results[result].carrier);
        }
    };

    const closeModal = () => {
        setSelectedCarrier(null);
    };

    return (
        <div className="p-4 h-screen flex flex-col bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">Blacklist Check</h1>

            <div className="flex justify-center space-x-2 mb-4">
                <button
                    onClick={handleGenerateNumbers}
                    disabled={loading}
                    className={`px-4 py-2 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Generate
                </button>

                <button
                    onClick={handleCheckBlacklist}
                    disabled={loading || generatedNumbers.length === 0}
                    className={`px-4 py-2 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200
                ${loading || generatedNumbers.length === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? 'Checking...' : 'Check'}
                </button>
            </div>

            {timeTaken !== null && (
                <p className="mt-2 text-center text-md text-gray-700">
                    Time taken: <strong>{timeTaken.toFixed(2)} ms</strong>
                </p>
            )}

            {generatedNumbers.length > 0 && (
                <div className="overflow-auto flex-grow">
                    <table className="min-w-full mt-4 border border-gray-300 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                {blacklist_lookup_table_labels.map((header) => (
                                    <th key={header} className="px-2 py-1 text-sm text-left font-semibold">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {generatedNumbers.map((result, index) => (
                                <tr key={index} className="hover:bg-gray-200 transition-colors duration-200">
                                    <td className="px-2 py-1 border-b text-sm">{result}</td>
                                    {(blacklist_lookup_table_keys as (keyof BlacklistLookupResultProps)[]).map((key) => (
                                        <td key={key} className="px-2 py-1 border-b text-sm">
                                            <span className={``}>
                                                {results[result] && String(results[result][key])}
                                            </span>
                                        </td>
                                    ))}

                                    <td className="px-2 py-1 border-b text-sm cursor-pointer hover:text-blue-600" >
                                        {results[result]?.carrier && (<button onClick={() => handleCarrierClick(result)} className="px-4 py-2 bg-blue-600 text-white rounded">View</button>)}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedCarrier && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50">
                    <div className="bg-white rounded-lg p-4 max-w-lg mx-auto">
                        <h2 className="text-lg font-bold mb-2">Carrier Details</h2>
                        <pre className="text-xs overflow-x-auto">{JSON.stringify(selectedCarrier, null, 2)}</pre>
                        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { BlacklistLookup };
