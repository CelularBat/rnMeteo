const apitoken = 'be6ec838-3819-471a-8b1b-09278a06efdb';
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
        console.error('Fetch error:', error);
        throw error;
    }
  }


  function getCurrentDateString() {
    try {
        let now = new Date();
        
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0'); 
        let day = String(now.getDate()).padStart(2, '0'); 
        let hour = now.getHours(); 

        let dint = parseInt(`${year}${month}${day}`); 

       
        let t;
        if (hour < 6) {
            dint -= 1; 
            t = '12';
        } else if (hour < 12) {
            dint -= 1;
            t = '18';
        } else if (hour < 18) {
            t = '00';
        } else {
            t = '06';
        }

        return `${dint}${t}`;
        
        
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

function createImgUrl(XYString,dateString){
    return "https://www.meteo.pl/um/metco/mgram_pict.php?ntype=0u" + "&fdate=" + dateString + XYString + "&lang=pl";
}

module.exports = {coordsToXYString , getCurrentDateString , createImgUrl};


// This function is moved to the serverless API, because need to be executed from backend, not browser

// const coordsToXY = async(N, E) =>{
//     const url = `https://old.meteo.pl/um/php/mgram_search.php?NALL=${N}&EALL=${E}&lang=pl`;

//     try {
//         const response = await fetch(url, {
//             method: 'HEAD',
//             redirect: 'manual'
//         });

//         if (response.status >= 300 && response.status < 400) {
//             const redirectURL = response.headers.get('location');
//             const xyString = redirectURL.match(/&row=\d{2,3}&col=\d{2,3}/);

//             if (xyString) {
//                 console.log(redirectURL);
//                 return ({data: xyString[0],
//                         status: 1}); // Return the matched string
//             } else {
//                 return ({data: 'No valid row and column found in the redirect URL',
//                         status: 0});
//             }
//         } else {
//             console.log('Response status:', response.status, url);
//             console.log('Response did not redirect:', response);
//             return ({data: 'No valid row and column found in the redirect URL',
//                         status: 0});
//         }
//     } catch (error) {
//         console.error('Error during fetch:', error);
//         return ({data: error,
//                         status: 0});
//     }
// }