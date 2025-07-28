import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { DataProvider } from "./DataContext.jsx"
import router from './Routes.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </StrictMode>,
)
