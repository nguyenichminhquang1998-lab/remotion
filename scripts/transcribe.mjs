// Transcribe a video's audio into Remotion Caption JSON using Whisper.cpp.
// Vietnamese content needs a multilingual model (never a "*.en" one).
//
// Usage:
//   node scripts/transcribe.mjs "video 4.mp4"
//   node scripts/transcribe.mjs "video 4.mp4" --lang=en --model=small
//
// Output: public/<input-name-without-extension>-captions.json

import {execSync} from 'node:child_process';
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
	downloadWhisperModel,
	installWhisperCpp,
	toCaptions,
	transcribe,
} from '@remotion/install-whisper-cpp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const [, , inputArg, ...rest] = process.argv;

if (!inputArg) {
	console.error('Thieu ten file video. Vi du: node scripts/transcribe.mjs "video 4.mp4"');
	process.exit(1);
}

const flags = Object.fromEntries(
	rest
		.filter((arg) => arg.startsWith('--'))
		.map((arg) => arg.slice(2).split('=')),
);

const language = flags.lang ?? 'vi';
const model = flags.model ?? 'medium';

const videoPath = path.join(projectRoot, 'public', inputArg);
if (!existsSync(videoPath)) {
	console.error(`Khong tim thay file: ${videoPath}`);
	console.error('Dam bao da copy video vao thu muc public/ truoc.');
	process.exit(1);
}

const baseName = path.parse(inputArg).name;
const whisperDir = path.join(projectRoot, 'whisper.cpp');
const tmpDir = path.join(projectRoot, '.tmp-transcribe');
const wavPath = path.join(tmpDir, `${baseName}.wav`);
const outputJsonPath = path.join(projectRoot, 'public', `${baseName}-captions.json`);

mkdirSync(tmpDir, {recursive: true});

console.log('1/4 — Cai Whisper.cpp (lan dau se tai ve, cac lan sau dung lai)...');
await installWhisperCpp({to: whisperDir, version: '1.5.5'});

console.log(`2/4 — Tai model "${model}" (lan dau se tai ve, cac lan sau dung lai)...`);
await downloadWhisperModel({model, folder: whisperDir});

console.log('3/4 — Chuyen audio sang WAV 16kHz...');
execSync(`ffmpeg -y -i "${videoPath}" -ar 16000 -ac 1 "${wavPath}"`, {
	stdio: 'inherit',
});

console.log(`4/4 — Nhan dien giong noi (ngon ngu: ${language})...`);
const whisperCppOutput = await transcribe({
	model,
	whisperPath: whisperDir,
	whisperCppVersion: '1.5.5',
	inputPath: wavPath,
	language,
	tokenLevelTimestamps: true,
});

const {captions} = toCaptions({whisperCppOutput});
writeFileSync(outputJsonPath, JSON.stringify(captions, null, 2));

rmSync(tmpDir, {recursive: true, force: true});

console.log(`Xong. Da ghi ${outputJsonPath}`);
console.log(
	`Sua "videoFileName" va "captionsFileName" trong composition FootageCaptions (src/Root.tsx) thanh "${inputArg}" va "${baseName}-captions.json" roi render.`,
);
