"use client";

import { FC } from "react";

interface Props {
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string
}

const statusStyles = {
    idle: 'text-gray-500',
    loading: 'text-yellow-600',
    success: 'text-green-600',
    error: 'text-red-500',
};

const statusLabels = {
    idle: '',
    loading: 'Processing transaction...',
    success: 'Transaction successful!',
    error: 'Transaction failed.',
};

const TransactionStatus: FC<Props> = ({ status, message }) => {
    if (status === 'idle') return null;

    return (
        <p className={`text-sm mt-2 ${statusStyles[status]}`}>
            {message || statusLabels[status]}
        </p>
    )
};

export default TransactionStatus;