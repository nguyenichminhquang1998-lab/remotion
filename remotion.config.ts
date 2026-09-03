import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Chi dung khi chay trong moi truong cloud sandbox co san Chromium nay
// (khong ton tai tren may that -> Remotion se tu tai Chromium binh thuong).
const sandboxChromePath =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (existsSync(sandboxChromePath)) {
	Config.setBrowserExecutable(sandboxChromePath);
}
