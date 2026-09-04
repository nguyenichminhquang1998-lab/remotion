import {z} from 'zod';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const benefitSchema = z.object({
	icon: z.enum(['heart', 'brain', 'shield', 'ribbon']),
	label: z.string(),
	description: z.string(),
});

const statSchema = z.object({
	label: z.string(),
	value: z.number(),
	suffix: z.string(),
});

export const beFastPromoSchema = z.object({
	brandName: z.string(),
	tagline: z.string(),
	ingredients: z.string(),
	flavour: z.string(),
	originBadge: z.string(),
	netWeight: z.string(),
	benefits: z.array(benefitSchema),
	stats: z.array(statSchema),
});

type Props = z.infer<typeof beFastPromoSchema>;

const PURPLE = '#5B2E8C';
const LIGHT_PURPLE = '#C9B7E8';
const WHITE = '#FFFFFF';
const W = 1080;
const H = 1920;

// Signature EKG/heartbeat line, matches the swoosh through the real "BeFAST" wordmark.
const HEARTBEAT_PATH =
	'M0,40 L110,40 L140,10 L170,70 L200,20 L230,60 L260,40 L1080,40';

const HeartbeatLine: React.FC<{progress: number; color: string}> = ({
	progress,
	color,
}) => {
	const pathLength = 1400;
	return (
		<svg width={W} height={80} viewBox={`0 0 ${W} 80`}>
			<path
				d={HEARTBEAT_PATH}
				stroke={color}
				strokeWidth={6}
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeDasharray={pathLength}
				strokeDashoffset={pathLength * (1 - progress)}
			/>
		</svg>
	);
};

const ICONS: Record<Props['benefits'][number]['icon'], React.FC<{color: string}>> = {
	heart: ({color}) => (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none">
			<path
				d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 5.5 3.5C14 6.2 15.5 5 17.5 5 21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z"
				stroke={color}
				strokeWidth={1.8}
			/>
			<path d="M4 12h3l1.5-3 2 5 1.5-3H20" stroke={color} strokeWidth={1.8} />
		</svg>
	),
	brain: ({color}) => (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none">
			<circle cx="12" cy="12" r="8" stroke={color} strokeWidth={1.8} />
			<circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
			<path d="M12 4v3M12 17v3M4 12h3M17 12h3" stroke={color} strokeWidth={1.8} />
		</svg>
	),
	shield: ({color}) => (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none">
			<path
				d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
				stroke={color}
				strokeWidth={1.8}
			/>
			<path d="M9 12l2 2 4-4" stroke={color} strokeWidth={1.8} />
		</svg>
	),
	ribbon: ({color}) => (
		<svg width={56} height={56} viewBox="0 0 24 24" fill="none">
			<circle cx="12" cy="8" r="5" stroke={color} strokeWidth={1.8} />
			<path d="M9 12l-2 9 5-3 5 3-2-9" stroke={color} strokeWidth={1.8} />
		</svg>
	),
};

const MilkSplash: React.FC<{progress: number}> = ({progress}) => {
	const drops = [
		{x: -160, y: -260, r: 14, delay: 0},
		{x: 180, y: -220, r: 10, delay: 0.1},
		{x: -220, y: 40, r: 8, delay: 0.2},
		{x: 230, y: 90, r: 12, delay: 0.05},
		{x: -80, y: -320, r: 7, delay: 0.15},
		{x: 100, y: -300, r: 9, delay: 0.25},
	];
	return (
		<>
			{drops.map((d, i) => {
				const p = Math.max(0, Math.min(1, (progress - d.delay) / 0.6));
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: d.r * 2,
							height: d.r * 2,
							borderRadius: '50%',
							background: WHITE,
							opacity: interpolate(p, [0, 0.7, 1], [0, 0.9, 0]),
							transform: `translate(${d.x * p}px, ${d.y * p}px)`,
						}}
					/>
				);
			})}
		</>
	);
};

export const BeFastPromo: React.FC<Props> = ({
	brandName,
	tagline,
	ingredients,
	flavour,
	originBadge,
	netWeight,
	benefits,
	stats,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Scene boundaries (seconds)
	const S1 = 0; // logo intro
	const S2 = 2.2; // benefits
	const S3 = 5.0; // nutrition stats
	const S4 = 7.6; // end card

	const t = frame / fps;

	// Scene 1: heartbeat draw + kinetic wordmark
	const heartbeatProgress = interpolate(t, [S1, S1 + 0.8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const wordmarkSpring = spring({
		frame: Math.max(0, frame - fps * (S1 + 0.5)),
		fps,
		config: {damping: 12, stiffness: 120, mass: 0.6},
	});
	const scene1Opacity = interpolate(t, [S2 - 0.5, S2], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Scene 2: benefit icons
	const scene2In = interpolate(t, [S2, S2 + 0.3], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scene2Opacity =
		scene2In * interpolate(t, [S3 - 0.4, S3], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const splashProgress = interpolate(t, [S2, S2 + 1.2], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Scene 3: nutrition count-up
	const scene3In = interpolate(t, [S3, S3 + 0.3], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const scene3Opacity =
		scene3In * interpolate(t, [S4 - 0.4, S4], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// Scene 4: end card
	const scene4Spring = spring({
		frame: Math.max(0, frame - fps * S4),
		fps,
		config: {damping: 200},
	});

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 30%, #E4DAF5 0%, ${LIGHT_PURPLE} 100%)`,
				fontFamily: 'Helvetica, Arial, sans-serif',
				overflow: 'hidden',
			}}
		>
			{/* Scene 1 — logo intro */}
			<AbsoluteFill
				style={{
					opacity: scene1Opacity,
					justifyContent: 'center',
					alignItems: 'center',
					display: t < S2 ? 'flex' : 'none',
				}}
			>
				<div style={{position: 'absolute', top: '38%'}}>
					<HeartbeatLine progress={heartbeatProgress} color={PURPLE} />
				</div>
				<div
					style={{
						transform: `scale(${interpolate(wordmarkSpring, [0, 1], [0.4, 1])})`,
						opacity: wordmarkSpring,
						textAlign: 'center',
					}}
				>
					<div style={{fontSize: 108, fontWeight: 900, color: PURPLE, letterSpacing: -1}}>
						{brandName}
					</div>
					<div style={{fontSize: 34, fontWeight: 600, color: PURPLE, marginTop: 12}}>
						{tagline}
					</div>
				</div>
			</AbsoluteFill>

			{/* Scene 2 — benefit icons */}
			<AbsoluteFill
				style={{
					opacity: scene2Opacity,
					justifyContent: 'center',
					alignItems: 'center',
					display: t >= S2 && t < S3 ? 'flex' : 'none',
				}}
			>
				<MilkSplash progress={splashProgress} />
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: 36,
						width: 780,
					}}
				>
					{benefits.map((b, i) => {
						const bSpring = spring({
							frame: Math.max(0, frame - fps * (S2 + 0.15 * i)),
							fps,
							config: {damping: 12, stiffness: 140},
						});
						const Icon = ICONS[b.icon];
						return (
							<div
								key={b.label}
								style={{
									opacity: bSpring,
									transform: `scale(${interpolate(bSpring, [0, 1], [0.6, 1])})`,
									background: WHITE,
									borderRadius: 20,
									padding: '28px 20px',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									textAlign: 'center',
									boxShadow: '0 20px 40px rgba(91,46,140,0.2)',
								}}
							>
								<Icon color={PURPLE} />
								<div style={{fontSize: 22, fontWeight: 800, color: PURPLE, marginTop: 10}}>
									{b.label}
								</div>
								<div style={{fontSize: 15, color: '#6b5a80', marginTop: 6, lineHeight: 1.35}}>
									{b.description}
								</div>
							</div>
						);
					})}
				</div>
			</AbsoluteFill>

			{/* Scene 3 — nutrition stats count-up */}
			<AbsoluteFill
				style={{
					opacity: scene3Opacity,
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					display: t >= S3 && t < S4 ? 'flex' : 'none',
				}}
			>
				<div style={{fontSize: 30, fontWeight: 700, color: PURPLE, marginBottom: 48}}>
					% Nhu cau dinh duong hang ngay (%DI) *
				</div>
				<div style={{display: 'flex', gap: 60}}>
					{stats.map((s, i) => {
						const statFrame = Math.max(0, frame - fps * (S3 + 0.2 * i));
						const statSpring = spring({frame: statFrame, fps, config: {damping: 200}});
						const count = Math.round(interpolate(statSpring, [0, 1], [0, s.value]));
						return (
							<div key={s.label} style={{textAlign: 'center'}}>
								<svg width={140} height={140} viewBox="0 0 140 140">
									<circle cx="70" cy="70" r="60" stroke="#ffffff88" strokeWidth={12} fill="none" />
									<circle
										cx="70"
										cy="70"
										r="60"
										stroke={PURPLE}
										strokeWidth={12}
										fill="none"
										strokeLinecap="round"
										strokeDasharray={377}
										strokeDashoffset={377 * (1 - (statSpring * s.value) / 100)}
										transform="rotate(-90 70 70)"
									/>
									<text
										x="70"
										y="80"
										textAnchor="middle"
										fontSize="34"
										fontWeight="800"
										fill={PURPLE}
									>
										{count}
										{s.suffix}
									</text>
								</svg>
								<div style={{fontSize: 18, fontWeight: 700, color: PURPLE, marginTop: 12}}>
									{s.label}
								</div>
							</div>
						);
					})}
				</div>
				<div style={{fontSize: 14, color: '#6b5a80', marginTop: 40}}>
					*Tren khau phan an trung binh 8700kJ
				</div>
			</AbsoluteFill>

			{/* Scene 4 — end card */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					display: t >= S4 ? 'flex' : 'none',
					opacity: scene4Spring,
				}}
			>
				<div
					style={{
						transform: `scale(${interpolate(scene4Spring, [0, 1], [0.85, 1])})`,
						background: PURPLE,
						borderRadius: 28,
						padding: '48px 44px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
					}}
				>
					<div style={{color: WHITE, fontSize: 56, fontWeight: 900}}>{brandName}</div>
					<div style={{color: LIGHT_PURPLE, fontSize: 20, fontWeight: 600, marginTop: 6}}>
						{tagline}
					</div>
					<div style={{color: WHITE, fontSize: 15, textAlign: 'center', marginTop: 18, lineHeight: 1.5}}>
						{ingredients}
					</div>
					<div style={{display: 'flex', gap: 12, marginTop: 26}}>
						<div
							style={{
								background: WHITE,
								color: PURPLE,
								fontSize: 15,
								fontWeight: 700,
								padding: '8px 18px',
								borderRadius: 999,
							}}
						>
							{flavour}
						</div>
						<div
							style={{
								border: `1px solid ${WHITE}`,
								color: WHITE,
								fontSize: 13,
								padding: '8px 16px',
								borderRadius: 999,
							}}
						>
							{originBadge}
						</div>
						<div
							style={{
								border: `1px solid ${WHITE}`,
								color: WHITE,
								fontSize: 13,
								padding: '8px 16px',
								borderRadius: 999,
							}}
						>
							{netWeight}
						</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
