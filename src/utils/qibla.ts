// Qibla direction calculation from current coordinates
// Based on great-circle formula to Kaaba (21.4225° N, 39.8262° E)

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

export function calculateQiblaDirection(latitude: number, longitude: number): number {
  // Convert to radians
  const φ1 = (latitude * Math.PI) / 180;
  const φ2 = (KAABA_LAT * Math.PI) / 180;
  const Δλ = ((KAABA_LON - longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = (θ * 180) / Math.PI;
  // Normalize to 0-360
  return (bearing + 360) % 360;
}

export function normalizeDegree(degree: number): number {
  return ((degree % 360) + 360) % 360;
}
