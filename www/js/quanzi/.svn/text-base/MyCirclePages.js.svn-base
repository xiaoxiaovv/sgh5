/**
 * Created by DHC on 2017/2/4.
 */
APP.controller('MyCirclePagesController', ['$scope', '$rootScope','$state','MyCirclePagesService',
    function ($scope,$rootScope,$state,MyCirclePagesService) {
        /**
         * 变量声明
         */
        $scope.myTopics = '';
        $scope.myCreatTopics = '';
        $scope.input={
            keywords:''
        };//大家都在搜
        $scope.iconShow = true;
        /** 方法 **/
        //是否显示搜索放大镜
        $scope.inputIconHide = function () {
            $scope.iconShow = false;
        };
        $scope.inputIconIfShow = function () {
            console.log('input内容'+$scope.input.keywords);
            if ($scope.input.isInput.length){
                $scope.iconShow = false;
            } else {
                $scope.iconShow = true;
            }
        };
        //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };
        $scope.init = function () {
            $scope.input={//搜索框内容初始化
                keywords:''
            };
            $scope.getMyCreatTopicInfo();
            $scope.getMyJoinedCircleInfo();
        };
        //搜索我的圈子
        $scope.search = function (param) {
            $scope.getMyCreatTopicInfo(param.target.value);
            $scope.getMyJoinedCircleInfo(param.target.value);
            if(window.cordova){
               cordova.plugins.Keyboard.close(); 
            }
            
        };
        //进入某个圈子
        $scope.viewTopic = function (id) {
            $state.go('circlePage', {circleId: id});
        };
        //进入编辑申请圈子页面
        $scope.reviewApplyCircle = function (id) {
            $rootScope.reviewCircleId = id;
            $state.go('applyCircle');
        };
        $scope.clickIn = function (id,auditStatus) {
            if(auditStatus == 0 ){
                $state.go('circlePage', {circleId: id});
            } else if (auditStatus == 2){
                $rootScope.showApplyTag = 1;
                $rootScope.reviewCircleId = id;
                $state.go('applyCircle');
            } else {
                $rootScope.reviewCircleId = id;
                $state.go('applyCircle');
            }
        };
        //获取我创建的圈子信息
        $scope.getMyCreatTopicInfo = function (param) {
            var params = {
                keywords:param
            };
            MyCirclePagesService.getMyCreatTopics(params)
                .then(function (res) {
                    $scope.myCreatTopics = res.data.data.list;
                }, function (error) {

                });
        };
        //获取我的加入圈子信息
        $scope.getMyJoinedCircleInfo = function (param) {
            var params = {
                keywords:param
            };
            MyCirclePagesService.getMyJoinedTopics(params)
                .then(function (res) {
                    $scope.myTopics = res.data.data.list;
                }, function (error) {

                });
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }
]);

APP.service('MyCirclePagesService', ['$http', 'UrlService', function ($http, UrlService) {
    //我创建的圈子接口
    this.getMyCreatTopics = function (params) {
        return $http({
            method: 'post',
            url: UrlService.getUrl('MYCREATE_TOPIC'),
            data: params
        });
    };
    //我加入的圈子接口
    this.getMyJoinedTopics = function (params) {
        return $http({
            method: 'post',
            url: UrlService.getUrl('MYJOINED_TOPIC'),
            data: params
        });
    };
}]);
