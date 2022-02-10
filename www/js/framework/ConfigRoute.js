/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2016/3/14
 * describe：路由表
 **/
var route = function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive

  /*********** 我的模块 **********/

    //我的首页
    .state('mine', {
      url: '/mine',
      templateUrl: 'templates/mine/Mine.html',
      controller: 'MineController',
      requiredLogin: true
    })
    //账号信息
    .state('accountMessage', {
      url: '/accountMessage',
      templateUrl: 'templates/mine/account/AccountMessage.html',
      controller: 'AccountMessageController',
      requiredLogin: true
    })
    //昵称设置
    .state('changeName', {
      url: '/changeName/:userName/:birthday/:gender/:nickName/:email',
      templateUrl: 'templates/mine/account/ChangeName.html',
      controller: 'ChangeNameController',

      requiredLogin: true
    })
    //邮箱设置
    .state('changeEmail', {
      url: '/changeEmail/:userName/:birthday/:gender/:nickName/:email',
      templateUrl: 'templates/mine/account/ChangeEmail.html',
      controller: 'ChangeEmailController',
      requiredLogin: true
    })
    //修改密码
    .state('changePassword', {
      url: '/changePassword',
      templateUrl: 'templates/mine/account/ChangePassword.html',
      controller: 'ChangePasswordController',
      requiredLogin: true
    })
    //修改密码
    .state('selectSex', {
      url: '/selectSex/:userName/:birthday/:gender/:nickName/:email',
      templateUrl: 'templates/mine/account/SelectSex.html',
      controller: 'SelectSexController',
      requiredLogin: true
    })
    .state('easyConnectIframe', {
      url: '/easyConnectIframe/:content',
      templateUrl: 'templates/mine/getCash/EasyConnectIframe.html',
      controller: 'EasyConnectIframeController',
      requiredLogin: true
    })
    //绑定结果
    .state('bindResult', {
      url: '/bindResult',
      templateUrl: 'templates/mine/getCash/BindResult.html',
      controller: 'BindResultController',
      requiredLogin: true
    })
    //绑定人信息
    .state('bindAccount', {
      url: '/bindAccount',
      templateUrl: 'templates/mine/getCash/BindAccount.html',
      controller: 'BindAccountController',
      requiredLogin: true
    })
    //店铺信息
    .state('shopMessage', {
      url: '/shopMessage',
      templateUrl: 'templates/mine/shop/ShopMessage.html',
      controller: 'ShopMessageController',
      requiredLogin: true
    })
    //店铺名称
    .state('shopName', {
      url: '/shopName/:default',
      templateUrl: 'templates/mine/shop/ShopName.html',
      controller: 'ShopNameController',
      requiredLogin: true
    })
    //联盟分类
    .state('shopLegend', {
      url: '/shopLegend/:default/:provinceId/:cityId/:regionId/:hrCode',
      templateUrl: 'templates/mine/shop/ShopLegend.html',
      controller: 'ShopLegendController',
      requiredLogin: true
    })
    //店铺地址
    .state('shopAddress', {
      url: '/shopAddress/:default/:defaultDetail/:provinceId/:cityId/:regionId:/:hrCode/:memberType',
      templateUrl: 'templates/mine/shop/ShopAddress.html',
      controller: 'ShopAddressController',
      requiredLogin: true
    })
    //关于我们
    .state('aboutUs', {
      url: '/aboutUs',
      templateUrl: 'templates/mine/AboutUs.html',
      controller: 'AboutUsController',
      requiredLogin: true
    })
    //新版顺逛学堂
    .state('newClass', {
      url: '/newClass',
      templateUrl: 'templates/mine/newClass.html',
      controller: 'NewClassController',
      requiredLogin: true
    })
    //我的收货地址
    .state('address', {
      url: '/address/:comeFromOrder',
      templateUrl: 'templates/mine/Address/Address.html',
      controller: 'AddressController',
      requiredLogin: true
    })
    //修改地址
    .state('changeAddress', {
      url: '/changeAddress/:addressData',
      templateUrl: 'templates/mine/Address/ChangeAddress.html',
      controller: 'ChangeAddressController',
      requiredLogin: true
    })
    //添加收货地址
    .state('addAddress', {
      url: '/addAddress',
      templateUrl: 'templates/mine/Address/AddAddress.html',
      controller: 'AddAddressController',
      requiredLogin: true
    })
    //奖品收货地址
    .state('AddPrizeAddress', {
      url: '/AddPrizeAddress/:gameId/:uuid/:prizeId',
      templateUrl: 'templates/mine/Address/AddPrizeAddress.html',
      controller: 'AddPrizeAddressController',
      requiredLogin: true
    })
    //批量删除收货地址
    .state('batchDeleteAddress', {
      url: '/batchDeleteAddress',
      templateUrl: 'templates/mine/Address/BatchDeleteAddress.html',
      controller: 'BatchDeleteAddressController',
      requiredLogin: true
    })
    //我的购物车
    .state('shoppingCar', {
      url: '/shoppingCar',
      templateUrl: 'templates/mine/ShoppingCar.html',
      controller: 'ShoppingCarController',
      requiredLogin: true
    })
    //我的收藏
    .state('collection', {
      url: '/collection',
      templateUrl: 'templates/mine/Collection.html',
      controller: 'CollectionController',
      requiredLogin: true
    })
    //完善信息
    /*.state('newAuthenticationHome', {
      url: '/newAuthenticationHome/:promotionCode',
      templateUrl: 'templates/newAuthentication/newAuthenticationHome.html',
      controller: 'newAuthenticationHome'
    })*/
    //我要开店
    .state('newAuthenticationHome', {
      url: '/newAuthenticationHome/:promotionCode',
      templateUrl: 'templates/newAuthentication/newAuthenticationHomeV2.html',
      controller: 'newAuthenticationHomeV2'
    })
    //众筹接口
    .state('crowdFunding', {
      url: '/crowdFunding/:shareId/:type',
      templateUrl: 'templates/crowd_funding/CrowdFunding.html',
      controller: 'CrowdFundingHomeControl'
    })
     /*特产惠 start*/
    .state('localSpecialtyHomePage', {
      url: '/localSpecialtyHomePage/:storeId',
      templateUrl: 'templates/localSpecialty/localSpecialtyHomePage.html',
      controller: 'localSpecialtyHomePageController'
    })
    .state('SpecialtyVenueHome', {
      url: '/SpecialtyVenueHome/:regionId/:streetId/:shareId',
      templateUrl: 'templates/localSpecialty/specialtyVenueHome.html',
      controller: 'SpecialtyVenueHomeController'
    })
    //二级店铺
    .state('secondLevelStore', {
      url: '/secondLevelStore/:cityId/:shareId',
      templateUrl: 'templates/localSpecialty/secondLevelStore.html',
      controller: 'secondLevelStoreController'
    })
    .state('ListOfSpecialtyGoods', {
      url: '/ListOfSpecialtyGoods/:productCateId/:pageId/:storeId',
      templateUrl: 'templates/localSpecialty/listOfSpecialtyGoods.html',
      controller: 'ListOfSpecialtyGoodsController'
    })


     /*特产惠 end*/

    //实名认证
    .state('trueAuthentication', {
      url: '/trueAuthentication/:type',
      templateUrl: 'templates/newAuthentication/trueAuthentication.html',
      controller: 'trueAuthenticationControl'
    })
    .state('MechanismDescription', {
      url: '/MechanismDescription',
      templateUrl: 'templates/newAuthentication/MechanismDescription.html'
    })
    .state('trueAuthenticationList', {
      url: '/trueAuthenticationList',
      templateUrl: 'templates/newAuthentication/trueAuthenticationList.html',
      controller: 'trueAuthenticationListControl'
    })
    .state('haierStaff', {
      url: '/haierStaff',
      templateUrl: 'templates/newAuthentication/haierStaff.html',
      controller: 'haierStaffControl'
    })
    //绑定银行卡
    .state('bindingBankHome', {
      url: '/bindingBankHome',
      templateUrl: 'templates/bindingBank/bindingBankHome.html',
      controller: 'bindingBankControl',
      requiredLogin: true
    })
    //验证码
    .state('verificationCode', {
      url: '/verificationCode/:ownerName/:identityNo/:cardNo/:mobile/:bankNo/:phoneNumber',
      templateUrl: 'templates/bindingBank/verificationCode.html',
      controller: 'verificationCodeControl',
      requiredLogin: true
    })
   // 团队管理
    .state('teamSupervise', {
      url: '/teamSupervise',
      templateUrl: 'templates/teamSupervise/teamSupervise.html',
      controller: 'teamSuperviseController',
      requiredLogin: true
    })
    // 团队 成员信息
    .state('teamMessage', {
      url: '/teamMessage/:memberId/:type',
      templateUrl: 'templates/teamSupervise/teamMessage.html',
      controller: 'teamMessageController',
      requiredLogin: true
    })
    // 用户 成员信息
    .state('userMessage', {
      url: '/userMessage/:memberId/:name/:mobile/:isTeamNum',
      templateUrl: 'templates/teamSupervise/userMessage.html',
      controller: 'userMessageController',
      requiredLogin: true
    })
    // 用户搜索  userSearch
    .state('userSearch', {
      url: '/userSearch/:selectedIndex',
      templateUrl: 'templates/teamSupervise/userSearch.html',
      controller: 'userSearchController',
      requiredLogin: true
    })

    // 单品页  点击跳转到详情

    .state('crowd_funding_details', {
      url: '/crowd_funding_details/:zActivityId/:shareId',
      templateUrl: 'templates/crowd_funding/crowd_funding_details/crowd_funding_details.html',
      controller: 'crowd_funding_details_control'
    })

    // 详情页中 点击更多档位 跳转到 选择档位页
    .state('crowd_funding_hot_redound', {
      url: '/crowd_funding_hot_redound/:zActivityId',
      templateUrl: 'templates/crowd_funding/crowd_funding_hot_redound/crowd_funding_hot_redound.html',
      controller: 'crowd_funding_hot_redound_control'
    })
    // 选择档位页 ---- 填写订单
    .state('orderWrite', {
      url: '/orderWrite/:zStallsId/:number/:shareId',
      templateUrl: 'templates/crowd_funding/mdg-zhongchou/orderWrite.html',
      controller: 'orderWriteController',
      requiredLogin: true
    })
    //点击我的众筹 ---- 无关注页面
    .state('myRaiseNo', {
      url: '/myRaiseNo',
      templateUrl: 'templates/crowd_funding/mdg-zhongchou/MyRaiseNo.html',
      controller: 'MyRaiseNoController'
    })
    //点击订单列表里的某一个----订单详情页
    .state('orderDetails', {
      url: '/orderDetails/:orderSn/:cOrderSn/:cOrderId',
      templateUrl: 'templates/crowd_funding/mdg-zhongchou/OrderDetails.html',
      controller: 'OrderDetailsController',
      requiredLogin: true
    })

    .state('RiskDescription', {
      url: 'RiskDescription',
      templateUrl: 'templates/crowd_funding/mdg-zhongchou/RiskDescription.html',
      controller: 'RiskDescriptionController'
    })
    .state('SupportersAgreement', {
      url: 'SupportersAgreement',
      templateUrl: 'templates/crowd_funding/mdg-zhongchou/SupportersAgreement.html',
      controller: 'SupportersAgreementController'
    })
    //消息中心
    .state('messageCenter', {
      url: '/messageCenter/:messageType',
      templateUrl: 'templates/mine/messageCenter/MessageCenter.html',
      controller: 'MessageCenterController',
      requiredLogin: true
    })
    //消息分类
    .state('ClassifyMessageCenter' , {
    	url:'/ClassifyMessageCenter',
    	templateUrl: 'templates/mine/messageCenter/ClassifyMessageCenter.html',
    	controller: 'ClassifyMessageCenterController',
    	requiredLogin: true
    })
    //详细消息
    .state('detailMessageCenter', {
      url: '/detailMessageCenter/:title/:content',
      templateUrl: 'templates/mine/messageCenter/DetailMessageCenter.html',
      controller: 'DetailMessageCenterController',
      requiredLogin: true
    })
    //买家中心
    .state('buyerCenter', {
      url: '/buyerCenter/:shareStoreId',
      templateUrl: 'templates/mine/buyerCenter/BuyerCenter.html',
      controller: 'BuyerCenterController',
      requiredLogin: true
    })
    //会员竞争力
    .state('competition', {
      url: '/competition/:taskDestId/:taskType/:memberId',
      templateUrl: 'templates/mine/competition.html',
      controller: 'CompetitionController',
      cache:false
    })
    //我的钱包
    .state('myWallet', {
      url: '/myWallet',
      templateUrl: 'templates/mine/wallet/MyWallet.html',
      controller: 'MyWalletController',
      requiredLogin:true
    })
    //钱包下积分
    .state('walletIntegral', {
      url: '/walletIntegral',
      templateUrl: 'templates/mine/wallet/walletIntegral.html',
      controller: 'walletIntCtrl',
      requiredLogin:true
    })
    //钱包下钻石
    .state('walletDiamonds', {
      url: '/walletDiamonds',
      templateUrl: 'templates/mine/wallet/walletDiamonds.html',
      controller: 'walletDiamCtrl',
      requiredLogin:true
    })
  /*****end*****/
  /********** 公共页面 **********/
    //富页面展示
    .state('commonPageView', {
      url: '/commonPageView/:title/:content',
      templateUrl: 'templates/common/CommonPageView.html',
      controller: 'CommonPageViewController'
    })
    //地址选择
    .state('commonLocation', {
      url: '/commonLocation/:flag/:defaultValue/:data/:level/:title',//flag：用来区分是哪个页面选择的地址，广播标识位。defaultValue：默认值，可为空。data：空。
      templateUrl: 'templates/common/CommonLocation.html',
      controller: 'CommonLocationController'
    })
    .state('commonSelect', {
      url: '/commonSelect/:flag/:defaultValue/:data/:level/:title',//flag：用来区分是哪个页面选择的地址，广播标识位。defaultValue：默认值，可为空。data：空。
      templateUrl: 'templates/common/CommonSelect.html',
      controller: 'CommonSelectController'
    })
    //联盟分类
    .state('commonUnion', {
      url: '/commonUnion/:flag/:defaultValue/:data',
      templateUrl: 'templates/common/CommonUnion.html',
      controller: 'CommonUnionController'
    })
  /********** 购买流程 **********/
    //商品详情
    .state('productDetail', {
      url: '/productDetail/:productId/:o2oType/:fromType/:storeId/:shareStoreId',
      templateUrl: 'templates/product/productDetail.html',
      controller: 'ProductDetailController',
      cache:false
    })
    //3D_effect
    .state('productEffect', {
      url: '/productEffect/:vrUrl',
      templateUrl: 'templates/product/productEffect.html',
      controller: 'productEffectController'
    })
    //商品评价
    .state('productRated', {
      url: '/productRated/:productId',
      templateUrl: 'templates/product/productRated.html',
      controller: 'ProductRatedController'
    })
    //店铺预览
    .state('myStore', {
      url: '/myStore/:storeId/:shareStoreId/:token',
      templateUrl: 'templates/shop/MyStore.html',
      controller: 'MyStoreController'
    })
    //购物车
    .state('cart', {
      url: '/cart',
      templateUrl: 'templates/cart/Cart.html',
      controller: 'CartController'
    })
    //支付宝和微信 支付成功
    .state('payResultSuccess', {
      url: '/payResultSuccess',
      templateUrl: 'templates/order/payResultSuccess.html',
      controller: 'payResultSuccessController',
      requiredLogin: true
    })
    //支付宝和微信 支付失败
    .state('payResultFailure', {
      url: '/payResultFailure',
      templateUrl: 'templates/order/payResultFailure.html',
      requiredLogin: true
    })
    //定制页面
    .state('custom-made', {
      url: '/custom-made/:customMadeUrl',
      templateUrl: 'templates/mine/custom-made.html',
      controller: 'CustomMadeController',
      requiredLogin: true
    })
    //活动定制页面
    .state('CustomPage', {
      url: '/CustomPage/:customPageId',
      templateUrl: 'templates/shop/CustomPage.html',
      controller: 'CustomPageCtrl',
    })
    //顺逛会员
    .state('vip', {
      url: '/vip/:gameId/:msg',
      templateUrl: 'templates/mine/vip.html',
      controller: 'VipController',
      requiredLogin: true
    })
    //金币抽奖
    .state('goldgame', {
      url: '/goldgame/:gameId',
      templateUrl: 'templates/mine/goldgame.html',
      controller: 'VipController',
      requiredLogin: true
    })
    //为员工助力
    .state('helpStaff', {
      url: '/helpStaff/:memberId/:gameId/:channel',
      templateUrl: 'templates/game/helpStaff.html',
      controller: 'helpStaffController'
    })
    //顺逛会员 金币记录
   .state('goldRecord', {
     url: '/goldRecord',
     templateUrl: 'templates/mine/goldRecord.html',
     controller: 'goldRecordController',
     cache:false,
     requiredLogin: true
   })
    //顺逛会员页面转盘游戏
    .state('vipGame', {
      url: '/vipGame/:gameId/:shareStoreId/:isAdmin',
      templateUrl: 'templates/game/vipGame.html',
      controller: 'VipGameController',
      requiredLogin: true
    })
    //任务详情
    .state('missionDetail', {
      url: '/missionDetail/:taskId',
      templateUrl: 'templates/mine/Mission/missionDetail.html',
      controller: 'MissionDetailController',
      requiredLogin: true
    })
    //建行信用卡分期
    .state('ccbfenqi', {
      url: '/ccbfenqi/:orderSn/:whereName',
      templateUrl: 'templates/order/ccbfenqi.html',
      controller: 'CcbFenqiController',
      requiredLogin: true
    })
    //建行信用卡分期支付页面
    .state('ccbPay', {
      url: '/ccbPay/:url/:orderSn',
      templateUrl: 'templates/order/ccbPay.html',
      controller: 'CcbPayController',
      requiredLogin: true
    })
    //选择订单支付方式xyz
    .state('paymentxyz', {
      url: '/paymentxyz/:orderSn/:totalAmount',
      templateUrl: 'templates/order/Paymentxyz.html',
      controller: 'PaymentControllerxyz',
      requiredLogin: true
    })
    //确认订单
    .state('orderConfirm', {
      url: '/orderConfirm/:orderInitParams'  ,
      templateUrl: 'templates/order/orderConfirm.html',
      controller: 'OrderConfirmController',
      requiredLogin: true
    })
    //选择赠品
    .state('choiceOfGifts',{
      url: '/choiceOfGifts'  ,
      templateUrl: 'templates/order/choiceOfGifts.html',
      controller: 'choiceOfGiftsController',
      requiredLogin: true
    })
    //批量删除订单batchDeleteOrder
    .state('batchDeleteOrder', {
      url: '/batchDeleteOrder',
      templateUrl: 'templates/shop/batchDeleteOrder.html',
      controller: 'batchDeleteOrderController',
      requiredLogin: true
    })
    //订单提交成功
    .state('afterOrderSubmit', {
      url: '/afterOrderSubmit/:messageData/:paymentCode',
      templateUrl: 'templates/order/afterOrderSubmit.html',
      controller: 'AfterOrderSubmitController',
      requiredLogin: true
    })
    //选择支付方式
    .state('payment', {
      url: '/payment/:paymentCode',
      templateUrl: 'templates/order/Payment.html',
      controller: 'PaymentController',
      requiredLogin: true
    })
    //选择配送时间
    .state('sendGoodsTime', {
      url: '/sendGoodsTime',
      templateUrl: 'templates/order/SendGoodsTime.html',
      controller: 'SendGoodsTimeController',
      requiredLogin: true
    })
    //首页
    .state('homePage', {
      url: '/homePage',
      templateUrl: 'templates/product/homePage.html',
      controller: 'HomePageController'
    })
    //更多
    .state('seeMore', {
      url: '/seeMore',
      templateUrl: 'templates/product/seeMore.html',
      controller: 'SeeMoreController'
    })
    //智能家居体验
    .state('familytry', {
      url: '/familytry',
      templateUrl: 'templates/product/familytry.html',
      controller: 'familytryController'
    })
    .state('familydetail', {
      url: '/familydetail/:detailUrl/:title',
      templateUrl: 'templates/product/familydetail.html',
      controller: 'familydetailController',
      cache:false
    })
    //家电商场
    .state('electricalMall', {
      url: '/electricalMall',
      templateUrl: 'templates/product/electricalMall.html',
      controller: 'ElectricalMallController',
    })
    //家居家装
    .state('furnish', {
      url: '/furnish',
      templateUrl: 'templates/product/furnish.html',
      controller: 'furnishController'
    })
    //百货超市
    .state('superMarket', {
      url: '/superMarket',
      templateUrl: 'templates/product/superMarket.html',
      controller: 'superMarketController'
    })
    //选品页面商品搜索
    .state('goodsSearch', {
      url: '/goodsSearch/:front/:shareStoreId',
      templateUrl: 'templates/product/GoodsSearch.html',
      controller: 'GoodsSearchController'
    })
    //商品列表
    .state('CommodityList', {
      url: '/CommodityList/:couponId',
      templateUrl: 'templates/product/CommodityList.html',
      controller: 'CommodityListController'
    })
    //商品详情-图文详情
    .state('imageAndWord', {
      url: '/imageAndWord/:productId',
      cache:'false',
      templateUrl: 'templates/product/imageAndWord.html',
      controller: 'ImageAndWordController'
    })
    //商品详情-规格参数
    .state('specifications', {
      url: '/specifications/:productId',
      templateUrl: 'templates/product/Specifications.html',
      controller: 'SpecificationsController'
    })
    //设置发票
    .state('invoiceSetup', {
      url: '/invoiceSetup/:invoiceHead/:invoiceType/:enterPage',
      templateUrl: 'templates/invoice/InvoiceSetup.html',
      controller: 'InvoiceSetupController',
      requiredLogin: true
    })
    //分类
    .state('branchType', {
      url: '/branchType',
      templateUrl: 'templates/product/branchType.html',
      controller: 'BranchTypeController'
    })
    //分类详情
    .state('branchTypeDetail', {
      url: '/branchTypeDetail/:productCateId',
      templateUrl: 'templates/product/branchTypeDetail.html',
      controller: 'BranchTypeDetailController'
    })
    //店铺管理
    .state('myStoreManage', {
      url: '/myStoreManage',
      templateUrl: 'templates/mine/myStore/myStoreManage.html',
      controller: 'MyStoreManageController',
      requiredLogin: true
    })
    //售后
    .state('customerService', {
      url: '/customerService',
      templateUrl: 'templates/shop/customerService.html',
      controller: 'CustomerServiceController',
      requiredLogin: true
    })
    //手机号管理
    .state('myPhoneManage', {
        url: '/myPhoneManage',
        templateUrl: 'templates/mine/phone/myPhoneManage.html',
        controller: 'MyPhoneManageController',
        requiredLogin: true
     })
     //绑定手机成功
    .state('myPhoneBindSuccess', {
        url: '/myPhoneBindSuccess/:phone',
        templateUrl: 'templates/mine/phone/myPhoneBindSuccess.html',
        controller: 'MyPhoneBindSuccessController',
        requiredLogin: true
     })
     //输入短信验证码
    .state('myPhoneCode', {
        url: '/myPhoneCode',
        templateUrl: 'templates/mine/phone/myPhoneCode.html',
        controller: 'MyPhoneCodeController',
        requiredLogin: true
     })
     //绑定手机号
    .state('myPhoneBind', {
        url: '/myPhoneBind/:realName/:identityNo',
        templateUrl: 'templates/mine/phone/myPhoneBind.html',
        controller: 'MyPhoneBindController',
        requiredLogin: true
     })
     //绑定新手机号-验证码
    .state('myPhoneBindNewCode', {
        url: '/myPhoneBindNewCode/:mobile/:realName/:identityNo',
        templateUrl: 'templates/mine/phone/myPhoneBindNewCode.html',
        controller: 'MyPhoneBindNewCodeController',
        requiredLogin: true
     })
    //身份证认证
     .state('myIdCardAuthen', {
         url: '/myIdCardAuthen/:isAuth',
         templateUrl: 'templates/mine/phone/myIdCardAuthen.html',
         controller: 'MyIdCardAuthenController',
         requiredLogin: true
      })
  /********** 小店模块 **********/
    //小店首页
    .state('shop', {
      url: '/shop/:token',
      templateUrl: 'templates/shop/Shop.html',
      controller: 'ShopController'
    })
    //微学堂
    .state('microSchool', {
      url: '/microSchool',
      templateUrl: 'templates/shop/MicroSchool.html',
      controller: 'MicroSchoolController'
    })
    //微学堂详情
    .state('microSchoolDetail', {
      url: '/microSchoolDetail/:childId/:id/:title',
      templateUrl: 'templates/shop/MicroSchoolDetail.html',
      controller: 'MicroSchoolControllerDetail'
    })
    //小店营收
    .state('shopRevenue', {
      url: '/shopRevenue',
      templateUrl: 'templates/shop/ShopRevenue.html',
      controller: 'ShopRevenueController',
      requiredLogin: true
    })
    //小店营收－表单详细内容页面
    .state('revenueDetail', {
      url: '/revenueDetail/:code/:title/:earningType',
      templateUrl: 'templates/shop/RevenueDetail.html',
      controller: 'RevenueDetailController',
      requiredLogin: true
    })
    //营收详细二级页
    .state('monthReward', {
      url: '/monthReward/:code/:title/:earningType',
      templateUrl: 'templates/shop/yingshouDetail/monthReward.html',
      controller: 'monthRewardController'
    })
    .state('otherReward', {
      url: '/otherReward/:code/:title/:earningType',
      templateUrl: 'templates/shop/yingshouDetail/otherReward.html',
      controller: 'otherRewardController'
    })
    .state('someReward', {
      url: '/someReward/:code/:title/:earningType/:rewardType',
      templateUrl: 'templates/shop/yingshouDetail/someReward.html',
      controller: 'someRewardController'
    })
    .state('yongjinDetail', {
      url: '/yongjinDetail/:code/:title/:earningType/:start/:end',
      templateUrl: 'templates/shop/yingshouDetail/yongjinDetail.html',
      controller: 'yongjinDetailController'
    })
    //店铺装修页面
    .state('shopRenovate', {
      url: '/shopRenovate',
      templateUrl: 'templates/shop/ShopRenovate.html',
      controller: 'ShopRenovateController'
    })
    //店铺装修-设置店铺封面页面
    .state('setShopCover', {
      url: '/setShopCover',
      templateUrl: 'templates/shop/SetShopCover.html',
      controller: 'SetShopCoverController'
    })
    //店铺装修-选择店铺模板
    .state('chooseShopTemplate', {
      url: '/chooseShopTemplate',
      templateUrl: 'templates/shop/ChooseShopTemplate.html',
      controller: 'ChooseShopTemplateController'
    })
    //提现成功
    .state('withdrawSuccess', {
      url: '/withdrawSuccess/:content',
      templateUrl: 'templates/shop/WithdrawSuccess.html',
      controller: 'WithdrawSuccessController'
    })
    //新手必看和顺逛帮助
    .state('newHand', {
      url: '/newHand',
      templateUrl: 'templates/shop/NewHand.html',
      controller: 'HelpController'
    })
    //商品管理
    .state('goodsManage', {
      url: '/goodsManage',
      templateUrl: 'templates/shop/GoodsManage.html',
      controller: 'GoodsManageController',
      requiredLogin: true
    })
    //订单管理xyz修改传参数3.9
    .state('orderManage', {
      url: '/orderManage/:orderStatus/:isPayCoupon/:orderType/:orderFlag',
      templateUrl: 'templates/shop/OrderManage.html',
      controller: 'OrderManageController',
      requiredLogin: true
    })//订单搜索
    .state('orderSearch', {
      url: '/orderSearch',
      templateUrl: 'templates/order/OrderSearch.html',
      controller: 'OrderSearchController',
      requiredLogin: true
    })
    //订单详情
    .state('orderDetail', {
      url: '/orderDetail/:orderSn/:cOrderSn/:cOrderId',
      templateUrl: 'templates/shop/OrderDetail.html',
      controller: 'OrderDetailController',
      requiredLogin: true
    })
    // 合伙人 人脉搜索
    .state('connectionSearch', {
      url: '/connectionSearch/:searchType',
      templateUrl: 'templates/shop/ConnectionSearch.html',
      controller: 'ConnectionSearchController',
      requiredLogin: true
    })
    //订单追踪
    .state('orderTracking', {
      url: '/orderTracking/:orderSn',
      templateUrl: 'templates/shop/OrderTracking.html',
      controller: 'OrderTrackingController',
      requiredLogin: true
    })
    //车辆轨迹
    .state('carTracking', {
      url: '/carTracking/:trackUrl',
      templateUrl: 'templates/order/CarTracking.html',
      controller: 'CarTrackController'
    })
    //退款详情
    .state('refundDetail', {
      url: '/refundDetail/:orderProductId/:memberId',
      templateUrl: 'templates/shop/RefundDetail.html',
      controller: 'RefundDetailController',
      requiredLogin: true
    })
    //帮助详细页面
    .state('helpDetail', {
      url: '/helpDetail/:helpId/:content',
      templateUrl: 'templates/shop/HelpDetail.html',
      controller: 'HelpDetailController'
    })
    //问题反馈
    .state('feedback', {
      url: '/feedback',
      templateUrl: 'templates/shop/Feedback.html',
      controller: 'FeedbackController',
      requiredLogin: true
    })
    //申请退款
    .state('applyRefund', {
      url: '/applyRefund/:cOrderSn',
      templateUrl: 'templates/shop/ApplyRefund.html',
      controller: 'ApplyRefundController',
      requiredLogin: true
    })
    //发表评价
    .state('publicationEvaluation', {
      url: '/publicationEvaluation/:cOrderSn',
      templateUrl: 'templates/shop/publicationEvaluation.html',
      controller: 'publicationEvaluationController',
      requiredLogin: true
    })
    //追评
    .state('chaseEvaluate', {
      url: '/chaseEvaluate/:cOrderSn/:isMeorder',
      templateUrl: 'templates/shop/chaseEvaluate.html',
      controller: 'chaseEvaluateController',
      requiredLogin: true
    })
    //评价成功
    .state('criticalSuccess', {
      url: '/criticalSuccess/:cOrderSn',
      templateUrl: 'templates/shop/criticalSuccess.html',
      controller: 'criticalSuccessController',
      requiredLogin: true
    })
    //评价成功
    .state('evaluationSuccess', {
      url: '/evaluationSuccess',
      templateUrl: 'templates/shop/evaluationSuccess.html',
      controller: 'evaluationSuccessController'
    })
    //产品使用心得
    .state('useExperience', {
      url: '/useExperience/:cOrderSn',
      templateUrl: 'templates/shop/useExperience.html',
      controller: 'useExperienceController'
    })
    //查看评价
    .state('lookAssess', {
      url: '/lookAssess/:orderId/:cOrderSn',
      templateUrl: 'templates/shop/LookAssess.html',
      controller: 'LookAssessController',
      requiredLogin: true
    })
    //确认收货
    .state('confirmReceive', {
      url: '/confirmReceive/:orderId',
      templateUrl: 'templates/order/ConfirmReceive.html',
      controller: 'ConfirmReceiveController',
      requiredLogin: true
    })
    //VR展示页  勿动
    .state('VrPage', {
      url: '/VrPage/:isH5',
      templateUrl: 'templates/shop/VR.html',
      controller: 'VRController',
      cache:false
    })
    //理财
    .state('manageMoney', {
      url: '/manageMoney/:frontState',
      templateUrl: 'templates/shop/ManageMoney.html',
      controller: 'ManageMoneyController',
      requiredLogin: true
    })
  /********** 优惠券 **********/
    //领券中心
    .state('getCouponsList', {
      url: '/getCouponsList/:shareStoreId',
      templateUrl: 'templates/coupons/GetCouponsList.html',
      controller: 'GetCouponsListController'
    })
    .state('couponsDetail', {
      url: '/couponsDetail/:cId/:userID/:type/:status/:isUser',
      templateUrl: 'templates/coupons/CouponsDetail.html',
      controller: 'CouponsDetailController'
    })
    .state('couponsDetailTwo', {
      url: '/couponsDetailTwo/:cId/:userID/:type/:status/:couponId/:isUser',
      templateUrl: 'templates/coupons/CouponsDetailTwo.html',
      controller: 'CouponsDetailTwoController'
    })
    //可使用优惠券列表
    .state('useCouponsList', {
      url: '/useCouponsList/:type/:productId/:sku/:couponId',
      templateUrl: 'templates/coupons/UseCouponsList.html',
      controller: 'UseCouponsListController'
    })

    //尾款支付可使用优惠券列表xyz添加
        .state('Retainage', {
          url: '/Retainage/:relationOrderSn/:relationOrderAmount/:isPayCoupon',
          templateUrl: 'templates/coupons/Retainage.html',
          controller: 'RetainageController'
        })

    //个人中心我的优惠券界面
    .state('myCouponsList', {
      url: '/myCouponsList',
      templateUrl: 'templates/coupons/MyCouponsList.html',
      controller: 'MyCouponsListController'
    })
    //个人中心页面
    .state('personnalCenter', {
      url: '/personnalCenter',
      templateUrl: 'templates/mine/PersonalCenter.html',
      controller: 'PersonalCenterController',
      requiredLogin: true
    })
  /********** 优惠券 **********/


  /********** 注册登录模块 **********/
    //注册
    /*.state('register', {
      url: '/register/:hasHistory/:promotionCode',
      templateUrl: 'templates/login/Register.html',
      controller: 'RegisterController'
    })*/
    /********* 注册改造 *********/
    .state("register",{
      url:'/register/:hasHistory/:promotionCode',
      templateUrl:'templates/login/RegisterV2.html',
      controller:'RegisterV2Controller'
    })
    /********* 注册改造 *********/
    //第三方登录时 开店前 要先绑定手机号
    .state('registerForStore', {
      url: '/registerForStore/:hasHistory',
      templateUrl: 'templates/login/RegisterForStore.html',
      controller: 'RegisterForStoreController'
    })
    .state('RegisterForStoreLogin', {
      url: '/RegisterForStoreLogin/:hasHistory',
      templateUrl: 'templates/login/RegisterForStoreLogin.html',
      controller: 'RegisterForStoreLoginController'
    })
    //登录
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login/Login.html',
      controller: 'LoginController'
    })
    //广告推荐页
    .state('advertisement', {
      url: '/advertisement/:from',
      templateUrl: 'templates/login/Advertisement.html',
      controller: 'AdvertisementController'
    })
    //用户协议
    .state('userAgreement', {
      url: '/userAgreement',
      templateUrl: 'templates/login/UserAgreement.html'
    })
    //引导页
    .state('guidePage', {
      url: '/guidePage/:back',
      templateUrl: 'templates/login/GuidePage.html',
      controller: 'GuidePageController'
    })
    //店铺申请成功
    .state('shopApplySuccess', {
      url: '/shopApplySuccess/:totalCommission/:memberCount/:memberRegionCount',
      templateUrl: 'templates/login/ShopApplySuccess.html',
      controller: 'ShopApplySuccessController'
    })
    //找回密码
    .state('requestPassword', {
      url: '/requestPassword',
      templateUrl: 'templates/login/RequestPassword.html',
      controller: 'RequestPasswordController'
    }).state('game', {
      url: '/game/:gameId/:shareStoreId/:isAdmin',
      templateUrl: 'templates/game/game.html',
      controller: 'GameController'
    }).state('seckillList', {
      url: '/seckillList/:shareStoreId',//todo 分享时 注意加storeId
      templateUrl: 'templates/seckill/seckillList.html',
      controller: 'SeckillListController'
    })
    //秒杀商品详情
    .state('seckillDetail', {
      url: '/seckillDetail/:productId/:o2oType/:fromType/:storeId/:front/:seckillPrice/:seckillId/:sku/:status/:beginTime/:endTime/:shareStoreId',
      templateUrl: 'templates/seckill/seckillDetail.html',
      controller: 'SeckillDetailController',
      requiredLogin: true
    }).state('orderConfirmSeckill', {

      url: '/orderConfirmSeckill/:seckillId/:numbers/:productIds/:beginTime/:endTime',
      templateUrl: 'templates/seckill/orderConfirmSeckill.html',
      controller: 'OrderConfirmSeckillController',
      requiredLogin: true
    })
    .state('bannerTheme', {
      url: '/bannerTheme/:bannerId/:shareStoreId/:platformType',
      templateUrl: 'templates/shop/BannerTheme.html',
      controller: 'BannerThemeController'
    })
    //自定义活动
    .state('customizehd', {
      url: '/customizehd/:url',
      templateUrl: 'templates/login/customizehd.html',
      controller: 'CustomizehdController'
    })
    .state('bannerDaily', {
      url: '/bannerDaily/:bannerId/:layout/:shareStoreId/:platformType',
      templateUrl: 'templates/shop/BannerDaily.html',
      controller: 'BannerDailyController'
    })
    //invoiceHtml
    .state('invoiceHtml', {
      url: '/invoiceHtml/:invoiceSrc',
      templateUrl: 'templates/common/invoiceHtml.html',
      controller: 'invoiceHtmlController'
    })
    // 设置页面js/mine/Setup.js
    .state('Setup', {
      url: '/Setup',
      templateUrl: 'templates/mine/Setup.html',
      controller: 'SetupController'
    })
    //xyz任务分享
    .state('taskShare', {
      url: '/taskShare',
      templateUrl: 'templates/mine/Mission/taskShare.html',
      controller: 'taskShareController',
      requiredLogin: true
    })
    //xyz历史任务
    .state('historyTask', {
      url: '/historyTask',
      templateUrl: 'templates/mine/Mission/historyTask.html',
      controller: 'historyTaskController',
      requiredLogin: true
    })
    //开门红抽奖
    .state('anAuspiciousStart', {
      url: '/anAuspiciousStart/:anAuspiciousId',
      templateUrl: 'templates/goodStart/anAuspiciousStart.html',
      controller: 'anAuspiciousStartController',
      requiredLogin: true
    })
    .state('Customer', {
      url: '/Customer',
      templateUrl: 'templates/mine/Customer.html'
    })
    //登录
    .state('newUserLogin', {
      url: '/login/newUserLogin',
      templateUrl: 'templates/login/thirdLogin/newUserLogin.html',
      controller: 'newUserLoginController'
    })
    //绑定成功
    .state('relactOK', {
      url: '/login/relactOK/:nickname/:mobile/:email',
      templateUrl: 'templates/login/thirdLogin/relactOK.html',
      controller: 'relactOKController'
    })

  /**********************************圈子相关路由在此处配置*******************************************/
    //  顺逛社区
    .state('topic', {
      url: '/topic',
      templateUrl: 'templates/quanzi/Topic.html',
      abstract: true,
      controller: 'TopicController'
    })
    .state('qzMessageCenter', {
      url: '/qzMessageCenter',
      templateUrl: 'templates/quanzi/qzMessageCenter.html',
      controller: 'qzMessageCenterController'
    })
    //编辑发话题
    .state('publishEdit', {
      url: '/publishEdit/:topicId/:noteId/:isShortStory',
      templateUrl: 'templates/quanzi/PublishEdit.html',
      controller: 'PublishEditController'
    })
    //全部圈子
    .state('allCircle', {
      url: '/allCircle',
      templateUrl: 'templates/quanzi/AllCircle.html',
      controller: 'AllCircleController'
    })
    //我的圈子
    .state('myCirclePages', {
      url: '/myCirclePages',
      templateUrl: 'templates/quanzi/MyCirclePages.html',
      controller: 'MyCirclePagesController'
    })
    //我的课程
    .state('myLessones', {
      url: '/myLessones',
      templateUrl: 'templates/quanzi/MyLessones.html',
      controller: 'MyLessonesController'
    })
    //申请圈子
    .state('applyCircle', {
      url: '/applyCircle',
      templateUrl: 'templates/quanzi/ApplyCircle.html',
      controller: 'ApplyCircleController'
    })
    //圈子详情
    .state('circlePage',{
      url:'/circlePage/:circleId',
      templateUrl:'templates/quanzi/CirclePage.html',
      controller:'CirclePageController'
    })
    //start @zyr
    .state('signInChart',{
      url:'/signInChart/:topicId',
      templateUrl:'templates/quanzi/signInChart.html',
      controller:'signInChartController'
    })
    .state('signDate',{
      url:'/signDate/:userId/:topicId/:monthFlag',
      templateUrl:'templates/quanzi/signDate.html',
      controller:'signDateController'
      // controller:'accsettingCtrl'
    })
    //end @zyr
    //选择标签
    .state('selectTags',{
      url:'/selectTags',
      templateUrl:'templates/quanzi/SelectTags.html',
      controller:'SelectTagsController'
    })
    //消息详情
    .state('messageDetails',{
      url:'/messageDetails',
      templateUrl:'templates/quanzi/MessageDetails.html',
      controller:'MessageDetailsController'
    })
    //发表话题
    .state('publishCircle',{
      url:'/publishCircle/:identifierCode/:topicId',
      templateUrl:'templates/quanzi/PublishCircle.html',
      controller:'PublishCircleController',
      requiredLogin: true
    })
    //全部成员
    .state('allMembers',{
      url:'/allMembers/:topicId',
      templateUrl:'templates/quanzi/AllMembers.html',
      controller:'AllMembersController',
      cache:false
    })
    .state('selectGoods',{
      url:'/selectGoods',
      templateUrl:'templates/quanzi/SelectGoods.html',
      controller:'SelectGoodsController'
    })
    //普通贴子话题详情
    .state('noteDetails',{
      url:'/noteDetails/:noteId/:isShortStory/:shareStoreId',
      templateUrl:'templates/quanzi/NoteDetails.html',
      controller:'NoteDetailsController'
    })
    //微学堂贴子话题详情
    .state('classNoteDetails',{
      url:'/classNoteDetails/:noteId',
      templateUrl:'templates/quanzi/ClassNoteDetails.html',
      controller:'ClassNoteDetailsController'
    })
    //微学堂课堂页
    .state('classesDetails',{
      url:'/classesDetails',
      templateUrl:'templates/quanzi/ClassesDetails.html',
      controller:'ClassesDetailsController'
    })
    //微学堂考试页
    .state('testPage',{
      url:'/testPage',
      templateUrl:'templates/quanzi/TestPage.html',
      controller:'TestPageController'
    })
    //微学堂考试题页
    .state('testDetails',{
      url:'/testDetails',
      templateUrl:'templates/quanzi/TestDetails.html',
      controller:'TestDetailsController'
    })
    //微学堂留言板问题详情页
    .state('questionDetails',{
      url:'/questionDetails/:wordsId',
      templateUrl:'templates/quanzi/QuestionDetails.html',
      controller:'QuestionDetailsController'
    })
    //    圈子-热门
    .state('topic.qhot', {
      url: '/qhot',
      views: {
        'topic-qhot': {
          templateUrl: 'templates/quanzi/qhot.html',
          controller: 'QhotController'
        }
      }
    })
    //圈子-我的圈子
    .state('topic.qmine', {
      url: '/qmine',
      views: {
        'topic-qmine': {
          templateUrl: 'templates/quanzi/qmine.html',
          controller: 'QmineController'
        }
      },
      requiredLogin: true
    })
    //    圈子-微学堂
    .state('topic.qwschool', {
      url: '/qwschool',
      views: {
        'topic-qwschool': {
          templateUrl: 'templates/quanzi/qwschool.html',
          controller: 'QwschoolController'
        }
      }
    })
    // TA的主页--TA的发布 @zyr
    .state('heIssue', {
      url: '/heIssue/:title/:who/:id',
      templateUrl: 'templates/quanzi/heIssue.html',
      controller: 'heIssueController',
      requiredLogin: true
    })
    //  资料库
    .state('qdatabase', {
      url: '/qdatabase',
      templateUrl: 'templates/quanzi/qdatabase.html',
      controller: 'QdatabaseController'
    })
    //  话题详情
    .state('topicdetails', {
      url: '/topicdetails',
      templateUrl: 'templates/quanzi/Topicdetails.html',
      controller: 'TopicdetailsController',
      params: {huatiid: null}
    })
    //  搜索页1
    .state('qSearch', {
      url: '/qSearch',
      templateUrl: 'templates/quanzi/qSearch.html',
      controller: 'qSearchController'
    })
    //  搜索页2
    .state('qSearchTwo', {
      url: '/qSearchTwo',
      templateUrl: 'templates/quanzi/qSearchTwo.html',
      controller: 'qSearchTwoController',
      params: {tagIds: null,tagname:null}
    })
    //  搜索页-标签,用户,帖子
    .state('qSearchThree', {
      url: '/qSearchThree',
      templateUrl: 'templates/quanzi/qSearchThree.html',
      controller: 'qSearchThreeController',
      params: {keywords: null}
    })
    //  搜索页-标签
    .state('qSearchBiao', {
      url: '/qSearchBiao',
      templateUrl: 'templates/quanzi/qSearchBiao.html',
      controller: 'qSearchBiaoController',
      params: {keywords: null}
    })
    //  搜索页-帖子
    .state('qSearchTie', {
      url: '/qSearchTie',
      templateUrl: 'templates/quanzi/qSearchTie.html',
      controller: 'qSearchTieController',
      params: {keywords: null}
    })
    //  搜索页-用户
    .state('qSearchUser', {
      url: '/qSearchUser',
      templateUrl: 'templates/quanzi/qSearchUser.html',
      controller: 'qSearchUserController',
      params: {keywords: null}
    })
    .state('personalHomepageMe', {
      url: '/personalHomepageMe',
      templateUrl: 'templates/quanzi/personalHomepageMe.html',
      controller: 'personalHomepageMeCtrl',
      requiredLogin: true
    })
    .state('personalHomepageHe', {
      url: '/personalHomePageHe/:othersId',
      templateUrl: 'templates/quanzi/personalHomePageHe.html',
      controller: 'personalHomepageHeCtrl'
    })
    .state('myFollow', {
      url: '/personalHomepageMe/myFollow',
      templateUrl: 'templates/quanzi/myFollow.html',
      controller: 'myFollowCtrl'
    })
    .state('myFans', {
      url: '/personalHomepageMe/myFans',
      templateUrl: 'templates/quanzi/myFans.html',
      controller: 'myFansCtrl'
    })
    .state('moreInteresting', {
      url: '/personalHomepageMe/moreInteresting',
      templateUrl: 'templates/quanzi/moreInteresting.html',
      controller: 'moreInterestingCtrl'
    })
    .state('mySettings', {
      url: '/personalHomepageMe/mySettings',
      templateUrl: 'templates/quanzi/mySettings.html',
      controller: 'mySettingsCtrl'
    })
    .state('quanziRecommend', {
      url: '/quanziRecommend',
      templateUrl: 'templates/quanzi/quanziRecommend.html',
      controller: 'communityRecommendCtrl'
    })
    .state('exam', {
      url: '/exam',
      templateUrl: 'templates/quanzi/exam.html',
      controller: 'examCtrl'
    })
    .state('customerConversation', {//客服聊天 访客端页面
      url: '/customerConversation',
      templateUrl: 'templates/quanzi/CustomerConversation.html',
      controller: 'CustomerConversationController',
      params:{products:undefined}
    })
    .state('serviceConversation', {//客服聊天 访客断页面
      url: '/serviceConversation/:chatId/:from/:to',
      templateUrl: 'templates/quanzi/ServiceConversation.html',
      controller: 'ServiceConversationController'
    })
    .state('groupSetting', {
      url: '/groupSetting/:groupId/:circleId',
      templateUrl: 'templates/quanzi/DiscussionGroup.html',
      controller: 'GroupSettingController'
    })
    .state('discussionGroup', {
      url: '/discussionGroup/:groupId/:circleId',
      templateUrl: 'templates/quanzi/DiscussionGroup.html',
      controller: 'GroupSettingController'
    })
    // 绑定银行卡start
    .state('bankCard', {
      url: '/bankCard',
      templateUrl: 'templates/mine/Bank/bankCard.html',
      controller: 'BankCardController'
    })
    .state('bankCardDetail', {
      url: '/bankCardDetail/:cardNoShow/:nameKjt',
      templateUrl: 'templates/mine/Bank/bankCardDetail.html',
      controller: 'bankCardDetailController'
    })
    .state('chooseTheBank', {
      url: '/chooseTheBank',
      templateUrl: 'templates/mine/Bank/chooseTheBank.html',
      controller: 'chooseTheBankController'
    })
    .state('bankSupport', {
      url: '/bankSupport',
      templateUrl: 'templates/mine/Bank/bankSupport.html',
      controller: 'bankSupportController'
    })
    .state('mentionCenter', {
      url: '/mentionCenter/:canAmount',
      templateUrl: 'templates/mine/Bank/mentionCenter.html',
      controller: 'mentionCenterController',
      requiredLogin: true
    })
    // 绑定银行卡end
    // 微店主数据统计开始
    .state('dataAnalysis', {
      url: '/dataAnalysis/:memberId',
      templateUrl: 'templates/statistics/dataAnalysis.html',
      controller: 'dataAnalysisController'
    })
    // 微店主数据统计结束
    // start@zyr
      // 访客浏览记录
    .state('VisitorBrowHistory', {
      url: '/VisitorBrowHistory/:userId/:daysType',
      templateUrl: 'templates/mine/VisitorBroHistory/VisitorBrowHistory.html',
      controller: 'VisiBroHisController'
    })
      //合伙人
    .state('Partner', {
      url: '/Partner/:title/:memberId',
      templateUrl: 'templates/mine/Partner/Partner.html',
      controller: 'PartnerController'
    })
      //团队
    .state('team', {
      url: '/team',
      templateUrl: 'templates/mine/teamData/team.html',
      controller: 'TeamController'
    })
     // 店铺*团队*个人 ***数据
    .state('storeTeamOwner', {
      url: '/storeTeamOwner',
      templateUrl: 'templates/mine/storeTeamOwner/storeTeamOwner.html',
      controller: 'storeTeamOwnerController'
    })
    //店铺*团队*个人 ***详情
    .state('teamProductMsg', {
      url: '/teamProductMsg/:num/:type',
      templateUrl: 'templates/mine/storeTeamOwner/teamProductMsg.html',
      controller: 'teamProductMsgController'
    })
    // end@zyr
    .state('schoolGroupDiscuss', {
      url: '/schoolGroupDiscuss',
      templateUrl: 'templates/quanzi/SchoolGroupDiscuss.html',
      controller: 'SchoolGroupDiscussController'
    }).state('circleGroupDiscuss', {
      url: '/circleGroupDiscuss/:groupId/:circleId',
      templateUrl: 'templates/quanzi/CircleGroupDiscuss.html',
      controller: 'CircleGroupDiscussController'
    }).state('groupAddMember', {
      url: '/groupAddMember/:groupId/:circleId',
      templateUrl: 'templates/quanzi/GroupAddMember.html',
      controller: 'GroupAddMemberController'
    }).state('groupEditMember', {
      url: '/groupEditMember/:groupId',
      templateUrl: 'templates/quanzi/GroupEditMember.html',
      controller: 'GroupEditMemberController'
    }).state('groupsToShare', {
      url: '/groupsToShare',
      templateUrl: 'templates/quanzi/GroupsToShare.html',
      controller: 'GroupsToShareController',
      params:{shareList:undefined}
    }).state('shareListPage', {
      url: '/shareListPage',
      templateUrl: 'templates/quanzi/ShareListPage.html',
      controller: 'ShareListPageController',
      params:{sl:undefined}
    }).state('feedbackPlus', {
      url: '/feedbackPlus',
      templateUrl: 'templates/mine/FeedbackPlus.html',
      controller: 'FeedbackPlusController'
    }).state('newSend',{
      url:'/newSend',
      templateUrl:'templates/newsend/newSend.html',
      controller:'newsendCtrl',
      cache:false
    }).state('flashsale',{
      url:'/flashsale/:type',
      templateUrl:'templates/flashsale/flashsale.html',
      controller:'flashsaleCtrl',
    }).state('newres',{
      url:'/newres/:type',
      templateUrl:'templates/newres/newres.html',
      controller:'newresCtrl',
      cache:false
    })
    .state('myAppointment',{//我的预约
      url:'/myAppointment',
      templateUrl:'templates/mine/myAppointment.html',
      controller:'myAppointmentController'
    })
    .state('presell',{
      url:'/presell',
      templateUrl:'templates/presell/presell.html',
      controller:'presellCtrl',
      cache:false
    })
    .state('accsetting',{
      url:'/accsetting',
      templateUrl:'templates/mine/accsetting.html',
      controller:'accsettingCtrl'
    })
    .state('accsafe',{
      url:'/accsafe',
      templateUrl:'templates/mine/accsafe.html',
      controller:'accsafeCtrl'
    })
    //关联商品
    .state('relatedProduct', {
      url: '/relatedProduct',
      templateUrl: 'templates/quanzi/relatedProduct.html',
      controller: 'relatedProductController'
    })
    //关联商品
    // .state('topicPublish', {
    //   url: '/topicPublish',
    //   templateUrl: 'templates/quanzi/topicPublish.html',
    //   controller: 'topicPublishController'
    // })
    //打赏列表
    .state('topicRewardList', {
      url: '/topicRewardList/:tipId',
      templateUrl: 'templates/quanzi/topicRewardList.html',
      controller: 'topicRewardListController'
    })
    //设置管理员
    .state('CircleSetAdmin', {
      url: '/CircleSetAdmin/:topicId',
      templateUrl: 'templates/quanzi/CircleSetAdmin.html',
      controller: 'CircleSetAdminController'
    })
    //增加管理员
    .state('selectAdmin', {
      url: '/selectAdmin/:topicId',
      templateUrl: 'templates/quanzi/selectAdmin.html',
      controller: 'selectAdminController',
      cache:false
    })
    //管理成员
    .state('manageUser', {
      url: '/manageUser/:topicId',
      templateUrl: 'templates/quanzi/manageUser.html',
      controller: 'manageUserController',
      cache:false
    })
    .state('financialMoney',{
      url: '/financialMoney/:whereId',
      templateUrl: 'templates/shop/financialMoney.html',
      controller: 'FinancialMoneyController'
    })
    .state('applyForWhite', {
      url: '/applyForWhite',
      templateUrl: 'templates/mine/wallet/ApplyForWhite.html',
      controller: 'ApplyForWhiteController'

    })
    // 支付银行卡选择页
    .state('bankCardChose', {
      url: '/bankCardChose/:orderSn/:totalAmount',
      templateUrl: 'templates/order/bankCardPaymentList.html',
      controller: 'BankCardChoseController'
    })
    // 储蓄卡支付页
    .state('debitCardPayment', {
      url: '/debitCardPayment/:orderSn/:totalAmount/:whereName',
      templateUrl: 'templates/order/debitCardPayment.html',
      controller: 'debitCardPaymentController'
    })
    // 申请联名卡
    .state('applyForCard', {
      url:'/applyForCard',
      templateUrl:'templates/product/applyForCard.html',
      controller:'applyForCardController'
    })
    // 花呗分期
    .state('spendBaiInstallment', {
      url:'/spendBaiInstallment/:orderSn',
      templateUrl:'templates/order/spendBaiInstallment.html',
      controller:'spendBaiInstallmentController'
    })
    //整屋解决方案
    .state('fullHouseSolution', {
      url:'/fullHouseSolution/:soluteId',
      templateUrl:'templates/product/newVision/fullHouseSolution.html',
      controller:'fullHouseSolutionController'
    })
    //全部方案列表
    .state('houseSoluteDetail', {
      url:'/houseSoluteDetail/:solutionId',
      templateUrl:'templates/product/newVision/houseSoluteDetail.html',
      controller:'houseSolutionDetailController'
    })
    //解决方案专家
    .state('exportDetail', {
      url:'/exportDetail/:exportId',
      templateUrl:'templates/product/newVision/exportDetail.html',
      controller:'exportDetailController'
    })
    //体验店详情
    .state('exStoreDetail', {
      url:'/exStoreDetail/:nearbyId',
      templateUrl:'templates/product/newVision/exStoreDetail.html',
      controller:'exStoreDetailController'
    })
    //解决方案详情
    .state('itSoluteDetail', {
      url:'/itSoluteDetail/:solutionId/:shareId',
      templateUrl:'templates/product/newVision/itSoluteDetail.html',
      controller:'itSoluteDetailController'
    })
    //居家定制详情页
    .state('homeDetail', {
      url:'/homeDetail/:solutionId',
      templateUrl:'templates/product/newVision/homeDetail.html',
      controller:'homeDetailController'
    })
    //居家定制设计案例页
    .state('homeDesignsth', {
      url:'/homeDesignsth',
      templateUrl:'templates/product/newVision/homeDesignsth.html',
      controller:'homeDesignsthController'
    })
    //居家定制设计师详情
    .state('designDetail', {
      url:'/designDetail/:soluteId',
      templateUrl:'templates/product/newVision/designDetail.html',
      controller:'designDetailController'
    })
    .state('zhihuichangjing', {
      url:'/zhihuichangjing/:solutionId',
      templateUrl:'templates/product/newVision/zhihuichangjing.html',
      controller:'zhcjController'
    })
    // 生活服务 暂时先把生活服务关掉
   /* .state('lifeService', {
      url:'/lifeService',
      templateUrl:'templates/product/LifeService.html',
      controller:'lifeServiceController'
    })*/
    // 生活服务
    // .state('lifeService', {
    //   url:'/lifeService',
    //   templateUrl:'templates/product/newVision/LifeService.html',
    //   controller:'lifeController'
    // })
    .state('newHome', {
      url:'/newHome',
      templateUrl:'templates/product/newVision/newHome.html',
      controller:'newHomeController'
    })
    .state('newHomeMake', {
      url:'/newHomeMake',
      templateUrl:'templates/product/newVision/newHomeMake.html',
      controller:'newHomeMakeController'
    })
    .state('newTestingStore', {
      url:'/newTestingStore',
      templateUrl:'templates/product/newVision/newTestingStore.html',
      controller:'newTestingStoreController'
    })
    .state('newHomeLife', {
      url:'/newHomeLife',
      templateUrl:'templates/product/newVision/newHomeLife.html',
      controller:'newHomeLifeController'
    })
    .state('newHomeOrder', {
      url:'/newHomeOrder',
      templateUrl:'templates/product/newVision/newHomeOrder.html',
      controller:'newHomeOrderController'
    })
    .state('homeMakeList', {
      url:'/homeMakeList/:index',
      templateUrl:'templates/product/newVision/homeMakeList.html',
      controller:'homeMakeListController'
    })
    .state('homeMakeActList', {
      url:'/homeMakeActList',
      templateUrl:'templates/product/newVision/homeMakeActList.html',
      controller:'homeMakeActListController'
    })
    .state('testingStoreList', {
      url:'/testingStoreList/:nearbyType',
      templateUrl:'templates/product/newVision/testingStoreList.html',
      controller:'testingStoreListController'
    })
    .state('newHomeSend',{
      url:'/newHomeSend',
      templateUrl:'templates/product/newVision/newSend.html',
      controller:'newHomesendCtrl',
    })
    .state('newsuperMarket',{
      url:'/NewsuperMarket',
      templateUrl:'templates/product/newVision/superMarket.html',
      controller:'NewsuperMarketController',
    })
    //百货超市
    // .state('homeSame.superMarket', {
    //   url: '/superMarket',
    //   views:{
    //     'homeSame-superMarket': {
    //         templateUrl: 'templates/product/superMarket.html',
    //         controller: 'superMarketController'
    //     }
    //   }

    // })
    // .state('homeSame.newSend',{
    //   url:'/newSend',
    //   views:{
    //     'homeSame-newSend':{
    //       templateUrl:'templates/newsend/newSend.html',
    //       controller:'newsendCtrl',
    //       // cache:false
    //     }
    //   }
    // })

  ;

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/guidePage/:');
  var user = JSON.parse(window.localStorage.getItem('USER_CACHE_KEY'));
  if (user) {
    //已经登录
    $urlRouterProvider.otherwise('/newHome');
  } else {
    $urlRouterProvider.otherwise('/guidePage/:');
  }
};
