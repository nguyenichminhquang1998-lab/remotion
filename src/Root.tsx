import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {RoyalIsland, RI_DURATION, RI_FPS, RI_H, RI_W} from './RoyalIsland';
import {QB_DURATION, QB_FPS, QB_H, QB_W, QuoteBand, quoteDefaults} from './QuoteBand';
import {VY_DURATION, VY_FPS, VY_H, VY_W, VuYenText} from './VuYenText';
import {SL_DURATION, SL_FPS, SL_H, SL_W, SaberLand} from './SaberLand';
import {SCENES, TT_FPS, TT_H, TT_W, TropicText} from './TropicText';
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
	</>
);
