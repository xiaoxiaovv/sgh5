APP.controller('familydetailController', ['$scope','$stateParams','$sce',
  function ($scope,$stateParams,$sce) {
    $scope.detailUrl = $sce.trustAsResourceUrl($stateParams.detailUrl);
    $scope.title = $stateParams.title;
    $scope.goBack = function(){
    	$("#iframecontainer").remove();
    	$scope.$ionicGoBack();
    } 
   } 
]);