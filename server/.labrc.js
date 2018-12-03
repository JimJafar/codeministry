module.exports = {
  environment: 'localtest',
  verbose: true,
  coverage: true,
  threshold: 69,
  reporter: ['html', 'console'],
  output: ['./test/reports/report.html', 'stdout'],
  'coverage-exclude': ['config', 'models', 'enums']
}
