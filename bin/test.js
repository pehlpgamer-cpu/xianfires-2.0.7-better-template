import { configure, processCLIArgs, run } from '@japa/runner'
import { expect } from '@japa/expect'
import { apiClient } from '@japa/api-client'
import { fileSystem } from '@japa/file-system'
import { expectTypeOf } from '@japa/expect-type'
import { snapshot } from '@japa/snapshot'
import { browserClient } from '@japa/browser-client'

processCLIArgs(process.argv.splice(2))
configure({
  suites: [
    {
      name: 'browser',
      timeout: 30 * 1000,
      files: ['tests/browser/**/*.spec.js'],
    },
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.js'],
    }
  ],
  plugins: [
    expect(),
    apiClient('http://localhost:3333'),
    // fileSystem(),
    expectTypeOf(),
    snapshot(),
    browserClient({ runInSuites: ['browser'] }),
  ],
})

run()