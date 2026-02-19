import { useState, useEffect } from "react";

export default function CreateCharacter({
  onCreate,
  onUpdate,
  editingCharacter,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (editingCharacter) {
      setName(editingCharacter.name);
      setRole(editingCharacter.role || "");
    } else {
      setName("");
      setRole("");
    }
  }, [editingCharacter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCharacter) {
      onUpdate({ ...editingCharacter, name, role });
    } else {
      onCreate({ id: Date.now(), name, role });
    }

    setName("");
    setRole("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border">
      <h3 className="text-xl font-serif font-semibold mb-4">
        {editingCharacter ? "Edit Character" : "Create Character"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Character Name
          </label>
          <input
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Eg. Arya Stark"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Role
          </label>
          <input
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Hero, Villain, Sidekick..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition"
          >
            {editingCharacter ? "Save Changes" : "Add Character"}
          </button>

          {editingCharacter && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
