import {z} from 'zod';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const lowerThirdSchema = z.object({
	name: z.string(),
	subtitle: z.string(),
	accentColor: z.string(),
});

type Props = z.infer<typeof lowerThirdSchema>;

export const LowerThird: React.FC<Props> = ({name, subtitle, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const enter = spring({frame, fps, config: {damping: 200, mass: 0.6}});
	const slideIn = interpolate(enter, [0, 1], [-60, 0]);

	const exitStart = durationInFrames - fps * 0.5;
	const exitProgress = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const opacity = Math.min(enter, 1) - exitProgress;

	return (
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
					<div style={{width: 6, height: 42, backgroundColor: accentColor}} />
					<div
						style={{
							color: 'white',
							fontSize: 36,
							fontWeight: 700,
							fontFamily: 'Helvetica, Arial, sans-serif',
							textShadow: '0 2px 10px rgba(0,0,0,0.6)',
						}}
					>
						{name}
					</div>
				</div>
				<div
					style={{
						color: accentColor,
						fontSize: 20,
						marginLeft: 20,
						marginTop: 4,
						fontFamily: 'Helvetica, Arial, sans-serif',
						textShadow: '0 2px 10px rgba(0,0,0,0.6)',
					}}
				>
					{subtitle}
				</div>
			</div>
		</AbsoluteFill>
	);
};
