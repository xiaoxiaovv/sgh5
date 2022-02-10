APP.controller('payResultSuccessController', ['$scope','$stateParams','CirclePageService','$localstorage','SeeMoreService','UrlService',
  function ($scope, $stateParams,CirclePageService,$localstorage,SeeMoreService,UrlService) {
    $scope.$on('$ionicView.beforeEnter', function () {
        CirclePageService.getCircleLink('','','3')
            .success(function(res){
              if(res.success){
                $scope.circleUrl=res.data;
              }

        })
    });

    // 社群争霸赛添加跳转
    $scope.babyonerace = function() {

      window.location.href = UrlService.getThirdUrl('race/');
    
    }
   
  }]);
