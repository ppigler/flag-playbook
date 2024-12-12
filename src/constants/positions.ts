import { toSnapped } from "@/utils/play";
import { Position } from "../types/play";
import { HEIGHT, POSITION_RADIUS, WIDTH } from "./size";

export const DEFAULT_PLAYER_POSITIONS: Position[] = [
  {
    x: toSnapped(WIDTH / 2),
    y: toSnapped(HEIGHT / 2),
    key: "center",
    id: "center",
    index: 0,
  }, // center
  {
    x: toSnapped(WIDTH / 2),
    y: toSnapped(HEIGHT / 2 + POSITION_RADIUS * 3),
    key: "qb",
    id: "qb",
    index: 1,
  }, // qb
  {
    x: toSnapped(WIDTH / 2),
    y: toSnapped(HEIGHT / 2 + POSITION_RADIUS * 6),
    key: "2",
    id: "2",
    index: 2,
  }, // rb
  {
    x: toSnapped(POSITION_RADIUS * 2),
    y: toSnapped(HEIGHT / 2),
    key: "3",
    id: "3",
    index: 3,
  }, // x
  {
    x: toSnapped(WIDTH - POSITION_RADIUS * 2),
    y: toSnapped(HEIGHT / 2),
    key: "4",
    id: "4",
    index: 4,
  }, // z
  {
    x: toSnapped(WIDTH / 2 + POSITION_RADIUS * 6),
    y: toSnapped(HEIGHT / 2 + POSITION_RADIUS),
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
