var Hoek = require('hoek');

var internals = {};

internals.config = {
    name: 'session',
    isSingleUse: false,
    options: {
        path: '/'
    }
};

exports.register = function (pack, options, next) {

    Hoek.merge(internals.config, options);
    internals.config.options.encoding = 'iron';
    
    pack.state(internals.config.name, internals.config.options);
    pack.ext('onPreHandler', internals.onPreHandler);
    pack.ext('onPostHandler', internals.onPostHandler);
};

internals.onPreHandler = function (request, next) {

    request.state[internals.config.name] = request.state[internals.config.name] || {};
    request.session = request.state[internals.config.name];
    console.log('onpre session', request.session)
    
    next();
};

internals.onPostHandler = function (request, next) {

    console.log('onpost session', request.session)
    if (request.session != null) {
        request.setState(internals.config.name, request.session);
    }
    else {
        request.clearState(internals.config.name);
    }
    
    next();
};