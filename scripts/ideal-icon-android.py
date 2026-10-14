"""Set Currículo Ideal icon in Capacitor-generated Android project (Pillow needed)."""
from pathlib import Path
from PIL import Image
root=Path('android/app/src/main/res')
src=Image.open('web/ideal-icon.png').convert('RGBA')
for folder,size in [('mipmap-mdpi',48),('mipmap-hdpi',72),('mipmap-xhdpi',96),('mipmap-xxhdpi',144),('mipmap-xxxhdpi',192)]:
    d=root/folder
    if not d.is_dir():continue
    icon=src.resize((size,size),Image.Resampling.LANCZOS)
    for name in ['ic_launcher.png','ic_launcher_round.png']:
        icon.save(d/name,optimize=True)
    # Native adaptive launchers expect larger foreground with safe margins.
    fg=Image.new('RGBA',(size*2,size*2),'white')
    small=src.resize((int(size*1.25),int(size*1.25)),Image.Resampling.LANCZOS)
    fg.alpha_composite(small,((size*2-small.width)//2,(size*2-small.height)//2))
    fg.save(d/'ic_launcher_foreground.png',optimize=True)
# Also replace launcher foregrounds in density-specific drawable resources, when present.
for d in root.glob('drawable-*'):
    f=d/'ic_launcher_foreground.png'
    if f.is_file():
        old=Image.open(f);size=old.size
        x=Image.new('RGBA',size,'white')
        side=int(min(size)*.65);sm=src.resize((side,side),Image.Resampling.LANCZOS)
        x.alpha_composite(sm,((size[0]-side)//2,(size[1]-side)//2))
        x.save(f,optimize=True)
print('Ícones do Android atualizados com a marca Currículo Ideal')