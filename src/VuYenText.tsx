import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/montserrat.css';
import './fonts/fonts.css';
import {seg} from './lib';

export const VY_FPS = 30;
export const VY_W = 1080;
export const VY_H = 1920;
export const VY_DURATION = Math.round(62.6 * VY_FPS);

/** Reference video is 576x1024. All coordinates below are measured in that space, then scaled to 1080x1920. */
const K = 1080 / 576;

const SANS = "'Montserrat', 'Be Vietnam Pro', sans-serif";
const SCRIPT = "'Great Vibes', cursive";

const C = {
	red: '#A30B1B',
	white: '#FFFFFF',
	dkGreen: '#2B3D24',
	midGreen: '#4F7633',
	ink: '#131C1A',
	olive: '#5F7A45',
	slate: '#242626',
	endInk: '#272D0A',
	endGreen: '#46661A',
};

type Line = {
	t: string; // text to render
	fit: string; // sample string from the reference video
	fw: number; // width of that sample in the reference (576 space)
	w: number; // font weight
	color: string;
	x: number;
	a: 'l' | 'c' | 'r';
	y: number;
	in: number;
	dur?: number;
	out: number;
	op?: number;
	script?: boolean;
	shadow?: boolean;
	toColor?: {at: number; color: string};
};

const SH = '0 1px 5px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.35)';

export const LINES: Line[] = [
	// [00:02–03:30] ở NAM LONG → ở VINHOMES VŨ YÊN (red, left, lower third)
	{t: 'ở VINHOMES VŨ YÊN,', fit: 'ở NAM LONG,', fw: 153, w: 700, color: C.red, x: 265, a: 'l', y: 783, in: 1.0, dur: 0.9, out: 3.35},
	{t: 'tui hay nghe nói câu này', fit: 'tui hay nghe nói câu này', fw: 226, w: 600, color: C.red, x: 282, a: 'l', y: 808, in: 1.8, dur: 0.8, out: 3.35},
	// [03:30–05:30]
	{t: '“GIÁ TRỊ THỰC”', fit: '“GIÁ TRỊ THỰC”', fw: 163, w: 700, color: C.white, x: 288, a: 'c', y: 331, in: 3.0, dur: 0.5, out: 4.9, shadow: true},
	{t: 'Nhưng mà giá trị thật là gì ?', fit: 'Nhưng mà giá trị thật là gì ?', fw: 162, w: 600, color: C.white, x: 214, a: 'l', y: 352, in: 3.5, dur: 0.6, out: 4.9, shadow: true},
	{t: 'Đi kiếm', fit: 'Đi kiếm', fw: 81, w: 700, color: C.white, x: 345, a: 'c', y: 661, in: 5.3, dur: 0.4, out: 6.1, shadow: true},
	// [06:30–07:40]
	{t: '“LÀ MỘT CĂN NHÀ ĐẸP”', fit: '“LÀ MỘT CĂN NHÀ ĐẸP”', fw: 292, w: 700, color: C.white, x: 286, a: 'c', y: 877, in: 6.3, dur: 0.8, out: 7.5, shadow: true},
	// [12:00–13:00] / [13:30]
	{t: 'Uhm, cái này đúng', fit: 'Uhm, cái này đúng', fw: 178, w: 600, color: C.white, x: 296, a: 'c', y: 302, in: 11.8, dur: 0.7, out: 13.2, shadow: true},
	{t: 'Nhưng mà chưa đủ…', fit: 'Nhưng mà chưa đủ…', fw: 178, w: 600, color: C.white, x: 149, a: 'l', y: 674, in: 13.25, dur: 0.6, out: 13.95, shadow: true},
	// [17:50–19:50] KHOẢNG XANH block (greens, mixed alignment)
	{t: '“KHOẢNG', fit: '“KHOẢNG', fw: 131, w: 700, color: C.dkGreen, x: 342, a: 'r', y: 255, in: 17.8, dur: 0.6, out: 19.9},
	{t: 'XANH”', fit: 'XANH”', fw: 92, w: 700, color: C.dkGreen, x: 342, a: 'r', y: 287, in: 18.0, dur: 0.5, out: 19.9},
	{t: 'Thành phố càng đông', fit: 'Thành phố càng đông', fw: 220, w: 600, color: C.midGreen, x: 215, a: 'l', y: 317, in: 18.3, dur: 0.8, out: 19.9},
	{t: 'Càng đáng quý', fit: 'Càng đáng quý', fw: 154, w: 600, color: C.ink, x: 211, a: 'l', y: 341, in: 18.9, dur: 0.7, out: 19.9},
	// [27:20–28:50]
	{t: 'Mà là cách', fit: 'Mà là cách', fw: 110, w: 600, color: C.white, x: 490, a: 'r', y: 180, in: 27.2, dur: 0.5, out: 28.95, shadow: true},
	{t: '“NGƯỜI TA SỐNG TRONG ĐÓ”', fit: '“NGƯỜI TA SỐNG TRONG ĐÓ”', fw: 270, w: 700, color: C.white, x: 486, a: 'r', y: 202, in: 27.8, dur: 1.0, out: 28.95, shadow: true},
	// [29:30] / [31:00]
	{t: '“CÓ NGƯỜI MUA CĂN NHÀ ĐẦU TIÊN”', fit: '“CÓ NGƯỜI MUA CĂN NHÀ ĐẦU TIÊN”', fw: 230, w: 600, color: C.white, x: 277, a: 'c', y: 168, in: 29.3, dur: 0.9, out: 30.4, op: 0.9, shadow: true},
	{t: '“CÓ ĐỨA TRẺ LỚN LÊN Ở ĐÂY”', fit: '“CÓ ĐỨA TRẺ LỚN LÊN Ở ĐÂY”', fw: 212, w: 500, color: C.white, x: 308, a: 'c', y: 802, in: 30.8, dur: 0.9, out: 31.95, op: 0.85, shadow: true},
	// [32:30–35:30] triptych: top-left text, bottom text
	{t: 'CÓ NGƯỜI CHỌN NƠI NÀY', fit: 'CÓ NGƯỜI CHỌN NƠI NÀY', fw: 158, w: 700, color: C.white, x: 190, a: 'l', y: 151, in: 32.3, dur: 0.8, out: 35.3, shadow: true},
	{t: 'ĐỂ SỐNG NHỮNG NĂM THÁNG', fit: 'ĐỂ SỐNG NHỮNG NĂM THÁNG', fw: 194, w: 700, color: C.white, x: 190, a: 'l', y: 166, in: 33.0, dur: 0.9, out: 35.3, shadow: true},
	{t: 'THẬT BÌNH YÊN', fit: 'THẬT BÌNH YÊN', fw: 102, w: 700, color: C.white, x: 286, a: 'c', y: 839, in: 33.95, dur: 0.9, out: 35.4, shadow: true},
	// [35:50–39:20]
	{t: 'Phải sống đủ lâu', fit: 'Phải sống đủ lâu', fw: 144, w: 600, color: C.white, x: 288, a: 'c', y: 556, in: 35.8, dur: 0.8, out: 39.3, shadow: true},
	{t: 'MÌNH MỚI BIẾT ĐƯỢC', fit: 'MÌNH MỚI BIẾT ĐƯỢC', fw: 180, w: 700, color: C.white, x: 287, a: 'c', y: 869, in: 36.7, dur: 0.8, out: 39.3, shadow: true},
	{t: 'TỐT hay KHÔNG ?', fit: 'TỐT hay KHÔNG ?', fw: 163, w: 600, color: C.white, x: 288, a: 'c', y: 190, in: 37.8, dur: 0.7, out: 39.3, shadow: true},
	// [40:20–43:50]
	{t: '“GIÁ TRỊ THỰC”', fit: '“GIÁ TRỊ THỰC”', fw: 138, w: 700, color: C.white, x: 110, a: 'l', y: 120, in: 40.4, dur: 0.5, out: 43.9, shadow: true},
	{t: 'Không nằm ở những gì chủ đầu tư nói', fit: 'Không nằm ở những gì chủ đầu tư nói', fw: 172, w: 500, color: C.white, x: 169, a: 'l', y: 139, in: 40.9, dur: 0.9, out: 43.9, shadow: true},
	{t: 'về nơi mình xây”', fit: 'về nơi mình xây”', fw: 119, w: 500, color: C.white, x: 169, a: 'l', y: 156, in: 41.7, dur: 0.6, out: 43.9, shadow: true},
	// [43:50–45:50]
	{t: '“ở tại nơi đó', fit: '“ở tại nơi đó', fw: 82, w: 500, color: C.white, x: 62, a: 'l', y: 646, in: 43.8, dur: 0.5, out: 45.85, shadow: true},
	{t: 'CUỘC SỐNG CỦA CON NGƯỜI”', fit: 'CUỘC SỐNG CỦA CON NGƯỜI”', fw: 203, w: 700, color: C.white, x: 62, a: 'l', y: 660, in: 44.1, dur: 0.9, out: 45.85, shadow: true},
	// [49:50–51:30]
	{t: '“TRỞ THÀNH NHÀ”', fit: '“TRỞ THÀNH NHÀ”', fw: 230, w: 700, color: C.white, x: 287, a: 'c', y: 685, in: 49.8, dur: 0.9, out: 51.45, shadow: true},
	// [54:30–56:30]
	{t: '“không phải', fit: '“không phải', fw: 97, w: 500, color: C.olive, x: 84, a: 'l', y: 165, in: 54.4, dur: 0.5, out: 56.45},
	{t: 'MÌNH ĐÃ XÂY ĐƯỢC BAO NHIÊU”', fit: 'MÌNH ĐÃ XÂY ĐƯỢC BAO NHIÊU”', fw: 325, w: 700, color: C.slate, x: 125, a: 'l', y: 191, in: 54.9, dur: 1.1, out: 56.45},
	// [57:20–62:00] closing lines (green-panel colours)
	{t: '“CÓ BAO NHIÊU CUỘC SỐNG', fit: '“CÓ BAO NHIÊU CUỘC SỐNG', fw: 238, w: 700, color: C.endInk, x: 281, a: 'c', y: 447, in: 57.2, dur: 0.9, out: 62.0},
	{t: 'đã được lớn lên”', fit: 'đã được lớn lên”', fw: 152, w: 700, color: C.endGreen, x: 286, a: 'c', y: 475, in: 58.2, dur: 0.8, out: 62.0, toColor: {at: 59.1, color: C.endInk}},
	{t: 'CÙNG NHỮNG NƠI MÌNH XÂY”', fit: 'CÙNG NHỮNG NƠI MÌNH XÂY”', fw: 265, w: 700, color: C.endGreen, x: 285, a: 'c', y: 500, in: 59.1, dur: 1.0, out: 62.0},
	{t: 'Giá trị thật :', fit: 'Giá trị thật :', fw: 100, w: 700, color: C.endInk, x: 287, a: 'c', y: 391, in: 60.2, dur: 0.6, out: 62.0},
	{t: 'Chuyện kể từ Vinhomes Vũ Yên', fit: 'Chuyên kể từ Mizuki Park', fw: 391, w: 400, color: C.white, x: 285, a: 'c', y: 162, in: 59.0, dur: 1.5, out: 62.0, script: true, shadow: true},
];

let ctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, family: string, weight: number) => {
	if (!ctx) ctx = document.createElement('canvas').getContext('2d')!;
	ctx.font = `${weight} 100px ${family}`;
	return ctx.measureText(text).width;
};

const mix = (a: string, b: string, k: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const x = p(a);
	const y = p(b);
	return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`;
};

const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

const LineView: React.FC<{l: Line; t: number}> = ({l, t}) => {
	if (t < l.in - 0.05 || t > l.out + 0.4) return null;
	const family = l.script ? SCRIPT : SANS;
	const fs = (100 * l.fw) / measure(l.fit, family, l.w);
	const n = Array.from(l.t).length;
	const dur = l.dur ?? Math.max(0.4, n * 0.045);
	const p = seg(t, l.in, l.in + dur, lin); // write-on progress
	const fadeIn = seg(t, l.in, l.in + 0.18, lin);
	const fadeOut = 1 - seg(t, l.out, l.out + 0.35, lin);
	const edge = p * 112 - 6; // %
	const mask = `linear-gradient(90deg, #000 ${edge - 7}%, transparent ${edge + 3}%)`;
	const color = l.toColor ? mix(l.color, l.toColor.color, seg(t, l.toColor.at, l.toColor.at + 0.5, lin)) : l.color;
	const style: React.CSSProperties = {
		position: 'absolute',
		top: l.y,
		whiteSpace: 'nowrap',
		fontFamily: family,
		fontWeight: l.w,
		fontSize: fs,
		lineHeight: 1.3,
		fontFeatureSettings: '"lnum" 1',
		color,
		textShadow: l.shadow ? SH : undefined,
		padding: `0 ${fs * 0.2}px`,
		opacity: fadeIn * fadeOut * (l.op ?? 1),
		WebkitMaskImage: p < 1 ? mask : undefined,
		maskImage: p < 1 ? mask : undefined,
		transform: `translateY(calc(-50% + ${(1 - soft(Math.min(1, p * 1.6))) * 4}px))${l.a === 'c' ? ' translateX(-50%)' : ''}`,
	};
	if (l.a === 'l') style.left = l.x - fs * 0.2;
	else if (l.a === 'r') style.right = 576 - l.x - fs * 0.2;
	else style.left = l.x;
	return <div style={style}>{l.t}</div>;
};

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([
			document.fonts.load("500 20px 'Montserrat'", 'ÀỞỮ…“”'),
			document.fonts.load("600 20px 'Montserrat'", 'ÀỞỮ…“”'),
			document.fonts.load("700 20px 'Montserrat'", 'ÀỞỮ…“”'),
			document.fonts.load("400 20px 'Great Vibes'", 'Chuyện kể từ'),
		]).then(() => continueRender(h));
	}, [h]);
};

export const VuYenText: React.FC = () => {
	useFonts();
	const frame = useCurrentFrame();
	const t = frame / VY_FPS;
	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: 576, height: 1024, transform: `scale(${K})`, transformOrigin: '0 0'}}>
				{LINES.map((l, i) => (
					<LineView key={i} l={l} t={t} />
				))}
			</div>
		</AbsoluteFill>
	);
};
