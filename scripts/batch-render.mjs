import {existsSync, readFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const dataFile = process.argv[2] ?? path.join(projectRoot, 'data', 'batch-example.json');
const outDir = path.join(projectRoot, 'out', 'batch');

const sandboxChromePath =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = existsSync(sandboxChromePath) ? sandboxChromePath : undefined;

const rows = JSON.parse(readFileSync(dataFile, 'utf-8'));

if (!Array.isArray(rows) || rows.length === 0) {
	console.error(`Khong tim thay danh sach video hop le trong ${dataFile}`);
	process.exit(1);
}

mkdirSync(outDir, {recursive: true});

console.log(`Dang bundle project (1 lan cho ca ${rows.length} video)...`);
const bundleLocation = await bundle({
	entryPoint: path.join(projectRoot, 'src', 'index.ts'),
});

for (const [i, row] of rows.entries()) {
	const {compositionId, outName, props} = row;
	if (!compositionId || !outName) {
		console.warn(`Bo qua dong ${i}: thieu "compositionId" hoac "outName"`);
		continue;
	}

	console.log(`[${i + 1}/${rows.length}] Dang render "${outName}" tu composition "${compositionId}"...`);

	const composition = await selectComposition({
		serveUrl: bundleLocation,
		id: compositionId,
		inputProps: props ?? {},
		browserExecutable,
	});

	const outputLocation = path.join(outDir, `${outName}.mp4`);
	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: 'h264',
		outputLocation,
		inputProps: props ?? {},
		browserExecutable,
	});

	console.log(`  -> ${outputLocation}`);
}

console.log(`Xong. ${rows.length} video da render vao ${outDir}`);
