const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */
mongoose
   .connect(process.env.MONGO_URI)
   .then(() => console.log("✅ MongoDB connected"))
   .catch((err) => {
      console.error("❌ MongoDB error:", err.message);
      process.exit(1);
   });

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/chapters", require("./routes/chapterRoutes"));
app.use("/api/characters", require("./routes/characterRoutes"));
app.use("/api/relationships", require("./routes/relationshipRoutes"));

/* =========================
   ROOT TEST
========================= */
app.get("/", (req, res) => {
   res.send("✅ Authors Haven backend running");
});

/* =========================
   SERVER START
========================= */
const PORT = 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server running at http://localhost:${PORT}`);
});

