import cv2, numpy as np, sys
from PIL import Image
U='/root/.claude/uploads/be50583a-08a7-5a54-b8ca-262ba7842680/'
SRC={'a':U+'91315bd9-image.jpg','d':U+'c941ab8a-image.jpg','b':U+'ebaa5aa1-image.jpg','c':U+'c2e3d305-image.jpg'}
# regions (x0,y0,x1,y1) containing baked text/logo; masks are colour-thresholded inside them
REG={
 'a':[(330,30,1280,890),(20,1930,400,1990)],
 'b':[(100,40,1200,440),(10,1235,240,1270)],
 'c':[(240,40,1050,500),(10,1240,240,1275)],
 'd':[(5,770,230,798)],
}
SKY={'a':[(600,30,1000,270),(450,280,1100,880),(350,440,470,560)],'b':[(120,40,1180,428)],'c':[(240,40,1050,490)]}
def mask_for(k,img):
    b,g,r=[img[:,:,i].astype(int) for i in range(3)]
    m=np.zeros(img.shape[:2],np.uint8)
    for (x0,y0,x1,y1) in REG[k]:
        sub=np.zeros_like(m)
        blue=(b>r+18)&(b>g-5)            # navy/blue text, logo
        white=(r>225)&(g>225)&(b>205)    # glints + white disclaimer
        dark=(r<110)&(g<120)&(b<150)      # navy logo strokes
        if k=='d': sel=np.ones_like(white)
        else: sel=blue
        sub[y0:y1,x0:x1]=sel[y0:y1,x0:x1].astype(np.uint8)*255
        m|=sub
    lum=(0.114*b+0.587*g+0.299*r)
    for (x0,y0,x1,y1) in SKY.get(k,[]):
        sub=np.zeros_like(m); sub[y0:y1,x0:x1]=((lum<192)|((r>225)&(g>225)&(b>205)))[y0:y1,x0:x1].astype(np.uint8)*255
        m|=sub
    # drop big blobs that are scenery (kept only when thin): open/close
    m=cv2.dilate(m,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(11,11)))
    return m
for k,p in SRC.items():
    img=cv2.imread(p)
    m=mask_for(k,img)
    cv2.imwrite(f'/tmp/claude-0/-home-user-remotion/be50583a-08a7-5a54-b8ca-262ba7842680/scratchpad/mask_{k}.png',m)
    out=cv2.inpaint(img,m,9,cv2.INPAINT_TELEA)
    cv2.imwrite(f'/tmp/claude-0/-home-user-remotion/be50583a-08a7-5a54-b8ca-262ba7842680/scratchpad/clean_{k}.jpg',out,[cv2.IMWRITE_JPEG_QUALITY,95])
    print(k,img.shape,int(m.sum()/255))
