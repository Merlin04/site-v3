import { createState } from "tahitiensis";

export const [addStateListener, removeStateListener, patchState, getState] = createState({
    funMode: false,
    shaderColors: [[0, 0, 0], [255, 0, 255]] as [[number, number, number], [number, number, number]],
    animationSpeed: 1
});