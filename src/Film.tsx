import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {ColorWheels, CursorCard, Moodboard, ProgressBar, ShotList, Timeline} from './panels';
import {Chrome, Panel} from './Panel';
import {Scene, SH, SW} from './Scene';
import {FPS, HOLD_AT, P, Pose, easeIn, easeOut, kf, lerp, seg} from './lib';

const float = (t: number, ph: number, a = 6) => Math.sin(t * 1.1 + ph) * a;

/** Converge everything to centre (12.0–12.7) and dissolve, leaving clean negative space. */
const conv = (p: Pose, t: number): Pose => {
	const c = seg(t, 12.0, 12.7, easeIn);
	const f = 1 - c;
	return {...p, x: p.x * f, y: p.y * f, z: p.z * f, ry: p.ry * f, s: p.s * lerp(1, 0.08, c), o: p.o * (1 - seg(t, 12.35, 12.75))};
};

const cam = (t: number) => ({
	z: kf(t, [[0, 380], [2.7, 830], [3.1, 830], [6.0, -60], [7.3, 60], [8.6, 0], [13, 0]]),
	ry: kf(t, [[0, 0], [2.7, -2], [3.1, -2], [5.6, 15], [7.3, 0], [13, 0]]),
	rx: kf(t, [[0, 0], [3.1, 0], [4.6, -5], [7.3, 0], [13, 0]]),
});

const cardPose = (t: number) => {
	const a = seg(t, 2.7, 4.3);
	return P({y: lerp(0, -10, a), z: lerp(0, -420, a), o: 1 - seg(t, 4.6, 5.8), blur: lerp(0, 8, a)});
};

const moodPose = (t: number) => {
	const a = seg(t, 2.9, 4.7, easeOut);
	return P({
		x: lerp(-1150, -470, a),
		y: lerp(-560, -30, a) + float(t, 0),
		z: lerp(-950, -100, a),
		rx: lerp(38, 0, a),
		ry: lerp(62, 9, a),
		rz: lerp(-24, 0, a),
		o: seg(t, 2.9, 3.5) * (1 - seg(t, 5.7, 6.2)),
		blur: lerp(6, 0, a),
	});
};

const shotPose = (t: number) => {
	const a = seg(t, 3.2, 5.0, easeOut);
	const r = seg(t, 5.6, 7.0);
	return P({
		x: lerp(lerp(1200, 470, a), 1000, r),
		y: lerp(-480, -20, a) + float(t, 2),
		z: lerp(lerp(-950, 60, a), -600, r),
		rx: lerp(-34, 0, a),
		ry: lerp(-58, -9, a),
		rz: lerp(22, 0, a),
		o: seg(t, 3.2, 3.8) * (1 - seg(t, 6.4, 7.2)),
		blur: lerp(6, 0, a) + lerp(0, 10, seg(t, 5.8, 7.0)),
	});
};

const footPose = (t: number) => {
	const e = seg(t, 5.6, 7.1);
	const f = seg(t, 7.5, 8.5);
	const d = seg(t, 10.0, 11.5);
	let x = lerp(-470, 0, e), y = lerp(-30, -20, e), w = lerp(520, 1120, e), h = lerp(400, 630, e);
	x = lerp(x, -330, f); y = lerp(y, -150, f); w = lerp(w, 760, f); h = lerp(h, 428, f);
	x = lerp(x, 0, d); y = lerp(y, -30, d); w = lerp(w, 520, d); h = lerp(h, 292, d);
	return conv(P({x, y, z: lerp(-100, 0, e), ry: lerp(9, 0, e), w, h, o: seg(t, 5.6, 6.1), blur: lerp(16, 0, seg(t, 6.2, 7.6))}), t);
};

const tlPose = (t: number) => {
	const a = seg(t, 7.4, 8.4, easeOut);
	const d = seg(t, 10.0, 11.3, easeIn);
	return P({
		y: lerp(lerp(620, 300, a), -30, d),
		z: lerp(lerp(-260, 0, a), -60, d),
		rx: lerp(25, 0, a),
		s: lerp(1, 0.32, d),
		o: seg(t, 7.4, 7.9) * (1 - seg(t, 10.7, 11.3)),
	});
};

const whPose = (t: number) => {
	const a = seg(t, 8.0, 9.0, easeOut);
	const d = seg(t, 10.0, 11.3, easeIn);
	return P({
		x: lerp(lerp(1150, 430, a), 0, d),
		y: lerp(-150, -30, d),
		z: lerp(lerp(-300, 0, a), -60, d),
		ry: lerp(-30, 0, a),
		s: lerp(1, 0.4, d),
		o: seg(t, 8.0, 8.5) * (1 - seg(t, 10.7, 11.3)),
	});
};

const cardB = (t: number) => {
	const a = seg(t, 10.6, 11.6, easeOut);
	return conv(P({x: lerp(0, 310, a), y: -50, z: lerp(-20, -80, a), ry: lerp(0, -16, a), o: seg(t, 10.6, 11.0)}), t);
};
const cardC = (t: number) => {
	const a = seg(t, 10.7, 11.7, easeOut);
	return conv(P({x: lerp(0, -310, a), y: -40, z: lerp(-20, -80, a), ry: lerp(0, 16, a), o: seg(t, 10.7, 11.1)}), t);
};

const barPose = (t: number) => {
	const m = seg(t, 11.4, 11.8);
	return conv(P({y: 190 + m * 40, w: lerp(520, 64, m), h: lerp(14, 64, m), o: seg(t, 10.3, 10.8)}), t);
};

const CHIPS: [number, number, number, number, number][] = [
	[-820, -300, -420, 120, 44], [760, -380, -300, 90, 36], [-640, 330, -200, 150, 40],
	[880, 260, -380, 110, 46], [-160, -420, -520, 100, 34], [300, 410, -260, 130, 38], [-960, 20, -600, 96, 40],
];
const chipPose = (i: number) => (t: number) => {
	const [x, y, z] = CHIPS[i];
	const a = seg(t, 3.0 + i * 0.1, 4.6 + i * 0.1, easeOut);
	return P({x: lerp(x * 1.4, x, a), y: lerp(y - 200, y, a) + float(t, i, 10), z, ry: 10, o: a * 0.55 * (1 - seg(t, 6.0, 7.0)), blur: 4 + (-z / 100)});
};

const Atmosphere: React.FC<{t: number}> = ({t}) => {
	const drift = Math.sin(t * 0.35) * 60;
	const pulse = 0.9 + 0.1 * Math.sin(t * 1.3);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1d1f23 0%, #131417 55%, #0b0b0d 100%)'}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 900px 700px at 8% 100%, rgba(255,140,60,${0.2 * pulse}), transparent 70%)`}} />
			<div style={{position: 'absolute', left: -200 + drift, top: -300, width: 2600, height: 260, transform: 'rotate(-28deg)', background: 'linear-gradient(90deg, transparent, rgba(255,214,170,0.11), transparent)', filter: 'blur(40px)', mixBlendMode: 'screen'}} />
			<div style={{position: 'absolute', left: 300 - drift, top: -150, width: 2600, height: 120, transform: 'rotate(-28deg)', background: 'linear-gradient(90deg, transparent, rgba(255,190,130,0.09), transparent)', filter: 'blur(28px)', mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

const Dust: React.FC<{t: number}> = ({t}) => (
	<AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
		{Array.from({length: 38}).map((_, i) => {
			const sz = 1.5 + random(`s${i}`) * 3.5;
			const x = random(`x${i}`) * 1920 + Math.sin(t * 0.4 + i) * 20;
			const y = (((random(`y${i}`) * 1080 - t * (8 + random(`v${i}`) * 22)) % 1080) + 1080) % 1080;
			return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: sz, background: '#ffd9ae', opacity: (0.1 + random(`o${i}`) * 0.35) * (0.6 + 0.4 * Math.sin(t * 2 + i)), filter: `blur(${sz > 3.5 ? 2 : 0.8}px)`}} />;
		})}
	</AbsoluteFill>
);

export const Film: React.FC = () => {
	const frame = useCurrentFrame();
	const t = Math.min(frame / FPS, HOLD_AT);
	const c = cam(t);
	const g = seg(t, 8.2, 9.9);
	const bloom = seg(t, 12.2, 12.65) * (1 - 0.88 * seg(t, 12.65, 13.0));
	const barP = seg(t, 10.4, 11.5, (x) => x * x * (3 - 2 * x));
	const barM = seg(t, 11.4, 11.8);
	const hold = frame / FPS >= HOLD_AT;

	const Footage = ({w, h, tt, gg}: {w: number; h: number; tt: number; gg: number}) => {
		const sc = Math.max(w / SW, h / SH);
		return (
			<div style={{position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 14}}>
				<div style={{position: 'absolute', left: '50%', top: '50%', width: SW, height: SH, transform: `translate(-50%,-50%) scale(${sc})`}}>
					<Scene g={gg} t={tt} />
				</div>
			</div>
		);
	};

	return (
		<AbsoluteFill style={{background: '#0b0b0d', overflow: 'hidden'}}>
			<svg width="0" height="0" style={{position: 'absolute'}}>
				<filter id="ca" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
					<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
					<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gg" />
					<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
					<feOffset in="r" dx={hold ? 0.6 : 1.5} dy="0" result="ro" />
					<feOffset in="b" dx={hold ? -0.6 : -1.5} dy="0" result="bo" />
					<feBlend in="ro" in2="gg" mode="screen" result="rg" />
					<feBlend in="rg" in2="bo" mode="screen" />
				</filter>
			</svg>

			<AbsoluteFill style={{filter: 'url(#ca)'}}>
				<Atmosphere t={t} />
				<AbsoluteFill style={{perspective: 1600, perspectiveOrigin: '50% 50%'}}>
					<div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${c.z}px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`}}>
						{CHIPS.map(([, , , w, h], i) => (
							<Panel key={i} pose={chipPose(i)} t={t} w={w} h={h} radius={12}>
								<div style={{position: 'absolute', left: 12, top: h / 2 - 3, width: w * 0.5, height: 6, borderRadius: 3, background: 'rgba(255,238,215,0.28)'}} />
							</Panel>
						))}
						<Panel pose={cardPose} t={t} w={720} h={440} radius={22}><CursorCard t={t} /></Panel>
						<Panel pose={moodPose} t={t} w={520} h={400}><Moodboard t={t} /></Panel>
						<Panel pose={shotPose} t={t} w={420} h={480}><ShotList t={t} /></Panel>
						<Panel pose={footPose} t={t} w={1120} h={630} glass={false} radius={14} style={{boxShadow: '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,232,205,0.2), 0 0 70px rgba(255,150,70,0.12)'}}>
							{({w, h}) => <Footage w={w} h={h} tt={t} gg={g} />}
						</Panel>
						<Panel pose={tlPose} t={t} w={1420} h={230}><Timeline t={t} g={g} /></Panel>
						<Panel pose={whPose} t={t} w={560} h={428}><ColorWheels t={t} g={g} /></Panel>
						<Panel pose={cardB} t={t} w={190} h={338} glass={false} radius={12} style={{boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,232,205,0.2)'}}>
							{({w, h}) => <Footage w={w} h={h} tt={t} gg={1} />}
						</Panel>
						<Panel pose={cardC} t={t} w={260} h={260} glass={false} radius={12} style={{boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,232,205,0.2)'}}>
							{({w, h}) => <Footage w={w} h={h} tt={t} gg={1} />}
						</Panel>
						<Panel pose={barPose} t={t} w={520} h={14} glass={false} radius={999} style={{background: 'rgba(255,238,215,0.1)', border: '1px solid rgba(255,232,205,0.2)'}}>
							<ProgressBar p={barP} m={barM} t={t} />
						</Panel>
					</div>
				</AbsoluteFill>
				<Dust t={t} />
				<AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(255,190,120,${0.55 * bloom}) 0, rgba(255,150,70,${0.18 * bloom}) 22%, transparent 45%)`, mixBlendMode: 'screen'}} />
				<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)'}} />
			</AbsoluteFill>

			<svg width="1920" height="1080" style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: hold ? 0.16 : 0.24}}>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={frame % 24} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="1920" height="1080" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};
