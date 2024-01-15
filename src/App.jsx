import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './Router.jsx';

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Router />
            </QueryClientProvider>
        </>
    );
}

export default App;
