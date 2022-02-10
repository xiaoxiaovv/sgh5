/**
 * Created by lenovo on 2017-6-28.
 */
                // 最新上线
APP.controller('crowdfunding_child_new_control', ['$state','$scope', 'CrowdFundingServer_new', '$timeout','UserService','GoodsService','CommonAddressService',
  function ($state,$scope, CrowdFundingServer, $timeout,UserService,GoodsService,CommonAddressService) {

    // $scope.init=function () {
    //   CrowdFundingServer.list().success(function (response) {
    //     // 最新上线
    //     $scope.activityList=response.data.zActivitylist;
    //     console.log($scope.activityList)
    //     $scope.selectTab = function (index) {
    //       GoodsService.changeSuccess(typeList[index])
    //         .success(function (response, status, headers, config) {
    //           if (response.success == true) {
    //             GoodsService.getFilterData()
    //               .success(function (response) {
    //                 if (response.success) {
    //                   $scope.brandList = response.data.brandList;
    //                   if (response.data.filterMap != undefined) {
    //                     $scope.otherList = response.data.filterMap.lstAttributes;
    //                     $scope.resetFilter();
    //                   } else {
    //                     $scope.otherList = [];
    //                     $scope.resetFilter();
    //                   }
    //                 }
    //               });
    //             $scope.page = 1;
    //             $scope.selectedIndex = index;
    //           }
    //         });
    //     };
    //   })
    // }
    // // 调用
    // $scope.init();

    $scope.goDetails=function () {
        console.log('11')
      //用$stateParams
       $state.go('crowd_funding_details')
    }

  }])

APP.service('CrowdFundingServer_new', ['$http', 'UrlService', function ($http, UrlService) {
  //  最新上线 请求
 //  this.list=function () {
 //    // return $http.get(UrlService.getUrl('TEST_API'))
 // //   return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/indexZActivitys')
 //  }


}])

