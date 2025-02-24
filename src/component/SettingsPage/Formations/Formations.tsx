"use client";

import PlayEditor from "@/component/Play/PlayEditor/PlayEditor";
import { HEIGHT, POSITION_RADIUS, WIDTH } from "@/constants/size";
import { useSettingsStore } from "@/store/settingsStore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { v4 as uuid } from "uuid";
import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { createRef, useCallback, useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { DEFAULT_PLAYER_POSITIONS } from "@/constants/positions";
import _ from "lodash";
import { Position } from "@/types/play";
import NewPlayCard from "@/component/NewPlayCard/NewPlayCard";
import { resetPlay, toSnapped } from "@/utils/play";

const Formations = () => {
  const formations = useSettingsStore.use.formations();
  const setFormations = useSettingsStore.use.setFormations();
  const numberOfPlayers = useSettingsStore.use.numberOfPlayers();
  const isNumberOfPlayersSet = useSettingsStore.use.isNumberOfPlayersSet();
  const colors = useSettingsStore.use.colors();

  const [newFormations, setNewFormations] = useState(formations);
  const [scale, setScale] = useState(1);

  const [refs, setRefs] = useState(
    Object.keys(newFormations).map(() => createRef<Stage>())
  );

  const handleChangeFormationName = (value: string, id: string) =>
    setNewFormations((state) => ({
      ...state,
      [id]: { ...state[id], name: value },
    }));

  const fitStageIntoParentContainer = useCallback(() => {
    const containerElement =
      document.getElementById("container")?.offsetWidth ?? WIDTH;
    const bodyContainerElement =
      document.getElementById("body-container")?.offsetWidth ?? WIDTH;

    const newWidth = Math.min(containerElement, bodyContainerElement) - 100;
    const scale = newWidth / WIDTH;
    setScale(scale);

    refs.forEach((ref) => {
      ref.current?.width(newWidth);
      ref.current?.height(HEIGHT * scale);
      ref.current?.scale({ x: scale, y: scale });
    });
  }, [setScale, refs]);

  useEffect(() => {
    if (Object.keys(newFormations).length > 0) {
      setRefs(Object.keys(newFormations).map(() => createRef<Stage>()));
    }
  }, [setRefs, newFormations]);

  useEffect(
    () => fitStageIntoParentContainer(),
    [fitStageIntoParentContainer, newFormations, refs]
  );

  useEffect(() => {
    if (typeof window !== "undefined")
      window.addEventListener("resize", fitStageIntoParentContainer);
  }, [fitStageIntoParentContainer]);

  useEffect(() => {
    const formationWithImages = Object.entries(formations).reduce(
      (acc, [formationId, formationData], idx) => {
        const image = refs[idx].current?.toDataURL({ pixelRatio: 1 }) + "";
        return { ...acc, [formationId]: { ...formationData, image } };
      },
      {} as Record<
        string,
        {
          positions: Position[];
          name: string;
          image: string;
        }
      >
    );
    setFormations(formationWithImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  // generic dragbound
  const dragBound = ({ x, y }: Vector2d) => ({
    x: Math.min(
      Math.max(POSITION_RADIUS * scale, x),
      (WIDTH - POSITION_RADIUS) * scale
    ),
    y: Math.max(
      Math.min(y, (HEIGHT - POSITION_RADIUS) * scale),
      (HEIGHT / 2) * scale
    ),
  });

  const handleAddFormation = () =>
    setNewFormations((state) => ({
      ...state,
      [uuid()]: {
        positions: DEFAULT_PLAYER_POSITIONS.slice(0, numberOfPlayers),
        name: `My Custom Formation ${
          Object.values(state).filter((formation) =>
            formation.name.includes("My Custom Formation")
          ).length + 1
        }`,
      },
    }));

  const isSetFormationsDisabled =
    !isNumberOfPlayersSet ||
    _.isEqual(
      Object.entries(newFormations).reduce(
        (acc, [key, { positions, name }]) => ({
          ...acc,
          [key]: { positions, name },
        }),
        {}
      ),
      Object.entries(formations).reduce(
        (acc, [key, { positions, name }]) => ({
          ...acc,
          [key]: { positions, name },
        }),
        {}
      )
    );

  const handleSetFormations = () => {
    const formationWithImages = Object.entries(newFormations).reduce(
      (acc, [formationId, formationData], idx) => {
        const resetImage = resetPlay(refs[idx]);
        const image = resetImage.toDataURL({ pixelRatio: 1 });
        return { ...acc, [formationId]: { ...formationData, image } };
      },
      {} as Record<
        string,
        {
          positions: Position[];
          name: string;
          image: string;
        }
      >
    );
    setFormations(formationWithImages);
  };

  return (
    <Grid
      container
      direction="column"
      sx={{ alignItems: "flex-start", width: "100%" }}
    >
      <Grid container spacing={2} sx={{ width: "100%" }}>
        {Object.entries(newFormations).map(([id, { name, positions }], idx) => {
          const handleDragStart = (
            e: KonvaEventObject<DragEvent, Node<NodeConfig>>
          ) => {
            const positionId = e.target.id();
            const selectedPosition = positions.find(
              (position) => position.id === positionId
            );

            setNewFormations((state) => ({
              ...state,
              [id]: {
                ...state[id],
                selectedPosition,
                positions: state[id].positions.map((pos) => ({
                  ...pos,
                  isSelected: pos.id === positionId,
                  isDragging: pos.id === positionId,
                })),
              },
            }));
          };

          const handleDragEnd = (
            e: KonvaEventObject<DragEvent, Node<NodeConfig>>
          ) => {
            const positionId = e.target.id();
            const newPosition = {
              x: toSnapped(e.target.x()),
              y: toSnapped(e.target.y()),
              isSelected: true,
              isDragging: true,
            };
            const oldPosition = positions.find(
              (player) => player.id === positionId
            );
            if (!oldPosition) return;

            setNewFormations((state) => ({
              ...state,
              [id]: {
                ...state[id],
                selectedPosition: oldPosition,
                positions: state[id].positions.map((pos) => ({
                  ...pos,
                  ...(pos.id === positionId ? newPosition : {}),
                })),
              },
            }));
          };

          const handleRemoveFormation = () =>
            setNewFormations((state) => _.omit(state, id));

          // add center and qb dragbound
          const centerDragBound = ({ x }: Vector2d) => ({
            x: Math.min(
              Math.max(POSITION_RADIUS * scale, x),
              (WIDTH - POSITION_RADIUS) * scale
            ),
            y: (HEIGHT / 2) * scale,
          });
          const qbDragBound = ({ y }: Vector2d) => ({
            x: positions[0].x * scale,
            y: Math.max(
              Math.min(y, (HEIGHT - POSITION_RADIUS) * scale),
              (HEIGHT / 2) * scale
            ),
          });

          return (
            <Grid key={id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <TextField
                    fullWidth
                    label="Formation name"
                    placeholder="My Custom Formation"
                    aria-label="Formation name text field"
                    value={name}
                    onChange={(event) =>
                      handleChangeFormationName(event.target.value, id)
                    }
                  />
                  <div style={{ width: "100%" }} id="container">
                    <PlayEditor
                      positions={positions}
                      stageRef={refs[idx]}
                      dragBound={dragBound}
                      centerDragBound={centerDragBound}
                      qbDragBound={qbDragBound}
                      handleDragStart={handleDragStart}
                      handleDragEnd={handleDragEnd}
                      isSelectDisabled
                    />
                  </div>
                </CardContent>
                <CardActions>
                  <Tooltip title={`Delete ${name} formation`}>
                    <IconButton onClick={handleRemoveFormation}>
                      <TbTrash />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
        <NewPlayCard
          size={{ xs: 12, md: 6 }}
          disabled={!isNumberOfPlayersSet}
          handleOnClick={handleAddFormation}
          tooltipLabel="Add Formation"
        />
      </Grid>
      <Button onClick={handleSetFormations} disabled={isSetFormationsDisabled}>
        set
      </Button>
    </Grid>
  );
};

export default Formations;
