
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

module.exports = getWrapDetails;