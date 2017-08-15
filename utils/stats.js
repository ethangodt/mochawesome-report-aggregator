const suites = require('./suites')

module.exports = {
  getEarliestStart: function getEarliestStart(r1, r2) {
    return new Date(Math.min(
        Date.parse(r1.stats.start),
        Date.parse(r2.stats.start)
    ))
  },
  getLatestEnd: function getLatestEnd(r1, r2) {
    return new Date(Math.max(
        Date.parse(r1.stats.end),
        Date.parse(r2.stats.end)
    ))
  },
  getDuration: function getDuration(start, end) {
    console.log(Date.parse(end), Date.parse(start));
    return Date.parse(end) - Date.parse(start)
  },
  getPassPercent: function getPassPercent(passCount, testCount) {
    return (passCount / testCount) * 100
  },
  getPendingPercent: function getPendingPercent(pendingCount, testCount) {
    return (pendingCount / testCount) * 100
  },
  getExecutedSuitesCount: function getExecutedSuitesCount(allSuites) {
    return allSuites.reduce((runSuiteCount, suite) => {
      return suites.suiteWasRun(suite) ? runSuiteCount + 1 : runSuiteCount
    }, 0)
  },
  getRegisteredTestsCount: function getRegisteredTestsCount(allSuites) {
    return allSuites.reduce((testCount, suite) => {
      return testCount + suite.totalTests
    }, 0)
  },
  getSkippedCount: function getSkippedCount(executedTestsCount, registeredTestsCount) {
    return registeredTestsCount - executedTestsCount // hard work!
  },
}
