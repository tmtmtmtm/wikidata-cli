const lightGet = require('../lib/light_get')
const errors_ = require('../lib/errors')
const { dim } = require('chalk')
const program = require('../lib/program')
const output = require('../lib/output')(program)
const wdk = require('../lib/customized_wdk')(program)

const simplify = !program.raw
const { index: indexAttribute } = program

module.exports = sparql => {
  const url = wdk.customize('sparqlQuery', sparql)
  return makeRequest(url)
  .then(parseResult)
  .catch(errors_.exit)
}

const makeRequest = url => {
  // Avoid making a POST request when not necessary as those aren't cached
  // see https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual#SPARQL_endpoint
  if (url.length < 5000) {
    output(`${dim('Generated get query:')} ${url}`, true, true)
    return lightGet(url)
    .then(JSON.parse)
  } else {
    const [ postUrl, body ] = url.split('?')
    output(`${dim('Generated post body:')} ${body}`, true, true)
    return require('../lib/heavy_req').post(postUrl, body).get('body')
  }
}

const parseResult = results => {
  if (simplify) {
    results = wdk.simplifySparqlResults(results)
    if (indexAttribute) results = indexBy(results, indexAttribute)
  }
  return results
}

const indexBy = (array, attribute) => {
  const index = {}
  array.forEach(obj => {
    let key = obj[attribute]
    delete obj[attribute]
    if (typeof key === 'object' && key.value) key = key.value
    // Not setting the obj as direct value, as several obj might share the same key
    if (!index[key]) index[key] = [ obj ]
    else index[key].push(obj)
  })
  return index
}
