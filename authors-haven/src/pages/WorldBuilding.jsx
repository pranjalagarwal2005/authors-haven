import Navbar from "../components/Navbar";

export default function WorldBuilding() {
  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="px-10 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            World Builder
          </h1>
          <p className="text-gray-600">
            Create and visualize your fictional worlds
          </p>
        </div>

        {/* Coming Soon Card */}
        <section className="bg-white border border-dashed rounded-2xl p-20 text-center shadow-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6l8-3 10 3v12l-10 3-8-3z" />
              <path d="M11 3v18" />
              <path d="M21 6l-10 3-8-3" />
            </svg>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-serif font-semibold mb-4">
            World Map Coming Soon
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Create and visualize your fictional worlds with our interactive
            map builder. Draw locations, mark important landmarks, and
            bring your settings to life.
          </p>
        </section>
      </main>
    </div>
  );
}

