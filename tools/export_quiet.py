import os, re, subprocess, shutil
B='/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
d='out/seq_quiet'; shutil.rmtree(d,ignore_errors=True)
subprocess.run(['npx','remotion','render','src/index.ts','QuietText',d,'--sequence','--image-format=png',f'--browser-executable={B}','--log=error'],stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
f0=sorted(os.listdir(d))[0]; w=len(re.search(r'element-(\d+)\.png',f0).group(1)); n=len(os.listdir(d)); print('frames',n,'w',w,flush=True)
# cut points sit in the silent gaps between spoken phrases
cuts=[0,4.9,10.2,13.1,16.9,20.0,27.8]
os.makedirs('out/quiet',exist_ok=True)
for i in range(len(cuts)-1):
    a,b=cuts[i],cuts[i+1]; out=f'out/quiet/quiet-luxury_{i+1}of{len(cuts)-1}_start-{a:g}s.mov'
    subprocess.run(['npx','remotion','ffmpeg','-y','-framerate','30','-start_number',str(round(a*30)),'-i',f'{d}/element-%0{w}d.png','-frames:v',str(min(round((b-a)*30),n-round(a*30))),'-vf','crop=1080:840:0:400','-c:v','prores_ks','-profile:v','4444','-bits_per_mb','500','-pix_fmt','yuva444p10le','-alpha_bits','8','-vendor','apl0',out],stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    print(out,round(os.path.getsize(out)/1e6,1),'MB',flush=True)
