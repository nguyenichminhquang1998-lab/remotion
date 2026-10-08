import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/montserrat.css';
import './fonts/alexbrush.css';
import {lerp, seg} from './lib';
import {SCENES, TBeat, TLine} from './TropicText';

export const TS_FPS = 30;
export const TS_W = 1080;
export const TS_H = 1920;

export type Variant = 'cool' | 'bronze';
const SCRIPT = "'Alex Brush', 'Great Vibes', cursive";
const THIN = "'Montserrat', 'Be Vietnam Pro', sans-serif";
const MAXW = 960;
const GAP = 6;

const PAL = {
	cool: {
		g: 'linear-gradient(180deg,#FFFFFF 0%,#E8ECF2 50%,#B6BFCC 100%)',
		thin: '#EEF2F7',
		outline: 'rgba(8,12,20,0.75)',
		glow: 'rgba(210,225,255,0.45)',
	},
	bronze: {
		g: 'linear-gradient(180deg,#FBE8BC 0%,#DDAE6C 50%,#A87238 100%)',
		thin: '#F3E5CB',
		outline: 'rgba(30,16,4,0.75)',
		glow: 'rgba(255,205,130,0.45)',
	},
};

const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([
			document.fonts.load("400 60px 'Alex Brush'", 'Chuẩn Sống ẳạỡ'),
			document.fonts.load("300 30px 'Montserrat'", 'ÀỞỮ…'),
			document.fonts.load("400 30px 'Montserrat'", 'ÀỞỮ…'),
		]).then(() => continueRender(h));
	}, [h]);
};

const BASE: Record<TLine['k'], number> = {accent: 150, lead: 46, white: 60};

const View: React.FC<{b: TBeat; v: Variant}> = ({b, v}) => {
	const t = useCurrentFrame() / TS_FPS;
	const P = PAL[v];
	const refs = React.useRef<(HTMLSpanElement | null)[]>([]);
	React.useLayoutEffect(() => {
		b.lines.forEach((l, i) => {
			const el = refs.current[i];
			if (!el) return;
			const size = (l.size ?? BASE[l.k]) * (l.k === 'accent' ? 1.22 : l.k === 'white' ? 0.82 : 0.88);
			el.style.fontSize = `${size}px`;
			const w = el.offsetWidth;
			if (w > MAXW) el.style.fontSize = `${(size * MAXW) / w}px`;
		});
	});
	const out = seg(t, b.out, b.out + 0.45, lin);
	return (
		<div style={{position: 'absolute', left: 60, width: MAXW, top: b.y ?? 840, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: GAP}}>
			{b.lines.map((l, i) => {
				const at = b.in + (l.delay ?? i * 0.32);
				const accent = l.k === 'accent';
				const p = seg(t, at, at + (accent ? 1.0 : 0.8), lin);
				const e = soft(p);
				const wrap: React.CSSProperties = {
					alignSelf: l.ax === 'l' ? 'flex-start' : l.ax === 'r' ? 'flex-end' : 'center',
					opacity: (accent ? Math.min(1, p * 5) : e) * (1 - out),
					filter: out > 0.01 ? `blur(${out * 5}px)` : accent ? undefined : p < 1 ? `blur(${lerp(6, 0, e)}px)` : undefined,
					transform: `translateY(${lerp(accent ? 8 : 14, 0, e) - out * 12}px)`,
				};
				if (accent && p < 1) {
					const edge = p * 120 - 8;
					const m = `linear-gradient(90deg, #000 ${edge - 14}%, transparent ${edge + 4}%)`;
					Object.assign(wrap, {WebkitMaskImage: m, maskImage: m});
				}
				const inner: React.CSSProperties = {
					display: 'inline-block',
					whiteSpace: 'nowrap',
					padding: '0.22em 0.3em',
					margin: '-0.22em -0.3em',
					lineHeight: 1.1,
				};
				if (accent) {
					Object.assign(inner, {
						fontFamily: SCRIPT,
						fontWeight: 400,
						backgroundImage: P.g,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						color: 'transparent',
						filter: `drop-shadow(0 0 0.9px ${P.outline}) drop-shadow(0 0 0.9px ${P.outline}) drop-shadow(0 4px 10px rgba(0,0,0,0.45)) drop-shadow(0 0 16px ${P.glow})`,
					});
				} else {
					Object.assign(inner, {
						fontFamily: THIN,
						fontWeight: l.k === 'white' ? 400 : 300,
						color: P.thin,
						letterSpacing: `${lerp(0.3, 0.14, e)}em`,
						textShadow: `0 1px 2px rgba(0,0,0,0.5), 0 3px 12px rgba(0,0,0,0.45)`,
					});
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

export const TropicScript: React.FC<{beat: TBeat; variant: Variant}> = ({beat, variant}) => {
	useFonts();
	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			<View b={beat} v={variant} />
		</AbsoluteFill>
	);
};

export type Clip = {id: string; name: string; beat: TBeat; dur: number};
const NAMES: Record<string, string[]> = {
	'01-dep-la-dieu': ['01-dep-la-dieu'],
	'02-chuan-song': ['02a-chuan-song', '02b-cam-nhan'],
	'03-kien-tao-boi': ['03-kien-tao-boi'],
	'04-the-tropic': ['04a-the-tropic-quoc-te', '04b-kien-truc-nhiet-doi', '04c-khong-gian-khac-biet'],
	'05-gia-tri-ben-vung': ['05a-gia-tri-ben-vung', '05b-phap-ly-minh-bach'],
	'06-noi-thoi-gian': ['06-noi-thoi-gian'],
};
export const CLIPS: Clip[] = [];
Object.entries(NAMES).forEach(([sc, names]) => {
	SCENES[sc].beats.forEach((b, i) => {
		const shift = b.in - 0.2;
		CLIPS.push({id: names[i].slice(0, 3).replace('-', ''), name: names[i], beat: {...b, in: 0.2, out: b.out - shift}, dur: b.out - shift + 0.8});
	});
});
