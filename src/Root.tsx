import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {RoyalIsland, RI_DURATION, RI_FPS, RI_H, RI_W} from './RoyalIsland';
import {QB_DURATION, QB_FPS, QB_H, QB_W, QuoteBand, quoteDefaults} from './QuoteBand';
import {VY_DURATION, VY_FPS, VY_H, VY_W, VuYenText} from './VuYenText';
import {SL_DURATION, SL_FPS, SL_H, SL_W, SaberLand} from './SaberLand';
import {SCENES, TT_FPS, TT_H, TT_W, TropicText} from './TropicText';
import {CLIPS, GT_FPS, GT_H, GT_W, GoldText} from './GoldText';
import {CLIPS as SCLIPS, TS_FPS, TS_H, TS_W, TropicScript} from './TropicScript';
import {QT_DURATION, QT_FPS, QT_H, QT_W, QuietText} from './QuietText';
import {DURATION, FPS, H, W} from './lib';

export const Root: React.FC = () => (
	<>
		<Composition id="ProductFilm" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
		<Composition id="RoyalIsland" component={RoyalIsland} durationInFrames={RI_DURATION} fps={RI_FPS} width={RI_W} height={RI_H} />
		<Composition id="QuoteBandIvory" component={QuoteBand} durationInFrames={QB_DURATION} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'ivory' as const, ...quoteDefaults}} />
		<Composition id="QuoteBandIvorySans" component={QuoteBand} durationInFrames={QB_DURATION} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'ivory' as const, font: 'sans' as const, ...quoteDefaults}} />
		<Composition id="QuoteBandIvory20" component={QuoteBand} durationInFrames={20 * QB_FPS} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'ivory' as const, pace: 1.5, outAt: 18.2, ...quoteDefaults}} />
		<Composition id="QuoteBandIvorySans20" component={QuoteBand} durationInFrames={20 * QB_FPS} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'ivory' as const, font: 'sans' as const, pace: 1.5, outAt: 18.2, ...quoteDefaults}} />
		<Composition id="QuoteBandNavy" component={QuoteBand} durationInFrames={QB_DURATION} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'navy' as const, ...quoteDefaults}} />
		<Composition id="VuYenText" component={VuYenText} durationInFrames={VY_DURATION} fps={VY_FPS} width={VY_W} height={VY_H} />
		<Composition id="SaberLand" component={SaberLand} durationInFrames={SL_DURATION} fps={SL_FPS} width={SL_W} height={SL_H} />
		<Composition id="TT01" component={TropicText} durationInFrames={Math.round(SCENES['01-dep-la-dieu'].dur * TT_FPS)} fps={TT_FPS} width={TT_W} height={TT_H} defaultProps={{beats: SCENES['01-dep-la-dieu'].beats}} />
		<Composition id="TT02" component={TropicText} durationInFrames={Math.round(SCENES['02-chuan-song'].dur * TT_FPS)} fps={TT_FPS} width={TT_W} height={TT_H} defaultProps={{beats: SCENES['02-chuan-song'].beats}} />
		<Composition id="TT03" component={TropicText} durationInFrames={Math.round(SCENES['03-kien-tao-boi'].dur * TT_FPS)} fps={TT_FPS} width={TT_W} height={TT_H} defaultProps={{beats: SCENES['03-kien-tao-boi'].beats}} />
		<Composition id="TT04" component={TropicText} durationInFrames={Math.round(SCENES['04-the-tropic'].dur * TT_FPS)} fps={TT_FPS} width={TT_W} height={TT_H} defaultProps={{beats: SCENES['04-the-tropic'].beats}} />
		<Composition id="TT05" component={TropicText} durationInFrames={Math.round(SCENES['05-gia-tri-ben-vung'].dur * TT_FPS)} fps={TT_FPS} width={TT_W} height={TT_H} defaultProps={{beats: SCENES['05-gia-tri-ben-vung'].beats}} />
		<Composition id="TT06" component={TropicText} durationInFrames={Math.round(SCENES['06-noi-thoi-gian'].dur * TT_FPS)} fps={TT_FPS} width={TT_W} height={TT_H} defaultProps={{beats: SCENES['06-noi-thoi-gian'].beats}} />
		<Composition id="G1" component={GoldText} durationInFrames={Math.round((9.6-7.6) * GT_FPS)} fps={GT_FPS} width={GT_W} height={GT_H} defaultProps={{lines: CLIPS[0].lines.map((l) => ({...l, in: {...l.in, a: l.in.a - 7.6, b: l.in.b - 7.6}, out: {...l.out, a: l.out.a - 7.6, b: l.out.b - 7.6}, ...(l.sheen ? {sheen: {a: l.sheen.a - 7.6, b: l.sheen.b - 7.6}} : {})}))}} />
		<Composition id="G2" component={GoldText} durationInFrames={Math.round((17.4-13.0) * GT_FPS)} fps={GT_FPS} width={GT_W} height={GT_H} defaultProps={{lines: CLIPS[1].lines.map((l) => ({...l, in: {...l.in, a: l.in.a - 13.0, b: l.in.b - 13.0}, out: {...l.out, a: l.out.a - 13.0, b: l.out.b - 13.0}, ...(l.sheen ? {sheen: {a: l.sheen.a - 13.0, b: l.sheen.b - 13.0}} : {})}))}} />
		<Composition id="G3" component={GoldText} durationInFrames={Math.round((21.1-17.6) * GT_FPS)} fps={GT_FPS} width={GT_W} height={GT_H} defaultProps={{lines: CLIPS[2].lines.map((l) => ({...l, in: {...l.in, a: l.in.a - 17.6, b: l.in.b - 17.6}, out: {...l.out, a: l.out.a - 17.6, b: l.out.b - 17.6}, ...(l.sheen ? {sheen: {a: l.sheen.a - 17.6, b: l.sheen.b - 17.6}} : {})}))}} />
		<Composition id="G4" component={GoldText} durationInFrames={Math.round((29.0-26.4) * GT_FPS)} fps={GT_FPS} width={GT_W} height={GT_H} defaultProps={{lines: CLIPS[3].lines.map((l) => ({...l, in: {...l.in, a: l.in.a - 26.4, b: l.in.b - 26.4}, out: {...l.out, a: l.out.a - 26.4, b: l.out.b - 26.4}, ...(l.sheen ? {sheen: {a: l.sheen.a - 26.4, b: l.sheen.b - 26.4}} : {})}))}} />
		{SCLIPS.flatMap((c) =>
			(['cool', 'bronze'] as const).map((v) => (
				<Composition key={c.name + v} id={`S${c.id}${v === 'cool' ? 'C' : 'B'}`} component={TropicScript} durationInFrames={Math.round(c.dur * TS_FPS)} fps={TS_FPS} width={TS_W} height={TS_H} defaultProps={{beat: c.beat, variant: v}} />
			)),
		)}
		<Composition id="QuietText" component={QuietText} durationInFrames={QT_DURATION} fps={QT_FPS} width={QT_W} height={QT_H} />
	</>
);
