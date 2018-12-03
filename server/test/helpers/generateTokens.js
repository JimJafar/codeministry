#!/usr/bin/env node
const authUtils = require('../../utils/authUtils')

const adminUser = {
  userId: 'a9c466e2-652f-4f4e-a7e0-b82d1768ad21',
  email: 'admin@test.com',
  password: '$2a$10$EYfAJ6Doc/CDEEDBzlFa0uKi.0DdFTeGCqrGFDt1Q3P6yI2MEr.Q6',
  activated: true,
  disabled: false,
  name: 'Test Admin User',
  isAdmin: true
}

console.log('adminUser: ', authUtils.generateToken(adminUser, 'adminUserSession'))

const standardUser = {
  userId: 'f846ebd0-04c3-4a30-ae43-f06467b951c4',
  email: 'user@test.com',
  password: '$2a$10$EYfAJ6Doc/CDEEDBzlFa0uKi.0DdFTeGCqrGFDt1Q3P6yI2MEr.Q6',
  activated: true,
  disabled: false,
  name: 'Test User',
  isAdmin: false
}

console.log('standardUser: ', authUtils.generateToken(standardUser, 'standardUserSession'))

const otherUser = {
  userId: '4',
  email: 'other@test.com',
  password: '$2a$10$EYfAJ6Doc/CDEEDBzlFa0uKi.0DdFTeGCqrGFDt1Q3P6yI2MEr.Q6',
  activated: true,
  disabled: false,
  name: 'Other Test User',
  isAdmin: false
}

console.log('otherUser: ', authUtils.generateToken(otherUser, 'otherUserSession'))
