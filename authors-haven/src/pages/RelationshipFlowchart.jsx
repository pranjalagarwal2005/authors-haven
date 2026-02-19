import { useState } from "react";
import Navbar from "../components/Navbar";

const RELATION_TYPES = [
  "Friend",
  "Enemy",
  "Sibling",
  "Brother",
  "Sister",
  "Mentor",
  "Student",
  "Love Interest",
];

export default function RelationshipFlowchart() {
  const [characters, setCharacters] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const [newName, setNewName] = useState("");

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [relation, setRelation] = useState("Friend");

  /* ---------- Character Logic ---------- */

  const addCharacter = () => {
    if (!newName.trim()) return;

    setCharacters((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newName.trim(),
        x: 100 + prev.length * 150,
        y: 120 + (prev.length % 3) * 120,
      },
    ]);

    setNewName("");
  };

  const deleteCharacter = (id) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setRelationships((prev) =>
      prev.filter((r) => r.fromId !== id && r.toId !== id)
    );
  };

  /* ---------- Relationship Logic ---------- */

  const addRelationship = () => {
    if (!fromId || !toId || fromId === toId) return;

    setRelationships((prev) => [
      ...prev,
      {
        id: Date.now(),
        fromId: Number(fromId),
        toId: Number(toId),
        relation,
      },
    ]);

    setFromId("");
    setToId("");
    setRelation("Friend");
  };

  const updateRelationship = (id, newType) => {
    setRelationships((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, relation: newType } : r
      )
    );
  };

  const deleteRelationship = (id) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id));
  };

  /* ---------- Helpers ---------- */

  const getChar = (id) =>
    characters.find((c) => c.id === id);

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="px-10 py-10">
        <h1 className="text-4xl font-serif font-bold mb-2">
          Character Relationships
        </h1>
        <p className="text-gray-600 mb-8">
          Create characters and define how they are related
        </p>

        {/* ADD CHARACTER */}
        <section className="bg-white border rounded-xl p-6 mb-8 max-w-xl">
          <h3 className="font-semibold mb-4">Add Character</h3>
          <input
            className="border rounded-lg px-4 py-2 mr-3"
            placeholder="Character name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={addCharacter}
            className="bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>
        </section>

        {/* DEFINE RELATIONSHIP */}
        <section className="bg-white border rounded-xl p-6 mb-8 max-w-3xl">
          <h3 className="font-semibold mb-4">
            Define Relationship
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <select
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">From</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {RELATION_TYPES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">To</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={addRelationship}
            className="mt-4 bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Add Relationship
          </button>
        </section>

        {/* VISUAL BOARD */}
        <section className="bg-[#faf9f6] border rounded-2xl shadow-sm p-6">
          <div
            className="relative h-[450px]"
            style={{
              backgroundImage:
                "radial-gradient(#e5e5e5 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* SVG RELATION LINES */}
            <svg className="absolute inset-0 w-full h-full">
              {relationships.map((r) => {
                const from = getChar(r.fromId);
                const to = getChar(r.toId);
                if (!from || !to) return null;

                return (
                  <g key={r.id}>
                    <line
                      x1={from.x + 50}
                      y1={from.y + 20}
                      x2={to.x + 50}
                      y2={to.y + 20}
                      stroke="#4f46e5"
                      strokeWidth="2"
                    />
                    <text
                      x={(from.x + to.x) / 2 + 50}
                      y={(from.y + to.y) / 2}
                      fontSize="12"
                      fill="#4f46e5"
                    >
                      {r.relation}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* CHARACTER NODES */}
            {characters.map((c) => (
              <div
                key={c.id}
                className="absolute bg-white border rounded-xl px-4 py-2 shadow-sm"
                style={{ left: c.x, top: c.y }}
              >
                <p className="font-medium">{c.name}</p>
                <button
                  onClick={() => deleteCharacter(c.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RELATIONSHIP LIST */}
        {relationships.length > 0 && (
          <section className="mt-8 bg-white border rounded-xl p-6">
            <h3 className="font-semibold mb-4">
              Relationships
            </h3>

            {relationships.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 mb-3"
              >
                <span>
                  {getChar(r.fromId)?.name} →{" "}
                  {getChar(r.toId)?.name}
                </span>

                <select
                  value={r.relation}
                  onChange={(e) =>
                    updateRelationship(r.id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  {RELATION_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                <button
                  onClick={() => deleteRelationship(r.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
