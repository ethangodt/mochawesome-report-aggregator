module.exports.mergeSuites = function mergeSuites(r1, r2) {
  // Conditions:
  // 1. if it exists in first but isn't changed overwrite it
  // 2. if it is already changed throw an error
  // 3. if it doesn't exist append it
  const s1 = r1.suites.suites
  const s2 = r2.suites.suites
  const mergedSuites = s1
  s2.forEach((suite) => {
    if (!suiteWasRun(suite)) {
      // if the new suite we want to potentially merge in was not even run
      // don't do anything with it — just return out
      return
    }
    const idxToReplace = mergedSuites.findIndex((aggSuite) => {
      return aggSuite.title === suite.title
    })
    const matchingAggReportSuite = mergedSuites[idxToReplace]
    if (!matchingAggReportSuite) {
      // if there is no matching suite we'll need to append it
      mergedSuites.push(suite)
      return
    }
    if (suiteWasRun(matchingAggReportSuite)) {
      // if the matching suite we'd consider replacing was already replaced we should warn
      console.error('Warning:');
      console.error('Tried to merge in a suite that was already replaced - the same test must have been matched by separate parallel runs');
      console.error('Did not replace — keeping original!');
      return
    }
    mergedSuites.splice(idxToReplace, 1, suite)
  })
  return mergedSuites
}

module.exports.updateAllTests = function updateAllTests(r1, r2) {
  return r1.allTests.concat(r2.allTests.filter((suite) => !isSuiteInList(r1.allTests, suite)))
}

module.exports.updateAllPending = function updateAllPending(r1, r2) {
  return r1.allPending.concat(r2.allPending.filter((suite) => !isSuiteInList(r1.allPending, suite)))
}

module.exports.updateAllPasses = function updateAllPasses(r1, r2) {
  return r1.allPasses.concat(r2.allPasses.filter((suite) => !isSuiteInList(r1.allPasses, suite)))
}

module.exports.updateAllFailures = function updateAllFailures(r1, r2) {
  return r1.allFailures.concat(r2.allFailures.filter((suite) => !isSuiteInList(r1.allFailures, suite)))
}

module.exports.suiteWasRun = suiteWasRun

function suiteWasRun(suite) {
  return suite.totalTests !== suite.totalSkipped
}

function isSuiteInList(list, suite) {
  return 0 < list.findIndex((s) => {
    return s.title === suite.title
  })
}
