/**
 * TODO (this can be part of another script that we use which is not part of any solution shared with mochawsome):
 * - add the profile to the file name
 * - use profile in file name to create groups of reports — run the below steps on each profile group
 * - then you can keep the aggregate profile reports separate or merge them all together into a super report
 */

const path = require('path')
const fs = require('fs')
const marge = require('mochawesome-report-generator')

module.exports.byProfile = function byProfile(relPathToReports) {
  const absPathToReports = path.resolve(relPathToReports)
  const reports = fs.readdirSync(absPathToReports).filter((fileName) => {
    return fileName.includes('-report.json')
  }).map((fileName) => {
    return {
      profile: fileName.split('-report.json')[0],
      report: require(absPathToReports + '/' + fileName),
    }
  })

  if (reports.length === 0) {
    return console.warn('No matching reports found to aggregate.')
  }

  /**
   * Step 1:
   * - is start time before — change it
   * - end time later — change it
   * - += duration
   */
  let aggReport = reports.reduce((aggReport, report, i) => {
    if (i === 0) {
      // at the very beginning make the first report the agg report
      return report.report
    }
    aggReport.stats.start = new Date(Math.min(
        Date.parse(aggReport.stats.start),
        Date.parse(report.report.stats.start)
    ))
    aggReport.stats.end = new Date(Math.max(
        Date.parse(aggReport.stats.end),
        Date.parse(report.report.stats.end)
    ))
    aggReport.stats.duration += report.report.stats.duration
    return aggReport
  }, {})

  aggReport.suites.suites.forEach((suite) => {
    suite.title = '[' + reports[0].profile + '] ' + suite.title
    suite.tests.forEach((test) => {
      test.title = '[' + reports[0].profile + '] ' + test.title
    })
  })

  /**
   * Step 2:
   * - prepend profile name to suites and tests titles
   * - concat everything together
   * - if pass push to allPasses or to allFailures
   */
  // TODO this slice is confusing and terrible
  aggReport = reports.slice(1).reduce((aggReport, report) => {
    // TODO this bad code
    report.report.suites.suites.forEach((suite) => {
      suite.title = '[' + report.profile + '] ' + suite.title
      suite.tests.forEach((test) => {
        test.title = '[' + report.profile + '] ' + test.title
      })
    })
    aggReport.suites.suites = aggReport.suites.suites.concat(report.report.suites.suites) // ... lol
    aggReport.allTests = aggReport.allTests.concat(report.report.allTests)
    aggReport.allPasses = aggReport.allPasses.concat(report.report.allPasses)
    aggReport.allFailures = aggReport.allFailures.concat(report.report.allFailures)
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
  fs.writeFileSync(absPathToReports + '/aggregate-report.json', JSON.stringify(aggReport))
  marge.create(aggReport, {
    reportDir: relPathToReports,
    reportFilename: 'aggregate-report',
  })
}


/**
 * Utils:
 */
function suiteWasRun(suite) {
  if (!suite) {
    console.log(suite);
  }
  return suite.totalTests !== suite.totalSkipped
}







