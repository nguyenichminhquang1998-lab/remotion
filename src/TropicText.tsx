import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/montserrat.css';
import {lerp, seg} from './lib';

export const TT_FPS = 30;
export const TT_W = 1080;
export const TT_H = 1920;

type Kind = 'lead' | 'accent' | 'white';
export type TLine = {t: string; k: Kind; ax?: 'l' | 'c' | 'r'; size?: number; delay?: number};
export type TBeat = {in: number; out: number; y?: number; lines: TLine[]};
export type TropicProps = {beats: TBeat[]; variant?: 'blue' | 'gold'};

const FAM = "'Montserrat', 'Be Vietnam Pro', sans-serif";
const MAXW = 940;
const GAP = 16;

const GRAD = {
	// brand blue (same family as the Royal Island key visuals) / champagne gold
	blue: {g: 'linear-gradient(180deg,#5AA2FF 0%,#2A66D9 48%,#123C9C 100%)', glow: 'rgba(255,255,255,0.85)', edge: 'rgba(255,255,255,0.55)'},
	gold: {g: 'linear-gradient(180deg,#FFF1C2 0%,#E3C06C 50%,#B38A35 100%)', glow: 'rgba(70,40,0,0.55)', edge: 'rgba(60,35,0,0.35)'},
};

const DEFAULT_SIZE: Record<Kind, number> = {accent: 150, lead: 46, white: 70};
const WEIGHT: Record<Kind, number> = {accent: 800, lead: 300, white: 700};

const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([300, 500, 700, 800].map((w) => document.fonts.load(`${w} 40px Montserrat`, 'ÀỞỮ…ỳđ'))).then(() => continueRender(h));
	}, [h]);
};

const BeatView: React.FC<{b: TBeat; t: number; variant: 'blue' | 'gold'}> = ({b, t, variant}) => {
	const refs = React.useRef<(HTMLSpanElement | null)[]>([]);
	// shrink any line that is wider than the safe area (measured on the real, painted element)
	React.useLayoutEffect(() => {
		b.lines.forEach((l, i) => {
			const el = refs.current[i];
			if (!el) return;
			const size = l.size ?? DEFAULT_SIZE[l.k];
			el.style.fontSize = `${size}px`;
			const w = el.offsetWidth;
			if (w > MAXW) el.style.fontSize = `${(size * MAXW) / w}px`;
		});
	});
	if (t < b.in - 0.05 || t > b.out + 0.5) return null;
	const P = GRAD[variant];
	const out = seg(t, b.out, b.out + 0.4, lin);
	return (
		<div style={{position: 'absolute', left: 70, width: MAXW, top: b.y ?? 840, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: GAP}}>
			{b.lines.map((l, i) => {
				const at = b.in + (l.delay ?? i * 0.32);
				const p = seg(t, at, at + 0.7, lin);
				const e = soft(p);
				const isAccent = l.k === 'accent';
				const sheen = isAccent ? seg(t, at + 0.5, at + 1.5, lin) : 2;
				const sh = lerp(-30, 130, sheen);
				const sheenImg = isAccent && sheen > 0 && sheen < 1 ? `linear-gradient(105deg, rgba(255,255,255,0) ${sh - 14}%, rgba(255,255,255,0.85) ${sh}%, rgba(255,255,255,0) ${sh + 14}%), ` : '';
				const wrap: React.CSSProperties = {
					alignSelf: l.ax === 'l' ? 'flex-start' : l.ax === 'r' ? 'flex-end' : 'center',
					opacity: Math.min(1, p * 2.2) * (1 - out),
					transform: `translateY(${lerp(34, 0, e) - out * 18}px) scale(${lerp(0.93, 1, e)})`,
					transformOrigin: l.ax === 'r' ? '100% 50%' : l.ax === 'l' ? '0% 50%' : '50% 50%',
					filter: p < 1 || out > 0.01 ? `blur(${lerp(10, 0, e) + out * 6}px)` : undefined,
				};
				const inner: React.CSSProperties = {
					display: 'inline-block',
					whiteSpace: 'nowrap',
					fontFamily: FAM,
					fontWeight: WEIGHT[l.k],
					fontSize: l.size ?? DEFAULT_SIZE[l.k],
					lineHeight: 1.18,
					padding: '0.06em 0.1em',
					letterSpacing: isAccent ? '-0.01em' : l.k === 'lead' ? '0.02em' : '0',
				};
				if (isAccent) {
					Object.assign(inner, {
						backgroundImage: sheenImg + P.g,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						color: 'transparent',
						filter: `drop-shadow(0 0 1.2px ${P.edge}) drop-shadow(0 4px 14px ${P.glow})`,
					});
				} else if (l.k === 'white') {
					Object.assign(inner, {color: '#fff', textShadow: '0 6px 18px rgba(0,0,0,0.38), 0 1px 2px rgba(0,0,0,0.3)'});
				} else {
					Object.assign(inner, {color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 10px rgba(0,0,0,0.35)'});
				}
				return (
					<div key={i} style={wrap}>
						<span ref={(el) => {refs.current[i] = el;}} style={inner}>
							{l.t}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export const TropicText: React.FC<TropicProps> = ({beats, variant = 'blue'}) => {
	useFonts();
	const t = useCurrentFrame() / TT_FPS;
	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			{beats.map((b, i) => (
				<BeatView key={i} b={b} t={t} variant={variant} />
			))}
		</AbsoluteFill>
	);
};

export const SCENES: Record<string, {dur: number; beats: TBeat[]}> = {
	'01-dep-la-dieu': {
		dur: 6.2,
		beats: [
			{in: 0.4, out: 5.4, lines: [
				{t: 'Đẹp', k: 'accent', ax: 'c', size: 200},
				{t: 'là điều', k: 'lead', ax: 'r', delay: 0.5},
				{t: 'ai cũng', k: 'white', ax: 'l', size: 62, delay: 1.0},
				{t: 'có thể', k: 'white', ax: 'c', size: 74, delay: 1.35},
				{t: 'nhìn thấy', k: 'white', ax: 'r', size: 112, delay: 1.7},
			]},
		],
	},
	'02-chuan-song': {
		dur: 8.6,
		beats: [
			{in: 0.3, out: 3.2, lines: [
				{t: 'nhưng', k: 'lead', ax: 'l'},
				{t: 'chuẩn sống', k: 'accent', ax: 'c', size: 160, delay: 0.3},
				{t: 'mới là điều', k: 'lead', ax: 'r', delay: 1.1},
			]},
			{in: 3.6, out: 7.8, lines: [
				{t: 'bạn', k: 'lead', ax: 'l'},
				{t: 'cảm nhận', k: 'accent', ax: 'c', size: 170, delay: 0.3},
				{t: 'thấy mỗi ngày', k: 'lead', ax: 'r', delay: 1.1},
			]},
		],
	},
	'03-kien-tao-boi': {
		dur: 7.0,
		beats: [
			{in: 0.3, out: 6.2, lines: [
				{t: 'được kiến tạo bởi', k: 'lead', ax: 'c'},
				{t: 'Vinhomes', k: 'accent', ax: 'c', size: 170, delay: 0.35},
				{t: 'và', k: 'lead', ax: 'c', delay: 1.3},
				{t: 'Nomura Real Estate', k: 'accent', ax: 'c', size: 110, delay: 1.6},
			]},
		],
	},
	'04-the-tropic': {
		dur: 13.2,
		beats: [
			{in: 0.3, out: 4.2, lines: [
				{t: 'The Tropic', k: 'accent', ax: 'c', size: 170},
				{t: 'nơi chuẩn sống', k: 'lead', ax: 'r', delay: 0.9},
				{t: 'quốc tế', k: 'accent', ax: 'c', size: 130, delay: 1.3},
			]},
			{in: 4.6, out: 8.5, lines: [
				{t: 'giao hòa cùng', k: 'lead', ax: 'l'},
				{t: 'kiến trúc nhiệt đới', k: 'accent', ax: 'c', size: 120, delay: 0.4},
				{t: 'hiện đại', k: 'accent', ax: 'c', size: 140, delay: 1.0},
			]},
			{in: 8.9, out: 12.5, lines: [
				{t: 'kiến tạo một', k: 'lead', ax: 'l'},
				{t: 'không gian sống', k: 'accent', ax: 'c', size: 130, delay: 0.4},
				{t: 'khác biệt', k: 'accent', ax: 'c', size: 150, delay: 1.0},
			]},
		],
	},
	'05-gia-tri-ben-vung': {
		dur: 9.0,
		beats: [
			{in: 0.3, out: 3.7, lines: [
				{t: 'và giá trị', k: 'lead', ax: 'l'},
				{t: 'bền vững', k: 'accent', ax: 'c', size: 180, delay: 0.35},
			]},
			{in: 4.1, out: 8.3, lines: [
				{t: 'được bảo chứng bởi', k: 'lead', ax: 'l'},
				{t: 'nền tảng pháp lý', k: 'accent', ax: 'c', size: 120, delay: 0.4},
				{t: 'minh bạch', k: 'accent', ax: 'c', size: 150, delay: 1.0},
			]},
		],
	},
	'06-noi-thoi-gian': {
		dur: 7.2,
		beats: [
			{in: 0.3, out: 6.4, lines: [
				{t: 'The Tropic', k: 'accent', ax: 'c', size: 180},
				{t: 'nơi thời gian', k: 'lead', ax: 'r', delay: 0.9},
				{t: 'làm nên giá trị', k: 'accent', ax: 'c', size: 130, delay: 1.3},
			]},
		],
	},
};
