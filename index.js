#! /usr/bin/env node

const aggregate = require('./aggregate')
const superAggregate = require('./superAggregate')
const relPathToReports = process.argv[2]
const profilesArg = process.argv[3] || ''
let profiles = profilesArg.split(',')


const isMultiProfile = profiles.length > 1
if (!isMultiProfile) {
  // if only providing one (or none) profile then consider final aggregate
  // (i.e. no need to prefix with "chrome")
  profiles = ['']
}

profiles.forEach((profile) => {
  // make an aggregate report for each profile
  aggregate.byProfile(relPathToReports, profile)
})

if (!isMultiProfile) {
  // no need to group profile aggregates into a "super" aggregate
  return
}

aggregate.everything(relPathToReports)
