
/*
    Function for finding cities/places by name.

    In version 3.0.0 meteo.pl internal API was replaced with native Nominatim API
    Nominatim usage policy:
    https://operations.osmfoundation.org/policies/nominatim/
    
*/

/* Corners of UM on map:
1o58'27''E 65o18'10''N ,
36o58'6''E 65o15'59''N ,
29o48'54''E 44o43'30'N ,
8o59'42''E 44o44'48''N

After conversion:
min longitude =  1.9741667
max longitude = 36.9683333
min latitude  = 44.7250000
max latitude  = 65.3027778
*/

const LIMIT = 20;
const VIEWBOX="1.9741667,65.3027778,36.9683333,44.7250000";

async function searchPlace(placeString) {
    try {
        const fetchOptions = {
            headers: {
                'Accept-Language': 'pl-PL, pl',
                'Content-Type': 'application/json',
                'Referer': 'meteo-icm.netlify.app',
                'User-Agent': 'rnMeteo'
            }
        };
        const urlRoot = "https://nominatim.openstreetmap.org/search?";
        const urlParams=`q=${placeString}&format=geojson&addressdetails=1&limit=${LIMIT}`+
            `&accept-language=pl&viewbox=${VIEWBOX}&bounded=1`;

        let response = await fetch(urlRoot+urlParams, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        else {
            let data = await response.json();
            data = data["features"];
            if (!data) {
                throw new Error(`JSON has no key "features"`);
            } 

            let resultList = []; // results being kept here.

           
            for (let idx in data) {
                // check for proper type of record
                if ((data[idx].properties.type === "administrative" || data[idx].properties.type === "village")
                // don't add if it's doubling another record
                    && (! resultList.some(item=> item.display_name === data[idx].properties.display_name))           
                ){
                    
                    let newPlace = {
                        display_name: data[idx].properties.display_name,
                        name: data[idx].properties.name,
                        city:data[idx].properties.address.city,	
                        municipality:data[idx].properties.address.municipality,	
                        county: data[idx].properties.address.county,
                        state: data[idx].properties.address.state,
                        country: data[idx].properties.address.country,
                        lon: data[idx].geometry.coordinates[0],
                        lat: data[idx].geometry.coordinates[1],
                    };

                    newPlace.location = formatLocationString(newPlace);
                    newPlace.region = (newPlace.country === "Polska") ?
                        newPlace.state : (`${newPlace.state}, ${newPlace.country}`);

                    resultList.push(newPlace);
                }
                
            }
            return resultList;

        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
        //throw error;
    }
}

// jeśli jest gmina to gmina, jeśli tylko powiat to powiat.
function formatLocationString(placeData){
    let res = placeData.name;
    if (placeData.city){
        res = res + ", "+placeData.city;
    } 
    else if (placeData.municipality){
        res = res + ", "+placeData.municipality;
    } 
    else if(placeData.county){
        res = res + ", "+placeData.county;
    }
    return res;
}

module.exports ={searchPlace}

