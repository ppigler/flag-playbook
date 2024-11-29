import { Stage } from "konva/lib/Stage";
import { RefObject } from "react";
import { cloneDeep } from "lodash";

export const resetPlay = (imageRef: RefObject<Stage>) => {
  // create deep clone from image ref
  const clonedRef = cloneDeep(imageRef.current)!;

  // iterate over layers
  clonedRef.children.forEach((child) => {
    // remove draw line layer
    if (child.id() === "draw-line") {
      child.opacity(0);
      return;
    }

    // reset attrs on position layers
    if (!child.id().includes("line")) {
      child.opacity(1);

      child.children.forEach((subChild) => {
        subChild.setAttr("shadowBlur", 0);
      });
    }
  });
  return clonedRef;
};
