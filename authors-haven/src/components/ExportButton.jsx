import { useState, useRef, useEffect } from "react";

/**
 * ExportButton — reusable export dropdown for JSON and PDF export.
 * Props:
 *   data       — array of objects to export
 *   filename   — base filename (without extension)
 *   label      — display label for the exported document (e.g. "Characters")
 *   renderPDF  — optional function(data) => HTML string for custom PDF layout
 */
export default function ExportButton({ data = [], filename = "export", label = "Data", renderPDF }) {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const ref = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── JSON Export ──────────────────────────────────────────────
    const exportJSON = () => {
        if (!data.length) return showToast("Nothing to export yet.", "error");
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
        showToast(`Exported ${data.length} ${label.toLowerCase()} as JSON ✓`);
    };

    // ── PDF Export (print-to-PDF via hidden iframe) ───────────────
    const exportPDF = () => {
        if (!data.length) return showToast("Nothing to export yet.", "error");

        const defaultRender = (items) => `
      <style>
        body { font-family: Georgia, serif; padding: 40px; color: #1a1a2e; }
        h1 { font-size: 28px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 24px; }
        .item { margin-bottom: 28px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid; }
        .item-title { font-size: 20px; font-weight: bold; margin-bottom: 6px; color: #1e1b4b; }
        .item-badge { display: inline-block; background: #ede9fe; color: #4f46e5; font-size: 12px; padding: 2px 8px; border-radius: 999px; margin-bottom: 10px; font-family: sans-serif; }
        .item-field { margin-bottom: 6px; font-size: 14px; }
        .item-field strong { color: #374151; }
        .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; font-family: sans-serif; text-align: center; }
      </style>
      <h1>Authors Haven — ${label}</h1>
      ${items.map((item) => `
        <div class="item">
          <div class="item-title">${item.title || item.name || "Untitled"}</div>
          ${item.role ? `<span class="item-badge">${item.role}</span>` : ""}
          ${Object.entries(item)
                .filter(([k]) => !["_id", "__v", "id", "userId", "name", "title", "role"].includes(k))
                .map(([k, v]) => v ? `<div class="item-field"><strong>${k.charAt(0).toUpperCase() + k.slice(1)}:</strong> ${v}</div>` : "")
                .join("")}
        </div>
      `).join("")}
      <div class="footer">Exported from Authors Haven · ${new Date().toLocaleDateString()}</div>
    `;

        const html = renderPDF ? renderPDF(data) : defaultRender(data);
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.top = "-9999px";
        document.body.appendChild(iframe);
        iframe.contentDocument.write(`<!DOCTYPE html><html><head><title>${label}</title></head><body>${html}</body></html>`);
        iframe.contentDocument.close();
        iframe.contentWindow.focus();
        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 300);

        setOpen(false);
        showToast(`PDF print dialog opened for ${label} ✓`);
    };

    return (
        <div className="relative" ref={ref}>
            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "24px",
                        right: "24px",
                        zIndex: 9999,
                        background: toast.type === "error" ? "#fee2e2" : "#d1fae5",
                        color: toast.type === "error" ? "#991b1b" : "#065f46",
                        border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#6ee7b7"}`,
                        padding: "12px 20px",
                        borderRadius: "10px",
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        animation: "fadeIn 0.2s ease",
                    }}
                >
                    {toast.msg}
                </div>
            )}

            {/* Trigger button */}
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#374151",
                    transition: "all 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
                <span>⬇️</span> Export
                <span style={{ fontSize: "10px", marginLeft: "2px", opacity: 0.6 }}>▼</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        right: 0,
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        minWidth: "180px",
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                >
                    <button
                        onClick={exportJSON}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "12px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "#374151",
                            textAlign: "left",
                            transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                        <span style={{ fontSize: "18px" }}>📄</span>
                        <div>
                            <div style={{ fontWeight: 600 }}>Export as JSON</div>
                            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Raw data file</div>
                        </div>
                    </button>

                    <div style={{ height: "1px", background: "#f3f4f6" }} />

                    <button
                        onClick={exportPDF}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            width: "100%",
                            padding: "12px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "#374151",
                            textAlign: "left",
                            transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                        <span style={{ fontSize: "18px" }}>🖨️</span>
                        <div>
                            <div style={{ fontWeight: 600 }}>Export as PDF</div>
                            <div style={{ fontSize: "12px", color: "#9ca3af" }}>Print-ready document</div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
