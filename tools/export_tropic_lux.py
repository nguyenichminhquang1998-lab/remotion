import os, re, subprocess, sys, shutil
B='/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
ids=[('S01','01-dep-la-dieu'),('S02a','02a-chuan-song'),('S02b','02b-cam-nhan'),('S03','03-kien-tao-boi'),('S04a','04a-the-tropic-quoc-te'),('S04b','04b-kien-truc-nhiet-doi'),('S04c','04c-khong-gian-khac-biet'),('S05a','05a-gia-tri-ben-vung'),('S05b','05b-phap-ly-minh-bach'),('S06','06-noi-thoi-gian')]
os.makedirs('out/tropic_lux',exist_ok=True)
for v,vn in (('W','ivory-bickham'),):
    for cid,name in ids:
        comp='L'+cid[1:]; d=f'out/seq_{comp}'
        shutil.rmtree(d,ignore_errors=True)
        subprocess.run(['npx','remotion','render','src/index.ts',comp,d,'--sequence','--image-format=png',f'--browser-executable={B}','--log=error'],stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        f0=sorted(os.listdir(d))[0]; w=len(re.search(r'element-(\d+)\.png',f0).group(1))
        E=['-vf','crop=1080:900:0:390','-c:v','prores_ks','-profile:v','4444','-bits_per_mb','500','-pix_fmt','yuva444p10le','-alpha_bits','8','-vendor','apl0']
        # clips that would exceed 30MB are split into a/b at a frame where everything has already animated in
        parts=[(f'{name[:2]}a'+name[2:],0,100),(f'{name[:2]}b'+name[2:],100,None)] if cid=='S06' else [(name,0,None)]
        for pn,start,cnt in parts:
            out=f'out/tropic_lux/{vn}_{pn}.mov'
            cmd=['npx','remotion','ffmpeg','-y','-framerate','30','-start_number',str(start),'-i',f'{d}/element-%0{w}d.png']+(['-frames:v',str(cnt-start)] if cnt else [])+E+[out]
            subprocess.run(cmd,stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            print(out,round(os.path.getsize(out)/1e6,1),'MB',flush=True)
        shutil.rmtree(d,ignore_errors=True)
