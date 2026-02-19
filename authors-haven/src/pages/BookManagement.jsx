import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function BookManagement() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f7f3]">
      <Navbar />

      <main className="px-12 py-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Welcome Back
        </h1>

        <p className="text-lg text-gray-600 mb-12">
          Ready to bring your stories to life? Choose a tool to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div
            onClick={() => navigate("/writing")}
            className="bg-white p-8 rounded-2xl border hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-14 h-14 bg-indigo-600 text-white flex items-center justify-center rounded-xl text-2xl mb-6">
              ✍️
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Writing Workspace
            </h3>
            <p className="text-gray-600 text-sm">
              Start writing your chapters and organize your manuscripts
            </p>
          </div>

          <div
            onClick={() => navigate("/characters")}
            className="bg-white p-8 rounded-2xl border hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-14 h-14 bg-orange-400 text-white flex items-center justify-center rounded-xl text-2xl mb-6">
              👥
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Characters
            </h3>
            <p className="text-gray-600 text-sm">
              Manage your characters, their traits, and development arcs
            </p>
          </div>

          <div
            onClick={() => navigate("/research")}
            className="bg-white p-8 rounded-2xl border hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-14 h-14 bg-teal-500 text-white flex items-center justify-center rounded-xl text-2xl mb-6">
              💡
            </div>
            <h3 className="text-xl font-semibold mb-2">
              AI Research
            </h3>
            <p className="text-gray-600 text-sm">
              Get instant research assistance for your story
            </p>
          </div>

          <div
            onClick={() => navigate("/world")}
            className="bg-white p-8 rounded-2xl border hover:shadow-lg transition cursor-pointer"
          >
            <div className="w-14 h-14 bg-purple-600 text-white flex items-center justify-center rounded-xl text-2xl mb-6">
              🗺️
            </div>
            <h3 className="text-xl font-semibold mb-2">
              World Builder
            </h3>
            <p className="text-gray-600 text-sm">
              Create maps and design your fictional worlds
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
