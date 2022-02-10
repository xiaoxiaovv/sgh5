/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('ShareListPageController', ['$scope', '$rootScope', '$ionicHistory', '$stateParams', '$state', '$timeout', '$interval', 'GroupSettingService','UserService','PopupService', '$ionicActionSheet','MediaService',
    function ($scope, $rootScope, $ionicHistory, $stateParams, $state, $timeout, $interval, GroupSettingService,UserService,PopupService,$ionicActionSheet,MediaService) {
        //    初始化参数

        $scope.input={
            keywords:''
        };//大家都在搜
        //是否显示搜索放大镜
        $scope.iconShow = true;

        $scope.members =[

        ];

        $scope.originData =undefined;

        $scope.$on('$ionicView.beforeEnter', function (e,v) {
            // $scope.init(); //测试本地数据 不需发请求

            $rootScope.chatScope = e;

             $scope.originData = $stateParams.sl;
            $scope.members = $scope.originData.shareMsgsList;
        });

        $scope.$on('$ionicView.afterEnter', function (e,v) {//配合 play-sound指令进行

            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast
        });

        $scope.$on('$ionicView.beforeLeave', function (e,v) {

        });

        $scope.goBack = function () {
            $scope.$ionicGoBack();

        };


    }]);