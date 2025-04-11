
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ToastProvider } from './contexts/AppContext.tsx'
import { SearchProvider } from './contexts/SearchContext.tsx'


// Suppress Stripe analytics error in dev only
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const [resource] = args;
    if (typeof resource === "string" && resource.includes("r.stripe.com")) {
      // Return a fake response to avoid console error
      return new Response(null, { status: 204 });
    }
    return originalFetch(...args);
  };
}

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)