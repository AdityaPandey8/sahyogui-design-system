import { type LatLngTuple } from "leaflet";

/**
 * Helper to map mock coords to lat/lng for visualization on a Leaflet map.
 * This maps relative {x, y} coordinates (0-100) to India's bounding box.
 */
export const getLatLng = (coords: { x: number; y: number }): LatLngTuple => {
  // Map x (roughly 20-70) to India latitude (roughly 8-37)
  // Map y (roughly 20-80) to India longitude (roughly 68-97)
  // These are just approximate for the mock data visualization
  const lat = 8 + (coords.x / 100) * 29;
  const lng = 68 + (coords.y / 100) * 29;
  return [lat, lng];
};
