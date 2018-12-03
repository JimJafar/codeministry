#!/usr/bin/env node
const aguid = require('aguid')

for (i=0; i<20; i++) {
  console.log(aguid())
}
