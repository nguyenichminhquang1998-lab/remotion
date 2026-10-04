import React from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, random, staticFile, useCurrentFrame} from 'remotion';
import './fonts/fonts.css';
import {Easing} from 'remotion';
import {easeBack, easeOut, lerp, seg} from './lib';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Be Vietnam Pro', sans-serif";
const SANS_I = SANS;
const SCRIPT = "'Great Vibes', cursive";

export const RI_FPS = 30;
export const RI_W = 1080;
export const RI_H = 1920;
export const RI_DURATION = 23 * RI_FPS;
const HOLD_AT = 21.0;

const inOut = Easing.bezier(0.45, 0, 0.2, 1);
const soft = Easing.bezier(0.22, 1, 0.36, 1);
const BLUE = 'linear-gradient(180deg,#3d80e6 0%,#1b4cab 46%,#0a2a6c 100%)';
const NAVY = '#123575';

// ---------------------------------------------------------------- scenes timing
const SC = {
	A: {t0: 0, t1: 5.9},
	B: {t0: 5.3, t1: 11.0},
	C: {t0: 10.4, t1: 16.1},
	D: {t0: 15.5, t1: 19.4},
	E: {t0: 18.8, t1: 23.1},
};
const FADE = 0.7;

// ---------------------------------------------------------------- image with slow pan/zoom
const Kb: React.FC<{
	src: string; aspect: number; t: number; t0: number; t1: number;
	z: [number, number]; fx: [number, number]; fy: [number, number];
}> = ({src, aspect, t, t0, t1, z, fx, fy}) => {
	const p = seg(t, t0, t1, Easing.bezier(0.37, 0, 0.63, 1));
	const zz = lerp(z[0], z[1], p);
	const Hs = 1920 * zz;
	const Ws = Hs * aspect;
	const left = Math.min(Math.max(lerp(fx[0], fx[1], p) * Ws - 540, 0), Ws - 1080);
	const top = Math.min(Math.max(lerp(fy[0], fy[1], p) * Hs - 960, 0), Hs - 1920);
	return <Img src={staticFile(src)} style={{position: 'absolute', left: -left, top: -top, width: Ws, height: Hs, maxWidth: 'none'}} />;
};

// ---------------------------------------------------------------- text parts
const Word: React.FC<{text: string; p: number; glint?: number; size: number; family: string; weight: number; ls: string; fill?: string}> = ({text, p, glint = -1, size, family, weight, ls, fill = BLUE}) => {
	const y = lerp(115, 0, soft(p));
	const blur = lerp(12, 0, soft(Math.min(1, p * 1.3)));
	const pos = lerp(-25, 125, glint);
	const sheen = glint >= 0 && glint <= 1 ? `linear-gradient(105deg, rgba(255,255,255,0) ${pos - 14}%, rgba(255,255,255,0.95) ${pos}%, rgba(255,255,255,0) ${pos + 14}%), ` : '';
	return (
		<span style={{display: 'inline-block', overflow: 'hidden', padding: '0.5em 0.12em 0.25em', margin: '-0.5em -0.12em -0.25em', verticalAlign: 'top'}}>
			<span
				style={{
					display: 'inline-block',
					padding: '0.45em 0.06em 0.2em',
					margin: '-0.45em -0.06em -0.2em',
					fontFamily: family,
					fontWeight: weight,
					fontSize: size,
					lineHeight: 1,
					fontFeatureSettings: '"lnum" 1',
					letterSpacing: ls,
					transform: `translateY(${y}%)`,
					opacity: Math.min(1, p * 3),
					filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
					backgroundImage: sheen + fill,
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					color: 'transparent',
					WebkitTextFillColor: 'transparent',
				}}
			>
				{text}
			</span>
		</span>
	);
};

const Line: React.FC<{words: string[]; t: number; at: number; stagger?: number; dur?: number; size: number; family?: string; weight?: number; ls?: string; glintAt?: number; fill?: string; gap?: number}> = ({
	words, t, at, stagger = 0.14, dur = 0.9, size, family = SERIF, weight = 700, ls = '0.01em', glintAt, fill, gap = 0.26,
}) => (
	<div style={{display: 'flex', justifyContent: 'center', gap: size * gap, filter: 'drop-shadow(0 3px 16px rgba(255,248,215,0.55))'}}>
		{words.map((w, i) => (
			<Word
				key={i}
				text={w}
				p={seg(t, at + i * stagger, at + i * stagger + dur, linear)}
				glint={glintAt === undefined ? -1 : seg(t, glintAt + i * 0.06, glintAt + 0.9 + i * 0.06, inOut)}
				size={size}
				family={family}
				weight={weight}
				ls={ls}
				fill={fill}
			/>
		))}
	</div>
);
const linear = (x: number) => x;

const Script: React.FC<{text: string; t: number; at: number; size: number}> = ({text, t, at, size}) => {
	const p = seg(t, at, at + 1.0, inOut);
	const edge = p * 112 - 6;
	return (
		<div
			style={{
				textAlign: 'center',
				fontFamily: SCRIPT,
				fontSize: size,
				lineHeight: 1.2,
				padding: '0.1em 0.3em',
				backgroundImage: BLUE,
				WebkitBackgroundClip: 'text',
				backgroundClip: 'text',
				WebkitTextFillColor: 'transparent',
				color: 'transparent',
				WebkitMaskImage: `linear-gradient(90deg, #000 ${edge - 10}%, transparent ${edge + 6}%)`,
				maskImage: `linear-gradient(90deg, #000 ${edge - 10}%, transparent ${edge + 6}%)`,
				opacity: seg(t, at, at + 0.2),
				filter: 'drop-shadow(0 3px 14px rgba(255,248,215,0.6))',
			}}
		>
			{text}
		</div>
	);
};

const Star: React.FC<{size: number; p: number}> = ({size, p}) => {
	const k = easeBack(p);
	return (
		<svg width={size} height={size} viewBox="-12 -12 24 24" style={{transform: `scale(${k}) rotate(${lerp(-60, 0, k)}deg)`, opacity: Math.min(1, p * 4), filter: 'drop-shadow(0 2px 8px rgba(255,248,215,0.7))'}}>
			<defs>
				<linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3d80e6" /><stop offset="1" stopColor="#0a2a6c" /></linearGradient>
			</defs>
			<path d="M0,-11 L3.2,-3.6 L11,-3.4 L4.9,1.6 L6.9,9.4 L0,5 L-6.9,9.4 L-4.9,1.6 L-11,-3.4 L-3.2,-3.6Z" fill="url(#sg)" />
		</svg>
	);
};

const Rule: React.FC<{t: number; at: number; w: number}> = ({t, at, w}) => (
	<div style={{margin: '0 auto', width: w * soft(seg(t, at, at + 0.9, linear)), height: 2, background: 'linear-gradient(90deg, transparent, #c9a24e 25%, #f1d58f 50%, #c9a24e 75%, transparent)', opacity: 0.9}} />
);

/** Block exit: lift, blur and fade shortly before the scene is replaced. */
const Out: React.FC<{t: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, at, children, style}) => {
	const k = seg(t, at, at + 0.55, inOut);
	return (
		<div style={{...style, opacity: 1 - k, transform: `translateY(${-34 * k}px)`, filter: k > 0.02 ? `blur(${k * 8}px)` : undefined}}>{children}</div>
	);
};

const LogoBug: React.FC<{t: number; at: number; w: number; top: number; loc?: boolean}> = ({t, at, w, top, loc = true}) => {
	const p = seg(t, at, at + 0.9, soft);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p, transform: `translateY(${lerp(-24, 0, p)}px)`, filter: 'drop-shadow(0 2px 12px rgba(255,248,215,0.5))'}}>
			<Img src={staticFile('logo.png')} style={{width: w}} />
			{loc && <div style={{marginTop: w * 0.03, fontFamily: SANS, fontWeight: 500, fontSize: w * 0.062, letterSpacing: '0.16em', color: NAVY}}>ĐẢO VŨ YÊN - HẢI PHÒNG</div>}
		</div>
	);
};

const Halo: React.FC<{t: number; at: number; top: number; h: number}> = ({t, at, top, h}) => (
	<div style={{position: 'absolute', left: -100, right: -100, top, height: h, background: 'radial-gradient(ellipse at 50% 50%, rgba(255,246,208,0.5), rgba(255,240,190,0) 68%)', opacity: seg(t, at, at + 1.2)}} />
);

// ---------------------------------------------------------------- scene wrapper (crossfade + settle)
const Scene: React.FC<{tt: number; s: {t0: number; t1: number}; first?: boolean; children: (t: number) => React.ReactNode}> = ({tt, s, first, children}) => {
	if (tt < s.t0 || tt > s.t1) return null;
	const k = first ? 1 : seg(tt, s.t0, s.t0 + FADE, inOut);
	const settle = first ? 0 : 1 - seg(tt, s.t0, s.t0 + 1.4, soft);
	return (
		<AbsoluteFill style={{opacity: k, transform: `scale(${1 + 0.07 * settle})`, filter: settle > 0.02 ? `blur(${settle * 5}px)` : undefined}}>
			{children(tt - s.t0)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------- atmosphere
const Pollen: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
		{Array.from({length: 46}).map((_, i) => {
			const depth = random(`d${i}`);
			const sz = 3 + depth * 9;
			const x = random(`x${i}`) * 1080 + Math.sin(t * (0.4 + depth * 0.5) + i) * 28;
			const y = (((random(`y${i}`) * 1920 - t * (14 + depth * 46)) % 1920) + 1920) % 1920;
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: sz, background: 'radial-gradient(circle, rgba(255,250,225,0.95), rgba(255,226,150,0.0) 70%)', opacity: (0.25 + random(`o${i}`) * 0.55) * (0.6 + 0.4 * Math.sin(t * 1.6 + i)), filter: `blur(${depth > 0.7 ? 3 : 0.6}px)`}} />;
		})}
	</AbsoluteFill>
);

const Rays: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
		{[0, 1, 2].map((i) => (
			<div key={i} style={{position: 'absolute', right: -500 + Math.sin(t * 0.3 + i) * 60, top: -400 + i * 120, width: 1800, height: 150 + i * 40, transform: `rotate(${38 + i * 6}deg)`, transformOrigin: '100% 0', background: 'linear-gradient(90deg, rgba(255,236,170,0), rgba(255,236,170,0.20), rgba(255,236,170,0))', filter: 'blur(26px)', opacity: 0.55 + 0.25 * Math.sin(t * 0.6 + i * 2)}} />
		))}
	</AbsoluteFill>
);

const Flash: React.FC<{t: number}> = ({t}) => {
	let f = 0;
	for (const s of [SC.B.t0, SC.C.t0, SC.D.t0, SC.E.t0]) {
		const x = (t - (s + 0.25)) / 0.42;
		f = Math.max(f, Math.exp(-x * x * 2.2));
	}
	return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 30%, rgba(255,244,205,1), rgba(255,214,130,0.9))', opacity: 0.55 * f, mixBlendMode: 'screen'}} />;
};

// ---------------------------------------------------------------- scenes
const SceneA: React.FC<{t: number; l: number}> = ({t, l}) => (
	<>
		<Kb src="plate_a.jpg" aspect={1600 / 2000} t={t} t0={SC.A.t0} t1={SC.A.t1} z={[1.0, 1.12]} fx={[0.42, 0.6]} fy={[0.55, 0.55]} />
		<Out t={l} at={5.0} style={{position: 'absolute', inset: 0}}>
			<Halo t={l} at={0.4} top={380} h={760} />
			<LogoBug t={l} at={0.25} w={330} top={140} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 410}}>
				<Script text="Nơi" t={l} at={0.6} size={150} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 575}}>
				<Line words={['NHỮNG', 'KỲ', 'NGHỈ']} t={l} at={1.0} size={104} glintAt={2.9} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 660}}>
				<Line words={['5', 'SAO']} t={l} at={1.7} size={290} stagger={0.18} dur={1.0} ls="0.01em" glintAt={2.6} gap={0.2} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 985, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
				{[40, 52, 70, 52, 40].map((s, i) => <Star key={i} size={s} p={seg(l, 2.8 + i * 0.1, 3.4 + i * 0.1, linear)} />)}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1075, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 46, color: NAVY, letterSpacing: `${lerp(0.34, 0.1, soft(seg(l, 3.3, 4.3, linear)))}em`, opacity: seg(l, 3.3, 3.9), transform: `translateY(${lerp(24, 0, soft(seg(l, 3.3, 4.1, linear)))}px)`, filter: 'drop-shadow(0 0 10px rgba(255,248,215,0.95)) drop-shadow(0 0 22px rgba(255,248,215,0.8))'}}>
				BẮT ĐẦU NGAY TẠI NHÀ
			</div>
		</Out>
	</>
);

const SceneB: React.FC<{t: number; l: number}> = ({t, l}) => (
	<>
		<Kb src="plate_b.jpg" aspect={1} t={t} t0={SC.B.t0} t1={SC.B.t1} z={[1.02, 1.12]} fx={[0.56, 0.5]} fy={[0.6, 0.6]} />
		<Out t={l} at={5.0} style={{position: 'absolute', inset: 0}}>
			<Halo t={l} at={0.6} top={380} h={760} />
			<LogoBug t={l} at={0.5} w={300} top={170} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 470}}>
				<Line words={['TÀI', 'SẢN', 'CHO']} t={l} at={1.0} size={140} glintAt={3.0} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 640}}>
				<Line words={['HÔM', 'NAY']} t={l} at={1.5} size={190} stagger={0.2} glintAt={3.2} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 880}}>
				<Rule t={l} at={2.4} w={420} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 930}}>
				<Line words={['MÔI', 'TRƯỜNG', 'TRƯỞNG', 'THÀNH']} t={l} at={2.6} size={50} family={SANS} weight={700} ls="0.06em" stagger={0.11} dur={0.7} fill={`linear-gradient(180deg,#1b4cab,${NAVY})`} gap={0.3} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1005}}>
				<Line words={['CHO', 'NGÀY', 'MAI']} t={l} at={3.1} size={50} family={SANS} weight={700} ls="0.06em" stagger={0.11} dur={0.7} fill={`linear-gradient(180deg,#1b4cab,${NAVY})`} gap={0.3} />
			</div>
		</Out>
	</>
);

const SceneC: React.FC<{t: number; l: number}> = ({t, l}) => {
	const cp = soft(seg(l, 0.9, 2.3, linear));
	const n = Math.round(31 * cp);
	const popP = seg(l, 2.2, 2.9, linear);
	const pop = 1 + 0.07 * Math.sin(Math.min(1, popP) * Math.PI);
	return (
		<>
			<Kb src="plate_c.jpg" aspect={1} t={t} t0={SC.C.t0} t1={SC.C.t1} z={[1.0, 1.1]} fx={[0.5, 0.5]} fy={[0.55, 0.55]} />
			<Out t={l} at={5.0} style={{position: 'absolute', inset: 0}}>
				<Halo t={l} at={0.5} top={380} h={620} />
				<LogoBug t={l} at={0.4} w={300} top={170} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 500, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 30, filter: 'drop-shadow(0 3px 16px rgba(255,248,215,0.55))'}}>
					<div style={{display: 'inline-block', width: '1.0em', textAlign: 'right', fontFamily: SERIF, fontWeight: 700, fontSize: 128, lineHeight: 1, transform: `scale(${pop})`, transformOrigin: '70% 60%', opacity: seg(l, 0.8, 1.2), backgroundImage: BLUE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFeatureSettings: '"lnum" 1'}}>
						{n}
					</div>
					<Line words={['CÔNG', 'VIÊN']} t={l} at={1.2} size={128} stagger={0.16} glintAt={2.8} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 645}}>
					<Line words={['NỘI', 'KHU']} t={l} at={1.9} size={128} stagger={0.2} glintAt={3.1} />
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 810}}>
					<Rule t={l} at={2.8} w={360} />
				</div>
			</Out>
		</>
	);
};

const SceneD: React.FC<{t: number; l: number}> = ({t, l}) => (
	<>
		<Kb src="plate_d.jpg" aspect={1} t={t} t0={SC.D.t0} t1={SC.D.t1} z={[1.0, 1.12]} fx={[0.6, 0.66]} fy={[0.5, 0.5]} />
		<LogoBug t={l} at={0.5} w={300} top={170} />
	</>
);

const SceneE: React.FC<{t: number; l: number}> = ({t, l}) => {
	const crown = soft(seg(l, 0.7, 1.5, linear));
	const word = soft(seg(l, 1.1, 1.9, linear));
	const sheen = seg(l, 1.5, 2.1, inOut);
	const loc = soft(seg(l, 1.4, 2.0, linear));
	const w = 780;
	const h = (w * 811) / 1439;
	const logo = staticFile('logo.png');
	return (
		<>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 55% at 50% 46%, #fffaea 0%, #fbe9b4 55%, #f2cd78 100%)'}} />
			<AbsoluteFill style={{background: 'radial-gradient(circle at 72% 16%, rgba(255,244,205,0.7), transparent 55%)'}} />
			<div style={{position: 'absolute', left: (1080 - w) / 2, top: 760, width: w, height: h}}>
				<Img src={logo} style={{position: 'absolute', inset: 0, width: w, height: h, clipPath: `inset(${(1 - crown) * 100}% 0 47% 0)`, opacity: Math.min(1, crown * 3), transform: `translateY(${lerp(26, 0, crown)}px)`}} />
				<Img src={logo} style={{position: 'absolute', inset: 0, width: w, height: h, clipPath: 'inset(53% 0 0 0)', opacity: word, transform: `translateY(${lerp(22, 0, word)}px)`, filter: word < 0.98 ? `blur(${(1 - word) * 8}px)` : undefined}} />
				<div
					style={{
						position: 'absolute', inset: 0,
						WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
						backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${lerp(-30, 120, sheen) - 12}%, rgba(255,255,255,0.95) ${lerp(-30, 120, sheen)}%, rgba(255,255,255,0) ${lerp(-30, 120, sheen) + 12}%)`,
						opacity: sheen > 0 && sheen < 1 ? 1 : 0,
					}}
				/>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 760 + h + 22, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: `${lerp(0.4, 0.18, loc)}em`, color: NAVY, opacity: loc, transform: `translateY(${lerp(14, 0, loc)}px)`}}>
				ĐẢO VŨ YÊN - HẢI PHÒNG
			</div>
		</>
	);
};

// ---------------------------------------------------------------- root
const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([
			document.fonts.load("700 100px 'Cormorant Garamond'", 'ÀỞỮ'),
			document.fonts.load("500 30px 'Be Vietnam Pro'", 'ÀỞỮ'),
			document.fonts.load("700 30px 'Be Vietnam Pro'", 'ÀỞỮ'),
			document.fonts.load("italic 500 30px 'Be Vietnam Pro'", 'ảnh'),
			document.fonts.load("400 100px 'Great Vibes'", 'Nơi'),
		]).then(() => continueRender(h));
	}, [h]);
};

export const RoyalIsland: React.FC = () => {
	useFonts();
	const frame = useCurrentFrame();
	const real = frame / RI_FPS;
	const t = Math.min(real, HOLD_AT);
	const disclaimer = 1 - seg(t, 18.6, 19.1);
	return (
		<AbsoluteFill style={{background: '#f6d58a', overflow: 'hidden'}}>
			<AbsoluteFill style={{filter: 'contrast(1.05) saturate(1.08)'}}>
				<Scene tt={t} s={SC.A} first>{(l) => <SceneA t={t} l={l} />}</Scene>
				<Scene tt={t} s={SC.B}>{(l) => <SceneB t={t} l={l} />}</Scene>
				<Scene tt={t} s={SC.C}>{(l) => <SceneC t={t} l={l} />}</Scene>
				<Scene tt={t} s={SC.D}>{(l) => <SceneD t={t} l={l} />}</Scene>
				<Scene tt={t} s={SC.E}>{(l) => <SceneE t={t} l={l} />}</Scene>
			</AbsoluteFill>
			<Rays t={t} />
			<Pollen t={t} />
			<Flash t={t} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(70,35,0,0.28) 100%)'}} />
			<div style={{position: 'absolute', left: 38, top: 1610, fontFamily: SANS_I, fontStyle: 'italic', fontWeight: 500, fontSize: 24, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 6px rgba(60,30,0,0.6)', opacity: disclaimer}}>(*) Hình ảnh minh họa</div>
			<svg width={RI_W} height={RI_H} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.2}}>
				<filter id="grain2">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width={RI_W} height={RI_H} filter="url(#grain2)" />
			</svg>
		</AbsoluteFill>
	);
};
