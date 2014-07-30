/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'ngTagsInput'], function (angular) {
    angular.module('iWomen.controllers.look', [
        'bootstrap-tagsinput'
    ])
    .controller('PublishCtrl', function ($scope, LookService) {
            LookService.getImage(function (image) {
                if (image === null) {
                    return $scope.warning = '图片上传失败，请使用格式及大小正确的图片重试';
                }
                $scope.img = image.image;
                $scope.hash = image.hash;
            });

            $scope.tags = [];

            LookService.favorites(function (favorites) {
                $scope.favorites = favorites;
            });

            $scope.changedFavorite = function () {
                $scope.tags.splice(0, 1, $scope.favorites[$scope.favorite]);
            };

            $scope.publish = function () {
                LookService.publish($scope, $scope.hash, $scope.img, $scope.description,
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
    })
    .controller('FashionCtrl', function ($scope, LookService) {
        $scope.view = 'partials/look/list.html';

        LookService.favorites(function (favorites) {
            $scope.favorites = favorites;
        });

        LookService.gets('fashion', 0, 5, function (looks) {
            $scope.looks = looks;
        });

        $scope.like = function (lookId) {
            //todo
        };
        $scope.want = function (lookId, aspect) {
            //todo
        };
    })
    .controller('LookDetailCtrl', function ($scope, $routeParams, LookService) {
            $scope.view = 'partials/look/detail.html?v=3';

            var lookId = $routeParams.lookId;

            LookService.favorites(function (favorites) {
                $scope.favorites = favorites;
            });

            LookService.getById(lookId, function (look) {
                $scope.look = look;

                window._bd_share_config = {
                    "common":{
                        "bdSnsKey":{},
                        "bdText":"我在《众里寻她》上看到这款，非常的喜欢～",
                        "bdMini":"2",
                        "bdMiniList":["weixin","douban","sqq","tsina","tqq","tieba","meilishuo","mogujie","huaban","qzone","bdysc","youdao","twi","fbook","mail","taobao","copy","print"],
                        "bdPic": location.host + $scope.look.image,
                        "bdStyle":"0",
                        "bdSize":"32"
                    },
                    "slide":{
                        "type":"slide",
                        "bdImg":"4",
                        "bdPos":"right",
                        "bdTop":"100"
                    }
                };
                require(['http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)], function () {
                    $('.bdshare-slide-button-box').show();
                });
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
                LookService.addTip($scope, {
                    lookId: $scope.look._id,
                    aspect: $scope.aspect,
                    content: content
                }, function (ok, data) {
                    if (!ok) {
                        return;
                    }
                    $('#tipModal').modal('hide');
                    for(var idx = 0; idx < $scope.look.favorites.length; idx++) {
                        var favorite = $scope.look.favorites[idx];
                        if (favorite.aspect === $scope.aspect) {
                            favorite.tips.push(data.tip);
                            break;
                        }
                    }
                })
            };
            $scope.share = function () {
                //todo
            };
            $scope.addComment = function (aspect, tip, content) {
                LookService.comment($scope, {lookId: $scope.look._id, aspect: aspect, tipId: tip._id, content: content},
                    function (ok, data) {
                        if (!ok) {
                            return;
                        }
                        tip.comments.push(data.comment);
                    }
                );
                return '';
            };
    });
});
