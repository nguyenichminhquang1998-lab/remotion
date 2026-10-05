import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import './fonts/fonts.css';
import {lerp, seg} from './lib';

export const QB_FPS = 30;
export const QB_W = 1080;
export const QB_H = 1920;
export const QB_DURATION = 12 * QB_FPS;

// Band geometry (matches the reference: middle ~32% of a 9:16 frame)
const BAND_TOP = 620;
const BAND_H = 620;

// Brand font: drop UTMAndrogyne.ttf into public/fonts/ and it is picked up automatically.
const BRAND = "'UTM Androgyne', 'Cormorant Garamond', serif";
const SANS = "'Be Vietnam Pro', sans-serif";

export type Theme = {bg: string; bg2: string; ink: string; sub: string; gold: string; glow: string};
export const THEMES: Record<'ivory' | 'navy', Theme> = {
	// Royal Island: navy #123575 / gold #B9923F / ivory — same palette as the sunset key visuals
	ivory: {bg: '#F8EDC8', bg2: '#EFD99B', ink: '#10295F', sub: '#1B3F8C', gold: '#B38A35', glow: 'rgba(255,250,228,0.7)'},
	navy: {bg: '#10285A', bg2: '#0A1B40', ink: '#F7EBCB', sub: '#E5CD8D', gold: '#D9B96C', glow: 'rgba(60,100,180,0.35)'},
};

export type Block = {text: string; size: number; gap?: number; perChar?: number};
export type QuoteProps = {
	theme: 'ivory' | 'navy';
	font?: 'androgyne' | 'sans';
	blocks: Block[]; // one block = one line, written on in order
};

const inOut = Easing.bezier(0.65, 0, 0.25, 1);
const soft = Easing.bezier(0.22, 1, 0.36, 1);
const lin = (x: number) => x;

/** Write-on: characters are revealed one after another, each with a soft left→right wipe. */
const WriteOn: React.FC<{text: string; t: number; at: number; size: number; perChar: number; color: string; out: number; family: string; weight: number}> = ({text, t, at, size, perChar, color, out, family, weight}) => {
	const chars = Array.from(text.normalize('NFC'));
	const win = perChar * 3.2; // each glyph takes ~3 pen steps to ink in
	return (
		<div style={{display: 'flex', justifyContent: 'center', whiteSpace: 'pre', opacity: 1 - out, transform: `translateY(${-22 * out}px)`, filter: out > 0.02 ? `blur(${out * 6}px)` : undefined}}>
			{chars.map((ch, i) => {
				const p = seg(t, at + i * perChar, at + i * perChar + win, lin);
				const edge = p * 130 - 15; // soft edge travelling past the glyph
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							padding: '0.5em 0.3em 0.3em',
							margin: '-0.5em -0.3em -0.3em',
							fontFamily: family,
							fontWeight: weight,
							fontSize: size,
							lineHeight: 1.25,
							color,
							fontFeatureSettings: '"lnum" 1',
							WebkitMaskImage: `linear-gradient(100deg, #000 ${edge - 14}%, transparent ${edge + 6}%)`,
							maskImage: `linear-gradient(100deg, #000 ${edge - 14}%, transparent ${edge + 6}%)`,
							opacity: p > 0 ? 1 : 0,
						}}
					>
						{ch}
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
		const brand = new FontFace('UTM Androgyne', `url(${staticFile('fonts/UTMAndrogyne.ttf')})`, {weight: '100 900'});
		brand
			.load()
			.then((f) => document.fonts.add(f))
			.catch(() => undefined) // not installed yet → falls back to Cormorant Garamond
			.then(() => document.fonts.load("400 60px 'Cormorant Garamond'", 'ÀỞỮ'))
			.then(() => continueRender(h));
	}, [h]);
};

export const QuoteBand: React.FC<QuoteProps> = ({theme, blocks, font = 'androgyne'}) => {
	const family = font === 'sans' ? SANS : BRAND;
	const weight = font === 'sans' ? 700 : 600;
	useFonts();
	const frame = useCurrentFrame();
	const t = frame / QB_FPS;
	const C = THEMES[theme];

	// schedule: lines are written on back to back
	let cursor = 1.3;
	const sched = blocks.map((b) => {
		const perChar = b.perChar ?? 0.07;
		const at = cursor + (b.gap ?? 0.25);
		cursor = at + Array.from(b.text).length * perChar + perChar * 3.2;
		return {...b, perChar, at};
	});
	const writeEnd = cursor;
	const OUT_AT = writeEnd + 2.0;

	const open = inOut(seg(t, 0.15, 1.0, lin)) * (1 - inOut(seg(t, OUT_AT + 0.5, OUT_AT + 1.2, lin)));
	const line = soft(seg(t, 0, 0.8, lin)) * (1 - soft(seg(t, OUT_AT + 0.9, OUT_AT + 1.3, lin)));
	const out = inOut(seg(t, OUT_AT, OUT_AT + 0.7, lin));
	const half = (BAND_H / 2) * open;
	const cy = BAND_TOP + BAND_H / 2;

	return (
		<AbsoluteFill style={{background: 'transparent'}}>
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
			{[-1, 1].map((s) => (
				<div key={s} style={{position: 'absolute', left: (QB_W * (1 - line)) / 2, width: QB_W * line, top: cy + s * half - 1.5, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold} 18%, ${C.gold} 82%, transparent)`, opacity: 0.95}} />
			))}

			<div style={{position: 'absolute', left: 0, width: QB_W, top: BAND_TOP, height: BAND_H, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{height: 40, marginBottom: 14, opacity: 1 - out}}>
					<Star p={seg(t, 1.0, 1.7, lin)} color={C.gold} />
				</div>
				{sched.map((b, i) => (
					<div key={i} style={{marginTop: i === 0 ? 0 : i === 3 ? 8 : 0}}>
						<WriteOn text={b.text} t={t} at={b.at} size={font === 'sans' ? Math.round(b.size * 0.92) : b.size} perChar={b.perChar} color={C.ink} out={out} family={family} weight={weight} />
					</div>
				))}
				<div style={{width: 300 * soft(seg(t, writeEnd + 0.1, writeEnd + 0.9, lin)) * (1 - out), height: 2, marginTop: 14, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
			</div>
		</AbsoluteFill>
	);
};

export const quoteDefaults: Omit<QuoteProps, 'theme'> = {
	blocks: [
		{text: 'có bao nhiêu cuộc sống', size: 58},
		{text: 'đã được lớn lên', size: 58},
		{text: 'cùng những nơi mình xây.', size: 58},
		{text: 'Đó mới là', size: 58, gap: 0.5},
		{text: 'GIÁ TRỊ THỰC', size: 88, perChar: 0.09, gap: 0.2},
	],
};
