APP.controller('ShopApplySuccessController',['trueAuthenticationService','$scope','$stateParams','ShopApplySuccessService','$ionicHistory','$state','$rootScope','RegisterV2Service','PopupService',function(trueAuthenticationService,$scope,$stateParams,ShopApplySuccessService,$ionicHistory,$state,$rootScope,RegisterV2Service,PopupService){
  var setPasswdView='<div style="background:#ffffff;width:304px;border-radius:5px;position:relative;padding: 20px 20px 5px 20px;">\
                        <div class="cancel-btn" style="position:absolute;top:10px;right:10px;width:20px;height: 20px;">\
                          <img src="'+$rootScope.imgBaseURL+'img/regist/xxx@2x.png" style="width:100%">\
                        </div>\
                        <div>\
                          <h5 style="font-size: 16px;line-height:22px;color:#333333;opacity: 0.86;">请输入您的登录密码</h5>\
                        </div>\
                        <div style="padding:20px 0 0 0px;border-bottom:1px solid #E4E4E4;">\
                          <input name="password" type="password" placeholder="请输入您的密码" style="width:100%;padding:10px;font-size:14px;line-height:22px;"/>\
                        </div>\
                        <div class="ok-btn new_authentication_home_btn" style="margin-top:15px;height:44px;line-height: 44px;width:100%;">\
                            <span style="background: #2979FF;font-size: 16px;">提交</span>\
                        </div>\
                    </div>';
  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.isNewUser=$rootScope.isNewUser;
      var historyRouter = $ionicHistory.viewHistory().histories.root;
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
        $scope.paddingtopClass = {
          "margin-top": "16px"
        };
        $scope.paddingtopClasscontent = {
          "top": "60px"
        }
      }else{
        $scope.paddingtopClass = {
          "margin-top": "0px"
        };
        $scope.paddingtopClasscontent = {
          "top": "44px"
        }
      }
      ShopApplySuccessService.getShopData()
      .success(function(response){
        if(response.success){
          $scope.memberCount = response.data.openStoreRank;
          if(typeof(_fxcmd)!='undefined'){
            _fxcmd.push(['trackEvent','event','cvr2','ownerregist','1']);
          }
        }else{
          $scope.memberCount = 888888;
        }
      });

      $scope.isOrNoGoHomePage = function(){
       // if(historyRouter.stack[historyRouter.stack.length-3].stateName == 'register'){
          $state.go('newHome');
        // }else{
        //   $ionicHistory.goBack(-2);
        // }
      }

        // trueAuthenticationService.doInit()
        //   .success(function (response) {
        //     if(response.success) {
        //       $scope.isNotAuthentication = response.data.isAuth; //认证状态
        //     }else{
        //       $scope.isNotAuthentication = true;
        //     }
        //   });


      //去实名认证
      // $scope.goToAuthentication=function(){
      //   $state.go('trueAuthenticationList',{
      //     type:2
      //   })
      // }

      /*****
       * 修改密码
       */
      $scope.setPassword=function(){
        var dialog=PopupService.dialog({
          content:setPasswdView,
          buttons:[
            {selector:".ok-btn",handler:function(){
              var newPasswd=dialog.find(":input[type='password']").val();
              var reg = $scope.globalConstant.passwordRegExp;
              if (newPasswd.length==0) {
                PopupService.showToast('请输入密码！');
              } else if(!(reg.test(newPasswd))) {
                PopupService.showToast('密码不符合规则！');
              }else{
                dialog.remove();
                RegisterV2Service.setPassword(newPasswd).success(function (response, status, headers, config) {
                  console.log(response);
                  if(response.success){
                    PopupService.showToast('设置登陆密码成功！');
                    $state.go('newHome');
                  }else if(response.message){
                    PopupService.showToast(response.message);
                  }else{
                    PopupService.showToast('设置登陆密码发生异常！');
                  }
                });
              }
            }},
            {selector:".cancel-btn",handler:function(){
              dialog.remove();
              $state.go('newHome');
            }}
          ]
        });
      }
    });
}]);
APP.service('ShopApplySuccessService',['$http','UrlService',function($http,UrlService){
    //获取页面数据
  this.getShopData = function () {
    return $http.post(UrlService.getUrl('SHOP_APPLY_SUCCESS'));
  };
}])
