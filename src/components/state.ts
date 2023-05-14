import { createEvent, createState } from "tahitiensis";

const randomColor = () => Array.from({ length: 3 }, () => Math.round(Math.random() * 255)) as [number, number, number];
const randomColorSet = () => {
    // we have to generate colors that ensure the text is reaadable - the text is #D0D0D9
    const textColor: [number, number, number] = [208, 208, 217];
    // so we need to make sure the colors are at least some distance away from the text color
    const minDist = 300;
    // ideally we'd use a proper distance metric, but this is good enough for now
    // const metric = (a: [number, number, number]) => Math.sqrt(a.reduce((acc, v, i) => acc + Math.abs(v - textColor[i]) ** 2, 0));
    // actually let's use a proper metric
    // https://www.compuphase.com/cmetric.htm
    function redmeanColorDist(e1: [number, number, number], e2: [number, number, number]): number {
        const rmean = (e1[0] + e2[0]) / 2;
        const r = e1[0] - e2[0];
        const g = e1[1] - e2[1];
        const b = e1[2] - e2[2];
        return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8));
    }
    const metric = (a: [number, number, number]) => redmeanColorDist(a, textColor);

    const metricP = (a: [number, number, number]) => { const m = metric(a); console.log(a, m); return m;}
    // we'll just generate random colors until we get one that works
    const generateColor = () => {
        let c;
        do {
            c = randomColor();
        } while(metricP(c) < minDist);
        return c;
    };

    return [generateColor(), generateColor()] as [[number, number, number], [number, number, number]];
}

export const [addStateListener, removeStateListener, patchState, getState] = createState({
    funMode: false,
    shaderColors: randomColorSet() as [[number, number, number], [number, number, number]],
    animationSpeed: 1
});

export const [addRandomizeListener, removeRandomizeListener, emitRandomize] = createEvent<void>();

addRandomizeListener(() => {
    patchState({
        shaderColors: randomColorSet()
    });
});