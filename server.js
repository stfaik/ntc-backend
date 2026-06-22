const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// In-memory store for latest readings
let readings = {
  t1: { temp: null, updatedAt: null },
  t2: { temp: null, updatedAt: null }
};

// ESP32 posts data here
// POST /data
// Body: { "t1": 24.5, "t2": 31.2 }
app.post("/data", (req, res) => {
  const { t1, t2 } = req.body;
  const now = new Date().toISOString();

  if (t1 !== undefined) readings.t1 = { temp: t1, updatedAt: now };
  if (t2 !== undefined) readings.t2 = { temp: t2, updatedAt: now };

  console.log(`[${now}] T1=${t1}°C  T2=${t2}°C`);
  res.json({ ok: true });
});

// Frontend polls this
// GET /data        → both sensors
// GET /data/t1     → sensor 1 only
// GET /data/t2     → sensor 2 only
app.get("/data", (req, res) => res.json(readings));
app.get("/data/t1", (req, res) => res.json(readings.t1));
app.get("/data/t2", (req, res) => res.json(readings.t2));

// Health check (Render.com pings this to keep service alive)
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));