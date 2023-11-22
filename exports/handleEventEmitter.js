const replayParser = require('fortnite-replay-parser');
const handlePlayerState = require('./propertyExports/handlePlayerState');
const handleGameState = require('./propertyExports/handleGameState');
const handlePlaylistInfo = require('./propertyExports/handlePlaylistInfo');

/**
 * @param {replayParser.EventEmittersObject} param0
 */
const handleEventEmitter = ({ propertyExportEmitter }) => {
  propertyExportEmitter.on('FortniteGame.FortPlayerStateAthena', handlePlayerState);
  propertyExportEmitter.on('Athena_GameState.Athena_GameState_C', handleGameState);
  propertyExportEmitter.on('Athena_GameState_C_ClassNetCache', handlePlaylistInfo);
};

module.exports = handleEventEmitter;
