export default function ChapterList({ chapters = [] }) {
  return (
    <div className="space-y-3">
      {chapters.length === 0 && (
        <p className="text-gray-500 text-sm">No chapters yet</p>
      )}

      {chapters.map((chapter) => (
        <div key={chapter.id} className="border rounded-lg p-3 bg-white">
          <h4 className="font-medium">{chapter.title}</h4>

          {chapter.description && (
            <p className="text-sm text-gray-600">
              {chapter.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
