import {z} from 'zod';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const beFastPromoSchema = z.object({
	brandName: z.string(),
	tagline: z.string(),
	ingredients: z.string(),
	flavour: z.string(),
	originBadge: z.string(),
});

type Props = z.infer<typeof beFastPromoSchema>;

const PURPLE = '#5B2E8C';
const LIGHT_PURPLE = '#C9B7E8';
const WHITE = '#FFFFFF';

export const BeFastPromo: React.FC<Props> = ({
	brandName,
	tagline,
	ingredients,
	flavour,
	originBadge,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Scene 1 (0-2s): can card + wordmark fade in
	const scene1 = spring({frame, fps, config: {damping: 200}});
	const canScale = interpolate(scene1, [0, 1], [0.85, 1]);

	// Scene 2 (2-4s): tagline + ingredients slide in
	const scene2Frame = Math.max(0, frame - fps * 2);
	const scene2 = spring({frame: scene2Frame, fps, config: {damping: 200}});

	// Scene 3 (4-6s): flavour + origin badge
	const scene3Frame = Math.max(0, frame - fps * 4);
	const scene3 = spring({frame: scene3Frame, fps, config: {damping: 200}});

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, ${LIGHT_PURPLE} 0%, #E4DAF5 100%)`,
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: 'Helvetica, Arial, sans-serif',
			}}
		>
			<div
				style={{
					opacity: scene1,
					transform: `scale(${canScale})`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						width: 460,
						padding: '48px 36px',
						borderRadius: 24,
						background: PURPLE,
						boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							color: WHITE,
							fontSize: 64,
							fontWeight: 800,
							letterSpacing: 1,
						}}
					>
						{brandName}
					</div>
					<div
						style={{
							color: LIGHT_PURPLE,
							fontSize: 26,
							marginTop: 8,
							fontWeight: 600,
						}}
					>
						{tagline}
					</div>

					<div
						style={{
							opacity: scene2,
							transform: `translateY(${interpolate(scene2, [0, 1], [16, 0])}px)`,
							color: WHITE,
							fontSize: 18,
							textAlign: 'center',
							marginTop: 28,
							lineHeight: 1.5,
						}}
					>
						{ingredients}
					</div>

					<div
						style={{
							opacity: scene3,
							transform: `translateY(${interpolate(scene3, [0, 1], [16, 0])}px)`,
							marginTop: 32,
							display: 'flex',
							gap: 12,
							alignItems: 'center',
						}}
					>
						<div
							style={{
								background: WHITE,
								color: PURPLE,
								fontSize: 16,
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
								fontSize: 14,
								padding: '8px 16px',
								borderRadius: 999,
							}}
						>
							{originBadge}
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
