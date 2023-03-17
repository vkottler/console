import assert from "assert";

import { allTranslations, translationName } from "../../cartesian/Translation";
import { ActionManager } from "../../control/ActionManager";
import { GridAreaUpdateHandler, GridLayoutManagerBase } from "./ManagerBase";

export class GridLayoutManager extends GridLayoutManagerBase {
  #registerExpandActions(actions: ActionManager): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);
      /* Expand. */
      assert(
        actions.register(
          `expand${suffix}`,
          (() => {
            return this.expandHandler(direction, false);
          }).bind(this)
        )
      );
    }
    return true;
  }

  #registerContractActions(actions: ActionManager): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);

      /* Contract. */
      assert(
        actions.register(
          `contract${suffix}`,
          (() => {
            return this.contractHandler(direction);
          }).bind(this)
        )
      );
    }
    return true;
  }

  #registerExpandCursorArea(actions: ActionManager): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);

      /* Expand cursor area. */
      assert(
        actions.register(
          `expandCursorArea${suffix}`,
          (() => {
            return this.resizeCursorAreaHandler(direction, true);
          }).bind(this)
        )
      );
    }
    return true;
  }

  #registerContractCursorArea(actions: ActionManager): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);

      /* Contract cursor area. */
      assert(
        actions.register(
          `contractCursorArea${suffix}`,
          (() => {
            return this.resizeCursorAreaHandler(direction, false);
          }).bind(this)
        )
      );
    }
    return true;
  }

  #registerExpandCreate(
    actions: ActionManager,
    gridAreaUpdateHandler: GridAreaUpdateHandler
  ): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);

      /* Expand and create handler. */
      assert(
        actions.register(
          `expandAndCreateArea${suffix}`,
          (() => {
            return this.expandHandler(
              direction,
              true,
              gridAreaUpdateHandler,
              true
            );
          }).bind(this)
        )
      );
    }
    return true;
  }

  #registerMoveCursor(actions: ActionManager): boolean {
    for (const direction of allTranslations()) {
      const suffix = translationName(direction, true);

      /* Move cursor handler. */
      assert(
        actions.register(
          `moveCursor${suffix}`,
          (() => {
            return this.layout.moveCursor(direction);
          }).bind(this)
        )
      );
    }
    return true;
  }

  registerActions(
    actions: ActionManager,
    gridAreaUpdateHandler: GridAreaUpdateHandler
  ): boolean {
    assert(this.#registerExpandActions(actions));
    assert(this.#registerContractActions(actions));
    assert(this.#registerExpandCursorArea(actions));
    assert(this.#registerContractCursorArea(actions));
    assert(this.#registerExpandCreate(actions, gridAreaUpdateHandler));
    assert(this.#registerMoveCursor(actions));
    return true;
  }
}
