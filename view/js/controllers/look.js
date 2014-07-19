/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'ngTagsInput'], function (angular) {
    angular.module('iWomen.controllers.look', [
        'bootstrap-tagsinput'
    ])
    .controller('TrendCtrl', function ($scope, $http, LookCache) {
        $scope.view = 'partials/look/list.html';
        $scope.tags = [];

        LookCache.favorites(function (favorites) {
            $scope.favorites = favorites;
        });

        $scope.selectedFavorite = function (favorite) {
            $scope.tags.splice(0, 1, $scope.favorites[favorite]);
            $scope.favorite = favorite;
        };

        $scope.changeImage = function (elem) {

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
                    $scope.warning = '图片上传失败，请使用格式及大小正确的图片重试';
                    return;
                }
                $scope.img = res.data.image;
                $scope.hash = res.data.hash;
                $('#publishModal').modal('show');
            })
            .error(function (res) {
                alert('上传失败！（如果你是使用的是Chrome，请关闭 设置=>宽带管理=>减少流量消耗）');
            });
        };

        $scope.uploadSuccess = function (res) {
            res = JSON.parse(res);
            if (res.code != 0) {
                $scope.warning = '图片上传失败，请使用格式及大小正确的图片重试';
                return;
            }
            $scope.image = res.data.image;
            $scope.hash = res.data.hash;
        };

        $scope.publish = function () {
            LookCache.publish($scope.hash, $scope.img, $scope.description,
                $scope.favorite, $scope.tags,
                function (newLook) {
                    if (!newLook) {
                        return;
                    }
                    var replace = false;
                    for(var idx = 0; idx < $scope.looks.length; idx++) {
                        if ($scope.looks[idx]._id === newLook._id) {
                            $scope.looks[idx] = newLook;
                            replace = true;
                            break;
                        }
                    }
                    if (!replace) {
                        $scope.looks.push(newLook);
                    }
                }
            );
        };

        LookCache.gets('trend', 0, 5, function (looks) {
            $scope.looks = looks;
        });

        $scope.like = function (lookId) {
            //todo
        };
        $scope.want = function (lookId, aspect) {
            //todo
        };
    })
    .controller('LookDetailCtrl', function ($scope, $routeParams, LookCache, Tip) {
            $scope.view = 'partials/look/detail.html?v=3';
            var lookId = $routeParams.lookId;

            LookCache.favorites(function (favorites) {
                $scope.favorites = favorites;
            });

            LookCache.getById(lookId, function (look) {
                $scope.look = look;
            });

            $scope.like = function () {
                //todo
            };

            $scope.want = function (aspect) {
                //todo
            };

            $scope.buy = function (aspect) {
                //todo
            };

            $scope.likeTip = function (tipId) {

            };

            $scope.addFavorite = function () {

            };

            $scope.onAddTip = function (aspect) {
                $scope.aspect = aspect;
            };
            $scope.addTip = function (content) {
                Tip.save({
                    lookId: $scope.look._id,
                    aspect: $scope.aspect,
                    content: content
                }, function (res) {
                    if (res.code !== 0) {
                        return;
                    }
                    for(var idx = 0; idx < $scope.look.favorites.length; idx++) {
                        var favorite = $scope.look.favorites[idx];
                        if (favorite.aspect === $scope.aspect) {
                            favorite.tips.push(res.data.tip);
                            break;
                        }
                    }
                })
            };
            $scope.share = function () {
                //todo
            };
            $scope.addComment = function (tip, content) {
                Tip.comment({tipId: tip._id, content: content},
                    function (res) {
                        if (data.code !== 0) {
                            return;
                        }
                        tip.comments.push(res.comment);
                    }
                );
                return '';
            };
    });
});