#!/usr/bin/env node
const aguid = require('aguid')

for (let i = 0; i < 20; i++) {
  console.log(aguid())
}
