const replayParser = require('fortnite-replay-parser');

/**
 * @type {replayParser.NetFieldExport}
 */
module.exports = {
  path: [
    '/Game/Athena/Athena_GameState.Athena_GameState_C',
  ],
  parseLevel: 1,
  exportGroup: 'gameData',
  exportName: 'gameState',
  exportType: 'object',
  properties: {
    PlayerId: {
      name: 'PlayerId',
      parseFunction: 'readUInt32',
      parseType: 'default',
    },
    PlayerID: {
      name: 'PlayerID',
      parseFunction: 'readUInt32',
      parseType: 'default',
    },
    WinningPlayerList: {
      name: 'WinningPlayerList',
      type: 'readUInt32',
      parseType: 'readDynamicArray'
    },
    TeamCount: {
      name: 'TeamCount',
      type: 'int',
      parseFunction: 'readInt32',
      parseType: 'default'
    },
  },
};
