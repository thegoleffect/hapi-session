var Boom = require('boom');
var Hoek = require('hoek');
var UUID = require('node-uuid');
var Session = require('./session');

var internals = {};

// internals.Store.prototype.load = function (request, callback) {

//     console.log('load')
//     request.state[internals.config.name] = request.state[internals.config.name] || {};
//     request.session = request.state[internals.config.name];
    
//     if (request.session.hasOwnProperty(internals.config.sidKey)) {
//         this.store.get(request.session[internals.config.sidKey], function(err, obj) {

//             request.session = obj;
//             return callback(err, request.session, request);
//         });
//     }
    
//     return callback(null, request.session, request);
// };

internals.config = {
    name: 'session',
    isSingleUse: false,
    options: {
        path: '/'
    },
    maxLen: 2300,
    sidKey: '_id'
};

exports = module.exports = {
    name: 'hapi-session',
    version: require('../package.json').version,
    hapi: require('../package.json').hapi,
    // register: internals.register
};

exports.register = function (pack, options, next) {

    Hoek.merge(internals.config, options);
    internals.config.options.encoding = 'iron';
    
    // internals.Session = new internals.Store(internals.config);
    internals.Session = new Session(internals.config);
    
    pack.state(internals.config.name, internals.config.options);
    pack.ext('onPreHandler', internals.onPreHandler);
    pack.ext('onPostHandler', internals.onPostHandler);
};

internals.onPreHandler = function (request, next) {

    // request.state[internals.config.name] = request.state[internals.config.name] || {};
    // request.session = request.state[internals.config.name];
    
    
    
    // internals.Session.load(request, function (err) {

    //     next();
    // });


    // request.state[internals.config.name] = request.state[internals.config.name] || {};
    // request.session = request.state[internals.config.name];
    
    // if (request.session.hasOwnProperty(internals.config.sidKey)) {
    //     internals.Session.store.get(request.session[internals.config.sidKey], function(err, obj) {

    //         request.session = obj;
    //         return next();
    //     });
    // }
    // else {
    //     return next();
    // }
    console.log('onPre')
    internals.Session.load(request, next);
};

internals.onPostHandler = function (request, next) {

    // var sessionLen = JSON.stringify(request.session).length;
    // if (sessionLen >= internals.config.maxLen) {
    //     // log Boom.internal('session length too large for cookie storage', {len: sessionLen, session: request.session})
    //     // no choice but to use in-memory storage
    // }
    
    // if (request.session != null) {
    //     request.setState(internals.config.name, request.session);
    // }
    // else {
    //     request.clearState(internals.config.name);
    // }
    
    
    
    internals.Session.save(request, next);
};