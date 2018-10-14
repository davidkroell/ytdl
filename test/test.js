process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../ytdl');
/* eslint-disable no-unused-vars */
let should = chai.should();

chai.use(chaiHttp);

describe('/GET homepage', () => {
    it('it should GET the homepage', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
});
