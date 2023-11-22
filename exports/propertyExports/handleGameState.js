const replayParser = require('fortnite-replay-parser');

/**
 * @param {replayParser.PropertyExport} param0
 */
const handleGameState = ({ data, result, states, timeSeconds, changedProperties }) => {
  // console.dir(data);
  if (data.TeamCount) {
    result.gameData.gameState.TeamCount = data.TeamCount;
  }
  if (data.WinningPlayerList) {
    result.gameData.gameState.WinningPlayerList = data.WinningPlayerList;
  }
};
module.exports = handleGameState;
