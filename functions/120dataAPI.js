const apitoken = 'be6ec838-3819-471a-8b1b-09278a06efdb';

export async function getDataModel120(date, lat, lon){
    try {
    const response = await fetch(`https://energetic-mountain-66e7.codehooks.io/`, { 
      method: 'POST', 
      headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' }, //1789905600
      body: JSON.stringify({
        date,
        point:{
            lat,
            lon
        }
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
        console.error('Fetch error:', error);
  }
}