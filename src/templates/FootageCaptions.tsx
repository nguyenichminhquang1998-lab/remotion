import type {Caption, TikTokPage} from '@remotion/captions';
import {createTikTokStyleCaptions} from '@remotion/captions';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {z} from 'zod';
import {
	AbsoluteFill,
	OffthreadVideo,
	Sequence,
	staticFile,
	useCurrentFrame,
	useDelayRender,
	useVideoConfig,
} from 'remotion';

export const footageCaptionsSchema = z.object({
	videoFileName: z.string(),
	captionsFileName: z.string(),
	accentColor: z.string(),
});

type Props = z.infer<typeof footageCaptionsSchema>;

// How often the caption page switches (ms). Lower = closer to word-by-word,
// higher = more words shown per page. 1200ms matches the skill's default.
const SWITCH_CAPTIONS_EVERY_MS = 1200;

const CaptionPage: React.FC<{page: TikTokPage; accentColor: string}> = ({
	page,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const currentTimeMs = (frame / fps) * 1000;
	const absoluteTimeMs = page.startMs + currentTimeMs;

	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 140}}>
			<div
				style={{
					maxWidth: '85%',
					textAlign: 'center',
					fontSize: 56,
					fontWeight: 800,
					fontFamily: 'Helvetica, Arial, sans-serif',
					whiteSpace: 'pre-wrap',
					lineHeight: 1.2,
					textShadow: '0 3px 12px rgba(0,0,0,0.8)',
				}}
			>
				{page.tokens.map((token, tokenIndex) => {
					const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;

					return (
						<span
							key={`${token.fromMs}-${tokenIndex}`}
							style={{color: isActive ? accentColor : 'white'}}
						>
							{token.text}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// Auto-generated kinetic captions ("TikTok style", word highlighting) burned
// on top of real footage. Captions are produced ahead of time by
// scripts/transcribe.mjs (Whisper) and read from a JSON file in public/ —
// see README for the transcribe -> render workflow.
export const FootageCaptions: React.FC<Props> = ({
	videoFileName,
	captionsFileName,
	accentColor,
}) => {
	const {fps} = useVideoConfig();
	const [captions, setCaptions] = useState<Caption[] | null>(null);
	const {delayRender, continueRender} = useDelayRender();
	const [handle] = useState(() => delayRender('Loading captions JSON'));

	const fetchCaptions = useCallback(async () => {
		const response = await fetch(staticFile(captionsFileName));
		const data = (await response.json()) as Caption[];
		setCaptions(data);
		continueRender(handle);
	}, [captionsFileName, continueRender, handle]);

	useEffect(() => {
		fetchCaptions();
	}, [fetchCaptions]);

	const {pages} = useMemo(() => {
		if (!captions) {
			return {pages: [] as TikTokPage[]};
		}
		return createTikTokStyleCaptions({
			captions,
			combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
		});
	}, [captions]);

	if (!captions) {
		return null;
	}

	return (
		<AbsoluteFill style={{backgroundColor: '#000000'}}>
			<OffthreadVideo src={staticFile(videoFileName)} />
			{pages.map((page, index) => {
				const nextPage = pages[index + 1] ?? null;
				const startFrame = Math.round((page.startMs / 1000) * fps);
				const endFrame = Math.round(
					Math.min(
						nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
						startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
					),
				);
				const durationInFrames = endFrame - startFrame;

				if (durationInFrames <= 0) {
					return null;
				}

				return (
					<Sequence key={index} from={startFrame} durationInFrames={durationInFrames}>
						<CaptionPage page={page} accentColor={accentColor} />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
