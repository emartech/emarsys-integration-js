'use strict';

const targets = require('./url_targets');

const getFullUrlByTarget = targets => ({ sessionId, target, params = {} }) => {
  const getUrlByTarget = (pathname) => {
    if (pathname in targets) {
      return targets[pathname];
    }

    throw new Error('Error 404: Unknown pathname');
  };

  const replaceUrlParams = (url, params = {}) => {
    for (let key in params) {
      if (params.hasOwnProperty(key) && key !== 'pathname') {
        url = url.replace(new RegExp('{' + key + '}', 'g'), params[key]);
      }
    }

    return url;
  };

  params.session_id = sessionId;
  return replaceUrlParams(getUrlByTarget(target), params);
};

module.exports = getFullUrlByTarget;
module.exports.create = () => getFullUrlByTarget(targets);
