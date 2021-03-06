/**
 * creater:chuanpeng.zhu@dhc.com.cn
 * create time:2015/12/30
 * describe：URL管理服务
 **/
/*接口地址管理 */
APP.service('UrlService', [function () {

  //数据服务器表示 0：生产环境 1：20306 2：38080 3：38081 4：后台本地服务 5:预发布环境 6:本地环境

  var ENVIRONMENT = 2;//默认正式环境
  var SERVICE_DATA = [
    //0生产环境 系统正式上线环境
    {
      'SERVER_DATA': 'http://m.ehaier.com/v3/',
      'SERVER_DATA_GAME': 'http://m.ehaier.com/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',
      'SHAREPICHEADER': 'http://m.ehaier.com/',
      'SHARELINKHEADER': 'http://m.ehaier.com/www/index.html#/',
      'SERVER_DATA_V2': 'http://m.ehaier.com/v2/',
      'ZC_SERVER_DATA':'http://m.ehaier.com/',//众筹等新接口
      'CCB_SERVER_DATA':'http://pay.ehaier.com/',//建行分期支付
      'SERVER_MQ_WEBSOCKET': 'ws://message.ehaier.com:8080/',
      'SEARCH_SERVER_DATA': 'http://s.ehaier.com/search/',//商品搜索 列表
      'ITEM_SERVER_DATA': 'http://detail.ehaier.com/v3/',//商品详情
      'ITEM_SERVER_DATA_NEW': 'http://detail.ehaier.com/',//商品详情 yl
      'COOPERATE_URL': 'OFFICIAL_',//第三方链接 勿动
      'PAY_CENTER':"http://pay.ehaier.com/",
      'SERVER_TOP':'http://store.ehaier.com/appapi',//社区争霸赛
      'PAY_LIVING':'http://cdn09.ehaier.com/shunguang/livingPay/www/index.html', //生活缴费
    },
    //1分支测试环境20306
    {
      'SERVER_DATA': 'http://mobiletest.ehaier.com:20306/v3/',
      'SERVER_DATA_GAME': 'http://mobiletest.ehaier.com:20306/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',//高的地图webapi
      'SHAREPICHEADER': 'http://mobiletest.ehaier.com:20306/mstatic',
      'SHARELINKHEADER': 'http://mobiletest.ehaier.com:20306/www/index.html#/',
      'SERVER_DATA_V2': 'http://mobiletest.ehaier.com:20306/v2/',
      'ZC_SERVER_DATA': 'http://mobiletest.ehaier.com:20306/',//众筹、改版等新接口
      'CCB_SERVER_DATA': 'http://mobiletest.ehaier.com:20306/',//建行分期支付
      'SERVER_MQ_WEBSOCKET': 'ws://mobiletest.ehaier.com:15674/',
      //'SEARCH_SERVER_DATA': 'http://stest.ehaier.com:20306/v3/',//商品搜索 列表
      'ITEM_SERVER_DATA_NEW': 'http://detailtest.ehaier.com:20306/',//商品详情 yl
      'COOPERATE_URL': 'TEST_',//第三方链接 勿动
      'SEARCH_SERVER_DATA': 'http://stest.ehaier.com:38080/search/',//商品搜索 列表
    },
    //2测试环境38080
    {
      'SERVER_DATA': 'http://mobiletest.ehaier.com:38080/v3/',
      'SERVER_DATA_GAME': 'http://mobiletest.ehaier.com:38080/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',
      'SHAREPICHEADER': 'http://mobiletest.ehaier.com:38080/mstatic',
      'SHARELINKHEADER': 'http://mobiletest.ehaier.com:38080/www/index.html#/',
      'SERVER_DATA_V2': 'http://mobiletest.ehaier.com:38080/v2/',
      'ZC_SERVER_DATA': 'http://mobiletest.ehaier.com:38080/',//众筹、改版等新接口
      'CCB_SERVER_DATA': 'http://mobiletest.ehaier.com:38080/',//建行分期支付
      'SERVER_MQ_WEBSOCKET': 'ws://mobiletest.ehaier.com:15674/',
      'ITEM_SERVER_DATA': 'http://detailtest.ehaier.com:38080/v3/',//商品详情
      'ITEM_SERVER_DATA_NEW': 'http://detailtest.ehaier.com:38080/',//商品详情 yl
      'COOPERATE_URL': 'TEST_',//第三方链接 勿动
      'PAY_CENTER':"http://mobiletest.ehaier.com:58093/",
      'SEARCH_SERVER_DATA': 'http://stest.ehaier.com:38080/search/',//商品搜索列表 darcy
      'PAY_LIVING':'http://cdn09.ehaier.com/shunguang/livingPaytest/www/index.html', //生活缴费
    },
    //3测试环境38081
    {
      'SERVER_DATA': 'http://mobiletest.ehaier.com:38081/v3/',
      'SERVER_DATA_GAME': 'http://mobiletest.ehaier.com:38081/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',
      'SHAREPICHEADER': 'http://mobiletest.ehaier.com:38081/mstatic',
      'SHARELINKHEADER': 'http://mobiletest.ehaier.com:38081/www/index.html#/',
      'SERVER_DATA_V2': 'http://mobiletest.ehaier.com:38081/v2/',
      'ZC_SERVER_DATA': 'http://mobiletest.ehaier.com:38081/',
      'CCB_SERVER_DATA': 'http://mobiletest.ehaier.com:38081/',//建行分期支付
      'SERVER_MQ_WEBSOCKET': 'ws://mobiletest.ehaier.com:15674/',//测试环境 socket 地址
      'ITEM_SERVER_DATA': 'http://detailtest.ehaier.com:38081/v3/',//商品详情
      'ITEM_SERVER_DATA_NEW': 'http://detailtest.ehaier.com:38081/',//商品详情
      'COOPERATE_URL': 'TEST_',//第三方链接 勿动
      'PAY_CENTER':"http://mobiletest.ehaier.com:58093/",
      'SEARCH_SERVER_DATA': 'http://stest.ehaier.com:38080/search/',//商品搜索 列表
      'PAY_LIVING':'http://cdn09.ehaier.com/shunguang/livingPaytest/www/index.html', //生活缴费
       'SERVER_TOP':'http://mobiletest.ehaier.com:38081/v3/thirdparty/app',//社区争霸赛
    },
    //4开发环境
    {
      'SERVER_DATA': 'http://mdev.ehaier.com:81/v3/',
      'SERVER_DATA_GAME': 'http://mdev.ehaier.com:81/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',//高的地图webapi
      'SHAREPICHEADER': 'http:/mdev.ehaier.com:81/mstatic',
      'SHARELINKHEADER': 'http:/mdev.ehaier.com:81/www/index.html#/',
      'SERVER_DATA_V2': 'http:/mdev.ehaier.com:81/v2/',
      'ZC_SERVER_DATA': 'http://mdev.ehaier.com:81/',//众筹
      'CCB_SERVER_DATA': 'http://mdev.ehaier.com:81/',//建行分期支付
      'SERVER_MQ_WEBSOCKET': 'ws://mobiletest.ehaier.com:15674/',
      'SEARCH_SERVER_DATA': 'http://sdev.ehaier.com:81/v3/',//商品搜索 列表
      'ITEM_SERVER_DATA': 'http://detaildev.ehaier.com:81/v3/',//商品详情
       'ITEM_SERVER_DATA_NEW': 'http://detaildev.ehaier.com:81/',//商品详情
      'COOPERATE_URL': 'TEST_',//第三方链接 勿动
    },
    //5预发布环境
    {
      'SERVER_DATA': 'http://m.pre.ehaier.com/v3/',
      'SERVER_DATA_GAME': 'http://m.pre.ehaier.com/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',
      'SHAREPICHEADER': 'http://m.pre.ehaier.com/mstatic',
      'SHARELINKHEADER': 'http://m.pre.ehaier.com/www/index.html#/',
      'SERVER_DATA_V2': 'http://m.pre.ehaier.com/v2/',
      'ZC_SERVER_DATA': 'http://m.pre.ehaier.com/',
      'CCB_SERVER_DATA': 'http://m.pre.ehaier.com/',
      'SERVER_MQ_WEBSOCKET': 'ws://mobiletest.ehaier.com:15674/',//测试环境 socket 地址
      'SEARCH_SERVER_DATA': 'http://s.pre.ehaier.com/v3/',//商品搜索 列表
      'ITEM_SERVER_DATA': 'http://detail.pre.ehaier.com/v3/',//商品详情
       'ITEM_SERVER_DATA_NEW': 'http://detaildev.ehaier.com:81/',//商品详情
      'COOPERATE_URL': 'TEST_',//第三方链接 勿动
    },
    //6本地环境
    {
      'SERVER_DATA': 'http://mdev.ehaier.com:81/v3/',
      'SERVER_DATA_GAME': 'http://localhost:8100/v4/',
      'AMAP_SERVER': 'http://restapi.amap.com/v3/geocode/regeo',//高的地图webapi
      'SHAREPICHEADER': 'http://localhost:8100/mstatic',
      'SHARELINKHEADER': 'http://localhost:8100/www/index.html#/',
      'SERVER_DATA_V2': 'http://mdev.ehaier.com:81/v2/',
      'SEARCH_SERVER_DATA': 'http://sdev.ehaier.com:81/v3/',//商品搜索 列表
      'ITEM_SERVER_DATA': 'http://detaildev.ehaier.com:81/v3/',//商品详情
      'SERVER_MQ_WEBSOCKET': 'ws://mobiletest.ehaier.com:15674/',
    }
  ];
  //SERVER_DATA 数据服务器地址
  var HEAD = SERVICE_DATA[ENVIRONMENT].SERVER_DATA;
  var HEAD_NEW = SERVICE_DATA[ENVIRONMENT].ZC_SERVER_DATA;
  var HEAD_V2 = SERVICE_DATA[ENVIRONMENT].SERVER_DATA_V2;
  var WS_HEAD = SERVICE_DATA[ENVIRONMENT].SERVER_MQ_WEBSOCKET;
  var ZC_HEAD = SERVICE_DATA[ENVIRONMENT].ZC_SERVER_DATA;//众筹
  var CCB_HEAD = SERVICE_DATA[ENVIRONMENT].CCB_SERVER_DATA;//建行分期支付
  var COOPERATE_HEAD = SERVICE_DATA[ENVIRONMENT].COOPERATE_URL;//第三方链接
  var PAY_CENTER = SERVICE_DATA[ENVIRONMENT].PAY_CENTER;
  var HEAD_TOP=SERVICE_DATA[ENVIRONMENT].SERVER_TOP;
  var PAY_LIVING = SERVICE_DATA[ENVIRONMENT].PAY_LIVING; //生活缴费
  var urls = {
    /*****************zzq start************************/
    'GETTUIGUANGMA': 'mstore/sg/store/wdSpreading.html',
    'CHANGEDATA_INIT': 'changeData.json',
    'KUNBIND_INIT': 'kjt/sg/kjtAccountUnbind.html',//解除绑定
    'KBIND_INIT': 'kjt/sg/kjtAccountBind.html',//绑定
    'KBIND_ACTIVATION': 'kjt/sg/kjtAccountActivation.html',//激活
    'KBIND_REALNAME': 'kjt/sg/kjtAccountAuthRealName.html',//认证
     'SETDEFAULT_INIT': 'h5/order/updateDefaultAddress.json',//设置默认地址
     'ADDRESS_INIT': 'h5/order/memberAddresses.json',//收货地址信息获取
    'COLLECTION_LIST': 'mstore/sg/collections.html',//收藏列表
    'DELETECOLLECTION_INIT': 'h5/sg/item/cancelProductCollection.json',//取消收藏
    'COLLECTION_INIT': 'h5/sg/item/productCollection.json',//添加收藏
    'MESSAGECENTER_INIT': 'mstore/sg/msgCenter.html',//消息中心
    'DETAILMESSAGECENTER_INIT': 'detailMessageCenterfalseData.json',
    'EASYCONNECT_INIT': 'kjt/sg/withdrawSetting.html',//获取绑定信息
    'EASYCONNECTRESULT_INIT': 'mstore/sg/kjtInfo.html',//获取绑定结果
    'EASYCONNECTACCOUNT_INIT': 'mstore/sg/kjtInfo.html',//获取绑定人信息
    'GETCASH_INIT': 'mstore/sg/local/myApply.html',//tixianjiekou
    'NEW_GETCASH_INIT': 'kjt/myApply.html', // 新版提现接口
    'KJT_BALANCE': 'getKjtAccount.json', // 获取快捷通 + 天天聚余额   tianbao
    'GETKJTACCOUNT': 'kjt/getKjtAccount.json',  // 获取快捷通token和金额
     'UNLOAD_INIT': 'platform/web/member/logoutNew.json',//退出登录 tianbao
    'UPDATEMEMBER_INIT': 'platform/web/member/updateMember.json',//修改用户信息
    'UPDATE_EMAIL':'platform/web/member/updateEmail.json',//修改邮箱信息
    'UPDATEPASSWORD_INIT': 'platform/web/member/updatePassword.json',//修改密码
    'SET_PASSWORD_INIT': 'platform/web/member/setPassword.json',//修改默认密码
     'DETELEADDR_INIT': 'h5/order/deleteAddress.json',//删除收货地址
     'CHANGEADDR_INIT': 'h5/order/updateAddress.json',//修改收货地址
     'ADDADDRESS_INIT': 'h5/order/insertAddress.json',//新增收货地址
    'CHECKSHOPNAME_INIT': 'mstore/sg/checkSensitiveWords.html',//店铺名称校验
    'CHANGESHOPNAME_INIT': 'mstore/sg/store/changeStoreName.html',//店铺名称修改
    'CHECKHRCODE_INIT': 'mstore/sg/checkHrCode.html',//校验上岗证
    'EDITSHOP_INIT': 'mstore/sg/wdStoreInfoEdit.html',//店铺信息编辑
    'SHOPINFO_INIT': 'mstore/sg/storeInfo.html',//店铺信息
    'SHOPKIND_INIT': 'mstore/sg/getMemberType.html',//获取店铺类别
    'UPLOAD_IMAGE': 'platform/web/app/uploadImage',//头像上传
    /*****************zzq end************************/
    /************ZXT start*************/
    'SELECT_INIT': 'mstore/sg/wdMarketData.html',//选品除发现页面初始化
    'FAXIAN_INIT': 'loadFindProductsNew.html',//选品发现页面初始化
     'ASYNC_ACCESS_PRICE':'getPriceByProductList.html',//异步获取价格
    'CHANGESUCCESS_INIT': 'mstore/sg/addMarketTypeToCookie.html',//修改商品类型
    'CHANGECHOOSESTATEDUI_INIT': 'mstore/sg/removeProductShelvesSubmit.html',//商品列表对号对号状态
    'CHANGECHOOSESTATEJIA_INIT': 'mstore/sg/updateProductShelvesSubmit.html',//商品列表加号对号状态
    'SEARCHGOODS_INIT': 'mstore/sg/wdMarketSearchItem.html',//选品商品搜索
    'ADDCART_INIT': 'h5/cart/add.json',//添加至购物车
    'LOADMOREPRODUCTS_INIT': 'mstore/sg/commonLoadItem.html',//选品页面上拉加载
    'ADDADDRESSSELECTION_INIT': 'mstore/sg/addPositionToCookie.json',//地址加入
    'GET_POSITION_FROM_COOLIE': 'mstore/sg/getPositionFromCookie.json',//获取地址信息
     'CHOOSE_ADDR': 'h5/order/changeAddress.json',
    'GET_ADDRESS_ID': 'mstore/sg/getAddressId.html',    //获取省市区Id
    'GET_SELECTION_IMAGE': 'mstore/sg/wdMarket.html',    //获取选品页轮播图
    'CHECK_NOTICE': 'h5/sg/checkOnly.html',  //检验到货通知是否发送
    'ARRIVE_NOTICE': 'h5/sg/insertNotice.html',
    'START_NOTICE' : 'h5/sg/insertActivityNotice.html',//开抢通知
    'MESSAGE_CLASSIFY': 'mstore/sg/messageCenter.html',//消息分类
    /*************ZXT end*************/
    'CUSTOMPAGE_MODEL':'activity/page/getCustomPageDetail.json',//定制活动页
    /*************localSpecialty start*************/
    'LOCAL_SPECIALTY':'sg/cms/chara/charaIndex.json',//特产惠首页主接口
    'NEW_AND_LIMIT':'sg/cms/flashSales/chara.json',//特产惠首页限时和新品
     'NEW_LOCAL_FLASHSALE':'sg/cms/flashSales/charasale.json',
    'LOCAL_SPECIALTY_LIKE_TYPE':'sg/cms/chara/charaCate.json',//特产惠首页 猜你喜欢 分类
    'LOCAL_SPECIALTY_LIKE_DATA':'sg/cms/chara/charaProducts.json',//特产惠首页 猜你喜欢 数据
    'ALL_SPECIALTY':'sg/cms/chara/charaRegions.json',//全国特产馆
    'SPECIALTY_CART_NUM':'h5/cart/num.json',//购物车数量
    'SPECIALY_VENUE_HOME': '/sg/cms/chara/charaPage.json',
    'SPECIALY_PRODUCTS_LIST': 'charaLoadItem.json',
    "STORE_COLLECTIONLIST":"mstore/sg/storeCollection.json",//收藏店铺、场馆 列表
    "SECONDLEVEL_PRODUCTLIST":"charaLoadItem.json",//二级店铺商品列表 Darcy
    "SECONDLEVEL_SECTYPELIST":"sg/cms/chara/cityChara.json",//二级店铺 二级类目
    'ADD_COLLECT':'v3/mstore/sg/collectStore.json', // 添加收藏
    'CANCEL_COLLECT':'v3/mstore/sg/collectCancel.json', // 取消收藏
    /*************localSpecialty end*************/

    /*****************shuang2.wang START************************/
    'LOGIN': 'platform/web/member/login.json',//登录
    'CAPTCHALOGIN': 'platform/web/member/captchaLogin.json',//登录 带图片验证码的
    'LOGIN_CHECK': 'platform/web/widget/login.html',
    'GET_CAPTCHA': 'platform/web/member/captcha.json',//获取验证码
    'GET_LOGIN_CAPTCHA':'platform/web/member/getImgCaptchafromUC.html',//获取登录页验证码
    'GET_IMG_CAPTCHA': 'platform/web/member/register/getImgCaptcha.html',//图片验证码
    'REGISTER_USER_INFO': 'platform/web/member/register.json',//注册
    'GET_PASSWORD_CAPTCHA': 'platform/web/member/captchaForFindPaw.json',//找回密码获取验证码
    'CAPTCHA_CHECK': 'platform/web/member/verifyCaptcha.json',//验证码校验
    'REQUEST_PASSWORD': 'platform/web/member/resetPassword.json',//找回密码
    'OTHER_LOGIN':'platform/web/member/getMember.json',//其他渠道登录
    'STATISTICS': 'mstore/sg/statistics/portal.json',//数据统计
    'SECOND_MANAGE': 'mstore/sg/store/subMembers.html',//二级管理
    'THIRD_MANAGE': 'mstore/sg/store/grandMembers.html',//三级管理
    'ORDER_AMOUNT': 'v3/h5/order/getOrderCount.json',//订单数量统计
    'ORDER_MANAGE': 'v3/h5/order/getOrderList.json',//订单管理
    'CANCEL_ORDER': 'h5/sg/order/cancelOrder.html',//取消订单
    'SUBMIT_APPLY_REFUND': 'h5/sg/order/submitOrderRepair.html',//申请退款
    'FEEDBACK': 'h5/sg/content/recommend.html',//问题反馈
    'FEEDBACK_PLUS':'h5/sg/content/recommendNew.html',//新的功能反馈
    'CHECK_REFUND': 'h5/sg/order/checkOrderRefund.html',//检查是否可以退款退货
    'CHECK_TEXT': 'mstore/sg/checkSensitiveWords.html',//申请店铺时文本校验
    'GET_PROMOTION_USER_INFO':'platform/web/member/getPromotionUserInfo.json',
    'SHOP_APPLY': 'mstore/sg/wdApplySubmit.html',//申请店铺
    'REFUND_DETAIL': 'h5/sg/order/getOrderRepairsInfo.html',//售后维权
    'ORDER_TRACKING': 'h5/sg/order/orderTrack.html',//订单追踪
    'APPLY_REFUND': 'h5/sg/order/orderRefund.html',//退款退货
    'COMMON_UNION': 'mstore/sg/getMemberType.html',//联盟分类
    'ORDER_DETAIL': 'h5/order/getOrderDetail.json',//订单详情
    'THIRD_PARTY_LOGINS': 'platform/web/member/thirdLogin.json',//第三方登录
    'CUSTOMER_SERVE': 'h5/sg/common/customService.html',//客服
    'SHUNGUANG_HELP': 'mstore/sg/shunguangHelp.html',//顺逛帮助
    'HELP_DETAIL': 'mstore/sg/helpDetail.html',//顺逛帮助
    'WECHAT_PAY': 'h5/pay/wxpay.html',//微信支付 获得 sign的接口
    'PAY_ORDER': '',//订单支付
    'GET_ALIPAY_INFO': 'h5/sg/orderSign.html',//获取支付宝支付信息
    'UPLOAD_ASSESS_IMG': 'h5/sg/upLoadCommentPicture.html',//评价图片
    'NEW_USER_CONTACT':'platform/web/member/bindAndLoginForThird.json',//第三方绑定公众号绑定
    'FIND_STATUS':'platform/web/wechat/bindState.json',//公众号内查询绑定状态
    /*****************shuang2.wang END************************/
    /*****************xyz新订单评价start************************/
    'CHECK_ASSESS_TEXT': 'h5/sg/comment/checkSensitiveWords.json',//新的评价敏感词管理
    'UPLOAD_ASSESS_IMG_NEW': 'h5/sg/comment/upLoadCommentPicture.json',//新的评价图片上传
    "EVALUCTION_NEW": 'h5/sg/comment/commentPage.json',// 评价页接口
    "SUBMIT_EVALUCTION_NEW": 'h5/sg/comment/submitComment.json',// 评价页提交评价接口
    "CRITICALSUC": 'h5/sg/comment/commentSuccessPage.json',//评价成功接口
    "GET_IMG_CAPTCHA_NEW": 'h5/sg/comment/getImgCaptcha.html',//产品使用心得图形验证码
    "FAST_LOGIN_CAPTCHA_COMMENT": 'h5/sg/comment/userCommentSendSmsCode.json',//产品使用心得短信验证码
    "USER_COMMENT_PAGE": 'h5/sg/comment/userCommentPage.json',//产品使用心得初始化
    "SUBMIT_BUYER_COMMENT": 'h5/sg/comment/submitUserComment.json',//产品使用心得提交评价接口
    'PRODUCT_RATED_ASSESS_LIST': 'h5/sg/getCommentsByCondition.json',//商品评价
    'PRODUCT_ASSESS_MARK': 'h5/sg//getProductImpressions.json',//商品评价新标签接口
    'LOOK_ASSESS_INGO': 'h5/sg/comment/getComment.json',//查看评价信息
    'ADD_ASSESS_SUBMIT': 'h5/sg/comment/submitExperience.json',//追加评论
    /*****************xyz新订单评价endxyz************************/
    // 开门红开始
    'WINNING_LIST':'mstore/sg/game/winnerList.json',//中奖名单
    'LOTTERY':'mstore/sg/game/luckDraw.json',//抽奖
    'GAME_INFORMATION':'mstore/sg/game/gameApp.json',//游戏信息
    'GAME_HELLP':'mstore/sg/game/help/powerShare.json',//助力接口
    'GAME_HELLP_INIT':'mstore/sg/game/help/helpRecord.json',//助力页面初始化接口
    'GAME_HAVE_PRIZE':'mstore/sg/game/addAddress.json',//中奖填写地址
    'IS_KAIMENHONG_AVAILABLE':'mstore/sg/game/needRedirect.json',//是否可以跳转开门红抽奖活动
    'HASPROGRAM': 'sg/cms/home/product/hasProgram.json',
    // 开门红结束
    /*****************jiangfeng start************************/
    'STORE_INFO': 'platform/web/app/app_store_info', //店铺信息
    'APP_HOME_DATA': 'platform/web/app/app_home_data', //app首页数据
    'GOODS_LIST': 'mstore/sg/wdComManageDataInit.html', //商品列表
    'DELETE_GOODS': 'mstore/sg/removeProductShelvesSubmit.html', //删除商品
    'UPDATE_GOODS': 'mstore/sg/updateProductShelvesSubmit.html', //更新商品状态
    'UPDATE_GOODS_BATCH': 'mstore/sg/updateStoreProductsBatch.html',//批量上\下架商品
    'DELETE_GOODS_BATCH': 'mstore/sg/deleteStoreProductsBatch.html', //批量删除商品
    'SEARCH_GOODS': 'mstore/sg/wdCommonSearch.html', //店铺预览搜索商品
    'REVENUE_INFO': 'mstore/sg/local/wdRevenue.json', //营收信息
    'REVENUE_LIST': 'mstore/sg/local/myRevenueList.json',//营收列表
    'MICRO_SCHOOL': 'mstore/sg/microSchool.json', //微学堂
    'PRODUCTS_LIST': 'mstore/sg/data/products.html',  //店铺商品列表
    'ACTIVITY_PRODUCTS_LIST': 'mstore/sg/data/activityProducts.html', //店铺参与活动商品列表
    'GET_SHOP_TEMPLATES': 'mstore/sg/store/wdStyleChoice.html',  //获取店铺模板
    'SET_SHOP_TEMPLATES': 'mstore/sg/store/changeStoreStyle.json',  //修改店铺模板
    'GET_SHOP_COVER': 'mstore/sg/store/wdShopCover.html',  //获取店铺封面
    'SET_SHOP_COVER': 'mstore/sg/store/changeShopCover.json',  //修改店铺封面
    'MY_STORE': 'mstore/sg/manage.html',     //我的店铺
    'MY_STORE_NEW':'mstore/sg/manage.json',//店铺预览页新接口
    'MY_STORE_FILTER_LIST': 'myStoreFilter.json',        //我的店铺筛选列表
    'GET_PRODUCTS_LIST': 'mstore/sg/commonLoadItemNew.html',//获取商品列表
     'GET_FILTER_DATA': 'wdMarketFiltrate.html',    //获取筛选列表 darcy
    'GET_ACCOUNT_STATE': 'kjt/sg/wdWithdraw.html',  //获取提现账户状态
    'GET_BANNER_THEME': 'mstore/sg/activity/toActivityPage.html',//主题活动图片
    'GET_BANNER_DAILY': 'mstore/sg/activity/dailyActivityProducts.json',//获取日常活动商品
    'GET_O2O_NAME': 'h5/getO2OStoreInfo.html',   //商品详情页查询O2O店铺名称
    'IS_HAS_STORE':'platform/web/app/is_has_store',//判断是否开店
    'GET_STORE_INFO':'platform/web/app/app_store_info_new',//获取小店信息，去掉memberId参数
    'GET_SELECTION_PRODUCTS':'mstore/sg/loadSelectProducts.html',//获取选品页商品
    'GET_AD_IMAGE':'platform/web/app/app_navigate_banner',//获取广告页图片
    'DELETE_ORDER':'h5/sg/order/deleteOrder.json',//删除订单接口
    'BATCH_DELETE_ORDER':'h5/sg/order/deleteAllOrders.json',//批量删除订单接口
    'GET_MERGE_IMAGE':'h5/sg/getMergeImage.html',//获取商品详情页合成二维码图片
    'CHECK_KJT_LOGIN':'kjt/checkLogin.html',//检验快捷通是否已经登录
    'GET_KJT_TOKEN':'kjt/genToken.html',//获取快捷通token
    'GET_HAIRONGYI_ACTIVITYIFNO':'kjt/queryPromotionActivity.html',//海融易查询活动信息
    'GET_PROMOTE_REWARD':'kjt/queryPromoteReward.html',//海融易查询好友投资记录
    'GET_TOTAL_COMMISSION':'kjt/queryPromotionDailyReward.html',//获取海融易总佣金收益
    'GET_REF_CODE':'kjt/queryPromoCode.html',//获取海融易推荐码、二维码图片
    'GET_WALLET':'h5/sg/getBenefitMember.json',//获取我的钱包
    'GET_WALLETDETAIL':'h5/sg/getBenefitDetails.json',//获取钱包明细
     // 'GET_GETSGSTOREATTRIBUTE':'h5/sg/item/getSgStoreAttribute.json',//商品详情页面-选择规格数量
     'GET_GETSGSTOREATTRIBUTE':'item/attribute/getSgStoreAttribute.json',//商品详情页面-选择规格数量
    'GET_GETDETAILATTRIBUTE':'h5/sg/item/getDetailAttribute.json',//商品详情页面-选择规格数量-属性详情
     // 'GET_ISSHOWATTR':'h5/sg/item/isShowAttr.json', //规格数量是否展示
     'GET_ISSHOWATTR':'item/attribute/isShowAttr.json', //规格数量是否展示 yl
    'GET_CARTNUM':'h5/cart/getCartNum.json',//购物车数量
    // 银行卡start
    'HAS_BANK_LIST_NEW':'kjt/bank/getBankCardList.json',
    'BANK_LIST_DETAIL_NEW':'kjt/bank/getCardDetail.json',
    'BANK_DELETE_NEW':'kjt/bank/unBindCard.json',
    //校验是否绑定银行卡
    'BANK_DELETE_CAPTCHA': 'kjt/bank/getCaptchaForUnbind.json',
    //绑定银行卡获取验证码
    'BANK_HASBINGNUM_NEW': 'kjt/bank/bankCardCount.json',
    // 'BANK_MENTIONCENTER_NEW':'kjt/bank/withdrawToCard.json',
    //银行卡end
    // 开店申请成功页
    'SHOP_APPLY_SUCCESS':'mstore/sg/mechanism/openStoreRank.json',
    // 微店主数据分析
    'DATA_ANALYSIS_UPDATE':'mstore/sg/mechanism/findLastOrderProduct.json',
    'DATA_ANALYSIS_DISTRIBUTION':'mstore/sg/mechanism/getSaleNumByCate.json',
    'DATA_ANALYSIS_ACTIVITY':'mstore/sg/mechanism/getActionAnalysis.json',
    'DATA_ANALYSIS_SALES':'mstore/sg/mechanism/getSaleNumByCity.json',
    'GET_CDK_TOKEN':'h5/sg/cdk/getToken.json',//cdk轨迹token获取
    /*****************jiangfeng end************************/
    /*****************caoyue start************************/
    'GET_COUPONS_LIST': 'mstore/sg/coupons/getCouponsByArea.html',// 领券中心
    'NEW_GET_COUPONS_LIST': 'activity/coupons/getCouponsCenter.html',// 新的领券中心
    'NEW_GET_COUPONS_TYPE': 'activity/coupons/getViewCouponCate.html',// 新的领券中心分类

    'NEW_SHOP_COUPONS_LIST': 'h5/sg/coupons/getCouponsByProductId.html',// 新的调取商品优惠券接口
    'USE_COUPONS_LIST': 'h5/sg/coupons/getProductsByCouponId.html',// 新的使用优惠券
    'COUPONS_DETAIL_LIST': 'h5/sg/coupons/getCouponDetail.html',// 新的优惠券详情
    'PRODUCT_COUPONS_HAS': 'activity/coupons/getHasCoupons.html',// 新的单品页优惠券有无
    //'COUPONS_DETAIL':'mstore/sg/coupons/getCouponsByArea.html',//优惠券详情
    'REMIND_COUPONS_LIST': 'h5/sg/coupons/setRemind.html',// 新优惠券提醒
    'GET_NEW_COUPONS': 'activity/coupons/receiveCoupon.html',// 新优惠券领取
    'COUPONS_DONATION': 'h5/sg/coupons/couponForTransferNew.html',//优惠券转赠
    'COUPONS_GET_MENBERID': 'mstore/sg/coupon/getMemberById.html',//获取转赠人id
    'MY_COUPONS_LIST': 'h5/sg/coupon/getCouponsByMemberId.html',//个人中心优惠券列表
    'MY_COUPONS_LIST_LATE': 'h5/sg/coupon/getCouponsByMemberIdOneDay.html',//个人中心优惠券即将过期列表
     //'SELECT_GOODS_COUPONS': 'h5/sg/coupons/selectCouponNew.html',//查询商品优惠券列表 旧接口
     'SELECT_GOODS_COUPONS': 'h5/order/getStoreCoupon.json',//查询商品优惠券列表 新接口 2018.4.20
    'SELECT_GOODS_COUPONS0': 'h5/coupons/selectCouponsForTailOrdersIncludeUnable.html',//查询尾款支付商品优惠券列表xyz
    'REDIRECT_URL' : 'platform/web/member/wxWebLogin.json',
    'CHECK_LOGIN' : 'platform/web/member/checkLogin.json',//微信判断登录
    'STATE_ID' : 'platform/web/member/saveState.json',
    'SELECT_GOODS_COUPONS1': 'h5/sg/order/submitTailCoupon.json',//使用尾款支付商品优惠券列表xyz
     //'SELECT_PLATFORM_COUPONS': 'h5/sg/coupons/selectCouponsForOrderIncludeUnable.html',//查询通用券 旧接口
     'SELECT_PLATFORM_COUPONS': 'h5/order/getOrderCoupon.json',                           //查询通用券 新接口 2018.4.20
     'SELECT_COUPONS': 'h5/order/choiceStoreCoupon.json',//使用优惠券     新接口 2018.4.20 店铺
     'SELECT_COUPONS_PT':'h5/order/choiceOrderCoupon.json',  //使用优惠卷  新接口 2018.4.20  平台
    'CARD_COUPONS_USED': 'h5/sg/order/checkCardValidate.html',//卡券兑换接口
    'CARD_ CODE_CHECK': 'h5/sg/order/checkCaptcha.html',//卡券验证码校验接口
     'GIFT_CARD_COUPONS_USED': 'h5/order/checkGift.json',//礼品券兑换接口
     'GIFT_CARD_COUPONS_CANCLE': 'h5/order/cancelGift.json',//取消礼品券兑换接口
     'PAY_WAY': 'h5/order/getCanChoiceDate.json',//选择支付方式和日期接口    新接口  2018.4.20
     'SUBMIT_PAY_WAY': 'h5/order/updatePay.json',//提交支付方式接口
    // 'SUBMIT_DELIVE_WAY': 'h5/sg/order/submitDeliveryway.html',//选择配送   旧接口
     'SUBMIT_DELIVE_WAY': 'h5/order/choiceDate.json',//选择配送   新接口  2018.4.20
     'CART_LIST': 'h5/cart/list.html',//购物车列表
     'GOODS_NUMBER': 'h5/cart/update.json',//修改商品数量
     'DELETE': 'h5/cart/delect.json',//删除商品
    //  'CONFIRM_ORDER': 'h5/order/pageInfo.json',//去结算
    'CONFIRM_ORDER': 'h5/order/createOrder.json',//去结算 yl
    'UPDATE_ORDER': 'h5/order/getPageInfo.json',//更新结算页数据 yl
     'CHECK_PAGE_INFO':'h5/sg/order/checkPageInfo.html',//订单尾款
     'ZC_ORDER_CONFIRM': 'activity/zhongchou/order/submitOrder',//众筹提交订单接口
     'CONFIRM_ORDER_INFO': 'h5/sg/order/orderInfo.html',//确认订单请求数据
     // 'LOCATION_CHANGE': 'h5/item/checkStock.json',//更改地址
     'LOCATION_CHANGE': 'item/purchase/checkStock.json',//更改地址 yl
     // 'PAY_CHECK_STOCK':'h5/sg/item/checkStockForQuickPay.json',//立即购买前校验库存
     'PAY_CHECK_STOCK':'item/purchase/checkStockForNum.json',//立即购买前校验库存 yl
     // 'PRODUCTDETAIL_LODEDATA': 'h5/purchase/',//商品详情页页面数据加载
     'PRODUCTDETAIL_LODEDATA': 'item/purchase/',//商品详情页页面数据加载 yl
     'EVALUATE_INFO':'item/evaluation/',//评论信息 yl

     'POST_STORE_INFO': 'h5/sg/shop/info/',  //店铺信息 新增接口
     // 'PRODUCTDETAIL_PROMOS': 'h5/sg/purchase/promos.html',//图文详情
     'PRODUCTDETAIL_PROMOS': 'item/purchase/promos.json',//图文详情 yl
     'ORDER_SUBMIT': 'h5/order/asynSubmitOrder.json',//确认订单界面 yl
     'GET_COUPONS_DETAIL': 'h5/sg/coupon/toListItem.html',//优惠券详情
     'RECEIVE_COUPONS': 'mstore/sg/coupons/getCouponForMember.html',//领取优惠券
     'ORDER_INVOICE': 'h5/order/toInvoice.json',//发票信息
     'ORDER_INVOICE_LIST': 'h5/sg/order/getMemberInvoicesListsByMemberId.html',//发票信息
     'SUBMIT_INVOICE': 'h5/order/submitMemInvoice.json',//发票页
     'SUBMIT_INVOICE_SECKILL': 'pmt/sg/order/submitInvoice.html',//发票页
     // 'ORDERDETAIL_SPECIFICATIONS': 'h5/sg/purchase/specifications.html',//规格参数
     'ORDERDETAIL_SPECIFICATIONS': 'item/purchase/specifications.json',//规格参数 yl
     'GET_CONFIRM_RECEIVE_LIST': 'h5/sg/order/confirmList.html',//获取订单确认收货列表
     'CONFIRM_RECEIVE': 'h5/sg/order/confirmOrderProduct.html',//订单确认收货
     /***** xuf start *****/
     'GAME_INFO': 'mstore/sg/game/oldGameApp.json',
     'GAME_ADD_ADRESS': 'mstore/sg/game/addAddress.html',
     'SECKILL_LIST': 'pmt/sg/seckill/getSeckillAllRedis.html',
     'SECKILL_SERVICE_TIME': 'pmt/sg/getServiceTime.html',
     'CHECK_STOCK': 'pmt/sg/item/checkStock.json',
     'SECKILLDETAIL': 'h5/sg/purchase/',//需要根据productId拼接在后面
     'SECKILLBUY': 'pmt/sg/order/pageInfo.html',
     'SECKILL_CONFIRM_ORDER_INFO': 'pmt/sg/order/orderSubmit.html',
     'UNRED_MESSAGE': 'platform/web/member/unread_message.json',//获得未读消息数
     'MSG_CENTER': 'mstore/sg/msgCenter.html',
     'READALL': 'mstore/sg/readAllMessage.json',
     'CHECKREAD': 'mstore/sg/checkRead.json',
     'PAY_KJT': 'h5/pay/kjtpay/request.json',
     'APP_VERSION': 'platform/web/app/appVersion.json',
     'BIND_MOBILE': 'platform/web/member/bindMobile.json',//绑定手机号
     //post 请求
     //  参数
     //  mobileNum 手机号
     //  captcha 验证码
     //  password 密码
     //  返回值
     //{"success":false,"errorCode":"1111","message":"用户已经绑定过手机","data":null,"totalCount":0}
     //success为false时发生异常
     //data为true时绑定成功，false时绑定失败

    'WD_APPLY': 'mstore/sg/wdApply.html',
    //  get
    //无参
    //返回值
    //{"success":true,"errorCode":null,"message":null,"data":true,"totalCount":0}
    //success为false时发生异常
    //data为true时绑定过手机号，false时未绑定
    'GETREGIONBYID':'mstore/sg/getRegionByParentId.html',//按id 获得地理单元
    'GET_REGION_BY_ID_TYPE':'mstore/sg/getRegionByPIdAndReType.html',
    'ORDER_200PAYCHECK': 'h5/sg/orderPayCheckNew.html',//提交支付方式接口
    /***** xuf end *****/
    'PRODUCT_RATED_TOASSESS_LIST': 'h5/sg/toAssessList.html',//商品评价
    /*****************caoyue end************************/
    /**第三方链接 正式和测试 start**/
    'TEST_KQT_ID': 200000055141,//快捷通商户ID测试 TEST
    'OFFICIAL_KQT_ID': 200000030019,//快捷通商户ID正式 OFFICIAL
    'TEST_KMH_ID':758,//开门红活动ID 测试环境
    'OFFICIAL_KMH_ID':2668,//开门红活动ID 正式环境
    'TEST_WXSQ_ID': 'wxb9b3b8793f9c3d7a',//微信授权ID测试 TEST
    'OFFICIAL_WXSQ_ID': 'wxb03a523baf487993',//微信授权ID正式 OFFICIAL
    'TEST_WXSQ_URL': 'http://mobiletest.ehaier.com:38080/v3/',//微信授权URL测试
    'OFFICIAL_WXSQ_URL': 'http://m.ehaier.com/v3/',//微信授权URL正式
    'TEST_KQT_URL': 'https://zmgs.kjtpay.com/mgs/common/page.htm',//快捷通URL测试
    'OFFICIAL_KQT_URL': 'https://mgs.kjtpay.com/mgs/common/page.htm',//快捷通URL正式
    'TEST_TTQ_URL': 'https://zzhuanle-h5.kjtpay.com/shunguang/myttj',//天天聚URL测试
    'OFFICIAL_TTQ_URL': 'https://m-ally.hairongyi.com/shunguang/myttj',//快捷通URL正式
    'TEST_SZD_URL': 'http://203.187.186.136:8130/haiercms/waterQuality',//水之道URL测试
    'OFFICIAL_SZD_URL': 'http://uhome.haier.net:8280/watercms/waterQuality',//水之道URL正式
    'TEST_HRY_URL':'http://cdn09.ehaier.com/shunguang/H5test/',//海融易URL测试
    'OFFICIAL_HRY_URL':'http://cdn09.ehaier.com/shunguang/H5/',//海融易URL正式
    'TEST_BIG_DATA':'http://jxh.ehaier.com:1188/jslog',//大数据统计接口测试
    'OFFICIAL_BIG_DATA':'http://crmxjz.ehaier.com:1188/jslog',//大数据统计接口正式
    'TEST_CDK_URL':'http://map.mankaa.com/',//CDK URL测试
    'OFFICIAL_CDK_URL':'http://map.rrskx.com/',//CDK URL正式
    'TEST_BABY_KJT_LOGIN':'https://zmgs.kjtpay.com/mgs/common/page.htm',//快捷通授权登录页面测试环境
    'TEST_BABY_KJT':'https://zwallet-h5.kjtpay.com/index',//登陆成功后打开快捷通的链接测试环境
    'OFFICIAL_BABY_KJT_LOGIN':'https://mgs.kjtpay.com/mgs/common/page.htm',//快捷通授权登录页面正式环境
    'OFFICIAL_BABY_KJT':'https://wallet-h5.kjtpay.com/index',//登陆成功后打开快捷通的链接正式
    /**第三方链接 正式和测试 end**/
    /*daba start*/
    // 'CCB_FENQI': 'paycenter/pay/fenqi/cost.html',//建行分期数
    'CCB_FENQI': 'paycenter/pay/fenqi/cost.html',//建行分期数
    'CCB_FENQI_W': 'paycenter/pay/request.html',//调取 建行信用卡支付 接口
    'UNION_PAY': 'paycenter/unionpay/request.html',//银联支付
    'PAY_TYPE_LIST':'paycenter/pay/payTypeList', // 获取支付方式列表
    'HB_COST':'paycenter/pay/hbfenqi/hbCost.html',
    'HB_PAY_APP':'v2/h5/pay/app/Hb/request.json',
    'HB_PAY_H5':'v2/h5/pay/Hb/alipay/request.html',
    // 'CCB_FENQI_W': 'paycenter/pay/request.html',//调取 建行信用卡支付 接口
    'JINBI_JILU': 'h5/sg/member/appLoginRecord.json',//记录微店主金币接口
    'SHARESUCCESS': 'h5/sg/member/getShareSuccess.json',//分享成功后 调用 记录微店主金币接口
    'SHUNGUANG_VIP': 'mstore/sg/credit/getUserCreditInfo.html',//顺逛会员页面 微店主信息接口  等级成长接口
    'CREDIT_DETAIL': 'mstore/sg/credit/findCreditDetail.html',
    'DEVICE_INFO': 'platform/web/app/saveDeviceToken.json',
    'ORDER_INFO': 'mstore/sg/findOrderInfoByOrderId.json',//根据订单id查询订单信息
    'DINGZHI_ZHONGCHUANGHUI': 'mstore/sg/diy/login/request.html',//定制按钮调 众创汇 接口
    'FIND_GAME_ID': 'mstore/sg/findLatestGame.json',//查询最新的积分抽奖游戏
    'MISSION_DETAIL': 'mstore/sg/task/findTaskDetail.html',//查询任务详情接口
    'MISSION_SHARE': 'mstore/sg/task/doTask.html',//分享任务 调取的接口
    'CONNECTION_INDEX': 'mstore/sg/store/getRelationships.html',//人脉关系首页
    'SPREAD_CONNECTION': 'mstore/sg/store/getContacts.html',//展开人脉页面
    'PARTNER_DETAIL': 'mstore/sg/store/getRelationshipsDetial.html',//人脉 合伙人详细信息 页面
    'REPORT_DETAIL': 'mstore/sg/selfBrokerageReportDetail.html',//统计页面接口
    'REPORT_DETAIL_PLUS': 'mstore/sg/brokerageSettlement.html',//统计页面接口
     'BATCH_DELETE_ADDRESS': 'h5/order/deleteBatchAddress.json',//批量删除收货地址接口
    'GET_QRCODE': 'mstore/sg/task/generalQRCode.html',//任务分享 获取二维码接口
    'HOMEPAGE_TOP': 'sg/cms/indexTop.json',//首页顶部接口
    'HOMEPAGE_MIDDLE': 'sg/cms/floor.json',//首页楼层接口
    'HOMEPAGE_ISWDHOST': 'sg/cms/isWdHost.json',//首页是否是微店主接口
     'HOMEPAGE_FALSHSALES': 'sg/cms/flashSales/indexsale.json',//首页限时抢购
    'PERSONAL_CENTER': 'v3/mstore/sg/myManage.json',//个人中心
    'GET_NEW_DIAMOND': 'v3/mstore/sg/wallet.json',// 获取钻石的新接口  darcywang

    'FURNISH_TOP': 'sg/cms/adornhome/topRecommendProducts.json',//家居家装Top
    'FURNISH_BOTTOM': 'sg/cms/adornhome/lowRecommendProducts.json',//家居家装Bottom
    'SUPERMARKET_TOP': 'sg/cms/supermarket/topRecommendProducts.json',//百货超市Top
    'SUPERMARKET_BOTTOM': 'sg/cms/supermarket/lowRecommendProducts.json',//百货超市Bottom
    'MYAPPOINTMENT': 'sg/cms/reserve/myReserve.json',//我的预约
    'FURNISH_BANNER': 'sg/cms/adornhome/adornHomeBanner.json',//家居家装轮播图
    'SUPERMARKET_BANNER': 'sg/cms/supermarket/supermarketBanner.json',//百货超市轮播图
    'ELECTRICALMALL_TOP': 'sg/cms/electricalSecond.json',//家电商场
    'FAST_LOGIN_CAPTCHA': 'platform/web/member/captchaForSmsLogin.json',//快速登录 获取短信验证码
    'FAST_LOGIN': 'platform/web/member/smsLogin.json',//快速登录 登录接口
    'ACTIVITY_ICON_TABS_NEW': 'sg/cms/iconConfig.json',//获取tabs活动图标和文字颜色以及背景图
    'ACTIVITY_BG': 'sg/cms/middleImageConfig.json',//首页顶部活动图标的背景图片
    'TOKEN_GET': 'platform/web/member/queryAccessToken.json',//Token获取(首页的生活服务需要token)
    'TOKEN_LOGIN_GET': 'platform/web/token/getToken.json',//Token获取(登录相关的token)
    'VIDEO_ADVERTISEMENT': 'platform/web/app/getBannerMovie.html',//视频广告链接
    'ADORNHOME_CATES': 'sg/cms/adornhome/productCates.json',//家具家装二级类目接口
    'SUPERMARKET_CATES': 'sg/cms/supermarket/productCates.json',//百货超市二级类目接口
    /*daba end*/
    /*xyz start*/
    'TO_ORDER_SUBMIT_SUCCESS':'h5/sg/order/toOrderSubmitSuccess.html',//订单提交成功
    'SHAER_TASK':'mstore/sg/task/findTaskList.html',//xyz添加任务信息
    'SHAER_HISTORY_TASK':'mstore/sg/task/findHistoryTaskList.html',//xyz添加历史任务信息
    'MEMER_COMPETE':'mstore/sg/credit/findStoreMemberRecord.html',//xyz添加会员竞争力
     'HOT_WORDS': 'search/hotSearch.html',//xyz添加热门词搜索
     'DEFAULTSEARCH_WORDS': 'search/defaultSearch.html',//xyz添加热门词搜索
     'ASSOCIATIONAL_WORDS': 'search/suggestJson.html',//xyz添加联想词搜索
    /*xyz end*/
    /*************************************圈子相关url start************************/
    /*start @zyr*/
    'GET_MY_COMMENT_LIST': 'sgcommunity/story/getMyCommentList.ajax',// 我(TA)的评论列表
    'GET_UCTIP_LIST': 'sgcommunity/uctip/getucTipList.ajax',//我(TA)的打赏列表
    'GET_USER_ISSUE_LIST': 'sgcommunity/story/getUserStoryList.ajax', //我(TA)的发布
    'GET_USER_JOINTOPIC_LIST': 'sgcommunity/getUserJoinTopicList.ajax',//我(TA)的圈子-我加入的
    'GET_USER_CREATETOPIC_LIST': 'sgcommunity/getUserCreateTopicList.ajax',//我(TA)的圈子-我创建的
    'GET_USER_PRAISE_LIST': 'sgcommunity/story/getUserPraiseStoryList.ajax',//我(TA)的赞
    'GET_USER_COLLECTION_LIST': 'sgcommunity/Circle/getUserCllectionStoryList.ajax', //我(TA)的收藏
    'CIRCLE_SIGNIN': 'sgcommunity/sign.ajax',//圈子签到
    'CIRCLE_SIGN_DATE': 'sgcommunity/getSignCalendar.ajax',//圈子签到日历表
    'CIRCLE_SIGN_CHART': 'sgcommunity/getRank.ajax', //圈子签到排行榜
    'CIRCLE_REPLENISH_SIGN': 'sgcommunity/replenishSign.ajax',//圈子确认补签
    'GET_WECHAT_OPENID': 'sgcommunity/Circle/getOpenId.ajax', //话题详情 默认微信的openId
    'GET_WECHAT_URL': 'sgcommunity/Circle/getWeChatURL.ajax', //话题详情 微信的url
  /*end @zyr*/
    'USER_SIMPLE_INFO_ONE': 'sgcommunity/user/userSimpleInfo1.ajax',//个人信息接口
    'USER_SIMPLE_INFO_TWO': 'sgcommunity/user/userSimpleInfo2.ajax',//个人信息接口
    'USER_SIMPLE_INFO_THREE': 'sgcommunity/user/userSimpleInfo3.ajax',//个人信息接口
    'GETUSERMESSAGECOUNT': 'sgcommunity/user/getUserMessageCount.ajax',//获得未读消息数量接口
    'GETBANNERLIST': 'sgcommunity/Circle/getBannerList.ajax',//轮播图
    'GETHOTTOPICLIST': 'sgcommunity/Circle/getHotTopicList.ajax',//热门-热门圈子 列表
    'GETHOTSTORYLIST': 'sgcommunity/Circle/getHotStoryList.ajax',//热门-热门帖子(分页)
    /*'GETHOTSTORYLIST': 'es/story/getHotStoryList.ajax',//热门-热门帖子(分页)（ES搜索）*/
    'GETMYTOPICLIST': 'sgcommunity/Circle/getMyTopicList.ajax',//我的社区-我的圈子
    'EXITTOPIC': 'sgcommunity/schoolstory/exitTopic.ajax',//我的社区-退出圈子
    'GETMYFOLLOWINGSTORYLIST': 'sgcommunity/Circle/getMyFreshNewsList.ajax',//我的社区-新鲜事
    'GETCOURSEINFO': 'sgcommunity/Course/getCourseInfo.ajax',//获取课程信息
    'GETUPDATELIST': 'sgcommunity/schoolstory/getschoolUpdateList.ajax',//最新-帖子列表
    'GETSTORYINFO': 'sgcommunity/schoolstory/getStoryInfo.ajax',//微学堂-获取帖子详情
    'GETSTORYCOMMENT': 'sgcommunity/schoolstory/getSchoolComment.ajax',//微学堂-获取评论
    'SUBMITCOMMENT': 'sgcommunity/schoolstory/submitComment.ajax',//微学堂-插入评论接口
    'CLASS_DELETE_COMMENT': 'sgcommunity/schoolstory/deleteSchoolCommentById.ajax',//微学堂-删除评论接口
    'SCHOOLPRAISESTORY': 'sgcommunity/schoolstory/schoolPraiseStory.ajax',//微学堂-点赞
    'SCHOOLCOLLECTION': 'sgcommunity/schoolstory/schoolCollectionStory.ajax',//微学堂-贴子收藏
    'SCHOOLCOMMENTPARISE': 'sgcommunity/schoolCommentParise.ajax',//微学堂-评论点赞
    'SCHOOLCOMMENTPARISENUM': 'sgcommunity/schoolstory/getCountForSchoolPraise.ajax ',//微学堂-评论点赞数
    'GETTOPICLIST': 'sgcommunity/schoolstory/getTopicList.ajax',//全部圈子页
    'GET_MY_STORY_LIST': 'sgcommunity/story/getMyStoryList.ajax',//原创帖子接口
    'MYCREATE_TOPIC': 'sgcommunity/getMyCreateTopicList.ajax',//我创建的圈子
    'MYJOINED_TOPIC': 'sgcommunity/getMyJoinTopicList.ajax',//我加入的圈子
    'GET_COLLECTION_STORY_LIST': 'sgcommunity/Circle/getCllectionStoryList.ajax',//话题收藏帖子接口
    'GET_SCHOOL_COLLECTION_STORY_LIST': 'sgcommunity/schoolstory/getCllectionStoryList.ajax',//微学堂话题收藏帖子接口
    'GET_LIKE_STORY_LIST': 'sgcommunity/story/getLikeStoryList.ajax',//喜欢(关注)帖子接口
    'SUBMITREPLY': 'sgcoummunity/story/submitReply.ajax',//贴子回复某条评论
    'FOLLOW': 'sgcommunity/user/follow.ajax',//关注接口
    'GETMYFANS': 'sgcoummunity/user/getMyFans.ajax',//粉丝接口 粉丝列表：头像，姓名，是否关注

    'MY_FANS': 'sgcommunity/user/getMyFans.ajax',//我的粉丝
    'INTERESTED': 'sgcommunity/user/getMyInterested.ajax',//感兴趣的人
    'MY_FOLLOWS': 'sgcommunity/user/getMyFollows.ajax',//我的关注
    'RECOMMEND_LIST': 'sgcommunity/Circle/getRecommendTopicList.ajax',//推荐圈子
    'LAUNGCH_RECOMMEND_LIST': 'sgcommunity/Circle/getRecommendTopicListFirstPage.ajax',//启动页推荐圈子
    'JOIN_TOPIC': 'sgcommunity/schoolstory/joinInTopic.ajax',//批量加入推荐圈子
    'PLATFORM_INFO': 'sgcommunity/user/getPlatformInfo.ajax',//平台消息
    'SCHOOL_INFO': 'sgcommunity/user/getSchoolInfo.ajax',//微学堂消息
    'OTHER_INFO': 'sgcommunity/user/getOtherInfo.ajax',//其他消息
    'APPLY_TOPIC': 'sgcommunity/schoolstory/entryCreateTopicAndTags.ajax',//申请圈子
    'EXIST_APPLY_TOPIC': 'sgcommunity/schoolstory/getEntryTopicStatus.ajax',//是否存在已申请中的圈子
    'REVIEW_APPLY_TOPIC': 'sgcommunity/searchEntryTopicInfo.ajax',//申请圈子回显页面
    'DELETE_APPLY_TOPIC_DRAFT': 'sgcommunity/Circle/delCircleTopic.ajax',//申请圈子删除草稿
    'STORAGE_APPLY_DRAFT': 'sgcommunity/schoolstory/entryDraftTopicAndTags.ajax',//申请圈子保存草稿
    'STORAGE_APPLY_REFUSE': 'sgcommunity/schoolstory/UpdateTopicEntryForReback.ajax',//申请圈子审核退回保存草稿
    'TOPIC_TAGS': 'sgcommunity/schoolstory/getStoryPraiseAndUnread.ajax',//圈子标签
    'TOPIC_INFO': 'sgcommunity/schoolstory/getTopicInfo.ajax',//圈子简介
    'BY_CONDITION': 'sgcommunity/Circle/getSensitiveByCondition.ajax',//敏感词判断
    'CIRCLE_STORY_INFO': 'sgcommunity/Circle/getStoryInfo.ajax',//圈子话题详情
    'UPDATE_STORY': 'sgcommunity/schoolstory/updateStoryNew.ajax',//编辑发话题后发布接口
    'LIST': 'sgcommunity/schoolstory/getUpdateList.ajax',//圈子帖子列表
    /*'LIST': 'es/story/getTopicStoryList.ajax',//圈子帖子列表（es）*/
    'TOP_STORY': 'sgcommunity/Circle/topStory.ajax',//置顶帖子列表
    'DELETESTORY': 'sgcommunity/Circle/deleteStory.ajax',//删除贴子详情
    'SUBMIT_STORY': 'sgcommunity/schoolstory/insertStoryNew.ajax',//帖子发表
    'IS_FOLLOWED': 'sgcommunity/user/getIsFollowed.ajax',//获取是否关注
    'SELECT_TAGS_BY_TOPICID': 'sgcommunity/schoolstory/selectTagsByTopicId.ajax',//圈子页标签
    'SHOP_INFO': 'mstore/sg/manage.html',//小店信息
    'SHOP_INFO_LIST': 'mstore/sg/commonLoadItem.html',//小店列表信息
    'SHOP_ADD_CART': 'h5/sg/cart/add.json',//加入购物车
    'HIS_SHARE': 'sgcommunity/Circle/getShareList.ajax',//Ta的分享
    'GETLISTBYCONDITION': 'sgcommunity/Circle/getListByCondition.ajax',//标签查圈子
    'GETUSERBYCONDITION': 'sgcommunity/Circle/getUserByCondition.ajax',//模糊查询账号
    'GETSTORYBYCONDITION': 'sgcommunity/Circle/getStoryByCondition.ajax',//模糊查询帖子
    /*'GETSTORYBYCONDITION': 'es/story/getStoryByCondition.ajax',//模糊查询帖子*/
    'GETTOPICBYCONDITION': 'sgcommunity/Circle/getTopicByCondition.ajax',//模糊查询圈子
    'GETSTORYPRAISEANDUNREAD': 'sgcommunity/schoolstory/getSchoolStoryPraiseAndUnread.ajax',//微学堂-话题详情,获取收藏数量和未读消息
    'ADDUSER': 'sgcommunity/user/addUser.ajax',//判断用户首次
    'GETLISTBYCODE': 'sgcommunity/Circle/getListByCode.ajax',//圈子全部成员
    'SELECT_TAGNAME': 'sgcommunity/schoolstory/selectTagsCountByTagName.ajax',//自定义标签重名校验
    'PERFECT_INFORMATION': 'mstore/sg/checkStoreParam.json',//完善信息相关参数校验
    'COMMON_COMMENT': 'sgcommunity/schoolstory/getStoryComment.ajax',//普通帖子的评论列表
    'INSERT_COMMON_COMMENT': 'sgcommunity/schoolstory/insertStoryComment.ajax',//普通帖子插入评论
    'COMMENT_PRAISE': 'sgcommunity/story/praiseStory.ajax',//普通帖子点赞
    'COLLECTION_TOPIC': 'sgcommunity/Circle/cllectionStory.ajax',//普通帖子收藏
    'TOPIC_PRAISE': 'sgcommunity/schoolstory/commentParise.ajax',//贴子详情评论点赞
    'NOTE_PERSON_TYPE': 'sgcommunity/schoolstory/selectStory2.ajax',//用户身份验证
    'GET_STORY_PRAISE': 'sgcommunity/Circle/getStoryPraiseAndUnread.ajax',//贴子详情点赞统计
    'COMMENT_STORY_PRAISE': 'sgcommunity/schoolstory/getCommentPraise.ajax',//贴子详情评论点赞统计
    'DELETE_COMMON_COMMENT': 'sgcommunity/schoolstory/deleteComment.ajax',//删除普通贴评论
    'SHARE': 'sgcommunity/Circle/share.ajax',//分享保存接口
    'APPLY_LECTURER': 'sgcommunity/user/applyTeacher.ajax',//申请讲师
    'START_APPLY_LECTURER': 'sgcommunity/user/startApplyTeacher.ajax ',//申请讲师
    'ENTRYFORUM': 'sgcommunity/Circle/entryForum.ajax',//申请讨论组
    'ENLARGE_CONTENT': 'sgcommunity/getEntrycapacity.ajax',//扩容
    'DISCUSSION_STATE': 'sgcommunity/Circle/getDiscussionState.ajax',//讨论组状态
    'CONNECT_PROUCT': 'sgcommunity/circle/getProductsDetailList.ajax',//关联产品
    'EXIT_TOPIC': 'sgcommunity/schoolstory/exitTopic.ajax',//圈子退出接口
    'CANCEL_TOP': 'sgcommunity/cancelTopStory.ajax',//帖子取消置顶
    'ADD_USER': 'sgcommunity/user/addUser.ajax',//同步用户信息到社群库的
    'COURSE_INFO': 'sgcommunity/notice/getNoticeCourseyByCourseId.ajax',//获取课程信息
    'TEACHED_COURSE': 'sgcommunity/story/getTeachCourse.ajax',//个人讲授的课程
    'JOINED_COURSE': 'sgcommunity/story/getJoinCourse.ajax',//个人已参加的课程
    'COURSE_ALL_MEMBER': 'sgcommunity/notice/getCoursePersonByCourseId.ajax',//获取课程全部人员
    'COURSE_TEACH_LIST': 'sgcommunity/notice/selectCourseForTeacher.ajax',//获取课程讲师列表
    'MESSAGE_BOARD_LIST': 'sgcommunity/schoolstory/getWordsListByCourseID.ajax',//根据课程id获取问题列表
    'CLASSES_LIST': 'sgcommunity/course/getCourseMaterials.ajax',//课堂列表
    'CLASSES_TOPIC_LIST': 'sgcommunity/schoolstory/getSchoolStoryListByCourse.ajax',//课堂关联话题列表
    'GET_QUESTION_DETAILS': 'sgcommunity/schoolstory/getAnswersByWordsId.ajax',//获取问题详情
    'QUESTION_ANSWER': 'sgcommunity/schoolstory/insertWords.ajax',//问题提问与回答
    'STUDENT_SHARE': 'sgcommunity/course/getStudentsShare.ajax',//课堂学员分享
    'TEST_LIST': 'sgcommunity/Circle/startAnswerList.ajax',//考试考题列表
    'TEST_ESSENTIAL_INFORMATION': 'sgcommunity/Circle/getCourseAnswerInfo.ajax',//考试基本信息
    'TEST_CONSULT': 'sgcommunity/Circle/getCourseAnswerResult.ajax',//考试结果
    'REGIST_MESSAGE_TOKEN':'mstore/sg/registMessageToken.html',
    'MESSAGE_WS_URL':'ws',
    'BROKERAGE_SETTLEMENT':'mstore/sg/brokerageSettlement.html',
    'FLASH_TWO':'sg/cms/flashSales/docker.json',//限时抢购二级页

    /*aaa start*/
    'GET_BUSINESS':'sgcommunity/schoolstory/getStoryCategory.ajax',
    'GET_RELATEDSHOP':'sgcommunity/product/commonLoadItem.html',
    'GET_AREADYSHOP':'sgcommunity/product/getPaidProductInfo.html',
    'GET_HOLDPRO':'sgcommunity/product/getCollectionList.ajax',
    'SEARCH_GOODS_CIRCLE':'sgcommunity/product/wdCommonSearch.html',
    'SEARCH_HOLDPRO':'sgcommunity/product/searchCollectionList.ajax',
    'CIRCLE_GET_GOLD':'sgcommunity/user/getConsumeCreditNum.ajax',//获得金币总数
    'CIRCLE_SHAN_LIST':'sgcommunity/getTipList.ajax',//获得打赏列表
    'CIRCLE_SHAN_TOPIC':'sgcommunity/story/tipStory.ajax',//打赏话题接口
    'CIRCLE_SHAN_COMMENT':'sgcommunity/story/tipComment.ajax',//打赏评论接口
    'CIRCLE_SELECT_SHOP':'sgcommunity/user/isWd.ajax',//判断是否微店主
    'CIRCLE_GET_CIRCLE_LIST':'sgcommunity/getUcTopicCategoryList.ajax',//圈子分类一级列表
    'CIRCLE_GET_SECONDLIST':'sgcommunity/getUcTopicListByCategoryId.ajax',//圈子分类二级列表
    'CIRCLE_CIRCLEPERSON':'sgcommunity/Circle/getUserListByTopicId.ajax',//查询圈子成员接口
    'CIRCLE_SET_ADMIN':'sgcommunity/Circle/setManager.ajax',//设置管理员、取消管理员
    'CIRCLE_MANAGE_USER':'sgcommunity/Circle/setIsGap.ajax',//管理圈子成员，禁言，解除
    'CIRCLE_DELECT_USER':'sgcommunity/schoolstory/deleteUser.ajax',//删除成员
    'CIRCLE_CANG_COMMENT':'sgcommunity/schoolstory/updateCommentDisplayStatus.ajax',//隐藏评论
    'CIRCLE_CANG_TOPIC':'sgcommunity/hiddenStory.ajax',//隐藏话题
    'CIECLE_DEL_CANG_TOPIC':'sgcommunity/cancleHiddenStory.ajax',//取消隐藏话题
    'CIRCLE_TOP_TOPIC':'sgcommunity/setTopStory.ajax',//话题置顶
    'CIRCLE_SPEAK':'sgcommunity/schoolstory/getUserIsGag.ajax',//判断用户是否被禁言
    'CIRCLE_AGREE':'sgcommunity/story/adoptionComments.ajax',//采纳评论
    'CIRCLE_SELECT_TOPIC':'sgcommunity/Circle/choiceTopicList.ajax',//选择圈子
    'CIRCLE_JING_TOPIC':'sgcommunity/setChoiceStory.ajax',//精华方式
    'CIRCLE_JING_CANCLE':'sgcommunity/cancelChoiceStory.ajax',//取消精华方式
    /*aaa end*/

    /***********************众筹相关url start***************/
    /*start*/
    'ZC_INDEX':'activity/zhongchou/index',//众筹首页
    'ZC_INDEX_ACTIVITY':'activity/zhongchou/indexZActivitys',//首页活动分类（最新上线、即将上线、即将结束）
    'ZC_ZSTALLS_SINGLE_PAGE':'activity/zhongchou/getZStallsSinglePage',//档位选择页
    'ZC_CHECK':'activity/zhongchou/check',//支持校验
    'ZC_ORDER_COMMIT':'activity/zhongchou/order/pageInfo',//订单提交页
    'ZC_ACTIVITY_SINGLE_PAGE':'activity/zhongchou/getZActivitySinglePage',//单品页
    'ZC_COMMIT_ORDER':'activity/zhongchou/order/submitOrder',//提交订单
    /*end*/
    /***********************众筹相关url end***************/
    /************分类Start************** */
    'GETNAVIGATIONS': 'sg/cms/navigation/getNavigations.json',//分类导航列表
     'COMMONLOADITEMNEW': 'commonLoadItemNew.html', //分类列表 darcy
     'WDCOMMONSEARCHNEW': 'wdCommonSearchNew.html',//搜索接口-筛选支持品牌多选 darcy
    'MYSTORE': 'mstore/sg/myStore.json',//店铺管理页面数据
    'ISREALNAMEAUTH': 'kjt/bank/isRealNameAuth.json',//是否实名认证
    'CAPTCHAMOBILE': 'platform/web/member/captchaMobile.json',//获取手机验证码
    'REALNAMEAUTH': 'kjt/bank/realNameAuth.json',//手机号，身份证认证
    'REALNAMECHECK': 'kjt/bank/realNameCheck.json',//检查身份证是否有效
    'CHECKMOBILE':'platform/web/member/checkMobile.json',//检查验证码是否正确
    'CHANGEMOBILE':'platform/web/member/changeMobile.json',//更换手机号
    /************分类End************** */
    /*cuixinwei  start*/
    'NEW_SEND':'sg/cms/reserve/index.json',//新品预约
    'NEW_RES':'sg/cms/reserve/preSale.json',//预售
    'NEW_SLIDE':'sg/cms/secondPageBanner.json',//新轮播
     'NEW_FLASHSALE': 'sg/cms/flashSales/dockersale.json',//抢购数据
    'SUC_ZHONGCHOU':'activity/zhongchou/successZActivitys',//众筹成功数据
    'GET_SMSS':'sg/cms/reserve/sendSmsCaptcha.json',//获取验证码
    'SUB_PRESS':'sg/cms/reserve/reserve.json',//预约商品
    'CHECK_RES':'sg/cms/reserve/checkMemberReserve.json',//检查验证码是否有误
     // 'GET_PRODUCTCATENAME':'h5/sg/item/getProductCateName.json',//通过类别id取到类别名称
     'GET_PRODUCTCATENAME':'item/purchase/getProductCateName.json',//通过类别id取到类别名称 yl
    /*cuixinwei   end*/
    /***zyr****zyr****zyr*****start******************************/
    /*会员中心*/
    'GET_STORE_DETAIL':'mstore/sg/mechanism/findStoreMemberDetail.json', //获取微店主的详细信息
    'GET_APPLY_MENGZHU':'mstore/sg/mechanism/getTeamLevelApplyStatus.json', //查看舵主的申请状态
    'APPLY_MENGZHU':'mstore/sg/mechanism/teamLevelApply.json',  //提交申请舵主 或盟主
    'APPLY_MENGZHU_NOT': 'mstore/sg/mechanism/findTeamLevelApplyDesc.json',  //不可申请盟主的提示
    'GET_VISI_BROW_HIS':'mstore/sg/mechanism/findStoreVisitStatistic.json',   //访客浏览记录
    /*数据统计*/
    'GET_STORE_DATA':'mstore/sg/mechanism/findVisitStatistic.json',  // 店铺数据
    'GET_TEAM_DATA':'mstore/sg/mechanism/statisticalTeamData.json',  // 团队数据
    'GET_OWNER_DATA':'mstore/sg/mechanism/statisticalPersonalData.json', // 个人数据
    'GET_PARTNER_TEAM':'mstore/sg/mechanism/pagingChildren.json',  // 合伙人、团队清单

    /******团队管理*******/

     'TEAM_SUPERVISE':'mstore/sg/mechanism/pagingChildren.json', //团队管理
     'TEAM_USERINFO':'mstore/sg/mechanism/findStoreMemberDetail.json',//基本信息
     'ORDER_LIST':'h5/order/getOrderList.json',//订单列表
     'TEAM_USERS':'mstore/sg/mechanism/findOrderProductUserInfo.json', //用户列表
     'TEAM_MESSAGE':'mstore/sg/mechanism/findOrderProductUserInfoDetail.json', //用户详情
     'STORE_PRODUCT':'mstore/sg/mechanism/findVisitStatistic.json', //店铺数据详情
    /******团队管理*******/

    /******实名认证*******/
    "REGISTERS": 'mstore/sg/checkRegisterParam.json',      //注册手机号
    'GET_HAIER_STAFF_MSG':'kjt/bank/sendSmsForEmp.json',//获取员工验证码
    'POST_HAIER_STAFF_MSG':'kjt/bank/employerAuth.json',//发送员工信息
    'REGISTERS_NEW': 'platform/web/member/checkRegisterParam.json',//注册 新接口 201818.1.19
    'TRUE_REALNAMEAUTH': 'kjt/bank/isRealNameAuth.json',   //实名认证
    'POST_USERDATAANDID': 'kjt/bank/realNameAuth.json',      //发送
    'POST_USERDATA': 'kjt/bank/realNameCheckPC.json',       //没有id 发送
    'GET_NAMEORID': 'kjt/bank/realNameCheck.json',      //获取姓名和证件号
    'SHOP_SUCCESS_APPLY': 'mstore/sg/registerNew.json',      //开店成功
    'GET_PHONEAUTH': 'kjt/bank/phoneAuth.json',//新手机号验证
    'GET_NAMEAUTH': 'kjt/bank/nameAuth.json',//身份证认证

    /******实名认证*******/
    /*********绑定银行卡************/
    'GET_PROMOTION_CODE':'platform/web/member/findPromotionCodeByRegion.json',//员工推荐码
    'NEW_SHOP_STORE':'platform/web/member/registerAndStore.json', //注册开店
    'SHOP_STORE':'mstore/sg/wdApplySubmit.html', //开店
    'GET_BANKNAME': 'kjt/bank/getBankName.json',      // 自动识别
    'GET_USORID': 'kjt/bank/toBindCard.html',         //初始化 获取
    'POST_CHECKS': 'kjt/bank/bindCardCheck.json',      // 校验信息
    'GET_CODEID': 'kjt/bank/captcha.json',            //发送验证码
    'POST_BANKDATA': 'kjt/bank/bindCard.json',          //绑定银行卡
    /*********绑定银行卡************/

    /*海尔大学&好糠之家对接*/
    "GET_learningHaier":"sg/h5/web/auth/mobile/learningHaier.json",//海尔大学
    "GET_homeking":"sg/h5/web/auth/mobile/homeking.json",  //好糠之家

    /*****************白条 START************************/
    'WHITE_SHOWS_APPLY':'v3/kjt/applyForOpen.json',//白条申请开通
    'WHITE_SHOWS_QUERY_AVALIAMT':'v3/kjt/queryAvaliAmt.json',//白条额度查询
    'WHITE_SHOWS_PAY':'v3/kjt/payApply.json',//白条支付
    'WHITE_SHOWS_QUERY_STATUS':'v3/kjt/queryIousStatus.json',//白条状态查询
    'WHITE_SHOWS_COST':'v3/kjt/iouc/cost.json',//白条试算

    /*****************白条 END************************/

    /*********家居家装 start************/
    "GET_STORE_MSG":"item/home/point.json", //硬装门店信息
    "POST_PRIVILEGE_CODE":"h5/order/checkCodeAndGift.json", //特权码
    /*********家居家装 end************/

    //社区争霸赛
    'IF_CIRCLEPAGE':'/circle/getSqzbLink.ajax',
    //  改版相关url
    'LIFE_SERVICES':'sg/cms/home/life.json',//生活服务首页
    'SMART_HOME':'sg/cms/home/smart.json',//智慧家电首页
    'HOME_MAKE':'sg/cms/home/diy.json',//居家首页
    'NEW_HOME_BANNER':'sg/cms/home/banner.json',//生活服务,居家轮播
    'NEW_HOME_TOPIC':'sg/cms/home/storys.json',//首页话题相关
    'ACT_LIST':'sg/cms/home/designer/list.json',//设计师列表
    //改版子页面相关url
    'FULL_SOLUTION':'sg/cms/home/programs.json',//全屋案例
    'FILTER_TAG':'sg/cms/home/case/label.json',//筛选标签
    'FILTER_PRODUCTLIST':'sg/cms/home/case/list.json',//筛选后商品
    'HOME_DETAIL':'sg/cms/home/case/details.json',//案例详情
    'HOUSE_YUYUE':'sg/cms/home/design.json',//预约
    'HOUSE_LISTDETAIL':'sg/cms/home/programs/list.json',//解决方案全部列表
    'HOUSE_FROM_PRODETAIL':'sg/cms/home/programs/listByProductId.json',
    'ITSOLU_DETAIL':'sg/cms/home/programs/details.json',//解决方案单品详情
    'ITSOLU_PRODUCTLIST':'sg/cms/home/programs/details/products.json',//解决方案商品信息 7.12刘淇换了新接口
    'ITSOLU_PRODUCTLIST':'sg/cms/home/programs/details/sequenceProducts.json',//解决方案商品信息 新接口
    'DESIGN_DETAIL':'sg/cms/home/designer/details.json',//设计师详情
    'DESIGN_SOLULIST':'sg/cms/home/designer/case/list.json',//设计师解决方案列表
    'EXPORT_DETAIL':'sg/cms/home/experts.json',//解决方案
    'RECENTLY_WORK':'sg/cms/home/nearby.json',//附近
    'TEST_STORE_DETAIL':'sg/cms/home/nearbyDetail.json',//DETAIL
    'NEARBY_TYPES':'sg/cms/home/nearby/types.json',//附近体验店类型
    'NEARBY_LIST':'sg/cms/home/nearby/list.json',//体验店列表
    'SMART_SCENES':'sg/cms/home/smart/scenes.json',//智慧场景
    'SMART_SPACE':'sg/cms/home/smart/space.json',//获取智慧场景商品ID

     'GET_SERVICE_PRO':'item/purchase/getDes.json',
    //选择赠品
    'GET_GIFTS':'h5/order/getGiftBag.json',
    //保存赠品
    'PRESERVATION_GIFTS':'h5/order/choiceGiftBag.json',
  };
  var MQConfig = [
    {
      username:'message_user_ro',
      password:'nYXPFND2'
    },
    {
      username:'task',
      password:'task'
    },
    {
      username:'task',
      password:'task'
    },
    {
      username:'task',
      password:'task'
    },
    {
      username:'task',
      password:'task'
    },
    {
      username:'task',
      password:'task'
    },
    {
      username:'task',
      password:'task'
    }
  ];

  /**
   * 定义接口和域名之间的关系，如商品列表页访问的域名为SEARCH_SERVER_DATA变量所定义
   *
   */
  var urlMapper = [{
    name: "LOADMOREPRODUCTS_INIT",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "GET_PRODUCTS_LIST",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "SHOP_INFO_LIST",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "ACTIVITY_PRODUCTS_LIST",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "GET_FILTER_DATA",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "SEARCHGOODS_INIT",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "SEARCH_GOODS",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "HOT_WORDS",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "DEFAULTSEARCH_WORDS",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "ASSOCIATIONAL_WORDS",
    value: "SEARCH_SERVER_DATA"
  }, {
    name: "PRODUCTDETAIL_LODEDATA",
     value: "ITEM_SERVER_DATA_NEW"
  }, {
    name: "PRODUCTDETAIL_PROMOS",
     value: "ITEM_SERVER_DATA_NEW"
  }, {
     name:"GET_PRODUCTCATENAME",
     value:"ITEM_SERVER_DATA_NEW"
   }, {
     name: "ORDERDETAIL_SPECIFICATIONS",
     value: "ITEM_SERVER_DATA_NEW"
   }, {
     name: "SECKILLDETAIL",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "CHECK_NOTICE",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "START_NOTICE",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "ARRIVE_NOTICE",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "GET_O2O_NAME",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "GET_MERGE_IMAGE",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "NEW_SHOP_COUPONS_LIST",
     value: "ITEM_SERVER_DATA"
   }, {
     name: "PRODUCT_COUPONS_HAS",
     value: "ITEM_SERVER_DATA"
   },{
     name: "POST_STORE_INFO",
     value: "ITEM_SERVER_DATA"
   },{
     name: "LOCATION_CHANGE",
     value: "ITEM_SERVER_DATA_NEW"
   },{
     name: "EVALUATE_INFO",
     value: "ITEM_SERVER_DATA_NEW"
   },{
     name: "WDCOMMONSEARCHNEW",
     value: "SEARCH_SERVER_DATA"
   },{
     name: "COMMONLOADITEMNEW",
     value: "SEARCH_SERVER_DATA"
   },{
     name: "FAXIAN_INIT",
     value: "SEARCH_SERVER_DATA"
   },{
     name: "ASYNC_ACCESS_PRICE",
     value: "SEARCH_SERVER_DATA"
   },{
     name: "SPECIALY_PRODUCTS_LIST",
     value: "SEARCH_SERVER_DATA"
   },{
     name: "SECONDLEVEL_PRODUCTLIST",
     value: "SEARCH_SERVER_DATA"
   },{
     name:'ADD_COLLECT',
     value: "SEARCH_SERVER_DATA"
   },{
     name:'CANCEL_COLLECT',
     value:'SEARCH_SERVER_DATA'
   },{
     name:"GET_GETSGSTOREATTRIBUTE",
     value:"ITEM_SERVER_DATA_NEW"
   },{
     name:"GET_GETDETAILATTRIBUTE",
     value:"ITEM_SERVER_DATA"
   },{
     name:"GET_ISSHOWATTR",
     value:"ITEM_SERVER_DATA_NEW"
   },{
     name:"PAY_CHECK_STOCK",
     value:"ITEM_SERVER_DATA_NEW"
   },{
    name: "GET_STORE_MSG",
    value: "ITEM_SERVER_DATA_NEW"
   },{
     name: "GET_SERVICE_PRO",
     value: "ITEM_SERVER_DATA_NEW"
  }];
   /*******************本地假数据接口***************************************************/
   this.getUrl = function (url) {
     var data = SERVICE_DATA[ENVIRONMENT];
     var prefix = data.SERVER_DATA;
     for (var i = 0; i < urlMapper.length; i++) {
       if (url === urlMapper[i].name) {
         if (data[urlMapper[i].value]) {
           prefix = data[urlMapper[i].value];
         }
         break;
       }
     }
     return prefix + urls[url];
   };
   this.getLiveingUrl = function () {
     return PAY_LIVING;
   };
   this.getNewUrl = function (url) {
     return HEAD_NEW + urls[url];
   };
   this.getTopUrl = function (url) {
    return HEAD_TOP+ urls[url];
  };
   this.getWSUrl = function (url) {
     return WS_HEAD + urls[url];
   };
   this.getCPUrl = function (url) {
     return  urls[COOPERATE_HEAD+url];
   };
   this.getMQAuth = function () {
     return MQConfig[ENVIRONMENT];
   };
   this.getAMAPUrl = function () {
     return SERVICE_DATA[ENVIRONMENT].AMAP_SERVER;
   };
   this.getFakeUrl = function (url) {
     return './data/' + urls[url];
   };
   this.getHead = function () {
     return HEAD;
   };
   this.getHeadV2 = function () {
     return HEAD_V2;
   };
   this.getZCUrl = function (url) {
     return ZC_HEAD + urls[url];
     ;
   };
   this.getThirdUrl = function (url) {
    return ZC_HEAD + url;
  };
   this.getCcbUrl = function (url) {

     return CCB_HEAD + urls[url];
   };
   this.getPayCenter = function (url) {
     return PAY_CENTER +urls[url];
   }
   this.getWhiteShowsUrl = function (url) {
     return CCB_HEAD + urls[url];
   }

   this.getEnviroment = function () {
     return ENVIRONMENT==0?1:0;//正式环境返回 1 ，其他环境返回0
   };
   // this.getGuangDaTestPay = function () {
   //   if (ENVIRONMENT) {
   //     return 'http://123.56.11.232:8000/paycenter/pay/request.html';
   //   }
   //   return 'http://pay.ehaier.com/paycenter/pay/request.html';
   // }

   this.getSharePicHeader = function () {
     return SERVICE_DATA[ENVIRONMENT].SHAREPICHEADER
   };
   this.getShareLinkHeader = function () {
     return SERVICE_DATA[ENVIRONMENT].SHARELINKHEADER;
   };
   this.getServiceV2 = function (url) {
     return SERVICE_DATA[ENVIRONMENT].SERVER_DATA_V2 + urls[url]
   };
   this.getGameUrl = function (url) {
     var data = SERVICE_DATA[ENVIRONMENT];
     var prefix = data.SERVER_DATA_GAME;
     return prefix + urls[url];
   };
 }]);
