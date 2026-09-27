import {useWindowDimensions} from  'react-native';

/**
 * Adjusts a value based on the current screen width.
 * Uses defaultValue above the largest breakpoint.
 *
 * Example:
 * adjustVal_Smaller_ScreenW(10, [[680, 7], [480, 6]])
 *
 * @param defaultValue - Value used for screens wider than the largest breakpoint.
 * @param pairs - [width, value] pairs defining values for smaller screens.
 * @returns The value matching the current screen width.
 */
export function adjustVal_Smaller_ScreenW<T>(defaultValue:T,pairs:[number,T][]) : T {
    const {width,height}= useWindowDimensions();
    // sort from smallest up
    const sortedPairs = [...pairs].sort((a, b) => a[0] - b[0]);

    for (const [maxWidth, value] of sortedPairs) {
        if (  width <= maxWidth) {
            return value;
        }
    }

    return defaultValue;
}

/**
 * Adjusts a value based on the current screen height.
 * Uses defaultValue above the largest breakpoint.
 *
 * Example:
 * adjustVal_Smaller_ScreenH(10, [[800, 7], [600, 6]])
 *
 * @param defaultValue - Value used for screens taller than the largest breakpoint.
 * @param pairs - [height, value] pairs defining values for smaller screens.
 * @returns The value matching the current screen height.
 */
export function adjustVal_Smaller_ScreenH<T>( defaultValue: T, pairs: [number, T][] ): T {
    const { height } = useWindowDimensions();

    // sort from smallest up
    const sortedPairs = [...pairs].sort((a, b) => a[0] - b[0]);

    for (let i = sortedPairs.length - 1; i >= 0; i--) {
        const [maxHeight, value] = sortedPairs[i];

        if (height  <= maxHeight) {
            return value;
        }
    }

    return defaultValue;
}

/**
 * Adjusts a value based on the current screen width.
 * Uses defaultValue below the smallest breakpoint.
 *
 * Example:
 * adjustVal_Bigger_ScreenW(6, [[480, 7], [680, 10]])
 *
 * @param defaultValue - Value used for screens narrower than the smallest breakpoint.
 * @param pairs - [width, value] pairs defining values for larger screens.
 * @returns The value matching the current screen width.
 */
export function adjustVal_Bigger_ScreenW<T>( defaultValue: T, pairs: [number, T][] ): T {
    const { width } = useWindowDimensions();

    // sort from smallest up
    const sortedPairs = [...pairs].sort((a, b) => a[0] - b[0]);

    for (const [minWidth, value] of sortedPairs) {
        if ( width  >= minWidth) {
            return value;
        }
    }

    return defaultValue;
}

/**
 * Adjusts a value based on the current screen height.
 * Uses defaultValue below the smallest breakpoint.
 *
 * Example:
 * adjustVal_Bigger_ScreenH(6, [[600, 7], [800, 10]])
 *
 * @param defaultValue - Value used for screens shorter than the smallest breakpoint.
 * @param pairs - [height, value] pairs defining values for larger screens.
 * @returns The value matching the current screen height.
 */
export function adjustVal_Bigger_ScreenH<T>( defaultValue: T, pairs: [number, T][] ): T {
    const { height } = useWindowDimensions();

    // sort from smallest up
    const sortedPairs = [...pairs].sort((a, b) => a[0] - b[0]);

    for (const [minHeight, value] of sortedPairs) {
        if (height >= minHeight  ) {
            return value;
        }
    }

    return defaultValue;
}