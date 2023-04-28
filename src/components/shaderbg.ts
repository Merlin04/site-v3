import FastNoiseLite from "./FastNoiseLite";
import { addStateListener, getState } from "./state";

const noise = new FastNoiseLite();
//@ts-expect-error - not sure what's happening here
noise.SetNoiseType(FastNoiseLite.NoiseType.OpenSimplex2);

// simple script for a neat little shader-esque background
// shader function

type Shader = (x: number, y: number, mouseX: number, mouseY: number, realX: number, realY: number, frame: number, t: number) => number; // result is number between 0 and 1

/*const shader: Shader = (x, y, mouseX, mouseY, t) => {
    const cx = x - mouseX;
    const cy = y - mouseY;
    const r = Math.sqrt(cx * cx + cy * cy);
    return Math.cos(Math.sqrt(r * 10) + (t / 5)) * 0.5 + 0.5;
};*/
// hmmm actually let's try something completely different with maybe a bit of noise?
// const shader: Shader = (x, y, mouseX, mouseY, t) => {
//     const cx = x - mouseX;
//     const cy = y - mouseY;
//     const r = Math.sqrt(cx * cx + cy * cy);
//     const a = Math.atan2(cy, cx);
//     const v = Math.sin(r * 10 + t * 2) * 0.5 + 0.5;
//     const n = Math.sin(a * 10 + t * 2) * 0.5 + 0.5;
//     const p = Math.sin(v * 10 + n * 2) * 0.5 + 0.5;

//     // apply noise
//     return (p + noise.GetNoise(x, y, t) * 0.5) * 0.5 + 0.5;
// };

// const shader: Shader = (x, y, mouseX, mouseY, t) => Math.sin(x*(x+mouseX));

// this function combines two values within the ranges 0-1 with associated weights
const mix = (a: number, b: number, w: number) => a * (1 - w) + b * w;

const shader: Shader = (x, y, mouseX, mouseY, realX, realY, frame, t) => {
    const cx = x - mouseX;
    const cy = y - mouseY;
    const r = Math.sqrt(cx * cx + cy * cy); // dist from mouse
    return mix(noise.GetNoise(x * 128, y * 128, t * 10 /*realX, realY, frame / 2*/) * 0.5 + 0.5, r, 0.3);
};

const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.zIndex = "-1";
canvas.style.width = "100vw";
canvas.style.height = "100vh";
canvas.style.top = "0";
canvas.style.left = "0";
// canvas.style.imageRendering = "pixelated";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const memoize = <T extends (...args: any[]) => any>(f: T, k: (...args: Parameters<T>) => string | number | symbol) => {
    const cache = new Map<string | number | symbol, ReturnType<T>>();
    return (...args: Parameters<T>): ReturnType<T> => {
        const key = k(...args);
        if (cache.has(key)) {
            return cache.get(key)!;
        } else {
            const v = f(...args);
            cache.set(key, v);
            return v;
        }
    };
};

const interpolateColorsLinear = (c1: number[], c2: number[]) => /*memoize(*/(t: number) => {
    const r = c1[0] * (1 - t) + c2[0] * t;
    const g = c1[1] * (1 - t) + c2[1] * t;
    const b = c1[2] * (1 - t) + c2[2] * t;
    return [r, g, b];
};//, t => t); // yeah I guess this is good enough

const interpolateColorsGammaCorrected = (c1: number[], c2: number[]) => {
    // Convert the RGB values to floats between 0 and 1
    const r1 = c1[0] / 255;
    const g1 = c1[1] / 255;
    const b1 = c1[2] / 255;
    const r2 = c2[0] / 255;
    const g2 = c2[1] / 255;
    const b2 = c2[2] / 255;

    return (t: number) => {
        const r = Math.round(255 * Math.pow(Math.pow(r2, 1/2.2) * t + Math.pow(r1, 1/2.2) * (1 - t), 2.2));
        const g = Math.round(255 * Math.pow(Math.pow(g2, 1/2.2) * t + Math.pow(g1, 1/2.2) * (1 - t), 2.2));
        const b = Math.round(255 * Math.pow(Math.pow(b2, 1/2.2) * t + Math.pow(b1, 1/2.2) * (1 - t), 2.2));
      
        return [r, g, b];
    };
};

const useGammaCorrection = false;
const interpolateColors = useGammaCorrection ? interpolateColorsGammaCorrected : interpolateColorsLinear;

const intNormal = interpolateColors([29, 29, 38], [44, 44, 59]);
let interpolate = intNormal;

addStateListener(({ funMode, shaderColors }) => {
    interpolate = funMode ? interpolateColors(...shaderColors) : intNormal;
}, ["funMode", "shaderColors"]);

// track mouse coords
let mouseX = 0.5;
let mouseY = 0.5;
document.addEventListener("mousemove", e => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

let frame = 0;
function render(shader: Shader, t: number) {
    // we can't make the resolution too big, so we're going to fix the largest dimension to 100 then scale/round the other dim
    let w, h;
    if (window.innerWidth > window.innerHeight) {
        w = 100;
        h = Math.round(window.innerHeight / window.innerWidth * 100);
    } else {
        h = 100;
        w = Math.round(window.innerWidth / window.innerHeight * 100);
    }
    if(!(canvas.width === w && canvas.height === h)) {
        canvas.width = w;
        canvas.height = h;
    }

    // we're going to create an ImageData to render it to, then draw that to the canvas
    
    const id = new ImageData(w, h);
    const data = id.data;

    // iterate over each pixel and apply shader
    for (let p = 0; p < data.length; p += 4) {
        const q = p / 4;
        const x = q % w;
        const y = Math.floor(q / w); 
        const nx = x / w;
        const ny = y / h;

        const s = shader(nx, ny, mouseX, mouseY, x, y, frame, t);
        const c = interpolate(s);

        data[p] = c[0];
        data[p + 1] = c[1];
        data[p + 2] = c[2];
        data[p + 3] = 255;
    }

    ctx.putImageData(id, 0, 0);
    frame++;
    const s = getState();
    requestAnimationFrame(t => render(shader, t / 1000 * (s.funMode ? s.animationSpeed : 1)));
};

if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render(shader, 0);
}

export {};