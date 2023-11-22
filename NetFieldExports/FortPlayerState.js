const replayParser = require('fortnite-replay-parser');

/**
 * @type {replayParser.NetFieldExport}
 */
module.exports = {
  path: [
    '/Script/FortniteGame.FortPlayerStateAthena',
  ],
  parseLevel: 1,
  exportGroup: 'gameData',
  exportName: 'players',
  exportType: 'array',
  properties: {
    UniqueId: {
      name: 'UniqueId',
      parseFunction: 'readNetId',
      parseType: 'default',
    },
    UniqueID: {
      name: 'UniqueID',
      parseFunction: 'readNetId',
      parseType: 'default',
    },
    PlayerID: {
      name: 'PlayerID',
      parseFunction: 'readUInt32',
      parseType: 'default',
    },
    PlayerId: {
      name: 'PlayerId',
      parseFunction: 'readUInt32',
      parseType: 'default',
    },
    PlayerNamePrivate: {
      name: 'PlayerNamePrivate',
      parseFunction: 'readString',
      parseType: 'default',
    },
    bIsABot: {
      name: 'bIsABot',
      parseFunction: 'readBit',
      parseType: 'default',
    },
    // DeathTags: {
    //   name: 'DeathTags',
    //   type: 'FGameplayTagContainer',
    //   parseType: 'readClass'
    // },
    // FinisherOrDownerTags: {
    //   name: 'DeathTags',
    //   type: 'FGameplayTagContainer',
    //   parseType: 'readClass'
    // },
    // VictimTags: {
    //   name: 'DeathTags',
    //   type: 'FGameplayTagContainer',
    //   parseType: 'readClass'
    // },
    KillScore: {
      name: 'KillScore',
      parseFunction: 'readInt32',
      parseType: 'default',
    },
    DeathCause: {
      name: 'DeathCause',
      type: 'EDeathCause',
      parseType: 'readEnum',
      bits: 6
    },
    Place: {
      name: 'Place',
      parseFunction: 'readInt32',
      parseType: 'default',
    },
    Owner: {
      name: 'Owner',
      parseFunction: 'readIntPacked',
      parseType: 'default',
    },
    bOnlySpectator: {
      name: 'bOnlySpectator',
      parseFunction: 'readBit',
      parseType: 'default',
    },
  },
};
