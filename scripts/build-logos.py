"""Recorta os PNGs soltos em `images/` e gera o que o site usa.

    python scripts/build-logos.py

Os originais do Canva vêm em 2000x2000 com muita margem transparente: sem
recortar, a logo fica minuscula dentro da propria caixa. Gera:

  public/brand/hive-wordmark.png  — o lettering da navbar
  app/icon.png                    — o icone da aba
  public/brand/parceiros/*.png    — logos de parceiros, recortados

Requer Pillow (`pip install pillow`).
"""

from pathlib import Path

from PIL import Image, ImageDraw

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

    # Icone da aba: simbolo centrado num quadrado escuro arredondado.
    symbol = trimmed(IMAGES / "Logo2 Hive Fundo transparente.png")
    size, inner = 512, 300
    scale = inner / max(symbol.size)
    symbol = symbol.resize((round(symbol.width * scale), round(symbol.height * scale)), Image.LANCZOS)

    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(icon).rounded_rectangle((0, 0, size - 1, size - 1), radius=112, fill=(23, 23, 23, 255))
    icon.paste(symbol, ((size - symbol.width) // 2, (size - symbol.height) // 2), symbol)
    icon.save(APP / "icon.png", optimize=True)
    print("app/icon.png", icon.size)

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
