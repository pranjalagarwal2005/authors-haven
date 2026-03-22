import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";

export default function BookManagement() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProjects(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjects = async (uid) => {
    try {
      const res = await axios.get("/api/projects", {
        headers: { Authorization: `Bearer ${uid}` }
      });
      setProjects(res.data);
      if (res.data.length > 0) {
        setSelectedProjectId(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !user) return;

    try {
      const res = await axios.post("/api/projects", newProject, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });
      setProjects([...projects, res.data]);
      setSelectedProjectId(res.data._id);
      setShowCreate(false);
      setNewProject({ title: "", description: "" });
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  const handleNavigate = (path) => {
    if (!selectedProjectId) {
      alert("Please select or create a project first.");
      return;
    }
    navigate(`${path}/${selectedProjectId}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="px-12 py-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-lg text-gray-600">Choose a project and tool to get started.</p>
          </div>

          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            {showCreate ? "Cancel" : "+ New Project"}
          </button>
        </div>

        {/* Project Selection / Creation */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
          {showCreate ? (
            <form onSubmit={createProject} className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Create New Project</h3>
              <input
                type="text"
                placeholder="Project Title (e.g., My Awesome Novel)"
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Brief description..."
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
              <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium">
                Create Project
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-500 mb-2">Active Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full border rounded-xl px-6 py-4 text-xl font-medium bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                >
                  {projects.length === 0 ? (
                    <option value="">No projects found. Create one to begin!</option>
                  ) : (
                    projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}
        </section>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Writing Workspace", icon: "✍️", path: "/writing", color: "bg-indigo-600" },
            { label: "Characters", icon: "👥", path: "/characters", color: "bg-orange-400" },
            { label: "Relationships", icon: "🔗", path: "/relationship", color: "bg-pink-500" },
            { label: "AI Search", icon: "💡", path: "/research", color: "bg-teal-500" },
          ].map((tool) => (
            <div
              key={tool.label}
              onClick={() => handleNavigate(tool.path)}
              className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition cursor-pointer group"
            >
              <div className={`w-14 h-14 ${tool.color} text-white flex items-center justify-center rounded-2xl text-2xl mb-6 shadow-lg group-hover:scale-110 transition`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{tool.label}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Open the {tool.label.toLowerCase()} for your active project.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

