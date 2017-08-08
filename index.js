/**
 * TODO (this can be part of another script that we use which is not part of any solution shared with mochawsome):
 * - add the profile to the file name
 * - use profile in file name to create groups of reports — run the below steps on each profile group
 * - then you can keep the aggregate profile reports separate or merge them all together into a super report
 */

const path = require('path')
const fs = require('fs')
const marge = require('mochawesome-report-generator')

const relPathToReports = process.argv[2]
const absPathToReports = path.resolve(relPathToReports)
const reports = fs.readdirSync(absPathToReports).filter((fileName) => {
  return fileName.includes('.json')
}).map((fileName) => {
  return require(absPathToReports + '/' + fileName)
})

/**
 * Step 1:
 * - is start time before — change it
 * - end time later — change it
 * - += duration
 */
let aggReport = reports.reduce((aggReport, report, i) => {
  if (i === 0) {
    return report
  }
  aggReport.stats.start = new Date(Math.min(
      Date.parse(aggReport.stats.start),
      Date.parse(report.stats.start)
  ))
  aggReport.stats.end = new Date(Math.max(
      Date.parse(aggReport.stats.end),
      Date.parse(report.stats.end)
  ))
  aggReport.stats.duration += report.stats.duration
  return aggReport
}, {})

/**
 * Step 2:
 * - find suites where tests and passed are not equal
 * - replace the suite with the same name assuming that it was not already replaced
 * - if it is the same log something to the console (preserving first run)
 * - then add test to all tests (assuming it's not already there) (top to bottom)
 * - if pass push to allPasses or to allFailures
 */
aggReport = reports.reduce((aggReport, report) => {
  report.suites.suites.forEach((suite) => {
    if (!suiteWasRun(suite)) {
      return
    }
    const idxToReplace = aggReport.suites.suites.findIndex((aggSuite) => {
      return aggSuite.title === suite.title
    })
    if (suiteWasRun(aggReport.suites.suites[idxToReplace])) {
      console.error('Warning:');
      console.error('Tried to merge in a suite that was already replaced - the same test must have been matched by separate parallel runs');
      console.error('Did not replace — keeping original!');
      return
    }
    aggReport.suites.suites.splice(idxToReplace, 1, suite)
  })
  aggReport.allTests.concat(report.allTests)
  aggReport.allPasses.concat(report.allPasses)
  aggReport.allFailures.concat(report.allFailures)
  return aggReport
}, aggReport)

/**
 * Step 3:
 * - total run suites
 * - total tests run
 * - total passing
 * - total failures
 * - pass percent passed/total registered
 * - skipped
 * - hasSkipped
 */
aggReport.stats.suites = aggReport.suites.suites.reduce((runSuiteCount, suite) => {
  return suiteWasRun(suite) ? runSuiteCount + 1 : runSuiteCount
}, 0)
aggReport.stats.tests = aggReport.allTests.length
aggReport.stats.passes = aggReport.allPasses.length
aggReport.stats.failures = aggReport.allFailures.length
aggReport.stats.passPercent = (aggReport.stats.passes / aggReport.stats.testsRegistered) * 100
aggReport.stats.skipped = aggReport.stats.testsRegistered - aggReport.stats.tests
aggReport.stats.hasSkipped = aggReport.stats.skipped !== 0

/**
 * Step 4:
 * - save .json report
 * - save .html file
 */
fs.writeFileSync(absPathToReports + '/' + 'aggregate-report.json', JSON.stringify(aggReport))
marge.create(aggReport, {
  reportDir: relPathToReports,
  reportFilename: 'aggregate-report',
})

/**
 * Utils:
 */
function suiteWasRun(suite) {
  if (!suite) {
    console.log(suite);
  }
  return suite.totalTests !== suite.totalSkipped
}







