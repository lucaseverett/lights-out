# Lights Out

This is an implementation of the game [Lights Out](<https://en.wikipedia.org/wiki/Lights_Out_(game)>) with JavaScript.

### Live Demo

https://lights-out.lucaseverett.dev/

## How to Play

Lights Out is a puzzle game where your goal is to turn off all the lights on the grid. Each time you click a light, it toggles on or off, as do its directly adjacent neighbors (up, down, left, right). You win when all lights are turned off!

### Game Features and Rules

The [rules](https://www.hasbro.com/common/instruct/LIGHTOUT.PDF) are the same as the [original game](<https://en.wikipedia.org/wiki/Lights_Out_(game)>), with a few differences:

- **50 Levels:** The original game had 3 modes. This implementation has all 50 levels from modes 1 and 2. There is no Mode 3, which allowed you to create your own puzzles.
- **Level Progression:** Unlike the Tiger Electronics version, you do not need to complete one level to progress to the next; you can try any level at any time. Also, the original game required you to complete a level with the minimal number of moves to progress to the next level. This implementation does not have that requirement, but it does display the number of moves you make for each level.
- **Help Feature:** The help button will solve the entire puzzle for you, rather than just showing the first two moves as in the Tiger version. However, once you make a manual move, the help feature becomes disabled for that puzzle attempt.

## Sound Credits

All game sounds are from [Pixabay](https://pixabay.com/sound-effects/).

[Classic Game Action Positive 18](https://pixabay.com/sound-effects/classic-game-action-positive-18-224570/)

[Minimal Pop Click UI 1](https://pixabay.com/sound-effects/minimal-pop-click-ui-1-198301/)
