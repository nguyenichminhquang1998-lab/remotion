import {z} from 'zod';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {realEstateLocationSchema} from './RealEstateLocation';

// Preview-only stand-in: same timing/motion as RealEstateLocation, but with a
// synthetic grid background instead of live MapLibre tiles, so the choreography
// can be inspected without network access to a map tile host. Not for delivery.

type Props = z.infer<typeof realEstateLocationSchema>;

export const RealEstateLocationPreview: React.FC<Props> = ({
	locationName,
	subtitle,
	accentColor,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const timelineProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Mirrors the real zoom curve (0 -> 0.7 of the timeline) from RealEstateLocation.
	const zoomScale = interpolate(timelineProgress, [0, 0.7], [1, 2.6], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.22, 1, 0.36, 1),
	});

	const markerOpacity = interpolate(timelineProgress, [0.55, 0.72], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const captionOpacity = interpolate(
		frame,
		[durationInFrames * 0.6, durationInFrames * 0.75],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#e8eef3', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transform: `scale(${zoomScale})`,
					backgroundColor: '#dfe6ec',
					backgroundImage:
						'repeating-linear-gradient(0deg, #c9d3db 0 2px, transparent 2px 90px),' +
						'repeating-linear-gradient(90deg, #c9d3db 0 2px, transparent 2px 90px)',
				}}
			/>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<div
					style={{
						opacity: markerOpacity,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							width: 28,
							height: 28,
							borderRadius: '50%',
							background: accentColor,
							border: '4px solid #ffffff',
							boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
						}}
					/>
				</div>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingBottom: 140,
					opacity: captionOpacity,
				}}
			>
				<div
					style={{
						background: 'rgba(0,0,0,0.65)',
						borderRadius: 16,
						padding: '20px 32px',
						textAlign: 'center',
					}}
				>
					<div style={{color: '#ffffff', fontSize: 28, fontWeight: 700}}>
						{locationName}
					</div>
					<div style={{color: accentColor, fontSize: 18, marginTop: 4}}>{subtitle}</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill
				style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 60}}
			>
				<div
					style={{
						background: '#c0392b',
						color: 'white',
						fontSize: 14,
						fontWeight: 700,
						padding: '6px 16px',
						borderRadius: 999,
					}}
				>
					XEM TRƯỚC — nền giả lập, không phải bản đồ thật
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
