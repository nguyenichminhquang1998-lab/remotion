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
// Windows' Expand-Archive (used internally by @remotion/install-whisper-cpp)
// breaks when any part of the path contains a space — including a Windows
// username with a space (e.g. "C:\Users\My PC\..."), which is outside this
// project's control. Allow overriding the install location to sidestep it:
//   WHISPER_CPP_DIR="C:/whisper-cpp" npm run transcribe -- "video.mp4"
const whisperDir = process.env.WHISPER_CPP_DIR
	? path.resolve(process.env.WHISPER_CPP_DIR)
	: path.join(projectRoot, 'whisper.cpp');
const tmpDir = path.join(projectRoot, '.tmp-transcribe');
const wavPath = path.join(tmpDir, `${baseName}.wav`);
const outputJsonPath = path.join(projectRoot, 'public', `${baseName}-captions.json`);

mkdirSync(tmpDir, {recursive: true});
mkdirSync(whisperDir, {recursive: true});

console.log('1/4 — Cai Whisper.cpp (lan dau se tai ve, cac lan sau dung lai)...');
// @remotion/install-whisper-cpp downloads the zip to `path.join(process.cwd(),
// "whisper-bin-x64.zip")` (hardcoded, not something the `to` option controls),
// then unzips it with Windows' Expand-Archive. If process.cwd() has a space
// in it anywhere (e.g. a Windows username like "My PC"), that download path
// alone breaks Expand-Archive even when `to` itself is space-free. Work
// around it by temporarily cd-ing into whisperDir (already guaranteed
// space-free when WHISPER_CPP_DIR is set) just for this one call.
const originalCwd = process.cwd();
process.chdir(whisperDir);
try {
	await installWhisperCpp({to: whisperDir, version: '1.5.5'});
} finally {
	process.chdir(originalCwd);
}

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
