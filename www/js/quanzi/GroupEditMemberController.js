/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('GroupEditMemberController', ['$scope', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval', 'GroupSettingService','UserService','PopupService',
    '$ionicActionSheet','MediaService','FileUploadService','$stateParams',
    function ($scope, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval, GroupSettingService,UserService,PopupService,$ionicActionSheet,MediaService,FileUploadService,$stateParams) {
        //    初始化参数

        $scope.input={
            keywords:''
        };//大家都在搜
        //是否显示搜索放大镜
        $scope.iconShow = true;

        var user = UserService.getUser();
        $scope.token = user.sessionValue;
        $scope.groupId = $stateParams.groupId;//讨论组id



        $scope.query = function() {
            var params = {
                groupId: $scope.groupId,
                token:$scope.token
            };

            $scope.members=[];
            GroupSettingService.query(params).success(function (r1) {

                if (r1 && r1.userInfo) {

                    $scope.members = r1.userInfo;
                } else {
                    console.log('查询群组成员失败')
                }

            }, function (error) {
                alert("查询群组成员失败");
            });

        };
        $scope.members =[


        ];



        $scope.init = function(){
            var user = UserService.getUser();
            $scope.token = user.sessionValue;
            $scope.query();
        };


        $scope.checkMembers = function(){
            var flag = true;
            for(var i=0;i<$scope.members.length;i++){
                if(!$scope.members[i].isSelected){
                    flag=false;
                    break;
                }
            }
            return flag;
        };

        $scope.search  =function(){
            if(!$scope.input.isInput){
                for(var i=0;i<$scope.members.length;i++){
                    $scope.members[i].hidden = false;
                }
                return;
            }

            for(var i=0;i<$scope.members.length;i++){
                if($scope.members[i].nickName.indexOf($scope.input.isInput) === -1){
                    $scope.members[i].hidden = true;
                }
            }
        };

        $scope.chooseOne = function (one){
            if(one.isSelected){
                one.isSelected = false;
            }else{
                one.isSelected= true;
            }
            if($scope.checkMembers()){
                $scope.isAllSelected = true;
            }else{
                $scope.isAllSelected = false;
            }
        };
        $scope.isAllSelected = false;

        $scope.chooseAll = function(){
            if($scope.isAllSelected){//取消全选

                for(var i=0;i<$scope.members.length;i++){
                    $scope.members[i].isSelected = false;
                }
                $scope.isAllSelected =false;
            }else{//全选
                for(var i=0;i<$scope.members.length;i++){
                    $scope.members[i].isSelected = true;
                }
                $scope.isAllSelected = true;
            }

        };

        $scope.gagOrNo = function(isornot){
            var  userIds = '';
                for(var i=0;i<$scope.members.length;i++){
                    if($scope.members[i].isSelected){
                        userIds= userIds+$scope.members[i].userId+',';
                    }
                }
                userIds =userIds.substr(0,userIds.length-1);

                var gagType = isornot;
                var params ={
                    userId: userIds,
                    userGagType: gagType,
                    groupId:$scope.groupId,
                    token:$scope.token

                };
                GroupSettingService.gagGroupUser(params).then(function(res){
                    if(res){
                        PopupService.showToast("禁言成功");


                        $scope.query();

                    }else{
                        console.log(" gagGroupUser ,server error");
                    }
                },function (error){
                    alert("net error--- gagGroupUser  failed");
                });


        };


        /** 方法 **/
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
        //搜索我的圈子


        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.groupId = $stateParams.groupId;
            $scope.init(); //测试本地数据 不需发请求
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


