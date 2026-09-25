/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                        RENDERS DYNAMIC LABELS ON SVG                       */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import React from "react";
import Svg, { Rect, Line, Circle,  Polygon,Polyline, Text , G } from "react-native-svg";

  const sunStyle = {
    fill: "blue",
    fontSize: 11,
    fontFamily: "Arial,monospace",
    letterSpacing: 0,
    fontWeight: 600
  };

const hoursStyle = {
    fill: "#000000",
    fontSize: 12,
    fontFamily: "Helvetica, sans-serif",
    letterSpacing: 0,
    fontWeight: 400
};

const daysStyle = {
    fill: "#000000",
    fontSize: 12,
    fontFamily: "Helvetica, sans-serif",
    letterSpacing: 0,
    fontWeight: 600
};

  const scaleStyle = {
    fill: "black",
    fontSize: 10,
    fontFamily: "Helvetica",
    letterSpacing: 0.5,
    fontWeight:600
  };

export default function RenderLabelsSVG({json, StartPos, DayData,
        c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
        
        minTemp, maxTemp, linesNumberTemp, stepsTemp,
        minRain,maxRain, linesNumberRain, stepsRain,
        minHum,maxHum, linesNumberHum, stepsHum,
        minSlPres,maxSlPres, linesNumberSlPres, stepsSlPres,
        minWind,maxWind, linesNumberWind, stepsWind,
        
        c_Left_axis_scale_x_end, c_Right_axis_scale_x_start
        }){
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*                               TIME LABELS                              */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    const dateStart = new Date(json.fstart);
    dateStart.setHours(dateStart.getHours() + StartPos);

    const labelsHoursUTC = Array.from({ length: 10 }, (_, i) => {
        const date = new Date(dateStart);
        date.setHours(dateStart.getHours() + 2 + i * 6);
        return date.getHours();
    });

    const labelsDays = Array.from({ length: 3 }, (_, i) => {
        const date = new Date(dateStart);
        date.setHours(12 + i * 24, 0, 0, 0);

        const dayNames = ["nie", "pon", "wto", "śro", "czw", "pią", "sob"];

        return {
            label: `${dayNames[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`,
            date
        };
    });

    const sunriseDate = new Date(DayData.sunrise);
    const sunsetDate = new Date(DayData.sunset);

    const sunrise = `${String(sunriseDate.getHours()).padStart(2, "0")}:${String(sunriseDate.getMinutes()).padStart(2, "0")}`;
    const sunset = `${String(sunsetDate.getHours()).padStart(2, "0")}:${String(sunsetDate.getMinutes()).padStart(2, "0")}`;

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*         FUNCTION, WHICH RENDERS AXIS LABELS AND VERTICAL LINES         */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    function renderAxisLabels (min,max,lines,steps,frameIndex, 
        rightConvertFunc = null,leftConvertFunc= null,
        renderRight = true,renderLeft = true, renderLine = true, ){

    const renderedLabels = [];
    const renderedLines = [];

    for (let i = 0; i <= lines+1; i++) {

        const value = max - i * steps;
        const y =
            c_Frames[frameIndex].y +
            (i * steps / (max - min)) * c_Frames[frameIndex].h;
        // LABELS
        if (renderLeft || renderRight) {

            renderedLabels.push(
                <G key={`label-${i}`}>

                    {renderLeft && (
                        <Text
                            x={c_Left_axis_scale_x_end}
                            y={y + 4}
                            textAnchor="end"
                            {...scaleStyle}
                        >
                           {leftConvertFunc ? leftConvertFunc(value) : value}
                        </Text>
                    )}

                    {renderRight && (
                        <Text
                            x={c_Right_axis_scale_x_start}
                            y={y + 4}
                            textAnchor="start"
                            {...scaleStyle}
                        >
                            {rightConvertFunc ? rightConvertFunc(value) : value}
                        </Text>
                    )}
                </G>
            );
        }
        // LINES — bez pierwszej i ostatniej
        if (renderLine && i !== 0 && i !== lines+1) {
            renderedLines.push(
                <Line
                    key={`line-${i}`}
                    x1={c_FrameX}
                    y1={y}
                    x2={c_FrameX + c_FrameW}
                    y2={y}
                    stroke="#888888"
                    strokeWidth="1"
                    strokeDasharray="1 4"
                    strokeLinecap="round"
                />
            );
        }
    }
    return [renderedLabels, renderedLines];
    };

    const[labelsTemp,linesTemp] = renderAxisLabels(minTemp, maxTemp, linesNumberTemp, stepsTemp,0);

    const [labelRain,linesRain]= renderAxisLabels(minRain,maxRain, linesNumberRain, stepsRain,1,
        null,null
        ,false);

    const [labelHum,__linesHum]= renderAxisLabels(minHum,maxHum, linesNumberHum, stepsHum,1,
        (v)=>Math.round(v),null,
        true,false,false);


    const[labelsPres,linesPres] = renderAxisLabels(minSlPres,maxSlPres, linesNumberSlPres, stepsSlPres,2,
         (v)=>Math.round(v*0.0075006),(v)=>Math.round(v*0.01) );

    const [labelsWind,linesWind] = renderAxisLabels(minWind,maxWind, linesNumberWind, stepsWind,3,
        null,(v)=>Math.round(v*3.6));
    

    
    
    return(
    <>

    {labelsTemp}
    {linesTemp}

    {labelRain}
    {linesRain}
    {labelHum}

    {labelsPres}
    {linesPres}

     {labelsWind}
    {linesWind} 
    



        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                        RENDERING TIME LABELS                       */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        { 
            labelsHoursUTC.map((o,idx)=>(
                <React.Fragment key={idx}>
                    <Text {...hoursStyle} x={c_FrameX+14+idx*2*c_ColumnWidth} y={c_CEST_y} 
                        key={idx+"cest"} textAnchor="middle">{(o+2) % 24}</Text>
                    <Text {...hoursStyle} x={c_FrameX+14+idx*2*c_ColumnWidth} y={c_UTC_y} 
                        key={idx+"utc"} textAnchor="middle">{o}</Text>
                </React.Fragment>
            ))
        }

        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                        RENDERING DAY LABELS                        */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {
            labelsDays.map((o,idx) => {
                const hourStart = dateStart.getHours();

                if (idx === 0 && hourStart >= 9) {
                    return null;
                }

                return (
                    <Text {...daysStyle} x={c_FrameX+14+((idx * 24 + 12 - hourStart) / 3)*c_ColumnWidth} y={c_CEST_y - 16}
                        key={idx+"day"} textAnchor="middle">{o.label}</Text>
                );
            })
        }
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                        RENDERING SUN HOURS                          */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        
        <G>
            <Text {...sunStyle} x={2} y={ 12}
                textAnchor="start">
                {`wschód słońca ${sunrise} CEST`}
            </Text>

            <Text {...sunStyle} x={5} y={27}
                textAnchor="start">
                {`zachód słońca ${sunset} CEST`}
            </Text>
        </G>
        
    </>
    )

}