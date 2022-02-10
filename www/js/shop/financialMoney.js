APP.controller('FinancialMoneyController', ['InAppBrowserService','$rootScope','$scope','$state','FinancialMoneyService','UrlService','$stateParams',
  function(InAppBrowserService,$rootScope,$scope,$state,FinancialMoneyService,UrlService,$stateParams){
   var serverHead = UrlService.getHead().replace('v3/', 'www/index.html'); // 线上环境测试生产
  //var serverHead = 'http://172.18.20.187:8100/'; // 本地测试环境
    $scope.ssAuth = null;
    $rootScope.financialMoneyWhereId = '';
    if ($stateParams.whereId != 'manageMoney') {
      $rootScope.financialMoneyWhereId = $stateParams.whereId;
    }
  $scope.loginUrl = serverHead+'#/financialMoney/'+$rootScope.financialMoneyWhereId; //再次登录的页面，即当前页面，token过期
  $scope.returnUrl = serverHead+'#/'+$rootScope.financialMoneyWhereId; // 点击button需要返回的页面
  var authCode = ''; //存放auth_code
  var partner_id = 200000055141;//快捷通商户ID准生产
  // var partner_id = 200000030019;//快捷通商户ID正式
  // var partner_id = 200000131056; //快捷通商户ID测试
  


  $scope.$on('$ionicView.beforeEnter', function () {

    
    var locationUrl = unescape(window.location.href);
    if (locationUrl.indexOf('auth_code') != -1) {
      var startIndex = locationUrl.indexOf('auth_code') + 10;
      var auth_code = locationUrl.toString().substr(startIndex, 32);
      // alert('auth_code ', auth_code);
      FinancialMoneyService.getToken({
        authCode: auth_code
      }).success(function (res) {
        // alert('请求小宇的接口 ', res);
        window.localStorage.setItem('darcy_ktj_token', res.data.token);
        if (!res.data.token) {
            // 未登录,去快捷通界面
            var newHead = 'http://cdn09.ehaier.com/shunguang/H5/';
            var backUrl = serverHead+'#/'+$rootScope.financialMoneyWhereId;
            // var callBackUrl = serverHead+'#/financialMoney/'+$rootScope.financialMoneyWhereId+'?page=' + backUrl;
            var newBackUrl = newHead + 'hryLoading.html' + '?page=' + backUrl;
            var encodeUrl = escape(newBackUrl);
            var kjtUrl = UrlService.getCPUrl('BABY_KJT_LOGIN') + '?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//准生产环境环境快捷通授权链接
            window.location.href = kjtUrl;
        } else {
            var successUrl = UrlService.getCPUrl('BABY_KJT') + localStorage.getItem('darcy_ktj_token') +'?partner_id=' + partner_id;
            window.location.href = successUrl;
        }
      });
    } else {
      // alert('判断是否登录  ', localStorage.getItem('darcy_ktj_token'));
      var isLogin = localStorage.getItem('darcy_ktj_token')
      if (!isLogin) {
          // 未登录,去快捷通界面
          var newHead = 'http://cdn09.ehaier.com/shunguang/H5/';
          var backUrl = serverHead+'#/'+$rootScope.financialMoneyWhereId;
          var newBackUrl = newHead + 'hryLoading.html' + '?page=' + backUrl;
          var encodeUrl = escape(newBackUrl);
          var kjtUrl = UrlService.getCPUrl('BABY_KJT_LOGIN') + '?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//准生产环境环境快捷通授权链接
          // alert('----------');
          window.location.href = kjtUrl;
      } else {
          // alert('+++++++++++++');
          var successUrl = UrlService.getCPUrl('BABY_KJT') + localStorage.getItem('darcy_ktj_token') +'?partner_id=' + partner_id;
          window.location.href = successUrl;
      }
    }

    $scope.init();

  });
  


  $scope.init = function () {

    // 快捷通跳转修改
    

    var isLogin = localStorage.getItem('darcy_ktj_token')
    if (!isLogin) {
        // 未登录,去快捷通界面
        var newHead = 'http://cdn09.ehaier.com/shunguang/H5/';
        var backUrl = serverHead+'#/'+$rootScope.financialMoneyWhereId;
        var newBackUrl = newHead + 'hryLoading.html' + '?page=' + backUrl;
        var encodeUrl = escape(newBackUrl);
        var kjtUrl = UrlService.getCPUrl('BABY_KJT_LOGIN') + '?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//准生产环境环境快捷通授权链接
        window.location.href = kjtUrl;
    } else {
        var successUrl = UrlService.getCPUrl('BABY_KJT') + localStorage.getItem('darcy_ktj_token') +'?partner_id=' + partner_id;
        window.location.href = successUrl;
    }


    // 第三方链接
    // if(SET_ENV === DEV){
    //     OFFICIAL_KQT_URL_LOGIN='https://mgs.kjtpay.com/mgs/common/page.htm' // 快捷通授权登录页面测试环境
    //     OFFICIAL_KQT_URL='https://wallet-h5.kjtpay.com/index'; // 登陆成功后打开快捷通的链接测试环境
    // } else {
    //     OFFICIAL_KQT_URL_LOGIN='https://mgs.kjtpay.com/mgs/common/page.htm'  // 快捷通授权登录页面正式环境
    //     OFFICIAL_KQT_URL='https://wallet-h5.kjtpay.com/index'; // 登陆成功后打开快捷通的链接正式



    //校验登录状态并处理
    function checkLogin() {
      FinancialMoneyService.checkKjtLogin().
        success(function (response) {
          if (response.data.isLogin) {
            $scope.ssAuth = response.data.token;
            // console.log(12312);
            angular.element('#hairongyi').submit();
          } else {
            // var frontState = $stateParams.frontState;
            var backUrl = serverHead+'#/'+$rootScope.financialMoneyWhereId;

            var callBackUrl = serverHead+'#/financialMoney/'+$rootScope.financialMoneyWhereId+'?page=' + backUrl;
            var encodeUrl = escape(callBackUrl);
            // var kjtUrl = 'https://mgs.kjtpay.com/mgs/common/page.htm?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//正式环境快捷通授权链接
            var kjtUrl = 'https://mgs.kjtpay.com/mgs/common/page.htm?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//准生产环境环境快捷通授权链接
            // var kjtUrl = 'https://c1mgs.kjtpay.com/mgs/common/page.htm?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//测试环境快捷通授权链接
            window.location.href = kjtUrl;
          }
        })
    }

  }
}]);
APP.service('FinancialMoneyService',['$http','UrlService','UserService',function ($http,UrlService,UserService) {
  this.getToken = function (params) {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_KJT_TOKEN'),
      params: params
    })
  };
  this.checkKjtLogin = function () {
    // console.log(UrlService.getUrl('GET_KJT_TOKEN'));
    return $http.get(UrlService.getUrl('CHECK_KJT_LOGIN'));
  }
}]);
