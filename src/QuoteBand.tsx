import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import './fonts/fonts.css';
import {lerp, seg} from './lib';

export const QB_FPS = 30;
export const QB_W = 1080;
export const QB_H = 1920;
export const QB_DURATION = 9 * QB_FPS;

// Band geometry (matches the reference: middle ~32% of a 9:16 frame)
const BAND_TOP = 620;
const BAND_H = 620;

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Be Vietnam Pro', sans-serif";

export type Theme = {bg: string; bg2: string; ink: string; sub: string; gold: string; glow: string};
export const THEMES: Record<'ivory' | 'navy', Theme> = {
	// Royal Island: navy #123575 / gold #B9923F / ivory — same palette as the sunset key visuals
	ivory: {bg: '#F8EDC8', bg2: '#EFD99B', ink: '#10295F', sub: '#1B3F8C', gold: '#B38A35', glow: 'rgba(255,250,228,0.7)'},
	navy: {bg: '#10285A', bg2: '#0A1B40', ink: '#F7EBCB', sub: '#E5CD8D', gold: '#D9B96C', glow: 'rgba(60,100,180,0.35)'},
};

export type QuoteProps = {
	theme: 'ivory' | 'navy';
	headline: string[]; // each entry = one line, serif caps
	support: string[]; // each entry = one line, sans caps
};

const inOut = Easing.bezier(0.65, 0, 0.25, 1);
const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

const Words: React.FC<{text: string; t: number; at: number; size: number; family: string; weight: number; ls: string; color: string; stagger?: number; out: number}> = ({
	text, t, at, size, family, weight, ls, color, stagger = 0.13, out,
}) => {
	const words = text.split(' ');
	return (
		<div style={{display: 'flex', justifyContent: 'center', gap: size * 0.28, opacity: 1 - out, transform: `translateY(${-26 * out}px)`, filter: out > 0.02 ? `blur(${out * 6}px)` : undefined}}>
			{words.map((w, i) => {
				const p = seg(t, at + i * stagger, at + i * stagger + 0.8, lin);
				const e = soft(p);
				return (
					<span key={i} style={{display: 'inline-block', overflow: 'hidden', padding: '0.5em 0.12em 0.25em', margin: '-0.5em -0.12em -0.25em'}}>
						<span
							style={{
								display: 'inline-block',
								fontFamily: family,
								fontWeight: weight,
								fontSize: size,
								lineHeight: 1,
								letterSpacing: ls,
								color,
								fontFeatureSettings: '"lnum" 1',
								transform: `translateY(${lerp(115, 0, e)}%)`,
								opacity: Math.min(1, p * 3),
								filter: p < 1 ? `blur(${lerp(8, 0, e)}px)` : undefined,
							}}
						>
							{w}
						</span>
					</span>
				);
			})}
		</div>
	);
};

const Star: React.FC<{p: number; color: string}> = ({p, color}) => (
	<svg width="40" height="40" viewBox="-10 -10 20 20" style={{opacity: Math.min(1, p * 3), transform: `scale(${lerp(0.3, 1, soft(p))}) rotate(${lerp(-90, 0, soft(p))}deg)`}}>
		<path d="M0,-9 C0.7,-2.5 2.5,-0.7 9,0 C2.5,0.7 0.7,2.5 0,9 C-0.7,2.5 -2.5,0.7 -9,0 C-2.5,-0.7 -0.7,-2.5 0,-9Z" fill={color} />
	</svg>
);

const useFonts = () => {
	const [h] = React.useState(() => delayRender('fonts'));
	React.useEffect(() => {
		Promise.all([
			document.fonts.load("700 80px 'Cormorant Garamond'", 'ÀỞỮ'),
			document.fonts.load("700 30px 'Be Vietnam Pro'", 'ÀỞỮ'),
		]).then(() => continueRender(h));
	}, [h]);
};

export const QuoteBand: React.FC<QuoteProps> = ({theme, headline, support}) => {
	useFonts();
	const frame = useCurrentFrame();
	const t = frame / QB_FPS;
	const C = THEMES[theme];

	const IN_END = 1.0;
	const OUT_AT = 7.7;
	const open = inOut(seg(t, 0.15, IN_END, lin)) * (1 - inOut(seg(t, OUT_AT + 0.5, OUT_AT + 1.2, lin)));
	const line = soft(seg(t, 0, 0.8, lin)) * (1 - soft(seg(t, OUT_AT + 0.9, OUT_AT + 1.3, lin)));
	const out = inOut(seg(t, OUT_AT, OUT_AT + 0.7, lin));
	const half = (BAND_H / 2) * open;
	const cy = BAND_TOP + BAND_H / 2;

	return (
		<AbsoluteFill style={{background: 'transparent'}}>
			{/* band (opaque) — everything outside stays transparent */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					width: QB_W,
					top: cy - half,
					height: half * 2,
					background: `radial-gradient(ellipse 70% 90% at 50% 45%, ${C.glow}, transparent 70%), linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)`,
				}}
			/>
			{/* gold hairlines on band edges */}
			{[-1, 1].map((s) => (
				<div key={s} style={{position: 'absolute', left: (QB_W * (1 - line)) / 2, width: QB_W * line, top: cy + s * half - 1.5, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold} 18%, ${C.gold} 82%, transparent)`, opacity: 0.95}} />
			))}

			<div style={{position: 'absolute', left: 0, width: QB_W, top: BAND_TOP, height: BAND_H, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{height: 40, marginBottom: 26, opacity: 1 - out}}>
					<Star p={seg(t, 1.0, 1.7, lin)} color={C.gold} />
				</div>
				{headline.map((l, i) => (
					<Words key={i} text={l} t={t} at={1.3 + i * 0.5} size={78} family={SERIF} weight={700} ls="0.01em" color={C.ink} out={out} />
				))}
				<div style={{width: 360 * soft(seg(t, 2.3, 3.1, lin)) * (1 - out), height: 2, margin: '34px 0 30px', background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
				{support.map((l, i) => (
					<div key={i} style={{marginTop: i ? 12 : 0}}>
						<Words text={l} t={t} at={2.5 + i * 0.35} size={38} family={SANS} weight={700} ls="0.08em" color={C.sub} stagger={0.1} out={out} />
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

export const quoteDefaults: Omit<QuoteProps, 'theme'> = {
	headline: ['TÀI SẢN CHO HÔM NAY'],
	support: ['MÔI TRƯỜNG TRƯỞNG THÀNH', 'CHO NGÀY MAI'],
};
