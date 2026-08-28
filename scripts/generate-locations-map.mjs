// One-off precompute script (not shipped, not run at build time). Generates
// src/lib/locations-world-map.json: a dotted world map's point grid plus our
// 6 real office/hub pins, all in the SAME coordinate space (dotted-map's own
// Mercator projection) so the interactive pins line up exactly with the
// background dots. Re-run only if the pin list or map resolution changes.
import fs from "fs";
import DottedMap from "dotted-map";

const PINS = [
  { id: "usa", lat: 40.7128, lng: -74.006 }, // New York
  { id: "uk", lat: 51.5074, lng: -0.1278 }, // London
  { id: "bangladesh", lat: 23.8103, lng: 90.4125 }, // Dhaka
  { id: "japan", lat: 35.6762, lng: 139.6503 }, // Tokyo
  { id: "australia", lat: -33.8688, lng: 151.2093 }, // Sydney
  { id: "newzealand", lat: -36.8485, lng: 174.7633 }, // Auckland
];

const map = new DottedMap({ height: 70, grid: "diagonal" });

for (const pin of PINS) {
  map.addPin({ lat: pin.lat, lng: pin.lng, data: { id: pin.id } });
}

const points = map.getPoints();
const width = Math.max(...points.map((p) => p.x));
const height = Math.max(...points.map((p) => p.y));

const dots = points.filter((p) => !p.data).map((p) => [Number(p.x.toFixed(2)), Number(p.y.toFixed(2))]);
const pins = points
  .filter((p) => p.data)
  .map((p) => ({ id: p.data.id, x: Number(p.x.toFixed(2)), y: Number(p.y.toFixed(2)) }));

fs.writeFileSync(
  "./src/lib/locations-world-map.json",
  JSON.stringify({ width, height, dots, pins })
);

console.log(`Wrote ${dots.length} dots + ${pins.length} pins, ${width}x${height}`);
