/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                        RENDERS NIGHT/DAY BACKGROUND                        */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import React from "react";
import { Rect } from "react-native-svg";


export default function RenderBackground({json,StartPos,DayData, 
        c_FrameX, c_FrameW, c_Frames, c_HourColumnWidth
        }){

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*                            TIME BACKGROUND                             */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    const dateStart = new Date(json.fstart);
    dateStart.setHours(dateStart.getHours() + StartPos);

    const sunriseDate = new Date(DayData.sunrise);
    const sunsetDate = new Date(DayData.sunset);
    
    const sunriseHour = sunriseDate.getHours() + sunriseDate.getMinutes() / 60;
    const sunsetHour = sunsetDate.getHours() + sunsetDate.getMinutes() / 60;

    const startHour = dateStart.getHours() + dateStart.getMinutes() / 60;
    const totalHours = c_FrameW / c_HourColumnWidth;
    const endHour = startHour + totalHours;

    const dayColor = "#ffffff";
    const nightColor = "#e0e0e0";

    const skyDayColor = "#87cefa";
    const skyNightColor = "#82bee6";

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*                         RENDER BACKGROUND                              */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    const renderBackground = (y1, y2, dayColor, nightColor) => {

        const segments = [];

        const boundaries = [startHour, endHour];

        const firstDay = Math.floor(startHour / 24) - 1;
        const lastDay = Math.ceil(endHour / 24) + 1;

        for (let day = firstDay; day <= lastDay; day++) {

            const sunrise = day * 24 + sunriseHour;
            const sunset = day * 24 + sunsetHour;

            if (sunrise > startHour && sunrise < endHour) {
                boundaries.push(sunrise);
            }

            if (sunset > startHour && sunset < endHour) {
                boundaries.push(sunset);
            }
        }

        boundaries.sort((a,b) => a-b);

        for (let i = 0; i < boundaries.length - 1; i++) {

            const segmentStart = boundaries[i];
            const segmentEnd = boundaries[i + 1];

            if (segmentEnd <= startHour || segmentStart >= endHour) {
                continue;
            }

            const middleHour = (segmentStart + segmentEnd) / 2;
            const hourOfDay = ((middleHour % 24) + 24) % 24;

            const isDay = hourOfDay >= sunriseHour && hourOfDay < sunsetHour;

            const x = c_FrameX + (segmentStart - startHour) * c_HourColumnWidth;
            const width = (segmentEnd - segmentStart) * c_HourColumnWidth;

            if (width > 0) {
                segments.push(
                    <Rect
                        key={segments.length}
                        x={x}
                        y={y1}
                        width={width}
                        height={y2-y1}
                        fill={isDay ? dayColor : nightColor}
                    />
                );
            }
        }

        return segments;
    };
  
    return(
    <>

        {renderBackground(
            c_Frames[0].y-20,
            c_Frames[5].y,
            dayColor,
            nightColor
        )}

        {renderBackground(
            c_Frames[5].y,
            c_Frames[6].y+c_Frames[6].h+20,
            skyDayColor,
            skyNightColor
        )}

        {renderBackground(
            c_Frames[6].y+c_Frames[6].h,
            c_Frames[6].y+c_Frames[6].h+20,
            dayColor,
            nightColor
        )}

    </>
    )

}