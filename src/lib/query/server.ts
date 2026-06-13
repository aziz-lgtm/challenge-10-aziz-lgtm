import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// One QueryClient per request (server). `cache` memoizes it for the
// duration of a single RSC render so prefetch + dehydrate share state.
const getQueryClient = cache(() => new QueryClient());

export default getQueryClient;
