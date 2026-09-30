import React from 'react';
import {lerp} from './lib';

export const SW = 1120;
export const SH = 630;

/**
 * The "footage": an empty road, poles and mountains at dusk — no people.
 * g: 0 = cool/flat grade, 1 = warm filmic grade.
 */
export const Scene: React.FC<{g: number; t: number}> = ({g, t}) => {
	const push = 1.05 + t * 0.005;
	const sunY = 330 + t * 2;
	const poles: [number, number, number][] = [
		[768, 452, 36],
		[836, 440, 62],
		[936, 414, 110],
		[1074, 366, 190],
	];
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				overflow: 'hidden',
				filter: `saturate(${lerp(0.72, 1.18, g)}) contrast(${lerp(0.94, 1.1, g)})`,
			}}
		>
			<svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={{transform: `scale(${push})`, transformOrigin: '62% 55%'}}>
				<defs>
					<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#4a6a90" />
						<stop offset="0.55" stopColor="#a7bacb" />
						<stop offset="1" stopColor="#efdcc0" />
					</linearGradient>
					<radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
						<stop offset="0" stopColor="#fff6e2" stopOpacity="0.95" />
						<stop offset="0.25" stopColor="#ffe6bd" stopOpacity="0.45" />
						<stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
					</radialGradient>
					<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#2a343d" />
						<stop offset="1" stopColor="#12181d" />
					</linearGradient>
					<filter id="soft"><feGaussianBlur stdDeviation="14" /></filter>
					<filter id="soft2"><feGaussianBlur stdDeviation="2" /></filter>
				</defs>
				<rect width={SW} height={SH} fill="url(#sky)" />
				<ellipse cx="260" cy="150" rx="230" ry="26" fill="#fff" opacity="0.22" filter="url(#soft)" />
				<ellipse cx="880" cy="110" rx="260" ry="20" fill="#fff" opacity="0.18" filter="url(#soft)" />
				<circle cx="760" cy={sunY} r="260" fill="url(#sun)" />
				<circle cx="760" cy={sunY} r="30" fill="#fff5dc" />
				<rect x="240" y={sunY - 1.5} width="1040" height="3" fill="#fff0d0" opacity={0.55 * g} filter="url(#soft2)" />
				<path d="M0,360 L120,322 L230,346 L380,292 L520,340 L640,302 L790,352 L930,312 L1120,346 L1120,630 L0,630Z" fill="#8797a6" />
				<path d="M0,412 L160,372 L300,402 L470,352 L620,406 L800,374 L980,410 L1120,386 L1120,630 L0,630Z" fill="#5a6b7b" />
				<path d="M0,472 L200,442 L380,470 L560,432 L760,468 L950,440 L1120,464 L1120,630 L0,630Z" fill="#35434f" />
				<rect x="0" y="470" width={SW} height="160" fill="url(#ground)" />
				<path d="M692,470 L712,470 L990,630 L380,630Z" fill="#1c2329" />
				<path d="M702,472 L684,630" stroke="#d9c8a4" strokeWidth="3" strokeDasharray="14 22" opacity="0.7" />
				{poles.map(([x, y, h], i) => (
					<g key={i} stroke="#0f1418" strokeWidth={2 + i * 1.5} strokeLinecap="round">
						<line x1={x} y1={y} x2={x} y2={y - h} />
						<line x1={x - 10 - i * 4} y1={y - h + 6} x2={x + 10 + i * 4} y2={y - h + 6} />
					</g>
				))}
				{poles.slice(0, -1).map(([x, y, h], i) => {
					const [nx, ny, nh] = poles[i + 1];
					return (
						<path
							key={i}
							d={`M${x},${y - h + 6} Q${(x + nx) / 2},${(y - h + ny - nh) / 2 + 14 + i * 4} ${nx},${ny - nh + 6}`}
							stroke="#0f1418"
							strokeWidth="1.5"
							fill="none"
						/>
					);
				})}
				<g fill="#0e1418">
					<rect x="226" y="440" width="7" height="46" />
					<circle cx="230" cy="424" r="30" />
					<circle cx="206" cy="440" r="22" />
					<circle cx="254" cy="438" r="24" />
				</g>
			</svg>
			{/* Grade: cool (flat, teal-blue) → warm filmic */}
			<div style={{position: 'absolute', inset: 0, background: 'rgb(140,182,232)', mixBlendMode: 'multiply', opacity: 0.7 * (1 - g)}} />
			<div style={{position: 'absolute', inset: 0, background: 'rgb(255,138,48)', mixBlendMode: 'soft-light', opacity: 0.8 * g}} />
			<div style={{position: 'absolute', inset: 0, background: 'rgb(255,168,92)', mixBlendMode: 'screen', opacity: 0.1 * g}} />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'radial-gradient(ellipse at 50% 50%, transparent 48%, rgba(8,6,4,0.62) 100%)',
				}}
			/>
		</div>
	);
};
