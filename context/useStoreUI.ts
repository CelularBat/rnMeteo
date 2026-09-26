/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/*                     STORE FOR MANAGING GLOBAL UI STATES                    */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

import { create } from "zustand";

export const useUIStore = create((set,get) => ({
  G_Is_Model_120 : false,
  G_Toogle_Model_120: ()=> set( (state:any)=> ({ G_Is_Model_120: ! state.G_Is_Model_120 }) )

}));