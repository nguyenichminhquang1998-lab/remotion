import React from 'react';
import {AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame} from 'remotion';
import {lerp, seg} from './lib';

export const SL_FPS = 30;
export const SL_W = 1920;
export const SL_H = 1080;
export const SL_DURATION = 9 * SL_FPS;

// World = the photo laid out 1920 wide (photo is 516x387 → 1920x1440). Plot position measured on the original photo.
const WW = 1920;
const WH = 1440;
const K = WW / 516;
const PLOT = {cx: 232 * K, cy: 208 * K, rx: 50 * K, ry: 28 * K, rot: -4};

const ease = Easing.bezier(0.45, 0, 0.2, 1);
const lin = (x: number) => x;
const T = {draw0: 1.7, draw1: 3.5, hold: 3.5, end: 8.4};

export type SaberProps = {color?: string; glow?: string};

const ringPoint = (a: number) => {
	// slightly hand-drawn ellipse, rotated
	const w = 1 + 0.012 * Math.sin(3 * a + 1) + 0.008 * Math.sin(5 * a + 2);
	const x = Math.cos(a) * PLOT.rx * w;
	const y = Math.sin(a) * PLOT.ry * w;
	const r = (PLOT.rot * Math.PI) / 180;
	return {x: PLOT.cx + x * Math.cos(r) - y * Math.sin(r), y: PLOT.cy + x * Math.sin(r) + y * Math.cos(r)};
};
const A0 = -2.35;
const OVER = 1.07;
const pathOf = (turns: number, close: boolean) => {
	const n = Math.round(260 * turns);
	let d = '';
	for (let i = 0; i <= n; i++) {
		const p = ringPoint(A0 + (i / n) * Math.PI * 2 * turns);
		d += `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
	}
	return d + (close ? 'Z' : '');
};
const OPEN = pathOf(OVER, false);
const CLOSED = pathOf(1, true);

export const SaberLand: React.FC<SaberProps> = ({color = '#2fb6ff', glow = '#0a6dff'}) => {
	const frame = useCurrentFrame();
	const t = frame / SL_FPS;

	// camera
	const zoom = lerp(1.0, 1.95, ease(seg(t, 0, 3.4, lin))) + 0.18 * seg(t, 3.4, 8.8, lin);
	const k = ease(seg(t, 0, 3.4, lin));
	const camX = lerp(960, PLOT.cx, k);
	const camY = lerp(700, PLOT.cy, k);
	const tx = 960 - camX * zoom;
	const ty = 540 - camY * zoom;

	// saber progress
	const p = ease(seg(t, T.draw0, T.draw1, lin));
	const head = p; // 0..1 of open path
	const doneK = seg(t, T.draw1, T.draw1 + 0.35, lin);
	const flicker = 0.94 + 0.06 * Math.sin(t * 23) + 0.03 * Math.sin(t * 57 + 1);
	const fadeOut = 1 - seg(t, T.end, 9, lin);
	const on = seg(t, T.draw0 - 0.05, T.draw0 + 0.1, lin) * fadeOut * flicker;
	const pulse = Math.exp(-Math.max(0, t - T.draw1) * 2.6) * (t > T.draw1 ? 1 : 0);
	const sw = 1 / zoom; // keep screen thickness constant

	const headPt = ringPoint(A0 + head * Math.PI * 2 * OVER);
	const circ = ((t - T.draw1) * 0.2) % 1;

	const sparks = Array.from({length: 70}).map((_, i) => {
		const ts = T.draw0 + (i / 70) * (T.draw1 - T.draw0);
		const age = t - ts;
		if (age < 0 || age > 0.7) return null;
		const pp = ease(seg(ts, T.draw0, T.draw1, lin));
		const o = ringPoint(A0 + pp * Math.PI * 2 * OVER);
		const ang = random(`a${i}`) * Math.PI * 2;
		const sp = (30 + random(`s${i}`) * 110) * (1 / zoom) * 2.2;
		return {x: o.x + Math.cos(ang) * sp * age, y: o.y + Math.sin(ang) * sp * age + 40 * age * age, a: (1 - age / 0.7) ** 1.5, r: (1.2 + random(`r${i}`) * 2.4) / zoom};
	});

	const dim = seg(t, 2.8, 4.2, lin) * fadeOut;
	const gid = (n: string) => `${n}`;

	return (
		<AbsoluteFill style={{background: '#06090f', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: WW, height: WH, transform: `translate(${tx}px, ${ty}px) scale(${zoom})`, transformOrigin: '0 0', willChange: 'transform'}}>
				<Img src={staticFile('land.jpg')} style={{position: 'absolute', inset: 0, width: WW, height: WH, filter: 'contrast(1.08) saturate(1.12) brightness(1.02)'}} />

				{/* spotlight: darken everything around the plot */}
				<div
					style={{
						position: 'absolute',
						inset: -400,
						opacity: dim,
						background: `radial-gradient(ellipse ${PLOT.rx * 1.35}px ${PLOT.ry * 1.55}px at ${PLOT.cx + 400}px ${PLOT.cy + 400}px, rgba(4,10,24,0) 55%, rgba(4,10,24,0.62) 100%)`,
					}}
				/>
				{/* gentle lift inside */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						opacity: dim * 0.55,
						mixBlendMode: 'screen',
						background: `radial-gradient(ellipse ${PLOT.rx * 1.05}px ${PLOT.ry * 1.1}px at ${PLOT.cx}px ${PLOT.cy}px, ${glow}55, transparent 75%)`,
					}}
				/>

				<svg width={WW} height={WH} viewBox={`0 0 ${WW} ${WH}`} style={{position: 'absolute', inset: 0, overflow: 'visible', mixBlendMode: 'screen'}}>
					<defs>
						<filter id={gid('bigGlow')} x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation={22 * sw} />
						</filter>
						<filter id={gid('medGlow')} x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation={7 * sw} />
						</filter>
						<filter id={gid('smallGlow')} x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation={2.2 * sw} />
						</filter>
						<radialGradient id="flare">
							<stop offset="0" stopColor="#ffffff" stopOpacity="1" />
							<stop offset="0.25" stopColor={color} stopOpacity="0.9" />
							<stop offset="1" stopColor={glow} stopOpacity="0" />
						</radialGradient>
					</defs>

					<g opacity={on}>
						{/* drawn-in ring: outer glow, mid glow, coloured blade, white core */}
						{[
							{w: 46, f: 'bigGlow', c: glow, o: 0.85 + pulse * 0.5},
							{w: 20, f: 'medGlow', c: color, o: 0.95},
							{w: 8.5, f: 'smallGlow', c: color, o: 1},
							{w: 3.6, f: '', c: '#ffffff', o: 1},
						].map((l, i) => (
							<path key={i} d={OPEN} pathLength={1} fill="none" stroke={l.c} strokeWidth={l.w * sw * (1 + pulse * 0.25)} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${head} 2`} opacity={l.o} filter={l.f ? `url(#${l.f})` : undefined} />
						))}
						{/* energy running around the finished ring */}
						<g opacity={doneK}>
							{[
								{w: 30, f: 'medGlow', c: color, o: 0.95},
								{w: 7, f: 'smallGlow', c: '#ffffff', o: 1},
							].map((l, i) => (
								<path key={i} d={CLOSED} pathLength={1} fill="none" stroke={l.c} strokeWidth={l.w * sw} strokeLinecap="round" strokeDasharray="0.16 0.84" strokeDashoffset={-(circ - 0.16)} opacity={l.o} filter={l.f ? `url(#${l.f})` : undefined} />
							))}
						</g>
					</g>

					{/* ignition flare riding the tip while drawing */}
					{t > T.draw0 && t < T.draw1 + 0.25 && (
						<g opacity={fadeOut * (1 - seg(t, T.draw1, T.draw1 + 0.25, lin))}>
							<circle cx={headPt.x} cy={headPt.y} r={46 * sw} fill="url(#flare)" />
							<circle cx={headPt.x} cy={headPt.y} r={9 * sw} fill="#fff" />
						</g>
					)}
					{sparks.map((s, i) => s && <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={i % 3 ? '#fff' : color} opacity={s.a * fadeOut} />)}
				</svg>
			</div>

			{/* closing flash on ignition + vignette + grain */}
			<AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${color}, transparent 60%)`, opacity: 0.22 * Math.exp(-((t - T.draw1) ** 2) * 8), mixBlendMode: 'screen'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)'}} />
			<svg width={SL_W} height={SL_H} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.16}}>
				<filter id="grainL">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width={SL_W} height={SL_H} filter="url(#grainL)" />
			</svg>
			<AbsoluteFill style={{background: '#000', opacity: seg(t, 8.6, 9, lin) * 0.9}} />
		</AbsoluteFill>
	);
};
