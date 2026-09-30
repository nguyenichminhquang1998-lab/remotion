import React from 'react';
import {interpolateColors, random} from 'remotion';
import {easeBack, easeOut, lerp, seg} from './lib';
import {Chrome} from './Panel';

const MOOD = [
	['#c98a55', '#7a4a32'],
	['#6f8fa8', '#2d3f52'],
	['#e3c28f', '#a5673f'],
	['#3f4d5a', '#1a222a'],
	['#d9a86c', '#8a4b2e'],
	['#8ea3a8', '#4a5f66'],
	['#b56a4b', '#5a2f28'],
	['#e8d7b4', '#b89a6a'],
	['#546a7d', '#26333f'],
];

export const CursorCard: React.FC<{t: number}> = ({t}) => {
	// square-ish blink, ~0.53s half period, soft edges
	const ph = (t % 1.06) / 1.06;
	const on = ph < 0.5 ? 1 : 0;
	const soft = Math.min(1, Math.min(ph, Math.abs(ph - 0.5), 1 - ph) * 30 + (on ? 0.35 : 0));
	const o = on ? Math.max(0.35, soft) : 0.0;
	return (
		<>
			<Chrome />
			<div
				style={{
					position: 'absolute',
					inset: 34,
					border: '1.5px dashed rgba(255,232,205,0.12)',
					borderRadius: 12,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 150,
					top: 188,
					width: 5,
					height: 64,
					borderRadius: 2,
					background: '#ffe9c8',
					opacity: o,
					boxShadow: '0 0 22px rgba(255,190,110,0.9), 0 0 60px rgba(255,150,70,0.45)',
				}}
			/>
		</>
	);
};

export const Moodboard: React.FC<{t: number}> = ({t}) => (
	<>
		<Chrome />
		<div
			style={{
				position: 'absolute',
				left: 18,
				right: 18,
				top: 40,
				bottom: 18,
				display: 'grid',
				gridTemplateColumns: 'repeat(3,1fr)',
				gridTemplateRows: 'repeat(3,1fr)',
				gap: 10,
			}}
		>
			{MOOD.map(([a, b], i) => {
				const k = seg(t, 3.5 + i * 0.07, 3.95 + i * 0.07, easeOut);
				return (
					<div
						key={i}
						style={{
							borderRadius: 8,
							background: `linear-gradient(150deg, ${a}, ${b})`,
							opacity: k * 0.92,
							transform: `scale(${lerp(0.85, 1, k)})`,
							boxShadow: i === 4 ? '0 0 0 2px rgba(255,200,140,0.7), 0 0 30px rgba(255,160,80,0.35)' : 'none',
						}}
					/>
				);
			})}
		</div>
	</>
);

export const ShotList: React.FC<{t: number}> = ({t}) => (
	<>
		<Chrome />
		<div style={{position: 'absolute', left: 24, right: 24, top: 44, display: 'flex', gap: 10, alignItems: 'center'}}>
			<div style={{width: 22, height: 22, borderRadius: 22, background: 'rgba(255,190,120,0.55)'}} />
			<div style={{flex: 1, height: 10, borderRadius: 5, background: 'rgba(255,238,215,0.22)'}} />
		</div>
		{Array.from({length: 6}).map((_, i) => {
			const k = seg(t, 3.9 + i * 0.13, 4.4 + i * 0.13, easeOut);
			const [a, b] = MOOD[(i * 2 + 1) % 9];
			return (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: 24,
						right: 24,
						top: 92 + i * 64,
						height: 52,
						borderRadius: 10,
						background: 'rgba(255,238,215,0.05)',
						border: '1px solid rgba(255,232,205,0.09)',
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: '0 10px',
						opacity: k,
						transform: `translateX(${lerp(30, 0, k)}px)`,
					}}
				>
					<div style={{width: 62, height: 34, borderRadius: 6, background: `linear-gradient(150deg,${a},${b})`}} />
					<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 7}}>
						<div style={{height: 7, width: `${72 - (i % 3) * 14}%`, borderRadius: 4, background: 'rgba(255,238,215,0.3)'}} />
						<div style={{height: 6, width: `${48 + (i % 2) * 16}%`, borderRadius: 4, background: 'rgba(255,238,215,0.14)'}} />
					</div>
					<div
						style={{
							width: 12,
							height: 12,
							borderRadius: 12,
							background: i < 2 ? '#ffb46a' : i < 4 ? 'rgba(255,180,106,0.5)' : 'rgba(255,238,215,0.2)',
							boxShadow: i < 2 ? '0 0 12px rgba(255,170,90,0.8)' : 'none',
						}}
					/>
				</div>
			);
		})}
	</>
);

const CLIPS: [number, number, number][] = [
	[0, 0, 210], [0, 218, 150], [0, 376, 260], [0, 644, 180], [0, 832, 300], [0, 1140, 200],
	[1, 60, 300], [1, 368, 190], [1, 566, 320], [1, 894, 240], [1, 1142, 198],
];

export const Timeline: React.FC<{t: number; g: number}> = ({t, g}) => {
	const cool = ['#4f6d8b', '#3d566e', '#6c8aa6'];
	const warm = ['#d08a52', '#a9623c', '#e6b078'];
	const playhead = lerp(60, 1360, seg(t, 8.5, 10.0, (x) => x));
	return (
		<>
			<Chrome />
			<div style={{position: 'absolute', left: 40, right: 40, top: 36, height: 12, opacity: 0.5}}>
				{Array.from({length: 67}).map((_, i) => (
					<div key={i} style={{position: 'absolute', left: i * 20, top: 0, width: 1, height: i % 5 === 0 ? 12 : 6, background: 'rgba(255,238,215,0.5)'}} />
				))}
			</div>
			<div style={{position: 'absolute', left: 40, top: 62, width: 1340, height: 150}}>
				{[0, 1, 2].map((l) => (
					<div key={l} style={{position: 'absolute', left: 0, right: 0, top: l * 50, height: 40, borderRadius: 6, background: 'rgba(255,238,215,0.035)'}} />
				))}
				{CLIPS.map(([lane, x, w], i) => {
					const t0 = 7.9 + i * 0.14;
					const k = seg(t, t0, t0 + 0.42, easeBack);
					const flash = Math.exp(-Math.max(0, t - (t0 + 0.3)) * 7) * (t > t0 + 0.3 ? 1 : 0);
					const c = interpolateColors(g, [0, 1], [cool[i % 3], warm[i % 3]]);
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: x,
								top: lane * 50,
								width: w - 4,
								height: 40,
								borderRadius: 6,
								background: `linear-gradient(180deg, ${c}, ${interpolateColors(g, [0, 1], ['#2d3f52', '#6b3a28'])})`,
								opacity: seg(t, t0, t0 + 0.12),
								transform: `translateY(${lerp(-230, 0, k)}px) rotate(${lerp(-4, 0, k)}deg)`,
								boxShadow: `0 0 ${14 * flash}px rgba(255,200,140,${0.9 * flash}), inset 0 1px 0 rgba(255,255,255,0.25)`,
							}}
						/>
					);
				})}
				<div style={{position: 'absolute', left: 0, top: 100, width: 1340, height: 40, display: 'flex', alignItems: 'center', gap: 3, clipPath: `inset(0 ${100 - seg(t, 8.6, 9.5) * 100}% 0 0)`}}>
					{Array.from({length: 190}).map((_, i) => (
						<div key={i} style={{width: 4, height: 6 + random(`w${i}`) * 32 * (0.5 + 0.5 * Math.sin(i * 0.11) ** 2), borderRadius: 2, background: 'rgba(255,214,170,0.45)'}} />
					))}
				</div>
			</div>
			<div style={{position: 'absolute', left: playhead, top: 30, width: 2, height: 186, background: '#ffd9a8', boxShadow: '0 0 16px rgba(255,190,110,0.9)', opacity: seg(t, 8.4, 8.7)}}>
				<div style={{position: 'absolute', left: -6, top: -4, width: 14, height: 14, borderRadius: '3px 3px 50% 50%', background: '#ffd9a8'}} />
			</div>
		</>
	);
};

const Wheel: React.FC<{size: number; rot: number; from: [number, number]; to: [number, number]; g: number}> = ({size, rot, from, to, g}) => {
	const x = lerp(from[0], to[0], g) * size * 0.5;
	const y = lerp(from[1], to[1], g) * size * 0.5;
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					background: 'conic-gradient(hsl(0 70% 52%), hsl(60 70% 52%), hsl(120 55% 45%), hsl(180 60% 45%), hsl(240 65% 55%), hsl(300 60% 50%), hsl(360 70% 52%))',
					WebkitMaskImage: 'radial-gradient(circle, transparent 0 60%, #000 62%)',
					maskImage: 'radial-gradient(circle, transparent 0 60%, #000 62%)',
					transform: `rotate(${rot}deg)`,
					opacity: 0.9,
				}}
			/>
			<div style={{position: 'absolute', inset: size * 0.2, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #2c2d31, #141517)', border: '1px solid rgba(255,232,205,0.18)'}} />
			<div style={{position: 'absolute', left: size / 2 - 0.5, top: size * 0.2, width: 1, height: size * 0.6, background: 'rgba(255,238,215,0.1)'}} />
			<div style={{position: 'absolute', top: size / 2 - 0.5, left: size * 0.2, height: 1, width: size * 0.6, background: 'rgba(255,238,215,0.1)'}} />
			<div
				style={{
					position: 'absolute',
					left: size / 2 + x - 8,
					top: size / 2 + y - 8,
					width: 16,
					height: 16,
					borderRadius: 16,
					background: interpolateColors(g, [0, 1], ['#6fa6e0', '#ffa050']),
					border: '2px solid #fff3dd',
					boxShadow: '0 0 14px rgba(255,190,120,0.7)',
				}}
			/>
		</div>
	);
};

export const ColorWheels: React.FC<{t: number; g: number}> = ({t, g}) => {
	const size = 148;
	const rot = g * 220 + t * 12;
	const wheels: {f: [number, number]; to: [number, number]}[] = [
		{f: [-0.5, 0.55], to: [0.4, -0.4]},
		{f: [-0.3, 0.35], to: [0.35, -0.3]},
		{f: [-0.55, 0.3], to: [0.55, -0.15]},
	];
	return (
		<>
			<Chrome />
			<div style={{position: 'absolute', left: 30, right: 30, top: 64, display: 'flex', justifyContent: 'space-between'}}>
				{wheels.map((w, i) => (
					<Wheel key={i} size={size} rot={rot * (i % 2 ? -1 : 1)} from={w.f} to={w.to} g={g} />
				))}
			</div>
			<div style={{position: 'absolute', left: 36, right: 36, top: 268}}>
				{[0, 1, 2, 3].map((i) => (
					<div key={i} style={{position: 'relative', height: 8, borderRadius: 4, background: 'rgba(255,238,215,0.1)', marginBottom: 22}}>
						<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${lerp(30 + i * 6, 58 + ((i * 17) % 30), g)}%`, borderRadius: 4, background: 'linear-gradient(90deg, rgba(255,180,106,0.25), rgba(255,180,106,0.8))'}} />
						<div style={{position: 'absolute', top: -5, left: `${lerp(30 + i * 6, 58 + ((i * 17) % 30), g)}%`, width: 16, height: 16, borderRadius: 16, marginLeft: -8, background: '#fff1da', boxShadow: '0 0 10px rgba(255,190,120,0.6)'}} />
					</div>
				))}
			</div>
		</>
	);
};

export const ProgressBar: React.FC<{p: number; m: number; t: number}> = ({p, m, t}) => {
	const draw = seg(t, 11.7, 12.0);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 999,
					overflow: 'hidden',
					opacity: 1 - m,
				}}
			>
				<div
					style={{
						width: `${p * 100}%`,
						height: '100%',
						background: 'linear-gradient(90deg, #a9623c, #ffb46a 70%, #fff0d0)',
						boxShadow: '0 0 20px rgba(255,170,90,0.8)',
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 999,
					background: 'radial-gradient(circle at 35% 30%, #ffd9a8, #e08a44)',
					boxShadow: '0 0 40px rgba(255,160,80,0.75)',
					opacity: m,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<svg width="34" height="34" viewBox="0 0 34 34">
					<path d="M7 18 L14 25 L27 9" fill="none" stroke="#2a1608" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="34" strokeDashoffset={34 * (1 - draw)} />
				</svg>
			</div>
		</>
	);
};
