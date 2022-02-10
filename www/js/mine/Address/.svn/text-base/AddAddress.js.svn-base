/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/21
 * describe：AddAddressController 测试控制器
 **/
APP.controller('AddAddressController', ['$ionicPlatform','$ionicPopup','$scope', '$stateParams', '$rootScope', 'ADDADDRESSService','CommonAddressService', 'PopupService', '$timeout','$ionicHistory','$state','$ionicModal','$http','$ionicScrollDelegate',
  function ($ionicPlatform,$ionicPopup,$scope, $stateParams, $rootScope, ADDADDRESSService,CommonAddressService, PopupService, $timeout,$ionicHistory,$state,$ionicModal,$http,$ionicScrollDelegate) {
    /** 变量声明 **/
    $scope.textOne = '';
    $scope.textTwo = '';
    $scope.textThree = '';
    $scope.textFour = '';
    $scope.address = {
      'consignee': '',
      'provinceId': '',
      'cityId': '',
      'areaId': '',
      'streetId': '',
      'regionName': '',
      'mobile': '',
      'address': '',
      'isDefault': '0'
    };
    $scope.textColor = "color-text-s";
    $scope.streetTextColor = "color-text-s";
    $scope.defaultImage = $rootScope.imgBaseURL+"img/ic_select.png";
    $scope.defaultHide = true;
    $scope.panGoOn = false;
    $scope.panOrgoOn = false;
    $scope.updateResult = true;
    $scope.conserve = false; // 是否保存
    $scope.regionTrue =false;
    $scope.updateContent = '';
    $scope.isNotDistinguish = false;
    $scope.isPosition = false;

    /*勿动 start*/
    $scope.isChangeOrDefault = 0; //区别是否修改
    $scope.isDef = false;
    $scope.productDefaultAddress = {  //详情页默认地址
      'provinceId':0, //省
      'cityId':0,  //市
      'areaId':0, //区
      'streetId':0, //街道
      'regionName':''
    };
    $scope.productChangeAddress = {  //详情页修改后地址
      'provinceId':0, //省
      'cityId':0,  //市
      'areaId':0, //区
      'streetId':0, //街道
      'regionName':''
    };
    $scope.addChangeAddress = {    //变动后地址存储
      'provinceId':0, //省
      'cityId':0,  //市
      'areaId':0, //区
      'streetId':0, //街道
      'pca':'',   //省市区
      'regionName':''//省市区街道
    };
    $scope.positionAddress = {  //定位地址
      'provinceId':0, //省
      'cityId':0,  //市
      'areaId':0, //区
      'streetId':0, //街道
      'pca':'', //省市区
      'regionName':'' //省市区街道
    };

    /*勿动 end*/

    //地址选择框高度
    var screenHeight=window.innerHeight;
    var topHeight=250+123;
    var topDis=87;
    var contentHeight=screenHeight-topHeight+'px';
    var topDisHeight=topDis+'px';
    $scope.contentHeight = {
      'height':contentHeight
    }
    var topHeightStreet=250;
    var contentHeights=screenHeight-topHeightStreet+'px';
    $scope.contentHeightStreet={
      'height':contentHeights
    };
    /** 地址变量声明 **/
    $scope.addressTitle = '配送至';
    $scope.dataAdd = null;
    $scope.dataAddStreet = null;
    $scope.flag = 'CHANGEADDRESS_LOCATION';
    $scope.defaultValue = null;
    $scope.hasChanged = false;
    $scope.level = 0;
    $scope.adsMsgChange = {};
    $scope.adsMsg = {};

    var addressMessage = {};//自动定位地址信息
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.conserve = false;
      $scope.addressRegionName = '所在地区';
      $scope.addressStreet = "街道";
      if ($scope.panGoOn == false) {
        var bv = $ionicHistory.viewHistory().backView;
        if(bv && bv.stateName == 'address'){
          if(bv.stateParams && bv.stateParams &&  bv.stateParams.comeFromOrder == 'YES'){
            //是 从订单来的
            $scope.addressMsgInit();
          }
        }else{
          $scope.addressRegionName = '所在地区';
          //$scope.addressStreet = "街道";
          $scope.defaultImage = $rootScope.imgBaseURL+"img/ic_select.png";
          $scope.defaultHide = true;
          $scope.textColor = "color-text-s";
          $scope.streetTextColor = "color-text-s";
        }

      }
      else {
        $scope.textColor = "color-text-l";
        $scope.addressRegionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
        $scope.address.regionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
         if($scope.defaultOrchange){ //从详情页来 但是点击返回 回来继续请求接口
           $scope.hasChangeCommon();
         }

      }
      $scope.panGoOn = false;

    };
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    });
    $scope.hasChangeCommon = function () {
      $scope.address.regionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree+' '+ $scope.streetMsg;
      $scope.address.provinceId = $scope.hasChangeArr['value-1'];
      $scope.address.cityId = $scope.hasChangeArr['value-2'];
      $scope.address.areaId = $scope.hasChangeArr['value-3'];
      ADDADDRESSService.getLocationList($scope.hasChangeArr['value-3'],$scope.hasChangeArr['value-1']).success(function (response) {
        $scope.dataAddStreet = response.data;
      }).error(function (err) {
        PopupService.showToast('获取地址信息失败！');
      });
    };



    $scope.addressMsgInit=function () {
      $scope.textColor = "color-text-l";
      $scope.streetTextColor = "color-text-l";
      if($rootScope.addressStr == undefined){ // 默认地址
        $scope.defaultOrchange = true;
        $scope.isChangeOrDefault = 1;
        $scope.productChangeAddress = {  //详情页修改后地址
          'provinceId':'', //省
          'cityId':'',  //市
          'areaId':'', //区
          'streetId':'' //街道
        };
        $scope.adsMsg = JSON.parse($rootScope.addressDefMsg);
        $scope.addressNum = $scope.adsMsg.pcrName.indexOf('/'); //处理字符串
        $scope.adsDefMsgInfo = $scope.adsMsg.pcrName;
        $scope.addressStreet = $scope.adsDefMsgInfo.substring($scope.addressNum+1);
        $scope.addressRegName = $scope.adsMsg.pcrName.substring($scope.addressNum,-1); //省市区
        $scope.addressRegionName =  $scope.addressRegName; //省市区

        $scope.productDefaultAddress = {  //详情页默认地址
          'provinceId':$scope.adsMsg.provinceId, //省
          'cityId':$scope.adsMsg.cityId,  //市
          'areaId':$scope.adsMsg.regionId, //区
          'streetId':$scope.adsMsg.streetId,//街道
          'regionName':$scope.addressRegName+' '+$scope.addressStreet, //省市区街道
          'streetText': $scope.addressRegName //省市区
        };
        ADDADDRESSService.getLocationList($scope.adsMsg.regionId,$scope.adsMsg.provinceId).success(function (response) {
          $scope.dataAddStreet = response.data;
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });

      }else{ // 修改地址
        $scope.defaultOrchange = true;
        $scope.isChangeOrDefault = 2;
        $scope.productDefaultAddress = {  //详情页默认地址
          'provinceId':'', //省
          'cityId':'',  //市
          'areaId':'', //区
          'streetId':'' //街道
        };
        $scope.adsMsgChange = JSON.parse($rootScope.addressStr);
        $scope.productChangeAddress = {  //详情页修改后地址
          'provinceId':$scope.adsMsgChange['value-1'], //省
          'cityId':$scope.adsMsgChange['value-2'],  //市
          'areaId':$scope.adsMsgChange['value-3'], //区
          'streetId':$scope.adsMsgChange['value-4'], //街道
          'regionName':$scope.adsMsgChange['text-1']+ ' '+$scope.adsMsgChange['text-2']+' '+$scope.adsMsgChange['text-3']+' '+$scope.adsMsgChange['text-4']
        };

        $scope.addressStreet = $scope.adsMsgChange['text-4'];
        $scope.addressRegionName = $scope.adsMsgChange['text-1']+' ' + $scope.adsMsgChange['text-2'] +' ' + $scope.adsMsgChange['text-3'];

        ADDADDRESSService.getLocationList($scope.adsMsgChange['value-3'],$scope.adsMsgChange['value-1']).success(function (response) {
          $scope.dataAddStreet = response.data;
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
      }
    };
    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.isPosition = false;
      $scope.isNotDistinguish = false;
      $scope.isChangeOrDefault = 0;
      $scope.address.address ='';
      $scope.dataAddStreet=[];
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1];
      $scope.provinceTop=0;
      $scope.cityTop=0;
      $scope.areaTop=0;
      $scope.finish=false;
      $scope.textColor = "color-text-s";
      $scope.streetTextColor = "color-text-s";
      $scope.address.consignee = '';    // 姓名
      $scope.address.mobile = '';  // 电话
      $scope.watch=$scope.$watch('finish',function(newValue,oldValue){
        if(newValue){
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.provinceTop);
        }
      });
      $scope.isIos = ionic.Platform.isIOS()?true:false;
      $scope.init();
      //地址
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'CHANGEADDRESS_LOCATION',0);
      $scope.$on('$destroy', function () {
        $scope.addressModal.remove();
        $scope.addressModalStreet.remove();
      });


    });
    $ionicPlatform.on('resume', function(){
      $scope.addressModal.hide();
      $scope.addressModalStreet.hide();
    });

    $scope.goBack = function () {
      $scope.panGoOn = false;
      $ionicHistory.goBack();
    };

    $scope.commonGoBack = function () {
      var confirmPopup = $ionicPopup.confirm({
        template: '您当前信息未保存，是否保存信息？',
        cancelText: '离开',
        okText: '留在此页面'
      });
      confirmPopup.then(function(res) {
        if (res) { //

        } else { //离开
          $scope.panGoOn = false;
          $scope.addressRegionName = '所在地区';
          $scope.$ionicGoBack();
        }
      });
    };

    $scope.$watch('address',function () {

      $scope.address.mobile = $scope.address.mobile.replace(/([^0-9])|(-)/g,"");
      var bv = $ionicHistory.viewHistory().backView;
      if(bv && bv.stateName == 'address'){
        if(bv.stateParams && bv.stateParams &&  bv.stateParams.comeFromOrder == 'YES'){
          //是 从订单来的
          $ionicPlatform.registerBackButtonAction(function (e) {
            if($scope.address.mobile!='' && $scope.address.consignee!='' && $scope.address.address!=''){
              $scope.commonGoBack();
            }
          });

          $scope.goBack = function () {
            if($scope.address.mobile!='' && $scope.address.consignee!='' && $scope.address.address!=''){
              $scope.commonGoBack();
            }else{
              $ionicHistory.goBack();
            }
          };

        }
      }
        $ionicPlatform.registerBackButtonAction(function (e) {
          if($scope.address.mobile!='' && $scope.address.consignee!='' && $scope.address.address!=''){
            $scope.commonGoBack();
          }
        });
        $scope.goBack = function () {
          if($scope.address.mobile!='' && $scope.address.consignee!='' && $scope.address.address!='' && $scope.addressRegionName!='所在地区' && $scope.addressStreet!='街道'){
            $scope.commonGoBack();
          }else{
            $ionicHistory.goBack();
          }
        };

    },true);

    // 选择联系人 {"name":"大A","number":"18888889767"}
    $scope.selectPhone=function () {
      if(window.cordova){
        window.emc.addAddressBook(function (response) { //成功回调
          var res=JSON.parse(response);
          $scope.$apply(function () {
            $scope.address.consignee =  res.name;   // 姓名
            $scope.address.mobile = res.number.replace(/([^0-9])|(-)/g,"");  // 电话
          });
        },function () {  // 失败回调
          $ionicPopup.alert({
            template: '获取通讯录失败',
            okText: '知道了'
          });
        });

      }else{
        $ionicPopup.alert({
          template: '请下载客户端APP实现此功能！',
          okText: '知道了'
        });
      }


    };
    //设置默认
    $scope.setDefault = function () {
      if ($scope.defaultHide == false) {
        $scope.address.isDefault = '0';
        $scope.defaultHide = true;
      }
      else {
        $scope.address.isDefault = '1';
        $scope.defaultHide = false;
      }
    };
     // 选择街道
    $scope.StreetTop=function () {
     // $scope.streetTextColor = "color-text-s";
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1];
      $scope.provinceDis=false;
      $scope.cityDis=false;
      $scope.areaDis=false;
      $scope.dataAdd=null;
      $scope.defaultValue=null;
      $scope.selectProvince='';
      $scope.selectCity='';
      $scope.selectArea='';
      if($scope.addressRegionName != '所在地区'){  //$scope.address.regionName != '所在地区'
        $scope.addressModalStreet.show();
      }else{
        PopupService.showToast('请选择所在地');
        $scope.addressStreet='街道';
        $scope.streetTextColor = "color-text-s";
      }

    };

     //地址窗口
    $scope.addressTop = function(){
      $scope.addressTipFlag=false;
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1];
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
    };
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
        for(var i=0;i<$scope.nowLevelIndex.length;i++){
          if(i>$scope.nowLevel){
            $scope.nowLevelIndex[i]=-1;
          }
        }
      } else {
        $scope.finish=false;
       //第一次取全国的省直辖市信息
        ADDADDRESSService.getLocationList('', 0).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          $scope.finish = true;
          $scope.nowLevel = $scope.level;
          $scope.nowLevel = $scope.nowLevel * (-1);
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          //  $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
          console.log($scope.nowLevel);
          for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
            if (i > $scope.nowLevel) {
              $scope.nowLevelIndex[i] = -1;
            }
          }
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
    };
    $scope.goSelectStreet=ionic.Utils.debounce(function (index,item) {

      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.addressStreet = item.text;
      $scope.streetMsg = item.text;
    //  $scope.address.streetId = item.value;
      /*勿动*/
      $scope.isChangeOrDefault =3; //只修改街道
      $scope.isDef = true;
      // 地址更改存放
      $scope.addChangeAddress.regionName = $scope.addChangeAddress.pca+' '+$scope.addressStreet; //省市区街道
      $scope.addChangeAddress.streetId = item.value;
      //定位
      $scope.positionAddress.streetId = item.value;
      $scope.positionAddress.regionName = $scope.positionAddress.pca+' '+$scope.addressStreet; //省市区街道
      /*勿动*/
      $scope.addressModalStreet.hide();
      if($scope.addressStreet == '街道'){
        $scope.streetTextColor = "color-text-s";
      }else{
        $scope.streetTextColor = "color-text-l";
      }

    });
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index,item) {
      for(var i=0;i<$scope.nowLevelIndex.length;i++){
        if(i>$scope.nowLevel){
          $scope.nowLevelIndex[i]=-1;
        }
    }
      $scope.nowLevelIndex[$scope.nowLevel]=index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;

      $scope.hasChangeArr = $scope.defaultValue;

      if ($scope.level > -2) {//xyz修改2级本地获取
        if ($scope.level == -1) { //省
          $scope.selectProvince = item.text;
          $scope.provinceIndex = index;
          $scope.provinceFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.provinceTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
          $scope.nowLevel = $scope.level;
          $scope.nowLevel = $scope.nowLevel * (-1);
        } else {
          //$scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        ADDADDRESSService.getLocationList(item.value, ah).success(function (response) {
          if (ah == 1) {
            areaValueCity = item.value;
          }
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选市
        $scope.citySel = function () {
          $scope.level = $scope.levelArea;
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          ADDADDRESSService.getLocationList(areaValueCity, 1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, -1);
            $scope.selectArea = '';
            $scope.cityFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = false;
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.cityTop);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      }else if ($scope.level > -4   && $scope.level!=-3) {//xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
        $scope.selectArea= item.text;
        $scope.addressStreet = "街道";
        $scope.textColor = "color-text-l";
        $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        ADDADDRESSService.getLocationList(item.value,ah).success(function (response) {
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
            $scope.level=$scope.levelArea;
            ADDADDRESSService.getLocationList(areaValue,2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
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
    }else if($scope.level == -3){
        $scope.addressModal.hide();
        $scope.regionTrue = true;
        $scope.isChangeOrDefault = 4; //修改了省市区
        $scope.streetTextColor = "color-text-s";
        $scope.streetTrue = true;
        $scope.panGoOn = true;
        $scope.panOrgoOn = true;
        $scope.textOne = $scope.defaultValue['text-1'];
        $scope.textTwo = $scope.defaultValue['text-2'];
        $scope.textThree = $scope.defaultValue['text-3'];
        $scope.address.provinceId=$scope.defaultValue['value-1'];
        $scope.address.cityId=$scope.defaultValue['value-2'];
        $scope.address.areaId=$scope.defaultValue['value-3'];
        $scope.address.regionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
        $scope.addressRegionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
        $scope.addChangeAddress = {    //变动后地址存储
          'provinceId':$scope.defaultValue['value-1'], //省
          'cityId':$scope.defaultValue['value-2'],  //市
          'areaId':$scope.defaultValue['value-3'], //区
          'streetId':0,
          'pca':$scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree, //省市区
          'regionName': '' //省市区街道
        };

        $scope.selectArea= item.text;
        $scope.cityFlag=false;
        $scope.areaFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=true;
        $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        ah = $scope.level*-1;
        ADDADDRESSService.getLocationList(item.value,ah).success(function (response) {
          $scope.dataAddStreet = response.data;
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
      }
    else {
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
      ADDADDRESSService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
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
          ADDADDRESSService.getLocationList(addressMessage.areaId,3).success(function (response) {
            $scope.dataAddStreet = response.data;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
          $scope.positionAddress = {  //定位地址
            'provinceId':addressMessage.provinceId, //省
            'cityId':addressMessage.cityId,  //市
            'areaId':addressMessage.areaId, //区
            'streetId':0, //街道
            'pca':addressMessage.provinceName+' '+addressMessage.cityName+' '+addressMessage.regionName, //省市区
            'regionName':'' //省市区街道
          };

          $scope.isPosition = true;
          $rootScope.$broadcast($scope.flag, autoAddress);
          $scope.streetTextColor = "color-text-s";
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
    $ionicModal.fromTemplateUrl('templates/common/CommonLocationStreet.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.addressModalStreet = modal;
    });
    // CommonLocationStreet
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
      $scope.addressModalStreet.hide();
    };
    //保存 弹窗
    $scope.preservation=function () {

      //如果是订单页面来的 直接回订单页面
      $scope.fromOrder ;
      var bv = $ionicHistory.viewHistory().backView;

      if(bv && bv.stateName == 'address'){
        if(bv.stateParams && bv.stateParams &&  bv.stateParams.comeFromOrder == 'YES'){
          //是 从订单来的
          $scope.fromOrder = true;

        }

      }
      $scope.positionCommonFun =function () { //定位函数
        $scope.address.provinceId = $scope.positionAddress.provinceId;
        $scope.address.cityId = $scope.positionAddress.cityId;
        $scope.address.areaId = $scope.positionAddress.areaId;
        $scope.address.streetId = $scope.positionAddress.streetId;
        $scope.address.regionName = $scope.positionAddress.regionName;
      };
      $scope.newAddAddress = function () { //修改
        $scope.address.provinceId = $scope.addChangeAddress.provinceId;
        $scope.address.cityId = $scope.addChangeAddress.cityId;
        $scope.address.areaId = $scope.addChangeAddress.areaId;
        $scope.address.streetId = $scope.addChangeAddress.streetId;
        $scope.address.regionName = $scope.addChangeAddress.regionName;
      };
      // 点击保存 判断从哪页面来的
      if($scope.fromOrder){ // 详情页来的
        if($scope.isPosition){ //定位地址
          $scope.positionCommonFun();
        }else{ //手动选择 或者 带出
          if($scope.defaultOrchange && $scope.isChangeOrDefault == 1){ //详情页 地址默认 不修改
            $scope.address.provinceId = $scope.productDefaultAddress.provinceId;
            $scope.address.cityId = $scope.productDefaultAddress.cityId;
            $scope.address.areaId = $scope.productDefaultAddress.areaId;
            $scope.address.streetId = $scope.productDefaultAddress.streetId;
            $scope.address.regionName = $scope.productDefaultAddress.regionName;
          }
          else if($scope.isChangeOrDefault == 3){//详情页 地址默认 改了街道
            $scope.newAddAddress();
              if(!$scope.regionTrue && $scope.isDef){ //带过来省市区没动 但是街道变了
                $scope.address.provinceId = $scope.productDefaultAddress.provinceId;
                $scope.address.cityId = $scope.productDefaultAddress.cityId;
                $scope.address.areaId = $scope.productDefaultAddress.areaId;
                $scope.address.streetId = $scope.productDefaultAddress.streetId;
                $scope.address.regionName = $scope.productDefaultAddress.streetText +' ' +$scope.addressStreet;
              }
          }

         else if($scope.defaultOrchange && $scope.isChangeOrDefault == 2){ //详情页 在详情页地址改动 不修改
            $scope.address.provinceId = $scope.productChangeAddress.provinceId;
            $scope.address.cityId = $scope.productChangeAddress.cityId;
            $scope.address.areaId = $scope.productChangeAddress.areaId;
            $scope.address.streetId = $scope.productChangeAddress.streetId;
            $scope.address.regionName = $scope.productChangeAddress.regionName;
          }
          else if($scope.isChangeOrDefault == 4){//详情页 在详情页地址改动 修改 -- 调修改了的对象
            $scope.newAddAddress();
          }
        }
      }else{  // 新增地址
         if($scope.isPosition){ //定位地址
           $scope.positionCommonFun();
         }else{
           $scope.newAddAddress();
         }
      }

      //调用添加新地址接口
      ADDADDRESSService.doInit($scope.address)
        .success(function (response, status, headers, config) {
          if (response.success == true) {

            $scope.address = {
              'consignee': '',
              'provinceId': '',
              'cityId': '',
              'areaId': '',
              'streetId': '',
              'regionName': '',
              'mobile': '',
              'address': '',
              'isDefault': '0'
            };
            $scope.addressRegionName = '';
            $rootScope.addressDefaultMsg = {
              'provinceId': '',
              'cityId': '',
              'regionId': '',
              'streetId': '',
              'provinceName': '',
              'cityName': '',
              'pcrName': '',
            };
            $rootScope.addressStr = undefined;
            $scope.isChangeOrDefault = 0; //区别是否修改
            $scope.productDefaultAddress = {  //详情页默认地址
              'provinceId':0, //省
              'cityId':0,  //市
              'areaId':0, //区
              'streetId':0, //街道
              'regionName':''
            };
            $scope.productChangeAddress = {  //详情页修改后地址
              'provinceId':0, //省
              'cityId':0,  //市
              'areaId':0, //区
              'streetId':0, //街道
              'regionName':''
            };
            $scope.addChangeAddress = {    //变动后地址存储
              'provinceId':0, //省
              'cityId':0,  //市
              'areaId':0, //区
              'streetId':0, //街道
              'pca':'',   //省市区
              'regionName':''//省市区街道
            };
            $scope.positionAddress = {  //定位地址
              'provinceId':0, //省
              'cityId':0,  //市
              'areaId':0, //区
              'streetId':0, //街道
              'pca':'', //省市区
              'regionName':'' //省市区街道
            };

            $scope.panGoOn = false;
            if($scope.fromOrder){
              $scope.$ionicGoBack(-2);//如果从订单页 新增地址 直接 返回订单有

            }else{
              $scope.$ionicGoBack();
            }

          }
          else {
            if(!$scope.isNotDistinguish){
              $scope.showResult('添加失败');
            }

          }
        });
    };
    //保存
    $scope.doChange = function () {

      if ($scope.address.consignee == "") {
        PopupService.showToast('收货人不能为空');
        return;
      }
      var pattern=/^([\u4E00-\u9FA5]|\w)*$/;
      if(!pattern.exec($scope.address.consignee))
      {
        PopupService.showToast('收货人不能包括特殊字符');
        return;
      }
      if ($scope.address.consignee.length > 10 || $scope.address.consignee.length < 2) {
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
      if ($scope.addressRegionName == '所在地区') { //$scope.address.regionName == "所在地区"
        PopupService.showToast('请选择所在地区');
        return;
      }
      if ($scope.addressStreet == '请选择街道') { //$scope.address.regionName == "所在地区"
        PopupService.showToast('请选择街道');
        return;
      }
      var addressDetail = /^.[^&<>]{2,29}$/;
      if (!addressDetail.exec($scope.address.address)) {
        PopupService.showToast('详细地址为3～30个字符，且不能包含特殊字符！');
        return;
      }
      if($scope.conserve){
          $scope.preservation();
      }else{
        if($scope.addressStreet == '街道'){
          AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder({
              city: "全国"//城市，默认：“全国”
            });
            $scope.allAddress =$scope.address.regionName+ ' ' + $scope.addressStreet +' '+ $scope.address.address;
            geocoder.getLocation($scope.allAddress, function (status, result) {
              if (status == 'complete' && result.geocodes.length) {
                var lat = result.geocodes[0].location.lat;
                var lng = result.geocodes[0].location.lng;
                var lnglatXY=[lng, lat];
                geocoder.getAddress(lnglatXY, function(status, result) {
                  if (status === 'complete' && result.info === 'OK') {
                    $scope.township=result.regeocode.addressComponent.township;
                    $scope.addressStreet = $scope.township;
                    var arr=[],
                        newArr=[],
                        arr=$scope.dataAddStreet;
                    for(var i=0;i<arr.length;i++){
                      newArr.push(arr[i].text);
                      if(newArr.indexOf($scope.township)!=-1){
                        var num = newArr.indexOf($scope.township);
                        $scope.isNotDistinguish = true; //能匹配
                        $scope.addChangeAddress.streetId = arr[num].value;
                        $scope.addChangeAddress.regionName = $scope.addChangeAddress.pca+' '+$scope.addressStreet;
                        //定位
                        $scope.positionAddress.streetId = arr[num].value;
                        $scope.positionAddress.regionName = $scope.positionAddress.pca+' '+$scope.addressStreet; //省市区街道


                      }else{
                        $scope.isNotDistinguish = false;
                      }

                    }

                    if($scope.isNotDistinguish){

                      var confirmPopup = $ionicPopup.confirm({
                        template: '根据国家最新行政区域划分，我们识别到您的地址对应街道为'+"'"+$scope.township+"'"+',是否保存?',
                        cancelText: '修改',
                        okText: '保存'
                      });
                      confirmPopup.then(function(res) {
                        if (res) { // 保存
                          $scope.conserve = false;
                          $scope.isOkChange = true;
                          $scope.addressStreet=$scope.township;
                          $scope.preservation();
                        } else { //修改
                          $scope.isOkChange = false;
                          $scope.conserve = true;
                          console.log('You are not sure');
                        }
                      });
                    }else{
                      $scope.$apply(function () {
                        $scope.addressStreet = '请选择街道';
                        $scope.streetTextColor = 'text-red';
                      });
                    }


                  }else{
                    //获取地址失败
                    $ionicPopup.alert({
                      template: '获取地址失败，请稍后重试！',
                      okText: '确定'
                    });
                  }
                });
              } else {
                $scope.$apply(function () {
                  $scope.addressStreet = '请选择街道';
                  $scope.streetTextColor = 'text-red';
                });
                console.log('高德返回结果失败');
              }
            })
          });
        }else{
          $scope.preservation();
        }

      }





    };

    //修改地址回调
    $rootScope.$on('CHANGEADDRESS_LOCATION', function (event, data) {
      $scope.panGoOn = true;
      $scope.panOrgoOn = true;
      $scope.textOne = data['text-1'];
      $scope.textTwo = data['text-2'];
      $scope.textThree = data['text-3'];
      $scope.textFour = data['text-4'];
      $scope.address.provinceId = data['value-1'];
      $scope.address.cityId = data['value-2'];
      $scope.address.areaId = data['value-3'];
      $scope.address.streetId = data['value-4'];
      $scope.textColor = "color-text-l";
      $scope.streetTextColor = "color-text-l";
      $scope.init();
    });

    //显示修改内容
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
 * describe：添加地址
 **/
APP.service('ADDADDRESSService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (address) {

    var params = {
      "co": address.consignee,
      "pi": address.provinceId,
      "ci": address.cityId,
      "ri": address.areaId,
      "si": address.streetId,
      "rn": address.regionName,
      "mo": address.mobile,
      "ar": address.address,
      "de": address.isDefault,
      "zc":'',
      "ph":''
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ADDADDRESS_INIT'),
      data: params
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
