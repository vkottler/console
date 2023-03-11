export class Namespace {
  stack: string[];
  delim: string;

  constructor(delim = ".") {
    this.stack = [];
    this.delim = delim;
  }

  push(name: string): number {
    this.stack.push(name);
    return this.stack.length;
  }

  pop(token: number): boolean {
    let result = false;
    if (this.stack.length == token) {
      result = true;
      this.stack.pop();
    }
    return result;
  }

  name(name?: string): string {
    let result = this.stack.join(this.delim);
    if (name != undefined) {
      result += this.delim + name;
    }
    return result;
  }
}
