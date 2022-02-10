/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/28
 * describe：groupSettingController 讨论组设置控制器
 **/

APP.controller('GroupSettingController',['$scope','GroupSettingService', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval','UserService',
  'PopupService','CircleGroupDiscussService','$ionicModal','$stateParams',
  function($scope, GroupSettingService,$rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval,UserService,PopupService,CircleGroupDiscussService,$ionicModal,$stateParams) {

    $scope.isShowName = true;//弹出 model 显示 的是更改名字 还是更改 录音时长

    $scope.confirmData ={
      groupName:'',
      groupMax:'0'
    };

    var guser = {
      userGag: 0,
      userId: "test",
      userState: "0",
      userName:'我是路飞',
      userImg:'http://cdn21test.ehaier.com:8080/file/58648050246126ab1e39f3e8.png'
    };
    var guser1 = {
      userGag: 1,
      userId: "test",
      userState: "1",
      userName:'我不是是路飞',
      userImg:'https://git.oschina.net/uploads/80/436680_xu6767.png'
    };
    $scope.groupId ;//讨论组id  todo 从路由中得到

    var user = UserService.getUser();
    $scope.token = user.sessionValue;

    //userGag ‘null’ ‘0’； 代表未禁言 1 代表禁言
    $scope.groupUsers =[
        guser,guser1,guser,guser1, guser,guser1,guser,guser1, guser,guser1,guser,guser1
    ];

    $scope.groupDesp ={};

    $scope.groupSetting={yes:false,userId:undefined};

    var sw =  window.innerWidth;
    $scope.jinyanHover ={
      top:'5px',
      left:(sw*0.1-21)-1.5+'px'
    };
    $scope.groupInfo ;

  $scope.query = function() {
    var params = {
      groupId: $scope.groupId,
      token:$scope.token
    };

    GroupSettingService.query(params).success(function (r1) {

      if (r1 && r1.userInfo) {
        $scope.groupUsers = r1.userInfo;
      } else {
        console.log('查询群组成员失败')
      }

    }, function (error) {
      alert("查询群组成员失败");
    });

  };

  $scope.init = function(){
    $scope.query();
    $scope.queryGroup();

  };

    $scope.delGroupUser = function(gUser){
      var params ={
        userId: gUser.userId,
        groupId:$scope.groupId

      };
      GroupSettingService.deleteGroupUser(params).then(function(res){
        if(res){
          PopupService.showToast("删除用户成功");
          $scope.query();

        }else{
          console.log(" delGroup ,server error");
        }
      },function (error){
        alert("net error--- delGroup  failed");
      });

    };
    $scope.getAllMsg = function(){
      var params = {
        c:"getGroupMsg" ,
        groupId: $scope.groupId,
        token:$scope.token
      };
      CircleGroupDiscussService.getAllMsg(params).then(function(res){
        if(res&& res.data){
          $scope.historyMsgs =res.data.rows;

        }else{

          PopupService.showToast('获得讨论组列表失败');
        }
      },function (error){
        alert("net error--- delGroup  failed");
      });

    };

    $scope.getMsgByMun =function(){
       var params = {
        beginMun:0 ,
        groupId: $scope.groupId,
        endMun:1000,
        //  startTime:'2017-2-20 00:00:00',
        //  endTime:'2017-2-21 23:59:59',
        token:$scope.token
      };
      CircleGroupDiscussService.getMsgByMun(params).then(function(res){
        if(res){
          var aa =res;


        }else{
          console.log(" delGroup ,server error");
        }
      },function (error){
        alert("net error--- delGroup  failed");
      });

    };

    $ionicModal.fromTemplateUrl('templates/quanzi/groupName.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.groupName = modal;
    });

    $scope.openName = function(){
      $scope.isShowName = true;
      $scope.groupName.show();
    };
    $scope.closeName = function(){
      $scope.groupName.hide();

    };

    $scope.openMaxRecord = function(){
      $scope.isShowName = false;
      $scope.groupName.show();
    };



    //查询 group详细信息
    $scope.queryGroup = function(){
      var params ={
        companyId :user.mid,
        groupId:$scope.groupId,
        token:$scope.token
      };
      GroupSettingService.queryGroup(params).then(function(res){
        if(res.data && res.data.rows){
          $scope.groupInfo = res.data.rows[0];

          $scope.groupDesp = JSON.parse($scope.groupInfo.desp);

        }else{
          console.log(" delGroup ,server error");
        }
      },function (error){
        alert("net error--- delGroup  failed");
      });

    };

    $scope.upDateGroup = function(){

      //if(!$scope.groupSetting.userId){
      //  PopupService.showToast("请输入合法的用户Id")
      //}
      var params;
      if($scope.confirmData.groupName){
        var despStr = JSON.parse($scope.groupDesp);
       params ={
          id: $scope.groupId,
          desp:'{}',
          token:despStr,
          groupName:$scope.confirmData.groupName
        };
      }
      if($scope.confirmData.groupMax){
        if(!angular.isNumber($scope.confirmData.groupMax)){
          PopupService.showToast('请输入一个秒数');
          return;
        }
        $scope.groupDesp.timeSet = $scope.confirmData.groupMax;

        var despStr = JSON.parse($scope.groupDesp);
        params ={
          id: $scope.groupId,
          desp:despStr,
          token:$scope.token,
          groupName:$scope.confirmData.groupName
        };
      }
      if(!params){
        PopupService.showToast('输入不能为空');
        return;
      }
      GroupSettingService.updateGroup(params).then(function(res){
        if(res){
          PopupService.showToast("更改讨论组信息成功");
          $scope.queryGroup();

        }else{
          console.log(" addGroupUser ,server error");
        }
      },function (error){
        alert("net error--- addGroupUser  failed");
      });

    };
    $scope.queryGroupByMemberId = function(){

      //if(!$scope.groupSetting.userId){
      //  PopupService.showToast("请输入合法的用户Id")
      //}
      var params ={
        userId: user.mid,
        token:$scope.token
      };
      GroupSettingService.queryGroupByMemberId(params).then(function(res){
        if(res){
        //  PopupService.showToast("更改讨论组信息成功");

          console.log('queryGroupByMemberId -- succ');
         // $scope.queryGroup();

        }else{
          console.log(" addGroupUser ,server error");
        }
      },function (error){
        alert("net error--- addGroupUser  failed");
      });

    };

    $scope.addGroupUser = function(){

      if(!$scope.groupSetting.userId){
        PopupService.showToast("请输入合法的用户Id")
      }
      var params ={
        userId: $scope.groupSetting.userId,
        groupId:$scope.groupId

      };
      GroupSettingService.updateGroupUser(params).then(function(res){
        if(res){
          PopupService.showToast("添加成员成功");
          $scope.query();

        }else{
          console.log(" addGroupUser ,server error");
        }
      },function (error){
        alert("net error--- addGroupUser  failed");
      });

    };
    $scope.gagGroupUser = function(gUser){
      var isGag;
      if(gUser.userGag==="null" || gUser.userGag==="0"){
        isGag = 1;
      }else if(gUser.userGag =="1"){
        isGag =0
      }
      else {
        console.error("列表返回的用户禁言属性不合法，严重错误");
        return;
      }
      var params ={
        userId: gUser.userId,
        userGagType: isGag,
        groupId:$scope.groupId

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

    $scope.gagAll = function(){

      console.log($scope.groupSetting.yes);

      var params ={
        groupGagType:$scope.groupSetting.yes?1:0,
        groupId:$scope.groupId
      };
      GroupSettingService.getGroupGag(params).then(function(res){
        if(res){
          PopupService.showToast("gagAll");
          $scope.query();

        }else{
          console.log(" gagAll ,server error");
        }
      },function (error){
        alert("net error--- gagAll  failed");
      });


    };
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.groupId= $stateParams.groupId;
    $scope.circleId= $stateParams.circleId;
    if(!$scope.groupId){
      PopupService.showAlert('严重错误','没有讨论组Id！！！');
    }
    $scope.init();
  });
  /*变量声明*/
  $scope.tabSelected = true;//当前tab是否为成员memberSelected

  /*方法定义*/
  $scope.switchTab = function () {
    $scope.tabSelected = !$scope.tabSelected;
  };


  $scope.createGroup = function () {
    GroupSettingService.createGroup('admin', '讨论组名字', '讨论组介绍信息')
      .success(function (response) {
        $scope.groupId = response.groupId;
      });
  };

  $scope.deleteGroup = function () {
    GroupSettingService.deleteGroup($scope.groupId)
      .success(function (res) {
        console.log(res);
      });
  };

    $scope.toGroupEditMember = function(){
      $state.go('groupEditMember',{groupId:$scope.groupId});
    };
    $scope.toGroupAddMember = function(){
      $state.go('groupAddMember',{groupId:$scope.groupId,circleId:$scope.circleId});
    };
}]);



APP.service('GroupSettingService', ['$http', function ($http) {

  /*创建讨论组*/
 // var  host ="http://172.16.63.96:8080/console/Service/chatGroup/queryGroupUser",query="console/Service/chatGroup/queryGroupUser "; http://123.56.3.136:8180/   http://172.16.63.134:8080
 // ttp://127.0.0.1:8080/console/Service/chatGroup/deleteGroupUser   //console工程
  var host = "http://123.56.3.136:8180/Service/chatGroup";

  var registerUrl  ='http://123.56.3.136:8180/Service/Company/addApi';

  this.register = function(params){
    return $http.get(registerUrl,params);

  };

  var queryUrl = host+"/queryGroupUser";
  this.query = function (params) {
    return $http({
      method: 'POST',
      url:queryUrl,
      params: params
    })
  };

  //根据 groupId memberId 查出 讨论组 详情
  this.queryGroup = function (params) {
    return $http({
      method: 'POST',
      url:host+'/queryGroup',
      params: params
    });
  };

  this.queryGroupByMemberId  = function(params){
    return $http({
      method: 'POST',
      url:host+'/queryChatGroupUserId',
      params: params
    });
  };

  //根据 groupID 修改 讨论组 详情
  //$.post("/Service/chatGroup/updateChatGroupDesp",{id:"1",desp:"{timeSet:100,isInvite:0,avatarImageFileid:''}", groupName:"测试组",token:"08260B3805EE981FE7BD6612CADB3AFA"}, function(res){console.log(res)});
  this.updateGroup = function (params) {
    return $http({
      method: 'POST',
      url:host+'/updateChatGroupDesp',
      params: params
    })
  };

  //将查出的 讨论组对象 转化下
  this.filtGroup = function(groupObj){


  };

  //删除群组成员
  var deleteGroupUserUrl = host+"/deleteGroupUser";
  this.deleteGroupUser = function (params) {
    return $http({
      method: 'POST',
      url:deleteGroupUserUrl,
      params: params
    })
  };

  //gag 噎住
  var gagGroupUserUrl = host+"/getGroupUserGag";
  this.gagGroupUser = function (params) {
    return $http({
      method: 'POST',
      url:gagGroupUserUrl,
      params: params
    })
  };

  //添加成员
  var updateGroupUserUrl = host+"/updateGroupUser";
  this.updateGroupUser = function (params) {
    return $http({
      method: 'POST',
      url:updateGroupUserUrl,
      params: params
    })
  };

  //全部禁言  http://127.0.0.1:8080/console/Service/chatGroup/getGroupGag
  var getGroupGagUrl = "http://172.16.63.96:8080/console/Service/chatGroup/getGroupGag";
  this.getGroupGag = function (params) {
    return $http({
      method: 'POST',
      url:getGroupGagUrl,
      params: params
    })
  };

  //创建group
  var createGroupUrl ="http://172.16.63.98:8080/console/Service/chatGroup/getCreateGroupChat";
  this.createGroup = function (userId, groupName, groupDesp) {

    return $http({
      method: 'POST',
      url: url,
      params: createGroupUrl
    });
  };

  //暂时没有关闭
  this.deleteGroup = function (groupId) {
    var params ={
      id:groupId
    };
    var deleteGroupurl = 'http://172.16.63.98:8080/console/Service/chatGroup/getCloseGroupChat';
    return $http({
      method: 'POST',
      url: deleteGroupurl,
      params: params
    })
  };
}]);
