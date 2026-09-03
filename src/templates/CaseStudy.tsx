import {z} from 'zod';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const statSchema = z.object({
	label: z.string(),
	value: z.number(),
	suffix: z.string(),
});

export const caseStudySchema = z.object({
	title: z.string(),
	stats: z.array(statSchema),
	accentColor: z.string(),
});

type Props = z.infer<typeof caseStudySchema>;

const Stat: React.FC<{
	label: string;
	value: number;
	suffix: string;
	accentColor: string;
	delayFrames: number;
}> = ({label, value, suffix, accentColor, delayFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const localFrame = Math.max(0, frame - delayFrames);

	const enter = spring({frame: localFrame, fps, config: {damping: 200}});
	const count = Math.round(interpolate(enter, [0, 1], [0, value]));

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				opacity: enter,
				transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px)`,
			}}
		>
			<div style={{color: accentColor, fontSize: 72, fontWeight: 700}}>
				{count}
				{suffix}
			</div>
			<div
				style={{
					color: 'white',
					fontSize: 20,
					marginTop: 8,
					fontFamily: 'Helvetica, Arial, sans-serif',
					opacity: 0.85,
				}}
			>
				{label}
			</div>
		</div>
	);
};

export const CaseStudy: React.FC<Props> = ({title, stats, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const titleEnter = spring({frame, fps, config: {damping: 200}});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#0a0a0a',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<div
				style={{
					color: 'white',
					fontSize: 40,
					fontFamily: 'Georgia, serif',
					opacity: titleEnter,
					marginBottom: 60,
				}}
			>
				{title}
			</div>
			<div style={{display: 'flex', gap: 80}}>
				{stats.map((stat, i) => (
					<Stat
						key={stat.label}
						{...stat}
						accentColor={accentColor}
						delayFrames={i * (fps * 0.25)}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};
