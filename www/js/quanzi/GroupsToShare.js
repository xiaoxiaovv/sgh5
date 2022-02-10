/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('GroupsToShareController', ['$scope', '$rootScope', '$ionicHistory', '$stateParams', '$state', '$timeout', '$interval', 'GroupAddMemberService','UserService','PopupService',
    '$ionicActionSheet','MediaService','GroupSettingService','CircleGroupDiscussService',
    function ($scope, $rootScope, $ionicHistory, $stateParams, $state, $timeout, $interval, GroupAddMemberService,UserService,PopupService,$ionicActionSheet,MediaService,GroupSettingService,CircleGroupDiscussService) {
        //    初始化参数

        $scope.input={
            keywords:''
        };//大家都在搜
        //是否显示搜索放大镜
        $scope.iconShow = true;

        $scope.members =[


        ];
        $scope.shareListStr =undefined;

        $scope.isAllSelected = false;
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

        var user = UserService.getUser();

        $scope.groupId = 55;//讨论组id  todo 从路由中得到

        $scope.token = user.sessionValue;


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
        $scope.search = function (param) {
            console.log(param.srcElement.value);
            console.log('触发搜索方法 ***&&&&****！');

        };

        $scope.init = function(){
            var user = UserService.getUser();
            $scope.token = user.sessionValue;
            var params ={
                userId: user.mid,
                token:$scope.token
            };
            GroupSettingService.queryGroupByMemberId(params).then(function(res){
                if(res&& res.data){
                    for(var i=0;i<res.data.rows.length;i++){
                      try{
                        res.data.rows[i].despObj = JSON.parse(res.data.rows[i].desp);
                      }catch(e){
                        res.data.rows[i].despObj ={};
                      }


                    }

                    $scope.members =res.data.rows;

                }else{

                    PopupService.showToast('获得讨论组列表失败');
                }


            });


        };
        $scope.$on('$ionicView.beforeEnter', function () {
            // $scope.init(); //测试本地数据 不需发请求
            $scope.shareListStr = $stateParams.shareList;//todo 从接口中 得到 可以分享出去的讨轮 组  list中的元素 含有  groupId  groupName，讨论组头像 等信息在 description 中

            $scope.init();

        });

        $scope.$on('$ionicView.afterEnter', function (e,v) {//配合 play-sound指令进行

            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast
        });

        $scope.$on('$ionicView.beforeLeave', function (e,v) {

        });

        $scope.goBack = function () {
            $scope.$ionicGoBack();

        };

        $scope.addGroupMebers = function(){
            var jsonMembers = '[{"userId":"138307014","idCate":"0","nickName":"cao138307014","imageFile":"www.baidu.com"},{"userId":"138990945","idCate":"0","nickName":"15648756478","imageFile":"www.baidu.com"}]';
            var params = {
                groupMembers:jsonMembers,
                groupId:$scope.groupId,
                token:$scope.token
            };
            GroupAddMemberService.addMembers(params) .then(function(res){
                if(res){
                    PopupService.showToast("添加成员成功");

                }else{
                    console.log(" add group Members ,server error");
                }
            },function (error){
                alert("net error--- add group Members ---failed");
            });

        };

      $scope.sendToGroups = function(){
        var idStr ='';
        for(var i=0;i<$scope.members.length;i++){
          if($scope.members[i].isSelected){
            idStr = idStr+$scope.members[i].groupId+',';
          }
        }
        if(!idStr){
          alert('no chooesed');return;
        }
        idStr =idStr.substr(0,idStr.length-1);
      //相多个讨论组  传 一大串分享的信息
        var params = {
            c:'sendGroupMsg',
            groupId:idStr,
            msg: $scope.shareListStr,
            msgType:1,
            token:$scope.token

        };
        CircleGroupDiscussService.sendMsg(params).then(function(response){
                if(response){
                    console.log('发送完图片 将 这个消息 to group chat');
                }
                else{
                    PopupService.showToast('发送消息失败--发送音频后');
                }
            },function(error){
                //异常意外
            }
        );
      };

    }]);


APP.service('GroupsToShareService', ['$http', 'UrlService','$sce', function ($http, UrlService,$sce) {
    //登录
    var customerHost = "http://172.16.63.134:8080";//牛发旺的后台
    var addMembersUrl = '/console/Service/chatGroup/updateGroupUser';

    this.getMemberList = function(params){
        return $http.get(customerHost+webapp+"msg.dll",params);

    };
    this.addMembers = function(params){
        return $http({
            method: 'POST',
            url:customerHost+addMembersUrl,
            params: params
        })
    };

}]);

