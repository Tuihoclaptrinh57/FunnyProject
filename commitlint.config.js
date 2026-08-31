module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat','fix','docs','style','refactor','test','chore','perf','build','ci','revert']],
    'scope-enum': [2, 'always', ['flash','live','feed','logistics','wallet','collab','user','catalog','common','web','ci','docs','deps','config']],
    'subject-case': [0]
  }
};
