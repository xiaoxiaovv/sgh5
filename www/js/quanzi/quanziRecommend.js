/**
 * 推荐圈子页面
 * 业务逻辑
 * Created by shantao.wang on 2016/10/12.
 */
APP.controller('communityRecommendCtrl', ['$scope','$rootScope', '$timeout', '$state', 'PopupService', 'communityRecommendService',
    function ($scope,$rootScope, $timeout, $state, PopupService, communityRecommendService) {
        /**
         * 变量声明
         */
        $scope.idArray=[];//保存必选推荐圈子
        $scope.ids = [];//要加入或退出的圈子id数组
        $scope.topics = [];//所有的推荐圈子
        $scope.matrixes = [];//二维数组，每个元素是长度为12的数组
        /**
         * 页面初始化方法
         */
        $scope.init = function () {
            $scope.$broadcast('scroll.refreshComplete');
            //获取推荐圈子列表数据
            communityRecommendService.getCommunities()
                .success(function (data) {
                    if (data.success == true) {
                        $scope.topics = data.data.list;
                        //$scope.matrixes=new Array[Math.ceil($scope.topics.length/12)];//二维数组，每个元素又是一个包含12个元素的数组，最后一个元素可能不满12个
                        if ($scope.topics.length > 12) {
                            for (var j = 0; j < Math.ceil($scope.topics.length / 12); j++) {
                                $scope.matrixes[j] = $scope.topics.slice(12 * j, 12 * j + 12);
                            }
                        }
                        for (var i = 0; i < $scope.topics.length; i++) {
                            /* $scope.counts[i] = 0;*///拿到数据后将每个圈子的点击次数置0
                            if ($scope.topics[i].recommend == 1) {
                                $scope.ids.push($scope.topics[i].id);//如果该圈子是强力推荐（必选），将其id存入数组ids
                                $scope.idArray.push($scope.topics[i].id);
                            }
                        }
                        console.log('推荐圈子入参：空；出参：', $scope.topics);
                        console.log('必须加入的圈子：', $scope.ids);
                    }else if (data.errorCode == -2000) {
                        console.log('222')
                        PopupService.showToast(data.message);
                        $rootScope.loginIsAccord2 = true;
                      }
                })
                .error(function () {
                    PopupService.showToast("网络错误！");
                });
        };
        /**
         * 全部关注
         */
        $scope.selectAll = function (index) {
            console.log(index);
            if($scope.ids.length!=$scope.topics.length) {
                $scope.ids = [];
                for (var i = 0; i < $scope.topics.length; i++) {
                    if(!$scope.topics[i].isJoin) {
                        $scope.topics[i].isJoin = true;
                    }
                    $scope.ids.push($scope.topics[i].id);
                }
            } else{
                for (i = 0; i < $scope.topics.length; i++) {
                    if($scope.topics[i].isJoin) {
                        $scope.topics[i].isJoin = false;
                    }
                }
                $scope.ids=[];
                $scope.ids=$scope.ids.concat($scope.idArray);
            }
            console.log($scope.ids);
        };
        /**
         * 加入圈子方法
         */
        $scope.joinOrApply = function (item) {
           if (item.recommend == 0 || item.recommend == null) {
                item.isJoin = !item.isJoin;
                if (item.isJoin) {
                    $scope.ids.push(item.id);
                } else {
                    for (var i = 0; i < $scope.ids.length; i++) {
                        if ($scope.ids[i] == item.id) {
                            $scope.ids.splice(i, 1);
                        }
                    }
                }
            }
            console.log('要加入的圈子：', $scope.ids);
        };
        /**
         * 完成方法
         */
        $scope.done = function () {
            console.log('加入圈子入参：', $scope.ids);
            if (!$scope.ids.length) {
                $state.go('topic.qhot');
            } else {
                communityRecommendService.joinTopic($scope.ids).then(function (response) {
                    if (response.data.success == true) {
                        console.log($scope.ids + "操作成功！");
                        $scope.ids = [];
                        /*for (var i = 0; i < $scope.topics.length; i++) {
                         $scope.counts[i] = 0;
                         }*/
                        $state.go('topic.qhot');
                    } else {
                        PopupService.showToast(response.data.message);
                    }
                }, function () {
                    console.log('网络错误！');
                });
            }
        };
        /**
         * 加载该页面前调用页面初始化方法
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });
    }]);
/**
 * 推荐圈子页面服务

 */
APP.service('communityRecommendService', ['$http', 'UrlService', function ($http, UrlService) {
    //批量加入圈子接口
    this.joinTopic = function (ids) {
        var postData = {
            ids: ids.toString()
        };
        return $http({
            method: 'post',
            url: UrlService.getUrl('JOIN_TOPIC'),
            data: postData
        });
    };
    //推荐圈子接口
    this.getCommunities = function () {
        return $http({
            method: 'post',
            url: UrlService.getUrl('LAUNGCH_RECOMMEND_LIST')
        });
    }
}]);

