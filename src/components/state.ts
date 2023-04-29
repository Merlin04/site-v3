import { createEvent, createState } from "tahitiensis";

export const randomColor = () => Array.from({ length: 3 }, () => Math.round(Math.random() * 255)) as [number, number, number];

export const [addStateListener, removeStateListener, patchState, getState] = createState({
    funMode: false,
    shaderColors: [/*[0, 0, 0], [255, 0, 255]*/ randomColor(), randomColor()] as [[number, number, number], [number, number, number]],
    animationSpeed: 1
});

export const [addRandomizeListener, removeRandomizeListener, emitRandomize] = createEvent<void>();

addRandomizeListener(() => {
    patchState({
        shaderColors: [randomColor(), randomColor()]
    });
});