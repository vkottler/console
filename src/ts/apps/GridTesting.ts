import assert from "assert";

import { App } from "../App";
import {
  allTranslations,
  eventDirection,
  translationName,
} from "../cartesian/Translation";
import { ModKeyFlag } from "../control/Keybind";
import { GridDimensions } from "../grid/GridDimensions";
import {
  CursorUpdate,
  ElementArea,
  GridAreaUpdateHandler,
  GridLayoutManager,
} from "../grid/GridLayoutManager";

export class SampleApp extends App {
  layout: GridLayoutManager;
  gridAreaUpdateHandler: GridAreaUpdateHandler;

  constructor(root: Element) {
    super(root);

    this.layout = new GridLayoutManager(
      this.app,
      ((event: CustomEvent<CursorUpdate>) => {
        const curr = event.detail.curr;
        const prev = event.detail.prev;
        if (curr != undefined) {
          curr.element.style.borderStyle = "solid";
          curr.element.style.backgroundColor = "green";
        }
        if (prev != undefined) {
          prev.element.style.borderStyle = "none";
          prev.element.style.backgroundColor = "white";
        }
      }).bind(this)
    );

    this.gridAreaUpdateHandler = (event: CustomEvent<ElementArea>) => {
      const area = event.detail.area;

      const parts = [];
      parts.push(`name: ${area.name}`);
      parts.push(`row: ${area.row}`);
      parts.push(`column: ${area.column}`);
      parts.push(`height: ${area.height}`);
      parts.push(`width: ${area.width}`);

      event.detail.element.innerHTML = parts.join(", ");
    };

    /* Handle updates to the initial element. */
    const initialElem = this.layout.createArea(
      undefined,
      undefined,
      this.gridAreaUpdateHandler
    );
    assert(initialElem != undefined);

    this.#registerActions();
    this.#registerKeybinds();

    /* Basic resize handler: show info about size. */
    this.layout.registerResizeHandler((event: CustomEvent<GridDimensions>) => {
      const dimensions = event.detail;
      console.log(
        `grid: ${dimensions.rows} rows, ${dimensions.columns} columns`
      );
    });

    /* Basic error handler: show info about error. */
    this.layout.registerErrorHandler((event: CustomEvent<string>) => {
      console.warn(`Error: ${event.detail}`);
    });
  }

  #registerActions() {
    const layout = this.layout;

    for (const direction of allTranslations()) {
      /* Expand. */
      assert(
        this.actions.register(
          `expand${translationName(direction, true)}`,
          (() => {
            return layout.expandHandler(direction, false);
          }).bind(layout)
        )
      );

      /* Contract. */
      assert(
        this.actions.register(
          `contract${translationName(direction, true)}`,
          (() => {
            return layout.contractHandler(direction);
          }).bind(layout)
        )
      );

      /* Expand cursor area. */
      assert(
        this.actions.register(
          `expandCursorArea${translationName(direction, true)}`,
          (() => {
            return layout.resizeCursorAreaHandler(direction, true);
          }).bind(layout)
        )
      );

      /* Contract cursor area. */
      assert(
        this.actions.register(
          `contractCursorArea${translationName(direction, true)}`,
          (() => {
            return layout.resizeCursorAreaHandler(direction, false);
          }).bind(layout)
        )
      );

      /* Expand and create handler. */
      const gridAreaUpdateHandler = this.gridAreaUpdateHandler;
      assert(
        this.actions.register(
          `expandAndCreateArea${translationName(direction, true)}`,
          (() => {
            return layout.expandHandler(
              direction,
              true,
              gridAreaUpdateHandler,
              true
            );
          }).bind(layout)
        )
      );
    }
  }

  #registerKeybinds() {
    /* Arrow keys can expand and contract the grid. */
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]) {
      const direction = eventDirection(
        new KeyboardEvent("keydown", { key: key })
      );
      assert(direction != undefined);
      const directionSuffix = translationName(direction, true);

      assert(this.keybinds.registerAction(`expand${directionSuffix}`, key));

      assert(
        this.keybinds.registerAction(`contract${directionSuffix}`, key, [
          ModKeyFlag.ctrlKey,
        ])
      );

      assert(
        this.keybinds.registerAction(
          `expandCursorArea${directionSuffix}`,
          key,
          [ModKeyFlag.shiftKey]
        )
      );

      assert(
        this.keybinds.registerAction(
          `contractCursorArea${directionSuffix}`,
          key,
          [ModKeyFlag.altKey]
        )
      );

      assert(
        this.keybinds.registerAction(
          `expandAndCreateArea${directionSuffix}`,
          key,
          [ModKeyFlag.shiftKey, ModKeyFlag.ctrlKey]
        )
      );
    }
  }

  dispatch() {
    return;
  }
}
