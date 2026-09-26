export interface T120Json {
  data: TWeatherData,
  fstart: string
}

export interface TWeatherData {
  airtmp_point: TWeatherSeries;
  airtmp_max: TWeatherSeries;
  airtmp_min: TWeatherSeries;

  grdtmp_max: TWeatherSeries;
  grdtmp_min: TWeatherSeries;

  dwptmp_point: TWeatherSeries;

  wchill_point: TWeatherSeries;
  wchill_max: TWeatherSeries;
  wchill_min: TWeatherSeries;

  storm_max: TWeatherSeries;
  flash_max: TWeatherSeries;

  pcpttl_aver: TWeatherSeries;
  pcpttlprob_point: TWeatherSeries;
  pcpttl_max: TWeatherSeries;
  pcpttl_type_max: TWeatherSeries;

  realhum_aver: TWeatherSeries;

  slpres_point: TWeatherSeries;
  trpres_point: TWeatherSeries;

  visibl_min: TWeatherSeries;

  wind10_dr_deg_true_prev_point: TWeatherSeries;
  wind10_sd_true_prev_point: TWeatherSeries;
  wind_gust_max: TWeatherSeries;

  cldbse01: TWeatherSeries;
  cldbse25: TWeatherSeries;
  cldbse45: TWeatherSeries;
  cldbse65: TWeatherSeries;
  cldbse79: TWeatherSeries;

  cldhigh_aver: TWeatherSeries;
  cldlow_aver: TWeatherSeries;
  cldmed_aver: TWeatherSeries;
  cldtop: TWeatherSeries;
  cldtot_aver: TWeatherSeries;
  cldvlow_aver: TWeatherSeries;

  fog_max: TWeatherSeries;
}

export interface TWeatherSeries {
  data: number[];
  first_timestamp: string;
  interval: number;
  unit: string;
  point:{
    lat: number;
    lon: number;
    model: string;
    grid: string;
    row: number;
    col: number;
  }
  fstart: string;
}



const apitoken = 'be6ec838-3819-471a-8b1b-09278a06efdb';

export async function getDataModel120(date:number, lat:number, lon:number):Promise<T120Json|null>{
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
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }
    return response.json();

  } catch (error) {
        console.error('Fetch error:', error);
        return null;
  }
}