const path = require('path')
const fs = require('fs')
const stats = require('./utils/stats')
const suites = require('./utils/suites')
const utils = require('./utils/utils')

module.exports.byProfile = function byProfile(relPathToReports, profile) {
  const absPathToReports = path.resolve(relPathToReports)
  const reports = fs.readdirSync(absPathToReports)
    .filter((fileName) => {
      return fileName.includes('.json') && fileName.includes(profile)
    })
    .map((fileName) => {
      return require(absPathToReports + '/' + fileName)
    })

  if (reports.length === 0) {
    return console.warn('No matching reports found to aggregate.')
  }

  const aggregateReport = reports.reduce((aggReport, report, i) => {
    const newSuites = suites.mergeSuites(aggReport, report)
    const newAllTests = suites.updateAllTests(aggReport, report)
    const newAllPending = suites.updateAllPending(aggReport, report)
    const newAllPasses = suites.updateAllPasses(aggReport, report)
    const newAllFailures = suites.updateAllFailures(aggReport, report)
    const newExecutedSuitesCount = stats.getExecutedSuitesCount(newSuites)
    const newRegisteredTestsCount = stats.getRegisteredTestsCount(newSuites)
    const newSkippedCount = stats.getSkippedCount(newAllTests.length, newRegisteredTestsCount)
    const newStart = stats.getEarliestStart(aggReport, report)
    const newEnd = stats.getLatestEnd(aggReport, report)

    return {
      stats: Object.assign(aggReport.stats, {
        start: newStart,
        end: newEnd,
        duration: stats.getDuration(newStart, newEnd),
        suites: newExecutedSuitesCount,
        tests: newAllTests.length,
        passes: newAllPasses.length,
        pending: newAllPending.length,
        failures: newAllFailures.length,
        testsRegistered: newRegisteredTestsCount,
        passPercent: stats.getPassPercent(newAllPasses.length, newSuites.length),
        pendingPercent: stats.getPendingPercent(newAllPending.length, newSuites.length),
        skipped: newSkippedCount,
        hasSkipped: !!newSkippedCount,
        passPercentClass: "danger",
        pendingPercentClass: "danger"
        // TODO these sometime
        // other: 0,
        // hasOther: false,
      }),
      suites: Object.assign(aggReport.suites, {
        suites: newSuites
      }),
      allTests: newAllTests,
      allPending: newAllPending,
      allPasses: newAllPasses,
      allFailures: newAllFailures,
      copyrightYear: aggReport.copyrightYear,
    }})

  const reportPrefix = profile ? profile : 'aggregate'
  utils.generateReportFiles(aggregateReport, reportPrefix, relPathToReports, absPathToReports)
}

module.exports.everything = function everything(relPathToReports, profile) {
  const absPathToReports = path.resolve(relPathToReports)
  const reports = fs.readdirSync(absPathToReports)
    .filter((fileName) => {
      return fileName.includes('-report.json')
    })
    .map((fileName) => {
      return Object.assign({}, require(absPathToReports + '/' + fileName), {
        profile: fileName.split('-report.json')[0],
      })
    })

  // prepend the profile name to each suite and test title
  reports.forEach((report) => {
    report.suites.suites.forEach((suite) => {
      suite.title = '[' + report.profile + '] ' + suite.title
      suite.tests.forEach((test) => {
        test.title = '[' + report.profile + '] ' + test.title
      })
    })
    report.allTests.forEach((test) => {
      test.title = '[' + report.profile + '] ' + test.title
    })
    report.allPasses.forEach((test) => {
      test.title = '[' + report.profile + '] ' + test.title
    })
    report.allFailures.forEach((test) => {
      test.title = '[' + report.profile + '] ' + test.title
    })
    report.allPending.forEach((test) => {
      test.title = '[' + report.profile + '] ' + test.title
    })
  })

  if (reports.length === 0) {
    return console.warn('No matching reports found to aggregate.')
  }

  const aggregateReport = reports.reduce((aggReport, report, i) => {
    const newSuites = aggReport.suites.suites.concat(report.suites.suites)
    const newAllTests = suites.updateAllTests(aggReport, report)
    const newAllPending = suites.updateAllPending(aggReport, report)
    const newAllPasses = suites.updateAllPasses(aggReport, report)
    const newAllFailures = suites.updateAllFailures(aggReport, report)
    const newExecutedSuitesCount = stats.getExecutedSuitesCount(newSuites)
    const newRegisteredTestsCount = stats.getRegisteredTestsCount(newSuites)
    const newSkippedCount = stats.getSkippedCount(newAllTests.length, newRegisteredTestsCount)
    const newStart = stats.getEarliestStart(aggReport, report)
    const newEnd = stats.getLatestEnd(aggReport, report)

    return {
      stats: Object.assign(aggReport.stats, {
        start: newStart,
        end: newEnd,
        duration: stats.getDuration(newStart, newEnd),
        suites: newExecutedSuitesCount,
        tests: newAllTests.length,
        passes: newAllPasses.length,
        pending: newAllPending.length,
        failures: newAllFailures.length,
        testsRegistered: newRegisteredTestsCount,
        passPercent: stats.getPassPercent(newAllPasses.length, newSuites.length),
        pendingPercent: stats.getPendingPercent(newAllPending.length, newSuites.length),
        skipped: newSkippedCount,
        hasSkipped: !!newSkippedCount,
        passPercentClass: "danger",
        pendingPercentClass: "danger"
        // TODO these sometime
        // other: 0,
        // hasOther: false,
      }),
      suites: Object.assign(aggReport.suites, {
        suites: newSuites
      }),
      allTests: newAllTests,
      allPending: newAllPending,
      allPasses: newAllPasses,
      allFailures: newAllFailures,
      copyrightYear: aggReport.copyrightYear,
    }})

  const reportPrefix = profile ? profile : 'aggregate'
  utils.generateReportFiles(aggregateReport, reportPrefix, relPathToReports, absPathToReports)
}
