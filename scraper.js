var http = require('http');
var cheerio = require('cheerio');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var STATUS_CODES = http.STATUS_CODES;
/*
 * Scraper Constructor
**/
function Scraper (url) {
    this.url = url;
    this.init();
}
/*
 * Make it an EventEmitter
**/
util.inherits(Scraper, EventEmitter);

/*
 * Initialize scraping
**/
Scraper.prototype.init = function () {
    var model;
    var self = this;
    self.on('loaded', function (html) {
        model = self.parsePage(html);
        self.emit('complete', model);
    });
    self.loadWebPage();
};

Scraper.prototype.loadWebPage = function () {
    var self = this;
    console.log('\n\nLoading ');
    http.get(self.url, function (res) {
      var body = '';
     
      if(res.statusCode !== 200) {
        return self.emit('error', STATUS_CODES[res.statusCode]);
      }
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        self.emit('loaded', body);
      });
    })
    .on('error', function (err) {
      self.emit('error', err);
    });      
  };
  /*
   * Parse html and return an object
  **/
  Scraper.prototype.parsePage = function (html) {
    var $ = cheerio.load(html);
    var address = $('#address').text();
    var tel = $('#tel').text();
    var cell = $('#cell').text();
    var fax = $('#fax').text();
    var email = $('#email').text();
    var website = $('#website').attr('href');
    var postal =  $('#postal').text();
    var model = {
      title: address.trim().split('\n'),
      email: email.trim(),
      cell: cell.trim().split('\n'),
      telephone: tel.trim().split('\n'),
      fax: fax.trim().split('\n'),
      website: website || '',
      postalAddress: postal.trim().split('\n'),
      address: address.trim().split('\n'),
      url: this.url
    };
    return model;
  };
  module.exports = Scraper;