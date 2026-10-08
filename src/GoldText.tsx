import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/montserrat.css';
import './fonts/inter-playfair.css';
import {lerp, seg} from './lib';

export const GT_FPS = 30;
export const GT_W = 1080;
export const GT_H = 1920;
/** Reference video is 576x1024; coordinates below are in that space. */
const K = 1080 / 576;

const INTER = "'Inter', 'Be Vietnam Pro', sans-serif";
const MONT = "'Montserrat', 'Be Vietnam Pro', sans-serif";
const PLAY = "'Playfair Display', Georgia, serif";

// Vinhomes Vu Yen gold
const LIGHT = '#F6E6B4'; // thin / light lines
const BOLD = 'linear-gradient(180deg,#FFF4CF 0%,#F0D27F 45%,#C99B3E 100%)';
const DEEP = 'linear-gradient(180deg,#FFE9A0 0%,#E9BE55 50%,#B8862A 100%)';

type Wipe = {a: number; b: number}; // write-on window (left → right)
type Fade = {a: number; b: number; blur?: number; scale?: number};

export type GLine = {
	t: string;
	font: 'inter' | 'mont' | 'play';
	w: number; // weight
	italic?: boolean;
	fw: number; // target width in the reference (576 space)
	x: number; // left or centre x
	ax: 'l' | 'c';
	y: number; // centre y
	fill: 'light' | 'bold' | 'deep';
	in: Wipe | Fade;
	kind: 'wipe' | 'fade';
	sheen?: Wipe;
	out: {a: number; b: number; blur?: number};
};

export type GoldProps = {lines: GLine[]};

let ctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, family: string, weight: number, italic?: boolean) => {
	if (!ctx) ctx = document.createElement('canvas').getContext('2d')!;
	ctx.font = `${italic ? 'italic ' : ''}${weight} 100px ${family}`;
	return ctx.measureText(text).width;
};
const FAMS = {inter: INTER, mont: MONT, play: PLAY};

const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([
			document.fonts.load("300 40px 'Inter'", 'ÀỞỮ'),
			document.fonts.load("400 40px 'Inter'", 'ÀỞỮ'),
			document.fonts.load("700 40px 'Inter'", 'ÀỞỮ'),
			document.fonts.load("700 40px 'Montserrat'", 'ÀỞỮ'),
			document.fonts.load("italic 600 40px 'Playfair Display'", 'Welcome'),
			document.fonts.load("italic 800 40px 'Playfair Display'", 'Le Thuy'),
			document.fonts.load("italic 400 40px 'Playfair Display'", 'design'),
		]).then(() => continueRender(h));
	}, [h]);
};

const LineView: React.FC<{l: GLine; t: number}> = ({l, t}) => {
	const family = FAMS[l.font];
	const fs = (100 * l.fw) / measure(l.t, family, l.w, l.italic);
	const pIn = seg(t, l.in.a, l.in.b, lin);
	if (pIn <= 0 || t > l.out.b + 0.05) return null;
	const pOut = seg(t, l.out.a, l.out.b, lin);
	const e = soft(pIn);
	let mask: string | undefined;
	let blur = 0;
	let scale = 1;
	let opacity = 1;
	if (l.kind === 'wipe') {
		const edge = pIn * 118 - 8;
		if (pIn < 1) mask = `linear-gradient(90deg, #000 ${edge - 12}%, transparent ${edge + 4}%)`;
		opacity = Math.min(1, pIn * 6);
	} else {
		const f = l.in as Fade;
		opacity = e;
		blur = lerp(f.blur ?? 0, 0, e);
		scale = lerp(f.scale ?? 1, 1, e);
	}
	opacity *= 1 - pOut;
	blur += (l.out.blur ?? 0) * pOut;
	const sheenP = l.sheen ? seg(t, l.sheen.a, l.sheen.b, lin) : 2;
	const sp = lerp(-30, 130, sheenP);
	const sheenImg = sheenP > 0 && sheenP < 1 ? `linear-gradient(105deg, rgba(255,255,255,0) ${sp - 12}%, rgba(255,255,255,0.95) ${sp}%, rgba(255,255,255,0) ${sp + 12}%), ` : '';
	const inner: React.CSSProperties = {display: 'inline-block', padding: '0.12em 0.16em', margin: '-0.12em -0.16em', whiteSpace: 'nowrap'};
	if (l.fill === 'light') {
		Object.assign(inner, {color: LIGHT, textShadow: '0 2px 12px rgba(30,18,0,0.5), 0 0 18px rgba(255,226,140,0.35)'});
	} else {
		Object.assign(inner, {
			backgroundImage: sheenImg + (l.fill === 'deep' ? DEEP : BOLD),
			WebkitBackgroundClip: 'text',
			backgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			color: 'transparent',
			filter: 'drop-shadow(0 3px 10px rgba(30,18,0,0.55)) drop-shadow(0 0 14px rgba(255,220,120,0.35))',
		});
	}
	const style: React.CSSProperties = {
		position: 'absolute',
		top: l.y,
		fontFamily: family,
		fontWeight: l.w,
		fontStyle: l.italic ? 'italic' : 'normal',
		fontSize: fs,
		lineHeight: 1.2,
		letterSpacing: l.font === 'mont' ? '0.01em' : '0',
		fontFeatureSettings: '"lnum" 1',
		opacity,
		WebkitMaskImage: mask,
		maskImage: mask,
		filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
		transform: `translateY(-50%)${l.ax === 'c' ? ' translateX(-50%)' : ''} scale(${scale})`,
		transformOrigin: l.ax === 'c' ? '50% 50%' : '0% 50%',
	};
	if (l.ax === 'l') style.left = l.x;
	else style.left = l.x;
	return (
		<div style={style}>
			<span style={inner}>{l.t}</span>
		</div>
	);
};

export const GoldText: React.FC<GoldProps> = ({lines}) => {
	useFonts();
	const t = useCurrentFrame() / GT_FPS;
	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 576, height: 1024, transform: `scale(${K})`, transformOrigin: '0 0'}}>
				{lines.map((l, i) => (
					<LineView key={i} l={l} t={t} />
				))}
			</div>
		</AbsoluteFill>
	);
};

// ---- Clips (times in seconds, in the reference video's own timeline; each comp starts at `from`) ----
export type Clip = {id: string; from: number; to: number; lines: GLine[]};
const w = (a: number, b: number): Wipe => ({a, b});

export const CLIPS: Clip[] = [
	{
		id: 'G1', from: 7.6, to: 9.6,
		lines: [
			{t: 'Thiết kế', font: 'inter', w: 300, fw: 195, x: 114, ax: 'l', y: 255, fill: 'light', kind: 'fade', in: {a: 7.85, b: 8.2, scale: 0.9, blur: 4}, out: {a: 9.3, b: 9.4}},
			{t: 'TỐI GIẢN', font: 'mont', w: 700, fw: 354, x: 111, ax: 'l', y: 336, fill: 'bold', kind: 'wipe', in: w(8.25, 8.65), out: {a: 9.3, b: 9.4}},
		],
	},
	{
		id: 'G2', from: 13.0, to: 17.4,
		lines: [
			{t: 'Không gian', font: 'inter', w: 400, fw: 276, x: 288, ax: 'c', y: 120, fill: 'light', kind: 'fade', in: {a: 13.25, b: 13.6, blur: 5}, out: {a: 16.7, b: 17.1, blur: 6}},
			{t: 'Sang trọng', font: 'inter', w: 700, fw: 438, x: 285, ax: 'c', y: 192, fill: 'bold', kind: 'wipe', in: w(13.45, 13.9), out: {a: 16.7, b: 17.1, blur: 6}},
		],
	},
	{
		id: 'G3', from: 17.6, to: 21.1,
		lines: [
			{t: 'Kết nối', font: 'inter', w: 300, fw: 150, x: 280, ax: 'c', y: 225, fill: 'light', kind: 'fade', in: {a: 17.7, b: 18.0, blur: 4}, out: {a: 20.82, b: 20.9}},
			{t: 'KHÔNG GIAN', font: 'mont', w: 700, fw: 432, x: 285, ax: 'c', y: 291, fill: 'bold', kind: 'wipe', in: w(18.0, 18.4), out: {a: 20.82, b: 20.9}},
		],
	},
	{
		id: 'G4', from: 26.4, to: 29.0,
		lines: [
			{t: 'Welcome to', font: 'play', w: 600, italic: true, fw: 234, x: 96, ax: 'l', y: 261, fill: 'light', kind: 'wipe', in: w(26.55, 27.0), out: {a: 28.4, b: 28.8, blur: 4}},
			{t: 'Le Thuy', font: 'play', w: 800, italic: true, fw: 264, x: 171, ax: 'l', y: 324, fill: 'deep', kind: 'wipe', in: w(26.8, 27.2), sheen: w(27.1, 27.7), out: {a: 28.4, b: 28.8, blur: 4}},
			{t: 'design', font: 'play', w: 400, italic: true, fw: 100, x: 330, ax: 'l', y: 392, fill: 'light', kind: 'fade', in: {a: 27.2, b: 27.5, blur: 3}, out: {a: 28.4, b: 28.8, blur: 4}},
		],
	},
];
