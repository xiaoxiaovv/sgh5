/**
 * 更多感兴趣的人页面
 * Created by shantao.wang on 2016/12/11 0011.
 */
APP.controller('moreInterestingCtrl', ['$scope', '$state', '$timeout', 'PopupService', 'myFansService',
    function ($scope, $state, $timeout, PopupService, myFansService) {
        /**
         * 变量声明
         */
        $scope.myInterested = {
            pageIndex: 0,
            pageSize: 8,
            interestedList: [],
            hasMore: true,
            api: function (pageIndex, pageSize) {
                return myFansService.getMyInterested(pageIndex, pageSize);
            }
        };
        /**
         * 初始化方法
         */
        $scope.init = function () {
            $scope.myInterested.hasMore = true;
            $scope.myInterested.pageIndex = 0;
            $scope.myInterested.interestedList = [];
            $scope.loadData($scope.myInterested, 0);
        };
        /**
         * 加载该页面前调用页面初始化方法
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });
        /**
         * 上拉刷新加载更多数据方法
         */
        $scope.loadData = function (story, time) {
            if (time == undefined) time = 1000;
            story.pageIndex = story.pageIndex + 1;
            console.log('更多入参：', story.pageIndex, story.pageSize);//入参
            story.api(story.pageIndex, story.pageSize)
                .success(function (data) {
                    $timeout(function () {
                        if (data.success == true) {
                            console.log('更多出参：', data.data.list);
                            story.hasMore = story.pageIndex * story.pageSize < data.totalCount;//还有没有数据
                            story.interestedList = story.interestedList.concat(data.data.list);//核心语句：实现要遍历的数组的加长，即实现了加载更多
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
                        for (var i = 0; i < $scope.myInterested.interestedList.length; i++) {
                            if (person.memberId == $scope.myInterested.interestedList[i].memberId) {
                                $scope.myInterested.interestedList.splice(i, 1);//关注完成删除该元素
                                console.log('感兴趣：', $scope.myInterested.interestedList);
                                $scope.alreadyFollow = true;
                                $timeout(function () {
                                    $scope.alreadyFollow = false;
                                }, 1000);
                            }
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
         * 跳向他的主页
         */
        $scope.viewHim = function (id) {
            $state.go('personalHomepageHe', {othersId: id});
        };
    }]);