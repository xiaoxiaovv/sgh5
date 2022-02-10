/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：EasyConnectController 测试控制器
 **/

APP.controller('EasyConnectController', ['$localstorage','$scope', 'EasyConnectService', 'PopupService', '$timeout', '$state','InAppBrowserService','UrlService',
  function ($localstorage,$scope, EasyConnectService, PopupService, $timeout, $state,InAppBrowserService,UrlService) {
    /** 变量声明 **/
    $scope.bindData = [];
    $scope.account = '';
    $scope.mobile = '';
    $scope.updateResult = true;
    $scope.updateContent = '';
    /** 方法 **/
      //初始化
    $scope.init = function () {
      EasyConnectService.getMessage()
        .success(function (response, status, headers, config) {
          console.log(response);
          if (response.success) {
            $scope.bindData = response.data.kjtAccount;
            if (response.data.kjtAccount&&response.data.kjtAccount.status&&response.data.kjtAccount.status == "0") {
              $scope.account = response.data.kjtAccount.memberRealName;
              $scope.mobile = response.data.kjtAccount.memberKjtpayAccount;
            }
          } else if (response.message) {
            PopupService.showToast(response.message);
          } else {
            PopupService.showToast('登录失败！');
          }
        })
    };

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });

    //显示绑定人信息
    $scope.goToAccount = function () {
      $state.go('bindAccount');
    };

    //设置绑定
    $scope.clickBind = function () {

      //支持浏览器
      if(!window.device)
      {
        window.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
        return;
      }

      EasyConnectService.bind()
        .success(function (response, status, headers, config) {


          if(window.device && window.device.hasNewBrowser){//新

            var isAndroid = ionic.Platform.isAndroid();
            if (isAndroid) {
              var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
              ref.addEventListener('exit', function (event) {
                $scope.init();
              });
            }else
            {
              var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
              ref.addEventListener('exit', function (event) {
                $scope.init();
              });
            }


          }else{//老
            var isAndroid = ionic.Platform.isAndroid();
            if (isAndroid) {
              var ref_bind_android = cordova.InAppBrowser.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank');
              ref_bind_android.addEventListener('loadstop', function (event) {
                if (event.url.indexOf('https://m.kjtpay.com/bindmember/registerandbind') > -1) {
                  $timeout(function () {
                    var d = "var r= document.getElementsByTagName('div');" +
                      "var newDiv  = document.createElement('span');" +
                      "newDiv.style.width = '44px';" +
                      "newDiv.style.height = '44px';" +
                      "newDiv.style.background = 'transparent';" +
                      "newDiv.style.zIndex = '999';" +
                      "r[0].appendChild(newDiv);" +
                      "newDiv.style.top = '0px';" +
                      "newDiv.style.left = '0px';" +
                      "newDiv.style.position = 'absolute';" +
                      "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
                    ref_bind_android.executeScript({
                      code: d
                    }, function () {});
                  }, 2000);
                }
              });
              ref_bind_android.addEventListener('loadstart', function (event) {
                if (event.url.indexOf('close=true') > -1||event.url.indexOf("mstore") > -1) {
                  ref_bind_android.close();
                }
              });
              ref_bind_android.addEventListener('exit', function (event) {
                $scope.init();
              });
            }else
            {
              var ref = InAppBrowserService.open(UrlService.getUrl('KBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
              ref.addEventListener('exit', function (event) {
                $scope.init();
              });
            }

          }



        });


    };

    //解除绑定
    $scope.clickUnBind = function () {

      //支持浏览器
      if(!window.device)
      {
        window.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_self', 'location=yes');
        return;
      }

      EasyConnectService.unBlind()
        .success(function (response, status, headers, config) {
          //$state.go('easyConnectIframe', {'content': 'http://m.ehaier.com/v2/kjt/sg/kjtAccountUnbind.html'});

          var isAndroid = ionic.Platform.isAndroid();
          if(window.device && window.device.hasNewBrowser){//新版本

            if (isAndroid) {
              var ref = InAppBrowserService.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
              ref.addEventListener('exit', function (event) {
                $scope.init();
              });

            } else {


              var ref = InAppBrowserService.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
              ref.addEventListener('exit', function (event) {
                $scope.init();
              });
            }
          }
          else{//老版本

            var isAndroid = ionic.Platform.isAndroid();
            if (isAndroid) {
              var ref_unBind_android = cordova.InAppBrowser.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank');
              ref_unBind_android.addEventListener('loadstop', function (event) {
                if (event.url.indexOf('https://m.kjtpay.com/bindmember/cancelBind') > -1) {
                  $timeout(function () {
                    var d = "var r= document.getElementsByTagName('div');" +
                      "var newDiv  = document.createElement('span');" +
                      "newDiv.style.width = '44px';" +
                      "newDiv.style.height = '44px';" +
                      "newDiv.style.background = 'transparent';" +
                      "newDiv.style.zIndex = '999';" +
                      "r[0].appendChild(newDiv);" +
                      "newDiv.style.top = '0px';" +
                      "newDiv.style.left = '0px';" +
                      "newDiv.style.position = 'absolute';" +
                      "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
                    ref_unBind_android.executeScript({
                      code: d
                    }, function () {});
                  }, 2000);
                }
              });
              ref_unBind_android.addEventListener('loadstart', function (event) {
                if (event.url.indexOf('close=true') > -1||event.url.indexOf("mstore") > -1) {
                  ref_unBind_android.close();
                }
              });
              ref_unBind_android.addEventListener('exit', function (event) {
                $scope.init();
              });
            } else {
              var ref = InAppBrowserService.open(UrlService.getUrl('KUNBIND_INIT')+'?flag='+$localstorage.get('sg_login_token_secret').substring(6));
              ref.addEventListener('exit', function (event) {
                $scope.init();
              });
            }

          }

        });
    };

    //显示修改结果
    $scope.showResult = function (result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function () {
        $scope.updateResult = true;
      }, 1000);
    };


    $scope.goBack = function(){
      $state.go('mine');
    }


  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-4-29
 * describe：EasyConnectService服务
 **/
APP.service('EasyConnectService', ['$http', 'UrlService', function ($http, UrlService) {

  //获取绑定信息
  this.getMessage = function () {
    return $http.get(UrlService.getUrl('EASYCONNECT_INIT'));
  };

  //解除绑定
  this.unBlind = function () {
    /* return $http.get(UrlService.getUrl('KUNBIND_INIT'));*/
    return $http.get(UrlService.getUrl('KUNBIND_INIT'));
  };

  //设置绑定
  this.bind = function () {
    /* return $http.get(UrlService.getUrl('KBIND_INIT'));*/
    return $http.get(UrlService.getUrl('KBIND_INIT'));
  };

}]);
