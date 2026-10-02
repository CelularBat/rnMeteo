export interface TFavPlace{
  lon: number;
  lat: number;
  location: string;
  region:string;
  id:string;

  display_name: string;
  name: string;
  country: string;

  city?: string;
  municipality?: string;
  county?: string;
  state?: string;


  XYstr?:string;
}