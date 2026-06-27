const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// In-memory store — now 4 data points
let readings = {
  t1:      { value: null, unit: "°C", label: "Sensor 1 Temp",    updatedAt: null },
  t2:      { value: null, unit: "°C", label: "Sensor 2 Temp",    updatedAt: null },
  voltage: { value: null, unit: "V",  label: "Buck Output",      updatedAt: null },
  current: { value: null, unit: "A",  label: "Current",          updatedAt: null }
};

// ESP32 posts here
// Body: { "t1": 24.5, "t2": 31.2, "voltage": 4.98, "current": 0.312 }
app.post("/data", (req, res) => {
  const { t1, t2, voltage, current } = req.body;
  const now = new Date().toISOString();

  if (t1      !== undefined) readings.t1.value      = t1,      readings.t1.updatedAt      = now;
  if (t2      !== undefined) readings.t2.value      = t2,      readings.t2.updatedAt      = now;
  if (voltage !== undefined) readings.voltage.value = voltage, readings.voltage.updatedAt = now;
  if (current !== undefined) readings.current.value = current, readings.current.updatedAt = now;

  console.log(`[${now}] T1=${t1}°C | T2=${t2}°C | V=${voltage}V | I=${current}A`);
  res.json({ ok: true });
});

// GET all
app.get("/data",         (req, res) => res.json(readings));
// GET individual
app.get("/data/t1",      (req, res) => res.json(readings.t1));
app.get("/data/t2",      (req, res) => res.json(readings.t2));
app.get("/data/voltage", (req, res) => res.json(readings.voltage));
app.get("/data/current", (req, res) => res.json(readings.current));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));