export function getApproximateLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: Number(coords.latitude.toFixed(1)),
        longitude: Number(coords.longitude.toFixed(1)),
        precisionKm: Math.max(25, Math.round(coords.accuracy / 1000)),
      }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 3_600_000 },
    );
  });
}
