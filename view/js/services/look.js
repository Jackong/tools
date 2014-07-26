/**
 * Created by daisy on 14-7-26.
 */
define(['angular', 'angularResource'], function (angular) {
    'use strict';
    return angular.module('iWomen.services.look',['ngResource'])
        .factory('LookResource', function ($resource) {
            return $resource('api/looks/:lookId', {}, {
                gets: {
                    method: 'GET', url: 'api/looks/:type'
                }
            })
        })
        .factory('LookService', function ($http) {
            return {
                getImage: function (elem, callback) {
                    var fd = new FormData();
                    angular.forEach(elem.files, function (file) {
                        fd.append('file', file);
                    });

                    $http.post('/api/looks/image', fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function (res) {
                        if (res.code != 0) {
                            callback(null);
                            return;
                        }
                        callback(res.data);
                        $('#publishModal').modal('show');
                        $('.bootstrap-tagsinput input')[0].removeAttribute('size');
                    })
                    .error(function (res) {
                        alert('上传失败！（如果你是使用的是Chrome，请关闭 设置=>宽带管理=>减少流量消耗）');
                    });
                }
            }
        })
        .factory('LookCache', function ($cacheFactory, LookResource, Tip) {
            return {
                publish: function (lookId, image, description, aspect, tags, callback) {
                    LookResource.save({
                        lookId: lookId,
                        image: image,
                        description: description,
                        aspect: aspect,
                        tags: tags
                    }, function (res) {
                        if (res.code !== 0) {
                            return callback(null);
                        }
                        $('#publishModal').modal('hide');
                        var cache = $cacheFactory.get('looks');
                        callback(cache.put(lookId, res.data.look));
                    });
                },
                gets: function (type, page, num, callabck) {
                    var cache = $cacheFactory.get('looks');
                    if (!cache) {
                        cache = $cacheFactory('looks');
                    }
                    LookResource.gets({type: type, page: page, num: num}, function (res) {
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
                    LookResource.get({lookId: lookId}, function (res) {
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
                    LookResource.gets({type: 'favorites'}, function (res) {
                        var favorites = res.data.favorites;
                        cache.put('all', favorites);
                        callback(favorites);
                    });
                }
            };
        });
});