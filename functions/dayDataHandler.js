export async function getDayData(lat, lon) {
  const date = new Date().toISOString().split("T")[0];

  const response = await fetch(
    `https://api.sunrise-sunset.org/v2?lat=${lat}&lng=${lon}&date=${date}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();

  return {
    date: data.date,
    sunrise: data.sunrise,
    sunset: data.sunset,
    day_length: data.day_length,
  };


}