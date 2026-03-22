export default function ChapterList({ chapters = [], onSelect, selectedId }) {
  return (
    <div className="space-y-3">
      {chapters.length === 0 && (
        <p className="text-gray-500 text-sm">No chapters yet</p>
      )}

      {chapters.map((chapter) => (
        <div
          key={chapter._id}
          onClick={() => onSelect && onSelect(chapter._id)}
          className={`border rounded-lg p-3 cursor-pointer transition ${selectedId === chapter._id
            ? "border-indigo-600 bg-indigo-50 shadow-sm"
            : "bg-white hover:border-gray-300"
            }`}
        >
          <h4 className={`font-medium ${selectedId === chapter._id ? "text-indigo-900" : "text-gray-900"}`}>
            {chapter.title}
          </h4>

          {chapter.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {chapter.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

