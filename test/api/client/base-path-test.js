'use strict';
var chai = require('chai');
var request = require('request');
var expect = chai.expect;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('/', function() {
  describe('get', function() {

    this.timeout(9999);
    
    it('should respond with 302 Success', function(done) {
      request({
      	followRedirect: false,
      	timeout: 9999,
        url: 'https://localhost:10011/',
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(302);

        expect(body).to.not.equal(null); // non-json response or no schema
        done();
      });
    });

    it('should respond with 200 Success after redirect', function(done) {
      request({
      	followRedirect: true,
      	timeout: 9999,
        url: 'https://localhost:10011/',
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(200);

        expect(body).to.not.equal(null); // non-json response or no schema
        done();
      });
    });

    it('should respond with default Error', function(done) {
      request({
      	timeout: 9999,
        url: 'https://localhost:10011/ee',
        method: 'GET',
        headers: {
          'Content-Type': 'text/html'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(400);

        expect(body).to.not.equal(null); // non-json response or no schema
        done();
      });
    });

  });

});
