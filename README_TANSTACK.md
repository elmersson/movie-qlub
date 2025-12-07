# TanStack Query Integration

This project has been set up with TanStack Query for efficient data fetching, caching, and state management.

## What's been set up

1. **Installation**: Added `@tanstack/react-query` and `@tanstack/react-query-devtools`
2. **QueryProvider**: Created a provider component in `components/query-provider.tsx`
3. **Root Layout Integration**: Integrated QueryProvider in `app/layout.tsx`
4. **Custom Hooks**: Created reusable query hooks in `lib/queries.ts`
5. **Example Page**: Created an example page demonstrating usage at `/protected/movies/query-example`

## How to use TanStack Query in this project

### 1. Using the provided hooks

Import and use the custom hooks from `@/lib/queries`:

```tsx
'use client'

import { usePopularMovies } from '@/lib/queries'

export default function MyComponent() {
  const { data, error, isLoading } = usePopularMovies()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.results.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  )
}
```

### 2. Creating new query hooks

Add new query functions to `lib/queries.ts` following the existing patterns:

```ts
export function useSearchMovies(query: string) {
  return useQuery({
    queryKey: ['searchMovies', query],
    queryFn: () => fetchTMDB(`/search/movie?query=${query}`),
    enabled: !!query,
  })
}
```

### 3. Query Devtools

The React Query Devtools are included in development mode. To use them:

1. Run the app in development mode: `bun run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click the React Query Devtools icon in the bottom left corner

## Key Benefits

- **Caching**: Automatic caching and refetching of data
- **Background Updates**: Data is automatically refreshed in the background
- **Deduping**: Identical requests are deduplicated
- **Error Handling**: Built-in error handling and retry logic
- **Pagination**: Easy pagination support
- **Devtools**: Visual debugging tools in development

## Configuration

The default configuration in `query-provider.tsx` includes:

- 1 minute stale time to avoid refetching immediately on the client
- Devtools hidden by default (toggle with the floating button)

## Learn More

To learn more about TanStack Query, check out the [official documentation](https://tanstack.com/query/latest/docs/framework/react/overview).