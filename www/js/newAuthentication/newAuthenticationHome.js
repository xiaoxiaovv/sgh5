APP.controller('newAuthenticationHome', ['GetStatisticInfoService','HomePageService','IMService','ADDADDRESSService','AccountMessageService','$localstorage','$scope', '$rootScope', '$state', 'ShopApplyService', 'MyStoreService', 'CommonAddressService', 'PopupService', 'LoginService',
  'UserService', 'ShopService','$stateParams','$ionicLoading','$timeout','$ionicPopup', '$ionicScrollDelegate', '$ionicModal', '$http',
  function (GetStatisticInfoService,HomePageService,IMService,ADDADDRESSService,AccountMessageService,$localstorage,$scope, $rootScope, $state, ShopApplyService,MyStoreService,CommonAddressService, PopupService, LoginService, UserService, ShopService,$stateParams,$ionicLoading,$timeout,$ionicPopup,$ionicScrollDelegate,$ionicModal,$http) {

    /** 变量声明 **/
    $scope.localStorage=window.localStorage;
  //  $scope.addressName = '';//地区名称
    $scope.addressName ='请选择';
    $scope.goToAddress = false;//判断是否进入到地区列表
    $scope.categoryData = [];//联盟分类数据
    $scope.selectText = '';//联盟分类选择文本
    $scope.selectKey = '';//联盟分类选择Key
    $scope.isComplete=false;   //是否下一步
    $scope.isHasKey=false;    //显示清除符号
    $scope.hrCodes=false;    //显示输入上岗证号
    $scope.promotionCode='';
    $scope.avatarImage='img/registerSuccess.png';
    $scope.userInfo = {
      picTempFile: ''
    };
    // 地址选择框高度
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
    $scope.user = {};
    //memberID
    $scope.mid = UserService.getUser().mid;
    /** 方法 **/
    $scope.init = function () {
      $scope.user = UserService.getUser();
      if ($scope.user.avatarImageFileId != undefined) {
        $scope.avatarImage = $scope.user.avatarImageFileId;
      }
      $scope.addressName='请选择';
      $scope.showAlert = false;
      //所在地区
      if (!$scope.goToAddress) {
        $scope.addressName = '';
      }
      else {
        $scope.addressName = $scope.textOne + $scope.textTwo + $scope.textThree;
      }
      //联盟分类
      $scope.selectText = $scope.textUnion;
      $scope.applyInfo.category=$scope.selectText;
      if($scope.selectText){
        $scope.infos=$scope.selectText.substring(0,4);
        if($scope.infos=='人人服务'){
          $scope.hrCodes=true;
        }else{
          $scope.hrCodes=false;
        }
      }
      $scope.selectValue = $scope.valueUnion;
      //memberID
      $scope.mid = UserService.getUser().mid;
      //获取小店信息
      if( !$scope.mid){
        //本地缓存没有 登录 不发获得用户名的请求
        return;
      }
      ShopService.getStoreInfo($scope.mid)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.storeCode = response.data.storeCode;
            $scope.storeType = response.data.storeType;
          }
        });
    };


//店铺申请所需信息
    $scope.applyInfo = {
      ownerName: '',
      address: '',
      promotionCode: '',
      storeName: '',
      hrCode: '',
      num:0,
      arr:[],
      category: ''
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
        $scope.applyInfo.arr=$scope.nowLevelIndex;
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
        MyStoreService.getLocationList('', 0).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            $scope.finish = true;
            $scope.nowLevel = $scope.level;
            $scope.nowLevel = $scope.nowLevel * (-1);
            $scope.applyInfo.num=$scope.nowLevel;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);
            // console.log($scope.nowLevel);
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
        MyStoreService.getLocationList(item.value, ah).success(function (response) {
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
          MyStoreService.getLocationList(areaValueCity, 1).success(function (response) {
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
      }else if ($scope.level > -4 && $scope.level!=-3) {//xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
        //if($scope.level == -3){
        //  $scope.selectArea= item.text;
        //  $scope.cityFlag=false;
        //  $scope.areaFlag=false;
        //  $scope.selectFlag=true;
        //  $scope.provinceDis=true;
        //  $scope.cityDis=true;
        //  $scope.areaDis=true;
        //  $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        //}else{
          $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
       // }
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
          $scope.dataAdd="";
          $scope.level= $scope.levelArea;
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
      }
      else if($scope.level == -3){
        $scope.addressModal.hide();
        $scope.regionTrue = true;
        $scope.textOne = $scope.defaultValue['text-1'];
        $scope.textTwo = $scope.defaultValue['text-2'];
        $scope.textThree = $scope.defaultValue['text-3'];
        $scope.adrProvinceId=$scope.defaultValue['value-1'];
        $scope.adrCityId=$scope.defaultValue['value-2'];
        $scope.adrAreaId=$scope.defaultValue['value-3'];
        $scope.addressName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
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
      MyStoreService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
        .success(function () {
          var autoAddress = {
            'text-1': addressMessage.provinceName,
            'text-2': addressMessage.cityName,
            'text-3': addressMessage.regionName,
          //  'text-4': addressMessage.streetName,
            'value-1': addressMessage.provinceId,
            'value-2': addressMessage.cityId,
            'value-3': addressMessage.areaId
          //  'value-4': addressMessage.streetId
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
     // $scope.textFour = data['text-4'];
      $scope.adrProvinceId = data['value-1'];
      $scope.adrCityId = data['value-2'];
      $scope.adrAreaId = data['value-3'];
    //  $scope.adrStreetId = data['value-4'];
      $scope.addressName = $scope.textOne + $scope.textTwo + $scope.textThree;


    });
    //添加联盟分类
    $rootScope.$on('SHOP_APPLY_UNION', function (event, data) {
      $scope.textUnion = data['text'];
      $scope.valueUnion = data['value'];
    });
    // 违禁词
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
    $scope.goCommonUnion=function () {
       if($scope.addressName=='请选择'){
         PopupService.showToast('请选择所在地区！');
       }else{
         $state.go('commonUnion',{
           'flag':'SHOP_APPLY_UNION'
         });
       }
    };

     //监听
    var contentWatch = $scope.$watch("applyInfo", function() {
      if (!$scope.applyInfo.storeName || !$scope.applyInfo.category) {
        $scope.isComplete = false;
      } else if ($scope.promotionCode.length == 0 && $scope.applyInfo.promotionCode.length == 0) {
        $scope.isComplete = false;
      } else {
        $scope.isComplete = true;
      }

    }, true);


   // console.log($localstorage.getObject('register',register))
    // 下一步
    $scope.goAuthentication=function () {
      var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
      $scope.showAlert = false;
      if ($scope.applyInfo.storeName.length<=1) {
        PopupService.showToast('店铺名字为2～20的常用字符！');
      }else if ((/[\ud800-\udbff][\udc00-\udfff]/g).test($scope.applyInfo.storeName)) {
        PopupService.showToast('亲，不可以使用表情喔!');
      }else if(pattern.test($scope.applyInfo.storeName)){
        PopupService.showToast('店铺名称不能包含特殊字符!');
      } else if ($scope.addressName.length ==0) {
        PopupService.showToast('请选择所在地区！');
      }else if (!$scope.selectText) {
        PopupService.showToast('请选择类别！');
      }
      else if (!(/^(HR|hr|Hr|hR).{6,18}$/.test($scope.applyInfo.hrCode)) && $scope.selectValue == '10') {
        PopupService.showToast('上岗证号必须为HR开头，总长度8-20位！');
     //   $scope.showAlert = true;
   }else if($scope.promotionCode.length==0&&$scope.applyInfo.promotionCode.length==0){
     PopupService.showToast('请填写推荐码!');
   }
      else {
        $scope.xyzPromotionCode = $scope.promotionCode.length==0?$scope.applyInfo.promotionCode:$scope.promotionCode;
        //contentWatch();  // 销毁watch
       // ShopApplyService.checkPerfectInformation($scope.applyInfo.storeName,$scope.selectValue,$scope.xyzPromotionCode,$scope.applyInfo.hrCode,$scope.adrProvinceId,$scope.adrCityId,$scope.adrAreaId,$scope.adrStreetId,$scope.addressName,$scope.applyInfo.address)
        //  .success(function (response) {
        //    if(response.data.isCanCreateStore){
              // 存储
              var newAuthentication_obj={
                "storeName": $scope.applyInfo.storeName,     //小店名称
                "memberType":$scope.selectValue,             //类别码
                "provinceId":$scope.adrProvinceId,           //省id
                "cityId": $scope.adrCityId,                  //城市id
                "regionId": $scope.adrAreaId,                //区县id
                "regionName": $scope.addressName,            //地址名称
               /*  "streetId": $scope.adrStreetId,  */            //街道id    选填
                "address": $scope.applyInfo.address,         //详细地址  选填
                "promotionCode": $scope.applyInfo.promotionCode, //推广码    选填
                "hrCode": $scope.applyInfo.hrCode,            //hrcode
                "isPromotionCode": $scope.promotionCode  // 判断是不是分享
              };
              $localstorage.setObject('newAuthentication_obj',newAuthentication_obj);
              var promotion = $scope.promotionCode.length==0?$scope.applyInfo.promotionCode:$scope.promotionCode;


        // 新开店接口
              $scope.register_obj=$localstorage.getObject('register_obj');
              if($scope.register_obj.mobileNum!=$scope.iphoneNumber && $scope.types==100){ //注册开店
                ShopApplyService.newShop($scope.applyInfo.storeName,$scope.selectValue,
                  promotion,$scope.applyInfo.hrCode,$scope.adrProvinceId,
                  $scope.adrCityId,$scope.adrAreaId,$scope.addressName,
                  $scope.applyInfo.address,$scope.register_obj.mobileNum,
                  $scope.register_obj.password,$scope.register_obj.captcha,$scope.register_obj.imgCaptcha)
                  .success(function(res){
                      if(res.success){
                        if(res.data.member!=null){
                          UserService.setUser(res.data.member);
                          if(res.data.member.sessionValue){
                            $localstorage.set('sg_login_token_secret','Bearer'+res.data.member.sessionValue);//把token存到本地
                          }else{
                            $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                          }
                        }
                        IMService.initWebSocket();
                        $timeout(function () {
                          $state.go('shopApplySuccess');
                        },100);
                      }else{
                        PopupService.showToast(res.message);
                      }
                  });
              }else{ //我要开店
                ShopApplyService.applySubmitStore($scope.memberId,$scope.applyInfo.storeName,$scope.selectValue,
                  promotion,$scope.applyInfo.hrCode,$scope.adrProvinceId,
                  $scope.adrCityId,$scope.adrAreaId,$scope.addressName,
                  $scope.applyInfo.address)
                  .success(function(res){
                    if(res.success){
                      if(res.data.member!=null){
                        UserService.setUser(res.data.member);
                        if(res.data.member.sessionValue){
                          $localstorage.set('sg_login_token_secret','Bearer'+res.data.member.sessionValue);//把token存到本地
                        }else{
                          $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
                        }
                      }
                      $timeout(function () {
                        $state.go('shopApplySuccess');
                      },100);
                    }else{
                      PopupService.showToast(res.message);
                    }
                  });
              }

      }

    };

    //获取推荐码
    $scope.getPromotionCode = function(){
      if (!$scope.adrAreaId && $scope.addressName=='请选择' && !$scope.adrCityId && !$scope.adrProvinceId){
        PopupService.showToast('请选择地址');
        return;
      }else{
        if($scope.promotionCode.length!=0){
          PopupService.showToast('您已有推荐码，快快完成注册吧。');
        }
        else if($scope.applyInfo.promotionCode.length!=0){
          PopupService.showToast('您已有推荐码，快快完成注册吧。');
        }else{
          ShopApplyService.getPromotion($scope.adrAreaId)
            .success(function (res) {
              if(res.success){
                // $scope.promotionCode = res.data;
                if(res.data!=null){
                  $scope.applyInfo.promotionCode =res.data;
                }else{
                  console.log('成功了但是返回是null')
                }

              }else{
                PopupService.showToast(res.message);
              }
            })
        }

      }


    };

    // 获取焦点
    $scope.isFocus=function () {
       $scope.isHasKey=true;
    }
    // 失去焦点
    $scope.isBlur=function () {
      $scope.isHasKey=false;
    }
    //点击清除
    $scope.isClear=function () {
      $scope.applyInfo.address='';
      $scope.isHasKey=false;
    };

    $scope.clearInput =function(){
      $scope.applyInfo.ownerName = undefined;
      $scope.applyInfo.address = undefined;
      $scope.applyInfo.storeName = undefined;
      $scope.addressName ='请选择';
      $scope.applyInfo.hrCode =undefined;
      $scope.selectText ='请选择';
    };
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    });
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.memberId = UserService.getUser().mid;
      $scope.iphoneNumber = UserService.getUser().mobile;
      $scope.dataAdd = null;
      $scope.defaultValue = null;
      $scope.hrCodes=false;
      $scope.promotionCode = $stateParams.promotionCode ;
      $scope.types = $stateParams.types;
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
      if(UserService.isUserLogin()){
        if(LoginService.getRole()==10){//判断用户角色信息；0为买家；1为卖家
          $ionicLoading.show({template:'您已经是店主了,进店看看吧',duration:2500});
          $timeout(function(){
          },2000).then(function(){
            $state.go('homePage');
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
         if($scope.selectValue==undefined){
           $scope.selectText ='请选择';
         }
        $scope.addressName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
      }else{
        //需要刷新
        console.log('clear input -- jinru');
        $scope.clearInput();
        $scope.applyInfo.storeName='';
        $scope.applyInfo.category='';
        $scope.applyInfo.promotionCode='';
        $scope.addressName ='请选择';
        $scope.selectText ='请选择';
      }
      //地址
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'SHOP_APPLY_ADDRESS',0);
    });

  }]);


APP.service('ShopApplyService', ['$http', 'UrlService','$window', function ($http, UrlService,$window) {
  //申请开店
  this.applySubmit = function (memberId, storeName, memberRealName, provinceId, cityId, regionId,streetId, regionName, address, memberType, memberName,
                               promotionCode, isReApply, storeCode, storeType, hrCode) {
    var params = {
      memberId: memberId,
      storeName: storeName,
      memberRealName: memberRealName,
      provinceId: provinceId,
      cityId: cityId,
      regionId: regionId,
      streetId:streetId,
      regionName: regionName,
      address: address,
      memberType: memberType,
      memberName: memberName,
      promotionCode: promotionCode,
      isReApply: isReApply,
      storeCode: storeCode,//店铺88码
      storeType: storeType,//店铺类型
      hrCode: hrCode
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SHOP_APPLY'),
      params: params
    });
  };
  this.checkPerfectInformation = function (storeName,memberType,promotionCode,hrCode,provinceId,cityId,regionId,streetId,regionName,address) {
    var params = {
      storeName: storeName,
      memberType: memberType,
      promotionCode: promotionCode,
      hrCode: hrCode,
      provinceId: provinceId,
      cityId: cityId,
      regionId: regionId,
      streetId:streetId,
      regionName: regionName,
      address: address
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('PERFECT_INFORMATION'),
      params: params
    });
  };
  //文本校验
  this.checkText = function (checkword) {
    var params = {
      checkword: checkword,
      noLoading:true
    };
    return $http.get(UrlService.getUrl('CHECK_TEXT'), params);
  };

  this.check = function (hrCode){
    var params = {
      'hrCode': hrCode
    };
    return $http.get(UrlService.getUrl('CHECKHRCODE_INIT'), params);
  };
  this.getPromotion = function(regionId){
    var params ={
      regionId:regionId
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_PROMOTION_CODE'),
      params: params
    });
  };
  //注册开店
  this.newShop= function(storeName,memberType,promotionCode,hrCode,provinceId, cityId, regionId, regionName, address,
                         mobileNum,password,captcha,imgCaptcha){
    var params={
      storeName: storeName, //店铺名称
      memberType: memberType,
      promotionCode: promotionCode,
      hrCode: hrCode,
      provinceId: provinceId,
      cityId: cityId,
      regionId: regionId,
      regionName: regionName,
      address: address,
      mobileNum:mobileNum,
      password:encodeURIComponent(password),
      captcha:captcha,
      imgCaptcha:imgCaptcha
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('NEW_SHOP_STORE'),
      params: params
    });
  };
  // 我要开店
  this.applySubmitStore = function (memberId, storeName,memberType,promotionCode,hrCode,provinceId, cityId, regionId, regionName, address) {
    // 历史微店主  完善-实名
    var params={
      memberId: memberId,   // id
      storeName: storeName, //店铺名称
      memberType: memberType,
      promotionCode: promotionCode,
      hrCode: hrCode,
      provinceId: provinceId,
      cityId: cityId,
      regionId: regionId,
      regionName: regionName,
      address: address
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SHOP_STORE'),
      params: params
    });
  };

}]);
