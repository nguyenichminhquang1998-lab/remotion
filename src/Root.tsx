import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {RoyalIsland, RI_DURATION, RI_FPS, RI_H, RI_W} from './RoyalIsland';
import {QB_DURATION, QB_FPS, QB_H, QB_W, QuoteBand, quoteDefaults} from './QuoteBand';
import {DURATION, FPS, H, W} from './lib';

export const Root: React.FC = () => (
	<>
		<Composition id="ProductFilm" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
		<Composition id="RoyalIsland" component={RoyalIsland} durationInFrames={RI_DURATION} fps={RI_FPS} width={RI_W} height={RI_H} />
		<Composition id="QuoteBandIvory" component={QuoteBand} durationInFrames={QB_DURATION} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'ivory' as const, ...quoteDefaults}} />
		<Composition id="QuoteBandIvorySans" component={QuoteBand} durationInFrames={QB_DURATION} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'ivory' as const, font: 'sans' as const, ...quoteDefaults}} />
		<Composition id="QuoteBandNavy" component={QuoteBand} durationInFrames={QB_DURATION} fps={QB_FPS} width={QB_W} height={QB_H} defaultProps={{theme: 'navy' as const, ...quoteDefaults}} />
	</>
);
