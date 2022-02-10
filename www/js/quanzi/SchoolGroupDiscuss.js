/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('SchoolGroupDiscussController', ['$scope', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval', 'CircleGroupDiscussService','UserService','PopupService',
    '$ionicActionSheet','MediaService','FileUploadService','$sce','CustomerConversationService',
    function ($scope, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval, CircleGroupDiscussService,UserService,PopupService,$ionicActionSheet,MediaService,FileUploadService,$sce,CustomerConversationService) {
        //    初始化参数
        $scope.isDisplay = false;//消息小红点判断

        /*   右上角菜单 代码  开始*/
        $rootScope.showRightTop = false;//是否显示右上角 菜单
        $rootScope.msgCount = '';//未读消息数
        $scope.serverMs;//服务器时间
        $scope.uuID ;//客服系统需要的uuid 标示访客
        $scope.netError;//标示 网络不通
        $scope.csId = 138306984;//负责接待 游客的客服Id 实际是 memberId 即微店主, todo 测试阶段 写死为1 实际上应该是 店铺到 店主 到memberId
        $scope.messages =[

        ]; //所有消息的存放数组
        $scope.csTimer = undefined;//循环刷新 timer id
        $scope.csUserInfo ; //客服信息

        //CC CustumerConversation,为了绑定msg 的对象
        $scope.CustumerParam = {
            msg:undefined
        };

        $scope.footerStyle ={
            bottom:'0px'
        };
        //讨论组 特殊 js 代码 开始
        $scope.isShareMode = false;
        $scope.shareShow = function(){
            $scope.isShareMode = !$scope.isShareMode;
        };

        var user = UserService.getUser();

        $scope.groupId = 55;//讨论组id  todo 从路由中得到
        $scope.token = '21CB91E8209EA98369F5E504449497D7';  //这个用户对应的 memberID 138306984
        //讨论组 特殊 js 代码 结束

        $scope.sgdMode = 0; //微学堂讨论组 ，页面状态 0－》学习区 ：只有老师 主持人 说的话 ng－show
        //微学堂讨论组 ，页面状态 1－》讨论区 ：只有学生 说的话 ng－show
        //微学堂讨论组 ，页面状态 2－》全部 ：所有人 说的话 ng－show

        $scope.toggleMode = function(m){
            $scope.sgdMode =m
        };

        $scope.miniTaolun = [
            {msg:33333}, {msg:'erfjwqefjwiqawijofejwjfwe'},{msg:'大事发生反饥饿叫啊喂哦 i 发尾峰'},{msg:'一张图片'}
        ];
        //微学堂特殊部分结束

        //显示隐藏右上角菜单
        $scope.isClick = function () {
            $scope.isDisplay = !$scope.isDisplay;
        };

        $scope.toMemberList  = function(){

            $state.go('groupSetting');
        };
        $scope.isShowRecord = false;

        $scope.tempUrl;//存放临时文件地址

        $scope.showRecord = function () {
            $scope.isShowRecord = true;
        };
        $scope.hideRecord = function () {
            $scope.isShowRecord = false;
        };

        $scope.init = function () {
            $scope.userInCC = UserService.getUser();
            if(!$scope.uuID){
                CustomerConversationService.getUUID().then(function(res){
                    var aa = res;
                    if(res && res.data){
                        $scope.uuID = res.data.vistorId;
                        //得到 uuID 后 创建对话
                        var params = {
                            cmd:'chat',
                            _t:new Date()-0,
                            v:$scope.uuID,
                            u:$scope.uuID,
                            userId:$scope.uuID,
                            c:$scope.csId,
                            chatType:'phone',
                            sid:0,
                            keys:['exp_colum6','sss'],
                            values:[1111222,333]
                        };
                        CustomerConversationService.create(params).then(function(response){
                            if(response && response.data){

                                var aaa = response;
                                if(response.data.type=="OFFLINE"){
                                    alert("客服 不在线")
                                }else if(response.data.chatId ){
                                    //客服连接成功
                                    $scope.csUserInfo = response.data.userInfo;
                                    $scope.chatId = response.data.chatId;
                                }

                            }else{
                                console.log("创建对话失败 －－－－");
                            }

                        },function(errMsg){
                            alert(errMsg);
                        })
                    }
                    else{
                        console.log('server response error'+res);
                    }
                },function(error){
                    alert(error);

                });
            }

            return;
        };

        $scope.getMsg = function () {

            var params ={
                c:'getGroupNewestMsg',
                groupId:$scope.groupId,
                token:$scope.token
            };
            CircleGroupDiscussService.getMsg(params).then(function (res) {

                if (res && res.data && res.data.msgs &&res.data.msgs.length != 0) {

                    for(var i=0;i<res.data.msgs.length;i++){
                        CustomerConversationService.filtMsg (res.data.msgs[i]);
                        if(res.data.msgs[i].message){
                            $scope.messages.push(res.data.msgs[i]);
                        }
                        //if(res.data.msgs[i].indexOf())
                    }

                }
                else{
                    console.log("介绍消息返回错误");

                }
            },function(error){
                alert(error);
            });
        };

        //发送消息
        $scope.sendMsg = function () {
            //http://localhost:8888/api/invoke?c=sendGroupMsg&groupId=1&msg=test111&msgType=1&token=A23B0E753A850F72E47ECE3E19CDB722
            var params = {
                c:'sendGroupMsg',
                groupId:$scope.groupId,
                msg:$scope.CustumerParam.msg,
                msgType:1,
                token:$scope.token

            };
            CircleGroupDiscussService.sendMsg(params).then(function(response){
                    if(response){
                        debugger;
                        var myMsg ={
                            message:params.msg,
                            companyId:undefined
                        };
                        CustomerConversationService.filtMsg(myMsg);//文本信息 经过过滤器 解析表情
                        $scope.messages.push(myMsg);
                    }
                    else{
                        PopupService.showToast('发送消息失败');
                    }
                },function(error){
                    //异常意外
                }
            );
            console.log('发送客服消息----->  ');
        };

        $scope.create = function () {
            CustomerConversationService.create().success(function (response) {
                $scope.chatId = response.chatId ;
                console.log(response);
            });
        };
        //评价


        $scope.endChat = function(){
            var params ={
                cmd:'endChat',
                c:$scope.csId,
                v:$scope.uuID,
                u:$scope.uuID,
                cId:$scope.chatId
            };
            CustomerConversationService.endChat(params).then(function(response){
                if(response && response.data){
                    if(response.data.result == "success"){
                        PopupService.showToastShort('关闭对话成功');

                    }else{
                        console.log('评价时 ，服务端发生异常'+response.data.result);
                    }
                }else{
                    console.log('net error !!!!');
                }
            },function(error){
                alert("网络错误");
            });
        };

        //得到图片成功，得到图片失败
        function getSucc(imageData){
            // alert(imageData);
            $scope.tempUrl = imageData;
            var uploadUrl = CustomerConversationService.getUploadUrl()+"?fileType=.jpg&chatId="+$scope.chatId+"&cId="+$scope.csId;
            FileUploadService.upload($scope.tempUrl,uploadUrl,undefined,undefined,'image/jpeg',{},uploadSucc,uploadFail);
        }
        function getFail(error){
            alert('得到图片失败');
        }

        function uploadSucc(r){
            PopupService.showToast('上传图片成功');
            var resp = JSON.parse(r.response);

            r.data.message = r.response.imageUrl;
            r.data.fileType = '.jpg';
            r.data.companyId = undefined;
            $scope.$apply(function(){
                $scope.messages.push(r.data);
            });

            var eventParam  ={
                cmd:'addEvent',
                //  _t:'',
                c:$scope.csId,
                cId:$scope.chatId,//chatId
                v:$scope.uuID,//uuId
                //  cusId:'admin', 后台不需要此参数
                //上传后文件的url
                msg: resp.data.imageUrl,
                type:'RECORD_FILE'
            };
            CustomerConversationService.addEvent(eventParam).then(function (res) {
                if(res){


                }else{
                    PopupService.showToast("addevent  失败");
                }
            });
        }
        function uploadFail(err){
            alert('上传失败');
        }
        //弹出 图片选择层
        $scope.getImg = function (){
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '拍照'},
                    {text: '从相册选择'}
                ],
                titleText: '上传照片',
                cancelText: 'Cancel',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked:function(index){
                    MediaService.getPicture(index,getSucc,getFail);

                }});
        };
        $scope.play = function(){
            var audio = document.getElementById('audioInSD');
            if(audio){
                audio.play();
            }
        };
        $scope.pause = function(){
            var audio = document.getElementById('audioInSD');
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
        $scope.startRecord = function(){//todo 暂时 无法录音 因为 html 中缺少audio 标签 装载 wav
            MediaService.startCapture('sourceInSD','audioInSD');
        };

        $scope.deleteRecord = function(){
            MediaService.deleteMedia();
        };
        $scope.stopRecord =  function(){
            MediaService.stopCapture('sourceInSD','audioInSD',$scope.transfer);
        };

        //上传音频
        $scope.transfer = function(){//注意fileType 为 .wav todo 客服cid 写死为一 注意fileType 为 .wav
            var uploadUrl = CustomerConversationService.getUploadUrl()+"?fileType=.wav&chatId="+'tlz55'+"&cId="+$scope.csId;
            var audioUrl =  MediaService.getAudioUrl();
            if(!audioUrl){

                PopupService.showToast('音频录制失败，no audioUrl');
            }
            FileUploadService.upload(audioUrl,uploadUrl,undefined,undefined,undefined,{},win,fail);

        };
        var win = function (r) {
            var resp = JSON.parse(r.response),temUrl;
            temUrl = resp.data.imageUrl;console.log(temUrl+'--------');
            temUrl = temUrl.replace(/8181/, "8082");
            resp.data.message ="音频文件";
            resp.data.imageUrl = temUrl;
            resp.data.fileType ='.wav';
            resp.data.companyId = undefined;//客服自己发的信息 没有 companyId 显示在屏幕右侧


            // todo 上传成功后要发送个请求，通知 客服 我已经发送文件

            $scope.deleteRecord();// 删除 本地音频
            $scope.$apply(function(){
                $scope.messages.push(resp.data);
            });
            var eventParam  ={
                cmd:'addEvent',
                //  _t:'',
                c:$scope.csId,
                cId:$scope.chatId,//chatId
                v:$scope.uuID,//uuId
                // cusId:$scope.csId, todo 后台 不需要此参数
                //上传后文件的url
                msg: temUrl,
                type:'RECORD_FILE'
            };
            CustomerConversationService.addEvent(eventParam).then(function (res) {
                if(res){
                    //$scope.$broadcast('$ionicParentView.afterEnter', {who: chatScope});//发通知 给playsound 指令
                    $timeout(function(){
                        $scope.$broadcast('$ionicParentView.afterEnter', {who: chatScope});

                    },500);
                }else{
                    PopupService.showToast("addevent  失败");
                }
            });
        };
        var fail = function (error) {
            alert('上传失败');
        };

        $scope.focusInput = function(){
            //$('#content').focus();
            console.log('content---focus----');
        };
        $scope.showKeyboard = function(){
            var aa=  document.getElementById('content');
            aa.focus();
        };

        $scope.closeKeyboard = function(){
            window.cordova.plugins.Keyboard.close();
        };
        $scope.changeAudioS = function(){
            if(window.AudioToggle){
                if($scope.CustumerParam.msg){
                    AudioToggle.setAudioMode(AudioToggle.SPEAKER);
                }else{
                    AudioToggle.setAudioMode(AudioToggle.EARPIECE);
                }
            }else{
                alert('plugin audio toggle not found!!!');
            }
        };
        $scope.isShowMoreInput = false; //是否显示 底部附加框 ，里面 包含 表情，音频，图片
        $scope.isShowRecord = false;
        $scope.isShowEmo = false;
        $scope.isShowPicture = false;

        $scope.showMoreInput = function(num){
            //$scope.isShowPicture =true;
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

            if(num == 1){
                $scope.isShowEmo = true;$scope.isShowPicture= false;$scope.isShowRecord=false;

            }else if(num == 2){
                $scope.isShowPicture = true ;$scope.isShowEmo = false;$scope.isShowRecord =false;

            }else{
                $scope.isShowRecord = true; $scope.isShowEmo= false; $scope.isShowPicture=false;

            }


        };
        $scope.showPic = function (){
            $scope.isShowPicture = true ;$scope.isShowEmo = false;$scope.isShowRecord =false;$scope.showMoreInput();
        };
        $scope.hideMoreInput = function(){
            var aa=  document.getElementById('content');
            //注意 取消时使文本框 获得焦点
            $timeout(function(){
                $scope.isShowMoreInput = false;
                $scope.footerStyle={
                    bottom:'0px'
                };
                aa.focus();
            },200);

        };
        $scope.addAudio  = function(){
            $scope.messages.push({
                fileType:'.wav',
                imageUrl:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201702/8308.wav',//科学栏目
                companyId:undefined
            });
            $timeout(function(){
                $scope.$broadcast('$ionicParentView.afterEnter', {who: chatScope});

            },500);
        };

        $scope.getValue = function(){
            alert($scope.CustumerParam.msg);
        };
        $scope.insertEmo = function(index){
            $scope.CustumerParam.msg=  $scope.CustumerParam.msg +'['+index+']';
        } ;

        $scope.keybordH = 254; // 先给个 键盘高度 红米 note3 279  iphone6 254
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
            $rootScope.chatScope = e;
            //$scope.init(); //测试本地数据 不需发请求
            $scope.messages =[

                {
                    fileType:'.wav',
                    imageUrl:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201612/8093.wav',//六道骸的笑声
                    companyId:138306984,
                    userName:'我不是路飞啊啊啊',
                    idCate:0 // 0普通学员
                },
                {
                    fileType:'.wav',
                    imageUrl:'http://xunlei.sc.chinaz.com/files/download/sound1/201309/3558.wav',//摇滚乐大鼓
                    companyId:1383068791,
                    userName:'我不是路飞啊啊啊',
                    idCate:1 //圈主

                },
                {
                    fileType:'.wav',
                    imageUrl:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201612/8093.wav',//六道骸的笑声
                    companyId:138306984,
                    userName:'我不是路飞啊啊啊',
                    idCate:0 // 0普通学员
                },
                {
                    fileType:'.wav',
                    imageUrl:'http://xunlei.sc.chinaz.com/files/download/sound1/201309/3558.wav',//摇滚乐大鼓
                    companyId:1383068791,
                    userName:'我不是路飞啊啊啊',
                    idCate:1 //圈主

                },
                //{
                //  fileType:'.wav',
                //  imageUrl:'http://xunlei.sc.chinaz.com/files/download/sound1/201209/2042.wav',//爵士乐
                //  companyId:563210,
                //    userName:'我不是路飞啊啊啊'
                //},
                //{
                //  message:'aaf啊积',//非诚勿扰
                //  companyId:138306879,
                //    userName:'我不是路飞啊啊啊'
                //},
                {
                    message:'affdsa阿拉丁；看风景啊额外了啊减肥我咯肌肤 啊金额为 i 哦分急哦反胃啊俄方阿文访问访问发完疯哇啊发 热瓦甫去啊额晚饭乏味服务范围分无法我 ',//非诚勿扰
                    companyId:138306984,
                    userName:'我不是路飞啊啊啊',
                    idCate:2
                }

            ];
            var emo ={
                message:'aaf啊积极饿哇  啊发[1]',//非诚勿扰
                companyId:1234,
                userName:'我zou是路飞啊啊啊',
                idCate:0
            };

            CustomerConversationService.filtMsg(emo);
            $scope.messages.push(emo);
            $scope.footerStyle ={
                bottom:'0px'
            };
            $scope.isShowMoreInput =false;
            //注意
            window.addEventListener('native.keyboardshow', keyboardShowHandler1);
            window.addEventListener('native.keyboardhide', keyboardHideHandler1);

            MediaService.addAudioEventOnWindow();
            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast
        });
        var chatScope = undefined;
        $scope.mp4url = $sce.trustAsResourceUrl('http://192.168.1.109:8100/mp4/1.mp4');
        $scope.$on('$ionicView.afterEnter', function (e,v) {//配合 play-sound指令进行
            //chatScope =e ;
            //$scope.$broadcast('$ionicParentView.afterEnter', {who: e});
            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast
        });

        $scope.$on('$ionicView.beforeLeave', function (e,v) {
            //配合 play-sound指令进行
            MediaService.removeAudioEventOnWindow();
            window.removeEventListener('native.keyboardshow',keyboardShowHandler1);
            window.removeEventListener('native.keyboardhide',keyboardHideHandler1);

            // $scope.$broadcast('$ionicParentView.beforeLeave', {who: e});
            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast
        });

        $scope.goBack = function () {
            $scope.$ionicGoBack();

        };


    }]);


APP.directive('resizeFootBarsd', ['$ionicScrollDelegate', function($ionicScrollDelegate){
    // Runs during compile
    return {
        replace: false,
        link: function(scope, iElm, iAttrs, controller) {
            scope.$on("taResize", function(e, ta) {
                if (!ta) return;
                var scroll = document.body.querySelector("#message-detail-content-sd");
                var scrollBar = $ionicScrollDelegate.$getByHandle('cdScroll');
                // console.log(scroll);

                var taHeight = ta[0].offsetHeight;
                var newFooterHeight = taHeight + 10;
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
                //console.log(newFooterHeight-6);

                iElm[0].style.height = newFooterHeight + 'px';
                scroll.style.bottom = newFooterHeight + 'px';
                scrollBar.scrollBottom();
            });
        }
    };
}]);
