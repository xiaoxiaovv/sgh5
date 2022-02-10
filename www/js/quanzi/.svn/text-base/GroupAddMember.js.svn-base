/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('GroupAddMemberController', ['$scope','$stateParams', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval', 'GroupSettingService','UserService','PopupService','CirclePageService','$q',
    function ($scope,$stateParams, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval, GroupSettingService,UserService,PopupService,CirclePageService,$q) {
        //    初始化参数
        $scope.input={
            keywords:''
        };//大家都在搜
        //是否显示搜索放大镜
        $scope.iconShow = true;

        $scope.members =[

        ];


        $scope.groupId = $stateParams.groupId;//讨论组id
        var user = UserService.getUser();
        $scope.token = user.sessionValue;

        $scope.circleId = 408; //圈子id  todo 从路由中得到


        $scope.members =[];
        $scope.membersHead = [];

        $scope.membersCommon =[];

        $scope.membersAdded = [];

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

        //获取圈子成员
        $scope.getCircleMembers = function () {
            var defer = $q.defer();
            var topicId = {
                topicId: $scope.circleId
            };
            CirclePageService.circleMembers(topicId)
                .success(function (response) {
                    if (response.success) {
                        $scope.membersCommon = response.data.list;
                        $scope.membersHead = response.data.list1;
                        defer.resolve(1);
                    }else{
                        PopupService.showToast('获取圈子成员失败');
                        defer.reject(1);
                    }
                });
            return defer.promise ;

        };

        //获取讨论组成员
        $scope.query = function() {
            var params = {
                groupId: $scope.groupId,
                token:$scope.token
            };

            GroupSettingService.query(params).success(function (r1) {

                if (r1 && r1.userInfo) {
                    $scope.membersAdded = r1.userInfo;

                    // 圈子成员 再去除 已经在讨论组的成员
                    for(var i=0;i<$scope.membersHead.length;i++){//先循环 圈主
                        var isIn = false,mId = $scope.membersHead[i].memberId;
                        for(var i1=0;i1<$scope.membersAdded.length;i1++){
                            if(mId == $scope.membersAdded[i1].userId){
                                isIn = true;break;
                            }
                        }
                        if(!isIn){//不在讨论组 内 则可以放在 代添加的list 中
                            var memberToAdd = {};
                            memberToAdd.idCate = 0;//普通成员
                            memberToAdd.imageFile =  $scope.membersHead[i].img;
                            memberToAdd.nickName = $scope.membersHead[i].userName;
                            memberToAdd.userId =$scope.membersHead[i].memberId;
                            memberToAdd.userGag = '0'; //不禁言
                            memberToAdd.userState = 1; //不明含义
                            $scope.members.push(memberToAdd);
                        }
                    }

                    for(var j=0;j<$scope.membersCommon.length;j++){//再循环成员
                        var isI = false,mId = $scope.membersCommon[j].id;
                        for(var j1=0;j1<$scope.membersAdded.length;j1++){
                            if(mId == $scope.membersAdded[j1].userId){
                                isI =true;break;
                            }
                        }
                        if(!isI){
                            var memberToAdd = {};
                            memberToAdd.idCate = 0;//普通成员
                            memberToAdd.imageFile =  $scope.membersCommon[j].userImg;
                            memberToAdd.nickName = $scope.membersCommon[j].userName;
                            memberToAdd.userId =$scope.membersCommon[j].id;
                            memberToAdd.userGag = '0'; //不禁言
                            memberToAdd.userState = 1; //不明含义
                            $scope.members.push(memberToAdd);
                        }

                    }
                } else {
                    console.log('查询群组成员失败')
                }

            }, function (error) {
                alert("查询群组成员失败");
            });

        };


        $scope.$on('$ionicView.beforeEnter', function () {
            // $scope.init(); //测试本地数据 不需发请求

            $scope.members = [];
            $scope.groupId = $stateParams.groupId;//讨论组id
            $scope.circleId = $stateParams.circleId;
            $scope.getCircleMembers().then(function(){
                //先获得 圈子成员 再去除 已经在讨论组的成员
                $scope.query();
            });

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
            var jsonMembers = '[{"userId":"138306987","idCate":"0","nickName":"138306987","imageFile":"http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png"},{"userId":"138306986","idCate":"0","nickName":"15648756472","imageFile":"http://www.ehaier.com/mstatic/wd/v2/img/icons/ic_default_avatar.png"}]';

            var aa = [];
            for(var k=0;k<$scope.members.length;k++){
                if($scope.members[k].isSelected){
                    aa.push($scope.members[k]);
                }
            }
            var deepCopy = function(o) {
                if (o instanceof Array) {
                    var n = [];
                    for (var i = 0; i < o.length; ++i) {
                        n[i] = deepCopy(o[i]);
                    }
                    return n;

                } else if (o instanceof Object) {
                    var n = {};
                    for (var i in o) {
                        n[i] = deepCopy(o[i]);
                    }
                    return n;
                } else {
                    return o;
                }
            };
            var copy = deepCopy(aa);
            for(var j=0;j<copy.length;j++){

                delete copy[j].$$hashKey;
                delete copy[j].isSelected;
            };

            var str = JSON.stringify(copy);
          //  str = '[{"userId":"138307011","idCate":"0","nickName":"15648756474","imageFile":""}]';
            var params = {
                groupMembers:str,
                groupId:$scope.groupId,
                token:$scope.token
            }; //todo  暂时 不加member 入讨论组
            GroupSettingService.updateGroupUser(params) .then(function(res){
                    if(res){
                        PopupService.showToast("添加成员成功");

                      //添加成功后 init
                      $scope.getCircleMembers().then(function(){
                        //先获得 圈子成员 再去除 已经在讨论组的成员
                        $scope.query();
                      });

                    }else{
                        console.log(" add group Members ,server error");
                    }
                },function (error){
                    alert("net error--- add group Members ---failed");
                });

        }

    }]);


APP.service('GroupAddMemberService', ['$http', 'UrlService','$sce', function ($http, UrlService,$sce) {
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

