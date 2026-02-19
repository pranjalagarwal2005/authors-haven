import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import CreateCharacter from "../components/CreateCharacter";
import CharacterList from "../components/CharacterList";
import ExportButton from "../components/ExportButton";

export default function CharacterManager() {
  const [characters, setCharacters] = useState([]);
  const [editingCharacter, setEditingCharacter] = useState(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
  }, []);

  const fetchCharacters = async (currentUser) => {
    try {
      const response = await axios.get("/api/characters", {
        headers: {
          Authorization: `Bearer ${currentUser.uid}` // sending UID as token for now
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
      const response = await axios.post("/api/characters", characterData, {
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
            onDelete={deleteCharacter} // Pass delete handler
          />
        )}
      </main>
    </div>
  );
}
