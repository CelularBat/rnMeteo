const LIMIT = 20;

async function searchPlace(placeString) {
    try {
        const fetchOptions = {
            headers: {
                'Accept-Language': 'pl-PL, pl',
                'Content-Type': 'application/json'
            }
        };
        let response = await fetch(`https://geoapi.meteo.digital/geo/search.php?q=${placeString}&format=json&various_place=city&limit=${LIMIT}`, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        else {
            let data = await response.json();
            let resList = [];
            for (let idx in data) {
                // filter out doubled results
                if ((! resList.some(item=>item.name === data[idx].display_name))
                    && (data[idx].type == "administrative" || data[idx].type == "village")    
                ){
                    const {location,region} = parseFullName(data[idx].display_name);

                    let j = {
                        name: data[idx].display_name,
                        location: location,
                        region: region,
                        lat: data[idx].lat,
                        lon: data[idx].lon,
                    
                    };
                    resList.push(j);
                }
                
            }
            console.log(resList);
            return resList;

        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}



function parseFullName(name){
    let region, location;
    const segments = name.split(",");
// if segments contains postal code remove it
    if (/^[\d- ]+$/.test(segments[segments.length-2])){
        segments.splice(segments.length-2, 1)
    }
    const len = segments.length;

// Big cities have only 3 segments
    if ( len < 4){
        location = segments[0];
//Kraków, województwo małopolskie, Polska
        if (segments[len-1].includes("Polska")){
            region = segments[len-2];
        }
//Drezno, Saksonia, Niemcy
        else{
            region = segments[len-2] + "," + segments[len-1]; 
        }
    }
    else{
        location = segments[0] +","+ segments[1];
// Drezno, gmina Ciepielów, powiat lipski, województwo mazowieckie, Polska
        if (segments[len-1].includes("Polska")){
            region = segments[len-2];
        }
//Mickiewicze, Маўчадскі сельскі Савет, rejon baranowicki, Obwód brzeski, Białoruś
        else{
            region = segments[len-2] + "," + segments[len-1]; 
        }

    }

    return ({
        location: location,
        region: region
    })
}

module.exports ={searchPlace}

