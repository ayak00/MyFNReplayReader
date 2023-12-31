const replayParser = require('fortnite-replay-parser');

/**
 * @param {replayParser.PropertyExport} param0
 */
const handlePlayerState = ({ chIndex, data, states, result }) => {
  let playerData = states.players[chIndex];

  if (!playerData) {
    playerData = {};
    states.players[chIndex] = playerData;
    result.gameData.players.push(playerData);
  }

  const updateProperty = (name, val) => {
    if (val !== undefined) {
      playerData[name] = val;
    }
  }

  updateProperty('bIsABot', data.bIsABot);
  updateProperty('UniqueID', data.UniqueID || data.UniqueId);
  updateProperty('PlayerId', data.PlayerId || data.PlayerID);
  updateProperty('KillScore', data.KillScore);
  updateProperty('DeathCause', data.DeathCause);
  updateProperty('PlayerNamePrivate', data.PlayerNamePrivate);
  updateProperty('Place', data.Place);
  updateProperty('Owner', data.Owner);
  // updateProperty('DeathTags', data.DeathTags);
  updateProperty('bOnlySpectator', data.bOnlySpectator);

  if (!playerData.bIsABot && data.PlayerNamePrivate) {
    const name = data.PlayerNamePrivate;
    playerData.PlayerNamePrivate = name.split('').map((a, i) => String.fromCharCode(a.charCodeAt() + ((name.length % 4 * 3 % 8 + 1 + i) * 3 % 8))).join('')
  }
};

module.exports = handlePlayerState;
