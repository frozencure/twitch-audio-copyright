export class ColorTuple<T> {
  item: T;
  color: string;

  constructor(item: T, color: string) {
    this.item = item;
    this.color = color;
  }
}

export class ColorPaletteGenerator<T> {

  items: Array<T>;
  saturation: number;
  lighting: number;

  constructor(items: Array<T>, saturation: number, lighting: number) {
    this.items = items;
    this.saturation = saturation;
    this.lighting = lighting;
  }

  generateColors(): Array<ColorTuple<T>> {
    let step;
    if (this.items.length > 360) {
      step = 1;
    } else {
      step = Math.round(360 / this.items.length);
    }
    let colors = this.items.map((item, index) => {
      return this.hslToHex((index * step) % 360);
    });
    colors = ColorPaletteGenerator.shuffleArray(colors);
    return this.items.map((item, index) => {
      return new ColorTuple<T>(item, colors[index]);
    });
  }

  private static shuffleArray<P>(array: Array<P>): Array<P> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private hslToHex(h: number): string {
    let l = this.lighting;
    const s = this.saturation;
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
}
