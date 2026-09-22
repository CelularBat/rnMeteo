/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                MAIN COMPONENT OF SVG GRAPH. IMPORT THIS ONE                */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import React from 'react';

import EmptyFrameSVG from '@/components/svgMaker/EmptyFrameSVG'
import GraphsSVG from '@/components/svgMaker/GraphsSVG'




const MainSVG = ({json,StartPos=0,DayData}) => {

    return (
        <EmptyFrameSVG {...{json,StartPos,DayData}}>
            {({ c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
                c_Left_axis_scale_x_end, c_Right_axis_scale_x_start})=>{

                return (
                <GraphsSVG {...{ c_FrameX, c_FrameW, c_Frames, c_ColumnWidth, c_HourColumnWidth, c_CEST_y,c_UTC_y,
                    c_Left_axis_scale_x_end, c_Right_axis_scale_x_start,
                    json,StartPos,DayData}}
                />
                )
            }}
        </EmptyFrameSVG> 
    );
};

export default MainSVG;