import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { RootLayout } from "./components/RootLayout";
import { RouteError } from "./components/RouteError";
import { HomePage } from "./pages/HomePage";
import { KnowledgeIndexPage } from "./pages/KnowledgeIndexPage";
import { ModulePage } from "./pages/ModulePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { StationPage } from "./pages/StationPage";
import "./styles/ke.css";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/flow", element: <Navigate to="/" replace /> },
      { path: "/station/:stationId", element: <StationPage /> },
      { path: "/station/:stationId/k", element: <KnowledgeIndexPage /> },
      { path: "/station/:stationId/k/:moduleId", element: <ModulePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
