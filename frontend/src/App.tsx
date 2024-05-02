import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { Home } from './_root/pages';
import RootLayout from "./_root/pages/RootLayout";
import './globals.css';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
