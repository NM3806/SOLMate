'use client';

import {toast} from 'sonner';

export const useToaster = () => {
    const toastLoading = (message: string) => toast.loading(message);
    const toastSuccess = (message: string, id?: string | number) =>
        toast.success(message, id ? {id} : undefined);
    const toastError = (message: string, id?: string | number) =>
        toast.error(message, id ? {id} : undefined);
    const toastDismiss = () => toast.dismiss();

    const toastPromise = <T>(
        promise: Promise<T>,
        messages: {loading: string; success: string; error: string}
    ) : Promise<T> => {
        return toast.promise(promise, messages).unwrap();
    }

    return {
        toastLoading,
        toastSuccess,
        toastError,
        toastDismiss,
        toastPromise,
    };
};