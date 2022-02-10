/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('ServiceConversationController', ['$scope', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval', 'ServiceConversationService',
    'UserService', 'PopupService', '$q', '$ionicActionSheet', '$ionicLoading','$sce','CustomerConversationService','$ionicPopup','$stateParams','MediaService','FileUploadService',
    function ($scope, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval, ServiceConversationService,UserService, PopupService, $q, $ionicActionSheet,
              $ionicLoading,$sce,CustomerConversationService,$ionicPopup,$stateParams,MediaService,FileUploadService) {
        //    初始化参数

        $scope.isDisplay = false;//消息小红点判断

        /*   右上角菜单 代码  开始*/
        $rootScope.showRightTop = false;//是否显示右上角 菜单
        $rootScope.msgCount = '';//未读消息数


        //服务器时间
        $scope.serverMs;
        $scope.second =9;

        //CC CustumerConversation,为了绑定msg 的对象
        $scope.CustumerParam = {
            msg: ''
        };

        $scope.messages = [];//http:123.56.3.136:8181
       // $scope.token = '51B6A4F486826040418A5182AD983A01ser'; //todo 暂时写死 // todo 这个用户对应的 memberID 138306987
        $scope.token= UserService.getUser().sessionValue;
        //客服id
        $scope.cId = undefined;//todo 写死为1
        //每隔几秒 获得最新消息
        $scope.csTimer = undefined;
        //接收者Id
        $scope.receiverId = '';

        $scope.chatId = undefined;

        //显示隐藏右上角菜单
        $scope.isClick = function () {
            $scope.isDisplay = !$scope.isDisplay;
        };
        $scope.killTimer = function () {
            $timeout.cancel($scope.csTimer);
            $scope.csTimer = undefined;
        };

        //开始循环调用Msg 再发送消息，发送图片，发送语音前 kill 成功返回再loop， 当网络错误时 弹出 提示层 确认后 start
        $scope.loopGetMsg = function () {
            $scope.getMsg().then(function (eventType) {
                $scope.csTimer = $timeout(function () {
                    $scope.loopGetMsg();
                }, 3000);
            }, function (error) {
                console.log(error);
                $scope.csTimer = $timeout(function () {
                    $scope.loopGetMsg();
                }, 3000);
            });
        };

        //该页面 客服发的接口 所有参数在init 方法中都会初始化
        $scope.init = function () {
            // 测试的时候 cId 写死为1，和 admin 这个客服id 一样吗?
            $scope.cId = $stateParams.to;// 路由中的参数，代表客服id cId c 是company
            $scope.receiverId = $stateParams.from;// 路由中的参数 访客 的唯一标识
            $scope.chatId = $stateParams.chatId; //标示 两个人的对话
            if(!$scope.cId || !$scope.receiverId || !$scope.chatId){
                console.error('客服页面 路由 参数缺少，fatal error');
                return ;
            }else{

                $scope.messages = ServiceConversationService.get($scope.chatId+'$'+$scope.receiverId+'$'+$scope.cId);
               // ServiceConversationService.get('2455$fd4aed20cde745099e4dcf4f78b6a8ee$admin');
            }
        };

        $scope.goBack = function () {
            if($scope.isPlaying){
                console.log('is playing record -- cant go back');
                return;
            }
            $scope.$ionicGoBack();
        };

        $scope.loginCs = function () {
            var params = {
                'c': 'li',
                'u': 'admin',
                'p': '123456'
            };//todo  登录参数暂时写死
            console.log('登录客服系统 ');
            $scope.chatId = undefined;
            ServiceConversationService.login(params).then(function (res) {
                if(res){
                    console.log(res);
                    $scope.token = res.data.token;
                    $scope.cId = res.data.ci;// companyId

                    $timeout(function(){
                        console.log('开始循环');
                        $scope.loopGetMsg();//开始循环
                    },500);
                }else{
                    alert("login error！！！");
                }

            });
        };

        $scope.logoutCs = function () {

            console.log('登出客服系统');
        };

        $scope.getLocalData = function(){
            $timeout(function(){
                ServiceConversationService.loadMessages(kefuData);

            },1200);


        };
        $scope.getMsg = function () {

            console.log('开始获取访客 发送 给客服消息');
            var defer = $q.defer();
            ServiceConversationService.getMsg($scope.token).then(function (res) {

                if (res && res.data && res.data.msgs && res.data.msgs.length != 0) {
                    angular.forEach(res.data.msgs,function(item,index){

                        ServiceConversationService.filtMsg(item);//过滤消息，加 wav ，jpg 或表情
                        if(item.ty == 'close'){
                            console.log('对话id  :'+item.ci+'已经关闭');
                        }
                        else if(item.ty == 'autoAcceptInvite'){
                            console.log('对话id  :'+item.ci+'刚刚开始');
                        }
                    });
                    ServiceConversationService.loadMessages(res.data.msgs);

                    //加载到信息后 再给 scope 的messages 负值
                    $scope.messages = ServiceConversationService.get($scope.chatId+'$'+$scope.receiverId+'$'+$scope.cId);

                    //var aaa = ServiceConversationService.getAll();
                    defer.resolve(1);
                }
                else if(!res.data.msgs.length==0){
                    console.log('收到的消息为0');
                    defer.resolve(1);
                }
                else{
                    console.log("获取客服消息失败"); console.log(res);
                    defer.reject(1);
                }
            });
            return defer.promise;
        };

        $scope.sendMsg = function () {
            var msg = $scope.CustumerParam.msg;
            if(!$scope.chatId || !$scope.receiverId){
                alert("no chatId" + " or receiverId ---sendMsg failed!" );
                return;
            }
            if(!msg){
                PopupService.showToast('发送消息不能为空');
                return;
            }
            ServiceConversationService.sendMsg($scope.chatId, $scope.receiverId, 'm', msg, $scope.token)
                .then(function (response) {

                    if(response &&response.data&& response.data.rt == 0){
                        var myMsg ={
                            msg :msg,
                            "ty": "message"
                        };
                        ServiceConversationService.filtMsg(myMsg);
                        $scope.messages.push(myMsg);

                        $scope.CustumerParam.msg = '';
                    }else{
                        alert("发送信息失败")
                    }
                }
            );
            console.log('发送客服消息----->  '+msg);
        };

        // 图片上传代码 开始  得到图片成功，得到图片失败
        function getSucc(imageData){
            //alert(imageData);
            $scope.tempUrl = imageData;//"http://123.56.3.136:8088/live/receive.jsp?fileType=.jpg&chatId="+$scope.chatId+"&cId=1"
            var uploadUrl = CustomerConversationService.getUploadUrl()+"?fileType=.jpg&chatId="+$scope.chatId+"&cId="+$scope.cId;//cId 是客服 id c是company
            FileUploadService.upload($scope.tempUrl,uploadUrl,undefined,undefined,'image/jpeg',{},uploadSucc,uploadFail);
        }
        function getFail(error){
            alert('得到图片失败');
        }

        function uploadSucc(r){
        //todo 上传成功后 发个msg 给 访客

            PopupService.showToast('上传图片成功');
            var resp = JSON.parse(r.response);
            resp.data.message ="图片文件";
            var temUrl = resp.data.imageUrl;
          //  temUrl = temUrl.replace(/8181/, "8082");// todo 这里 因为上传后的 图片 不在同意个 tomcat 是上
            // resp.data.imageUrl = $sce.trustAsResourceUrl(resp.data.imageUrl);
            var myMsg ={
                imageUrl:temUrl,
                fileType:'.jpg',
                msg:'图片文件'
            };
            $scope.$apply(function(){
                $scope.messages.push(myMsg);
            });
            ServiceConversationService.sendMsg($scope.chatId, $scope.receiverId, 'm', temUrl, $scope.token)
                .then(function (response) {
                    if(response &&response.data&& response.data.rt == 0){
                        console.log("发送上传文件的特殊msg");
                    }else{
                        alert("发送信息失败")
                    }
                }
            );
        }
        function uploadFail(err){
            alert('上传失败');
        }
        //选择图片
        $scope.getImg = function (index){
            MediaService.getPicture(index,getSucc,getFail);
        };
        //图片上传代码 结束

        //音频代码开始
        $scope.startRecord = function(){
            MediaService.startCapture('sourceInSC','audioInSC');
        };

        $scope.deleteRecord = function(){
            MediaService.deleteMedia();
        };
        $scope.stopRecord =  function(){
            PopupService.showToastShort("录音完成，正在上传...");
            MediaService.stopCapture('sourceInSC','audioInSC',$scope.transfer);
        };

        $scope.play = function(){
            var audio = document.getElementById('audioInSC');
            if(audio){
                audio.play();
            }
        };
        $scope.pause = function(){
            var audio = document.getElementById('audioInSC');
            if(audio){
                audio.pause();
            }
        };
        //录音操作面板 事件开始
        $scope.isPlaying = false;//是否正在录音
        $scope.operationMode = 'tap';//'hold' or 'tap' 两种操作模式
        $scope.hold = function(e){//可能是开始录音 也可能是结束录音
            if($scope.isPlaying && $scope.operationMode=='tap'){
                if( $scope.operationMode=='tap'){//tap 操作模式下， 正在录音 这时hold 暂停
                    $scope.isPlaying=false;//停止播放
                }
                return ;
            }
            $scope.operationMode = 'hold';
            $scope.isPlaying = true;
            $scope.killTimer();
            $scope.loopRecord();//开始录音  todo startCapture()
            $scope.startRecord();
            console.log('hold ddddd @@@@@');
        };
        $scope.release = function(){//只能是结束录音

            if($scope.operationMode=='hold'){//只用 hold 模式下，release 才起作用
                if(!$scope.isPlaying){
                    return;
                }
                $scope.isPlaying =false;
                console.log('@@@@@  release ---- ');
            }
        };
        $scope.tap = function(){//可能是开始录音 也可能是结束录音
            console.log('@@@@@  ----- tap ---- ');
            if($scope.isPlaying){
                $scope.isPlaying = false;
            }else{
                $scope.operationMode = 'tap';
                $scope.isPlaying = true;
                $scope.killTimer();
                //开始录音
                $scope.loopRecord();//todo startCapture()
                $scope.startRecord();
            }
        };
        $scope.recordTimer = undefined;//录音时间长度计时器
        $scope.maxSecond = 10;//最长录音时间
        $scope.recordSecond = 0;//已经录制了多长时间

        $scope.loopRecord = function(){
            $scope.recordTimer = $timeout(function(){
                $scope.recordSecond++;
                if($scope.recordSecond>10){
                    //到达最大时间，停止录音 todo  上传音频
                    $scope.stopRecord();
                    PopupService.showToastShort('到达最大时间开始录制下一条');
                    $timeout(function(){
                        $scope.recordSecond = 0;
                        $scope.loopRecord();//继续计时
                        //先停再录
                        $scope.killTimer();
                        $scope.startRecord();
                    },1000);

                }else if(!$scope.isPlaying){
                    //用户点击了 停止录音 todo  上传音频
                    $scope.stopRecord();

                    $scope.recordSecond = 0;
                    $timeout.cancel($scope.recordTimer);

                }else{//继续循环
                    $scope.loopRecord();
                }
            },1000);
        };

        //录音操作面板 事件结束

        //上传音频
        $scope.transfer = function(){//注意fileType 为 .wav todo 客服cid 写死为一 注意fileType 为 .wav
        // var audioUrl = "http://123.56.3.136:8088/live/receive.jsp?fileType=.wav&chatId="+$scope.chatId+"&cId=1";

            var uploadUrl =  CustomerConversationService.getUploadUrl()+"?fileType=.wav&chatId="+$scope.chatId+"&cId="+$scope.cId;
            var audioUrl =  MediaService.getAudioUrl();
            if(!audioUrl){

                PopupService.showToast('音频录制失败，no audioUrl');
            }
            FileUploadService.upload(audioUrl,uploadUrl,undefined,undefined,undefined,{},win,fail);

        };
        var win = function (r) {
            console.log('上传成功--wav');//音频
            var resp = JSON.parse(r.response);
            var temUrl = resp.data.imageUrl;
           // temUrl = temUrl.replace(/8181/, "8082");// todo 这里 因为上传后的 图片 不在同意个 tomcat 是上
            resp.data.message ="音频文件";
            resp.data.msg = resp.data.imageUrl;
           // resp.data.imageUrl = $sce.trustAsResourceUrl(resp.data.imageUrl);
            var myMsg ={
                imageUrl:temUrl,
                fileType:'.wav',
                msg:'音频文件'
            };
            $scope.deleteRecord();// 删除 本地音频
            $scope.$apply(function(){
                $scope.messages.push(myMsg);
            });

            // todo 上传成功后要发送个请求，通知 客服 我已经发送文件
            ServiceConversationService.sendMsg($scope.chatId, $scope.receiverId, 'm', temUrl, $scope.token)
                .then(function (response) {
                    if(response &&response.data&& response.data.rt == 0){
                        console.log("发送上传文件的特殊msg");
                    }else{
                        alert("发送信息失败")
                    }
                    $scope.loopGetMsg();
                }
            );
        };
        var fail = function (error) {
            $scope.loopGetMsg();
            alert('上传失败');
        };
        //音频代码结束

        $scope.focusInput = function(){
            //$('#content').focus();
            console.log('content---focus----');
        };
        $scope.showKeyboard = function(){
            var aa=  document.getElementById('contentS');
            aa.focus();
        };

        $scope.closeKeyboard = function(){
            window.cordova.plugins.Keyboard.close();
        };

        $scope.isShowMoreInput = false; //是否显示 底部附加框 ，里面 包含 表情，音频，图片
        $scope.isShowRecord = false;
        $scope.isShowEmo = false;
        $scope.isShowPicture = false;

        $scope.showMoreInput = function(){
            if($rootScope.isIOS){
                $scope.isShowMoreInput = true;
                $scope.footerStyle={
                    bottom:$scope.keybordH+'px'
                };
                $scope.emoDivStyle ={
                    height:$scope.keybordH+'px'
                }
            }else{
                $timeout(function(){
                    $scope.isShowMoreInput = true;
                    $scope.footerStyle={
                        bottom:$scope.keybordH+'px'
                    };
                    $scope.emoDivStyle ={
                        height:$scope.keybordH+'px'
                    }
                },500);
                //给点延迟 让 android 的键盘先弹下去  ios则不需要延迟
            }

        };
        $scope.showPic = function (){
            $scope.isShowPicture = true ;$scope.isShowEmo = false;$scope.isShowRecord =false;$scope.showMoreInput();
        };
        $scope.hideMoreInput = function(){
            if($scope.isPlaying){
                console.log('is playing ,audion panel cant closed');return;
            }
            var aa=  document.getElementById('contentS');
            //注意 取消时使文本框 获得焦点
            $timeout(function(){
                $scope.isShowMoreInput = false;
                $scope.footerStyle={
                    bottom:'0px'
                };
                if(aa){
                    aa.focus();
                }
            },200);

        };

        $scope.getValue = function(){
            alert($scope.CustumerParam.msg);
        };
        $scope.insertEmo = function(index){
            var strindex = index>=10?index:('0'+index);
            $scope.CustumerParam.msg=  $scope.CustumerParam.msg +'['+strindex+']';
        } ;

        $scope.keybordH = 254; // 先给个 键盘高度
        $scope.emoDivStyle ={
            height: $scope.keybordH+'px'
        };


        function keyboardShowHandler1(e){
            if(e.keyboardHeight){
                $scope.$apply(function(){
                    $scope.keybordH = e.keyboardHeight;
                    //$scope.footerStyle ={
                    //  bottom:e.keyboardHeight+'px'
                    //};
                    //谈起键盘则隐藏表情区域
                    $scope.isShowMoreInput = false;
                    if($rootScope.isIOS){
                        $scope.footerStyle={
                            bottom:$scope.keybordH+'px'
                        };

                    }else{
                        $scope.footerStyle={
                            bottom:'0px'
                        };
                    }

                });
            }
            console.log('keyboardisOpen-------->'+window.cordova.plugins.Keyboard.isVisible);
        }
        function keyboardHideHandler1(e){
            //注意 android 键盘 关闭事件 没有 e.keyboardHeight
            $scope.$apply(function(){
                if(!$scope.isShowMoreInput){
                    $scope.footerStyle ={
                        bottom:'0px'
                    };
                }
            });
            console.log('keyboardisOpen-------->'+window.cordova.plugins.Keyboard.isVisible);
        }


        $scope.$on('$ionicView.beforeEnter', function (e,v) {

            $scope.init();
            $scope.footerStyle ={
                bottom:'0px'
            };
            $rootScope.chatScope = e; //赋予 play sound 指令 综合控制scope
            //注意
            $timeout(function(){
                $scope.loopGetMsg();
            },3000);
            window.addEventListener('native.keyboardshow', keyboardShowHandler1);
            window.addEventListener('native.keyboardhide', keyboardHideHandler1);

            MediaService.addAudioEventOnWindow();
        });
        $scope.$on('$ionicView.afterEnter', function (e,v) {
            //配合 play-sound指令进行
            $scope.$broadcast('$ionicParentView.afterEnter', {who: e});
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            //todo killTimer 去除 window 事件
            MediaService.removeAudioEventOnWindow();
            window.removeEventListener('native.keyboardshow',keyboardShowHandler1);
            window.removeEventListener('native.keyboardhide',keyboardHideHandler1);

          //  $scope.$broadcast('$ionicParentView.beforeLeave', {who: e});
            $scope.killTimer();
        });
    }]);


APP.service('ServiceConversationService', ['$http', 'UrlService', function ($http, UrlService) {

    /*
        利用 ServiceConversationService 内的一个变量存储 所有客服 的得到的信息，
        该变量 是一个 Map，key 是 chatID(ci)＋ $ ＋fr ＋$ ＋to ，value 是 message数组
        每次进  消息中心页面 ，getMessages ，将数组 按key 放入 各自数组，key 不存在，证明是新的 聊天，新建空数组
        进入客服聊天 页面 循环 getMessages ，将数组 按key 放入 各自数组，key 不存在，证明是新的 聊天，新建空数组
        关闭聊天时清空
       存在 js 变量里，杀掉进程 聊天信息就没了  怎么解决????
       a 对 客服 s 说句话a1
       b 对 客服 s 说句话 b2,
       s进入消息中心页面 看到两个信息
       s杀掉手机进程，再进入 消息中心 ，消息没了，
       办法，消息中心 中得到 客服聊天的消息 必须有个未读属性，具体实现，访客发的消息，发一份 给 顺逛的消息表中，利用顺逛的消息机制 保存 未读的客户消息
     */

    //存放 客服 收到的所有message
    var MessageMap = {
        count:0,
        entrySet:{}
    };

    this.isEmptyMap = function(){
        return MessageMap.count ===0;
    };

    function put (key,value){
        MessageMap.entrySet[key] = value;
        MessageMap.count++;

    }
    this.put = put;

    function get (key){

        return MessageMap.entrySet[key];
    }
    this.get = get;

    function containsKey(key) {
        for ( var prop in MessageMap.entrySet) {
            if (prop === key) {
                return true;
            }
        }

        return false;
    }
    this.containsKey = containsKey;

    function remove(key){
        if (containsKey(key)) {
            delete MessageMap.entrySet[key];
            MessageMap.count--;
        }
    }
    // todo 什么时候 remove
    this.remove = remove;

    //将接口取到
    this.loadMessages = function(messageArr){
        if(!messageArr || !angular.isArray(messageArr)){
            console.warn('serviceConversation loadMessage param is not legal');
            return ;
        }
        var msg, k,v;
        for(var i=0;i<messageArr.length;i++){

                msg = messageArr[i];
                k = msg.ci+'$'+msg.fr+'$'+msg.to;
                if(containsKey(k)){//本地已经有对话了
                  v=  get(k);
                    if(angular.isArray(v)){
                        v.push(msg);
                    }else{
                        console.error('local message has a no-array value');
                    }

                }else{//没有新建
                    put(k,[msg]);
                }

        }

    };
    MessageMap.all = [];
    this.getAll = function(){
      for( var k1 in MessageMap.entrySet){
          MessageMap.all = MessageMap.all.concat(MessageMap.entrySet[k1]);
      }
        return MessageMap.all;
    };
    this.getEntrySet = function(){

      return MessageMap.entrySet;
    };

    var host ='http://123.56.3.136:8181';// 172.16.63.134:8888;  http://123.56.3.136:8181  172.16.63.71
    var url = host + '/api/invoke';   //  /api/invoke                   /ios/api/invoke


    this.login = function (params) {

        return $http({
            method: 'POST',
            url: url,
            params: params
        });
    };
    this.kefulogin = function(mid){

        var params = {
            'c': 'li',
            'u': mid
        };
        return $http({
            method: 'POST',
            url: url,
            params: params
        });
    };

    //登出
    this.logout = function () {
        return $http.get('./data/qhot.json');
    };
    // 查询状态
    this.checkStatus = function () {
        return $http.get('./data/qhot.json');
    };

    //获得历史消息
    this.getHistoryMsg = function () {
        return $http.get('./data/qhot.json');
    };
    //获得消息
    this.getMsg = function (token) {
        var params = {
            'c': 're',
            'token': token,
          noLoading:true//得到消息 不需要 loading 图标

        };
        return $http({
            method: 'POST',
            url: url,
            params: params
        });
    };//获得历史消息
    //将后台 返回到message数组元素 做些特殊处理， 音频 变音频， 图片变图片
    this.filtMsg = function(msg){
        if(msg.type =='EVENT_ACCEPT'){
            msg.isFirstFlag = true;//标示 客服说到第一句话
        }
        var str ='$prodLink{"productFullName":"海尔冰箱","productTitle":"这个冰箱很好，节能又环保，国家5a级认证，经济又实惠 ！啊啊","actualPrice":2099,"productId":"4641","o2oType":"0","fromType":4,"storeId":138306984,"$$hashKey":"object:52"}';
        //$prodLink{"productFullName":"海尔冰箱","productTitle":"这个冰箱很好，节能又环保，国家5a级认证，经济又实惠 ！啊啊","actualPrice":2099,"productId":"4641","o2oType":"0","fromType":4,"storeId":138306984,"$$hashKey":"object:52"}
        if(msg.msg && msg.msg.indexOf('$prodLink' )>-1){//发送的链接
          msg.fileType = 'prodLink';
          var objStr = msg.msg.substring(9);
          var prod = JSON.parse(objStr);
          msg.prodObj = prod;
        }
        else if(msg.msg && msg.msg.indexOf('http')>-1 && msg.msg.indexOf('.jpg')>-1){
            msg.fileType = '.jpg';
            msg.imageUrl = msg.msg;
            //传纯图片 fileType  为'.jpg'
        }else if(msg.msg && msg.msg.indexOf('http')>-1 && msg.msg.indexOf('.wav')>-1){
            msg.fileType ='.wav';
            msg.imageUrl = msg.msg; // 用了 落木沙 的 playsound 指令 就不再用 $sce.trustAsResourceUrl(msg.message);
        }else if(msg.msg && msg.msg.indexOf('[')>-1 && msg.msg.indexOf(']')>-1){
            //含有表情 需要转化为 img
            for(var k=1;k<16;k++){//一共 15中表情
                msg.msg =emoToImage(msg.msg,k);
            }
        }
    };
    var emoMap =[0,'01','02','03','04','05','06','07','08','09','10','11','12','13','14','15'];
    // i ,从1，到15
    function emoToImage(str,i){
        if(i<10){
            var pattern = new RegExp('\\['+'0'+i+'\\]','g');
            return str.replace(pattern,'<img  src="'+$rootScope.imgBaseURL+'img/sgemo/'+emoMap[i]+'.png" />');
        }else{
            var pattern = new RegExp('\\['+i+'\\]','g');
            return str.replace(pattern,'<img  src="'+$rootScope.imgBaseURL+'img/sgemo/'+emoMap[i]+'.png" />');
        }
    }

    this.sendMsg = function (cusId, receiveId, type, message,token) {
        var params = {
            'c': 'sd',
            'ci': cusId,
            'to': receiveId,
            'ty': type,
            'msg': message,
            'token':token
        };
        return $http({
            method: 'POST',
            url: url,
            params: params
        });
    };

}]);

APP.directive('resizeFootBars', ['$ionicScrollDelegate', function($ionicScrollDelegate){
    // Runs during compile
    return {
        replace: false,
        link: function(scope, iElm, iAttrs, controller) {
            scope.$on("taResize", function(e, ta) {
                if (!ta) return;
                var scroll = document.body.querySelector("#message-detail-content-s");
                var scrollBar = $ionicScrollDelegate.$getByHandle('scScroll');
                // console.log(scroll);
                var taHeight = ta[0].offsetHeight;
                var newFooterHeight = taHeight + 10;
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                iElm[0].style.height = newFooterHeight + 'px';
                scroll.style.bottom = newFooterHeight + 'px';
                scrollBar.scrollBottom();
            });
        }
    };
}]);

