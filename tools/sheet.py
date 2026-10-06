import sys, os
from PIL import Image, ImageDraw
S='/tmp/claude-0/-home-user-remotion/be50583a-08a7-5a54-b8ca-262ba7842680/scratchpad/ref/'
a,b=int(sys.argv[1]),int(sys.argv[2]); name=sys.argv[3]
sh=Image.new('RGB',(1152,1024),'black')
for j,k in enumerate(range(a,b)):
    p=S+f'ex/e_{k:03d}.jpg'
    if not os.path.exists(p): continue
    im=Image.open(p).resize((288,512)); d=ImageDraw.Draw(im); d.rectangle((0,0,48,14),fill='black'); d.text((3,2),f'{k*0.5:.1f}s',fill='yellow')
    sh.paste(im,((j%4)*288,(j//4)*512))
sh.save(S+name,quality=90)
