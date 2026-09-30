import React from 'react';
import {FPS, Pose} from './lib';

type Size = {w: number; h: number};

/** A card living in the shared 3D world. Motion blur is derived from pose velocity. */
export const Panel: React.FC<{
	pose: (t: number) => Pose;
	t: number;
	w: number;
	h: number;
	glass?: boolean;
	radius?: number;
	style?: React.CSSProperties;
	children?: React.ReactNode | ((s: Size) => React.ReactNode);
}> = ({pose, t, w, h, glass = true, radius = 18, style, children}) => {
	const p = pose(t);
	if (p.o <= 0.002) return null;
	const q = pose(Math.max(0, t - 1 / FPS));
	const pw = p.w ?? w;
	const ph = p.h ?? h;
	const speed =
		Math.hypot(p.x - q.x, p.y - q.y, (p.z - q.z) * 0.6) + Math.abs(p.ry - q.ry) * 2 + Math.abs(p.rz - q.rz);
	const blur = Math.min(12, p.blur + Math.min(3.2, speed * 0.026));
	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: pw,
				height: ph,
				marginLeft: -pw / 2,
				marginTop: -ph / 2,
				borderRadius: radius,
				opacity: p.o,
				transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg) scale(${p.s})`,
				filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
				...(glass
					? {
							background:
								'linear-gradient(158deg, rgba(255,246,232,0.13), rgba(255,246,232,0.035) 38%, rgba(255,246,232,0.06))',
							border: '1px solid rgba(255,232,205,0.17)',
							boxShadow:
								'0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(255,150,70,0.05), inset 0 1px 0 rgba(255,238,215,0.4), inset 1px 0 0 rgba(255,238,215,0.12), inset 0 0 50px rgba(255,170,90,0.045)',
						}
					: {}),
				...style,
			}}
		>
			{typeof children === 'function' ? children({w: pw, h: ph}) : children}
		</div>
	);
};

export const Chrome: React.FC = () => (
	<div style={{position: 'absolute', left: 16, top: 12, display: 'flex', gap: 6}}>
		{[0, 1, 2].map((i) => (
			<div key={i} style={{width: 8, height: 8, borderRadius: 8, background: 'rgba(255,238,215,0.28)'}} />
		))}
	</div>
);
