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

var net = require('net');
var assert = require('chai').assert;

var CheckAvailability = require('../src/lib/CheckAvailability');

suite('CheckAvailability', function() {
    var sut, httpToBusPort = 9045, httpsPort = 4443;

    suiteSetup(function() {
        var server = net.createServer();
        var server2 = net.createServer();
        server.listen(httpToBusPort);
        server2.listen(httpsPort);
    });

    setup(function() {
        sut = new CheckAvailability();
    });

    test('check should call callback on services up', function(done) {
        sut.check([
            {'localhost':httpToBusPort},
            {'localhost':httpsPort}
        ], done, 1000, 6000);
    });

    test('check should call callback on services up (different syntax)', function(done) {
        sut.check([
            "localhost:"+httpToBusPort,
            "localhost:"+httpsPort
        ], done, 1000, 6000);
    });

    test('check should call callback with error on not resolved domain after 6 seconds', function(done) {
        sut.check([
            "localhosty",
            "localhost:" + httpToBusPort
        ], function (err) {
            assert.equal(err, 'timeout', 'There is no error');
            done();
        }, 1000, 6000);
    });

    test('check should call callback with error on not responding port after 6 seconds', function(done) {
        sut.check([
            "localhost",
            "localhost:1" + httpToBusPort
        ], function (err) {
            assert.equal(err, 'timeout', 'There is no error');
            done();
        }, 1000, 6000);
    });
});
