import { QueryClient } from '@tanstack/react-query';

// 创建一个全局唯一的 QueryClient 实例
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
