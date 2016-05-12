/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var tcpPortUsed = require('tcp-port-used');
var settings = require('./settings');
var Lookup = require('./lookup');
var async = require('async');
var log2out = require('log2out');

function CheckAvailability () {
    this.tcpPortUsed = tcpPortUsed;
    this.lookup = new Lookup();
    this.logger = log2out.getLogger('CheckAvailability');
    this.beginTime = new Date().getTime();
}

CheckAvailability.prototype.check = function(checkList, callback, retryTime, timeout) {
    var self = this;
    var fails = [];
    retryTime = retryTime || settings.retryTime;
    timeout = timeout || settings.timeout;

    this.logger.debug('Going to check the list: ', checkList);
    this.logger.debug('beginTime: ', this.beginTime);
    this.logger.debug('retryTime: ', retryTime);
    this.logger.debug('timeout: ', timeout);
    async.forEach(checkList,
        function(item, next) {
            self.logger.info(item);
            var elem = self._parseInput(item);
            var fail = elem.port ? elem.url+':'+elem.port : elem.url;
            self.lookup.check(elem.url, function lookupSuccessCallback(addresses) {
                self.logger.debug('Addresses', addresses);
                if (!elem.port) {
                    next();
                    return;
                }
                self.tcpPortUsed.waitUntilUsedOnHost(elem.port, elem.url, retryTime, timeout)
                    .then(function() {
                        next();
                    }, function(err) {
                        self.logger.debug(err);
                        self.logger.info('Could not connect to port ', fail);
                        fails.push(fail);
                        next();
                    });
            }, function lookupFailCallback () {
                self.logger.info('Could not resolve: ', elem.url);
                fails.push(fail);
                next();
            }, retryTime, timeout);
        },
        function() {
            self.logger.debug('##########################Fails: ', fails);
            if (fails.length > 0) {
                var currentTime = new Date().getTime();
                self.logger.debug('beginTime: ', self.beginTime);
                self.logger.debug('timeout: ', timeout);
                self.logger.debug('current Time: ', currentTime);
                if (self.beginTime + timeout > currentTime) {
                    self.check.call(self, fails, callback, retryTime, timeout);
                } else {
                    self.logger.error('Timeout reached, checking failed!');
                    callback('timeout');
                }
            } else {
                callback();
            }
        }
    );
};

CheckAvailability.prototype._parseInput = function(item) {
    this.logger.debug('Parsing item: ', item);
    if (typeof item === 'string') {
        if (item.indexOf(':') !== -1) {
            var arr = item.split(':');
            var key = arr[0];
            var value = +arr[1];
        } else {
            key = item;
            var value = undefined;
        }
    } else if (typeof item === 'object') {
        var key = Object.keys(item)[0];
        var value = item[key];
    }

    return {url: key, port: value};
};

module.exports = CheckAvailability;
