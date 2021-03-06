const chalk = require('chalk')
const lightGet = require('../lib/light_get')
const valide = require('../lib/valide')

module.exports = program => {
  const { lang } = program
  const wdk = require('../lib/customized_wdk')(program)

  if (!valide.lang(lang)) {
    const err = new Error(chalk.red(`invalid language: ${lang}`))
    return Promise.reject(err)
  }
  const sparql = require('./queries/all_properties')(lang)
  const url = wdk.customize('sparqlQuery', sparql)

  return lightGet(url)
  .then(body => wdk.simplifySparqlResults(body).reduce(aggregator, {}))
}

const aggregator = (map, prop) => {
  const { property, propertyType: type } = prop
  let { value, label, description, aliases } = property
  // Keep only the properties ids (required for custom wikibase instances)
  value = value.replace(/.*\/entity\//, '')
  const noLabelFound = label === value
  map[value] = {
    label: noLabelFound ? undefined : label,
    type: type.split('#')[1],
    description,
    aliases
  }
  return map
}
