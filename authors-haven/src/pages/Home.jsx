import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { title: "AI Search Assistant", icon: "💡" },
    { title: "Character Manager", icon: "👥" },
    { title: "Relationship Flowchart", icon: "🧩" },
    { title: "World Building", icon: "🗺️" },
    { title: "Writing Workspace", icon: "✍️" },
    { title: "Book Management", icon: "📘" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f3]">

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold text-indigo-800">
          📖 Author&apos;s Haven
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/auth")}
            className="text-gray-700 font-medium hover:text-indigo-600"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-10 py-16">
        <h2 className="text-4xl font-bold mb-4">
          Everything an Author Needs — In One Place
        </h2>

        <p className="text-gray-600 max-w-2xl mb-12">
          Plan, write, research, and organize your stories with Author&apos;s Haven.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-xl text-xl mb-4">
                {f.icon}
              </div>

              <h3 className="text-xl font-semibold">
                {f.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
