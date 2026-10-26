#!/usr/bin/env python3
"""Compose store artwork from unaltered simulator captures (Pillow).
Usage: python render-posters.py --raw /absolute/raw --out /absolute/output
No generated UI, fabricated metrics, or screenshot stretching.
"""
import argparse, hashlib, json
from functools import lru_cache
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CREAM='#F6F3ED'; INK='#101113'; RED='#E92D0B'; MUTED='#64615D'
FONTS=Path('/System/Library/Fonts')
FONT_EN=FONTS/'Supplemental/DIN Condensed Bold.ttf'
FONT_ZH=Path('/System/Library/AssetsV2/com_apple_MobileAsset_Font8/86ba2c91f017a3749571a82f2c6d890ac7ffb2fb.asset/AssetData/PingFang.ttc')
FONT_BODY=FONTS/'Supplemental/Arial.ttf'
FONT_ZH_BODY=FONT_ZH
COPY={
 'en':[
 ('home','MAKE IT.\nMAKE IT ADD UP.','A product idea. Your costs. A clearer next step.','PRODUCT IDEAS / COSTS / PRICING'),
 ('opportunities','FIND YOUR\nNEXT PRODUCT.','Explore ideas before choosing your machine.','01 / EXPLORE OPPORTUNITIES'),
 ('calculator','PRICE WITH\nTHE FULL PICTURE.','Model materials, labor, fees and equipment.','02 / TEST YOUR NUMBERS'),
 ('radar','ONE PRODUCT.\nYOUR NEXT TEST.','A weekly focus. Daily steps to validate it.','03 / FOLLOW THE RADAR'),
 ('learn','LEARN THE\nBUSINESS OF MAKING.','Bilingual guides. USD examples. Clear assumptions.','04 / BUILD YOUR KNOWLEDGE')],
 'zh':[
 ('home','先选产品，\n再算清生意。','一个产品方向，一套成本，下一步更清楚。','产品机会 / 完整成本 / 定价测算'),
 ('opportunities','发现值得\n验证的产品。','从产品机会出发，再决定生产设备。','01 / 发现产品机会'),
 ('calculator','把完整成本，\n算进售价。','材料、人工、渠道费、设备投入，一起考虑。','02 / 验证你的数字'),
 ('radar','每周一个方向，\n每天一步验证。','跟进产品聚焦，也回看过去的判断。','03 / 跟进商机雷达'),
 ('learn','会制作，\n也懂经营。','完整中英文指南，美元示例与清晰假设。','04 / 读懂创客生意')]
}
@lru_cache(maxsize=128)
def font(size,lang='en',body=False):
 return ImageFont.truetype(str((FONT_ZH_BODY if body else FONT_ZH) if lang=='zh' else (FONT_BODY if body else FONT_EN)),round(size),index=(3 if body else 11) if lang=='zh' else 0)
def text(draw,xy,s,size,lang='en',fill=INK,body=False,spacing=None):
 f=font(size,lang,body);x,y=xy
 for line in s.split('\n'):
  draw.text((round(x),round(y)),line,font=f,fill=fill,stroke_width=0)
  y += spacing or size*1.08
 return y

def frame(canvas,raw,box):
 """Contain the entire raw image; only mask the physical frame corners."""
 x,y,w,h=map(round,box)
 shot=Image.open(raw).convert('RGB');scale=min(w/shot.width,h/shot.height)
 sw,sh=round(shot.width*scale),round(shot.height*scale)
 x+=(w-sw)//2
 radius=max(20,round(sw*.045));border=max(5,round(sw*.009))
 shadow=Image.new('RGBA',canvas.size);sd=ImageDraw.Draw(shadow)
 sd.rounded_rectangle((x-14,y-8,x+sw+24,y+sh+32),radius+20,fill=(0,0,0,45))
 canvas.paste(Image.alpha_composite(canvas.convert('RGBA'),shadow.filter(ImageFilter.GaussianBlur(24))).convert('RGB'))
 d=ImageDraw.Draw(canvas);d.rounded_rectangle((x-border,y-border,x+sw+border,y+sh+border),radius+border,fill=INK)
 shot=shot.resize((sw,sh),Image.Resampling.LANCZOS)
 mask=Image.new('L',(sw,sh),0);ImageDraw.Draw(mask).rounded_rectangle((0,0,sw-1,sh-1),radius,fill=255)
 canvas.paste(shot,(x,y),mask)
 return (x,y,sw,sh)

def poster(raw,lang,key,out,outer=False,canvas=None):
 shot=Image.open(raw);w,h=canvas or shot.size
 im=Image.new('RGB',(w,h),CREAM);d=ImageDraw.Draw(im)
 title,sub,eyebrow=next((a[1],a[2],a[3]) for a in COPY[lang] if a[0]==key)
 unit=w/1320; margin=round(w*.065)
 d.rectangle((margin,round(h*.045),margin+round(w*.08),round(h*.049)),fill=RED)
 text(d,(margin+round(w*.10),h*.033),'MAKER BUSINESS LAB',38*unit,fill=INK)
 text(d,(margin,h*.075),eyebrow,28*unit,lang,fill=RED,body=(lang=='zh'))
 ts=(114 if lang=='en' else 103)*unit
 # Keep header copy within the top quarter at every accepted device size.
 y=text(d,(margin,h*.10),title,ts,lang,spacing=ts*1.04)
 sy=y+25*unit
 # Short text stays on one line, or two with a deterministic character wrap.
 maxwidth=w-2*margin;f=font(32*unit,lang,True)
 lines=[];line=''
 tokens=sub.split(' ') if lang=='en' else list(sub)
 for token in tokens:
  candidate=(line+' '+token).strip() if lang=='en' else line+token
  if d.textlength(candidate,font=f)>maxwidth and line:lines.append(line);line=token
  else:line=candidate
 lines.append(line)
 sy=text(d,(margin,sy),'\n'.join(lines),32*unit,lang,fill=MUTED,body=True,spacing=44*unit)
 top=max(sy+55*unit,h*.26)
 bottom=h*.955
 # The red corner marks are editorial framing, not data visualizations.
 d.polygon([(w*.77,top-15*unit),(w*.93,top-15*unit),(w*.93,top+170*unit)],fill=RED)
 b=frame(im,raw,(w*.075,top,w*.85,bottom-top))
 d=ImageDraw.Draw(im);text(d,(margin,h*.974),'MAKER / BUSINESS / LAB',21*unit,fill=MUTED)
 out.parent.mkdir(parents=True,exist_ok=True);im.save(out,optimize=True)
 return b

def creative(raw,lang,placement,out):
 w,h=(5244,2950) if placement=='header' else (3840,2560)
 im=Image.new('RGB',(w,h),CREAM);d=ImageDraw.Draw(im)
 d.polygon([(w-800,0),(w,0),(w,h),(w-360,h)],fill=RED)
 title='MAKE SOMETHING.\nMAKE IT ADD UP.' if lang=='en' else '先选产品，\n再算清生意。'
 sub='Product ideas. Costs. Pricing.' if lang=='en' else '产品机会 · 完整成本 · 定价测算'
 if placement=='header':
  # Apple's universal asset is cropped vertically to a wide banner and again
  # horizontally on phones. Put all critical content in the shared central zone.
  x=1260
  d.rectangle((x,860,x+125,870),fill=RED)
  text(d,(x,930),'MAKER BUSINESS LAB',61)
  yy=text(d,(x,1100),title,190,lang,spacing=210)
  text(d,(x,yy+70),sub,47,lang,fill=MUTED,body=True)
  frame(im,raw,(2860,820,1030,1360))
 else:
  margin=220
  d.rectangle((margin,round(h*.16),margin+150,round(h*.16)+12),fill=RED)
  text(d,(margin,round(h*.21)),'MAKER BUSINESS LAB',65)
  size=210 if lang=='en' else 205
  yy=text(d,(margin,round(h*.32)),title,size,lang,spacing=size*1.05)
  text(d,(margin,yy+60),sub,50,lang,fill=MUTED,body=True)
  frame(im,raw,(w*.55,h*.095,w*.39,h*.82))
 out.parent.mkdir(parents=True,exist_ok=True);im.save(out,optimize=True)


def main():
 p=argparse.ArgumentParser();p.add_argument('--raw',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
 manifest=[]
 for lang in COPY:
  for family in ('iphone','iphone-large','duo-inner'):
   for key,*_ in COPY[lang]:
    raw=a.raw/f'{"iphone" if family=="iphone-large" else family}-{lang}-{key}.png'
    if not raw.exists():continue
    out=a.out/('iphone-duo' if family=='duo-inner' else family)/lang/f'{key}.png'
    box=poster(raw,lang,key,out,canvas=(1320,2868) if family=='iphone-large' else None)
    manifest.append({'asset':str(out.relative_to(a.out)),'size':Image.open(out).size,'raw':raw.name,'rawSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'frame':box})
  raw=a.raw/f'duo-outer-{lang}-home.png'
  if raw.exists():
   out=a.out/'iphone-duo'/lang/'home-outer.png';poster(raw,lang,'home',out,True)
   manifest.append({'asset':str(out.relative_to(a.out)),'size':Image.open(out).size,'raw':raw.name,'rawSha256':hashlib.sha256(raw.read_bytes()).hexdigest()})
  raw=a.raw/f'duo-inner-{lang}-home.png'
  if raw.exists():
   for placement in ('header','search'):
    source=raw
    if not source.exists():source=raw
    out=a.out/'creative'/lang/f'{placement}.png';creative(source,lang,placement,out)
    manifest.append({'asset':str(out.relative_to(a.out)),'size':Image.open(out).size,'raw':source.name,'rawSha256':hashlib.sha256(source.read_bytes()).hexdigest()})
 a.out.mkdir(parents=True,exist_ok=True);(a.out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'assets':len(manifest),'out':str(a.out)}))
if __name__=='__main__':main()
