/**
 * Created by Andy on 2016/12/8.
 */
APP.controller('SelectTagsController', ['$scope', '$rootScope', '$state', '$stateParams', 'SelectTagsService', 'PopupService', '$timeout', '$ionicScrollDelegate',
    '$interval',
    function ($scope, $rootScope, $state, $stateParams, SelectTagsService, PopupService, $timeout, $ionicScrollDelegate,$interval) {

        /** 变量定义 **/
        $rootScope.frequentTags = '';
        $rootScope.storeId = [];//存放标签id
        $rootScope.storeNames = [];//存放所选的标签name
        $rootScope.nameStringToObj = [];//将所选标签数组转对象
        $rootScope.addedTags = $rootScope.addedTags;//存放自定义的标签组name
        $scope.namedTags = '';//自定义的标签名
        $scope.isShow = false;//是否显示底部input

        /** 方法定义 **/
        $scope.init = function () {
            $scope.phoneHeight = document.documentElement.clientHeight/2;//获取手机屏幕高度
            $scope.getScrollHeight = function () {
                $scope.scrollHeight = document.getElementById("aaa").scrollTop;//获取滚动高度
                console.log('$scope.scrollHeight',$scope.scrollHeight);
            };
            $scope.timer = $interval(function () {//定时任务
            $scope.scrollHeight = document.getElementById("aaa").scrollTop;//获取滚动高度
                if ($scope.scrollHeight>$scope.phoneHeight) {
                    $scope.showTopBtn = true;
                } else {
                    $scope.showTopBtn = false;
                }
            console.log('$scope.scrollHeight',$scope.scrollHeight);
            console.log('$scope.phoneHeight',$scope.phoneHeight);
            console.log('$scope.showTopBtn',$scope.showTopBtn);
        },100);
            $scope.isShow = false;
            $rootScope.nameStringToObj = [];
            if (!$rootScope.frequentTags.length) {//如果有数据就不刷新
                $scope.getFrequentlyTags();
                $rootScope.storeId = [];
                $rootScope.storeNames = [];
                $rootScope.nameStringToObj = [];
            }
            console.log($rootScope.nameStringToObj);
        };
        //返回
        $scope.goBack = function () {
            /*$interval.cancel($scope.timer);
            if ($rootScope.nameStringToObj.length || $rootScope.addedTags.length) {
                $rootScope.ifInit = 1;
            }
            console.log($rootScope.nameStringToObj);
            $scope.$ionicGoBack();*/
            $interval.cancel($scope.timer);
            for (var i = 0; i < $rootScope.storeNames.length; i++) {
                var nameMedia = {
                    name: $rootScope.storeNames[i]
                };
                $rootScope.nameStringToObj.push(nameMedia);
            }
            $scope.namedTags = '';
            $state.go('applyCircle');
            $rootScope.ifInit = 1;
        };
        //获取常用标签
        $scope.getFrequentlyTags = function () {
            var param = {
                id: $rootScope.reviewCircleId ? $rootScope.reviewCircleId : ''
                // id: 8
            };
            SelectTagsService.getTags(param)
                .success(function (response) {
                    $rootScope.frequentTags = response.data.list;
                    if (response.data.list1){
                        for (var a = 0; a < response.data.list1.length; a++) {
                            $rootScope.storeId.push(response.data.list1[a].id);
                        }
                        for (var b = 0; b < response.data.list2.length; b++) {
                            $rootScope.storeNames.push(response.data.list2[b].name);
                            console.log($rootScope.storeNames);
                        }
                    }
                })
        };
        //返回申请圈子页
        $scope.backApply = function () {
            $interval.cancel($scope.timer);
            for (var i = 0; i < $rootScope.storeNames.length; i++) {
                var nameMedia = {
                    name: $rootScope.storeNames[i]
                };
                $rootScope.nameStringToObj.push(nameMedia);
            }
            $scope.namedTags = '';
            $state.go('applyCircle');
            $rootScope.ifInit = 1;
        };
        //显示底部input
        $scope.showInput = function () {
            $scope.isShow = true;
            setTimeout(function () {
                document.getElementById('inputId').focus();
            }, 200);
        };
        //回到顶部
        $scope.scrollToTop = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
            $scope.showTopBtn = false;
            // console.log('$scope.phoneHeight',$scope.phoneHeight);
            // console.log('document',document.getElementById("aaa"));
        };
        //提交自定义标签
        $scope.submitNamedTags = function () {
            var tagName = {
                tagName: $scope.namedTags
            };
            if (!tagName.tagName) {
                PopupService.showToast('标签名不能为空');
            } else {
                var aaa = 1;
                for (var i = 0; i < $rootScope.addedTags.length; i++) {
                    if ($rootScope.addedTags[i].name == tagName.tagName) {
                        PopupService.showToast(response.message);
                        aaa = 0;
                        break;
                    } else {
                        aaa = 1;
                    }
                }
                if (aaa == 1) {
                    SelectTagsService.confirmTag(tagName)
                        .success(function (response) {
                            if (response.data == true) {
                                if ($rootScope.addedTags.length < 5) {
                                    var name = {
                                        name: $scope.namedTags
                                    };
                                    $rootScope.addedTags.push(name);
                                    console.log('addedTags', $rootScope.addedTags);
                                    $scope.namedTags = '';
                                    $timeout(function () {
                                        $scope.isShow = false;
                                    }, 200);
                                } else {
                                    PopupService.showToast('最多添加5个自定义标签');
                                }
                            } else {
                                PopupService.showToast(response.message);
                            }
                        });
                }
            }
            //删除自定义标签
            $scope.deleteTags = function (index) {
                $rootScope.addedTags.splice(index, 1);
            };
        };
        //是否选中
        $scope.ifClicked = function (index, id, clicked, name) {
            if (clicked == true) {//判读是否已被选中，选中的话再次点击从数组里删除
                for (var i = 0; i <= $rootScope.storeId.length; i++) {
                    if ($rootScope.storeId[i] == id) {
                        $rootScope.storeId.splice(i, 1);
                        $rootScope.storeNames.splice(i, 1);
                        $rootScope.frequentTags[index].isChecked = !$rootScope.frequentTags[index].isChecked;
                        console.log('删除后', $rootScope.storeId);
                        console.log('删除后', $rootScope.storeNames);
                    }
                }
            } else if ($rootScope.storeId.length < 10) {
                $rootScope.frequentTags[index].isChecked = !$rootScope.frequentTags[index].isChecked;
                $rootScope.storeId.push(id);
                $rootScope.storeNames.push(name);
                console.log('所有的id', $rootScope.storeId);
                console.log('addedTags', $rootScope.storeNames);
            } else {
                PopupService.showToast('最多选择10个');
            }

        };


        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }]);

APP.service('SelectTagsService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取常用标签
    this.getFrequentTags = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('TOPIC_TAGS'),
            data: param
        });
    };
    //查询自定义标签名是否存在
    this.confirmTag = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('SELECT_TAGNAME'),
            data: param
        });
    };
    //圈子所有标签
    this.getTags = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('TOPIC_TAGS'),
            data: param
        });
    };
}]);
