import { Translation, is_vertical, is_horizontal } from "./Translation";

export class GridNode {
  above: Set<GridNode>;
  below: Set<GridNode>;
  left: Set<GridNode>;
  right: Set<GridNode>;

  constructor() {
    this.above = new Set();
    this.below = new Set();
    this.left = new Set();
    this.right = new Set();
  }

  destroy() {
    /*
     * Remove ourselves from nodes above us.
     */
    for (const above of this.above) {
      above.below.delete(this);
    }

    /*
     * Remove ourselves from nodes below us.
     */
    for (const below of this.below) {
      below.above.delete(this);
    }

    /*
     * Remove ourselves from nodes to the left of us.
     */
    for (const left of this.left) {
      left.right.delete(this);
    }

    /*
     * Remove ourselves from nodes to the right of us.
     */
    for (const right of this.right) {
      right.left.delete(this);
    }

    /*
     * Clear our connected nodes.
     */
    this.above.clear();
    this.below.clear();
    this.left.clear();
    this.right.clear();
  }

  move(direction: Translation): GridNode | undefined {
    /*
     * Return the first connected node in the provided direction.
     */
    switch (direction) {
      case Translation.UP:
        if (this.above.size > 0) {
          return this.above.values().next().value;
        }
        break;
      case Translation.DOWN:
        if (this.below.size > 0) {
          return this.below.values().next().value;
        }
        break;
      case Translation.LEFT:
        if (this.left.size > 0) {
          return this.left.values().next().value;
        }
        break;
      case Translation.RIGHT:
        if (this.right.size > 0) {
          return this.right.values().next().value;
        }
        break;
    }
  }

  move_create(direction: Translation): GridNode {
    const result = this.move(direction);
    if (result != undefined) {
      return result;
    }

    /*
     * If we have no connected nodes in the specified direction, create a new
     * one.
     */
    return this.#add_direction(direction);
  }

  #add_direction(direction: Translation): GridNode {
    const new_node = new GridNode();

    /*
     * Add direction relationships.
     */
    switch (direction) {
      case Translation.UP:
        this.above.add(new_node);
        new_node.below.add(this);
        break;
      case Translation.DOWN:
        this.below.add(new_node);
        new_node.above.add(this);
        break;
      case Translation.LEFT:
        this.left.add(new_node);
        new_node.right.add(this);
        break;
      case Translation.RIGHT:
        this.right.add(new_node);
        new_node.left.add(this);
        break;
    }

    /*
     * If the direction is vertical, share our horizontally connected nodes
     * with the new node. If the direction is horizontal, share our vertically
     * connected nodes.
     */
    if (is_vertical(direction)) {
      this.#share_horizontal(new_node);
    } else if (is_horizontal(direction)) {
      this.#share_vertical(new_node);
    }

    return new_node;
  }

  #share_vertical(other: GridNode) {
    for (const above of this.above) {
      other.above.add(above);
      above.below.add(other);
    }
    for (const below of this.below) {
      other.below.add(below);
      below.above.add(other);
    }
  }

  #share_horizontal(other: GridNode) {
    for (const left of this.left) {
      other.left.add(left);
      left.right.add(other);
    }
    for (const right of this.right) {
      other.right.add(right);
      right.left.add(other);
    }
  }
}
