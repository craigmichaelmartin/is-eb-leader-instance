# `is-eb-leader-instance`

[![Build Status](https://travis-ci.org/craigmichaelmartin/is-eb-leader-instance.svg?branch=master)](https://travis-ci.org/craigmichaelmartin/is-eb-leader-instance)
[![Greenkeeper badge](https://badges.greenkeeper.io/craigmichaelmartin/is-eb-leader-instance.svg)](https://greenkeeper.io/)
[![codecov](https://codecov.io/gh/craigmichaelmartin/is-eb-leader-instance/branch/master/graph/badge.svg)](https://codecov.io/gh/craigmichaelmartin/is-eb-leader-instance)

## Installation

```bash
npm install --save is-eb-leader-instance
```

## What is `is-eb-leader-instance`?

`is-eb-leader-instance` is a javascript function to determine if an Elastic Beanstalk instance is the "leader".

## Usage

```javascript
const isEBLeaderInstance = require('is-eb-leader-instance')('us-east-1');

isEBLeaderInstance().then(isLeader => {
  if (isLeader) {
    // Whatever code you want to only run on the leading instance
  }
});
```

#### Requirements

- The aws-elasticbeanstalk-ec2-role must have the `AmazonEC2ReadOnlyAccess` policy (so instances can check their status).

## Considerations

As it is right now, each time `isEBLeaderInstance` is called, a handful of requests are necessary to determine if it is the leading instance. Because of this, `is-eb-leader-instance` is not recommended if it is expected to be run on a very tight cadence (eg every second by a cron job). To account for this, some short term caching could be used, but this is not implemented.

## Background and Credit

[Tony Gutierrez](https://github.com/tony-gutierrez)'s [Cron Jobs on Load Balanced Multi Instance Elastic Beanstalk](https://bluefletch.com/blog/cron-jobs-on-load-balanced-multi-instance-elastic-beanstalk/) ([gist](https://gist.github.com/tony-gutierrez/de5b304fd042f6140eb61a31d0ff92d5))

## Other Libraries

- [`aws-eb-cron`](https://github.com/heathdutton/aws-eb-cron) - A bash-only (no dependencies) script to run cron tasks on just the leading instance in an Elastic Beanstalk cluster.
