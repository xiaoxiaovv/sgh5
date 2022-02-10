/**
 * Created by 11140921040349 on 2016/4/11.
 */
APP.controller('CouponsDetailTwoController', ['$scope', '$rootScope', '$stateParams', 'CommonLocationService', '$state', 'CouponsDetailTwoService','$timeout','UrlService','$ionicPopup','PopupService','$ionicHistory',
  function ($scope, $rootScope, $stateParams, CommonLocationService, $state, CouponsDetailTwoService,$timeout,UrlService,$ionicPopup,PopupService,$ionicHistory) {

    $scope.htmlContent = $stateParams.content;
    $scope.title = $stateParams.title;
    $scope.id = $stateParams.cId;
    $scope.userID = $stateParams.userID;
    $scope.type = $stateParams.type;
    $scope.status = $stateParams.status;
    $scope.couponId = $stateParams.couponId;
    $scope.isUser = $stateParams.isUser;

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.data = "";
      $scope.init();
    });
    //点击转赠后弹出弹框
    $scope.donation = function (id) {
      //var name=prompt("请输入您要转赠人的id","");
      //if (name!=null && name!="")
      //{
      //  document.write("你好，" + name + "！今天过得好吗？");
      //}
      $scope.data.memberId = null;
      $scope.data.messsage = null;
      $scope.findMember = true;
      var myPopup = $ionicPopup.show({//<div class="font-size-10 text-align-c" ng-click="getName()">查询</div><div ng-bind="data.messsage"></div>
        template: '<div class="padding"><span class="text-align-c">请输入你要查找的会员ID</span> '+
        '<div class="padding-top"><input class="border" style="height: 30px" type="text" ng-model="data.memberId" placeholder=""></div></div>'+
        '<div  ng-if="!findMember"><span class="text-align-c" style="color: red;" ng-bind="data.messsage"></span>',
        title: '转赠',
        subTitle: '转赠',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>查询</b>',
            type: 'button-positive',
            onTap: function (e) {
              e.preventDefault();
              if ($scope.data.memberId != null) {
                //e.preventDefault();
                CouponsDetailTwoService.getMemberName($scope.data.memberId)
                  .success(function (response, status, header, config) {
                    console.log(response);

                    if (response.success == true) {
                      $scope.findMember = true;
                      myPopup.close();
                      $scope.couponsForTransfer($scope.data.memberId,$scope.couponId);
                      $scope.data.messsage = response.data;
                    }else{
                      $scope.findMember = false;
                      $scope.data.messsage = response.message;
                      //$scope.data.memberId = '';
                    }
                    //$scope.name = response.data;
                    //console.log($scope.data);
                  });
              } else {
                $scope.data.memberId = '请输入会员id';

                //CouponsDetailTwoService.donationCoupons($scope.data.memberId)
                //  .success(function (response, status, header, config) {
                //    console.log(response);
                //    //$scope.name = response.data;
                //    //console.log($scope.data);
                //  });
                //return $scope.data.wifi;
              }
            }
          }
        ]

      });
    };
    $scope.couponsForTransfer = function (memberId,id) {


      var myPopup2 = $ionicPopup.show({//<div class="font-size-10 text-align-c" ng-click="getName()">查询</div><div ng-bind="data.messsage"></div>
        template: '<div class="margin-top-15"><span class="text-align-c">您确定要将该优惠券转赠给\'<span style="color: red">{{data.messsage}}</span>\'吗？</span></div>',
        title: '转赠',
        subTitle: '转赠',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              //
              if ($scope.data.memberId != null) {
                //e.preventDefault();
                CouponsDetailTwoService.donationCoupons($scope.data.memberId,id)
                  .success(function (response, status, header, config) {
                    console.log(response);
                    //$scope.name = response.data;
                    //console.log($scope.data);
                    if (response.success == true&&response.result!=false) {
                      console.log('success');
                      $ionicHistory.goBack();
                      //$scope.couponsForTransfer($scope.data.memberId, id);
                      $scope.data.messsage = response.data;
                    }else if(response.result==false) {
                      console.log('false');
                      PopupService.showAlert('提示',response.message,'');
                    }
                  });
              } else {
                $scope.data.memberId = '请输入会员id';
              }
            }
          }
        ]

      });

      //CouponsDetailTwoService.donationCoupons($scope.data.memberId,id)
      //  .success(function (response, status, header, config) {
      //    console.log(response);
      //    //$scope.name = response.data;
      //    //console.log($scope.data);
      //  });
    };
    $scope.init = function () {
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      console.log('init');
      console.log($scope.id);
      console.log($scope.userID);
      console.log($scope.type);
      console.log($scope.status);

      CouponsDetailTwoService.initData($scope.id, $scope.userID, $scope.type, $scope.couponId)
        .success(function (response, status, header, config) {
          console.log(response);
          $scope.data = response.data;
          //for(var key in $scope.data.cityNameMap){
          //  console.log('for循环');
          //  console.log(key+"--"+$scope.data.cityNameMap[key]);
          //}

          $scope.haveCity = false;
          $scope.haveArea = false;
          $scope.haveStreet = false;
          for (var keyOne in $scope.data.cityNameMap) {
            $scope.haveCity = true;
          }
          for (var keyTwo in $scope.data.areaNameMap) {
            $scope.haveArea = true;
          }
          for (var keyThree in $scope.data.streetNameMap) {
            $scope.haveStreet = true;
          }

          console.log($scope.data)
        });

    };
    $scope.getCouponSuccess ='';
    //点击领取
    $scope.getCoupon = false;//已点为true
    $scope.getCoupons = function () {
      console.log('领取优惠券');
      CouponsDetailTwoService.receiveCoupons($scope.data.coupon.id)
        .success(function (response, status, header, config) {
          console.log(response);
          $scope.getCouponSuccess = response.data;
          $scope.getCoupon = !$scope.getCoupon;
        });

      $timeout(function () {
        $scope.getCouponSuccess = '';
      }, 5000);

      $scope.share = function(){
        if(window.umeng){
          var title = '顺逛领领券频道,优惠券等您来抢',
            content = '给您推荐顺逛领券频道,超值优惠券每日限量抢,不可错过哦!',
            pic = UrlService.getSharePicHeader()+'mstatic/wd/v2/img/sg.png',
            url = UrlService.getShareLinkHeader()+'mstore/sg/coupon/toList.html?id='+ $scope.id + "&type=" + 0 + "&storeId=" +  UserService.getUser().mid + "&lastUrl=4";
          //关于  UserService.getUser().mid ,没加非空判断的解释 ，因为只有app才能分享，app 必须要登录，登录后serService.getUser()一定存在
          window.umeng.share(title,content,pic,url,0);
        }
      };

    }
  }]);


APP.service('CouponsDetailTwoService', ['$http', 'UrlService', function ($http, UrlService) {
  /**
   * 转赠优惠券
   * @param memberId  转赠用户的id
   * @param id  优惠券的id
   * @returns {*}
   */
  this.donationCoupons = function (memberId, id) {
    var params = {
      memberId: memberId,
      id: id
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COUPONS_DONATION'),
      params: params
    });
  };
  /**
   * 获取转赠人用户名
   * @param memberId  转赠用户的id
   * @returns {*}
   */
  this.getMemberName = function (memberId) {
    var params = {
      id: memberId
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COUPONS_GET_MENBERID'),
      params: params
    });
  };
  this.initData = function (id, storeId, type ,couponId) {
    var params = {
      'id': id,
      'storeId': storeId,
      'type': type,
      'lastUrl': '',
      'mId':couponId
    };
    return $http.get(UrlService.getUrl('GET_COUPONS_DETAIL'), params);
  };
  this.receiveCoupons = function (couponId) {
    var params = {
      couponId: couponId
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('RECEIVE_COUPONS'),
      params: params
    });
  };
}]);
