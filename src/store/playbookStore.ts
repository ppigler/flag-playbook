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
import { toSnapped } from "@/utils/play";

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
  handleChangeLabel: (value: string) => void;
  toggleRounded: (value?: boolean) => void;
  handleRemoveRoute: (isOption?: boolean) => void;
  handleToggleIsKey: (value?: boolean) => void;
  handleToggleEditOption: () => void;
  handleSetMotion: (motion?: number) => void;
  handleSetScale: (scale: number) => void;
  handleOnDraw: (
    e?: KonvaEventObject<MouseEvent | TouchEvent, Node<NodeConfig>>
  ) => void;
  dragBound: ({ x, y }: Vector2d) => Vector2d;
  qbDragbound: ({ x, y }: Vector2d) => Vector2d;
  centerDragBound: ({ x, y }: Vector2d) => Vector2d;

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
        const isPointedAtNode = !!e?.target.className;

        const pos = isPointedAtNode
          ? e?.target.parent?.getRelativePointerPosition()
          : e?.target.getRelativePointerPosition();

        const drawLineVertical: Konva.Line[] | undefined =
          get().drawLayerRef?.current?.find("#draw-line-vertical");
        const drawLineHorizontal: Konva.Line[] | undefined =
          get().drawLayerRef?.current?.find("#draw-line-horizontal");

        const x = pos?.x ? toSnapped(pos.x) : 0;
        const y = pos?.y ? toSnapped(pos.y) : 0;

        if (!drawLineHorizontal?.length && !drawLineHorizontal?.length) {
          get().drawLayerRef?.current?.add(
            new Konva.Line({
              id: "draw-line-vertical",
              points: [x, 0, x, HEIGHT],
              stroke: "rgba(0,0,0,0.2)",
              strokeWidth: 1,
              dash: [BLOCK_SNAP_SIZE / 5, BLOCK_SNAP_SIZE / 5],
            })
          );
          get().drawLayerRef?.current?.add(
            new Konva.Line({
              id: "draw-line-horizontal",
              points: [0, y, WIDTH, y],
              stroke: "rgba(0,0,0,0.2)",
              strokeWidth: 1,
              dash: [BLOCK_SNAP_SIZE / 5, BLOCK_SNAP_SIZE / 5],
            })
          );
          return;
        }

        if (e && drawLineHorizontal && drawLineVertical && x && y) {
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

            const oldPosition = state.positions.find(
              (player) => player.id === id
            );
            if (!oldPosition) return {};

            const newPosition = {
              x: toSnapped(e.target.x()),
              y: toSnapped(e.target.y()),
              isSelected: true,
              isDragging: false,
            };
            const isCenter = id === "center";
            const qbPosition = state.positions.find(
              (player) => player.id === "qb"
            );
            const newQbPosition = { ...qbPosition, x: newPosition.x };

            const newRoute = state.routes[oldPosition.index].route.map(
              (route) => ({
                x: toSnapped(route.x + newPosition.x - oldPosition.x),
                y: toSnapped(route.y + newPosition.y - oldPosition.y),
              })
            );
            const newQbRoute = qbPosition
              ? state.routes[qbPosition.index].route.map((route) => ({
                  ...route,
                  x: toSnapped(route.x + newPosition.x - oldPosition.x),
                }))
              : [];

            // determine motion length from new route
            const motionLength =
              state.routes[oldPosition.index].motion === -1
                ? -1
                : newRoute.findIndex((route) => route.y < HEIGHT / 2);

            return {
              selectedPosition: oldPosition,
              // updatePositions
              positions: state.positions.map((position) => ({
                ...position,
                ...(position.id === id ? newPosition : {}),
                ...(position.id === "qb" && isCenter ? newQbPosition : {}),
              })),
              // updateRoutes
              routes: state.routes.map((route, index) => {
                if (index === oldPosition.index) {
                  return {
                    route: newRoute,
                    option: route.option.map((option) => ({
                      x: toSnapped(option.x + newPosition.x - oldPosition.x),
                      y: toSnapped(option.y + newPosition.y - oldPosition.y),
                    })),
                    motion: motionLength > -1 ? motionLength : 0,
                  };
                }
                if (isCenter && qbPosition && index === qbPosition?.index) {
                  return {
                    route: newQbRoute,
                    option: route.option.map((option) => ({
                      x: toSnapped(option.x + newQbPosition.x - oldPosition.x),
                      y: option.y,
                    })),
                    motion: route.motion,
                  };
                }
                return route;
              }),
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
              (position) => position.id === id && !position.isSelected
            );
            return {
              selectedPosition: selectedPosition,
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
            const selectedPositionId = state.selectedPosition?.id;
            if (
              e.target.id() === selectedPositionId ||
              !pos ||
              !state.selectedPosition
            )
              return {};

            const x = toSnapped(pos.x);
            const y = toSnapped(pos.y);
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

      handleChangeLabel: (label: string) =>
        set(
          (state) => {
            const selectedPositionIndex = state.selectedPosition?.index ?? -1;
            if (selectedPositionIndex === -1) return {};
            return {
              positions: [
                ...state.positions.slice(0, selectedPositionIndex),
                { ...state.positions[selectedPositionIndex], label },
                ...state.positions.slice(selectedPositionIndex + 1),
              ],
            };
          },
          undefined,
          { type: "playbookStore/handleChangeLabel", label }
        ),

      handleRemoveRoute: (deleteFromOption?: boolean) =>
        set(
          (state) => {
            const selectedPositionIndex = state.selectedPosition?.index;
            if (selectedPositionIndex === undefined) return {};
            const { route, option, motion } =
              state.routes[selectedPositionIndex];
            const lastRoute = route.at(-1) ?? { x: 0, y: 0 };
            const firstOption = option.at(0) ?? { x: 0, y: 0 };
            const isOption = deleteFromOption ?? state.isOption;

            const newRouteSegment = {
              route: isOption ? route : route.slice(0, route.length - 1),
              option: isOption
                ? option.length === 2
                  ? []
                  : option.slice(0, option.length - 1)
                : _.isEqual(lastRoute, firstOption)
                ? []
                : option,
              motion:
                motion === 0
                  ? 0
                  : Math.min(Math.max(route.length - 1, 0), motion),
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

      toggleRounded: (value?: boolean) =>
        set(
          (state) => ({
            positions: state.positions.map((position) => ({
              ...position,
              ...(position.isSelected
                ? { isRoundedRoute: value ?? !position.isRoundedRoute }
                : {}),
            })),
          }),
          undefined,
          { type: "playbookStore/toggleRounded", value }
        ),

      handleToggleIsKey: (value?: boolean) =>
        set(
          (state) => ({
            positions: state.positions.map((position) => ({
              ...position,
              isKey: position.isSelected ? value ?? !position.isKey : false,
            })),
          }),
          undefined,
          { type: "playbookStore/handleToggleIsKey", value }
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
              motion === undefined &&
              state.routes[selectedPositionIndex].motion === 0
                ? state.routes[selectedPositionIndex].route.filter(
                    (route) => route.y >= HEIGHT / 2
                  ).length
                : 0;
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
        x: Math.min(
          Math.max(POSITION_RADIUS * get().scale, x),
          (WIDTH - POSITION_RADIUS) * get().scale
        ),
        y: Math.max(
          Math.min(y, (HEIGHT - POSITION_RADIUS) * get().scale),
          (HEIGHT / 2) * get().scale
        ),
      }),
      centerDragBound: ({ x }: Vector2d) => ({
        x: Math.min(
          Math.max(POSITION_RADIUS * get().scale, x),
          (WIDTH - POSITION_RADIUS) * get().scale
        ),
        y: (HEIGHT / 2) * get().scale,
      }),
      qbDragbound: ({ y }: Vector2d) => ({
        x: get().positions[0].x * get().scale,
        y: Math.max(y, (HEIGHT / 2) * get().scale),
      }),
    }),
    { name: "playbookStore" }
  )
);

export const usePlaybookStore = createSelectors(usePlaybookStoreBase);
