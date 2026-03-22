import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import ChapterList from "../components/ChapterList";
import ExportButton from "../components/ExportButton";

export default function WritingWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const saveTimeout = useRef(null);

  useEffect(() => {
    if (!projectId && !loading) {
      navigate("/dashboard");
    }
  }, [projectId, loading, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && projectId) {
        fetchChapters(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const fetchChapters = async (uid) => {
    try {
      const res = await axios.get(`/api/chapters/project/${projectId}`, {
        headers: { Authorization: `Bearer ${uid}` }
      });
      setChapters(res.data);
      if (res.data.length > 0) {
        setSelectedChapterId(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectedChapter = chapters.find((c) => c._id === selectedChapterId);

  const addChapter = async () => {
    if (!user || !projectId) return;
    try {
      const newChapter = {
        projectId,
        title: `Chapter ${chapters.length + 1}`,
        content: "",
        description: ""
      };
      const res = await axios.post("/api/chapters", newChapter, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });
      setChapters((prev) => [...prev, res.data]);
      setSelectedChapterId(res.data._id);
    } catch (err) {
      console.error("Error creating chapter:", err);
    }
  };

  const handleUpdate = (id, field, value) => {
    setChapters((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c))
    );

    // Auto-save logic
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaving(true);
    saveTimeout.current = setTimeout(() => {
      saveChapter(id, { [field]: value });
    }, 1000);
  };

  const saveChapter = async (id, data) => {
    if (!user) return;
    try {
      await axios.put(`/api/chapters/${id}`, data, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });
      setSaving(false);
    } catch (err) {
      console.error("Error saving chapter:", err);
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="px-10 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold">Writing Workspace</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500">Focus on your story, chapter by chapter.</p>
              {saving && <span className="text-xs text-indigo-500 animate-pulse">Saving...</span>}
            </div>
          </div>

          <div className="flex gap-3">
            <ExportButton data={chapters} filename="manuscript" label="Manuscript" />
            <button
              onClick={addChapter}
              className="bg-indigo-700 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 transition shadow-sm font-medium"
            >
              + New Chapter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-6 border border-gray-100">
            <h2 className="text-lg font-serif font-semibold mb-4 flex justify-between items-center">
              Chapters
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{chapters.length}</span>
            </h2>
            <ChapterList
              chapters={chapters}
              onSelect={setSelectedChapterId}
              selectedId={selectedChapterId}
            />
          </aside>

          <section className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[70vh]">
            {selectedChapter ? (
              <div className="flex flex-col h-full">
                <div className="px-10 py-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                  <input
                    type="text"
                    value={selectedChapter.title}
                    onChange={(e) => handleUpdate(selectedChapter._id, "title", e.target.value)}
                    className="text-3xl font-serif font-bold bg-transparent border-none outline-none w-full text-indigo-900 focus:ring-0"
                    placeholder="Chapter Title..."
                  />
                  <input
                    type="text"
                    value={selectedChapter.description || ""}
                    onChange={(e) => handleUpdate(selectedChapter._id, "description", e.target.value)}
                    className="text-gray-500 bg-transparent border-none outline-none w-full mt-2 text-sm focus:ring-0"
                    placeholder="Brief description or plot point..."
                  />
                </div>

                <div className="flex-grow p-10 pt-6">
                  <textarea
                    value={selectedChapter.content || ""}
                    onChange={(e) => handleUpdate(selectedChapter._id, "content", e.target.value)}
                    className="w-full h-full min-h-[500px] text-lg leading-relaxed font-serif bg-transparent border-none outline-none resize-none placeholder-gray-300"
                    placeholder="Once upon a time..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-20">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-3xl flex items-center justify-center text-4xl mb-6">
                  🖋️
                </div>
                <h2 className="text-2xl font-serif font-semibold mb-2 text-gray-800">Your Story Awaits</h2>
                <p className="text-gray-500 max-w-sm mb-8">
                  Create a chapter to start your manuscript or select one from the sidebar.
                </p>
                <button
                  onClick={addChapter}
                  className="bg-indigo-700 text-white px-8 py-3 rounded-xl hover:bg-indigo-800 transition shadow-lg font-medium"
                >
                  Create Your First Chapter
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}


