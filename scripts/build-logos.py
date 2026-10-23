"""Recorta os PNGs soltos em `images/` e gera o que o site usa.

    python scripts/build-logos.py

Os originais do Canva vêm em 2000x2000 com muita margem transparente: sem
recortar, a logo fica minuscula dentro da propria caixa. Gera:

  public/brand/hive-wordmark.png  — o lettering da navbar
  public/brand/hive-symbol-trim.png — o simbolo recortado (hub das integracoes)
  app/icon.svg                    — o favicon (images/logo-hive-favicon.svg,
                                    com o viewBox recortado no logo)
  public/brand/parceiros/*.png    — logos de parceiros, recortados

Requer Pillow (`pip install pillow`).
"""

from pathlib import Path

import re

from PIL import Image

HERE = Path(__file__).resolve().parent
IMAGES = HERE.parent / "images"
BRAND = HERE.parent / "public" / "brand"
APP = HERE.parent / "app"


def trimmed(path: Path) -> Image.Image:
    """Recorta na caixa dos pixels nao transparentes."""
    image = Image.open(path).convert("RGBA")
    box = image.split()[3].getbbox()
    return image.crop(box)


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)

    wordmark = trimmed(IMAGES / "Logo Hive fundo transparente.png")
    wordmark.save(BRAND / "hive-wordmark.png", optimize=True)
    print("public/brand/hive-wordmark.png", wordmark.size)

    # Simbolo recortado: o hub das integracoes usa o logo oficial, nao um redesenho.
    symbol = trimmed(IMAGES / "Logo2 Hive Fundo transparente.png")
    symbol.save(BRAND / "hive-symbol-trim.png", optimize=True)
    print("public/brand/hive-symbol-trim.png", symbol.size)

    # Favicon: o SVG oficial tem o logo pequeno no meio de um canvas de
    # 2000x2000; recortar o viewBox no logo o deixa legivel em 16px. O
    # simbolo de entrada e um unico <path>, entao os limites saem dos numeros.
    source = (IMAGES / "logo-hive-favicon.svg").read_text(encoding="utf-8")
    points = [(float(x), float(y)) for x, y in re.findall(r"[ML] (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)", source)]
    xs, ys = [x for x, _ in points], [y for _, y in points]
    side = max(max(xs) - min(xs), max(ys) - min(ys)) * 1.04
    left, top = (min(xs) + max(xs) - side) / 2, (min(ys) + max(ys) - side) / 2
    icon = re.sub(r'width="\d+" height="\d+" viewBox="[^"]+"', f'width="512" height="512" viewBox="{left:.0f} {top:.0f} {side:.0f} {side:.0f}"', source, count=1)
    (APP / "icon.svg").write_text(icon, encoding="utf-8")
    print("app/icon.svg", f"viewBox {left:.0f} {top:.0f} {side:.0f} {side:.0f}")

    # Logos de parceiros: mesma margem vazia dos originais, mesmo recorte.
    partners_in = IMAGES / "parceiros"
    if partners_in.is_dir():
        partners_out = BRAND / "parceiros"
        partners_out.mkdir(parents=True, exist_ok=True)
        for source in sorted(partners_in.iterdir()):
            if source.suffix.lower() not in {".png", ".webp", ".jpg", ".jpeg"}:
                continue
            logo = trimmed(source)
            name = source.stem.lower().replace("_", "-").replace(" ", "-")
            logo.save(partners_out / f"{name}.png", optimize=True)
            print(f"public/brand/parceiros/{name}.png", logo.size)


if __name__ == "__main__":
    main()
