import * as turf from '@turf/turf';
import * as maplibregl from 'maplibre-gl';
import type {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {useEffect, useRef, useState} from 'react';
import {z} from 'zod';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
	useDelayRender,
	useVideoConfig,
} from 'remotion';

export const realEstateLocationSchema = z.object({
	longitude: z.number(),
	latitude: z.number(),
	locationName: z.string(),
	subtitle: z.string(),
	accentColor: z.string(),
});

type Props = z.infer<typeof realEstateLocationSchema>;

export const RealEstateLocation: React.FC<Props> = ({
	longitude,
	latitude,
	locationName,
	subtitle,
	accentColor,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const frame = useCurrentFrame();
	const {delayRender, continueRender} = useDelayRender();
	const {durationInFrames, height, width} = useVideoConfig();
	const [map, setMap] = useState<MaplibreMap | null>(null);
	const [loadingHandle] = useState(() => delayRender('Loading MapLibre map'));

	const target: [number, number] = [longitude, latitude];

	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		maplibregl.setWorkerUrl(
			URL.createObjectURL(
				new Blob(
					[
						`import "https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl-worker.mjs";`,
					],
					{type: 'text/javascript'},
				),
			),
		);

		const mapInstance = new maplibregl.Map({
			container: containerRef.current,
			style: 'https://demotiles.maplibre.org/style.json',
			center: target,
			zoom: 11,
			interactive: false,
			// Required by the demo style's terms: keep provider attribution visible.
			attributionControl: {compact: true},
			fadeDuration: 0,
			canvasContextAttributes: {
				preserveDrawingBuffer: true,
			},
		});

		mapInstance.on('load', () => {
			mapInstance.addSource('location-marker', {
				type: 'geojson',
				data: turf.featureCollection([turf.point(target, {name: locationName})]),
			});

			mapInstance.addLayer({
				id: 'location-marker-dot',
				type: 'circle',
				source: 'location-marker',
				paint: {
					'circle-color': accentColor,
					'circle-radius': 14,
					'circle-stroke-color': '#ffffff',
					'circle-stroke-width': 4,
					'circle-opacity': 0,
					'circle-stroke-opacity': 0,
				},
			});

			mapInstance.addLayer({
				id: 'location-marker-label',
				type: 'symbol',
				source: 'location-marker',
				layout: {
					'text-allow-overlap': true,
					'text-anchor': 'top',
					'text-field': ['get', 'name'],
					'text-offset': [0, 1.1],
					'text-size': 30,
				},
				paint: {
					'text-color': '#111111',
					'text-halo-color': '#ffffff',
					'text-halo-width': 3,
					'text-opacity': 0,
				},
			});

			mapInstance.jumpTo({center: target, zoom: 11});
			mapInstance.once('idle', () => {
				setMap(mapInstance);
				continueRender(loadingHandle);
			});
		});
	}, [continueRender, loadingHandle, locationName, accentColor, target]);

	useEffect(() => {
		if (!map) {
			return;
		}

		const handle = delayRender('Rendering MapLibre frame');
		const timelineProgress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

		// Zoom-in only: camera stays centered on the target, no travel between two points.
		const zoom = interpolate(timelineProgress, [0, 0.7], [11, 16], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.22, 1, 0.36, 1),
		});
		const markerOpacity = interpolate(timelineProgress, [0.55, 0.72], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});

		map.jumpTo({center: target, zoom});
		map.setPaintProperty('location-marker-dot', 'circle-opacity', markerOpacity);
		map.setPaintProperty('location-marker-dot', 'circle-stroke-opacity', markerOpacity);
		map.setPaintProperty('location-marker-label', 'text-opacity', markerOpacity);

		map.once('idle', () => continueRender(handle));
		map.triggerRepaint();
	}, [continueRender, delayRender, durationInFrames, frame, map, target]);

	const captionOpacity = interpolate(
		frame,
		[durationInFrames * 0.6, durationInFrames * 0.75],
		[0, 1],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#e8eef3'}}>
			<div ref={containerRef} style={{height, position: 'absolute', width}} />
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
		</AbsoluteFill>
	);
};
