require('should')
const execa = require('execa')

describe('general', function () {
  this.timeout(10000)

  // This test may fail if your local network messes with the request
  // Known case: public hotspot
  it('should allow to customize the instance', done => {
    execa.shell('./bin/wd label Item:Q11 --instance https://wikibase-registry.wmflabs.org/w/api.php')
    .then(res => {
      res.stdout.should.equal('TransforMap Base')
      done()
    })
    .catch(done)
  })

  // Addressed by https://github.com/maxlath/commander.js/commit/1297ae6
  it('should accepts options before arguments', done => {
    execa.shell('./bin/wd claims -c Q90 P625')
    .then(res => {
      res.stdout.should.equal('48.856577777778 2.3518277777778')
      done()
    })
    .catch(done)
  })
})
