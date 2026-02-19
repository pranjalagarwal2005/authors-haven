import { useState } from "react";
import Navbar from "../components/Navbar";
import ExportButton from "../components/ExportButton";

export default function AIResearch() {
  const [prompt, setPrompt] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // saved Q&A pairs

  const formatAIText = (text) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, (_, p1) => p1.toUpperCase()) // Convert **bold** to CAPS
      .replace(/^#{1,6}\s*(.*)$/gm, (_, p1) => p1.toUpperCase()) // Convert # Headers to CAPS
      .replace(/\*/g, ""); // Remove any remaining asterisks
  };

  const askAI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setSolution("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: prompt }),
      });

      const data = await res.json();
      const formattedAnswer = formatAIText(data.answer);
      setSolution(formattedAnswer);

      // Auto-save to history
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          prompt: prompt.trim(),
          answer: formattedAnswer,
          timestamp: new Date().toLocaleString(),
        },
      ]);
    } catch {
      setSolution("❌ Failed to get response from AI.");
    } finally {
      setLoading(false);
    }
  };

  // Custom PDF layout for AI responses
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
        <div class="answer">${item.answer}</div>
        <div class="meta">${item.timestamp}</div>
      </div>
    `).join("")}
    <div class="footer">Exported from Authors Haven · ${new Date().toLocaleDateString()}</div>
  `;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <div style={{ padding: "40px", maxWidth: "800px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "6px" }}>
              AI Search Assistant
            </h1>
            <p style={{ color: "#555" }}>
              Enter a prompt and get a clear solution or explanation.
            </p>
          </div>
          <ExportButton
            data={history}
            filename="ai-search"
            label="AI Search"
            renderPDF={renderAIPDF}
          />
        </div>

        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) askAI(); }}
          placeholder="Ask anything… (coding, medical, legal, history, etc.) — Ctrl+Enter to submit"
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#a5b4fc" : "#4f46e5",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          {loading ? "Thinking…" : "Get Solution"}
        </button>

        {solution && (
          <div
            style={{
              marginTop: "20px",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#1e1b4b" }}>Solution</h3>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: 1.7 }}>{solution}</pre>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "12px", color: "#374151" }}>
              Session History ({history.length} queries)
            </h3>
            {[...history].reverse().slice(1).map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "14px 18px",
                  marginBottom: "10px",
                  opacity: 0.75,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#4f46e5", marginBottom: "6px" }}>
                  Q: {item.prompt}
                </div>
                <pre style={{ whiteSpace: "pre-wrap", fontSize: "13px", color: "#6b7280", maxHeight: "80px", overflow: "hidden" }}>
                  {item.answer}
                </pre>
                <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>{item.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
