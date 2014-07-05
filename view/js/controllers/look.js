/**
 * Created by daisy on 14-7-5.
 */
define(['angular', 'ngTagsInput'], function (angular) {
    angular.module('iWomen.controllers.look', [
        'bootstrap-tagsinput'
    ])
    .controller('Where2GetCtrl', function ($scope, $http, Look) {
        $scope.image = {
            url: 'url(http://www.placehold.it/200x200/EFEFEF/AAAAAA&text=image)',
            width: '200px',
            height: '200px'
        };
        $scope.aspects = ['上衣','内裤','帽子'];
        $scope.tags = [];
        $scope.aspect = '...';

        $scope.selectedAspect = function (aspect) {
            $scope.tags.splice(0, 1, aspect);
            $scope.aspect = aspect;
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
            Look.save({
                hash: $scope.hash,
                image: $scope.img,
                description: $scope.description,
                aspect: $scope.aspect,
                tags: $scope.tags
            }, function (res) {
                if (res.code === 0) {

                }
            });
        };

        var lastScrollY = 0;
        $scope.showFooter = true;
        $scope.scroll = function () {
            $scope.showFooter = lastScrollY > window.pageYOffset;
            lastScrollY = window.pageYOffset;
            $scope.$apply();
        };
        window.onscroll = $scope.scroll;
        $scope.looks = [];
        Look.get({type: 'trend', page: 0, num: 10}, function (res) {
            $scope.looks = res.data.looks;
        });
    });
});