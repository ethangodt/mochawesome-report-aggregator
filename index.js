#! /usr/bin/env node

/**
 * - make aggregate handle filter by profile or not
 *
 * - make an aggregate by profile
 * - append the profile name to each test and suite?
 * - add everything together
 * - concat all suites and active tests, etc
 */

const aggregate = require('./aggregate')
const superAggregate = require('./superAggregate')
const relPathToReports = process.argv[2]
const profilesArg = process.argv[3] || ''
let profiles = profilesArg.split(',')

if (profiles.length < 2) {
  // if for some reason not providing any profiles, just group everything
  profiles = ['']
}

profiles.forEach((profile) => {
  // make an aggregate report for each profile
  aggregate.byProfile(relPathToReports, profile)
})

if (profiles.length < 2) {
  return
}

superAggregate.byProfile(relPathToReports)
