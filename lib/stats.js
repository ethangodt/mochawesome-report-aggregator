module.exports = {
  getEarliestStart: function getEarliestStart(reports) {
    return reports.map((report) => {
      return report.stats.start
    }).reduce((earliestStartTime, startTime) => {
      return new Date(Math.min(
          Date.parse(earliestStartTime),
          Date.parse(startTime)
      ))
    })
  },
  getLatestEnd: function getLatestEnd(reports) {
    return reports.map((report) => {
      return report.stats.end
    }).reduce((latestEndTime, endTime) => {
      return new Date(Math.max(
          Date.parse(latestEndTime),
          Date.parse(endTime)
      ))
    })
  },
  getDuration: function getDuration() {

  },
}

module.exports.getLatestEnd = function getEarliestStart(reports) {

}

module.exports.getSuitesCount = function getEarliestStart(report) {

}

module.exports.getTestsExecutedCount = function getEarliestStart(report) {

}

module.exports.getPassesCount = function getEarliestStart(report) {

}

module.exports.getPendingCount = function getEarliestStart(report) {

}

module.exports.getFailuresCount = function getEarliestStart(report) {

}

module.exports.getDurationCount = function getEarliestStart(reports) {

}

module.exports.getTestsRegisteredCount = function getEarliestStart(reports) {

}

module.exports.getTestsRegisteredCount = function getEarliestStart(reports) {

}

module.exports.getTestsRegisteredCount = function getEarliestStart(reports) {

}



