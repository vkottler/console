export class Dimensions {
  width: number;
  height: number;

  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  static from_element(elem: Element, square = false, scale = 1.0): Dimensions {
    let width = elem.clientWidth;
    let height = elem.clientHeight;

    if (square) {
      width = Math.min(width, height);
      height = Math.min(width, height);
    }

    width *= scale;
    height *= scale;

    return new Dimensions(width, height);
  }

  apply(elem: HTMLElement) {
    elem.style.width = `${this.width}px`;
    elem.style.height = `${this.height}px`;
  }
}
