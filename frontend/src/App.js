import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./utils/PublicRoutes";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";

import { ChakraProvider } from '@chakra-ui/react'
import theme from './libs/theme'

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import SchedulePage from "./pages/SchedulePage";
import LogWorkoutPage from "./pages/LogWorkoutPage";
import HistoryPage from "./pages/HistoryPage";
import NotFoundPage from "./pages/NotFoundPage";

import './App.css' // styling in app.css is mainly for my calendar component

function App() {
  return (
    <ChakraProvider theme={theme}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<PublicRoutes />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/logworkout" element={<LogWorkoutPage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </Router>
    </ChakraProvider>
  );
}

export default App;
