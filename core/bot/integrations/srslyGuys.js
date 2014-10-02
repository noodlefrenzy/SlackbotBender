var _         = require('underscore'),
    _s        = require('underscore.string'),
    bing      = require('node-bing-api'),
    debug     = require('debug')('srslyGuys'),

    helpers   = require('../helpers'),
    triggers  = require('../triggers');

var noApiKey  = 'No data without the key, meatbag.',
    callFailure = 'Apparently, Bing hates you as much as I do.',
    noData = 'You can\'t even search for things correctly, idiot.';

var srslyGuys = {

    guys: function (query, key, callback) {
        if (!key && !process.env.BING_API_KEY) {
            callback(noApiKey);
            return;
        }

        var cmd = _s.ltrim(helpers.startsWithAny(query, triggers.srsly, true), '!');
        var q = _s.trim(helpers.strRight(query, triggers.srsly));

        var bingClient = bing({ accKey: key || process.env.BING_API_KEY });
        var adjustedQ = q;
        var predicate = function (result) { return true; };
        switch (cmd) {
            case 'srsly':
                adjustedQ = q + ' gif';
                predicate = function (result) { return result.MediaUrl.endsWith('.gif'); };
                break;

            case 'orly':
                adjustedQ = q + ' meme';
                break;

            case 'wut':
                break;
        }
        bingClient.images(adjustedQ, function (err, res, body) {
            if (err || res.statusCode != 200) {
               debug('Failed call for '+adjustedQ+': '+err+', status='+res.statusCode);
               callback(callFailure);
               return;
            }

            if (!body || !body.d || !body.d.results) {
               callback(noData);
               return;
            }

            for (var idx in body.d.results) {
               var result = body.d.results[idx];
               if (predicate(result)) {
                   callback(result.MediaUrl);
                   return;
               }
            }

            callback(noData);
            return;
        });
    }
};

module.exports = srslyGuys;