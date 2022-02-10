/**
 * 我的粉丝页面
 * Created by shantao.wang on 2016/10/12.
 */
APP.controller('myFansCtrl', ['$scope', '$timeout', '$state', 'PopupService', 'myFansService',
    function ($scope, $timeout, $state, PopupService, myFansService) {
        /**
         * 变量声明
         */
        //$scope.messageNum = undefined;
        //$scope.ifRed = undefined;
        $scope.isDisplay = false;
        $scope.nothing = false;//空页面
        $scope.interested = [];
        $scope.myFansData = {
            pageIndex: 0,
            pageSize: 6,
            myFans: [],
            hasMore: true,
            api: function (pageIndex, pageSize) {
                return myFansService.getMyFans(pageIndex, pageSize);
            }
        };
        /**
         * 页面初始化方法
         */
        $scope.init = function () {
            $scope.nothing = false;
            $scope.isDisplay = false;
            $scope.myFansData.pageIndex = 0;
            $scope.myFansData.myFans = [];
            $scope.myFansData.hasMore = true;
            //获取感兴趣的人
            myFansService.getMyInterested(1, 3).then(function (res) {
                $scope.interested = res.data.data.list;
            }, function () {
                PopupService.showToast("网络错误！");
            });
            $scope.loadData($scope.myFansData, 0);
        };
        /**
         * 视图事件
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });
        /**
         * 上拉刷新加载更多我的粉丝方法
         */
        $scope.loadData = function (array, time) {
            if (time == undefined) time = 1000;
            array.pageIndex = array.pageIndex + 1;
            console.log('粉丝入参：', array.pageIndex, array.pageSize);
            array.api(array.pageIndex, array.pageSize)
                .success(function (data) {
                    $timeout(function () {
                        if (data.success == true) {
                            console.log('粉丝出参：', data);
                            array.hasMore = array.pageIndex * array.pageSize < data.totalCount;
                            array.myFans = array.myFans.concat(data.data.list);//核心语句：实现要遍历的数组的加长，即实现了加载更多
                            $scope.nothing = !array.myFans.length;//控制空页面的展示
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.$broadcast('scroll.refreshComplete');
                        } else {
                            console.log(data.message);
                        }
                    }, time);
                })
                .error(function () {
                    PopupService.showToast("网络错误！");
                });
        };
        /**
         * 关注感兴趣的人方法
         */
        $scope.followI = function (person, isFollow) {
            var bin = isFollow ? 1 : 0;
            console.log('关注入参' + person.memberId + 1);
            myFansService.follow(person.memberId, bin)
                .success(function (data) {
                    if (data.success == true) {
                        //PopupService.showToast(isFollow ? "已关注！" : "已取消关注");
                        console.log('出参' + data.data);
                        console.log(person.memberId + "操作成功！");
                        for (var i = 0; i < $scope.interested.length; i++) {
                            if (person.memberId == $scope.interested[i].memberId) {
                                $scope.interested.splice(i, 1);//关注完成删除该元素
                            }
                        }
                        if (isFollow) {
                            $scope.alreadyFollow = true;
                            $timeout(function () {
                                $scope.alreadyFollow = false;
                            }, 1000);
                        }

                    } else {
                        console.log(data.message);
                    }
                })
                .error(function () {
                    PopupService.showToast("网络错误！");
                });
        };
        /**
         * 关注我的粉丝方法
         */
        $scope.followF = function (person, isFollow) {
            var bin = isFollow ? 1 : 0;
            //console.log('关注入参'+id+1);
            var id = person.followId ? person.followId : person.memberId;
            myFansService.follow(id, bin)
                .success(function (data) {
                    if (data.success == true) {
                        //PopupService.showToast(isFollow ? "已关注！" : "已取消关注");
                        console.log('出参' + data.data);
                        console.log(id + "操作成功！");
                    } else {
                        console.log(data.message);
                    }

                    if (isFollow) {
                        $scope.alreadyFollow = true;
                        $timeout(function () {
                            $scope.alreadyFollow = false;
                        }, 1000);
                    }
                })
                .error(function () {
                    PopupService.showToast("网络失败！");
                });
        };
        /**
         * 更多菜单弹窗
         */
        //打开
        $scope.show = function () {
            $scope.isDisplay = !$scope.isDisplay;
        };
        //关闭
        $scope.disappear = function () {
            $scope.isDisplay = false;
        };
        /**
         * 页面跳转方法
         */
        //更多感兴趣的人
        $scope.more = function () {
            $state.go('moreInteresting');
        };
        //消息中心
        $scope.jumpMsg = function () {
            $state.go('messageCenter');
        };
        //他的主页
        $scope.viewHim = function (person) {
            if (person.followId) {
                $state.go('personalHomepageHe', {othersId: person.followId});
            } else {
                $state.go('personalHomepageHe', {othersId: person.memberId});
            }
        };
    }]);
/**
 * 我的粉丝页面服务
 */
APP.service('myFansService', ['$http', 'UrlService', function ($http, UrlService) {
    //我的粉丝接口
    this.getMyFans = function (pageIndex, pageSize) {
        var postData = {
            pageIndex: pageIndex,
            pageSize: pageSize
        };
        return $http({
            method: 'post',
            url: UrlService.getUrl('MY_FANS'),
            data: postData
        });
        //return $http.get("data/myFans.json", {});//我的粉丝假数据
    };
    //感兴趣的人接口
    this.getMyInterested = function (pageIndex, pageSize) {
        var postData = {
            pageIndex: pageIndex,
            pageSize: pageSize
        };
        return $http({
            method: 'post',
            url: UrlService.getUrl('INTERESTED'),
            data: postData
        });
    };
    //关注接口
    this.follow = function (id, isFollow) {
        var postData = {
            id: id,
            isFollow: isFollow
        };
        return $http({
            method: 'post',
            url: UrlService.getUrl('FOLLOW'),
            data: postData
        });
        //return $http.get("data/follow.json", config);//假数据
    }

}]);

