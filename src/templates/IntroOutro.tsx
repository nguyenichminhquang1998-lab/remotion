import {z} from 'zod';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const introOutroSchema = z.object({
	clientName: z.string(),
	tagline: z.string(),
	mode: z.enum(['intro', 'outro']),
	accentColor: z.string(),
});

type Props = z.infer<typeof introOutroSchema>;

export const IntroOutro: React.FC<Props> = ({
	clientName,
	tagline,
	mode,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const enter = spring({frame, fps, config: {damping: 200, mass: 0.7}});
	const lineWidth = interpolate(enter, [0, 1], [0, 320]);

	const exitStart = durationInFrames - fps * 0.6;
	const exitProgress = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const opacity = mode === 'outro' ? 1 - exitProgress : Math.min(enter, 1) - exitProgress;
	const nameTranslate = interpolate(enter, [0, 1], [24, 0]);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0a0a0a',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: 'Georgia, "Times New Roman", serif',
			}}
		>
			<div
				style={{
					width: lineWidth,
					height: 1,
					backgroundColor: accentColor,
					marginBottom: 28,
					opacity,
				}}
			/>
			<div
				style={{
					color: 'white',
					fontSize: 64,
					letterSpacing: 6,
					textTransform: 'uppercase',
					opacity,
					transform: `translateY(${nameTranslate}px)`,
				}}
			>
				{clientName}
			</div>
			<div
				style={{
					color: accentColor,
					fontSize: 22,
					letterSpacing: 3,
					marginTop: 18,
					opacity: opacity * 0.9,
					fontFamily: 'Helvetica, Arial, sans-serif',
				}}
			>
				{tagline}
			</div>
		</AbsoluteFill>
	);
};
