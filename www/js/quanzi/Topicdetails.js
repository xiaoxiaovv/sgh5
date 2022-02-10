/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('TopicdetailsController', ['$scope', '$rootScope', '$ionicHistory', 'TopicdetailsService', '$http', '$ionicSlideBoxDelegate',
    '$stateParams', '$sce', '$ionicScrollDelegate', '$timeout',
    function ($scope, $rootScope, $ionicHistory, TopicdetailsService, $http, $ionicSlideBoxDelegate, $stateParams, $sce, $ionicScrollDelegate,
              $timeout) {
        //    初始化参数
        $scope.tielist = '';//帖子数据
        $scope.pinglunlist = '';//评论数据
        $scope.isshow = false;//消息显示
        $scope.xxshow = false;//小红点显示
        $scope.huatiid = '';//话题的id
        $scope.xiaoxis = false;//消息显示
        $scope.userlist = '';//用户信息
        $scope.topicheight = 0;//帖子高度
        $scope.pinglunis = false;//评论显示
        $scope.count = '';//消息数据
        $scope.dianzans='';//点赞返回参数

        $rootScope.showRightTop = false;//是否显示右上角 菜单
        //$rootScope.msgCount = '' ;//未读消息数

        //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };
        //评论的显示隐藏
        $scope.pinglunshow = function () {
            var scroll = $ionicScrollDelegate.$getByHandle('pinglun');
            var height = scroll.getScrollPosition();
            var top = height.top;
            console.log(top);
            var totop = window.innerHeight - 118;
            //获取高度值
            $scope.topicheight = document.getElementById('topicxiang').clientHeight - totop;
            console.log($scope.topicheight);
            $timeout(function () {
                $scope.pinglunis = top > $scope.topicheight ? true : false;
                console.log($scope.pinglunis);
            }, 200);

        };

        //消息显示隐藏
        $scope.xiaoxishow = function () {
            $scope.xxshow = ($scope.count.count != 0);
            $scope.isshow = !$scope.isshow;
            $scope.xiaoxis = !$scope.xiaoxis;
        };
        /*评论添加图片*/
        $scope.addImage = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '<b>拍照</b>'},
                    {text: '<b>从相册选取</b>'}
                ],
                // destructiveText: 'Delete',
                titleText: '照片选取方式',
                cancelText: '取消',
                buttonClicked: function (index) {
                    if (index == 0) {
                        navigator.camera.getPicture(getSuccess, getFail, {
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            saveToPhotoAlbum: false,
                            allowEdit: true
                        });
                        function getSuccess(imageData) {
                            console.log('success');
                        }

                        function getFail() {
                            console.log('failure');
                        }

                        return true;
                    } else if (index == 1) {
                        navigator.camera.getPicture(getSuccessTwo, getFail, {
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                            allowEdit: true
                            //targetWidth: 720,
                            //targetHeight: 720
                        });
                        function getSuccessTwo(imageData) {
                            console.log('successTwo');
                        }

                        return true;
                    }
                }
            })
        };
        //跳转消息
        $scope.gotoxiaoxi = function () {
            $state.go('qzMessageCenter');
            $scope.isshow = false;
            $scope.xxshow = false;
        };
        //跳转消息
        $scope.dianzan = function () {
            var config={
                'id':$scope.huatiid
            };
            TopicdetailsService.dianzan(config).success(function (response, status, headers, config) {
                $scope.dianzans = response.success;
                console.log($scope.exit);
            });
        };

        $scope.init = function () {
            $scope.huatiid = $stateParams.huatiid;
            //获取评论
            var ping={
                pageIndex:1,
                pageSize:5,
                id:0
            };
            TopicdetailsService.getpinglun(ping)
                .success(function (response, status, headers, config) {
                    $scope.pinglunlist = response.data.list;
                    console.log($scope.pinglunlist);
                    return response;
                });

            //获取帖子数据
            console.log($scope.huatiid);
            var config={
                'id':$scope.huatiid
            };
            TopicdetailsService.gettieData(config)
                .success(function (response, status, headers, config) {
                    $scope.tielist = response.data;
                    console.log($scope.tielist);
                    return response;
                }).error(function () {
                    console.log('获取数据失败');
                });
            //获取点赞
            TopicdetailsService.getdianzan(config).success(function (response, status, headers, config) {
                $scope.count = response.data;
                console.log($scope.count);
            }).error(function () {
                console.log('获取数据失败');
            });
            //    获取消息

            TopicdetailsService.getxiaoxi(config).success(function (response, status, headers, config) {
                $rootScope.msgCount = response.data;
                $scope.topshow = ($rootScope.msgCount != 0);
                console.log('消息' + $rootScope.msgCount);
            }).error(function () {
                console.log('获取数据失败');
            });

        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
            //获取话题id
            $scope.huatiid = $stateParams.huatiid;
            console.log($scope.huatiid);
        })
    }]);


APP.service('TopicdetailsService', ['$http', 'UrlService', function ($http, UrlService) {

    this.gettieData = function (config) {
              return $http.post(UrlService.getUrl('GETSTORYINFO'), config);
    };
    ////获取热门帖子信息 GETSTORYINFO
    //this.gettieData = function (id) {
    //    config={
    //        id:id
    //    };
    //    return $http.post(UrlService.getUrl('GETSTORYINFO'), config);
    //};
    //获取消息
    this.getxiaoxi = function () {
        return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
    };
    //获取点赞
    this.getdianzan = function (config) {
        return $http.post(UrlService.getUrl('GETSTORYPRAISEANDUNREAD'),config);
    };
    //点赞
    this.dianzan = function (config) {
        return $http.post(UrlService.getUrl('SCHOOLPRAISESTORY'),config);
    };


    //获取评论
    this.getpinglun = function (config) {
        return $http.post(UrlService.getUrl('GETSTORYCOMMENT'), config);
    }


}])
