export default function CharacterList({ characters, onEdit, onDelete }) {
  if (!characters || characters.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
        <p className="text-gray-500 mb-4 text-lg">No characters created yet.</p>
        <p className="text-indigo-500 font-medium">Use the form above to add your first character!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {characters.map((c) => (
        <div
          key={c._id || c.id}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800 truncate" title={c.name}>{c.name}</h3>
              {c.role && (
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium border border-indigo-100 shrink-0 ml-2">
                  {c.role}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6 text-sm line-clamp-3">
              {c.description || c.backstory || c.personality || "No description provided yet."}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              onClick={() => onEdit && onEdit(c)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this character?")) {
                  onDelete && onDelete(c._id || c.id);
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline px-2 py-1 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

