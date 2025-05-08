import { describe, it, expect } from "vitest";
import { levels } from "./levels.js";

const boardSize = 5;

function click(currentLitSquares, idx) {
  let litSquaresSet = new Set(currentLitSquares);

  const toggleSquareInSet = (squareIndex) => {
    if (litSquaresSet.has(squareIndex)) {
      litSquaresSet.delete(squareIndex);
    } else {
      litSquaresSet.add(squareIndex);
    }
  };

  const row = Math.floor(idx / boardSize);
  const col = idx % boardSize;

  toggleSquareInSet(idx);

  if (col > 0) {
    toggleSquareInSet(idx - 1);
  }
  if (col < boardSize - 1) {
    toggleSquareInSet(idx + 1);
  }
  if (row > 0) {
    toggleSquareInSet(idx - boardSize);
  }
  if (row < boardSize - 1) {
    toggleSquareInSet(idx + boardSize);
  }

  return Array.from(litSquaresSet);
}

describe("Level Solutions", () => {
  Object.entries(levels).forEach(([levelNumber, levelData]) => {
    it(`Level ${levelNumber} solution should turn off all lights`, () => {
      let currentLitSquares = [...levelData.initial];

      levelData.solution.forEach((moveIndex) => {
        currentLitSquares = click(currentLitSquares, moveIndex);
      });

      expect(currentLitSquares.length).toBe(0);
    });
  });
});
