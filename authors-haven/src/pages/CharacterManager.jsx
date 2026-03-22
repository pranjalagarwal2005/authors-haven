import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import CreateCharacter from "../components/CreateCharacter";
import CharacterList from "../components/CharacterList";
import ExportButton from "../components/ExportButton";

export default function CharacterManager() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [editingCharacter, setEditingCharacter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!projectId && !loading) {
      navigate("/dashboard");
    }
  }, [projectId, loading, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCharacters(currentUser);
      } else {
        setCharacters([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const fetchCharacters = async (currentUser) => {
    try {
      const url = projectId ? `/api/characters?projectId=${projectId}` : "/api/characters";
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${currentUser.uid}`
        }
      });
      setCharacters(response.data);
    } catch (error) {
      console.error("Error fetching characters:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCharacter = async (characterData) => {
    if (!user) return;
    try {
      const data = projectId ? { ...characterData, projectId } : characterData;
      const response = await axios.post("/api/characters", data, {
        headers: {
          Authorization: `Bearer ${user.uid}`
        }
      });
      setCharacters((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding character:", error);
    }
  };

  const updateCharacter = async (updatedData) => {
    if (!user) return;
    try {
      const response = await axios.put(`/api/characters/${updatedData._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${user.uid}`
        }
      });
      setCharacters((prev) =>
        prev.map((c) => (c._id === response.data._id ? response.data : c))
      );
      setEditingCharacter(null);
    } catch (error) {
      console.error("Error updating character:", error);
    }
  };

  const deleteCharacter = async (id) => {
    if (!user) return;
    try {
      await axios.delete(`/api/characters/${id}`, {
        headers: {
          Authorization: `Bearer ${user.uid}`
        }
      });
      setCharacters((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold">
            Character Manager
          </h1>
          <ExportButton
            data={characters}
            filename="characters"
            label="Characters"
          />
        </div>

        <CreateCharacter
          onCreate={addCharacter}
          onUpdate={updateCharacter}
          editingCharacter={editingCharacter}
          onCancel={() => setEditingCharacter(null)}
        />

        {loading ? (
          <div className="text-center py-10">Loading characters...</div>
        ) : (
          <CharacterList
            characters={characters}
            onEdit={setEditingCharacter}
            onDelete={deleteCharacter}
          />
        )}
      </main>
    </div>
  );
}

