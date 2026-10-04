import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {RoyalIsland, RI_DURATION, RI_FPS, RI_H, RI_W} from './RoyalIsland';
import {DURATION, FPS, H, W} from './lib';

export const Root: React.FC = () => (
	<>
		<Composition id="ProductFilm" component={Film} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
		<Composition id="RoyalIsland" component={RoyalIsland} durationInFrames={RI_DURATION} fps={RI_FPS} width={RI_W} height={RI_H} />
	</>
);
