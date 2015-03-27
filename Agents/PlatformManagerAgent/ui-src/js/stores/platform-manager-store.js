'use strict';

var ACTION_TYPES = require('../constants/action-types');
var dispatcher = require('../dispatcher');
var Store = require('../lib/store');

if (!location.hash) {
    history.replaceState(null, null, '#home');
}

var _authorization = sessionStorage.getItem('authorization');
var _page = location.hash.substr(1);
var _platforms = [];

var platformManagerStore = new Store();

platformManagerStore.getAuthorization = function () {
    return _authorization;
};

platformManagerStore.getPage = function () {
    return _page;
};

platformManagerStore.getPlatforms = function () {
    return _platforms;
};

window.onhashchange = function () {
    _page = location.hash.substr(1);
    platformManagerStore.emitChange();
};

platformManagerStore.dispatchToken = dispatcher.register(function (action) {
    switch (action.type) {
        case ACTION_TYPES.RECEIVE_AUTHORIZATION:
            _authorization = action.authorization;
            sessionStorage.setItem('authorization', _authorization);
            platformManagerStore.emitChange();
            break;

        case ACTION_TYPES.RECEIVE_UNAUTHORIZED:
        case ACTION_TYPES.CLEAR_AUTHORIZATION:
            _authorization = null;
            sessionStorage.removeItem('authorization');
            platformManagerStore.emitChange();
            break;

        case ACTION_TYPES.CHANGE_PAGE:
            _page = action.page;
            location.hash = '#' + action.page;
            platformManagerStore.emitChange();
            break;

        case ACTION_TYPES.RECEIVE_PLATFORMS:
            _platforms = action.platforms;
            platformManagerStore.emitChange();
            break;
    }
});

module.exports = platformManagerStore;