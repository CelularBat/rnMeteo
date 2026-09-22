// This file was supposed to be an empty frame, but background for colums must be created at the beginning
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                           RENDERS AN EMPTY FRAME                           */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Rect, Line, Text as SvgText, G } from "react-native-svg";
import RenderBackground from "./RenderBackGroundSVG";

  const c_FrameX = 62;
  const c_FrameW = 420;

  const c_UTC_y = 619;
  const c_CEST_y = 54;

  const UTC_right_x = 16;
  const UTC_left_x = 533;

  const c_Left_axis_scale_x_end = 58;
  const c_Right_axis_scale_x_start = 488;


  const labels_x = ["12","26","516","530"];

  /* wymiary kratownicy pionowej ===================================================== */
  const c_ColumnWidth = 21;
  const c_HourColumnWidth = 7;

  /*
   * ==========================================================
   * STYLE
   * ==========================================================
   */
  const cream = "#fffbf0";
  const blue = "#0000aa";
  const black = "#000000";

  const scaleStyle = {
    fill: black,
    fontSize: 10,
    fontFamily: "Helvetica",
    letterSpacing: 0.5,
    fontWeight:600
  };

  const labelStyle = {
    fill: blue,
    fontSize: 12,
    fontFamily: "Arial,monospace",
    letterSpacing: -0.2,
    fontWeight:600
  };

  const timezoneStyle = {
    fill: black,
    fontSize: 12,
    fontFamily: "Helvetica, sans-serif",
    letterSpacing: 0,
  };

  const footerStyle = {
  fill: blue,
  fontSize: 13,
  fontFamily: "Arial Narrow",
  letterSpacing: 0,
  fontWeight: "500",
};

    /*
   * ==========================================================
   * RAMKI
   * ==========================================================
   *
   * Szerokość: 418 px
   *
   * 19 odcinków × 22 px = 418 px
   *
   * Pierwsza i ostatnia kolumna: 11 px
   * Kolumny środkowe: 22 px
   */

  const c_Frames = [
    { y: 57, h: 78 },
    { y: 143, h: 78 },
    { y: 230, h: 78 },
    { y: 317, h: 78 },
    { y: 401, h: 31 },
    { y: 438, h: 80 },
    { y: 527, h: 80 },
  ];

    /*
   * ==========================================================
   * ŚRODKI RAMEK
   * ==========================================================
   */

  const centers = {
    temperature: 96,
    rain: 182,
    pressure: 269,
    wind: 356,
    clouds: 477,
    overcast: 564,
  };
    
  /*
   * ==========================================================
   * LABELS
   * ==========================================================
   */

    const axisLabels = [
    {
      center: centers.temperature,
      left: ["temperatura", "(°C)"],
      right: ["temperatura", "(°C)"],
    },
    {
      center: centers.rain,
      left: ["opad", "(mm/h, kg/m²/h)"],
      right: ["wilgotność wzgl.", "(%)"],
    },
    {
      center: centers.pressure,
      left: ["ciśnienie", "(hPa)"],
      right: ["ciśnienie", "(mm Hg)"],
    },
    {
      center: centers.wind,
      left: ["wiatr", "(m/s)"],
      right: ["wiatr", "(km/h)"],
    },
    {
      center: centers.clouds,
      left: ["pion. rozciągł.", "chmur (km)"],
      right: ["widzialność", "(km)"],
    },
    {
      center: centers.overcast,
      left: ["zachmurzenie", "(oktany)"],
      right: ["mgła", "(frakcja)"],
    },
  ];


  const scales = [
    {
      values: ["15.0","7.0","2.0","0.5","0.0"],
      x: c_Left_axis_scale_x_end,
      textAnchor: "end",
      frame: 5
    },
    {
      values: [100,20,5,1,0],
      x: c_Right_axis_scale_x_start,
      textAnchor: "start",
      frame: 5,
      color: "#fe9015"
    },
    {
      values: [8,6,4,2,0],
      x: c_Left_axis_scale_x_end,
      textAnchor: "end",
      frame: 6
    },
    {
      values: ["1","0.75","0.5","0.25","0"],
      x: c_Right_axis_scale_x_start,
      textAnchor: "start",
      frame: 6,
      color: "#fe9015"
    },
  ];


export default function EmptyFrameSVG({children,json, StartPos,DayData}) {
  /*
   * ==========================================================
   * POZYCJE KRATOWNICY
   * ==========================================================
   */
  const verticalGridLines = Array.from(
    { length: 20 },
    (_, i) => c_FrameX + c_HourColumnWidth*2 + i * c_ColumnWidth
  );

  const horizontal_line_frame5_height = c_Frames[5].h / 4;




  return (
    
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 540 660"
        preserveAspectRatio="xMidYMid meet"
      >
      {/* <Svg width={540} height={660} viewBox="0 0 540 660"> */}
      {/* <Svg width="100%" viewBox="0 0 540 660" style={{aspectRatio: 540 / 660}}> */}

        {/* BACKGROUND OF FULL FRAME */}
        <Rect x="0" y="0" width="540" height="660" fill={cream} />

        {/* ======================================================
        Background columns
        ====================================================== */}

        <RenderBackground {...{json, StartPos,DayData, 
        c_FrameX, c_FrameW, c_Frames, c_HourColumnWidth}} />

        {/* ======================================================
        7 FRAMES
        ====================================================== */}

        {c_Frames.map((frame, frameIndex) => (
          <G key={frameIndex}>
            <Rect
              x={c_FrameX}
              y={frame.y}
              width={c_FrameW}
              height={frame.h}
              fill="none"
            />

            <Rect
              x={c_FrameX}
              y={frame.y}
              width={c_FrameW}
              height={frame.h}
              fill="none"
              stroke="#222222"
              strokeWidth="1"
            />
          </G>
        ))}

        {/* ======================================================
            CEST — UP
            ====================================================== */}

        <SvgText {...timezoneStyle} x={UTC_right_x} y={c_CEST_y} textAnchor="start">CEST</SvgText>
        <SvgText {...timezoneStyle} x={UTC_left_x} y={c_CEST_y} textAnchor="end">CEST</SvgText>

        
        {/* ======================================================
            UTC — BOTTOM
            ====================================================== */}

        <SvgText {...timezoneStyle} x={UTC_right_x} y={c_UTC_y} textAnchor="start">UTC</SvgText>
        <SvgText {...timezoneStyle} x={UTC_left_x} y={c_UTC_y} textAnchor="end">UTC</SvgText>

        {/* ======================================================
          LABELS RENDERING
          ====================================================== */}

        { axisLabels.map((o,idx)=>(
          <React.Fragment key={idx}>
              <G {...labelStyle} textAnchor="middle">
                <SvgText x={labels_x[0]} y={o.center} rotation="-90" origin={`${labels_x[0]}, ${o.center}`}>{o.left[0]}</SvgText>
                <SvgText x={labels_x[1]} y={o.center} rotation="-90" origin={`${labels_x[1]}, ${o.center}`}>{o.left[1]}</SvgText>
              </G>

              <G {...labelStyle} textAnchor="middle">
                <SvgText x={labels_x[3]} y={o.center} rotation="90" origin={`${labels_x[3]}, ${o.center}`}>{o.right[0]}</SvgText>
                <SvgText x={labels_x[2]} y={o.center} rotation="90" origin={`${labels_x[2]}, ${o.center}`}>{o.right[1]}</SvgText>
              </G>
          </React.Fragment>
        ))}


        {/* ======================================================
            5. WIND DIRECTIONS LABEL
            ====================================================== */}

        <G {...labelStyle} textAnchor="middle">
          <SvgText x="22" y="409">N</SvgText>
          <SvgText x="13" y="421">W</SvgText>
          <SvgText x="31" y="421">E</SvgText>
          <SvgText x="22" y="433">S</SvgText>

          <SvgText x="520" y="409">N</SvgText>
          <SvgText x="511" y="421">W</SvgText>
          <SvgText x="529" y="421">E</SvgText>
          <SvgText x="520" y="433">S</SvgText>
        </G>



        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
        /*                   DATA RENDERING COMPONENT HERE:                   */
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {children && children({ c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
        c_Left_axis_scale_x_end, c_Right_axis_scale_x_start
        })}


        {/* ======================================================
            VERTICAL DASHED LINES
        ====================================================== */}

        {c_Frames.map((frame, frameIndex) => (
          <G key={frameIndex}>
            {verticalGridLines.map((x, lineIndex) => (
              <Line
                key={lineIndex}
                x1={x}
                y1={frame.y}
                x2={x}
                y2={frame.y + frame.h}
                stroke="#888888"
                strokeWidth="1"
                strokeDasharray="1 4"
                strokeLinecap="round"
              />
            ))}
          </G>
        ))}

        {/* ======================================================
            HORIZONTAL LINES — FRAMES 5 AND 6
            ====================================================== */}

        {[c_Frames[5], c_Frames[6]].map((frame, frameIndex) => {
          const lineHeight = frame.h / 4;

          return (
            <G key={`horizontal-lines-${frameIndex}`}>
              {[1, 2, 3].map((lineIndex) => (
                <Line
                  key={lineIndex}
                  x1={c_FrameX}
                  y1={frame.y + lineIndex * lineHeight}
                  x2={c_FrameX + c_FrameW}
                  y2={frame.y + lineIndex * lineHeight}
                  stroke="#888888"
                  strokeWidth="1"
                  strokeDasharray="1 4"
                  strokeLinecap="round"
                />
              ))}
            </G>
          );
        })}
        {/* ======================================================
            SCALES — FRAMES 5 AND 6
            ====================================================== */}
        {scales.map(({ values, x, textAnchor, frame,color }, scaleIndex) => {
          const step = c_Frames[frame].h / 4;

          return values.map((value, index) => (
            <SvgText
              key={`${scaleIndex}-${index}`}
              {...scaleStyle}
              fill={color}
              x={x}
              y={c_Frames[frame].y + index * step + 4}
              textAnchor={textAnchor}
            >
              {value}
            </SvgText>
          ));
        })}

        {/* ======================================================
            FOOTER
            ====================================================== */}
            <SvgText style={footerStyle} x={10} y={650} textAnchor="start">
              meteo@icm.edu.pl
            </SvgText>

      </Svg>

  )
}

