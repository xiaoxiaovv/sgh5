/**
 * Created by apple on 16/12/9.
 */
APP.controller('manageUserController', ['$scope', '$state', '$stateParams', 'manageUserService', '$ionicScrollDelegate','PopupService','anchorScroll','$ionicPopup',
  function ($scope, $state, $stateParams, manageUserService, $ionicScrollDelegate,PopupService,anchorScroll,$ionicPopup) {
    /** 变量定义 **/
    $scope.mainuserlist = '';//楼主信息
    $scope.userlist = '';//成员信息
    $scope.topicId = '';//传参搜索
    $scope.aList=[];//字母
    $scope.isShut=[];
    $scope.input = {
      isinput: ''//绑定输入内容
    };

    $scope.goBack = function () {
      $state.go('allMembers',{topicId:$scope.topicId})
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      $state.go('personalHomepageHe', {othersId: code});
    };
    $scope.toAnchor=function(id){
      $scope.isDisplay=false;
      if(id=='#'){
        anchorScroll.toView('#toOther', true);
      }else{
        anchorScroll.toView('#'+id, true);
      }
    }
    //增加
    $scope.selectUser=function(item){
        for(var a=0;a<$scope.mainuser2list.length;a++){
            if($scope.mainuser2list[a].id==item.id){
                if($scope.mainuser2list[a].ischeck=="img/ic_select.png"){
                    $scope.mainuser2list[a].ischeck="img/ic_check.png";
                }else{
                    $scope.mainuser2list[a].ischeck="img/ic_select.png"
                }
            }
        }
        for(var i=0;i<$scope.userlist.length;i++){
            if(item.id==$scope.userlist[i].id){
                if($scope.userlist[i].ischeck=="img/ic_select.png"){
                    $scope.userlist[i].ischeck="img/ic_check.png";
                    $scope.userCode='';
                }else{
                    $scope.userlist[i].ischeck="img/ic_select.png";
                    $scope.userCode=item.userCode;
                }
            }
        }
    }
    
    //全选
    $scope.allDo=function(){
        if($scope.datalist.data.ifHost=='true'||$scope.datalist.data.isManager=='true'){
            if($scope.allcheck=="img/ic_select.png"){
                $scope.allcheck="img/ic_check.png";
                for(var a=0;a<$scope.mainuser2list.length;a++){
                    $scope.mainuser2list[a].ischeck="img/ic_check.png";
                }
                for(var i=0;i<$scope.userlist.length;i++){
                    $scope.userlist[i].ischeck="img/ic_check.png";
                }
            }else{
                $scope.allcheck="img/ic_select.png";
                for(var a=0;a<$scope.mainuser2list.length;a++){
                    $scope.mainuser2list[a].ischeck="img/ic_select.png";
                }
                for(var i=0;i<$scope.userlist.length;i++){
                    $scope.userlist[i].ischeck="img/ic_select.png";
                }
            }
        }else{
            if($scope.allcheck=="img/ic_select.png"){
                $scope.allcheck="img/ic_check.png";
                for(var i=0;i<$scope.userlist.length;i++){
                    $scope.userlist[i].ischeck="img/ic_check.png";
                }
            }else{
                $scope.allcheck="img/ic_select.png";
                for(var i=0;i<$scope.userlist.length;i++){
                    $scope.userlist[i].ischeck="img/ic_select.png";
                }
            }
        }
        
    }
    $scope.noSpeak=function(){
        for(var i=0;i<$scope.userlist.length;i++){
                if($scope.userlist[i].ischeck=="img/ic_select.png"){
                    $scope.isShut.push($scope.userlist[i].isgag);
                    $scope.manageList.push($scope.userlist[i].userCode);
                }
        }
        if($scope.datalist.data.ifHost=='true'||$scope.datalist.data.isManager=='true'){
            for(var a=0;a<$scope.mainuser2list.length;a++){
                if($scope.mainuser2list[a].ischeck=="img/ic_select.png"){
                    $scope.isShut.push($scope.mainuser2list[a].isgag);
                    $scope.manageList.push($scope.mainuser2list[a].userCode);
                }
            }
        }
        if($scope.manageList.length>0){
            var userCodeList=$scope.manageList.join(',');
            console.log(userCodeList);
            var user={
                topicId: $scope.topicId,
                userCode:userCodeList,
                isGag:1
            }
            for(var z=0;z<$scope.isShut.length;z++){
                if($scope.isShut[z]==1){
                    $scope.yesno=true;
                }else{
                    $scope.noyes=true;
                }
            }
            console.log($scope.yesno);
            console.log($scope.noyes);
            if($scope.yesno&&$scope.noyes){
                var myPopup = $ionicPopup.show({
                template: '<p>你选择的对象有禁言和非禁言，确认全部禁言？</p>',
                title: '提示',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [

                    {
                    text: '<span>确认</span>',
                    type: '',
                    onTap: function () {
                        $scope.ok(user);
                     }
                    },
                    {text: '取消',
                     onTap:function(){
                         $scope.manageList=[];
                        $scope.isShut=[];
                        $scope.yesno=false;
                        $scope.noyes=false;
                     }
                    }
                ]
                });
                
            }else if($scope.yesno&&(!$scope.noyes)){
                $scope.manageList=[];
                $scope.isShut=[];
                $scope.yesno=false;
                $scope.noyes=false;
                PopupService.showToast('已选对象为禁言者，无需禁言');
            }else{
                $scope.ok(user);
            }
        }else{
            PopupService.showToast('您还没有选择任何成员');
        }

    }
    $scope.release=function(){
        if($scope.datalist.data.ifHost=='true'||$scope.datalist.data.isManager=='true'){
            for(var a=0;a<$scope.mainuser2list.length;a++){
                if($scope.mainuser2list[a].ischeck=="img/ic_select.png"){
                    $scope.isShut.push($scope.mainuser2list[a].isgag);
                    $scope.manageList.push($scope.mainuser2list[a].userCode);
                }
            }
        }
        for(var i=0;i<$scope.userlist.length;i++){
            if($scope.userlist[i].ischeck=="img/ic_select.png"){
                $scope.isShut.push($scope.userlist[i].isgag);
                $scope.manageList.push($scope.userlist[i].userCode);
            }
        }
        if($scope.manageList.length>0){
            var userCodeList=$scope.manageList.join(',');
            console.log($scope.isShut);
            var user={
                topicId: $scope.topicId,
                userCode:userCodeList,
                isGag:0
            }
            for(var z=0;z<$scope.isShut.length;z++){
                if($scope.isShut[z]==1){
                    $scope.yesno=true;
                }else{
                    $scope.noyes=true;
                }
            }
            console.log($scope.yesno);
            console.log($scope.noyes);
            if($scope.yesno&&$scope.noyes){
                var myPopup = $ionicPopup.show({
                template: '<p>你选择的对象有禁言和非禁言，确认全部解除禁言？</p>',
                title: '提示',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [

                    {
                    text: '<span>确认</span>',
                    type: '',
                    onTap: function () {
                        $scope.ok(user);
                     }
                    },
                    {text: '取消',
                     onTap:function(){
                         $scope.manageList=[];
                        $scope.isShut=[];
                        $scope.yesno=false;
                        $scope.noyes=false;
                     }
                    }
                ]
                });
                
            }else if((!$scope.yesno)&&$scope.noyes){
                $scope.manageList=[];
                $scope.isShut=[];
                $scope.yesno=false;
                $scope.noyes=false;
                PopupService.showToast('已选对象为非禁言者，无需解除');
            }else{
                $scope.ok(user);
            }
        }else{
            PopupService.showToast('您还没有选择任何成员');
        }
        
    }
    $scope.ok=function(user){
        manageUserService.manageUser(user).success(function (response) {
            console.log(response)
            $scope.allcheck="img/ic_check.png";
            $scope.manageList=[];
            $scope.isShut=[];
            $scope.yesno=false;
            $scope.noyes=false;
            $scope.getallList();
            // $state.go('allMembers',{topicId:$scope.topicId})
        }).error(function () {
            console.log('获取数据失败');
        });
    }
    //删除成员
    $scope.yes=function(){ 
        if($scope.datalist.data.ifHost=='true'||$scope.datalist.data.isManager=='true'){
            for(var a=0;a<$scope.mainuser2list.length;a++){
                if($scope.mainuser2list[a].ischeck=="img/ic_select.png"){
                    $scope.manageList.push($scope.mainuser2list[a].userCode);
                }
            }
        }
        for(var i=0;i<$scope.userlist.length;i++){
            if($scope.userlist[i].ischeck=="img/ic_select.png"){
                $scope.manageList.push($scope.userlist[i].userCode);
            }
        }
        if($scope.manageList.length>0){
            var userCodeList=$scope.manageList.join(',');
            console.log($scope.isShut);
            var user={
                topicId: $scope.topicId,
                userCodeS:userCodeList,
                isAll:0
            }
            manageUserService.delectUser(user).success(function (response) {
                console.log(response)
                if(response.success){
                    $scope.getallList();
                    PopupService.showToast('删除成功');
                }else{
                    PopupService.showToast(response.message);
                }
            }).error(function () {
                console.log('获取数据失败');
            });
        }else{
            PopupService.showToast('您还没有选择任何成员');
        }
        
        

    }
    //搜索
    $scope.search = function (param) {
      var user = {
        'topicId': $scope.topicId,
        'userName': param.target.value
      };
      manageUserService.getuserlist(user).success(function (response, status, headers, config) {
        $scope.userNum = response.totalCount;
        if (window.cordova) {
          cordova.plugins.Keyboard.close();
        }
        console.log(response)
        $scope.datalist=response;
        $scope.userlist=response.data.list;
        $scope.mainuser2list=response.data.list2;
        for(var i=0;i<$scope.userlist.length;i++){
          if($scope.userlist[i].categoryName=='#'){
            $scope.userlist[i].categoryName='toOther';
          }
        }
        for(var a=0;a<$scope.mainuser2list.length;a++){
            $scope.mainuser2list[a].ischeck="img/ic_check.png";
        }
        for(var i=0;i<$scope.userlist.length;i++){
            $scope.userlist[i].ischeck="img/ic_check.png";
        }
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();//返回到此页回滚到顶部
      }).error(function () {
        console.log('获取数据失败');
      });
    };
    $scope.getallList=function(){
        var user = {
        topicId: $scope.topicId,
        pageSize: 20,
        pageIndex: 1
      };
      manageUserService.getuserlist(user).success(function (response) {
        console.log(response)
        $scope.datalist=response;
        $scope.userlist=response.data.list;
        $scope.mainuser2list=response.data.list2;
        for(var a=0;a<$scope.mainuser2list.length;a++){
            $scope.mainuser2list[a].ischeck="img/ic_check.png";
        }
        for(var i=0;i<$scope.userlist.length;i++){
            console.log($scope.userlist[i].ischeck)
            $scope.userlist[i].ischeck="img/ic_check.png";
        }
        $scope.userNum = response.totalCount;
        if($scope.userNum>20){
          $scope.hasmore = true;
        }
      }).error(function () {
        console.log('获取数据失败');
      });
    }
     //加载更多消息列表
    $scope.loadMoreMember = function () {
      $scope.pageIndex += 1;
      var user = {
        topicId: $scope.topicId,
        pageSize: 20,
        pageIndex: $scope.pageIndex
      };
      manageUserService.getuserlist(user)
        .success(function (response) {
        //   $scope.mainuser2list = response.data.list2;
          $scope.userNum = response.totalCount;
          if (response.data.list && response.data.list.length != 0) {
            $scope.userlist = $scope.userlist.concat(response.data.list);
            // for(var a=0;a<$scope.mainuser2list.length;a++){
            //     $scope.mainuser2list[a].ischeck="img/ic_check.png";
            // }
            for(var i=0;i<$scope.userlist.length;i++){
                console.log($scope.userlist[i].ischeck)
                $scope.userlist[i].ischeck="img/ic_check.png";
            }
            console.log($scope.listData);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.userlist.length;
            $scope.hasmore = !(len === response.totalCount);
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多消息了');
          }
        })
        .error(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };


    /** init方法 **/
    $scope.init = function () {
        $scope.hasmore = false;
        $scope.yesno=false;
        $scope.noyes=false;
      $scope.aList=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#']
      $scope.isShut=[];
      $scope.allcheck="img/ic_check.png";
      $scope.userCode='';
      $scope.manageList=[];
      
      $scope.pageIndex = 1;
      $scope.input = {
        isinput: ''//绑定输入内容
      };
      $scope.getallList();
    };

    /** on 方法 **/
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.topicId = $stateParams.topicId;
      $scope.init();
    });

  }]);

APP.service('manageUserService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取成员信息
  this.getuserlist = function (config) {
    return $http.post(UrlService.getUrl('GETLISTBYCODE'), config);
  };
  //设置管理员
  this.manageUser = function (config) {
    return $http.post(UrlService.getUrl('CIRCLE_MANAGE_USER'), config);
  };
  //删除成员
  this.delectUser = function (config) {
    return $http.post(UrlService.getUrl('CIRCLE_DELECT_USER'), config);
  };
}]);

