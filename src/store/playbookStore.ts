import {
  BLOCK_SNAP_SIZE,
  HEIGHT,
  POSITION_RADIUS,
  WIDTH,
} from "@/constants/size";
import { Position, Route } from "@/types/play";
import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import _ from "lodash";
import { createRef, RefObject } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createSelectors } from "./utils";
import { DEFAULT_PLAYER_POSITIONS } from "@/constants/positions";

type InitPlaybookProps = {
  positions: Position[];
  routes: Route[];
  playId: string | null;
  formationId: string | null;
};

type PlaybookState = InitPlaybookProps & {
  selectedPosition: Position | null;
  isOption: boolean;
  scale: number;
  drawLayerRef: RefObject<Layer> | null;
};

type PlaybookStore = PlaybookState & {
  handleDragStart: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
  handleDragEnd: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
  handleClick: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  handleRouteDraw: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  toggleRounded: () => void;
  handleRemoveRoute: () => void;
  handleToggleIsKey: () => void;
  handleToggleEditOption: () => void;
  handleSetMotion: (motion?: number) => void;
  handleSetScale: (scale: number) => void;
  handleOnDraw: (
    e?: KonvaEventObject<MouseEvent | TouchEvent, Node<NodeConfig>>
  ) => void;
  dragBound: ({ x, y }: Vector2d) => Vector2d;

  initializeState: (props?: Partial<InitPlaybookProps>) => void;
};

const INITIAL_PLAYBOOK_STATE: PlaybookState = {
  positions: DEFAULT_PLAYER_POSITIONS,
  routes: DEFAULT_PLAYER_POSITIONS.map(() => ({
    route: [],
    option: [],
    motion: 0,
  })),
  isOption: false,
  scale: 1,
  drawLayerRef: createRef<Layer>(),
  playId: null,
  formationId: null,
  selectedPosition: null,
};

const usePlaybookStoreBase = create<PlaybookStore>()(
  devtools(
    (set, get) => ({
      ...INITIAL_PLAYBOOK_STATE,
      initializeState: (props: Partial<InitPlaybookProps> = {}) =>
        set(
          () => ({
            ...INITIAL_PLAYBOOK_STATE,
            ...props,
          }),
          undefined,
          { type: "playbookStore/initializeState", props }
        ),
      handleSetScale: (scale) =>
        set(
          () => ({
            scale,
          }),
          undefined,
          { type: "playbookStore/handleSetScale", scale }
        ),

      handleOnDraw: (
        e?: KonvaEventObject<MouseEvent | TouchEvent, Node<NodeConfig>>
      ) => {
        if (!get().selectedPosition) return;

        const startEventTypes = ["mousedown", "touchstart"];
        const moveEventTypes = ["mousemove", "touchmove", "mouseenter"];

        const validShapes = ["Circle", "Star"];
        const isPositionDragged = validShapes.includes(
          e?.target.className || ""
        );

        const pos = isPositionDragged
          ? e?.target.parent?.getRelativePointerPosition()
          : e?.target.getRelativePointerPosition();

        const drawLineVertical: Konva.Line[] | undefined =
          get().drawLayerRef?.current?.find("#draw-line-vertical");
        const drawLineHorizontal: Konva.Line[] | undefined =
          get().drawLayerRef?.current?.find("#draw-line-horizontal");

        const x = pos?.x
          ? Math.round(pos.x / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE
          : 0;
        const y = pos?.y
          ? Math.round(pos.y / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE
          : 0;

        if (e && startEventTypes.includes(e.type) && x && y) {
          get().drawLayerRef?.current?.add(
            new Konva.Line({
              id: "draw-line-vertical",
              points: [x, 0, x, HEIGHT],
              stroke: "rgba(0,0,0,0.2)",
              strokeWidth: 1,
              dash: [20, 20],
            })
          );
          get().drawLayerRef?.current?.add(
            new Konva.Line({
              id: "draw-line-horizontal",
              points: [0, y, WIDTH, y],
              stroke: "rgba(0,0,0,0.2)",
              strokeWidth: 1,
              dash: [20, 20],
            })
          );
          return;
        }

        if (
          e &&
          moveEventTypes.includes(e.type) &&
          drawLineHorizontal &&
          drawLineVertical &&
          x &&
          y
        ) {
          drawLineHorizontal.forEach((line, idx) =>
            idx === 0 ? line.points([x, 0, x, HEIGHT]) : line.destroy()
          );
          drawLineVertical.forEach((line, idx) =>
            idx === 0 ? line.points([0, y, WIDTH, y]) : line.destroy()
          );
          return;
        }

        drawLineVertical?.forEach((line) => line.destroy());
        drawLineHorizontal?.forEach((line) => line.destroy());
      },

      handleDragStart: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) =>
        set(
          (state) => {
            const id = e.target.id();
            const selectedPosition = state.positions.find(
              (position) => position.id === id
            );
            return {
              selectedPosition,
              positions: state.positions.map((position) => ({
                ...position,
                isSelected: position.id === id,
                isDragging: position.id === id,
              })),
            };
          },
          undefined,
          { type: "playbookStore/handleDragStart", e }
        ),

      handleDragEnd: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) =>
        set(
          (state) => {
            const id = e.target.id();
            const newPosition = {
              x: Math.round(e.target.x() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
              y: Math.round(e.target.y() / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
              isSelected: true,
              isDragging: true,
            };
            const oldPosition = state.positions.find(
              (player) => player.id === id
            );
            if (!oldPosition) return {};

            return {
              selectedPosition: oldPosition,
              // updatePositions
              positions: state.positions.map((position) => ({
                ...position,
                ...(position.id === id ? newPosition : {}),
              })),
              // updateRoutes
              routes: [
                ...state.routes.slice(0, oldPosition.index),
                {
                  route: state.routes[oldPosition.index].route.map((route) => ({
                    x:
                      Math.round(
                        (route.x + newPosition.x - oldPosition.x) /
                          BLOCK_SNAP_SIZE
                      ) * BLOCK_SNAP_SIZE,
                    y:
                      Math.round(
                        (route.y + newPosition.y - oldPosition.y) /
                          BLOCK_SNAP_SIZE
                      ) * BLOCK_SNAP_SIZE,
                  })),
                  option: state.routes[oldPosition.index].option,
                  motion: state.routes[oldPosition.index].motion,
                },
                ...state.routes.slice(oldPosition.index + 1),
              ],
            };
          },
          undefined,
          { type: "playbookStore/handleDragEnd", e }
        ),

      handleClick: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) =>
        set(
          (state) => {
            const id = e.target.id();
            const selectedPosition = state.positions.find(
              (position) => position.id === id
            );
            return {
              selectedPosition: selectedPosition ?? state.selectedPosition,
              positions: state.positions.map((position) => ({
                ...position,
                isSelected:
                  position.id === id && id != state.selectedPosition?.id,
              })),
            };
          },
          undefined,
          { type: "playbookStore/handleClick", e }
        ),

      handleRouteDraw: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) =>
        set(
          (state) => {
            const pos = e.target.getRelativePointerPosition();
            const selectedPositionIndex = state.selectedPosition?.index ?? -1;
            const isInvalidRoute =
              pos === null ||
              Math.abs(pos.x) <= POSITION_RADIUS ||
              Math.abs(pos.y) <= POSITION_RADIUS;
            if (selectedPositionIndex === -1 || isInvalidRoute) return {};

            const x = Math.round(pos.x / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE;
            const y = Math.round(pos.y / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE;
            const { route, option, motion } =
              state.routes[selectedPositionIndex];
            const newRouteSegment = {
              route: state.isOption ? route : [...route, { x, y }],
              option: state.isOption
                ? [
                    ...(option.length === 0
                      ? route.filter((_, idx) => idx === route.length - 1) ?? [
                          { x: 0, y: 0 },
                        ]
                      : option),
                    { x, y },
                  ]
                : option,
              motion,
            };
            return {
              routes: [
                ...state.routes.slice(0, selectedPositionIndex),
                newRouteSegment,
                ...state.routes.slice(selectedPositionIndex + 1),
              ],
            };
          },
          undefined,
          { type: "playbookStore/handleRouteDraw", e }
        ),

      handleRemoveRoute: () =>
        set(
          (state) => {
            const selectedPositionIndex = state.selectedPosition?.index;
            if (selectedPositionIndex === undefined) return {};
            const { route, option, motion } =
              state.routes[selectedPositionIndex];
            const lastRoute = route.at(-1) ?? { x: 0, y: 0 };
            const firstOption = option.at(0) ?? { x: 0, y: 0 };

            const newRouteSegment = {
              route: state.isOption ? route : route.slice(0, route.length - 1),
              option: state.isOption
                ? option.length === 2
                  ? []
                  : option.slice(0, option.length - 1)
                : _.isEqual(lastRoute, firstOption)
                ? []
                : option,
              motion: Math.min(route.length - 1, motion),
            };
            return {
              routes: [
                ...state.routes.slice(0, selectedPositionIndex),
                newRouteSegment,
                ...state.routes.slice(selectedPositionIndex + 1),
              ],
            };
          },
          undefined,
          { type: "playbookStore/handleRemoveRoute" }
        ),

      toggleRounded: () =>
        set(
          (state) => ({
            positions: state.positions.map((position) => ({
              ...position,
              isRoundedRoute: position.isSelected && !position.isRoundedRoute,
            })),
          }),
          undefined,
          "playbookStore/toggleRounded"
        ),

      handleToggleIsKey: () =>
        set(
          (state) => ({
            positions: state.positions.map((position) => ({
              ...position,
              isKey: position.isSelected ? !position.isKey : false,
            })),
          }),
          undefined,
          "playbookStore/handleToggleIsKey"
        ),

      handleToggleEditOption: () =>
        set(
          (state) => ({
            isOption: !state.isOption,
          }),
          undefined,
          "playbookStore/handleToggleEditOption"
        ),

      handleSetMotion: (motion?: number) =>
        set(
          (state) => {
            const selectedPositionIndex = state.selectedPosition?.index ?? -1;
            const length =
              motion === undefined
                ? Math.max(
                    0,
                    state.routes[selectedPositionIndex].motion === 0
                      ? state.routes[selectedPositionIndex].route.findIndex(
                          (route) => route.y < HEIGHT / 2
                        )
                      : 0
                  )
                : motion;
            return {
              routes: [
                ...state.routes.slice(0, selectedPositionIndex),
                { ...state.routes[selectedPositionIndex], motion: length },
                ...state.routes.slice(selectedPositionIndex + 1),
              ],
            };
          },
          undefined,
          { type: "playbookStore/handleSetMotion", motion }
        ),

      dragBound: ({ x, y }: Vector2d) => ({
        x,
        y: Math.max(y, (HEIGHT / 2) * get().scale),
      }),
    }),
    { name: "playbookStore" }
  )
);

export const usePlaybookStore = createSelectors(usePlaybookStoreBase);
