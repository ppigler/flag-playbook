"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HEIGHT, WIDTH } from "@/constants/size";
import { Stage as StageType } from "konva/lib/Stage";
import PlayEditor from "./PlayEditor/PlayEditor";
import { usePlaybookStore } from "@/store/playbookStore";
import { usePlayStore } from "@/store/playStore";
import { DEFAULT_PLAYER_POSITIONS } from "@/constants/positions";
import { Position, Route } from "@/types/play";
import { useSettingsStore } from "@/store/settingsStore";
import { resetPlay } from "@/utils/play";

type PlayProps = {
  playId?: string;
  formationId?: string;
  isViewOnly?: boolean;
};

const Play = ({ playId, formationId, isViewOnly }: PlayProps) => {
  const [
    handleClick,
    handleRouteDraw,
    positions,
    dragBound,
    centerDragBound,
    qbDragBound,
    routes,
    handleDragStart,
    handleDragEnd,
    setScale,
    onDraw,
    drawLayerRef,
    initializeState,
  ] = isViewOnly
    ? []
    : [
        usePlaybookStore.use.handleClick(),
        usePlaybookStore.use.handleRouteDraw(),
        usePlaybookStore.use.positions(),
        usePlaybookStore.use.dragBound(),
        usePlaybookStore.use.centerDragBound(),
        usePlaybookStore.use.qbDragbound(),
        usePlaybookStore.use.routes(),
        usePlaybookStore.use.handleDragStart(),
        usePlaybookStore.use.handleDragEnd(),
        usePlaybookStore.use.handleSetScale(),
        usePlaybookStore.use.handleOnDraw(),
        usePlaybookStore.use.drawLayerRef(),
        usePlaybookStore.use.initializeState(),
      ];

  const renderImages = usePlayStore.use.renderImages();

  const plays = usePlayStore.use.plays();
  const formations = useSettingsStore.use.formations();
  const numberOfPlayers = useSettingsStore.use.numberOfPlayers();

  const [initialPositions, setInitialPositions] = useState<
    Position[] | undefined
  >(undefined);
  const [initialRoutes, setInitialRoutes] = useState<Route[] | undefined>(
    undefined
  );

  const isInitialized = useMemo(
    () => !!initialPositions && !!initialRoutes,
    [initialPositions, initialRoutes]
  );

  const stageRef = useRef<StageType>(null);
  const formation = formationId || plays[playId!]?.formationId;

  const containerElement = document.getElementById("container");

  const fitStageIntoParentContainer = useCallback(() => {
    const newWidth = containerElement?.offsetWidth ?? WIDTH - 100;
    const scale = newWidth / WIDTH;
    if (setScale) setScale(scale);

    stageRef.current?.width(newWidth);
    stageRef.current?.height(HEIGHT * scale);
    stageRef.current?.scale({ x: scale, y: scale });
  }, [setScale, containerElement]);

  useEffect(() => {
    fitStageIntoParentContainer();
  }, [fitStageIntoParentContainer, stageRef]);

  window.addEventListener("resize", fitStageIntoParentContainer);

  useEffect(() => {
    if (stageRef.current && playId && isInitialized) {
      const resetImage = resetPlay(stageRef);
      const image = resetImage.toDataURL({ pixelRatio: 1 });

      renderImages(playId, image);
    }
  }, [positions, stageRef, routes, renderImages, playId, isInitialized]);

  useEffect(() => {
    if (isInitialized && playId && !isViewOnly) {
      const storedPositions = positions?.map((position) => ({
        ...position,
        isSelected: undefined,
        isDragging: undefined,
      }));
      const data = JSON.stringify({ positions: storedPositions, routes });
      localStorage.setItem(playId, data);
      return void 0;
    }
    const props: { positions: Position[]; routes: Route[] } = JSON.parse(
      localStorage.getItem(playId ?? "") ?? "{}"
    );

    props.positions = (
      props.positions ??
      formations[formation]?.positions ??
      DEFAULT_PLAYER_POSITIONS
    )
      .slice(0, numberOfPlayers)
      .map((position) => ({ ...position, isSelected: false })) as Position[];
    props.routes =
      props.routes ??
      (
        DEFAULT_PLAYER_POSITIONS.map(() => ({
          route: [],
          option: [],
          motion: 0,
        })) as Route[]
      ).slice(0, numberOfPlayers);
    setInitialPositions(props.positions);
    setInitialRoutes(props.routes);
    if (!!initializeState) {
      initializeState({
        playId,
        positions: props.positions,
        routes: props.routes,
      });
    }
  }, [
    playId,
    isViewOnly,
    initializeState,
    isInitialized,
    positions,
    routes,
    formations,
    numberOfPlayers,
    formation,
  ]);

  return (
    <PlayEditor
      handleClick={handleClick}
      handleRouteDraw={handleRouteDraw}
      handleDragStart={handleDragStart}
      handleDragEnd={handleDragEnd}
      onDraw={onDraw}
      dragBound={dragBound}
      centerDragBound={centerDragBound}
      qbDragBound={qbDragBound}
      drawLayerRef={drawLayerRef!}
      stageRef={stageRef}
      positions={((isViewOnly ? initialPositions : positions) ?? []).slice(
        0,
        numberOfPlayers
      )}
      routes={isViewOnly ? initialRoutes : routes}
    />
  );
};

export default Play;
