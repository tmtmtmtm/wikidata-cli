module.exports = {
  args: '<entity>',
  options: {
    lang: false,
    verbose: false,
    clipboard: true,
    json: true,
    instance: true,
    sparqlEndpoint: false
  },
  description: 'display the geographic coordinates (latitude and longitude) of an entity (P625)',
  examples: [
    { args: 'Q456', comment: 'fetch the coordinates of the city of Lyon' }
  ]
}
