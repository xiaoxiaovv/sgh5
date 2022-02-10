/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/21
 * describe：ChangeAddressController 测试控制器
 **/
APP.controller('ChangeAddressController', ['$scope', '$stateParams', '$rootScope', 'ChangeAddressService','CommonAddressService','GoodsService', 'PopupService', '$timeout',
  '$ionicModal','$http','$ionicScrollDelegate',
  function ($scope, $stateParams, $rootScope, ChangeAddressService,CommonAddressService,GoodsService, PopupService, $timeout,$ionicModal,$http,$ionicScrollDelegate) {
    /** 变量声明 **/
    var dataS = JSON.parse($stateParams.addressData);
    $scope.textOne = '';
    $scope.textTwo = '';
    $scope.textThree = '';
    $scope.textFour = '';
    $scope.address = {
      acceptor: dataS.co,
      mobile: dataS.mo,
      detailAds: dataS.ar,
      regionName: dataS.rn,
      addrId: dataS.id,
      provinceId: dataS.pi,
      cityId: dataS.ci,
      areaId: dataS.ri,
      streetId: dataS.si
    };
    console.log($scope.address);
    $scope.panGoOn = false;
    $scope.updateResult = true;
    $scope.updateContent = '';
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
    $scope.flag = 'CHANGEADDRESS_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {};//自动定位地址信息
    var areaValue;
    var areaValueCity;
    console.log($scope.address);
    $scope.panGoOn = false;
    $scope.updateResult = true;
    $scope.updateContent = '';

    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      var data = JSON.parse($stateParams.addressData);
      if ($scope.panGoOn == false) {
        $scope.address = {
          acceptor: data.co,
          mobile: data.mo,
          detailAds: data.ar,
          regionName: data.rn,
          addrId: data.id,
          provinceId: data.pi,
          cityId: data.ci,
          areaId: data.ri,
          streetId: data.si
        };
      }
      else {
        $scope.address.regionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree+' ' + $scope.textFour;
      }
      $scope.panGoOn = false;
    };

     $scope.$on('$ionicView.beforeLeave', function (e, v) {

      $scope.watch();
    })
    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
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
      $scope.init();
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'CHANGEADDRESS_LOCATION',0);
      $scope.$on('$destroy', function () {
        $scope.addressModal.remove();
      });
    });

    //设置默认地址
    $scope.setDefault = function () {
      ChangeAddressService.setDefaultAddr($scope.address.addrId)
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.$ionicGoBack();
          }
          else {
            $scope.showResult('修改失败');
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
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'CHANGEADDRESS_LOCATION',0);
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
      $scope.addressInit(null,null,'CHANGEADDRESS_LOCATION',0);
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
          $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top
        }else{
          $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value,ah).success(function (response) {
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
            GoodsService.getLocationList(areaValue,2).success(function (response) {
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
      ChangeAddressService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
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

    //保存
    $scope.doChange = function () {
      if ($scope.address.acceptor == "") {
        PopupService.showToast('收货人不能为空');
        return;
      }
      if ($scope.address.acceptor.length > 10 || $scope.address.acceptor.length < 2) {
        PopupService.showToast('收货人为2-10个字符');
        return;
      }
      if ($scope.address.mobile == "") {
        PopupService.showToast('手机号码不能为空');
        return;
      }
      var patternMobile = $scope.globalConstant.mobileNumberRegExp;
      if (!patternMobile.exec($scope.address.mobile)) {
        PopupService.showToast('手机号码不正确');
        return;
      }
      if ($scope.address.regionName == "所在区域") {
        PopupService.showToast('请选择所在区域');
        return;
      }
      var addressDetail = /^.[^&<>]{2,29}$/;
      if (!addressDetail.exec($scope.address.detailAds)) {
        PopupService.showToast('详细地址为3～30个字符，且不能包含特殊字符！');
        return;
      }
      //调用数据修改网络接口
      ChangeAddressService.changeAddr($scope.address)
        .success(function (response, status, headers, config) {
          console.log(response);
          if (response.success) {
            $scope.$ionicGoBack();
          }
          else {
            $scope.showResult("修改失败");
          }
        });
    };

    //修改地址后回调
    $rootScope.$on('CHANGEADDRESS_LOCATION', function (event, data) {
      $scope.panGoOn = true;
      console.log('location', data);
      $scope.textOne = data['text-1'];
      $scope.textTwo = data['text-2'];
      $scope.textThree = data['text-3'];
      $scope.textFour = data['text-4'];
      $scope.address.provinceId = data['value-1'];
      $scope.address.cityId = data['value-2'];
      $scope.address.areaId = data['value-3'];
      $scope.address.streetId = data['value-4'];
      $scope.init();
    });

    //显示修改结果提示
    $scope.showResult = function (result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function () {
        $scope.updateResult = true;
      }, 1000);
    };

  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-24
 * describe：修改地址
 **/
APP.service('ChangeAddressService', ['$http', 'UrlService', function ($http, UrlService) {
  //修改地址
  this.changeAddr = function (address) {
    var params = {
      'id': address.addrId, // yl 接口新增加的
      "co": address.acceptor,
      "mo": address.mobile,
      "rn": address.regionName,
      "pi": address.provinceId,
      "ci": address.cityId,
      "ri": address.areaId,
      "si": address.streetId,
      "ar": address.detailAds,
      "zc":"",
      "ph":"",
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CHANGEADDR_INIT'),
      data: params
    });
  };
  //设置默认地址
  this.setDefaultAddr = function (addrId) {
    var params = {
      'm': addrId
    };
    return $http({
      method:'POST',
      url:UrlService.getUrl('SETDEFAULT_INIT'),
      params:params
    });
  };
  //地址
  this.getLocationList = function (parentId,regionType) {
    var params = {
      parentId: parentId,
      regionType:regionType
    };
    return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
  };
  //添加地址信息
  this.addAddress = function (provinceId, cityId, areaId, regionName, streetId) {
    var params = {
      'provinceId': provinceId,
      'cityId': cityId,
      'areaId': areaId,
      'regionName': regionName,
      'streetId': streetId,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('ADDADDRESSSELECTION_INIT'), params);
  };
}]);

