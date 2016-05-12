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

var dns = require('dns');
var log2out = require('log2out');

function Lookup() {
    this.logger = log2out.getLogger('Lookup');
    this.beginTime = new Date().getTime();
}

Lookup.prototype.check = function(url, callback, fail, retryTime, timeout) {
    var self = this;
    this.logger.debug('retryTime: ', retryTime);
    this.logger.debug('timeout: ', timeout);
    this.logger.debug('checking url: ', url);
    dns.lookup(url, function(err, addresses) {
        if (err) {
            self.logger.debug('retrying url', url, ', error: ', err);
            self.onFail(url, callback, fail, retryTime, timeout);
        } else {
            self.logger.debug('Got response for', url, ':', addresses);
            callback(addresses);
        }
    });
};

Lookup.prototype.onFail = function(url, callback, fail, retryTime, timeout) {
    this.logger.debug('beginTime: ', this.beginTime);
    this.logger.debug('retryTime: ', retryTime);
    this.logger.debug('timeout: ', timeout);
    this.logger.debug('current Time: ', new Date().getTime());
    if (this.beginTime + timeout > new Date().getTime()) {
        var self = this;
        setTimeout(self.check.bind(self, url, callback, fail, retryTime, timeout), retryTime);
    } else {
        fail();
    }
};

module.exports = Lookup;
