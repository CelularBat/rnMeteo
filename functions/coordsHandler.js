const apitoken = 'be6ec838-3819-471a-8b1b-09278a06efdb';

const getDataModel120 = async (date, lat, lon)=>{
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



const coordsToXYString = async(N,E)=> {
    try {
      const response = await fetch(`https://energetic-mountain-66e7.codehooks.io/?NALL=${N}&EALL=${E}`, { 
        method: 'GET', 
        headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let res = await response.json();
      return res;

    } catch (error) {
        console.error('Problem with coords translation server:', error);
        //throw error;
    }
  }


  function getCurrentDateString() {
    try {
        let now = new Date();
        let hour = now.getHours(); 
        let t;


        if (hour < 6) {
            now.setDate(now.getDate() - 1);
            t = '18';
        } else if (hour < 12) {
            t = '00';
        } else if (hour < 18) {
            t = '06';
        } else {
            t = '12';
        }

        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); 
        let day = String(now.getDate()).padStart(2, '0'); 

        let dint = parseInt(`${year}${month}${day}`); 

        return `${dint}${t}`;
        
        
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

function createImgUrl(XYString,dateString){
    return "https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u" + "&fdate=" + dateString + XYString + "&lang=pl";
}

module.exports = {coordsToXYString , getCurrentDateString , createImgUrl, getDataModel120};
