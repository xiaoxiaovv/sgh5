APP.controller('zhcjController', ['$q','$cookies','$stateParams', '$scope', '$rootScope', 'UrlService', 'UserService', '$state', '$http','zhcjService', '$timeout', '$localstorage', 'PopupService', 'GoodsService', '$ionicScrollDelegate','ProductDetailService','CommonAddressService','CartService','$ionicHistory','PersonalCenterService',function($q,$cookies,$stateParams, $scope, $rootScope, UrlService, UserService, $state, $http,zhcjService, $timeout, $localstorage, PopupService, GoodsService, $ionicScrollDelegate,ProductDetailService,CommonAddressService,CartService,$ionicHistory,PersonalCenterService) {
	var confirmPopup;//弹窗定义
  $scope.solutionId = $stateParams.solutionId;//从路由获取
  $scope.soluDetail = {};//方案描述数据
  $scope.productIds = '';//商品列表id
  $scope.productList =[];//商品数据
  $scope.productTotalprice = 0;//清单商品总价
  $scope.selectnumber = 0;//已选数量
  $scope.selectprice = 0;//已选商品总价
  $scope.selectcommsion = 0;//已选商品总佣金
  $scope.index = 0;
  $scope.showfiltermodel = false;
  $scope.showzhezhao = false;
  $scope.showcjjsmodel = false;
  $scope.showprodetailmodel = false;
  $scope.prointion = {};
  $scope.printstyle = {};
  $scope.all = {
      isAllChecked:true//全选标识
    };
  //结算所需参数对象json定义
  $scope.orderInitParams = null;
  //位置信息
  $scope.pid = 0;
  $scope.cid = 0;
  $scope.aid = 0;
  $scope.goback = function() {
    $state.go('newHome');
  };
  $scope.openFilterModal = function () {
    $scope.showfiltermodel = true;
    $scope.showzhezhao = true;
    if(ionic.Platform.platform().indexOf('ios') != -1){
      $scope.prostyle = {
        'overflow':'hidden'
      }
      var beforeY ,top=0;
      $('#zijihuadong_'+$scope.solutionId).on('touchmove',function(event){
        var afterY = event.changedTouches[0].pageX;
       if(beforeY>afterY){
        if(top>=0){
        }else{
          top+=10;
          $('#wohuadong_'+$scope.solutionId).css('top',top+'px');
        } 
       }
       if(beforeY<afterY){     
        if((-top)>=( $('#wohuadong_'+$scope.solutionId).width()-$('#zijihuadong_'+$scope.solutionId).width())){
        }else{
          top-=10;
           $('#wohuadong_'+$scope.solutionId).css('top',top+'px');
        } 
       }
        beforeY = event.changedTouches[0].pageX;

      })
    }else{
      $scope.prostyle = {
        'overflow':'auto'
      }
    }  
   };
   $scope.openjieshaoModal = function () {
        $scope.showzhezhao = true;
        $scope.showcjjsmodel = true;
   };
   $scope.openpromodel = function (proid) {
      $scope.showzhezhao = true;
      $scope.showprodetailmodel = true;
      for(var i = 0;i<$scope.productList.length;i++){
        if($scope.productList[i].id==proid){
          $scope.prointion = $scope.productList[i];
        }
      }
   }
   $scope.closezhezhao = function(){
      $scope.showzhezhao = false;
        if($scope.showfiltermodel == true){
          $scope.showfiltermodel = false;
        }
        if($scope.showcjjsmodel == true){
          $scope.showcjjsmodel = false;
        }
        if($scope.showprodetailmodel == true){
          $scope.showprodetailmodel = false;
        }
   } 
    $scope.init = function(){
     
      var width = document.documentElement.clientWidth;
      var height =  document.documentElement.clientHeight;
      $scope.clientHeight = width;
      $scope.clientWidth = height;
       $scope.printstyle = {
        'height':width+'px',
        'width':height+'px',
        'top':(height-width)/2+'px',
        'left':0-(height-width)/2+'px',
        'transform':'rotate(90deg)',
        'transform-origin':'50% 50%'
       }
    var evt = "onorientationchange" in window ? "orientationchange" : "resize";    
    window.addEventListener(evt, function() {
        console.log(evt);
        var width = document.documentElement.clientWidth;
         var height =  document.documentElement.clientHeight;
         if( width > height ){
          $scope.clientHeight = height;
          $scope.clientWidth = width;
            $scope.printstyle = {
              'height':height+'px',
              'width':width+'px',
              'top':0,
              'left':0,
              'transform':'none',
              'transform-origin':'50% 50%'
            }
         }
         else{
          $scope.clientHeight = width;
          $scope.clientWidth = height;
            $scope.printstyle = {
              'height':width+'px',
              'width':height+'px',
              'top':(height-width)/2+'px',
              'left':0-(height-width)/2+'px',
              'transform':'rotate(90deg)',
              'transform-origin':'50% 50%'
          }
         }
        
    }, false);
      //店铺id
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      //数据
      if($scope.storeId!=20219251&&$scope.storeId!=''){
          $scope.isLogin = true;
      }else{
          $scope.isLogin = false;
      }
      $scope.index = 0;
      $scope.showfiltermodel = false;
      $scope.showzhezhao = false;
      $scope.showcjjsmodel = false;
      $scope.showprodetailmodel = false;
      $scope.zhimgUrl = '';
      $scope.zhintroduction = '';
      zhcjService.soluteDetail($scope.solutionId).success(function(res){
        console.log('主',res);
        if(res.success&&res.data){
          $scope.soluDetail = res.data[0].spaces;
          $scope.zhimgUrl = $scope.soluDetail[0].imageUrl;
          $scope.zhintroduction = $scope.soluDetail[0].introduction;
        getdatas($scope.soluDetail[0].id)//$scope.soluDetail[0].id
        }else{

        } 
      });
    }
    //加载数据
    function getdatas(id){
      zhcjService.soluteproduct(id).success(function(reus){
          console.log('坐标，ids',reus);
          $scope.tablabels = reus.data.labels;
          $scope.productIds = reus.data.productsIds;
          zhcjService.productList($scope.productIds,$scope.streetId,$scope.storeId,$scope.cid,$scope.pid,$scope.aid).success(function(response){
          console.log('商品',response);
          console.log($scope.streetId,$scope.cid,$scope.pid,$scope.aid);
          $scope.productList = response.data;
          //清单商品总价
          for(var i = 0;i<$scope.productList.length;i++){
            $scope.productTotalprice+=$scope.productList[i].price;
            $scope.selectcommsion+=$scope.productList[i].commission;
            $scope.productList[i].checked = true;
          }
          //商品默认全选
          $scope.selectnumber = $scope.productList.length;
          $scope.selectprice = $scope.productTotalprice;
          $scope.all.isAllChecked = true;
        });
        });
    }
    // 选择标签
    $scope.chooseTab = function (index,item) {
      $scope.index = index;
      $scope.zhimgUrl = item.imageUrl;
      $scope.zhintroduction = item.introduction;
      $scope.productTotalprice = 0;//清单商品总价
      $scope.selectnumber = 0;//已选数量
      $scope.selectprice = 0;//已选商品总价
      $scope.selectcommsion = 0;//已选商品总佣金
      getdatas(item.id);
    }
    //选择商品
    $scope.select = function(item){
      $scope.selectprice = 0;
      $scope.selectnumber = 0;
      $scope.selectcommsion = 0;
       for(var i = 0;i<$scope.productList.length;i++){
            if($scope.productList[i].checked == true){
              $scope.all.isAllChecked = true;
            }else{
              $scope.all.isAllChecked = false;
              break;
            }
          }
         for(var j = 0;j<$scope.productList.length;j++) {
          if($scope.productList[j].checked == true){
            $scope.selectprice += $scope.productList[j].price;
            $scope.selectnumber++;
            $scope.selectcommsion+=$scope.productList[j].commission;
          }
         }
    }
    //全选
    $scope.selectall = function(){
        if($scope.all.isAllChecked){
          $scope.selectnumber = $scope.productList.length;
          $scope.selectprice = $scope.productTotalprice;
          for(var i = 0;i<$scope.productList.length;i++){
            $scope.productList[i].checked = true;
            $scope.selectcommsion+=$scope.productList[i].commission;
          }
        }else{
          $scope.selectnumber = 0;
          $scope.selectprice = 0;
          $scope.selectcommsion = 0;
          for(var i = 0;i<$scope.productList.length;i++){
            $scope.productList[i].checked = false;
          }
        }
        
    }
    $scope.placeorder = function () {
      if (!UserService.getUser().mid) {
         $state.go('login');
          return;
         }
      var proList = [];
      for(var i = 0;i<$scope.productList.length;i++){
        if($scope.productList[i].checked){
          proList.push({
            'proId':$scope.productList[i].id,
            'num':1
          })
        }
      }
      $scope.orderInitParams = {
            "proList": proList,
            "street": $scope.streetId
      }
      CartService.settlement($scope.orderInitParams)
                .success(function (response, status, headers, config) {
                  if(response.success == false){
                    PopupService.showToast(response.message);
                  }else{
                    if (response.success == true && response.data != null) {
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.put('is_book', '', {expires: expireDate, path: '/'});
                    $state.go('orderConfirm',{orderInitParams: JSON.stringify($scope.orderInitParams)});
                  } else {
                    PopupService.showToast('结算失败');
                  }
                }
              });
    }
  
    $scope.goBack = function(){
      $state.go('newHome');
    }
  
function getAddress() {
      var deferred = $q.defer();
      GoodsService.getAddress()
        .success(function (res) {
          if (res.data == null) {
            var addressMessage = CommonAddressService.getAddressInfo();
            if (addressMessage) {
              $scope.pid = addressMessage.provinceId;
              $scope.cid = addressMessage.cityId;
              $scope.aid = addressMessage.areaId;
              $scope.streetId = addressMessage.streetId;
              deferred.resolve(addressMessage);
            } else {
              var obj = {
                provinceId: '16',
                cityId: '173',
                areaId: '2450',
                streetId: '12036596'
              }
              deferred.resolve(obj);
            }
          } else {
            var obj = eval(res.data);
            var regionIndex = obj[0].regionName.indexOf('/');
            $scope.region = obj[0].regionName.substr(0, regionIndex);
            deferred.resolve(obj[0]);
          }
        })
      return deferred.promise;
    }
    
    $scope.$on('$ionicView.beforeEnter', function (e,v){
      if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
          window.emc.configDeviceDriection('1');
      }
      if (v.direction == 'back'){
        var frontView = $ionicHistory.viewHistory().forwardView.stateName;
        if(frontView=='login'){
          $scope.productTotalprice = 0;
      $scope.selectnumber = 0;//已选数量
      $scope.selectprice = 0;//已选商品总价
      $scope.selectcommsion = 0;//已选商品总佣金
      getAddress()
        .then(function (res) {
          console.log(res);
          $scope.pid = res.provinceId;
          $scope.cid = res.cityId;
          $scope.aid = res.areaId;
          $scope.streetId = res.streetId;
        
        }) 
           $scope.init();
        };
    }else{
      $scope.productTotalprice = 0;
      $scope.selectnumber = 0;//已选数量
      $scope.selectprice = 0;//已选商品总价
      $scope.selectcommsion = 0;//已选商品总佣金
      getAddress()
        .then(function (res) {
          console.log(res);
          $scope.pid = res.provinceId;
          $scope.cid = res.cityId;
          $scope.aid = res.areaId;
          $scope.streetId = res.streetId;
        
        })    
           $scope.init();
    }  
    });
    $scope.$on('$ionicView.beforeLeave', function() {
          if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
          window.emc.configDeviceDriection('2');
      }
      });
}]);
APP.service('zhcjService', ['$http', 'UrlService', function($http, UrlService) {
  this.soluteDetail = function (id) {
    var params = {
      channel:1,
      scenesId:id
    }
    return $http.get(UrlService.getNewUrl('SMART_SCENES'),params);
  }
  this.soluteproduct = function (id) {
    var params = {
      spaceId:id
    }
    return $http.get(UrlService.getNewUrl('SMART_SPACE'),params);
  }
  this.productList = function (ids,streetId,memberId,cityId,provinceId,regionId) {
    var  params = {
      productsIds:ids,
      streetId:streetId,
      memberId:memberId,
      cityId:cityId,
      provinceId:provinceId,
      regionId:regionId
    }
    return $http.get(UrlService.getNewUrl('ITSOLU_PRODUCTLIST'),params);
  }
}]);
