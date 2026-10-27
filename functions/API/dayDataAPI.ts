export interface TDayData {
  date: string,
  sunrise: string,
  sunset: string,
  day_length: number,
}

export async function getDayData(lat: number | string, lon: number | string): Promise<TDayData | null>{
  try { 
      const date = new Date().toISOString().split("T")[0]; 
      const response = await fetch(`https://api.sunrise-sunset.org/v2?lat=${lat}&lng=${lon}&date=${date}`); 
      if (!response.ok) { 
        console.error(`getDayData::HTTP error: ${response.status} ${response.statusText}`); 
        return null; 
      } 
      const data = await response.json();
      return { 
        date: data.date,
        sunrise: data.sunrise,
        sunset: data.sunset,
        day_length: data.day_length, 
      }; 

    } catch (error) { 
      console.error("getDayData::Fetch error:", error); 
      return null; 
    }
}
