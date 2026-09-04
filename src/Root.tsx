import {Composition} from 'remotion';
import {IntroOutro, introOutroSchema} from './templates/IntroOutro';
import {LowerThird, lowerThirdSchema} from './templates/LowerThird';
import {CaseStudy, caseStudySchema} from './templates/CaseStudy';
import {BeFastPromo, beFastPromoSchema} from './templates/BeFastPromo';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="IntroOutro"
				component={IntroOutro}
				durationInFrames={90}
				fps={30}
				width={1920}
				height={1080}
				schema={introOutroSchema}
				defaultProps={{
					clientName: 'Ten Khach Hang',
					tagline: 'A film by XQuang',
					mode: 'intro',
					accentColor: '#d4af37',
				}}
			/>
			<Composition
				id="LowerThird"
				component={LowerThird}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				schema={lowerThirdSchema}
				defaultProps={{
					name: 'Nguyen Van A',
					subtitle: 'Giam doc sang tao',
					accentColor: '#d4af37',
				}}
			/>
			<Composition
				id="CaseStudy"
				component={CaseStudy}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				schema={caseStudySchema}
				defaultProps={{
					title: 'Ket qua chien dich',
					stats: [
						{label: 'Luot xem', value: 850, suffix: 'K'},
						{label: 'Ty le tuong tac', value: 12, suffix: '%'},
						{label: 'Khach hang moi', value: 34, suffix: ''},
					],
					accentColor: '#d4af37',
				}}
			/>
			<Composition
				id="BeFastPromo"
				component={BeFastPromo}
				durationInFrames={288}
				fps={30}
				width={1080}
				height={1920}
				schema={beFastPromoSchema}
				defaultProps={{
					brandName: 'BeFAST',
					tagline: 'With Colostrum',
					ingredients: 'Extrafolate-S, Omega-3 ALA, Phosphatidylserine',
					flavour: 'Vanilla Flavour',
					originBadge: 'New Zealand Made',
					netWeight: '650G',
					benefits: [
						{
							icon: 'heart',
							label: 'Omega-3 ALA',
							description: 'Supports healthy heart and vascular function',
						},
						{
							icon: 'brain',
							label: 'Phosphatidylserine',
							description: 'Supports normal brain function',
						},
						{
							icon: 'shield',
							label: 'Colostrum',
							description: 'A natural source of immunoglobulins',
						},
						{
							icon: 'ribbon',
							label: 'Extrafolate-S',
							description: 'Supports normal homocysteine metabolism',
						},
					],
					stats: [
						{label: 'Vitamin C', value: 89, suffix: '%'},
						{label: 'Folic Acid', value: 88, suffix: '%'},
						{label: 'Calcium', value: 49, suffix: '%'},
					],
				}}
			/>
		</>
	);
};
