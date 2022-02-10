/**
 * Created by 11140921040349 on 2016/4/11.
 */
APP.controller('MyCouponsListController', ['$scope', '$rootScope', '$stateParams', 'CommonLocationService','GoodsService' ,  '$state', 'AreaService', '$timeout', 'MyCouponsListService', '$ionicPopup', 'PopupService', 'CacheService', 'UserService', '$ionicScrollDelegate','$ionicModal','$http','$ionicHistory',
    function ($scope, $rootScope, $stateParams, CommonLocationService, GoodsService, $state, AreaService, $timeout, MyCouponsListService, $ionicPopup, PopupService, CacheService, UserService, $ionicScrollDelegate,$ionicModal,$http,$ionicHistory) {
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
        $scope.paddingtopClass = {
          "margin-top": "16px"
        };
        $scope.paddingtopClasscontent = {
          "top": "60px"
        };
        $scope.typeClass = {
          "top": "59px"
        }
      }else{
        $scope.paddingtopClass = {
          "margin-top": "0px"
        };
        $scope.paddingtopClasscontent = {
          "top": "44px"
        };
        $scope.typeClass = {
          "top": "43px"
        }
      }
      $scope.typeDefault = 0;
        //样式蓝色or红色
     $scope.backGroundBlue = {
       "background":"url("+$rootScope.imgBaseURL+"img/couponblue.png) no-repeat",
       "background-size": "100% 118px"
     }
     $scope.backGroundRed = {
       "background":"url("+$rootScope.imgBaseURL+"img/coupon.png) no-repeat",
       "background-size": "100% 118px"
     }
     $scope.noTypeStyle = {
       "color": "rgba(102,102,102,0.87)"
     }
     $scope.isTypeStyle = {
       "border-bottom":"3px solid #2979FF",
       "color": "#2979FF"
     }
     $scope.toDetail = function (id, couponId) {
          var userID = UserService.getUser().mid;//获取用户id
          //var UId = userID.mid;
          var type = 0;
          $state.go('couponsDetailTwo', {
              cId: id,
              userID: userID,
              type: type,
              status: $scope.status,
              couponId: couponId
          });
      };
     //类别点击方法
     $scope.typeButton = function(typeIndex){
       $scope.typeDefault = typeIndex;
     }
     $scope.typeThreeData = ['未使用','已使用','即将过期']
       $scope.divStr = [];
        // 排列div
       function cricles(){
         for(var i=0; i<window.screen.availWidth/12; i++){
             $scope.divStr[i]=i*12+4;
           }
         }
        $scope.goBack = function() {
          $ionicHistory.goBack();
        }
        $scope.province = null;
        $scope.city = null;
        $scope.area = null;
        $scope.provinceId = '';
        $scope.cityId = '';
        $scope.areaId = '';
        $scope.streetId = '';
        $scope.status = 1;

        $scope.$on('$ionicView.beforeEnter', function (e, v) {
            cricles();
            if (v.direction == 'back') {
              if($rootScope.couponXyzType){
                $scope.status = 1;
                $scope.init();
              }
              $rootScope.couponXyzType = false;
              return;
            }else{
              $scope.status = 1;
              $scope.init();
            }
        });

        $scope.init = function () {
            MyCouponsListService.getMyCouponsList($scope.status, $scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId)
                .success(function (response, status, header, config) {
                  if(response.success){
                    $scope.data = response.data;
                    $ionicScrollDelegate.resize();
                  }else{
                    PopupService.showToast(response.message);
                  }
                });
        };

        $scope.getCouponsSta = function (status,type) {
            $scope.data = '';
            $scope.status = status;
            if(type==0&&$scope.status==3){
              $scope.status = 4;
              MyCouponsListService.doGetNewCouponsLate(100,1,1)
                  .success(function (response, status, header, config) {
                    if(response.success){
                      $scope.data = response.data;
                      $ionicScrollDelegate.resize();
                    }else{
                      PopupService.showToast(response.message);
                    }
                  });
            }else{
              MyCouponsListService.getMyCouponsList($scope.status, $scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId)
              .success(function (response, status, header, config) {
                if(response.success){
                  $scope.data = response.data;
                  $ionicScrollDelegate.resize();
                }else{
                  PopupService.showToast(response.message);
                }
              });
            }
        };

        //点击转赠后弹出弹框
        $scope.donation = function (id) {
            $scope.data.memberId = null;
            $scope.data.messsage = null;
            $scope.findMember = true;
            var myPopup = $ionicPopup.show({
                template: '<div class="padding"><span class="text-align-c">请输入你要查找的会员ID</span> ' +
                '<div class="padding-top"><input class="border" style="height: 30px" type="text" ng-model="data.memberId" placeholder=""></div></div>' +
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
                                MyCouponsListService.getMemberName($scope.data.memberId)
                                    .success(function (response, status, header, config) {

                                        if (response.success == true) {
                                            $scope.findMember = true;
                                            myPopup.close();
                                            $scope.couponsForTransfer($scope.data.memberId, id);
                                            $scope.data.messsage = response.data;
                                        } else {
                                            $scope.findMember = false;
                                            $scope.data.messsage = response.message;
                                        }

                                    });
                            } else {
                                $scope.data.memberId = '请输入会员id';

                            }
                        }
                    }
                ]

            });
        };
        $scope.couponsForTransfer = function (memberId, id) {
            var myPopup2 = $ionicPopup.show({
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
                            if ($scope.data.memberId != null) {
                                MyCouponsListService.donationCoupons($scope.data.memberId, id)
                                    .success(function (response, status, header, config) {
                                        if (response.success == true && response.result != false) {
                                            $scope.getCouponSuccess = response.message;
                                            $timeout(function () {
                                                $scope.getCouponSuccess = '';
                                            }, 1000);
                                            $scope.data.messsage = response.data;
                                            $scope.init();
                                            $ionicScrollDelegate.resize();

                                        } else if (response.result == false) {
                                            PopupService.showAlert('提示', response.message, '');
                                        }
                                    });
                            } else {
                                $scope.data.memberId = '请输入会员id';
                            }
                        }
                    }
                ]

            });

        };
        $scope.goCouponCenter = function () {
            $state.go('getCouponsList');
        };

    }]);

APP.service('MyCouponsListService', ['$http', 'UrlService', function ($http, UrlService) {
    /**
     * 获取我的优惠券列表
     * @param status
     * @param provinceId 省id
     * @param cityId  市id
     * @param areaId 区id
     * @returns {*}
     */
    this.getMyCouponsList = function (status, provinceId, cityId, areaId, streetId) {
        var params = {
            status: status,
            provinceId: provinceId ? provinceId : '',
            cityId: cityId ? cityId : '',
            areaId: areaId ? areaId : '',
            streetId: streetId ? streetId : '',
            startIndex: 1,
            pageSize: 100
        };
        return $http({
            method: 'POST',
            url: UrlService.getUrl('MY_COUPONS_LIST'),
            params: params
        });
    };
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

    //优惠券领取
    this.doGetNewCouponsLate = function (pageSize,startIndex,status) {
      var params = {
        pageSize: pageSize,
        startIndex:startIndex,
        status:status
      };
      return $http.get(UrlService.getUrl('MY_COUPONS_LIST_LATE'), params);
    };

}]);
