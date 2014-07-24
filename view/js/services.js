/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'angularResource'], function (angular) {
    'use strict';

    return angular.module('iWomen.services', ['ngResource'])
        .factory('Account', function ($resource) {
            return $resource('api/users', {}, {
                getMyInfo: {
                    method: 'GET'
                }
            })
        })
        .factory('Look', function ($resource) {
            return $resource('api/looks/:lookId', {}, {
                gets: {
                    method: 'GET', url: 'api/looks/:type'
                }
            })
        })
        .factory('Tip', function ($resource) {
            return $resource('api/tips/:tipIds', {}, {
                getsByIds: {
                    method: 'GET', url: 'api/looks/:lookId/favorites/:aspect/tips/:tipIds'
                },
                comment: {
                    method: 'PUT', url: 'api/tips/comments'
                }
            });
        })
        .factory('AccountCache', function ($cacheFactory, Account) {
            return {
                getMyInfo: function (callback) {
                    var cache = $cacheFactory.get('users');
                    if (cache) {
                        return callback(cache.get('myInfo'));
                    }
                    cache = $cacheFactory('users');
                    Account.getMyInfo({}, function (res) {
                        if (res.code !== 0 || !res.data) {
                            return callback(null);
                        }
                        callback(res.data.user);
                        cache.put('myInfo', res.data.user);
                    });
                }
            };
        })
        .factory('LookCache', function ($cacheFactory, Look, Tip) {
            return {
                publish: function (lookId, image, description, aspect, tags, callback) {
                    Look.save({
                        lookId: lookId,
                        image: image,
                        description: description,
                        aspect: aspect,
                        tags: tags
                    }, function (res) {
                        if (res.code !== 0) {
                            return callback(null, null);
                        }
                        var cache = $cacheFactory.get('looks');
                        callback(cache.put(lookId, res.data.look));
                    });
                },
                gets: function (type, page, num, callabck) {
                    var cache = $cacheFactory.get('looks');
                    if (!cache) {
                        cache = $cacheFactory('looks');
                    }
                    Look.gets({type: type, page: page, num: num}, function (res) {
                        var looks = res.data.looks;
                        angular.forEach(looks, function(look, key) {
                            cache.put(look._id, look);
                        });
                        callabck(looks);
                    });
                },
                getById: function (lookId, callback) {
                    var cache = $cacheFactory.get('looks');
                    if (cache) {
                        var look = cache.get(lookId);
                        if (look && look.isPerfect) {
                            return callback(look);
                        }
                        for (var idx = 0; idx < look.favorites.length; idx++) {
                            var favorite = look.favorites[idx];
                            if (favorite.tips.length <= 0) {
                                continue;
                            }
                            var getTips = function (favorite) {
                                Tip.getsByIds({
                                    lookId: look._id,
                                    aspect: favorite.aspect,
                                    tipIds: favorite.tips.join(',')
                                }, function (res) {
                                    favorite.tips = res.data.tips;
                                });
                            };
                            getTips(favorite);
                        }
                        look.isPerfect = true;
                        cache.put(lookId, look);
                        return callback(look);
                    }
                    cache = $cacheFactory('looks');
                    Look.get({lookId: lookId}, function (res) {
                        var look = res.data.look;
                        cache.put(lookId, look);
                        callback(look);
                    });
                },
                favorites: function (callback) {
                    var cache = $cacheFactory.get('favorites');
                    if (cache) {
                        return callback(cache.get('all'));
                    }
                    cache = $cacheFactory('favorites');
                    Look.gets({type: 'favorites'}, function (res) {
                        var favorites = res.data.favorites;
                        cache.put('all', favorites);
                        callback(favorites);
                    });
                }
            };
        });
});