import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/montserrat.css';
import './fonts/lux.css';
import {lerp, seg} from './lib';
import {CLIPS as BASE_CLIPS} from './TropicScript';

export const TL_FPS = 30;
export const TL_W = 1080;
export const TL_H = 1920;

// Type system taken from the customer's "Bảng hướng dẫn font chữ":
//  01 hero    = HERO SCRIPT (board: Bickham Script Pro 3 / Signatura Monoline / Brittany Signature) -> HERO_FONT below
//  02 sans    = SUPPORTING SANS: Montserrat Light, caps, wide tracking ("serif" role = same font, bigger)
//  03 serifI  = SECONDARY SERIF SCRIPT: Cormorant Garamond Italic
// Rules from the board: only ONE signature font for accents, other lines light sans, ivory colour, minimal outline/shadow.
type Role = 'hero' | 'serif' | 'serifI' | 'sans';
type Motion = 'write' | 'rise' | 'track' | 'curtain' | 'fade';
type Item = {
	t: string;
	role: Role;
	size: number;
	x: number; // anchor x on the 1080 canvas
	y: number; // vertical centre on the 1920 canvas
	a?: 'l' | 'c' | 'r';
	delay: number;
	motion: Motion;
	track?: number; // em
	weight?: number;
	gold?: boolean; // gradient fill on non-hero text
};
type Rule = {rule: true; x: number; y: number; w: number; delay: number};
type Entry = Item | Rule;

// Bickham Script Pro 3 (Adobe Fonts, commercial) is not installable in this sandbox -> 'Birthstone' is the stand-in.
// To use the real font: add a @font-face named 'Bickham Script Pro 3' and put it first here.
const SIGN = "'Bickham Script Pro 3', 'Birthstone', 'Great Vibes', cursive";
const SERIF = "'Cormorant Garamond', 'Playfair Display', serif"; // italic only (board: Cormorant Garamond Italic)
const SANS = "'Montserrat', 'Be Vietnam Pro', sans-serif";

// Birthstone has a small x-height next to the board's signature script, so accents are scaled up
const HERO_K = 1.75;
const IVORY = '#F4EBDA';
const GOLD_G = 'linear-gradient(180deg,#FFF8EA 0%,#F5E2BC 48%,#DDBB82 100%)';

const L = (id: string): Entry[] => LAYOUT[id];
const LAYOUT: Record<string, Entry[]> = {
	// Đẹp là điều ai cũng có thể nhìn thấy
	'01': [
		{t: 'Đẹp', role: 'hero', size: 380, x: 615, y: 715, delay: 0, motion: 'write'},
		{t: 'LÀ ĐIỀU', role: 'sans', size: 36, x: 990, y: 905, a: 'r', delay: 0.5, motion: 'track', track: 0.34},
		{t: 'AI CŨNG', role: 'sans', size: 36, x: 90, y: 770, a: 'l', delay: 1.0, motion: 'track', track: 0.34},
		{t: 'CÓ THỂ', role: 'serif', size: 68, x: 990, y: 1012, a: 'r', delay: 1.35, motion: 'rise', track: 0.16, weight: 300},
		{t: 'NHÌN THẤY', role: 'serif', size: 84, x: 990, y: 1118, a: 'r', delay: 1.7, motion: 'curtain', track: 0.14, weight: 300},
	],
	// nhưng chuẩn sống mới là điều
	'02a': [
		{t: 'NHƯNG', role: 'sans', size: 38, x: 90, y: 650, a: 'l', delay: 0, motion: 'track', track: 0.4},
		{t: 'chuẩn sống', role: 'hero', size: 330, x: 540, y: 810, delay: 0.3, motion: 'write'},
		{t: 'MỚI LÀ ĐIỀU', role: 'serif', size: 58, x: 990, y: 990, a: 'r', delay: 1.1, motion: 'curtain', track: 0.2, weight: 300},
	],
	// bạn cảm nhận thấy mỗi ngày
	'02b': [
		{t: 'BẠN', role: 'sans', size: 38, x: 540, y: 640, a: 'c', delay: 0, motion: 'fade', track: 0.5},
		{t: 'cảm nhận', role: 'hero', size: 360, x: 580, y: 810, delay: 0.3, motion: 'rise'},
		{t: 'thấy mỗi ngày', role: 'serifI', size: 84, x: 90, y: 1010, a: 'l', delay: 1.1, motion: 'write', track: 0.06, weight: 500},
		{rule: true, x: 90, y: 1090, w: 140, delay: 1.6},
	],
	// được kiến tạo bởi Vinhomes và Nomura Real Estate
	'03': [
		{t: 'ĐƯỢC KIẾN TẠO BỞI', role: 'sans', size: 34, x: 540, y: 690, a: 'c', delay: 0, motion: 'track', track: 0.42},
		{t: 'VINHOMES', role: 'serif', size: 118, x: 540, y: 812, a: 'c', delay: 0.35, motion: 'curtain', track: 0.16, weight: 300, gold: true},
		{t: 'và Nomura Real Estate', role: 'serifI', size: 76, x: 540, y: 946, a: 'c', delay: 1.5, motion: 'rise', track: 0.06, weight: 500},
		{rule: true, x: 540, y: 1030, w: 96, delay: 2.0},
	],
	// The Tropic nơi chuẩn sống quốc tế
	'04a': [
		{t: 'The Tropic', role: 'hero', size: 400, x: 540, y: 705, delay: 0, motion: 'write'},
		{t: 'NƠI CHUẨN SỐNG', role: 'sans', size: 38, x: 990, y: 945, a: 'r', delay: 0.9, motion: 'track', track: 0.4},
		{t: 'quốc tế', role: 'hero', size: 250, x: 560, y: 1085, delay: 1.3, motion: 'write'},
	],
	// giao hòa cùng kiến trúc nhiệt đới hiện đại
	'04b': [
		{t: 'GIAO HÒA CÙNG', role: 'sans', size: 36, x: 90, y: 650, a: 'l', delay: 0, motion: 'track', track: 0.4},
		{t: 'kiến trúc nhiệt đới', role: 'hero', size: 210, x: 500, y: 790, delay: 0.4, motion: 'write'},
		{t: 'hiện đại', role: 'hero', size: 330, x: 640, y: 1010, delay: 1.0, motion: 'write'},
	],
	// kiến tạo một không gian sống khác biệt
	'04c': [
		{t: 'KIẾN TẠO MỘT', role: 'sans', size: 36, x: 990, y: 650, a: 'r', delay: 0, motion: 'track', track: 0.4},
		{t: 'không gian sống', role: 'hero', size: 220, x: 600, y: 790, delay: 0.4, motion: 'rise'},
		{t: 'khác biệt', role: 'hero', size: 340, x: 450, y: 1010, delay: 1.0, motion: 'write'},
	],
	// và giá trị bền vững
	'05a': [
		{t: 'VÀ GIÁ TRỊ', role: 'serif', size: 62, x: 90, y: 690, a: 'l', delay: 0, motion: 'curtain', track: 0.2, weight: 300},
		{t: 'bền vững', role: 'hero', size: 400, x: 540, y: 880, delay: 0.35, motion: 'write'},
		{rule: true, x: 540, y: 1110, w: 130, delay: 1.5},
	],
	// được bảo chứng bởi nền tảng pháp lý minh bạch
	'05b': [
		{t: 'ĐƯỢC BẢO CHỨNG BỞI', role: 'sans', size: 34, x: 540, y: 650, a: 'c', delay: 0, motion: 'track', track: 0.4},
		{t: 'nền tảng pháp lý', role: 'hero', size: 210, x: 540, y: 790, delay: 0.4, motion: 'rise'},
		{t: 'minh bạch', role: 'hero', size: 320, x: 640, y: 1010, delay: 1.0, motion: 'write'},
	],
	// The Tropic nơi thời gian làm nên giá trị
	'06': [
		{t: 'The Tropic', role: 'hero', size: 420, x: 540, y: 715, delay: 0, motion: 'write'},
		{t: 'NƠI THỜI GIAN', role: 'sans', size: 38, x: 540, y: 985, a: 'c', delay: 0.9, motion: 'track', track: 0.5},
		{t: 'làm nên giá trị', role: 'serifI', size: 100, x: 540, y: 1095, a: 'c', delay: 1.3, motion: 'rise', track: 0.1, weight: 500, gold: true},
	],
};

const soft = Easing.bezier(0.22, 1, 0.36, 1);
const pen = Easing.bezier(0.5, 0, 0.25, 1);
const lin = (x: number) => x;

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	const [ready, setReady] = React.useState(false);
	React.useEffect(() => {
		const s = 'Đẹp chuẩn sống ẳạỡệịẾỜ';
		Promise.all([
			document.fonts.load("400 60px 'Birthstone'", s),
			document.fonts.load("italic 400 40px 'Cormorant Garamond'", s),
			document.fonts.load("italic 500 40px 'Cormorant Garamond'", s),
			document.fonts.load("300 30px 'Montserrat'", s),
			document.fonts.load("400 30px 'Montserrat'", s),
		]).then(() => {
			setReady(true);
			continueRender(h);
		});
	}, [h]);
	return ready;
};

const View: React.FC<{items: Entry[]; inAt: number; outAt: number; ready: boolean}> = ({items, inAt, outAt, ready}) => {
	const t = useCurrentFrame() / TL_FPS;
	const refs = React.useRef<(HTMLSpanElement | null)[]>([]);
	React.useLayoutEffect(() => {
		items.forEach((it, i) => {
			if ('rule' in it) return;
			const el = refs.current[i];
			if (!el) return;
			const base = it.role === 'hero' ? it.size * HERO_K : it.size;
			el.style.fontSize = `${base}px`;
			const a = it.a ?? 'c';
			const maxW = a === 'l' ? 1000 - it.x : a === 'r' ? it.x - 80 : 2 * Math.min(it.x - 70, 1010 - it.x);
			const w = el.offsetWidth;
			if (w > maxW) el.style.fontSize = `${(base * maxW) / w}px`;
		});
	}, [ready]);
	const out = seg(t, outAt, outAt + 0.5, lin);
	return (
		<>
			{items.map((it, i) => {
				const at = inAt + it.delay;
				if ('rule' in it) {
					const p = seg(t, at, at + 0.9, soft);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: it.x,
								top: it.y,
								width: it.w,
								height: 1.5,
								marginLeft: it.x > 300 && it.x < 800 ? -it.w / 2 : 0,
								background: 'linear-gradient(90deg,rgba(235,205,150,0),#EBCD96 30%,#EBCD96 70%,rgba(235,205,150,0))',
								transformOrigin: 'center',
								transform: `scaleX(${p})`,
								opacity: (1 - out) * Math.min(1, p * 3),
							}}
						/>
					);
				}
				const a = it.a ?? 'c';
				const hero = it.role === 'hero';
				const dur = hero ? 1.5 : it.motion === 'track' ? 1.1 : 0.95;
				const p = seg(t, at, at + dur, lin);
				const e = soft(p);
				const tr = it.track ?? 0;

				const wrap: React.CSSProperties = {
					position: 'absolute',
					left: it.x,
					top: it.y,
					transform: `translate(${a === 'c' ? '-50%' : a === 'r' ? '-100%' : '0'}, -50%)`,
					whiteSpace: 'nowrap',
				};
				// generous padding so masks / clips never cut the long swash tails of the script
				const pad = Math.round((hero ? it.size * HERO_K : it.size) * 0.6);
				const motionBox: React.CSSProperties = {
					padding: pad,
					margin: -pad,
					opacity: 1 - out,
					filter: out > 0.01 ? `blur(${out * 6}px)` : undefined,
				};
				const inner: React.CSSProperties = {display: 'inline-block', lineHeight: 1.15, padding: '0.25em 0.35em', margin: '-0.25em -0.35em'};
				let spacing = tr;

				switch (it.motion) {
					case 'write': {
						const edge = pen(p) * 125 - 10;
						const m = `linear-gradient(100deg, #000 ${edge - 12}%, transparent ${edge + 3}%)`;
						if (p < 1) Object.assign(motionBox, {WebkitMaskImage: m, maskImage: m});
						motionBox.opacity = Math.min(1, p * 8) * (1 - out);
						break;
					}
					case 'rise': {
						Object.assign(motionBox, {
							transform: `translateY(${lerp(30, 0, e) - out * 14}px)`,
							opacity: e * (1 - out),
							filter: out > 0.01 ? `blur(${out * 6}px)` : p < 1 ? `blur(${lerp(10, 0, e)}px)` : undefined,
						});
						break;
					}
					case 'track': {
						spacing = lerp(tr * 1.9, tr, e);
						Object.assign(motionBox, {
							opacity: e * (1 - out),
							filter: out > 0.01 ? `blur(${out * 6}px)` : p < 1 ? `blur(${lerp(5, 0, e)}px)` : undefined,
						});
						break;
					}
					case 'curtain': {
						spacing = lerp(tr * 1.25, tr, e);
						const c = lerp(50, -4, e);
						Object.assign(motionBox, {
							clipPath: p < 1 ? `inset(-20% ${c}% -20% ${c}%)` : undefined,
							opacity: Math.min(1, p * 4) * (1 - out),
						});
						break;
					}
					default: {
						Object.assign(motionBox, {
							transform: `scale(${lerp(1.06, 1, e)}) translateY(${-out * 10}px)`,
							opacity: e * (1 - out),
						});
					}
				}

				// one soft pass of light over the gold once the hero has been drawn
				const sh = seg(t, at + dur * 0.85, at + dur * 0.85 + 1.2, Easing.inOut(Easing.quad));
				const shine = hero && sh > 0 && sh < 1 ? `linear-gradient(105deg, rgba(255,255,255,0) ${sh * 140 - 30}%, rgba(255,255,255,0.95) ${sh * 140 - 15}%, rgba(255,255,255,0) ${sh * 140}%), ` : '';

				if (hero) {
					Object.assign(inner, {
						fontFamily: SIGN,
						fontWeight: 400,
						backgroundImage: `${shine}${GOLD_G}`,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						color: 'transparent',
						WebkitTextStroke: `${Math.max(0.6, it.size * 0.0028)}px rgba(244,226,186,0.9)`,
						filter: 'drop-shadow(0 2px 9px rgba(0,0,0,0.32)) drop-shadow(0 0 14px rgba(255,226,170,0.22))',
					});
				} else if (it.role === 'sans' || (it.role === 'serif' && !it.gold)) {
					Object.assign(inner, {
						fontFamily: SANS,
						fontWeight: 300,
						color: IVORY,
						opacity: 0.94,
						letterSpacing: `${spacing}em`,
						marginRight: a === 'c' ? undefined : `${-spacing}em`,
						paddingLeft: a === 'c' ? `${spacing}em` : '0.35em',
						textShadow: '0 1px 10px rgba(0,0,0,0.45)',
					});
				} else {
					const italic = it.role === 'serifI';
					const common: React.CSSProperties = {
						fontFamily: italic ? SERIF : SANS,
						fontStyle: italic ? 'italic' : 'normal',
						fontWeight: italic ? it.weight ?? 500 : 300,
						letterSpacing: `${spacing}em`,
						paddingLeft: a === 'c' ? `${spacing}em` : '0.35em',
					};
					if (it.gold) {
						Object.assign(inner, common, {
							backgroundImage: GOLD_G,
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							color: 'transparent',
							filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.42)) drop-shadow(0 0 16px rgba(255,226,170,0.3))',
						});
					} else {
						Object.assign(inner, common, {color: IVORY, textShadow: '0 1px 10px rgba(0,0,0,0.45)'});
					}
				}

				return (
					<div key={i} style={wrap}>
						<div style={motionBox}>
							<span ref={(el) => {refs.current[i] = el;}} style={inner}>
								{it.t}
							</span>
						</div>
					</div>
				);
			})}
		</>
	);
};

export const TropicLux: React.FC<{id: string; inAt: number; outAt: number}> = ({id, inAt, outAt}) => {
	const ready = useFonts();
	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			<View items={L(id)} inAt={inAt} outAt={outAt} ready={ready} />
		</AbsoluteFill>
	);
};

export const LUX_CLIPS = BASE_CLIPS.map((c) => ({id: c.id, name: c.name, inAt: c.beat.in, outAt: c.beat.out, dur: c.dur}));
