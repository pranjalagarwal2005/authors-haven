import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";

const RELATION_TYPES = ["Friend", "Enemy", "Sibling", "Brother", "Sister", "Mentor", "Student", "Love Interest"];

export default function RelationshipFlowchart() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [relation, setRelation] = useState("Friend");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!projectId && !loading) {
      navigate("/dashboard");
    }
  }, [projectId, loading, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && projectId) {
        fetchData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const fetchData = async (uid) => {
    try {
      const [charRes, relRes] = await Promise.all([
        axios.get(`/api/characters?projectId=${projectId}`, { headers: { Authorization: `Bearer ${uid}` } }),
        axios.get(`/api/relationships/project/${projectId}`, { headers: { Authorization: `Bearer ${uid}` } })
      ]);
      setCharacters(charRes.data);
      setRelationships(relRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCharacter = async () => {
    if (!newName.trim() || !user) return;
    try {
      const res = await axios.post("/api/characters", {
        name: newName.trim(),
        projectId
      }, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });
      setCharacters([...characters, res.data]);
      setNewName("");
    } catch (err) {
      console.error("Error adding character:", err);
    }
  };

  const addRelationship = async () => {
    if (!fromId || !toId || fromId === toId || !user) return;

    try {
      const fromChar = characters.find(c => c._id === fromId);
      const toChar = characters.find(c => c._id === toId);

      const res = await axios.post("/api/relationships", {
        projectId,
        from: fromChar.name,
        to: toChar.name,
        fromId,
        toId,
        relation
      }, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });

      setRelationships([...relationships, res.data]);
      setFromId("");
      setToId("");
    } catch (err) {
      console.error("Error adding relationship:", err);
    }
  };

  const deleteRelationship = async (id) => {
    if (!user) return;
    try {
      await axios.delete(`/api/relationships/${id}`, {
        headers: { Authorization: `Bearer ${user.uid}` }
      });
      setRelationships(relationships.filter(r => r._id !== id));
    } catch (err) {
      console.error("Error deleting relationship:", err);
    }
  };

  const getCharById = (id) => characters.find((c) => c._id === id);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Relationships...</div>;

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="px-10 py-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-2 text-gray-900">Character Relationships</h1>
        <p className="text-gray-600 mb-8">Define how your characters are connected in this project.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* QUICK ADD CHARACTER */}
          <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm h-fit">
            <h3 className="text-xl font-bold mb-6 text-gray-800">1. Quick Add Character</h3>
            <div className="flex gap-4">
              <input
                className="flex-grow border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Character name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button
                onClick={addCharacter}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">Add characters here or in the Character Manager.</p>
          </section>

          {/* DEFINE RELATIONSHIP */}
          <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800">2. Define Relationship</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Character 1</label>
                <select
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select</option>
                  {characters.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Is a...</label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {RELATION_TYPES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Of Character 2</label>
                <select
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select</option>
                  {characters.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={addRelationship}
              className="mt-8 w-full bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
            >
              Add Relationship
            </button>
          </section>
        </div>

        {/* VISUAL BOARD / LIST */}
        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Connection Map</h3>

          {relationships.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
              No relationships defined yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relationships.map((r) => (
                <div key={r._id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition">
                  <div>
                    <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">{r.relation}</div>
                    <div className="text-lg font-bold text-gray-800">
                      {r.from} <span className="text-gray-400 font-normal mx-1">→</span> {r.to}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRelationship(r._id)}
                    className="text-red-400 hover:text-red-600 p-2 transform scale-0 group-hover:scale-100 transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

