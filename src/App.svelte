<script>
  import { levels } from "./levels.js";
  import { clickSound } from "./clickSound.js";
  import { winSound } from "./winSound.js";

  const boardSize = 5;
  let level = $state(Number(localStorage.getItem("level")) || 1);
  let soundEnabled = $state(
    JSON.parse(localStorage.getItem("soundEnabled") || true),
  );
  let litSquares = $state(levels[level].initial);
  let locked = $state(false);
  let step = $state(0);
  let clickHistory = $state([]);
  let helpEnabled = $derived(clickHistory.length === 0 && !locked);
  const winAudio = new Audio(`data:audio/mpeg;base64,${winSound}`);
  winAudio.preload = "auto";
  const squareAudio = new Audio(`data:audio/mpeg;base64,${clickSound}`);
  squareAudio.preload = "auto";

  function toggleSquare(idx) {
    if (litSquares.includes(idx)) {
      litSquares = litSquares.filter((square) => square !== idx);
    } else {
      litSquares = [...litSquares, idx];
    }
  }

  function clickSquare(idx, isHelp = false) {
    if (locked && !isHelp) return;
    step++;
    if (!isHelp) clickHistory = [...clickHistory, idx];
    const row = Math.floor(idx / boardSize);
    const col = idx % boardSize;
    toggleSquare(idx);
    if (col > 0) toggleSquare(idx - 1);
    if (col < boardSize - 1) toggleSquare(idx + 1);
    if (row > 0) toggleSquare(idx - boardSize);
    if (row < boardSize - 1) toggleSquare(idx + boardSize);

    if (litSquares.length === 0) {
      locked = true;
      if (soundEnabled && winAudio) {
        winAudio.currentTime = 0;
        winAudio.play();
        if (level < 50) {
          setTimeout(() => {
            handleNextLevel();
          }, 1100);
        }
      } else {
        handleNextLevel();
      }
    } else {
      if (soundEnabled && squareAudio) {
        squareAudio.currentTime = 0;
        squareAudio.play();
      }
    }
  }

  function initializeLevel() {
    litSquares = levels[level].initial;
    step = 0;
    clickHistory = [];
    locked = false;
  }

  function handlePrevLevel() {
    level--;
    localStorage.setItem("level", level);
    initializeLevel();
  }

  function handleNextLevel() {
    level++;
    localStorage.setItem("level", level);
    initializeLevel();
  }

  function handleSoundToggle() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
  }

  function handleHelp() {
    locked = true;
    const solution = levels[level].solution;
    const idx = solution[step];
    let blinkCount = 0;
    const maxBlinks = 8;
    function doBlink() {
      toggleSquare(idx);
      blinkCount++;
      if (blinkCount < maxBlinks) {
        setTimeout(doBlink, 200);
      } else {
        setTimeout(() => {
          clickSquare(idx, true);
          locked = false;
        }, 200);
      }
    }
    doBlink();
  }

  let boardButtons = $derived(
    Array.from({ length: boardSize * boardSize }, (_, idx) => {
      return {
        idx,
        on: litSquares.includes(idx),
      };
    }),
  );
</script>

<main>
  <div id="game-container">
    <!-- Top controls -->
    <div class="top-controls">
      <div class="level-selector">
        <button
          disabled={level === 1 || locked}
          onclick={handlePrevLevel}
          aria-label="Previous Level"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div class="level-display">
          <span class="label">Level</span>
          <span class="value">{level}</span>
        </div>
        <button
          disabled={!levels[level + 1] || locked}
          onclick={handleNextLevel}
          aria-label="Next Level"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div class="stat-box">
        <span class="label">Steps</span>
        <span class="value">{step}</span>
      </div>
      <div class="stat-box">
        <span class="label">Minimum</span>
        <span class="value">{levels[level].steps}</span>
      </div>
    </div>
    <!-- Game board -->
    <div id="game-board">
      {#each boardButtons as btn (btn.idx)}
        <button
          class={["light", { on: btn.on }]}
          onclick={() => clickSquare(btn.idx)}
          disabled={locked}
          aria-label={`Toggle light ${btn.idx + 1}`}
        ></button>
      {/each}
    </div>
    <h1>Lights Out</h1>
    <!-- Bottom controls -->
    <div class="bottom-controls">
      <button
        id="restart-button"
        class="control-button"
        aria-label="Restart Level"
        onclick={initializeLevel}
        disabled={locked}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
      <button
        id="sound-toggle"
        class="control-button"
        aria-label="Toggle Sound"
        onclick={handleSoundToggle}
      >
        {#if soundEnabled}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
        {/if}
      </button>
      <button
        id="help-btn"
        class="control-button"
        aria-label="Help"
        disabled={!helpEnabled}
        onclick={handleHelp}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          width="24"
          height="24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
          />
        </svg>
      </button>
    </div>
  </div>
</main>

<style>
  #game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1e2939;
    border: 1.5px solid #364153;
    padding: 24px;
    border-radius: 14px;
    box-shadow: 0 6px 24px rgba(20, 24, 31, 0.18);
    width: 100%;
    max-width: 380px;
    gap: 24px;
  }

  .top-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }

  .level-selector {
    display: flex;
    align-items: center;
    background-color: #364153;
    padding: 6px 14px;
    border-radius: 6px;
  }

  .level-selector button {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    font-size: 1.5em;
    display: flex;
    align-items: center;
  }

  .level-selector button:hover:not(:disabled) {
    color: #d1d5dc;
  }

  .level-selector button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .level-display {
    text-align: center;
    margin: 0 8px;
  }

  .level-display .label {
    display: block;
    font-size: 0.8em;
    color: #d1d5dc;
    font-weight: 500;
  }

  .level-display .value {
    font-size: 1.2em;
    font-weight: 700;
  }

  .stat-box {
    background-color: #364153;
    padding: 6px 14px;
    border-radius: 7px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(20, 24, 31, 0.13);
  }

  .stat-box .label {
    display: block;
    font-size: 0.8em;
    color: #d1d5dc;
    font-weight: 500;
  }

  .stat-box .value {
    font-size: 1.2em;
    font-weight: 700;
  }

  #game-board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 8px;
    border-radius: 8px;
  }

  .light {
    background-color: #101828;
    border: 1.5px solid #364153;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
  }

  .light.on {
    background: radial-gradient(#f4a8ff, #e12afb);
    border-color: #8a0194;
    box-shadow: 0 0 10px #e12afb;
  }

  .light:active {
    transform: scale(0.95);
  }

  h1 {
    font-size: 1.2em;
  }

  .bottom-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .control-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    padding: 0;
    outline: none;
  }

  .control-button:active {
    transform: scale(0.95);
  }

  #restart-button {
    background-color: #2b7fff;
  }

  #restart-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  #restart-button:hover:not(:disabled) {
    background-color: #155dfc;
  }

  #sound-toggle {
    background-color: #00c950;
  }

  #sound-toggle:hover {
    background-color: #00a63e;
  }

  #help-btn {
    background-color: #f0b100;
    color: #000;
  }

  #help-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  #help-btn:hover:not(:disabled) {
    background-color: #d08700;
  }
</style>
