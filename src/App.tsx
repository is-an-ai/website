import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DocsPage from "./pages/DocsPage";
import ExamplesPage from "./pages/ExamplesPage";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
