import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import HomePage from "./pages/HomePage";
import { SocketProvider } from "./context/SocketContext";
import { UserProvider } from "./context/UserContext";

function App() {
    return (
        <UserProvider>
            <SocketProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/student" element={<StudentPage />} />
                        <Route path="/teacher" element={<TeacherPage />} />
                    </Routes>
                </Router>
            </SocketProvider>
        </UserProvider>
    );
}

export default App;