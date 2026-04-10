const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const wxmlPath = path.join(__dirname, '..', 'miniprogram', 'pages', 'index', 'index.wxml')
const pagePath = path.join(__dirname, '..', 'miniprogram', 'pages', 'index', 'index.js')

let capturedPage = null

global.Page = (definition) => {
  capturedPage = definition
}

require(pagePath)

const indexWxml = fs.readFileSync(wxmlPath, 'utf8')

test('index page uses explicit boolean flags for recommendation states', () => {
  assert.ok(indexWxml.includes('wx:if="{{hasPickedMeal}}"'))
  assert.ok(indexWxml.includes('wx:if="{{showCandidateEmpty}}"'))
  assert.ok(indexWxml.includes('wx:if="{{showLibraryEmpty}}"'))
  assert.ok(indexWxml.includes('wx:if="{{showOverview}}"'))
  assert.equal(indexWxml.includes('wx:elif'), false)
})

test('index page no longer uses inline ternary or fallback expressions in bindings', () => {
  assert.equal(indexWxml.includes(' ? '), false)
  assert.equal(indexWxml.includes('||'), false)
})

test('index page registers Page definition', () => {
  assert.ok(capturedPage)
  assert.equal(typeof capturedPage.refreshRecommendation, 'function')
})
