
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                            RENDERS GRAPHS ON SVG                           */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import React from "react";
import Svg, { Rect, Line, Circle,  Polygon,Polyline, Text as SvgText, G } from "react-native-svg";

function getPressureColor(v) {
    v = v / 100;

    if (v >= 1026) return "#f01900";
    if (v >= 1024) return "#f53700";
    if (v >= 1022) return "#fa5f00";
    if (v >= 1020) return "#fe9015";
    if (v >= 1018) return "#f4aa09";
    if (v >= 1016) return "#f3cf09";
    if (v >= 1014) return "#f5f50b";
// colors 1012 - 1004 are predicted
    if (v >= 1012) return "#cce908";
    if (v >= 1010) return "#a3dc07";
    if (v >= 1008) return "#7bd506";
    if (v >= 1006) return "#52c604";
    if (v >= 1004) return "#29b802";

    if (v >= 1002) return "#00aa00";
    if (v >= 1000) return "#00cd46";
    if (v >= 998)  return "#00eb8c";
    if (v >= 996)  return "#00ffd2";
    if (v >= 994)  return "#0fffff";
    if (v >= 992)  return "#0fdcff";
    if (v >= 990)  return "#0fb4ff";
    if (v >= 988)  return "#0f96ff";
    if (v >= 984)  return "#0f78f0";
    if (v >= 982)  return "#0f3cb4";

    return "#0f0c24";
}



export default function RenderGraphsSVG({json, StartPos, 
    c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
    minHum,maxHum,minRain,maxRain,minTrPress,maxTrPress,minWind,maxWin,
    DPoint
}){

    return(<>
    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
            /*                   RENDERING FRAME 0 - TEMPERATURES                  */
            /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <Polygon
                points={[
                    ...DPoint["wchill_max"].map(p => `${p.x},${p.y}`),
                    ...DPoint["wchill_min"].slice().reverse().map(p => `${p.x},${p.y}`)
                ].join(" ")}
                fill="#89CFF0"
                stroke="none"
            />
    
            <Polygon
                points={[
                    ...DPoint["airtmp_max"].map(p => `${p.x},${p.y}`),
                    ...DPoint["airtmp_min"].slice().reverse().map(p => `${p.x},${p.y}`)
                ].join(" ")}
                fill="#F3D6D6"
                stroke="none"
            />
        
            <Polyline
                points={DPoint["wchill_point"].map(p => `${p.x},${p.y}`).join(" ")}
                stroke="blue"
                strokeWidth={2}
                fill="none"
            />
    
            <Polyline
                points={DPoint["airtmp_point"].map(p => `${p.x},${p.y}`).join(" ")}
                stroke="red"
                strokeWidth={2}
                fill="none"
            />
    
            { 
                DPoint["grdtmp_max"].map((maxP, idx) => 
                    (<Line
                        key={`grdtmp-${idx}`}
                        x1={maxP.x} y1={maxP.y}
                        x2={DPoint["grdtmp_min"][idx].x} y2={DPoint["grdtmp_min"][idx].y}
                        stroke="brown"
                        strokeWidth={0.7} 
                    />)
                )
            }
    
            {
            DPoint["dwptmp_point"].map((p, idx) => 
                (<Circle
                    key={`dwptmp-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r={2}
                    fill="blue"
                />)
              )
        }
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                       RENDERING FRAME 1 - RAINING / HUMIDITY           */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {
            DPoint["pcpttl_aver"].map((p, idx) => 
                (
                    <Rect
                        key={`pcpttl-${idx}`}
                    x={p.x - c_HourColumnWidth / 2}
                    y={p.y}
                    width={c_HourColumnWidth}
                    height={Math.abs(c_Frames[1].y+c_Frames[1].h - p.y)}
                    fill="green"
                    stroke="none"
                    />
                )
            )
        }
    
        {
        DPoint["pcpttl_max"].map((p, idx) => 
                (<Line
                    key={`pcpttl-max-${idx}`}
                    x1={p.x} y1={p.y}
                    x2={p.x} y2={c_Frames[1].y + c_Frames[1].h}
                    stroke="green"
                    strokeWidth={1.5}
                />)
            )
        }
    
        {
            <Polyline
                points={DPoint["realhum_aver"].map(p => `${p.x},${p.y}`).join(" ")}
                stroke="orange"
                strokeWidth={2}
                fill="none"
            />
        }
    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /*                        RENDER FRAME 2 - PRESSURE                        */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

{
    DPoint["slpres_point"].slice(0, -1).map((p, idx) => {
        const nextP = DPoint["slpres_point"][idx + 1];
        return (
            <Polygon
                key={`slpres_point-${idx}`}
                points={[
                    `${p.x},${p.y}`,
                    `${nextP.x+1},${nextP.y}`,
                    `${nextP.x+1},${c_Frames[2].y + c_Frames[2].h}`,
                    `${p.x},${c_Frames[2].y + c_Frames[2].h}`
                ].join(" ")}
                fill={getPressureColor(json.data["slpres_point"].data[idx+StartPos])}
                stroke="none"
            />
        );
    })
}
    {
    <Polyline
        points={DPoint["slpres_point"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="black"
        strokeWidth={2}
        fill="none"
    />
}

{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                            RENDER FRAME 3 - WIND                            */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

{
    DPoint["wind_gust_max"].slice(0, -1).map((p, idx) => 
        (<Line
            key={`wind-gust-max-${idx}`}
            x1={p.x} y1={p.y}
            x2={DPoint["wind_gust_max"][idx + 1].x} y2={p.y}
            stroke="#e75c5a"
            strokeWidth={1.2}
        />)
    )
}

{
    <Polyline
        points={DPoint["wind10_sd_true_prev_point"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="navy"
        strokeWidth={0.7}
        fill="none"
    />
}
{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                          RENDER FRAME 4 - WIND DIR                          */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
{
    DPoint["wind10_dr_deg_true_prev_point"].map((p, idx) => {
        const deg = json.data["wind10_dr_deg_true_prev_point"].data[idx+StartPos];

        return (
            <G
                key={`wind10-dr-${idx}`}
                rotation={deg}
                origin={`${p.x},${p.y}`}
            >
                <Line
                    x1={p.x}
                    y1={p.y + 7}
                    x2={p.x}
                    y2={p.y - 7}
                    stroke="navy"
                    strokeWidth={0.8}
                />
                <Polygon
                    points={`${p.x},${p.y - 11} ${p.x - 2},${p.y - 6} ${p.x + 2},${p.y - 6}`}
                    fill="navy"
                />
            </G>
        );
    })
}

{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*          RENDER FRAME 5 - VISIBILITY AND CLOUD VERTICAL STRETCHING         */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
{
    <Polyline
        points={DPoint["visibl_min"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="#e8b930"
        strokeWidth={1.5}
        fill="none"
    />
}

{
    DPoint["cldbse01"].map((p, idx) => 
        (<Circle
            key={`cldbse01-${idx}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="#faffff"
        />)
    )
}

{
    DPoint["cldbse25"].map((p, idx) => 
        (<Circle
            key={`cldbse25-${idx}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="#c8c8c8"
        />)
    )
}

{
    DPoint["cldbse45"].map((p, idx) => 
        (<Circle
            key={`cldbse45-${idx}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="#969696"
        />)
    )
}

{
    DPoint["cldbse65"].map((p, idx) => 
        (<Circle
            key={`cldbse65-${idx}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="#5a5a5a"
        />)
    )
}

{
    DPoint["cldbse79"].map((p, idx) => 
        (<Circle
            key={`cldbse79-${idx}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="#000000"
        />)
    )
}

{
    DPoint["cldtop"].map((p, idx) => 
        (<Circle
            key={`cldtop-${idx}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="#a52a2a"
        />)
    )
}

{/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*          RENDER FRAME 6 - CLOUD TYPES AND FOG         */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}



{
    <Polygon
        points={[
            ...DPoint["cldhigh_aver"].map(p => `${p.x},${p.y}`),
            ...DPoint["cldhigh_aver"].slice().reverse().map(p => `${p.x},${c_Frames[6].y + c_Frames[6].h}`)
        ].join(" ")}
        fill="#fefdfa"
        stroke="none"
    />
}

{
    <Polygon
        points={[
            ...DPoint["cldmed_aver"].map(p => `${p.x},${p.y}`),
            ...DPoint["cldmed_aver"].slice().reverse().map(p => `${p.x},${c_Frames[6].y + c_Frames[6].h}`)
        ].join(" ")}
        fill="#969695"
        stroke="none"
    />
}

{
    <Polygon
        points={[
            ...DPoint["cldlow_aver"].map(p => `${p.x},${p.y}`),
            ...DPoint["cldlow_aver"].slice().reverse().map(p => `${p.x},${c_Frames[6].y + c_Frames[6].h}`)
        ].join(" ")}
        fill="#5a5959"
        stroke="none"
    />
}

{
    <Polygon
        points={[
            ...DPoint["cldvlow_aver"].map(p => `${p.x},${p.y}`),
            ...DPoint["cldvlow_aver"].slice().reverse().map(p => `${p.x},${c_Frames[6].y + c_Frames[6].h}`)
        ].join(" ")}
        fill="#3b3a3a"
        stroke="none"
    />
}





{
    <Polyline
        points={DPoint["cldvlow_aver"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="#3b3a3a"
        strokeWidth={0.7}
        fill="none"
    />
}



{
    <Polyline
        points={DPoint["cldlow_aver"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="#5a5959"
        strokeWidth={0.7}
        fill="none"
    />
}



{
    <Polyline
        points={DPoint["cldmed_aver"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="#969695"
        strokeWidth={0.7}
        fill="none"
    />
}



{
    <Polyline
        points={DPoint["cldhigh_aver"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="#fefdfa"
        strokeWidth={0.7}
        fill="none"
    />
}



{
    <Polyline
        points={DPoint["cldtot_aver"].map(p => `${p.x},${p.y}`).join(" ")}
        stroke="red"
        strokeWidth={0.7}
        fill="none"
    />
}

{
    DPoint["fog_max"].map((p, idx) => 
        (<Line
            key={`fog-max-${idx}`}
            x1={p.x} y1={p.y}
            x2={p.x} y2={c_Frames[6].y + c_Frames[6].h}
            stroke="#ffb400"
            strokeWidth={3}
        />)
    )
}





    
    </>)

}