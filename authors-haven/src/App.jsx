import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import BookManagement from "./pages/BookManagement";
import AIResearch from "./pages/AIResearch";
import CharacterManager from "./pages/CharacterManager";
import RelationshipFlowchart from "./pages/RelationshipFlowchart";
import WritingWorkspace from "./pages/WritingWorkspace"
import WorldBuilding from "./pages/WorldBuilding";
import Profile from "./pages/Profile";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<BookManagement />} />
        <Route path="/research" element={<AIResearch />} />
        <Route path="/characters" element={<CharacterManager />} />
        <Route path="/relationship" element={<RelationshipFlowchart />} />
        <Route path="/writing" element={<WritingWorkspace />} />
        <Route path="/world" element={<WorldBuilding />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
