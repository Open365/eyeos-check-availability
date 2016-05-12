Eyeos Check Availability Library
================================

## Overview

It is a library that accepts one array of hosts and ports to check if they are available, and then executes a callback.

## How to use it

```javascript
var CheckAvailability = require('eyeos-check-availability');

var checkAvailability = CheckAvailability();

var list = [
   {'localhost': 443},
   {'camel.service.consul': 8196}
];

OR

var list = [
    'localhost:443',
    'camel.service.consul:8196'
];
var retryTime = 1000;
var timeout = 60000;

checkAvailability.check(list, function(err) {
    if (err) {
        console.error('timed out');
    } else {
        console.log('Services UP!');
    }
}, retryTime, timeout);
```

### Use it like a command line tool

You also can check services with the command line tool:

```sh
./node_modules/.bin/check-availability-service <DOMAIN> <PORT> <RETRY_TIME> <TIMEOUT>
```

All 4 params are mandatory.

### Envars

You can control retryTime and timeout by passing arguments, environment vairable and settings file, in that order.
EYEOS_CHECK_AVAILABILITY_RETRYTIME and EYEOS_CHECK_AVAILABILITY_TIMEOUT.

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ ./tests.sh
```
