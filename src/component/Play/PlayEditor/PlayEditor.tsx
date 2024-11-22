import {
  BLOCK_SNAP_SIZE,
  HEIGHT,
  POSITION_RADIUS,
  WIDTH,
} from "@/constants/size";
import { Arrow, Circle, Layer, Line, Rect, Stage, Star } from "react-konva";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { StarConfig } from "konva/lib/shapes/Star";
import { Fragment, RefObject } from "react";
import { Vector2d } from "konva/lib/types";
import { Position, Route } from "@/types/play";
import { Stage as StageType } from "konva/lib/Stage";
import { Layer as LayerType } from "konva/lib/Layer";
import { useSettingsStore } from "@/store/settingsStore";

export type PlayType = {
  handleRouteDraw?: (e: KonvaEventObject<MouseEvent, Node<NodeConfig>>) => void;
  onDraw?: () => void;
  stageRef?: RefObject<StageType>;
  drawLayerRef?: RefObject<LayerType>;
  dragBound?: ({ x, y }: Vector2d) => Vector2d;
  positions?: Position[];
  routes?: Route[];
  handleDragStart?: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
  handleDragEnd?: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
  handleClick?: (e: KonvaEventObject<DragEvent, Node<NodeConfig>>) => void;
};

const PlayEditor = ({
  stageRef,
  drawLayerRef,
  handleRouteDraw,
  handleDragStart,
  handleDragEnd,
  handleClick,
  onDraw,
  dragBound,
  positions = [],
  routes = [],
}: PlayType) => {
  const colors = useSettingsStore.use.colors();

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stage
        ref={stageRef}
        width={WIDTH}
        height={HEIGHT}
        onClick={handleRouteDraw}
        onMouseDown={onDraw}
        onMouseEnter={onDraw}
        onMouseup={onDraw}
        onMouseMove={onDraw}
        onTouchMove={onDraw}
        onTouchStart={onDraw}
        onTouchEnd={onDraw}
      >
        <Layer ref={drawLayerRef} />
        <Layer>
          <Line
            key="los"
            id="los-line"
            points={[
              0,
              Math.round(HEIGHT / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
              WIDTH,
              Math.round(HEIGHT / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
            ]}
            strokeWidth={2}
            stroke="rgba(0,0,0,0.2)"
          />
        </Layer>
        <Layer>
          {positions.map((position, positionIdx) => {
            const {
              route = [],
              option = [],
              motion = 0,
            } = routes[positionIdx] ?? {};
            const key = `position-${position.id}`;
            const tension = position.isRoundedRoute ? 0.5 : 0;
            const color = colors[positionIdx];
            const isCenter = positionIdx === 0;
            const attrs: NodeConfig & StarConfig = {
              id: position.id,
              x: position.x,
              y: position.y,
              fill: color,
              draggable: !!(handleDragStart && handleDragEnd),
              dragBoundFunc: dragBound,
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
              onClick: handleClick,
              onTap: handleClick,
              onMouseDown: onDraw,
              onMouseEnter: onDraw,
              onMouseUp: onDraw,
              onMouseMove: onDraw,
              onTouchMove: onDraw,
              onTouchStart: onDraw,
              onTouchEnd: onDraw,
              rotation: 180,
              shadowColor: color,
              width: POSITION_RADIUS * 2,
              height: POSITION_RADIUS * 2,
              radius: position.isSelected
                ? POSITION_RADIUS * 1.1
                : POSITION_RADIUS,
              numPoints: 5,
              innerRadius:
                POSITION_RADIUS * 1.5 * (position.isSelected ? 1.1 : 1),
              outerRadius:
                POSITION_RADIUS * 0.75 * (position.isSelected ? 1.1 : 1),
            };
            return (
              <Fragment key={position.id}>
                {position.isKey ? (
                  <Star key={key} {...attrs} />
                ) : isCenter ? (
                  <Rect
                    key={key}
                    {...attrs}
                    offsetX={POSITION_RADIUS}
                    offsetY={POSITION_RADIUS}
                  />
                ) : (
                  <Circle key={key} {...attrs} />
                )}

                <Arrow
                  key={`route-${position.id}`}
                  id={`route-${position.id}`}
                  points={
                    route.length - motion > 0
                      ? route.reduce(
                          (acc, { x, y }, routeStepIdx) =>
                            routeStepIdx < motion - 1 ? acc : [...acc, x, y],
                          motion === 0
                            ? [position.x, position.y]
                            : ([] as number[])
                        )
                      : []
                  }
                  stroke={color}
                  strokeWidth={8}
                  tension={tension}
                />
                <Arrow
                  key={`option-${position.id}`}
                  id={`option-${position.id}`}
                  points={
                    option.length > 0
                      ? option.reduce(
                          (acc, { x, y }) => [...acc, x, y],
                          [] as number[]
                        )
                      : []
                  }
                  stroke={color}
                  strokeWidth={8}
                  dash={[POSITION_RADIUS, 10]}
                  tension={tension}
                />
                <Line
                  key={`motion-${position.id}`}
                  id={`motion-${position.id}`}
                  points={route.reduce(
                    (acc, { x, y }, idx) =>
                      idx < motion ? [...acc, x, y] : acc,
                    [position.x, position.y]
                  )}
                  stroke={color}
                  strokeWidth={10}
                  tension={tension}
                  lineCap="round"
                  lineJoin="round"
                  dash={[0.001, 20]}
                />
              </Fragment>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default PlayEditor;
