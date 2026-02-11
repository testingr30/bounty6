import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="chat/:agentId" element={<ChatPage />} />
                    <Route path="history" element={<HistoryPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
