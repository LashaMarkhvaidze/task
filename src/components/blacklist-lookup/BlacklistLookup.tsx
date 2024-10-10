'use client';

import React from "react";
import useBlacklistLookup from "./BlacklistLookup.hooks";

const BlacklistLookup = () => {
    const {
        results,
        loading,
        timeTaken,
        generatedNumbers,
        handleGenerateNumbers,
        handleCheckBlacklist,
    } = useBlacklistLookup();

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Blacklist Check</h1>

            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={handleGenerateNumbers}
                    disabled={loading}
                    className={`px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Generate Random Numbers
                </button>

                <button
                    onClick={handleCheckBlacklist}
                    disabled={loading || generatedNumbers.length === 0}
                    className={`px-6 py-3 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200
                ${loading || generatedNumbers.length === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? 'Checking...' : 'Check Blacklist'}
                </button>
            </div>

            {timeTaken !== null && (
                <p className="mt-4 text-center text-lg text-gray-700">
                    Time taken: <strong>{timeTaken.toFixed(2)} ms</strong>
                </p>
            )}

            {generatedNumbers.length > 0 && (
                <table className="min-w-full mt-8 border border-gray-300 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-gray-600">Phone Number</th>
                            <th className="px-6 py-3 border-b text-left text-gray-600">Valid</th>
                            <th className="px-6 py-3 border-b text-left text-gray-600">Suppressed</th>
                            <th className="px-6 py-3 border-b text-left text-gray-600">Wireless</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generatedNumbers.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-200 transition-colors duration-200">
                                <td className="px-6 py-4 border-b">{result}</td>
                                <td className="px-6 py-4 border-b">
                                    <span className={`font-semibold ${results && results.phones.includes(result) ? 'text-green-500' : 'text-gray-500'}`}>
                                        {results ? results.phones.includes(result) ? '✅' : '❌' : ''}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <span className={`font-semibold ${results && results.supression.includes(result) ? 'text-red-500' : 'text-gray-500'}`}>
                                        {results ? results.supression.includes(result) ? '✅' : '❌' : ''}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-b">
                                    <span className={`font-semibold ${results && results.wireless.includes(result) ? 'text-red-500' : 'text-gray-500'}`}>
                                        {results ? results.wireless.includes(result) ? '✅' : '❌' : ''}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    );
};


export { BlacklistLookup };
