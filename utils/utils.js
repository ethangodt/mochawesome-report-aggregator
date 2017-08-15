const fs = require('fs')
const marge = require('mochawesome-report-generator')

module.exports.generateReportFiles = function generateReportFiles(aggregateReport, reportPrefix, relPathToReports, absPathToReports) {
  fs.writeFileSync(absPathToReports + '/' + reportPrefix + '-report.json', JSON.stringify(aggregateReport))
  marge.create(aggregateReport, {
    reportDir: relPathToReports,
    reportFilename: reportPrefix + '-report',
  })
}
