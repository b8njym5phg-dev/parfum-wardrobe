#!/usr/bin/env python3
"""Verify and cache perfume images as mobile-friendly WebP files.

The output is only promoted to the site when all expected bottles are valid.
Never substitutes an unrelated product picture.
"""
import io, json, pathlib, urllib.request, urllib.parse, time, sys
from PIL import Image, ImageOps

ROOT=pathlib.Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/"assets/bottle-sources.json").read_text())
dest=ROOT/"bottles"
dest.mkdir(exist_ok=True)
success={}
failed=[]
headers={"User-Agent":"Mozilla/5.0 (compatible; perfume-wardrobe-gallery/1.0)", "Accept":"image/avif,image/webp,image/png,image/jpeg,image/*"}
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=18) as response:
        data=response.read(10_000_000)
        ct=response.headers.get("Content-Type","")
    if len(data)<800 or "text/html" in ct:
        raise ValueError("not an image")
    with Image.open(io.BytesIO(data)) as img:
        img.load()
        if img.width<90 or img.height<90: raise ValueError("image too small")
        if img.width/img.height>2.5: raise ValueError("likely banner")
        im=ImageOps.exif_transpose(img).convert("RGBA")
        canvas=Image.new("RGBA",(420,520),(255,255,255,0))
        im.thumbnail((400,490),Image.Resampling.LANCZOS)
        canvas.alpha_composite(im,((420-im.width)//2,(520-im.height)//2))
        buf=io.BytesIO();canvas.save(buf,"WEBP",quality=86,method=6)
        return buf.getvalue()
for item in rows:
    valid=False
    urls=list(item["urls"])
    for u in list(urls):
        if u.startswith("https://"):
            urls.append("https://images.weserv.nl/?url="+urllib.parse.quote(u.replace("https://",""),safe="")+"&w=500&h=650&fit=contain")
    for u in urls:
        try:
            data=get(u)
            target=dest/(str(item["id"])+".webp")
            target.write_bytes(data)
            success[str(item["id"])]=str(target.relative_to(ROOT))
            valid=True
            print(f"OK {item['id']:02} {item['name']} ({len(data)} bytes)",flush=True)
            break
        except Exception as e:
            print(f"RETRY {item['id']:02} {type(e).__name__}: {str(e)[:80]}",flush=True)
            time.sleep(.1)
    if not valid:
        failed.append({"id":item["id"],"name":item["name"],"sources":item["urls"]})
report={"validated":len(success),"expected":len(rows),"missing":failed,"generated_at":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime())}
(ROOT/"assets/bottle-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2))
print("SUMMARY",json.dumps({"validated":len(success),"expected":len(rows),"missing":[x["name"] for x in failed]},ensure_ascii=False),flush=True)
if failed:
    print("FAIL: Not promoting incomplete gallery",file=sys.stderr)
    sys.exit(1)
(ROOT/"assets/bottle-manifest.json").write_text(json.dumps(success,ensure_ascii=False))
