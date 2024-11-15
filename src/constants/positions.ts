import { Position } from "../types/play";
import { BLOCK_SNAP_SIZE, HEIGHT, POSITION_RADIUS, WIDTH } from "./size";

export const DEFAULT_PLAYER_POSITIONS: Position[] = [
  {
    x: Math.round(WIDTH / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    y: Math.round(HEIGHT / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    key: "center",
    id: "center",
    index: 0,
  }, // center
  {
    x: Math.round(WIDTH / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    y:
      Math.round((HEIGHT / 2 + POSITION_RADIUS * 3) / BLOCK_SNAP_SIZE) *
      BLOCK_SNAP_SIZE,
    key: "qb",
    id: "qb",
    index: 1,
  }, // qb
  {
    x: Math.round(WIDTH / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    y:
      Math.round((HEIGHT / 2 + POSITION_RADIUS * 6) / BLOCK_SNAP_SIZE) *
      BLOCK_SNAP_SIZE,
    key: "2",
    id: "2",
    index: 2,
  }, // rb
  {
    x: Math.round((POSITION_RADIUS * 2) / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    y: Math.round(HEIGHT / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    key: "3",
    id: "3",
    index: 3,
  }, // x
  {
    x:
      Math.round((WIDTH - POSITION_RADIUS * 2) / BLOCK_SNAP_SIZE) *
      BLOCK_SNAP_SIZE,
    y: Math.round(HEIGHT / 2 / BLOCK_SNAP_SIZE) * BLOCK_SNAP_SIZE,
    key: "4",
    id: "4",
    index: 4,
  }, // z
  {
    x:
      Math.round((WIDTH / 2 + POSITION_RADIUS * 6) / BLOCK_SNAP_SIZE) *
      BLOCK_SNAP_SIZE,
    y:
      Math.round((HEIGHT / 2 + POSITION_RADIUS) / BLOCK_SNAP_SIZE) *
      BLOCK_SNAP_SIZE,
    key: "5",
    id: "5",
    index: 5,
  }, // slot
];

export const DEFAULT_PLAYERS = 5;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 7;
export const PLAYER_NUMBER_OPTIONS = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, index) => index + MIN_PLAYERS
);
