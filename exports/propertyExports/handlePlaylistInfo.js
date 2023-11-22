const replayParser = require('fortnite-replay-parser');

/**
 * @param {replayParser.PropertyExport} param0
 */
const handlePlaylistInfo = ({ data, result }) => {
  // console.dir(data);
  result.gameData.playlistInfo = data.name;
};
module.exports = handlePlaylistInfo;
