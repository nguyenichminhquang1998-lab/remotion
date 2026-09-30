import {Easing, interpolate} from 'remotion';

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 15 * FPS;
/** Everything animated freezes at this time: the logo-lock hold (last 2s). */
export const HOLD_AT = 13.0;

export const ease = Easing.bezier(0.45, 0, 0.15, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.6, 0, 0.9, 0.5);
export const easeBack = Easing.out(Easing.back(1.7));
export const linear = (x: number) => x;

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** 0→1 progress of t between a and b, clamped. */
export const seg = (t: number, a: number, b: number, e: (x: number) => number = ease) =>
	interpolate(t, [a, b], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: e,
	});

/** Keyframes with an easing applied per segment. */
export const kf = (t: number, pts: [number, number][], e: (x: number) => number = ease) => {
	if (t <= pts[0][0]) return pts[0][1];
	for (let i = 0; i < pts.length - 1; i++) {
		const [a, va] = pts[i];
		const [b, vb] = pts[i + 1];
		if (t < b) return lerp(va, vb, e((t - a) / (b - a)));
	}
	return pts[pts.length - 1][1];
};

export type Pose = {
	x: number;
	y: number;
	z: number;
	rx: number;
	ry: number;
	rz: number;
	s: number;
	o: number;
	blur: number;
	w?: number;
	h?: number;
};

export const P = (o: Partial<Pose>): Pose => ({
	x: 0,
	y: 0,
	z: 0,
	rx: 0,
	ry: 0,
	rz: 0,
	s: 1,
	o: 1,
	blur: 0,
	...o,
});
