import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import ExportButton from "../components/ExportButton";

export default function AISearch() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!projectId && !loading) {
      navigate("/dashboard");
    }
  }, [projectId, loading, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && projectId) {
        fetchHistory(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const fetchHistory = async (uid) => {
    try {
      const res = await axios.get(`/api/ai/history/${projectId}`, {
        headers: { Authorization: `Bearer ${uid}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const askAI = async () => {
    if (!prompt.trim() || !user) return;

    setLoading(true);
    setSolution("");

    try {
      const res = await axios.post("/api/ai", {
        question: prompt,
        projectId
      }, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });

      const data = res.data;
      setSolution(data.answer);

      // Refresh history from server to get accurate list
      fetchHistory(user.uid);
      setPrompt("");
    } catch (err) {
      console.error(err);
      setSolution("❌ Failed to get response from AI.");
    } finally {
      setLoading(false);
    }
  };

  const renderAIPDF = (items) => `
    <style>
      body { font-family: Georgia, serif; padding: 40px; color: #1a1a2e; }
      h1 { font-size: 26px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 24px; }
      .item { margin-bottom: 32px; page-break-inside: avoid; }
      .prompt { font-size: 15px; font-weight: bold; color: #1e1b4b; margin-bottom: 8px; }
      .prompt::before { content: "Q: "; color: #4f46e5; }
      .answer { font-size: 14px; color: #374151; white-space: pre-wrap; background: #f9fafb; padding: 14px; border-radius: 6px; border-left: 3px solid #4f46e5; }
      .meta { font-size: 11px; color: #9ca3af; margin-top: 6px; font-family: sans-serif; }
      .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; font-family: sans-serif; text-align: center; }
    </style>
    <h1>Authors Haven — AI Search Log</h1>
    ${items.map((item) => `
      <div class="item">
        <div class="prompt">${item.prompt}</div>
        <div class="answer">${item.response}</div>
        <div class="meta">${new Date(item.createdAt).toLocaleString()}</div>
      </div>
    `).join("")}
    <div class="footer">Exported from Authors Haven · ${new Date().toLocaleDateString()}</div>
  `;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>AI Search Assistant</h1>
            <p style={{ color: "#666", fontSize: "18px" }}>Get instant inspiration and research for your project.</p>
          </div>
          <ExportButton data={history} filename="ai-research" label="AI Research" renderPDF={renderAIPDF} />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10">
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) askAI(); }}
            placeholder="Ask anything about your story or world... (Ctrl+Enter to submit)"
            className="w-full border rounded-2xl px-6 py-4 text-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
          />

          <button
            onClick={askAI}
            disabled={loading}
            className={`px-8 py-3 rounded-xl text-white font-medium transition ${loading ? "bg-indigo-300 pointer-events-none" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"}`}
          >
            {loading ? "Thinking..." : "Get AI Solution"}
          </button>
        </div>

        {solution && (
          <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 mb-10">
            <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm">A</span>
              Latest Response
            </h3>
            <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-serif text-lg">{solution}</pre>
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 ml-2">Recent Research</h3>
            {history.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-90 hover:opacity-100 transition">
                <div className="font-bold text-indigo-600 mb-2">Q: {item.prompt}</div>
                <div className="text-gray-600 font-serif leading-relaxed line-clamp-3">{item.response}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

