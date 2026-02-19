import { useState } from "react";

export default function CreateChapter({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (typeof onCreate === "function") {
      onCreate({
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
      });
    }

    setTitle("");
    setDescription("");
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 mb-6">
      <h3 className="font-serif font-semibold mb-3">New Chapter</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Chapter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Short description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-2 rounded"
        >
          Create Chapter
        </button>
      </form>
    </div>
  );
}
