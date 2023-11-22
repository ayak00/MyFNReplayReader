const fs = require('fs');
const path = require('path');
const parseReplay = require('fortnite-replay-parser');
const handleEventEmitter = require('./exports/handleEventEmitter');
const NetFieldExports = require('./NetFieldExports');

// replayファイル格納パス
const REPLAY_PATH = '/path/to/replayfiledir/';
// 出力ファイル格納パス
const OUT_PATH = './results/';

// replayファイル名
let replayFileName = 'UnsavedReplay-2023.11.11-21.49.03.replay';
// ライブラリfortnite-replay-parserに渡すconfigのdebugフラグ
let isDebug = false;

for(var i = 2;i < process.argv.length; i++){
  let param = process.argv[i];
  // console.log("argv[" + i + "] = " + param);
  if (param.toLowerCase() === 'debug') {
    isDebug = true;
  } else if (param.endsWith('.replay')) {
    replayFileName = param;
  } else if (param.toLowerCase() === 'files') {
    showReplayFiles();
    return;
  } else {
    console.log("Usage: npm run exec [ReplayFile Name] [debug] / npm run files");
    return;
  }
}

const config = {
  parseLevel: 1,
  debug: isDebug,
  handleEventEmitter,
  customNetFieldExports: NetFieldExports,
  onlyUseCustomNetFieldExports: true,
};
exec(replayFileName, config);


//
// Functions
//
function exec(replayFileName, config) {

  let outFileStr = replayFileName.replace('UnsavedReplay-', '');
  let outParseName = outFileStr + '_parsed.json';
  let outSummaryName = outFileStr + '_summary.md';

  const replayBuffer = fs.readFileSync(path.join(REPLAY_PATH, replayFileName));

  parseReplay(replayBuffer, config).then((parsedReplay) => {
    fs.writeFileSync(path.join(OUT_PATH, outParseName), JSON.stringify(parsedReplay, null, 2));
    console.log("parse >> " + outParseName);

    let summaryObj = summary(parsedReplay);
    // console.dir(summaryObj);
    // fs.writeFileSync(path.join(OUT_PATH, outSummaryName), JSON.stringify(summaryObj, null, 2));

    fs.writeFileSync(path.join(OUT_PATH, outSummaryName), summaryToMd(summaryObj));
    console.log("summary >> " + outSummaryName);

  }).catch((err) => {
    console.error('An error occured while parsing the replay!', err);
  });

}

function summaryToMd(smryObj) {
  let dateStr = (new Date(smryObj.timestamp)).toISOString();
  let retStr = '# ' + dateStr.replace('T', ' ').substring(0, 16) + '\n';
  retStr += '- PlaylistInfo: ' + smryObj.playlistInfo + '\n';

  retStr += '\n';
  retStr += '## PlayerInfo' + '\n';
  retStr += '- TotalPlayers: ' + smryObj.playerInfo.totalPlayers + '\n';
  retStr += '- Human: ' + smryObj.playerInfo.human + '\n';
  retStr += '- botPlayer: ' + smryObj.playerInfo.botPlayer + '\n';
  retStr += '- npc: ' + smryObj.playerInfo.npc + '\n';
  retStr += '- other: ' + smryObj.playerInfo.other + '\n';

  retStr += '\n';
  retStr += '## OwnerInfo' + '\n';
  retStr += '- PlayerName:' + smryObj.owner.playerName + '\n';
  retStr += '- Place: ' + smryObj.owner.place + '\n';
  retStr += '- DeathCause: ' + smryObj.owner.deathCause + '\n';
  retStr += '- Eliminations: ' + smryObj.owner.eliminations + '\n';
  retStr += '- KillScore: ' + smryObj.owner.killScore + '\n';
  retStr += '- Accuracy: ' + smryObj.owner.accuracy + '\n';
  retStr += '- Assists: ' + smryObj.owner.assists + '\n';
  retStr += '- Revives: ' + smryObj.owner.revives + '\n';

  if (smryObj.teamMembers.length > 0) {
    retStr += '\n';
    retStr += '## TeamMembers' + '\n';
    smryObj.teamMembers.forEach(member => {
      retStr += '- PlayerName:' + member.playerName + '\n';
      retStr += '  - DeathCause: ' + member.deathCause + '\n';
      retStr += '  - KillScore: ' + member.killScore + '\n';
    });
  }

  retStr += '\n';
  retStr += '## Eliminated' + '\n';
  smryObj.eliminatedPlayers.forEach(player => {
    retStr += '- PlayerName:' + player.playerName + '\n';
    retStr += '  - GunType: ' + player.gunType + '\n';
    retStr += '  - Knocked: ' + player.knocked + '\n';
  });

  retStr += '\n';
  retStr += '## Eliminator' + '\n';
  smryObj.eliminators.forEach(player => {
    retStr += '- PlayerName:' + player.playerName + '\n';
    retStr += '  - GunType: ' + player.gunType + '\n';
    retStr += '  - Knocked: ' + player.knocked + '\n';
  });

  return retStr;
}

function summary(parsedObj) {
  let owner = {
    uniqueID: null,
    playerName: null,
    place: null,
    accuracy : null,
    eliminations : null,
    killScore 	 : null,
    assists  : null,
    revives  : null,
    deathCause: null,
  };
  let playerInfo = {
    totalPlayers: 0,
    human: 0,
    botPlayer: 0,
    npc: 0,
  };
  let teamMembers = [];
  let eliminatedPlayers = [];
  let eliminators = [];

  //
  // replayファイルの所有者の情報
  //
  parsedObj.events.forEach(event => {
    if (event.group == 'AthenaReplayBrowserEvents') {
      if (event.metadata == 'AthenaMatchStats') {
        owner.accuracy = event.accuracy;
        owner.assists = event.assists;
        owner.eliminations = event.eliminations;
        owner.revives = event.revives;
      } else if (event.metadata == 'AthenaMatchTeamStats') {
        owner.place = event.position;
        playerInfo.totalPlayers = event.totalPlayers;
      }
    }
  });
  let botCounter = 0;
  let otherCounter = 0; // 観測者等
  parsedObj.gameData.players.forEach(player => {
    if (owner.place == player.Place) {
      if ('Owner' in player) {
        owner.uniqueID = player.UniqueID || player.UniqueId;
        owner.playerName = player.PlayerNamePrivate;
        owner.killScore = player.KillScore || 0;
        owner.deathCause = player.DeathCause || '-';
      } else {
        // TODO: チームメンバー。とりあえずリストにしておく
        teamMembers.push({
          uniqueID: player.UniqueID || player.UniqueId,
          playerName: player.PlayerNamePrivate,
          killScore: player.KillScore || 0,
          deathCause: player.DeathCause || '-',
        });
      }
    }
    // BotプレーヤーとNPCの違い。自分が早くしんだ場合は、どちらもPlaceがつかない。
    // bIsABotはBotプレーヤー＋NPCと思われる。Botプレーヤー数はtotalPlayersからhumanを引いて計算する。
    if (player.bIsABot == true) {
      // console.log("bot," + player.PlayerNamePrivate + "," + player.Place);
      botCounter++;
    } else if ((player.UniqueID || player.UniqueId)
      && player.bOnlySpectator != true) {
        // console.log("human," + player.PlayerNamePrivate + "," + player.Place);
        playerInfo.human++;
    } else {
      // console.log("other," + player.PlayerNamePrivate + "," + player.Place);
      otherCounter++;
    }
  });
  if (playerInfo.totalPlayers > 0) {
    // ※totalPlayersの値は、DeathCauseのないhumanがカウントされている場合とされていない場合があり不定
    if (playerInfo.totalPlayers > playerInfo.human) {
      playerInfo.botPlayer = playerInfo.totalPlayers - playerInfo.human;
    }
    if (botCounter > playerInfo.botPlayer) {
      playerInfo.npc = botCounter - playerInfo.botPlayer;
    }
    playerInfo.other = otherCounter;
  }

  //
  // 撃破情報
  //
  parsedObj.events.forEach(event => {
    if (event.group == 'playerElim') {
      // 撃破したプレイヤー
      if (event.eliminator == owner.uniqueID) {
        let p = {};
        p.uniqueID = event.eliminated;
        p.gunType = event.gunType;
        p.knocked = event.knocked;
        parsedObj.gameData.players.forEach(player => {
          if (p.uniqueID == player.UniqueID
          || p.uniqueID == player.UniqueId) {
            p.playerName = player.PlayerNamePrivate;
          }
        });
        if (! p.playerName) {
          p.playerName = '-- Bot --';
        }
        eliminatedPlayers.push(p);
      }
      // 撃破されたプレイヤー
      if (event.eliminated == owner.uniqueID) {
        let p = {};
        p.uniqueID = event.eliminator;
        p.gunType = event.gunType;
        p.knocked = event.knocked;
        parsedObj.gameData.players.forEach(player => {
          if (p.uniqueID == player.UniqueID
          || p.uniqueID == player.UniqueId) {
            p.playerName = player.PlayerNamePrivate;
          }
        });
        if (! p.playerName) {
          p.playerName = '-- Bot --';
        }
        eliminators.push(p);
      }
    }
  });

  let retObj = {
    timestamp: parsedObj.info.Timestamp,
    playlistInfo: parsedObj.gameData.playlistInfo,
    playerInfo: playerInfo,
    owner: owner,
    teamMembers: teamMembers,
    eliminatedPlayers: eliminatedPlayers,
    eliminators: eliminators,
  };

  return retObj;
}

function showReplayFiles() {
  console.log(REPLAY_PATH);
  fs.readdir(REPLAY_PATH, (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
  });
}
