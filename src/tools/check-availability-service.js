#!/usr/bin/env node
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


if (process.argv.length !== 6) {
    console.log("Usage: check-availability-service \<DOMAIN\> \<PORT\> \<RETRY_TIME\> \<TIMEOUT\>");
    process.exit(0);
} else {
    var domain = process.argv[2];
    var port = +process.argv[3];
    var retryTime = +process.argv[4];
    var timeout = +process.argv[5];
    var CheckAvailability = require('../lib/CheckAvailability');
    var checkAvailability = new CheckAvailability();

    checkAvailability.check([
        domain+':'+port
    ], function(err) {
        if (err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log('Service UP!');
        }
    }, retryTime, timeout);
}
