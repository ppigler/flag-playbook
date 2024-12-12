import { Stage } from "konva/lib/Stage";
import { RefObject } from "react";
import { cloneDeep } from "lodash";
import { BLOCK_SNAP_SIZE } from "@/constants/size";
import { SHADOW_BLUR } from "@/constants/editorAttrs";
import { Position, Route } from "@/types/play";

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
        subChild.setAttr(SHADOW_BLUR, 0);
      });
    }
  });
  return clonedRef;
};

export const toSnapped = (pos: number) =>
  Math.round(pos / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE;

export const getRoutePoints = (
  routeObject: Route | undefined,
  position: Position
) => {
  const { route, motion } = routeObject ?? { route: [], motion: 0 };
  if (route.length - motion <= 0) return [];
  return route.reduce(
    (acc, { x, y }, routeStep) =>
      routeStep + 1 < motion ? acc : [...acc, x, y],
    motion === 0 ? [position.x, position.y] : []
  );
};

export const getOptionRoutePoints = (routeObject: Route) => {
  const { option } = routeObject;
  if (option.length > 0) {
    return option.reduce((acc, { x, y }) => [...acc, x, y], [] as number[]);
  }
  return [];
};

export const getMotionRoutePoints = (
  routeObject: Route | undefined,
  position: Position
) => {
  const { route, motion } = routeObject ?? { route: [], motion: 0 };
  return route.reduce(
    (acc, { x, y }, routeStep) =>
      routeStep + 1 <= motion ? [...acc, x, y] : acc,
    [position.x, position.y]
  );
};
