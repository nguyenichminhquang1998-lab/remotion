import {Composition, staticFile} from 'remotion';
import {getVideoMetadata} from '@remotion/media-utils';
import {IntroOutro, introOutroSchema} from './templates/IntroOutro';
import {LowerThird, lowerThirdSchema} from './templates/LowerThird';
import {CaseStudy, caseStudySchema} from './templates/CaseStudy';
import {BeFastPromo, beFastPromoSchema} from './templates/BeFastPromo';
import {
	RealEstateLocation,
	realEstateLocationSchema,
} from './templates/RealEstateLocation';
import {RealEstateLocationPreview} from './templates/RealEstateLocationPreview';
import {
	FootageLowerThird,
	footageLowerThirdSchema,
} from './templates/FootageLowerThird';
import {FootageCaptions, footageCaptionsSchema} from './templates/FootageCaptions';

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
					clientName: 'Tên Khách Hàng',
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
					subtitle: 'Giám đốc sáng tạo',
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
					title: 'Kết quả chiến dịch',
					stats: [
						{label: 'Lượt xem', value: 850, suffix: 'K'},
						{label: 'Tỷ lệ tương tác', value: 12, suffix: '%'},
						{label: 'Khách hàng mới', value: 34, suffix: ''},
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
			<Composition
				id="RealEstateLocation"
				component={RealEstateLocation}
				durationInFrames={168}
				fps={30}
				width={1080}
				height={1920}
				schema={realEstateLocationSchema}
				defaultProps={{
					longitude: 106.6881,
					latitude: 20.8449,
					locationName: 'Trung tâm Hải Phòng',
					subtitle: 'Quận Hồng Bàng',
					accentColor: '#d4af37',
				}}
			/>
			<Composition
				id="RealEstateLocationPreview"
				component={RealEstateLocationPreview}
				durationInFrames={168}
				fps={30}
				width={1080}
				height={1920}
				schema={realEstateLocationSchema}
				defaultProps={{
					longitude: 106.6881,
					latitude: 20.8449,
					locationName: 'Trung tâm Hải Phòng',
					subtitle: 'Quận Hồng Bàng',
					accentColor: '#d4af37',
				}}
			/>
			<Composition
				id="FootageLowerThird"
				component={FootageLowerThird}
				fps={30}
				width={1920}
				height={1080}
				schema={footageLowerThirdSchema}
				defaultProps={{
					videoFileName: 'video 4.mp4',
					name: 'Nguyễn Thanh Tùng',
					stageName: 'Shartnuss',
					subtitle: 'Nghệ sĩ',
					accentColor: '#3d5a73',
					lowerThirdInFrame: 30,
					lowerThirdOutFrame: 120,
				}}
				// Reads the real clip's length + orientation from the file in
				// public/ instead of you having to measure/guess by hand.
				calculateMetadata={async ({props}) => {
					const {durationInSeconds, width, height} = await getVideoMetadata(
						staticFile(props.videoFileName),
					);
					return {
						durationInFrames: Math.floor(durationInSeconds * 30),
						width,
						height,
					};
				}}
			/>
			<Composition
				id="FootageCaptions"
				component={FootageCaptions}
				fps={30}
				width={1080}
				height={1920}
				schema={footageCaptionsSchema}
				defaultProps={{
					videoFileName: 'test giọng.mp4',
					captionsFileName: 'test giọng-captions.json',
					accentColor: '#39E508',
				}}
				calculateMetadata={async ({props}) => {
					const {durationInSeconds, width, height} = await getVideoMetadata(
						staticFile(props.videoFileName),
					);
					return {
						durationInFrames: Math.floor(durationInSeconds * 30),
						width,
						height,
					};
				}}
			/>
		</>
	);
};
