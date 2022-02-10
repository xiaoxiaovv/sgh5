/**
 * Created by lenovo on 2017-6-28.
 */

                       // 即将结束
APP.controller('crowdfunding_child_end_control', ['$scope', 'CrowdFundingServer_end', '$timeout','UserService','GoodsService','CommonAddressService',
  function ($scope, CrowdFundingServer, $timeout,UserService,GoodsService,CommonAddressService) {

   /* $scope.init=function () {
      CrowdFundingServer.bannerList().success(function (response) {
        // console.log(response)
        // 图片轮播
        $scope.HomeBanner=response.data.zBannerList;
        // console.log($scope.HomeBanner)
        // 人气列表
        $scope.activityList=response.data.top3ZActivity;
        console.log($scope.activityList)
        //上拉加载
        $scope.list=0;
        $scope.loadMore=function () {
          console.log('123')
        }
        //点击切换
        $scope.selectTab = function (index) {
          GoodsService.changeSuccess(typeList[index])
            .success(function (response, status, headers, config) {
              if (response.success == true) {
                GoodsService.getFilterData()
                  .success(function (response) {
                    if (response.success) {
                      $scope.brandList = response.data.brandList;
                      if (response.data.filterMap != undefined) {
                        $scope.otherList = response.data.filterMap.lstAttributes;
                        $scope.resetFilter();
                      } else {
                        $scope.otherList = [];
                        $scope.resetFilter();
                      }
                    }
                  });
                $scope.page = 1;
                $scope.selectedIndex = index;
              }
            });
        };
      })
    }
    $scope.init();*/

  }])

APP.service('CrowdFundingServer_end', ['$http', 'UrlService', function ($http, UrlService) {
  // 图片轮播
 /* this.bannerList=function () {
    // return $http.get(UrlService.getUrl('TEST_API'))
    return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/index')
  }*/


}])

