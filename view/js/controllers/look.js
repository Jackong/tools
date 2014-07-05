/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'ngTagsInput'], function (angular) {
    angular.module('iWomen.controllers.look', [
        'bootstrap-tagsinput'
    ])
    .controller('TrendCtrl', function ($scope, $http, LookCache) {
        $scope.view = 'partials/look/list.html';
        $scope.image = {
            url: 'url(http://www.placehold.it/200x200/EFEFEF/AAAAAA&text=image)',
            width: '200px',
            height: '200px'
        };
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
                $scope.image.url = 'url(' + $scope.img + ')';
                var img = new Image();
                img.onload = function () {
                    $scope.image.width = this.width + 'px';
                    $scope.image.height = this.height + 'px';
                    $scope.$apply();
                };
                img.src = $scope.img;
            })
            .error(function (res) {
                alert('上传失败！（如果你是使用的是Chrome，请关闭 设置=>宽带管理=>减少流量消耗）');
            });
        };

        $scope.uploadSuccess = function (res) {
            console.log(res);
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
        $scope.want = function (lookId, favoriteId) {
            //todo
        };
    })
    .controller('LookDetailCtrl', function ($scope, $routeParams, LookCache) {

            $scope.view = 'partials/look/detail.html';
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

            $scope.want = function (favoriteId) {
                //todo
            };
            $scope.onAddTip = function (favoriteId) {
                $scope.favoriteId = favoriteId;
            };
            $scope.addTip = function () {
                //todo
            };
            $scope.share = function () {
                //todo
            };
    });
});
