APP.controller('qzMessageCenterController', ['$scope', '$state','qzMessageCenterService',
    function ($scope,$state,qzMessageCenterService) {
        /** 变量声明 **/
        $scope.hasmore = false;
        $scope.selectedIndex = 0;
        $scope.id = '';

        $scope.platformData;
        $scope.smallClassData;
        $scope.otherData;
        $scope.param = { //拉取消息传参
            pageSize: 5,
            id: $scope.id,
            page: $scope.page,
            noLoading: true
        };

        /** 方法 **/
            //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };
        //跳消息详情
        $scope.goDetails = function () {
            $state.go('messageDetails');
        };
        //获取平台消息
        $scope.getPlatformData = function () {
            qzMessageCenterService.getPlatformMsg()
                .success(function (response) {
                    $scope.platformData = response.data;
                })
        };
        //获取微学堂消息
        $scope.getSmallClassData = function () {
            qzMessageCenterService.getSmallClassMsg()
                .success(function (response) {
                    $scope.smallClassData = response.data;
                })
        };
        //获取其他消息
        $scope.getOtherData = function () {
            qzMessageCenterService.getOtherMsg()
                .success(function (response) {
                    $scope.otherData = response.data;
                })
        };
        //消息上拉刷新
        $scope.page = 1;
        $scope.loadMore = function () {
            $scope.page += 1;
            $scope.loadMoreMsg($scope.param);
        };
        //加载商品列表
        $scope.loadMoreMsg = function (loadParam) {
            qzMessageCenterService.loadMoreProducts(loadParam)
                .success(function (response, status, headers, config) {
                    if (response.data.msgList != null && response.data.msgList != undefined && response.data.msgList.length != 0) {
                        $scope.msgList = $scope.msgList.concat(response.data.msgList);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        var len = $scope.msgList.length;
                        $scope.hasmore = !(len === response.data.storeItemsCounts);
                    } else {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.hasmore = false;
                        $scope.msgList = [];
                        //$scope.showPopup('没有更多消息了');
                    }
                })
        };

        $scope.init = function () {
            $scope.getPlatformData();
            $scope.getSmallClassData();
            $scope.getOtherData();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }
]);
/**
 * Created by Andy on 2016/10/11.
 */
APP.service('qzMessageCenterService', ['$http', 'UrlService', function ($http, UrlService) {
    // 获取平台消息
    this.getPlatformMsg = function () {
        return $http.get(UrlService.getUrl('PLATFORM_INFO'), params);
    };
    // 获取微学堂消息
    this.getSmallClassMsg = function () {
        return $http.get('data/smallClassMessage.json');
    };
    // 获取其它消息
    this.getOtherMsg = function () {
        return $http.get('data/otherMessage.json');
    };
    //加载更多消息
    this.loadMoreMessage = function (param) {
        params = {
            pageSize: param.pageSize,
            id: param.id,
            page: param.page,
            noLoading: param.noLoading

        };

        return $http.get(UrlService.getUrl(), params);
    };



}]);