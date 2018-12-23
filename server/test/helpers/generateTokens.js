#!/usr/bin/env node
// NODE_ENV=localtest JWT_SECRET=Qfs7mHpMuNoUNrYIipnB8GcWiCq11iHiw4mQgzOln8ZEEP73r5HbATElIgzLz26wfzlHIg5qM6TG0QDl2l4IC1wI8Yi78/oCYCL+0VN0AWhUik+pt78WkrL2kZrHCNNNb1WY9XDD+D9AAGvtMDZ5OTGflWhNo9259glzKSMJwqkQZQveGeIfgKnT5yi6rF1C68/pmALNbtMua21w4uUDfozRYYqfrl3lC66UvYfbptqgkrrSMHYqllLIYuVYlByT7qOZi9Q3IB86CnPo6R/Bv2CQ2kGQm+1ASDrc3Cqyq37TRLoTCuWQCfTbY2JqrIRH9t4JOEXkiChiH51cF8fdmw== node ./server/test/helpers/generateTokens.js

const authUtils = require('../../utils/authUtils')

const adminUser = {
  userId: 'a9c466e2-652f-4f4e-a7e0-b82d1768ad21',
  email: 'admin@test.com',
  password: '$2a$10$EYfAJ6Doc/CDEEDBzlFa0uKi.0DdFTeGCqrGFDt1Q3P6yI2MEr.Q6',
  activated: true,
  disabled: false,
  firstName: 'Admin',
  lastName: 'User',
  isAdmin: true
}

console.log('adminUser: ', authUtils.generateToken(adminUser, 'adminUserSession'))

const standardUser = {
  userId: 'f846ebd0-04c3-4a30-ae43-f06467b951c4',
  email: 'user@test.com',
  password: '$2a$10$EYfAJ6Doc/CDEEDBzlFa0uKi.0DdFTeGCqrGFDt1Q3P6yI2MEr.Q6',
  activated: true,
  disabled: false,
  firstName: 'Test',
  lastName: 'User',
  isAdmin: false
}

console.log('standardUser: ', authUtils.generateToken(standardUser, 'standardUserSession'))

const otherUser = {
  userId: '4',
  email: 'other@test.com',
  password: '$2a$10$EYfAJ6Doc/CDEEDBzlFa0uKi.0DdFTeGCqrGFDt1Q3P6yI2MEr.Q6',
  activated: true,
  disabled: false,
  firstName: 'Other',
  lastName: 'User',
  isAdmin: false
}

console.log('otherUser: ', authUtils.generateToken(otherUser, 'otherUserSession'))
