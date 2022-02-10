/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('CircleGroupDiscussController', ['$scope', '$rootScope', '$ionicHistory', '$stateParams', '$state', '$timeout', '$interval', 'CircleGroupDiscussService','UserService','PopupService',
    '$ionicActionSheet','MediaService','FileUploadService','$sce','CustomerConversationService','$q','$ionicScrollDelegate',
    function ($scope, $rootScope, $ionicHistory, $stateParams, $state, $timeout, $interval, CircleGroupDiscussService,UserService,PopupService,
              $ionicActionSheet,MediaService,FileUploadService,$sce,CustomerConversationService,$q,$ionicScrollDelegate) {
        //    初始化参数
        $scope.isDisplay = false;//消息小红点判断
        /*   右上角菜单 代码  开始*/
        $rootScope.showRightTop = false;//是否显示右上角 菜单
        $rootScope.msgCount = '';//未读消息数
        $scope.serverMs;//服务器时间
        $scope.uuID ;//客服系统需要的uuid 标示访客
        $scope.netError;//标示 网络不通
        $scope.csId = 138306984;//负责接待 游客的客服Id 实际是 memberId 即微店主, todo 测试阶段 写死为1 实际上应该是 店铺到 店主 到memberId
        $scope.messages =[]; //所有消息的存放数组
        $scope.csTimer = undefined;//循环刷新 timer id
        $scope.csUserInfo ; //客服信息
        $scope.circleId;//跟讨论组 关联 的圈子ID
        //CC CustumerConversation,为了绑定msg 的对象
        $scope.CustumerParam = {
            msg:''
        };

        $scope.footerStyle ={
            bottom:'0px'
        };
        //讨论组 特殊 js 代码
        $scope.isShareMode = false;
        $scope.shareShow = function(){
            $scope.isShareMode = !$scope.isShareMode;
        };

        $scope.toShareListPage = function(si){
            $state.go('shareListPage',{sl:si});
        };

        var user = UserService.getUser();

        $scope.groupId;//讨论组id  todo 从路由中得到
        $scope.chatId = $scope.groupId; //讨论组 这里的chatId 是为了 给上传文件接口用的,定义了上传文件的保存路径,无业务意义

        $scope.row = 0;//每次 getMsg 纪录 取的信息的 序号 以防取到重复的

       // $scope.token = '51B6A4F486826040418A5182AD983A01';  //'51B6A4F486826040418A5182AD983A01';  // todo 这个用户对应的 memberID 138306987       //9F90B0C045FDF21B86642416EAB120EC  对应986

        $scope.token= UserService.getUser().sessionValue;
        //显示隐藏右上角菜单
        $scope.isClick = function (isTest) {
          if(isTest){
            $scope.isDisplay = !$scope.isDisplay;
          }else{
           $state.go('discussionGroup',{groupId:$scope.groupId,circleId:$scope.circleId});//非测试下 直接到 GroupDiscusson 页面
          }
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
        $scope.isSchool= true;//是否是 微学堂 ，微信堂有区域切换 todo 如果不是微学堂 则sgMode 始终为2 才不影响 每条消息的显示

        $scope.sgdMode = 2; //微学堂讨论组 ，页面状态 0－》学习区 ：只有老师 主持人 说的话 ng－show
        //微学堂讨论组 ，页面状态 1－》讨论区 ：只有学生 说的话 ng－show
        //微学堂讨论组 ，页面状态 2－》全部 ：所有人 说的话 ng－show

        $scope.toggleMode = function(m){
          $scope.sgdMode =m
        };

        $scope.init = function () {

        };
        $scope.noMoreHistory = false;
        //获取历史消息
        $scope.getMsgByMun = function(){
            if($scope.noMoreHistory){
                return;
            }
            var params = {
                beginMun:0 ,
                groupId: $scope.groupId,
                endMun:1000,
                //  startTime:'2017-2-20 00:00:00',
                //  endTime:'2017-2-21 23:59:59',
                token:$scope.token
            };
            CircleGroupDiscussService.getMsgByMun(params).success(function(res){
                if(res){//todo 换掉假数据
                    if(res.rows && angular.isArray(res.rows)){

                        for(var i=0;i<res.rows.length;i++){
                            CircleGroupDiscussService.filtMsg(res.rows[i]);
                        }
                        $scope.messages = res.rows.concat($scope.messages);

                        if(res.rows.length <1000){
                            //已经 取出所有数据了  noMoreHistory = true;
                            $scope.noMoreHistory = true;
                        }else{
                            //todo 找到 $scope.messages［0］ 的时间 再向前查到 讨论组 开始前 的一段时间
                        }
                    }else{
                        consoel.warn('sg--getMsgByMun-- response  not array !! ')
                    }

                }else{
                   PopupService.showToast("获得 讨论组 历史聊天记录 失败");
                }
            }).finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });
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
        $scope.getMsg = function () {
            var defer = $q.defer();
            var isSelfInParam = $scope.messages.length ==0 ?1:0;// 第一次进 取所有 message 带自己
            var params ={
                c:'getGroupNewestMsg',
                groupId:$scope.groupId,
                token:$scope.token,
                row:$scope.row,
                isSelf:isSelfInParam
            };
            CircleGroupDiscussService.getMsg(params).then(function (res) {

                if (res && res.data && res.data.msgs &&res.data.msgs.length != 0) { //    55//groupMsg//    ://    "ggggg"//groupMsgType//    ://    0//groupMsgUserId//
                        // ://    "138306986"//groupMsgUserName//    ://    "138306986"//sendTimes//    ://    "2017-02-20 17:25:56"

                    for(var i=0;i<res.data.msgs.length;i++){
                        if(res.data.msgs[i].groupMsg){
                            //todo 过滤
                            CircleGroupDiscussService.filtMsg (res.data.msgs[i]);
                            $scope.messages.push(res.data.msgs[i]);
                        }
                        //if(res.data.msgs[i].indexOf())
                    }
                  $scope.row = res.data.row;
                    defer.resolve(1);
                }

                else{
                    console.log("介绍消息返回错误");
                    defer.reject(1);
                }

            },function(error){
                alert(error);
            });
            return defer.promise;
        };

        //发送消息
        $scope.sendMsg = function () {
            //http://localhost:8888/api/invoke?c=sendGroupMsg&groupId=1&msg=test111&msgType=1&token=A23B0E753A850F72E47ECE3E19CDB722
            var params = {
                c:'sendGroupMsg',
                groupId:$scope.groupId,
                msg:$scope.CustumerParam.msg,
                msgType:1,//5 代表 share 分享的信息
                token:$scope.token

            };
            if(!$scope.CustumerParam.msg){
                PopupService.showToast('发送的消息不能为空');
            }

            CircleGroupDiscussService.sendMsg(params).then(function(response){
                    if(response){
                      if(response.data&& response.data.rt == 103){//被禁言了
                        PopupService.showToast('您已经被禁言，请联系管理员');
                        return;
                      }
                        var myMsg ={
                            groupMsg:params.msg,
                            groupMsgUserId:$scope.csId,
                            groupMsgUserName:user.nickName,//顺逛 用户 有个nick Name 可以为空
                            sendTimes:new Date().pattern('yyyy-MM-dd hh:mm:ss')//准备时间数据
                        };

                        CircleGroupDiscussService.filtMsg(myMsg);//文本信息 经过过滤器 解析表情
                        $scope.messages.push(myMsg);
                        $scope.CustumerParam.msg = '';
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


        //得到图片成功，得到图片失败
        function getSucc(imageData){
            // alert(imageData);
            $scope.tempUrl = imageData;
            var uploadUrl = CustomerConversationService.getUploadUrl()+"?fileType=.jpg&chatId="+"tlz55"+"&cId="+$scope.csId;//todo 群聊发文件 不需要chatId
            FileUploadService.upload($scope.tempUrl,uploadUrl,undefined,undefined,'image/jpeg',{},uploadSucc,uploadFail);
        }
        function getFail(error){
            alert('得到图片失败');
        }

        function uploadSucc(r){
            PopupService.showToast('上传图片成功');

            var resp = JSON.parse(r.response);
            var temUrl = resp.data.imageUrl;
         //   temUrl = temUrl.replace(/8181/, "8082");// todo 这里 因为上传后的 图片 不在同意个 tomcat 是上
            resp.data.groupMsg ="图片文件";
            resp.data.imageUrl = temUrl;
            resp.data.fileType ='.jpg';
            resp.data.groupMsgUserId = $scope.csId;//群聊 发送完音频 将 这个消息 加上发送人
            resp.data.timeStamp = new Date()-0;
            resp.data.sendTimes = new Date().pattern('yyyy-MM-dd hh:mm:ss');
         //   $scope.$apply(function(){
         //       $scope.messages.push(resp.data);//todo 缺少 头像 和timeStamp
        //    });
            var params = {
                c:'sendGroupMsg',
                groupId:$scope.groupId,
                msg:temUrl,
                msgType:1,
                token:$scope.token

            };
            CircleGroupDiscussService.sendMsg(params).then(function(response){
                    if(response){
                      if(response.data&& response.data.rt == 103){//被禁言了
                        PopupService.showToast('您已经被禁言，请联系管理员');
                        return;
                      }
                      $scope.messages.push(resp.data);//没被禁言 再往messages 里提交
                        console.log('发送完图片 将 这个消息 to group chat');
                    }
                    else{
                        PopupService.showToast('发送消息失败--发送音频后');
                    }
                },function(error){
                    //异常意外
                }
            );

        }
        function uploadFail(err){
            alert('上传失败');
        }
        //弹出 图片选择层
        $scope.getImg = function (index){
            MediaService.getPicture(index,getSucc,getFail);
        };
        $scope.play = function(){
            var audio = document.getElementById('audioInCD');
            if(audio){
                audio.play();
            }
        };
        $scope.pause = function(){
            var audio = document.getElementById('audioInCD');
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
        $scope.startRecord = function(){//todo 暂时 无法录音 因为 html 中缺少audio 标签 装载 wav
            MediaService.startCapture('sourceInCD','audioInCD');
        };

        $scope.deleteRecord = function(){
            MediaService.deleteMedia();
        };
        $scope.stopRecord =  function(){
            PopupService.showToastShort("录音完成，正在上传...");
            MediaService.stopCapture('sourceInCD','audioInCD',$scope.transfer);
        };

        //上传音频
        $scope.transfer = function(){//注意fileType 为 .wav todo 客服cid 写死为一 注意fileType 为 .wav
            var uploadUrl = CustomerConversationService.getUploadUrl()+"?fileType=.wav&chatId="+'tlz55'+"&cId="+$scope.csId;//todo 群聊发文件 不需要chatId
            var audioUrl =  MediaService.getAudioUrl();
            if(!audioUrl){

                PopupService.showToast('音频录制失败，no audioUrl');
            }
            FileUploadService.upload(audioUrl,uploadUrl,undefined,undefined,undefined,{},win,fail);

        };
        var win = function (r) {
            var resp = JSON.parse(r.response),temUrl;
            temUrl = resp.data.imageUrl;console.log(temUrl+'--------');
           // temUrl = temUrl.replace(/8181/, "8082");
            resp.data.groupMsg ="音频文件";
            resp.data.imageUrl = temUrl;
            resp.data.fileType ='.wav';
            resp.data.groupMsgUserId = $scope.csId;//群聊 发送完音频 将 这个消息 加上发送人
            resp.data.timeStamp = new Date()-0;
            resp.data.sendTimes = new Date().pattern('yyyy-MM-dd hh:mm:ss');

            $scope.deleteRecord();// 删除 本地音频
            //$scope.$apply(function(){
            //    $scope.messages.push(resp.data);
            //});
            var params = {
                c:'sendGroupMsg',
                groupId:$scope.groupId,
                msg:temUrl,
                msgType:1,
                token:$scope.token

            };
            CircleGroupDiscussService.sendMsg(params).then(function(response){
                    if(response){
                        if(response.data&& response.data.rt == 103){//被禁言了
                          PopupService.showToast('您已经被禁言，请联系管理员');
                          return;
                        }
                      $scope.messages.push(resp.data);
                       console.log('发送完音频 将 这个消息 to group chat');
                    }
                    else{
                        PopupService.showToast('发送消息失败--发送音频后');
                    }
                    $scope.loopGetMsg();
                },function(error){
                    //异常意外
                }
            );



        };
        var fail = function (error) {
            alert('上传失败');
            $scope.loopGetMsg();
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
            if($scope.isPlaying){
                console.log('is playing ,audion panel cant closed');return;
            }
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
            var strindex = index>=10?index:('0'+index);
            $scope.CustumerParam.msg=  $scope.CustumerParam.msg +'['+strindex+']';
        } ;

        $scope.keybordH = 254; // 先给个 键盘高度 红米 note3 279  iphone6 254
        $scope.emoDivStyle ={
            height: $scope.keybordH+'px'
        };

        $scope.chooseOne = function(mItem){
            mItem.isSelected = !mItem.isSelected;
        };
        $scope.shareToGroup = function(){//todo

            var sarr =[];
            angular.forEach($scope.messages,function(o,i){
                if(o.isSelected){
                    sarr.push(o);
                }
            });
            var str ='讨论组名称'+'$share' + JSON.stringify(sarr);

            $state.go('groupsToShare',{shareList:str});


        };
        $scope.deleteGroupMsg = function(){

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
             //测试本地数据 不需发请求
            //$scope.messages =[
            //
            //  {
            //    fileType:'.wav',
            //    imageUrl:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201612/8093.wav',//六道骸的笑声
            //      groupMsgUserId:138306984,
            //      groupMsgUser:'我不是路飞啊啊啊'
            //  }
            //
            //];
            //var emo ={
            //    groupMsg:'aaf啊积极饿哇  啊发[01]',//非诚勿扰
            //    groupMsgUserId:1234,
            //    groupMsgUser:'我zou是路飞啊啊啊',
            //    sendTimes:'2017-02-27 11:11:11'
            //    };
            //var emo1 = {
            //    groupMsg:sm.groupMsg,//
            //    groupMsgUserId:138306986,
            //    groupMsgUserName:'我zou是路飞啊啊啊',
            //    sendTimes:'2017-02-29 11:11:11',
            //    idCate:0,
            //    avatarImageFileid:'http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png'
            //};
            // 客服页面往 绑定页面的 messgges 有变化 有三处 sendmsg 和 一处 loadMessage ，访客页面 三处 sendmsg 和 一处 getMessage 注意 访客 的返回msg的list无发送时间
            // 群组 绑定页面的 messgges 有变化  有三处 sendmsg 和 一处 getMessage

            //CircleGroupDiscussService.filtMsg(emo);
            // CircleGroupDiscussService.filtMsg(emo1);
            //$scope.messages.push(emo);
            //$scope.messages.push(emo1);

            var user = UserService.getUser();
            $scope.csId = user.mid;
            $scope.init();
            $scope.footerStyle ={
                bottom:'0px'
            };
            $scope.isShowMoreInput =false;
            //注意
            window.addEventListener('native.keyboardshow', keyboardShowHandler1);
            window.addEventListener('native.keyboardhide', keyboardHideHandler1);

            MediaService.addAudioEventOnWindow();
            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast


          $scope.groupId= $stateParams.groupId;
          $scope.circleId = $stateParams.circleId;
          if(!$scope.groupId){
            PopupService.showAlert('严重错误','没有讨论组Id！！！');
          }
          if (v.direction == 'back') {//不需要刷新  $ionicView.enter
              $scope.loopGetMsg();
          }else{
              $scope.messages = [];
              //初始化 一系列 参数 如 groupId
              $scope.groupId = 61;//todo 注意从路由地址取
            $scope.loopGetMsg();
          }
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
            $scope.killTimer();

            // $scope.$broadcast('$ionicParentView.beforeLeave', {who: e});
            //    window.open('http://172.16.63.98:8080/live/chatPhone.dll?c=1', '_blank', 'location=no');  $broadcast
        });

        $scope.goBack = function () {
            if($scope.isPlaying){
                console.log('is playing record -- cant go back');
                return;
            }
            $scope.$ionicGoBack();

        };


    }]);


APP.service('CircleGroupDiscussService', ['$http', 'UrlService','$sce', function ($http, UrlService,$sce) {
    //登录
    var customerHost = "http://123.56.3.136:8181";//牛发旺的后台 http://172.16.63.134:8888  //http://123.56.3.136:8089   //gaobin  http://172.16.63.71
    var webapp = '/api/invoke'; // 'invoke'                          ios/api/invoke

    var getMsgByMumUrl ='http:///123.56.3.136:8180/Service/chatGroup/queryPageGroupMsg';

    //获得历史消息
    this.getHistoryMsg = function () {
        return $http.get('./data/qhot.json');
    };
    //获得消息
    this.getMsg = function (params) {

        var url = customerHost+webapp;
        return $http.get(url,params);
    };//获得历史消息


    this.sendMsg = function (params) {
        var url = customerHost+webapp ;
        return $http.get(url,params);

    };
    // 获取 缓存 对话
    this.getAllMsg =  function (params) {

        var url = customerHost+webapp;
        return $http({
            method: 'POST',
            url:url,
            params: params
        })
    };

    //获得历史消息
    this.getMsgByMun =function(params){//queryPageGroupMsg

        return $http({
            method: 'POST',
            url:getMsgByMumUrl,
            params: params
        })
    };

    //将后台 返回到message数组元素 做些特殊处理， 音频 变音频， 图片变图片
    this.filtMsg = function(msg){
        if(msg.type =='EVENT_ACCEPT'){
            msg.isFirstFlag = true;//标示 客服说到第一句话
        }

        if(msg.sendTimes){//准备好时间
            msg.timeStamp = new Date(msg.sendTimes)-0;
        }else{
            console.warn(msg.groupMsg+'这条消息 无 合法时间');
        }


        if(msg.groupMsg && msg.groupMsg.indexOf('$share')>-1){//当收到其它群组分享来的消息 以'$share'分割 json 数组 和 讨论组的名字
            var pos = msg.groupMsg.indexOf('$share');
            var from = msg.groupMsg.substring(0,pos);
            var arrJson = msg.groupMsg.substring(pos+6);//加上$share 6个字符
            var reg = /\\/g;
            arrJson = arrJson.replace(reg,"");
            var objsm = JSON.parse(arrJson);
            var shareMsgsLength = 0;
            if(angular.isArray(objsm)){
                shareMsgsLength= objsm.length
            }else{
                console.error('fatal error, sharedMsg not legal !!!');
            };
            var shareMsg ={
                fileType:'share',
                from:from,
                shareMsgsList:objsm,
                groupMsgUserId:1234,
                groupMsgUserName:'我zou是路飞啊啊啊',
                shareMsgsLength:4
            };
            //分享的消息 必须带这几个字段
            msg.shareMsgsList = objsm;
            msg.fileType ='share';
            msg.shareMsgsLength = shareMsgsLength;
            msg.from=from;
            //$scope.messages.push(shareMsg);

        }
        else if(msg.groupMsg && msg.groupMsg.indexOf('http')>-1 && msg.groupMsg.indexOf('.jpg')>-1){
            msg.fileType = '.jpg';
            //传纯图片 fileType  为'.jpg'
            msg.imageUrl = msg.groupMsg;
        }else if(msg.groupMsg && msg.groupMsg.indexOf('http')>-1 && msg.groupMsg.indexOf('.wav')>-1){
            msg.fileType ='.wav';
            msg.imageUrl = msg.groupMsg; // 用了 落木沙 的 playsound 指令 就不再用 $sce.trustAsResourceUrl(msg.message);
        }
        else if(msg.groupMsg.indexOf('[')>-1 && msg.groupMsg.indexOf(']')>-1){//注意  过滤 表情的 一定放在最后
            //含有表情 需要转化为 img
            for(var k=1;k<16;k++){//一共 15中表情
                msg.groupMsg =emoToImage(msg.groupMsg,k);
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

    //格式化 时间 的js 代码



    var date = new Date();
  //  window.alert(date.pattern("yyyy-MM-dd hh:mm:ss"));
    var stringTime = "2014-8-4 10:21:12";
    var nd = new Date(stringTime);
  //  window.alert(nd.pattern("yyyy-MM-dd hh:mm:ss"));

}]);

APP.directive('resizeFootBarcd', ['$ionicScrollDelegate', function($ionicScrollDelegate){
    // Runs during compile
    return {
        replace: false,
        link: function(scope, iElm, iAttrs, controller) {
            scope.$on("taResize", function(e, ta) {
                if (!ta) return;
                var scroll = document.body.querySelector("#message-detail-content-cd");
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


var sm = {groupMsg:"飞机飞啊飞哇$share[{\\\"fileType\\\":\\\".wav\\\",\\\"imageUrl\\\":\\\"http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201612/8093.wav\\\",\\\"groupMsgUserId\\\":138306984,\\\"groupMsgUser\\\":\\\"\u6211\u4e0d\u662f\u8def\u98de\u554a\u554a\u554a\\\",\\\"$$hashKey\\\":\\\"object:22\\\",\\\"isSelected\\\":true},{\\\"fileType\\\":\\\".wav\\\",\\\"imageUrl\\\":\\\"http://xunlei.sc.chinaz.com/files/download/sound1/201309/3558.wav\\\",\\\"groupMsgUserId\\\":1383068791,\\\"groupMsgUserName\\\":\\\"\u6211\u4e0d\u662f\u8def\u98de\u554a\u554a\u554a\\\",\\\"$$hashKey\\\":\\\"object:23\\\",\\\"isSelected\\\":true},{\\\"groupMsg\\\":\\\"affdsa\u963f\u62c9\u4e01\uff1b\u770b\u98ce\u666f\u554a\u989d\u5916\u4e86\u554a\u51cf\u80a5\u6211\u54af\u808c\u80a4 \u554a\u91d1\u989d\u4e3a i \u54e6\u5206\u6025\u54e6\u53cd\u80c3\u554a\u4fc4\u65b9\u963f\u6587\u8bbf\u95ee\u8bbf\u95ee\u53d1\u5b8c\u75af\u54c7\u554a\u53d1 \u70ed\u74e6\u752b\u53bb\u554a\u989d\u665a\u996d\u4e4f\u5473\u670d\u52a1\u8303\u56f4\u5206\u65e0\u6cd5\u6211 \\\",\\\"groupMsgUserId\\\":138306984,\\\"groupMsgUser\\\":\\\"\u6211\u4e0d\u662f\u8def\u98de\u554a\u554a\u554a\\\",\\\"$$hashKey\\\":\\\"object:24\\\",\\\"isSelected\\\":true},{\\\"groupMsg\\\":\\\"aaf\u554a\u79ef\u6781\u997f\u54c7 \u554a\u53d1\\\",\\\"groupMsgUserId\\\":1234,\\\"groupMsgUser\\\":\\\"\u6211zou\u662f\u8def\u98de\u554a\u554a\u554a\\\",\\\"$$hashKey\\\":\\\"object:25\\\",\\\"isSelected\\\":true},{\\\"groupMsg\\\":\\\"http://cdn21test.ehaier.com:8080/file/58648050246126ab1e39f3e8.png\\\",\\\"groupMsgUserId\\\":1234,\\\"groupMsgUserName\\\":\\\"\u6211zou\u662f\u8def\u98de\u554a\u554a\u554a\\\",\\\"$$hashKey\\\":\\\"object:26\\\",\\\"isSelected\\\":true}]"}
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

var historyMsg = {
    "total": 0,
    "core": "10000",
    "rows": [
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test1111",
            "sendTimes": "2017-02-28 14:49:43",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        },
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test11e",
            "sendTimes": "2017-02-28 14:50:15",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        },
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test11e",
            "sendTimes": "2017-02-28 14:51:58",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        },
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test11e",
            "sendTimes": "2017-02-28 15:00:43",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        },
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test2223",
            "sendTimes": "2017-02-28 16:27:12",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        },
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test111dddd",
            "sendTimes": "2017-02-28 16:29:49",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        },
        {
            "groupId": 61,
            "companyId": 138306984,
            "groupMsg": "test111dddd",
            "sendTimes": "2017-02-28 16:30:05",
            "groupMsgUserId": "138306984",
            "groupMsgUserName": "138306984",
            "idCate": 1,
            "avatarImageFileid": "http://cdn22.ehaier.com/file/5872f927b702c4e3398315da.png",
            "nickName": "张三",
            "userGag": "0"
        }
    ],
    "footer": []
};
