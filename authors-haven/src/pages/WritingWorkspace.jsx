import { useState } from "react";
import Navbar from "../components/Navbar";
import CreateChapter from "../components/CreateChapter";
import ChapterList from "../components/ChapterList";
import ExportButton from "../components/ExportButton";

export default function WritingWorkspace() {
  const [chapters, setChapters] = useState([]);

  const addChapter = (chapter) => {
    setChapters((prev) => [...prev, chapter]);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="px-10 py-10">

        {/* ✅ LINE 1 — EXACTLY THIS */}
        <CreateChapter onCreate={addChapter} />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold">
            Writing Workspace
          </h1>

          <div className="flex gap-3">
            <ExportButton
              data={chapters}
              filename="chapters"
              label="Chapters"
            />

            <button className="bg-indigo-700 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition">
              + New Chapter
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Chapters Sidebar */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-serif font-semibold mb-4">
              Chapters
            </h2>

            {/* ✅ LINE 2 — EXACTLY THIS */}
            <ChapterList chapters={chapters} />
          </aside>

          {/* Main Editor Area */}
          <section className="md:col-span-3 bg-white rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="text-gray-400 text-6xl mb-4">📖</div>

            <h2 className="text-2xl font-serif font-semibold mb-2">
              Start Writing
            </h2>

            <p className="text-gray-600 max-w-md mb-6">
              Create a new chapter to begin your story or select an existing one
              from the sidebar.
            </p>

            <button className="bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-800 transition">
              + Create Chapter
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
