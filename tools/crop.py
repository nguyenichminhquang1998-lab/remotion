import sys
from PIL import Image, ImageDraw
S='/tmp/claude-0/-home-user-remotion/be50583a-08a7-5a54-b8ca-262ba7842680/scratchpad/ref/'
# usage: crop.py out.png scale  idx x0 y0 x1 y1 [idx x0 y0 x1 y1 ...]
out=sys.argv[1]; sc=int(sys.argv[2]); a=sys.argv[3:]
tiles=[]
for i in range(0,len(a),5):
    k=int(a[i]); x0,y0,x1,y1=map(int,a[i+1:i+5])
    im=Image.open(S+f'ex/e_{k:03d}.jpg').convert('RGB').crop((x0,y0,x1,y1)).resize(((x1-x0)*sc,(y1-y0)*sc),Image.LANCZOS)
    d=ImageDraw.Draw(im)
    for x in range((x0//25+1)*25,x1,25):
        d.line(((x-x0)*sc,0,(x-x0)*sc,6 if x%50 else 14),fill=(255,0,255)); 
        if x%50==0: d.text(((x-x0)*sc+2,14),str(x),fill=(255,0,255))
    for y in range((y0//25+1)*25,y1,25):
        d.line((0,(y-y0)*sc,6 if y%50 else 14,(y-y0)*sc),fill=(0,200,255))
        if y%50==0: d.text((16,(y-y0)*sc-5),str(y),fill=(0,200,255))
    d.text((2,2),f'{k*0.5:.1f}s',fill=(255,255,0))
    tiles.append(im)
W=max(t.width for t in tiles); H=sum(t.height for t in tiles)
sh=Image.new('RGB',(W,H),'gray'); y=0
for t in tiles: sh.paste(t,(0,y)); y+=t.height
sh.save(S+out)
