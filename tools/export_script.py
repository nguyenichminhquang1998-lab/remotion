import os, re, subprocess, sys, shutil
B='/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
ids=[('S01','01-dep-la-dieu'),('S02a','02a-chuan-song'),('S02b','02b-cam-nhan'),('S03','03-kien-tao-boi'),('S04a','04a-the-tropic-quoc-te'),('S04b','04b-kien-truc-nhiet-doi'),('S04c','04c-khong-gian-khac-biet'),('S05a','05a-gia-tri-ben-vung'),('S05b','05b-phap-ly-minh-bach'),('S06','06-noi-thoi-gian')]
os.makedirs('out/script',exist_ok=True)
for v,vn in (('C','xam-trang'),('B','vang-dong')):
    for cid,name in ids:
        comp=f'{cid}{v}'; d=f'out/seq_{comp}'
        shutil.rmtree(d,ignore_errors=True)
        subprocess.run(['npx','remotion','render','src/index.ts',comp,d,'--sequence','--image-format=png',f'--browser-executable={B}','--log=error'],stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        f0=sorted(os.listdir(d))[0]; w=len(re.search(r'element-(\d+)\.png',f0).group(1))
        out=f'out/script/{vn}_{name}.mov'
        subprocess.run(['npx','remotion','ffmpeg','-y','-framerate','30','-i',f'{d}/element-%0{w}d.png','-vf','crop=1080:900:0:390','-c:v','prores_ks','-profile:v','4444','-bits_per_mb','500','-pix_fmt','yuva444p10le','-alpha_bits','8','-vendor','apl0',out],stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        shutil.rmtree(d,ignore_errors=True)
        print(out,round(os.path.getsize(out)/1e6,1),'MB',flush=True)
