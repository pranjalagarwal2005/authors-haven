import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BookManagement from "./pages/BookManagement";
import AISearch from "./pages/AISearch";
import CharacterManager from "./pages/CharacterManager";
import RelationshipFlowchart from "./pages/RelationshipFlowchart";
import WritingWorkspace from "./pages/WritingWorkspace"

import Profile from "./pages/Profile";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<BookManagement />} />
        <Route path="/research/:projectId?" element={<AISearch />} />
        <Route path="/characters/:projectId?" element={<CharacterManager />} />
        <Route path="/relationship/:projectId?" element={<RelationshipFlowchart />} />
        <Route path="/writing/:projectId?" element={<WritingWorkspace />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
