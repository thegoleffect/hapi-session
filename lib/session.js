var Hoek = require('hoek');
var UUID = require('node-uuid');
var CookieStore = require('./stores/cookie');
var MemoryStore = require('./stores/memory');

var internals = {};

internals.config = {
    _key: 'session'
};

var Session = function (options) {

    Hoek.merge(internals.config, options);
    this.options = internals.config;
    
    if (this.options.store) {
        this.extStore = this.options.store;
    }
    
    this.cookieStore = new CookieStore(this.options);
    this.memoryStore = new MemoryStore(this.options);
    
    return this;
};

Session.prototype.save = function (request, callback) {

    var self = this;
    var session = request[this.options._key];
    
    // Try External Store
    
    if (this.extStore && this.extStore.validate(session)) {
        var sid = this.generateSID(session);
        return this.extStore.get(sid, session, function (err) {

            var s = {};
            s[self.options.sidKey] = sid;
            request.setState(self.options.name, s);
            callback(err);
        });
    }
    
    // No External Store, try Cookie
    
    if (this.cookieStore && this.cookieStore.validate(session)) {
        return this.cookieStore.get(null, session, function (err) {

            request.setState(self.options.name, session);
            callback(err);
        });
    }
    
    // Fallback to Memory Store
    
    var sid = this.generateSID(session);
    this.memoryStore.get(sid, session, function (err) {

        request.setState(internals.config.name, session);
        callback(err);
    });
};


Session.prototype.attach = function (request, callback) {

    return function (err, session, req) {

        request[this._key] = session;
        callback();
    };
};


Session.prototype.load = function (request, callback) {

    console.log('session.load')
    var self = this;
    
    // Get initial state from cookie
    
    request.state[this.options.name] = request.state[this.options.name] || {};
    request[this.options._key] = request.state[this.options.name];
    console.log('request', this.options._key, '=', request[this.options._key]);
    
    if (!request[this.options._key].hasOwnProperty(self.options.sidKey)) {
        // CookieStore detected, no need to modify session
        return callback();
    }
    else {
        if (this.extStore) {
            return this.extStore.get(sid, this.attach(request, callback));
        }
        
        return this.memoryStore.get(sid, this.attach(request, callback));
    }
};


Session.prototype.generateSID = function (session) {

    session = session || {};
    return session[this.options.sidKey] || UUID.v4();
};

module.exports = Session;