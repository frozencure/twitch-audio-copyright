export class ColorTuple<T> {
  item: T;
  color: string;
}

export class ColorPaletteGenerator<T> {

  items: Array<T>;

  constructor(items: Array<T>) {
    this.items = items;
  }

  generateColors(): Array<ColorTuple<T>> {
    return [];
  }


}
