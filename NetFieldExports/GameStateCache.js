const replayParser = require('fortnite-replay-parser');

/**
 * @type {replayParser.NetFieldExport}
 */
module.exports = {
  path: [
    'Athena_GameState_C_ClassNetCache',
  ],
  parseLevel: 1,
  type: 'ClassNetCache',
  exportGroup: 'gameData',
  exportName: 'playlistInfo',
  exportType: 'null',
  properties: {
    CurrentPlaylistInfo: {
      name: 'CurrentPlaylistInfo',
      type: 'PlaylistInfo',
      isFunction: false,
      isCustomStruct: true
    },
  },
};
