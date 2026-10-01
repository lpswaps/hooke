import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppProviders from "./providers/AppProviders"
import PageShell from './layout/PageShell';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import CreateTokenPage from './pages/CreateTokenPage';
import TradePage from './pages/TradePage';
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // SemiBold
import '@fontsource/inter/700.css'; // Bold

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <PageShell header={<Header />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateTokenPage />} />
            <Route path="/trade/:address" element={<TradePage />} />
          </Routes>
        </PageShell>
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
