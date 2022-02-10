/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/4/12
 * describe：店铺申请Controller
 **/

APP.controller('ShopApplyController', ['$scope', '$rootScope', '$state', 'ShopApplyService', 'MyStoreService','GoodsService', 'CommonAddressService', 'PopupService', 'LoginService',
  'UserService', 'ShopService','$stateParams','$ionicLoading','$timeout','$ionicPopup', '$ionicScrollDelegate', '$ionicModal', '$http',
  function ($scope, $rootScope, $state, ShopApplyService,MyStoreService,GoodsService,CommonAddressService, PopupService, LoginService, UserService, ShopService,$stateParams,$ionicLoading,$timeout,$ionicPopup,$ionicScrollDelegate,$ionicModal,$http) {

    /** 变量声明 **/
    $scope.addressName = '';//地区名称
    $scope.goToAddress = false;//判断是否进入到地区列表
    $scope.categoryData = [];//联盟分类数据
    $scope.selectText = '';//联盟分类选择文本
    $scope.selectKey = '';//联盟分类选择Key

    //地址选择框高度
    var screenHeight=window.innerHeight;
    var topHeight=250+123;
    var contentHeight=screenHeight-topHeight+'px';
    $scope.contentHeight = {
      'height':contentHeight
    }
    /** 地址变量声明 **/
    $scope.addressTitle = '配送至';
    $scope.dataAdd = null;
    $scope.flag = 'SHOP_APPLY_ADDRESS';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {};//自动定位地址信息
    var areaValue;
    var areaValueCity;

    //店铺申请所需信息
    $scope.applyInfo = {
      ownerName: '',
      address: '',
      promotionCode: '',
      storeName: '',
      hrCode: ''
    };
    //memberID
    $scope.mid = UserService.getUser().mid;
    $scope.promotionCode = $stateParams.promotionCode;
    /** 方法 **/
    $scope.init = function () {
      $scope.showAlert = false;
      //所在地区
      if (!$scope.goToAddress) {
        $scope.addressName = '';
      }
      else {
        $scope.addressName = $scope.textOne + $scope.textTwo + $scope.textThree +$scope.textFour;
      }
      //联盟分类
      $scope.selectText = $scope.textUnion;
      $scope.selectValue = $scope.valueUnion;
      //memberID
      $scope.mid = UserService.getUser().mid;
      if($stateParams.promotionCode){
        $scope.applyInfo.promotionCode = $stateParams.promotionCode;
      }
      //获取小店信息
      if( !$scope.mid){
        //本地缓存没有 登录 不发获得用户名的请求
        return;
      }
      ShopService.getStoreInfo($scope.mid)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.storeCode = response.data.storeCode;
            $scope.storeType = response.data.storeType
          }
        });
    };
    //地址窗口
    $scope.addressTop = function(){
      $scope.addressTipFlag=false;
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1,-1];
      $scope.provinceDis=false;
      $scope.cityDis=false;
      $scope.areaDis=false;
      $scope.addressModal.show();
      $scope.dataAdd=null;
      $scope.defaultValue=null;
      $scope.selectProvince='';
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'SHOP_APPLY_ADDRESS',0);
    }
    //地址初始化
    $scope.addressInit = function (defaultValue,data,flag,level) {
      $scope.addressTipFlag=false;
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      $scope.addressTitle = '配送至';
      if (defaultValue) {
        $scope.defaultValue = JSON.parse(defaultValue);
      } else {
        $scope.defaultValue = {};
      }
      $scope.level = level;
      if (data) {
        $scope.dataAdd = JSON.parse(data);
        $scope.nowLevel=$scope.level;
        $scope.nowLevel=$scope.nowLevel*(-1);
       console.log($scope.nowLevelIndex);
       for(var i=0;i<$scope.nowLevelIndex.length;i++){
        if(i>$scope.nowLevel){
          $scope.nowLevelIndex[i]=-1;
        }
      }
      } else {
        $scope.finish=false;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        GoodsService.getLocationList('',0).success(function (response) {
           $scope.dataAdd = response.data;
           $scope.addressTipFlag=false;
           $scope.finish=true;
           $scope.nowLevel=$scope.level;
           $scope.nowLevel=$scope.nowLevel*(-1);
           var defaultValueFy=JSON.stringify($scope.defaultValue);
           var dataAddFy=JSON.stringify($scope.dataAdd);
//         $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
           console.log($scope.nowLevel);
	       for(var i=0;i<$scope.nowLevelIndex.length;i++){
	        if(i>$scope.nowLevel){
	          $scope.nowLevelIndex[i]=-1;
	        }
	       }
           console.log($scope.nowLevel);
         })
        .error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        })
      }
    }
    //重新选择的下边框
    $scope.bottomBorder = {
      'border-bottom':"2px solid red"
    }
    $scope.provinceFlag=false;
    $scope.cityFlag=false;
    $scope.areaFlag=false;
    $scope.selectFlag=true;
    $scope.provinceDis=false;
    $scope.cityDis=false;
    $scope.areaDis=false;
    //返回重新选择省
    $scope.provinceSel = function(){
      $scope.addressInit(null,null,'SHOP_APPLY_ADDRESS',0);
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.provinceFlag=true;
      $scope.selectFlag=false;
      $scope.provinceDis=true;
      $scope.cityDis=false;
      $scope.areaDis=false;
    }
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index,item) {
      for(var i=0;i<$scope.nowLevelIndex.length;i++){
        if(i>$scope.nowLevel){
          $scope.nowLevelIndex[i]=-1;
        }
      }
      $scope.dataAdd="";
      $scope.nowLevelIndex[$scope.nowLevel]=index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) {//xyz修改2级本地获取
        console.log($scope.level);
        if($scope.level == -1){//省
           $scope.selectProvince = item.text;
           $scope.provinceIndex=index;
           $scope.provinceFlag=false;
           $scope.selectFlag=true;
           $scope.provinceDis=true;
           $scope.provinceTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
           $scope.nowLevel=$scope.level;
           $scope.nowLevel=$scope.nowLevel*(-1);
           console.log($scope.nowLevel);
        }else{
//          $scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value,ah).success(function (response) {
          if(ah==1){
            areaValueCity=item.value;
          }
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选市
        $scope.citySel = function(){
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
		      $scope.level= $scope.levelArea;
      	  GoodsService.getLocationList(areaValueCity,1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,-1);
              $scope.selectArea='';
              $scope.cityFlag=true;
              $scope.selectFlag=false;
              $scope.provinceDis=true;
              $scope.cityDis=true;
              $scope.areaDis=false;
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.cityTop);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      }else if ($scope.level > -4) {//xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
        if($scope.level == -3){
          $scope.selectArea= item.text;
          $scope.cityFlag=false;
          $scope.areaFlag=false;
          $scope.selectFlag=true;
          $scope.provinceDis=true;
          $scope.cityDis=true;
          $scope.areaDis=true;
          $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }else{
          $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        MyStoreService.getLocationList(item.value,ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if(ah==2){
          areaValue=item.value;
        }
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选区
        $scope.areaSel = function(){
            $scope.addressTip='正在获取地址信息...';
            $scope.addressTipFlag=true;
            $scope.dataAdd="";
            $scope.level= $scope.levelArea;
            MyStoreService.getLocationList(areaValue,2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            console.log($scope.dataAdd);
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.areaTop);
            $scope.areaFlag=true;
            $scope.selectFlag=false;
            $scope.provinceDis=true;
          $scope.cityDis=true;
          $scope.areaDis=true;
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
          }
    } else {
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
//      $scope.$ionicGoBack($scope.level);
        $scope.closeAddressModal();
      }
    }, 300);
    //自动定位
    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      MyStoreService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
        .success(function () {
          var autoAddress = {
            'text-1': addressMessage.provinceName,
            'text-2': addressMessage.cityName,
            'text-3': addressMessage.regionName,
            'text-4': addressMessage.streetName,
            'value-1': addressMessage.provinceId,
            'value-2': addressMessage.cityId,
            'value-3': addressMessage.areaId,
            'value-4': addressMessage.streetId
          };
          $rootScope.$broadcast($scope.flag, autoAddress);
          $scope.addressModal.hide();
        })
    };
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.addressModal.remove();
    });
    //添加地区
    $rootScope.$on('SHOP_APPLY_ADDRESS', function (event, data) {
      $scope.goToAddress = true;
      $scope.textOne = data['text-1'];
      $scope.textTwo = data['text-2'];
      $scope.textThree = data['text-3'];
      $scope.textFour = data['text-4'];
      $scope.adrProvinceId = data['value-1'];
      $scope.adrCityId = data['value-2'];
      $scope.adrAreaId = data['value-3'];
      $scope.adrStreetId = data['value-4'];
      $scope.addressName = $scope.textOne + $scope.textTwo + $scope.textThree +$scope.textFour;
    });
    //添加联盟分类
    $rootScope.$on('SHOP_APPLY_UNION', function (event, data) {
      $scope.textUnion = data['text'];
      $scope.valueUnion = data['value'];
    });
    //敏感词
    $scope.checkChange = function (obj,index) {
      ShopApplyService.checkText(obj)
        .success(function (response) {
          if (!response.data && obj != '') {
            if(response.errorCode != '-100'){//排除登录失效
              PopupService.showToast('请不要使用违禁词！');
            }
            if(index==1)
            {
              $scope.applyInfo.ownerName = '';
            }
            else
            {
              $scope.applyInfo.storeName = '';
            }
          }
        })
    };

    //申请开店
    $scope.shopApplySubmit = function () {
      if (!$scope.applyInfo.ownerName) {
        PopupService.showToast('店主姓名必须填写！');
        return;
      }else if (!$scope.applyInfo.address) {
        PopupService.showToast('详细地址必须填写！');
        return;
      }else if (!$scope.applyInfo.storeName) {
        PopupService.showToast('店铺名称必须填写！');
        return;
      }
      $scope.showAlert = false;
      if (!(/^[\u4E00-\u9FA50-9a-zA-Z!@#$%^&*\(\)\_+\-=\[\]{}|\\:;\"'\~`\?<>,. t]{1,20}$/.test($scope.applyInfo.ownerName))) {
        PopupService.showToast('店主姓名为1～20的常用字符！');
      } else if (!(/^[\u4E00-\u9FA50-9a-zA-Z!@#$%^&*\(\)\_+\-=\[\]{}|\\:;\"'\~`\?<>,. t]{2,50}$/.test($scope.applyInfo.address))) {
        PopupService.showToast('详细地址为2～50的常用字符！');
      } else if (!(/^[\u4E00-\u9FA50-9a-zA-Z!@#$%^&*\(\)\_+\-=\[\]{}|\\:;\"'\~`\?<>,. t]{1,20}$/.test($scope.applyInfo.storeName))) {
        PopupService.showToast('店铺名字为1～20的常用字符！');
      } else if (!(/^(HR|hr|Hr|hR).{6,18}$/.test($scope.applyInfo.hrCode)) && $scope.selectValue == '10') {
        //PopupService.showToast('上岗证号必须为HR开头，总长度8-20位！');
        $scope.showAlert = true;
      } else if ($scope.addressName.length == 0) {
        PopupService.showToast('请选择所在地区！');
      }  else if (!$scope.selectText) {
        PopupService.showToast('请选择联盟分类！');
      }  else {

        if ($scope.selectValue != '10') {
          $scope.showAlertCheck = false;
          $scope.showAlert = false;
          $scope.applyInfo.hrCode = '';
          ShopApplyService.applySubmit($scope.mid, $scope.applyInfo.storeName, $scope.applyInfo.ownerName, $scope.adrProvinceId, $scope.adrCityId, $scope.adrAreaId, $scope.adrStreetId, $scope.addressName, $scope.applyInfo.address, $scope.selectValue, $scope.selectText, $scope.applyInfo.promotionCode, false, $scope.storeCode, $scope.storeType, $scope.applyInfo.hrCode)
            .success(function (response) {
              console.log(response);
              if (response.success) {
                $scope.isBuyer = 1;
                LoginService.setRole($scope.isBuyer);
                $state.go('shopApplySuccess',{totalCommission:Math.round(response.data.totalCommission),memberCount:response.data.memberCount,memberRegionCount:response.data.memberRegionCount});
              }

              else if (response.errorCode = '-100') {
                //登录失效了
                $ionicLoading.show({template: '您尚未登录或登录失效,请先登录', duration: 3500});
                $state.go('login');
              }
              else {
                PopupService.showToast(response.message);
              }
            })
        }
        else {
          $scope.showAlertCheck = false;
          $scope.showAlert = false;
          ShopApplyService.check($scope.applyInfo.hrCode).success(function (response, status, headers, config) {
            console.log(response);
            if (response) {
              ShopApplyService.applySubmit($scope.mid, $scope.applyInfo.storeName, $scope.applyInfo.ownerName, $scope.adrProvinceId, $scope.adrCityId, $scope.adrAreaId, $scope.adrStreetId, $scope.addressName, $scope.applyInfo.address, $scope.selectValue, $scope.selectText, $scope.applyInfo.promotionCode, false, $scope.storeCode, $scope.storeType, $scope.applyInfo.hrCode)
                .success(function (response) {
                  console.log(response);
                  if (response.success) {
                    $scope.isBuyer = 1;
                    LoginService.setRole($scope.isBuyer);
                    $state.go('shopApplySuccess',{totalCommission:response.data.totalCommission,memberCount:response.data.memberCount,memberRegionCount:response.data.memberRegionCount});
                  }
                  else {
                    PopupService.showToast(response.message);
                  }
                })
            }
            else {
              $scope.showAlertCheck = true;
            }
          });
        }

      }
    };

    $scope.clearInput =function(){
      $scope.applyInfo.ownerName = undefined;
      $scope.applyInfo.address = undefined;
      $scope.applyInfo.storeName = undefined;
      if(!$scope.promotionCode){//没有从分享推广码进来的页面 才可以清空 推广码
        $scope.applyInfo.promotionCode ='';
      }

      $scope.addressName ='';
      $scope.applyInfo.hrCode =undefined;
      $scope.selectText =undefined;
    };
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    })
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1,-1];
      $scope.provinceTop=0;
      $scope.cityTop=0;
      $scope.areaTop=0;
      $scope.finish=false;
      $scope.watch=$scope.$watch('finish',function(newValue,oldValue){
	      if(newValue){
	        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.provinceTop);
	      }
      });
      $scope.promotionCode = $stateParams.promotionCode;
      if(UserService.isUserLogin()){
        if(LoginService.getRole()==1){//判断用户角色信息；0为买家；1为卖家
          $ionicLoading.show({template:'您已经是店主了,进店看看吧',duration:2500});
          $timeout(function(){
          },2000).then(function(){
            $state.go('shop');
          });
          return;
        }
        $scope.init();
      }else{
        console.log('shopapply --  not logined');
        $scope.init();
      }
      console.log('after Enter');
      if(v.direction == 'back'){//不需要刷新  $ionicView.enter

      }else{
        //需要刷新
        console.log('clear input -- jinru');
        $scope.clearInput();
      }
    //地址
    $scope.addressInit($scope.dataAdd,$scope.defaultValue,'SHOP_APPLY_ADDRESS',0);
    });
  }]);
