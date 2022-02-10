APP.controller('yongjinDetailController', ['$scope', '$stateParams', 'UrlService','yongjinDetailService','$ionicPopup',
  function ($scope, $stateParams, Urlservice,yongjinDetailService,$ionicPopup) {
  	$scope.title = $stateParams.title;
  	$scope.type = $stateParams.code;
  	$scope.earningType = $stateParams.earningType;
  	$scope.rewardStart = $stateParams.start;
  	$scope.rewardEnd = $stateParams.end;
  	$scope.hasMoreData = false;
  	$scope.tanKdetail = {};
  	var rewardType = '',
      page = 0,
      pageSize = 10;
    var myPopup,myPopupOther;
      $scope.loadData = function(earningType, type, rewardType, page, pageSize,start,end){
      	yongjinDetailService.getRevenueList(earningType, type, rewardType, page, pageSize,start,end).success(function(response){
      		console.log(response)
      		if (response.data.list) {
              if (page == 0) {
                $scope.revenueList = response.data.list;
              } else {
                $scope.revenueList = $scope.revenueList.concat(response.data.list);
              }
              $scope.hasMoreData = (response.data.list.length == pageSize);
              $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              $scope.hasMoreData = false;
            }
  	});
      }
      $scope.loadMore = function () {
      page = page + 1;
      $scope.loadData($scope.earningType, $scope.type, rewardType, page, pageSize,$scope.rewardStart,$scope.rewardEnd);
    };
    $scope.lookDetail = function(item){
    	$scope.tanKdetail = item;
    	if($scope.type==1){
    		myPopup = $ionicPopup.show({
    					  cssClass:'xvv-popup',
                          template: '<div class="xvv-yongjin"><div>佣金详情</div><div>{{tanKdetail.createTime}}创建</div><p class="radiubox"><i></i><span></span><span></span></p><div><p>类型</p><p>状态</p><p>商品数量</p><p>金额</p><p>提成</p><p>收益</p></div><div><p>{{tanKdetail.rewardTypeStr}}</p><p>{{tanKdetail.nodeStateStr}}&nbsp</p><p>{{tanKdetail.productCount}}件</p><p>{{tanKdetail.netActualPrice|currency:"&yen"}}</p><p>{{(tanKdetail.brokeragePersent|currency:"&yen").replace("¥","")}}%</p><p>{{tanKdetail.brokerageDeductAmount|currency:"&yen"}}</p></div><div style="clear: both"></div><div ng-click="closeDetail()">确定</div></div>',
                          scope: $scope
                          
                        })
    	}else{
    		myPopupOther = $ionicPopup.show({
    					  cssClass:'xvv-popup',
                          template: '<div class="xvv-yongjin2"><div>佣金详情</div><div>{{tanKdetail.createTime}}创建</div><p class="radiubox"><i></i><span></span><span></span></p><div><div style="width:3.68rem;"><p>状态</p><p>商品数量</p><p>金额</p><p>提成</p><p>收益</p><p ng-if="tanKdetail.sgDeductionDetails&&(tanKdetail.sgDeductionDetails.length>0)">抵扣金额</p></div><div><p>{{tanKdetail.nodeStateStr}}&nbsp</p><p>{{tanKdetail.productCount}}件</p><p>{{tanKdetail.netActualPrice|currency:"&yen"}}</p><p>{{(tanKdetail.brokeragePersent|currency:"&yen").replace("¥","")}}%</p><p>{{tanKdetail.brokerageDeductAmount|currency:"&yen"}}</p><p ng-if="tanKdetail.sgDeductionDetails&&(tanKdetail.sgDeductionDetails.length>0)">{{tanKdetail.deductionAmount|currency:"&yen"}}</p></div><div style="clear: both"></div><div class="xvv-yongjinother" ng-repeat="i in tanKdetail.sgDeductionDetails"><div style="color:#7A87A3"><p>抵扣单号<span>{{i.reverseNetSn}}</span></p><p>抵扣类型<span>{{i.deductibleType}}</span></p><p>此单抵扣<span>{{i.deductibleAmount|currency:"&yen"}}</span></p></div></div></div><div ng-click="closeDetail()">确定</div></div>',
                          scope: $scope 
                        })
    	}
    }
    $scope.closeDetail = function(){
    	if($scope.type==1){
    		myPopup.close();
    	}else{
    		myPopupOther.close();
    	}
    	
    	
    }
      $scope.init = function (){
      	$scope.loadData($scope.earningType, $scope.type, rewardType, page, pageSize,$scope.rewardStart,$scope.rewardEnd);
      }
      $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    });
  	$scope.goBack=function(){
  		$scope.$ionicGoBack();
  	}
  }]);



APP.service('yongjinDetailService', ['$http', 'UrlService', function ($http, UrlService) {
  	this.getRevenueList = function (earningType, type, rewardType, page, pageSize,start,end) {
    var params = {
      earningType: earningType,
      type: type,
      rewardType: rewardType,
      page: page,
      pageSize: pageSize,
      beginDate:start,
      endDate:end
    };
    return $http.get(UrlService.getUrl('REVENUE_LIST'), params);
  };
}]);