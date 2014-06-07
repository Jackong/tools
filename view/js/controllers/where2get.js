/**
 * Created by daisy on 14-6-7.
 */
require(['app'], function (app) {
    return app.controller('Where2GetCtrl', function ($scope) {
        $scope.looks = [
            {
                _id: '1',
                publisher: {
                    _id: '123',
                    nick: 'Daisy',
                    avatar: 'http://placehold.it/50x50',
                    action: '想要这件上衣',
                    time: '刚刚'
                },
                image: 'http://placehold.it/220x160',
                description: '非常漂亮的衣服',
                likes: 22,
                favorites: [
                    {
                        aspect: '上衣',
                        wants: 11,
                        tips: 1
                    },
                    {
                        aspect: '内裤',
                        wants: 11,
                        tips: 1
                    }
                ]
            },
            {
                _id: '2',
                publisher: {
                    _id: '123',
                    nick: 'Daisy',
                    avatar: 'http://placehold.it/50x50',
                    action: '想要这件上衣',
                    time: '刚刚'
                },
                image: 'http://placehold.it/220x160',
                description: null,
                likes: 22,
                favorites: [
                    {
                        aspect: '内衣',
                        wants: 11,
                        tips: 0
                    }
                ]
            },
            {
                _id: '3',
                publisher: {
                    _id: '123',
                    nick: 'Daisy',
                    avatar: 'http://placehold.it/50x50',
                    action: '想要这件上衣',
                    time: '刚刚'
                },
                image: 'http://placehold.it/220x160',
                description: null,
                likes: 22,
                favorites: [
                    {
                        aspect: '项链',
                        wants: 12,
                        tips: 0
                    }
                ]
            }
        ];
    });
});