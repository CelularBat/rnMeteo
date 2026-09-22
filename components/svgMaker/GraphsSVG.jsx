/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*             RENDERS ALL DYNAMIC DATA, DOES MOST OF CALCULATIONS            */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


import React from "react";
import Svg, { Rect, Line, Circle,  Polygon,Polyline, Text as SvgText, G } from "react-native-svg";
import RenderLabelsSVG from "./RenderLabelsSVG";
import RenderGraphsSVG from "./RenderGraphsSVG";


/* const dataKeys =
{0: "airtmp_point",
1: "airtmp_max",
2: "airtmp_min",
3: "grdtmp_max",
4: "grdtmp_min",
5: "dwptmp_point",
6: "wchill_point",
7: "wchill_max",
8: "wchill_min",
9: "storm_max",
10: "flash_max",
11: "pcpttl_aver",
12: "pcpttlprob_point",
13: "pcpttl_max",
14: "pcpttl_type_max",
15: "realhum_aver",
16: "trpres_point",
17: "slpres_point",
18: "wind10_dr_deg_true_prev_point",
19: "wind10_sd_true_prev_point",
20: "wind_gust_max",
21: "visibl_min",
22: "cldbse01",
23: "cldbse25",
24: "cldbse45",
25: "cldbse65",
26: "cldbse79",
27: "cldtop",
28: "cldvlow_aver",
29: "cldlow_aver",
30: "cldmed_aver",
31: "cldhigh_aver",
32: "cldtot_aver",
33: "fog_max",} */


  function findMinMax(json, keys, StartPos= 0, hourRange = 120) {
    const data = json.data;
    let min = Infinity;
    let max = -Infinity;

    const endPos = StartPos + hourRange;

    for (let k = 0; k < keys.length; k++) {
        const values = data[keys[k]].data;
        const limit = Math.min(endPos, values.length);

        for (let i = StartPos; i < limit; i++) {
            const value = values[i];

            if (value < min) min = value;
            if (value > max) max = value;
        }
    }
    return [
        min === Infinity ? null : min,
        max === -Infinity ? null : max
    ];
}

// funckaj zakłada maksymalny mozliwy zakres 50 stopni - chyba wystarczy
function normalizeMinMax_temp(min,max,defaultStep=5){
    // Minimalny zakres, z krokiem 5
    const n_min = Math.floor(min / defaultStep) * defaultStep;
    const n_max = Math.ceil(max / defaultStep) * defaultStep;

    let linesNumber = (n_max-n_min)/defaultStep - 1;
    let step = defaultStep;
    if (linesNumber > 4){
        linesNumber = (n_max-n_min)/(defaultStep*2) - 1;
        step = defaultStep*2;
    }
    return [n_min,n_max, linesNumber, step];
}




export default function GraphsSVG({json,StartPos: StartPos, DayData,
    c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
    c_Left_axis_scale_x_end, c_Right_axis_scale_x_start}){




    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*                       CALCULATION OF GRAPH POINTS                      */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    // This function calculates {x,y} points on graph for each datapoint
    const DPoint = {};

    function calculatePoints(Output_Obj, keys, min_value, max_value, min_y, max_y, 
        ignore_0_values = false, isLogScale = false) {

        const endPos = Math.min(StartPos + 61, json.data[keys[0]].data.length);
        const startX = c_FrameX;
        const widthBetween = c_HourColumnWidth;

        const valueRange = max_value - min_value;
        const yRange = max_y - min_y;

        for (const key of keys) {
            const arr = json.data[key].data;
            const points = [];

            const end = Math.min(endPos, arr.length);

            for (let i = StartPos; i < end; i++) {
                const value = arr[i];
                if (ignore_0_values && value == 0) continue;
                if (isLogScale && value < 0) continue;

                const x = startX + (i - StartPos) * widthBetween;
                let y;

                if (isLogScale) {
                    const logMin = Math.log1p(min_value);
                    const logMax = Math.log1p(max_value);
                    const logValue = Math.log1p(value);

                    y = max_y - ((logValue - logMin) / (logMax - logMin)) * yRange;
                } else {
                    y = max_y - ((value - min_value) / valueRange) * yRange;
                }

                points.push({ x, y });
            }

            Output_Obj[key] = points;
        }
    }
    /* temperature frame ==================================================== */
    var [minTemp, maxTemp] = findMinMax(json,["airtmp_point","airtmp_max","airtmp_min","grdtmp_max",
        "grdtmp_min","dwptmp_point","wchill_point","wchill_max","wchill_min"]);
    var [minTemp, maxTemp, linesNumberTemp, stepsTemp] = normalizeMinMax_temp(minTemp, maxTemp);
       
    calculatePoints(DPoint,["airtmp_point","airtmp_max","airtmp_min","grdtmp_max","grdtmp_min","dwptmp_point",
        "wchill_point","wchill_max","wchill_min"],minTemp, maxTemp,c_Frames[0].y,c_Frames[0].y+c_Frames[0].h)

    /* rain frame =========================================================== */
    
    // humidity
    const [minHum,maxHum] = findMinMax(json,["realhum_aver"]);
    calculatePoints(DPoint,["realhum_aver"],minHum,maxHum,c_Frames[1].y,c_Frames[1].y+c_Frames[1].h);

    //max/min raining/snowing
    var [minRain,maxRain] = findMinMax(json,["pcpttl_max","pcpttl_type_max"]);
    var [minRain,maxRain, linesNumberRain, stepsRain] = normalizeMinMax_temp(minRain,maxRain,5);

    minRain = 0; // ALWAYS 0

    calculatePoints(DPoint,["pcpttl_aver","pcpttl_max","pcpttl_type_max"],
        minRain,maxRain,c_Frames[1].y,c_Frames[1].y+c_Frames[1].h,true);

        
    // storms (on the middle of the graph)
    calculatePoints(DPoint,["storm_max","flash_max"],
        minRain,maxRain,c_Frames[1].y+ (c_Frames[1].h / 2) ,c_Frames[1].y+ (c_Frames[1].h / 2) );

    /* pressure frame ======================================================= */
 
  
    var [minSlPres,maxSlPres] = findMinMax(json,["slpres_point"]);
    var [minSlPres,maxSlPres, linesNumberSlPres, stepsSlPres] = normalizeMinMax_temp(minSlPres,maxSlPres,300);

    calculatePoints(DPoint,["slpres_point"],
        minSlPres,maxSlPres,c_Frames[2].y,c_Frames[2].y+c_Frames[2].h);



    /* wind frame =========================================================== */

    var [minWind,maxWind] = findMinMax(json,["wind_gust_max"]);
    var [minWind,maxWind, linesNumberWind, stepsWind] = normalizeMinMax_temp(minWind,maxWind ,5);

    calculatePoints(DPoint,["wind_gust_max","wind10_sd_true_prev_point"],
        0,maxWind,c_Frames[3].y,c_Frames[3].y+c_Frames[3].h);

    /* wind direction frame ================================================= */

    calculatePoints(DPoint,["wind10_dr_deg_true_prev_point"],
        0,1,c_Frames[4].y+ (c_Frames[4].h / 2) ,c_Frames[4].y+ (c_Frames[4].h / 2));
    
    /* visibility =========================================================== */

    calculatePoints(DPoint,["visibl_min"],
        0,100000,c_Frames[5].y,c_Frames[5].y+c_Frames[5].h,true,true);

    /* cloud vertical stretching ============================================ */
    calculatePoints(DPoint,["cldbse01","cldbse25","cldbse45","cldbse65","cldbse79","cldtop"],
        0,15,c_Frames[5].y,c_Frames[5].y+c_Frames[5].h,true,true);

    /* cloud types ========================================================== */

    
    calculatePoints(DPoint,["cldvlow_aver","cldlow_aver","cldmed_aver","cldhigh_aver", "cldtot_aver"],
        0,1,c_Frames[6].y,c_Frames[6].y+c_Frames[6].h);

    /* fog ================================================================== */
        calculatePoints(DPoint,["fog_max"],
        0,1,c_Frames[6].y,c_Frames[6].y+c_Frames[6].h);


    return(
    <>
        <RenderGraphsSVG {...{json, StartPos, 
        c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
        DPoint
        }}/>

        <RenderLabelsSVG {...{json, StartPos, DayData,
        c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
        minTemp, maxTemp, linesNumberTemp, stepsTemp,
        minSlPres,maxSlPres, linesNumberSlPres, stepsSlPres,
        minWind,maxWind, linesNumberWind, stepsWind,
        minRain,maxRain, linesNumberRain, stepsRain,

        minHum,maxHum,
        c_Left_axis_scale_x_end, c_Right_axis_scale_x_start
        }}/>

        
        

      
    </>);
}