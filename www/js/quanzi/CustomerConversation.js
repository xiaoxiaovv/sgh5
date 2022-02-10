/**
 * creator:xufeng
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('CustomerConversationController', ['$scope', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval', 'CustomerConversationService','UserService','PopupService',
  '$ionicActionSheet','MediaService','FileUploadService','$q','$stateParams',
  function ($scope, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval, CustomerConversationService,UserService,PopupService,$ionicActionSheet,MediaService,FileUploadService,$q,$stateParams) {
    //    初始化参数
    $scope.isDisplay = false;//消息小红点判断

    /*   右上角菜单 代码  开始*/
    $rootScope.showRightTop = false;//是否显示右上角 菜单
    $rootScope.msgCount = '';//未读消息数
    $scope.serverMs;//服务器时间
    $scope.uuID ;//客服系统需要的uuid 标示访客
    $scope.netError;//标示 网络不通
    $scope.csId = 138306984;//负责接待 游客的客服Id 实际是 memberId 即微店主, todo 测试阶段 实际上应该是 店铺到 店主 到memberId 138306987

    $scope.productObjs = [];
    $scope.messages =[

    ]; //所有消息的存放数组
    $scope.csTimer = undefined;//循环刷新 timer id
    $scope.csUserInfo ; //客服信息

    //CC CustumerConversation,为了绑定msg 的对象
    $scope.CustumerParam = {
      msg:''
    };

    $scope.footerStyle ={
      bottom:'0px'
    };

    //显示隐藏右上角菜单
    $scope.isClick = function () {
      $scope.isDisplay = !$scope.isDisplay;
    };
    $scope.isShowRecord = false;

    $scope.tempUrl;//存放临时文件地址

    $scope.isOffLine = false;//客服是否离线 ，若离线 后退 不会 触发 评价

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
              u:$scope.userInCC.mid,//3月9日 换成了 memberID
              userId:$scope.uuID,
              c:$scope.csId,
              chatType:'phone',
              sid:0,
              keys:['mid','image'],
              values:[1111222,333]
            };
            CustomerConversationService.create(params).then(function(response){
              if(response && response.data){

                var aaa = response;
                if(response.data.type=="OFFLINE"){
                  PopupService.showToast("客服暂时不在线");
                }else if(response.data.chatId ){
                  //客服连接成功
                  $scope.csUserInfo = response.data.userInfo;
                  $scope.chatId = response.data.chatId;
                  $scope.loopGetMsg();
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

    $scope.killTimer = function () {
      $timeout.cancel($scope.csTimer);
      $scope.csTimer = undefined;
    };

    //开始循环调用Msg 再发送消息，发送图片，发送语音前 kill 成功返回再loop， 当网络错误时 弹出 提示层 确认后 start 默认3秒 一请求
    $scope.loopGetMsg = function () {
      if($scope.isPlaying){
        //正在录音 ，不需要loopgetMsg
        console.log('正在录音 ，不需要loopgetMsg');
        return;
      }
      $scope.getMsg().then(function (eventType) {//eventType 代表 getMsg 的回调消息 可能成功，可能有异常
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
      var params ={
        cmd:'getMessage',
        _t:new Date()-0,
        c:$scope.csId,
        v:$scope.uuID,
        cId:$scope.chatId
      };
      CustomerConversationService.getMsg(params).then(function (res) {

        if (res && res.data && res.data.msgs &&res.data.msgs.length != 0) {

          for(var i=0;i<res.data.msgs.length;i++){
            CustomerConversationService.filtMsg (res.data.msgs[i]);
            if(res.data.msgs[i].message){
              $scope.messages.push(res.data.msgs[i]);
            }
            //if(res.data.msgs[i].indexOf())
          }
          defer.resolve(1);
        }
        else{
          console.log('customerConversation--getMsg--server -- error---!!!');
          console.log(res);
          defer.resolve(1);
        }
      },function(error){
        alert(error);
        defer.resolve(1);
      });

      return defer.promise;
    };

    //发送消息
    $scope.sendMsg = function () {
      var params = {
        cmd:'addMessage',
        _t:new Date()-0,
        c:$scope.csId,
        v:$scope.uuID,
        u:$scope.uuID,
        cId:$scope.chatId,
        msg:$scope.CustumerParam.msg

      };
      if(!params.msg){
        PopupService.showToast('发送消息不能为空');
        return;
      }
      CustomerConversationService.sendMsg(params).then(function(response){
            if(response){
              var myMsg ={
                message:params.msg,
                companyId:undefined
              };
              CustomerConversationService.filtMsg(myMsg);//文本信息 经过过滤器 解析表情
              $scope.messages.push(myMsg);
              $scope.CustumerParam.msg = undefined;
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
    $scope.opinion = function(level){
      var params ={
        cmd:'opinion',
        c:$scope.csId,
        v:$scope.uuID,
        u:$scope.uuID,
        op:level,//评价等级 todo 暂时写死
        desp:'非常不错！！',
        b_op:4,  //暂时不知道什么用 ，写死为4
        cId:$scope.chatId
      };
      CustomerConversationService.opinion(params).then(function(response){
        if(response && response.data){
          if(response.data.result == "success"){
            PopupService.showToastShort('评价成功');
            var paramsEvent={
              cmd:'addEvent',
              c:$scope.csId,
              v:$scope.uuID,
              u:$scope.uuID,
              cusId:$scope.csUserInfo.userId,
              msg:
                  'finn',
              type:
                  'EVENT_OPINION',
              cId:$scope.chatId
            };
            //通知客服端 评价成功
            CustomerConversationService.addEvent(paramsEvent).then(function(response){
              if(response){
                var aa = response ;
              }else{
                console.log("评价结束后 发event 失败");
              }
              $ionicHistory.goBack();
            },function(error){
              alert("评价结束后 发event 错误");
            });
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
    $scope.transferTo =1;//转接后  客服对id todo 测试 暂时写死
    $scope.transferChat = function(){
      var params ={
          cmd:'transferChat',
          c:$scope.csId,
          v:$scope.uuID,
          chatId:$scope.chatId,
          transNum:1,
          aId: $scope.transferTo
      };
      CustomerConversationService.transferChat(params).then(function(res){
        if(res && res.data) {
          if(res.data.result == 'success'){

            $scope.chatId = res.data.chat1;
            $scope.csId =  $scope.transferTo;

          }else{
            alert('transfer chat  server response error ！！！');
          }

        }else{
          alert('transfer chat  net error ！！！');
        }

      });
    };

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
      var temUrl = resp.data.imageUrl;
     // temUrl = temUrl.replace(/8181/, "8082");// todo 这里 因为上传后的 图片 不在同意个 tomcat 是上
      console.log('imgurl======>>>>>'+temUrl);
      resp.data.imageUrl = temUrl;
      resp.data.fileType = '.jpg';
      resp.data.companyId = undefined;
      resp.data.message = '图片文件';
      resp.data.companyId = undefined;
      $scope.$apply(function(){
        $scope.messages.push(resp.data);
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
    //选择图片
    $scope.getImg = function (index){
      MediaService.getPicture(index,getSucc,getFail);
    };
    $scope.play = function(){
        var audio = document.getElementById('audioInCC');
        if(audio){
          audio.play();
        }
    };
    $scope.pause = function(){
      var audio = document.getElementById('audioInCC');
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
        //开始录音
        $scope.killTimer();
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
            $scope.killTimer();
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
      MediaService.startCapture('sourceInCC','audioInCC');
    };

    $scope.deleteRecord = function(){
      MediaService.deleteMedia();
    };
    $scope.stopRecord =  function(){
      PopupService.showToastShort("录音完成，正在上传...");
      MediaService.stopCapture('sourceInCC','audioInCC',$scope.transfer);
    };

    //上传音频
    $scope.transfer = function(){//注意fileType 为 .wav todo 客服cid 写死为一 注意fileType 为 .wav
      var uploadUrl = CustomerConversationService.getUploadUrl()+"?fileType=.wav&chatId="+$scope.chatId+"&cId="+$scope.csId;
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
        //发送event 后继续loop
        $scope.loopGetMsg();
      });
    };
    var fail = function (error) {
      alert('上传失败');
      $scope.loopGetMsg();//上传图片失败 后 继续loop
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

    $scope.showMoreInput = function(){
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

    };
    $scope.showPic = function (){
      $scope.isShowPicture = true ;$scope.isShowEmo = false;$scope.isShowRecord =false;$scope.showMoreInput();
    };
    $scope.hideMoreInput = function(){
      if($scope.isPlaying){
        console.log('is playing ,audion panel cant closed');return;
      }
      var aa=  document.getElementById('content');
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

    //发送商品链接
    $scope.sendLink = function(prdObj){
      var jsonStr  = JSON.stringify(prdObj);
      var msgToSend  ='$prodLink'+jsonStr;
      var params = {
        cmd:'addMessage',
        _t:new Date()-0,
        c:$scope.csId,
        v:$scope.uuID,
        u:$scope.uuID,
        cId:$scope.chatId,
        msg:msgToSend

      };
      if(!params.msg){
        PopupService.showToast('发送消息不能为空');
        return;
      }
      CustomerConversationService.sendMsg(params).then(function(response){
          if(response){
            var myMsg ={
              message:params.msg,
              companyId:undefined
            };
            CustomerConversationService.filtMsg(myMsg);//文本信息 经过过滤器 解析表情
            $scope.messages.push(myMsg);
            $scope.CustumerParam.msg = undefined;
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
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $rootScope.chatScope = e;
      $scope.isPlaying = false;//使页面处于不在录音的状态
      if (v.direction == 'back'){


      }else{
        $scope.productObjs = [];//$stateParams.products;
        //$scope.productObjs =[{
        //  productFullName:'海尔冰箱',
        //  productTitle:'这个冰箱很好，节能又环保，国家5a级认证，经济又实惠 ！啊啊',
        //  actualPrice:2099,
        //  productId:'4641',
        //  o2oType:'0',
        //  fromType:4,
        //  storeId:138306984
        //}];//todo  假数据

        $scope.init();

      }

     //测试本地数据 不需发请求
      //$scope.messages =[
      //
      //  {
      //    fileType:'.wav',
      //    imageUrl:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201612/8093.wav',//六道骸的笑声
      //    companyId:138306987
      //  },
      //  {
      //    fileType:'.wav',
      //    imageUrl:'http://xunlei.sc.chinaz.com/files/download/sound1/201309/3558.wav',//摇滚乐大鼓
      //    companyId:138306879
      //  },
      //  {
      //    fileType:'.wav',
      //    imageUrl:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201702/8308.wav',//爵士乐
      //    companyId:138306879
      //  },
      //  {
      //    message:'aaf啊积',//非诚勿扰
      //    companyId:138306879
      //  }
      //
      //];
      //var emo ={
      //      message:'aaf啊积极饿哇  啊发[01]',//非诚勿扰
      //      companyId:1234
      //    };
      //
      //CustomerConversationService.filtMsg(emo);
      //$scope.messages.push(emo);
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
    // $scope.mp4url = $sce.trustAsResourceUrl('http://192.168.1.109:8100/mp4/1.mp4');
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

    });

    $scope.$on('play-sound-ended', function (e,v) {

      console.log(e);
      console.log(v.id.src);
      for(var i=0;i<$scope.messages.length;i++){
        if($scope.messages[i].imageUrl === v.id.src){
          if( i < $scope.messages.length - 1 && $scope.messages[i + 1].fileType === '.wav'){
            console.log($scope.messages[i + 1].imageUrl);
            $scope.$broadcast('play-sound-next',{id:$scope.messages[i + 1].imageUrl})
          }
        }
      }

    });


    $scope.goBack = function () {
      if($scope.isPlaying){
        console.log('is playing record -- cant go back');
        return;
      }
      if($scope.isOffLine){
        //客服不在线 可以不用评价返回
        return;
      };
      $scope.actSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<b>非常满意</b> ' },
          { text: '<b>比较满意</b> ' },
          { text: '<b>一般</b> ' },
          { text: '<b>不满意</b> ' }
        ],
        titleText: '评价客服',
        cancelText: '取消',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          $scope.opinion(index);
          return true;
        }

      });
      return ;

    };

  }]);


APP.service('CustomerConversationService', ['$http', 'UrlService','$sce', function ($http, UrlService,$sce) {
  //登录
  var customerHost = "http://123.56.3.136:8182";//牛发旺的后台 123.56.3.136:8089      http://172.16.63.134:8181  -->曹艳杰  //172.16.63.71 gaobin
  var webapp = '/';    //  live/


  this.login = function (params) {
    var params = {
      'c': 'li',
      'u': 'admin',
      'p': '123456'

    };
    var host = 'http://172.16.63.98:8080';
    var url = host + '/ios/api/invoke/';
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
  this.getMsg = function (params) {

    var url = customerHost+webapp+'msg.dll';
    return $http.get(url,params);
  };//获得历史消息


  this.sendMsg = function (params) {
    var url = customerHost+webapp + 'msg.dll';
    return $http.get(url,params);

  };

  this.create = function(params){
    var url =customerHost+webapp+'msg.dll';
    return $http.get(url,params);
  };

  this.getUUID = function(){
    return $http.get(customerHost+webapp+"getVistorId.dll");
  };

  this.opinion = function(params){
    return $http.get(customerHost+webapp+"msg.dll",params);
  };

  this.endChat = function(params){
    return $http.get(customerHost+webapp+"msg.dll",params);
  };

  this.transferChat = function(params){
    //cmd=transferChat&c=563210&chatId=5824&v=a6dbd52f39b94eda85b9fbdcaba01b56&transNum=1&aId=138306879
    return $http.get(customerHost+webapp+"msg.dll",params);
  };
  this.addEvent = function(params){
    return $http.get(customerHost+webapp+"msg.dll",params);
  };

  //将后台 返回到message数组元素 做些特殊处理， 音频 变音频， 图片变图片
  this.filtMsg = function(msg){
      if(msg.type =='EVENT_ACCEPT'){
        msg.isFirstFlag = true;//标示 客服说到第一句话
      }

    if(msg.message && msg.message.indexOf('$prodLink' )>-1){//商品链接

      msg.message='已经发送了 商品链接';
    }
    else if(msg.message && msg.message.indexOf('http')>-1 && msg.message.indexOf('.jpg')>-1){
        msg.fileType = '.jpg';
      //传纯图片 fileType  为'.jpg'
      msg.imageUrl = msg.message;
    }else if(msg.message && msg.message.indexOf('http')>-1 && msg.message.indexOf('.wav')>-1){
      msg.fileType ='.wav';
      msg.imageUrl = msg.message; // 用了 落木沙 的 playsound 指令 就不再用 $sce.trustAsResourceUrl(msg.message);
    }else if(msg.message && msg.message.indexOf('[')>-1 && msg.message.indexOf(']')>-1){
      //含有表情 需要转化为 img
      for(var k=1;k<16;k++){//一共 15中表情
        msg.message =emoToImage(msg.message,k);
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

  //上传文件url
  this.getUploadUrl = function(){
   return customerHost + webapp +'receive3.jsp';
  }

}]);

APP.directive('resizeFootBar', ['$ionicScrollDelegate', function($ionicScrollDelegate){
  // Runs during compile
  return {
    replace: false,
    link: function(scope, iElm, iAttrs, controller) {
      scope.$on("taResize", function(e, ta) {
        if (!ta) return;
        var scroll = document.body.querySelector("#message-detail-content");
        var scrollBar = $ionicScrollDelegate.$getByHandle('ccScroll');
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
