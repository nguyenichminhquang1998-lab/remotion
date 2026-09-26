import {loadFont} from '@remotion/google-fonts/EBGaramond';
import {z} from 'zod';
import {
	AbsoluteFill,
	interpolate,
	OffthreadVideo,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// Serif font to match the artist-credit style (bold name + italic role),
// e.g. the "Composer by Shatnuss" style seen in music-video end credits.
// Loaded from Google Fonts at render time — needs internet (works fine on
// a normal PC/office network; blocked in this cloud sandbox).
const {fontFamily} = loadFont(undefined, {
	weights: ['400', '700'],
	subsets: ['vietnamese', 'latin'],
});

export const footageLowerThirdSchema = z.object({
	videoFileName: z.string(),
	name: z.string(),
	// Optional second line under `name`, e.g. a stage/artist name.
	stageName: z.string().optional(),
	subtitle: z.string(),
	accentColor: z.string(),
	// Frame range (relative to the whole clip) the lower-third is shown for.
	lowerThirdInFrame: z.number(),
	lowerThirdOutFrame: z.number(),
});

type Props = z.infer<typeof footageLowerThirdSchema>;

// Overlays a name/title lower-third on top of real footage instead of a
// pure-graphics background. Clip length is read automatically from the
// video file via calculateMetadata (see Root.tsx) — no need to measure
// duration by hand each time you swap in a different clip.
export const FootageLowerThird: React.FC<Props> = ({
	videoFileName,
	name,
	stageName,
	subtitle,
	accentColor,
	lowerThirdInFrame,
	lowerThirdOutFrame,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame: frame - lowerThirdInFrame,
		fps,
		config: {damping: 200, mass: 0.6},
	});
	const slideIn = interpolate(enter, [0, 1], [-60, 0]);

	const exitStart = lowerThirdOutFrame - fps * 0.5;
	const exitProgress = interpolate(frame, [exitStart, lowerThirdOutFrame], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const visible = frame >= lowerThirdInFrame && frame <= lowerThirdOutFrame;
	const opacity = visible ? Math.min(enter, 1) - exitProgress : 0;

	return (
		<AbsoluteFill style={{backgroundColor: '#000000'}}>
			<OffthreadVideo src={staticFile(videoFileName)} />
			<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start'}}>
				<div
					style={{
						marginLeft: 80,
						marginBottom: 90,
						display: 'flex',
						flexDirection: 'column',
						transform: `translateX(${slideIn}px)`,
						opacity,
					}}
				>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<div style={{width: 6, height: stageName ? 66 : 42, backgroundColor: accentColor}} />
						<div style={{display: 'flex', flexDirection: 'column'}}>
							<div
								style={{
									color: 'white',
									fontSize: 36,
									fontWeight: 700,
									fontFamily,
									textShadow: '0 2px 10px rgba(0,0,0,0.6)',
								}}
							>
								{name}
							</div>
							{stageName ? (
								<div
									style={{
										color: 'white',
										fontSize: 28,
										fontStyle: 'italic',
										fontFamily,
										textShadow: '0 2px 10px rgba(0,0,0,0.6)',
									}}
								>
									{stageName}
								</div>
							) : null}
						</div>
					</div>
					<div
						style={{
							color: accentColor,
							fontSize: 20,
							fontStyle: 'italic',
							marginLeft: 20,
							marginTop: 4,
							fontFamily,
							textShadow: '0 2px 10px rgba(0,0,0,0.6)',
						}}
					>
						{subtitle}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
