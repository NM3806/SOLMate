"use client";

import { useEffect, useState } from "react";

interface TransactionStatusProps {
    status: 'idle' | 'loading' | 'success' | 'error'; 
    message?: string 
}

export function TransactionStatus(
    { status, message}: TransactionStatusProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (status !== 'idle') {
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    if (!isVisible || status === 'idle') {
        return null;
    }

    const statusColors = {
        loading: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800',
    }

    return (
        <div className={`p-3 rounded-lg ${statusColors[status]} mb-4`}>
            <p className="text-sm font-medium">{message}</p>
        </div>
    )
}