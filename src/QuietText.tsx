import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/ebgaramond.css';
import {lerp, seg} from './lib';

export const QT_FPS = 30;
export const QT_W = 1080;
export const QT_H = 1920;
export const QT_DURATION = Math.round(27.8 * QT_FPS);

type Motion = 'blur' | 'rise' | 'wipe' | 'slideL' | 'slideR' | 'zoom' | 'words' | 'drift';
type L = {t: string; size: number; italic?: boolean; ax: 'l' | 'c' | 'r'; y: number; m: Motion; d?: number; track?: number};
type Seg = {in: number; out: number; lines: L[]; orn?: number /* y of ornament */};

const FAM = "'EB Garamond', 'Cormorant Garamond', Georgia, serif";
const MX = 100; // side margin
const MAXW = 880;
const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

// Timings come from the word-level transcript of the customer voice.
const SEGS: Seg[] = [
	{in: 0.55, out: 2.45, orn: 930, lines: [
		{t: 'Quiet', size: 150, italic: true, ax: 'c', y: 640, m: 'blur'},
		{t: 'Luxury.', size: 200, ax: 'c', y: 790, m: 'rise', d: 0.3, track: 0.04},
	]},
	{in: 2.6, out: 4.75, lines: [
		{t: 'Nơi vẻ đẹp', size: 64, ax: 'l', y: 560, m: 'slideL'},
		{t: 'không cần lên tiếng.', size: 108, italic: true, ax: 'r', y: 700, m: 'wipe', d: 0.55},
	]},
	{in: 5.15, out: 8.1, orn: 1000, lines: [
		{t: 'Một căn nhà mang phong cách', size: 54, ax: 'c', y: 600, m: 'rise'},
		{t: 'tropical', size: 120, italic: true, ax: 'c', y: 735, m: 'zoom', d: 1.35},
		{t: 'luxury,', size: 168, ax: 'c', y: 880, m: 'zoom', d: 1.7},
	]},
	{in: 8.25, out: 10.1, lines: [
		{t: 'hòa quyện giữa', size: 58, italic: true, ax: 'l', y: 900, m: 'slideL'},
		{t: 'thiên nhiên', size: 138, ax: 'l', y: 1020, m: 'wipe', d: 0.3},
		{t: 'xanh mát,', size: 96, italic: true, ax: 'r', y: 1150, m: 'slideR', d: 0.9},
	]},
	{in: 10.45, out: 13.0, lines: [
		{t: 'đường nét tinh tế', size: 112, ax: 'l', y: 470, m: 'slideR'},
		{t: 'và chất liệu', size: 62, italic: true, ax: 'r', y: 590, m: 'slideL', d: 0.9},
		{t: 'cao cấp.', size: 160, ax: 'r', y: 715, m: 'rise', d: 1.3},
	]},
	{in: 13.5, out: 16.8, orn: 880, lines: [
		{t: 'Sang trọng,', size: 190, ax: 'c', y: 660, m: 'blur'},
		{t: 'riêng tư và đầy thư thái.', size: 66, italic: true, ax: 'c', y: 800, m: 'wipe', d: 1.1},
	]},
	{in: 17.15, out: 19.7, lines: [
		{t: 'Một không gian', size: 58, ax: 'l', y: 610, m: 'rise'},
		{t: 'để tận hưởng', size: 58, italic: true, ax: 'l', y: 685, m: 'rise', d: 0.3},
		{t: 'trọn vẹn', size: 150, ax: 'r', y: 830, m: 'words', d: 0.8},
		{t: 'từng khoảnh khắc.', size: 100, italic: true, ax: 'r', y: 975, m: 'wipe', d: 1.45},
	]},
	{in: 20.7, out: 22.1, lines: [
		{t: 'Một chốn về bình yên,', size: 118, italic: true, ax: 'c', y: 770, m: 'words'},
	]},
	{in: 22.25, out: 25.2, orn: 1010, lines: [
		{t: 'nơi thiên nhiên', size: 100, ax: 'c', y: 560, m: 'zoom'},
		{t: 'và kiến trúc', size: 100, italic: true, ax: 'c', y: 670, m: 'zoom', d: 0.4},
		{t: 'cùng kể một câu chuyện', size: 54, ax: 'c', y: 810, m: 'rise', d: 1.4},
		{t: 'rất riêng', size: 136, italic: true, ax: 'r', y: 920, m: 'wipe', d: 2.0},
	]},
	{in: 25.45, out: 27.5, lines: [
		{t: 'về phong cách', size: 72, ax: 'c', y: 700, m: 'blur'},
		{t: 'sống.', size: 230, italic: true, ax: 'c', y: 880, m: 'drift', d: 0.55},
	]},
];

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([
			document.fonts.load("400 60px 'EB Garamond'", 'ÀỞỮẢẠ'),
			document.fonts.load("italic 400 60px 'EB Garamond'", 'ÀỞỮẢẠ'),
		]).then(() => continueRender(h));
	}, [h]);
};

const Ornament: React.FC<{y: number; p: number}> = ({y, p}) => (
	<svg width="260" height="26" viewBox="0 0 260 26" style={{position: 'absolute', left: 410, top: y, opacity: p, transform: `scaleX(${lerp(0.4, 1, p)})`}}>
		{[0, 1, 2, 3].map((i) => (
			<React.Fragment key={i}>
				<circle cx={20 + i * 14} cy={13} r={i === 3 ? 2.2 : 1.4 + i * 0.2} fill="#fff" opacity={0.6 + i * 0.1} />
				<circle cx={240 - i * 14} cy={13} r={i === 3 ? 2.2 : 1.4 + i * 0.2} fill="#fff" opacity={0.6 + i * 0.1} />
			</React.Fragment>
		))}
		<path d="M130 3 L137 13 L130 23 L123 13 Z" fill="none" stroke="#fff" strokeWidth="1.4" />
		<circle cx={130} cy={13} r={2.2} fill="#fff" />
	</svg>
);

const LineView: React.FC<{l: L; s: Seg; t: number; idx: number; reg: (i: number, el: HTMLSpanElement | null) => void}> = ({l, s, t, idx, reg}) => {
	const at = s.in + (l.d ?? idx * 0.28);
	const dur = l.m === 'wipe' ? 0.9 : l.m === 'words' ? 1.0 : 0.85;
	const p = seg(t, at, at + dur, lin);
	const e = soft(p);
	const out = seg(t, s.out, s.out + (l.m === 'drift' ? 0.6 : 0.4), lin);
	const wrap: React.CSSProperties = {
		position: 'absolute',
		top: l.y,
		transform: 'translateY(-50%)',
		whiteSpace: 'nowrap',
		...(l.ax === 'l' ? {left: MX} : l.ax === 'r' ? {right: MX} : {left: 0, width: QT_W, textAlign: 'center' as const}),
	};
	const inner: React.CSSProperties = {
		display: 'inline-block',
		fontFamily: FAM,
		fontStyle: l.italic ? 'italic' : 'normal',
		fontWeight: 400,
		fontSize: l.size,
		lineHeight: 1.15,
		color: '#fff',
		padding: '0.1em 0.14em',
		margin: '-0.1em -0.14em',
		letterSpacing: `${l.track ?? 0}em`,
		textShadow: '0 2px 16px rgba(0,0,0,0.38), 0 0 2px rgba(0,0,0,0.25)',
	};
	let op = Math.min(1, p * 2.2);
	let tf = '';
	let blur = 0;
	let mask: string | undefined;
	switch (l.m) {
		case 'blur':
			blur = lerp(14, 0, e);
			inner.letterSpacing = `${lerp(0.14, l.track ?? 0.01, e)}em`;
			break;
		case 'rise': {
			// text rises out of an invisible baseline mask
			mask = 'linear-gradient(180deg,#000 0,#000 100%)';
			tf = `translateY(${lerp(60, 0, e)}px)`;
			blur = lerp(5, 0, e);
			break;
		}
		case 'wipe': {
			const edge = p * 118 - 8;
			if (p < 1) mask = `linear-gradient(90deg,#000 ${edge - 14}%,transparent ${edge + 4}%)`;
			op = Math.min(1, p * 6);
			break;
		}
		case 'slideL':
			tf = `translateX(${lerp(-70, 0, e)}px)`;
			blur = lerp(5, 0, e);
			break;
		case 'slideR':
			tf = `translateX(${lerp(70, 0, e)}px)`;
			blur = lerp(5, 0, e);
			break;
		case 'zoom':
			tf = `scale(${lerp(1.12, 1, e)})`;
			blur = lerp(10, 0, e);
			break;
		case 'drift':
			tf = `scale(${lerp(1.1, 1, e) + out * 0.04}) translateY(${lerp(30, 0, e)}px)`;
			blur = lerp(12, 0, e);
			break;
		case 'words':
			break;
	}
	const content =
		l.m === 'words'
			? l.t.split(' ').map((w, i, a) => {
					const pw = soft(seg(t, at + i * 0.22, at + i * 0.22 + 0.6, lin));
					return (
						<span key={i} style={{display: 'inline-block', opacity: pw, transform: `translateY(${lerp(26, 0, pw)}px)`, filter: pw < 1 ? `blur(${lerp(6, 0, pw)}px)` : undefined, marginRight: i < a.length - 1 ? '0.26em' : 0}}>
							{w}
						</span>
					);
			  })
			: l.t;
	return (
		<div style={{...wrap, opacity: op * (1 - out), WebkitMaskImage: l.m === 'wipe' ? mask : undefined, maskImage: l.m === 'wipe' ? mask : undefined}}>
			<div style={{filter: blur + out * 5 > 0.3 ? `blur(${(blur + out * 5).toFixed(2)}px)` : undefined, transform: `${tf} translateY(${-out * 14}px)`}}>
				<span ref={(el) => reg(idx, el)} style={inner}>
					{content}
				</span>
			</div>
		</div>
	);
};

const SegView: React.FC<{s: Seg; t: number}> = ({s, t}) => {
	const refs = React.useRef<(HTMLSpanElement | null)[]>([]);
	React.useLayoutEffect(() => {
		s.lines.forEach((l, i) => {
			const el = refs.current[i];
			if (!el) return;
			el.style.fontSize = `${l.size}px`;
			const w = el.offsetWidth;
			if (w > MAXW) el.style.fontSize = `${(l.size * MAXW) / w}px`;
		});
	});
	if (t < s.in - 0.05 || t > s.out + 0.8) return null;
	const out = seg(t, s.out, s.out + 0.4, lin);
	return (
		<>
			{s.lines.map((l, i) => (
				<LineView key={i} l={l} s={s} t={t} idx={i} reg={(k, el) => {refs.current[k] = el;}} />
			))}
			{s.orn !== undefined && <Ornament y={s.orn} p={soft(seg(t, s.in + 0.9, s.in + 1.6, lin)) * (1 - out)} />}
		</>
	);
};

export const QuietText: React.FC = () => {
	useFonts();
	const t = useCurrentFrame() / QT_FPS;
	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			{SEGS.map((s, i) => (
				<SegView key={i} s={s} t={t} />
			))}
		</AbsoluteFill>
	);
};
