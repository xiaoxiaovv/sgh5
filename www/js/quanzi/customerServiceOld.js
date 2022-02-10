/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：客服控制器
 **/

APP.controller('CustomerConversationController', ['$scope', '$rootScope', '$ionicHistory', '$ionicSlideBoxDelegate', '$state', '$timeout', '$interval',
    'CustomerConversationService', 'UserService', 'PopupService', '$q', '$ionicActionSheet', '$ionicLoading','$sce','$ionicPopup',
    function ($scope, $rootScope, $ionicHistory, $ionicSlideBoxDelegate, $state, $timeout, $interval, CustomerConversationService, UserService, PopupService, $q, $ionicActionSheet, $ionicLoading,$sce,$ionicPopup) {
        //    初始化参数
        $scope.isDisplay = false;//消息小红点判断

        /*   右上角菜单 代码  开始*/
        $rootScope.showRightTop = false;//是否显示右上角 菜单
        $rootScope.msgCount = '';//未读消息数
        $scope.serverMs;//服务器时间
        $scope.uuID;//客服系统需要的uuid 标示访客
        $scope.netError;//标示 网络不通
        $scope.csId = 1;//负责接待 游客的客服Id 实际是 memberId 即微店主, todo 测试阶段 写死为1
        $scope.messages = [

        ]; //所有消息的存放数组
        $scope.csTimer = undefined;//循环刷新 timer id
        $scope.csUserInfo; //客服信息

        $scope.isShowRecord = false;

        //CC CustumerConversation,为了绑定msg 的对象
        $scope.CustumerParam = {
            msg: "说点什么"
        };




        //显示隐藏右上角菜单
        $scope.isClick = function () {
            $scope.isDisplay = !$scope.isDisplay;

        };

        //停止循环调用getMsg  再发送消息，发送图片，发送语音前 kill 成功返回再loop 当网络错误时 弹出 提示层 确认后 start
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

        $scope.init = function () {
            $scope.userInCC = UserService.getUser();
            if (true) { // 每次进入访客 都开一个对话
                CustomerConversationService.getUUID().then(function (res) {
                    var aa = res;
                    if (res && res.data) {
                        $scope.uuID = res.data.vistorId;
                        //得到 uuID 后 创建对话
                        var params = {
                            cmd: 'chat',
                            _t: new Date() - 0,
                            v: $scope.uuID,
                            u: $scope.uuID,
                            userId: $scope.uuID,
                            c: $scope.csId,
                            chatType: 'phone',
                            sid: 0
                        };
                        CustomerConversationService.create(params).then(function (response) {
                            if (response && response.data) {

                                var aaa = response;
                                if (response.data.type == "OFFLINE") {
                                    alert("客服 不在线")
                                } else if (response.data.chatId) {
                                    //客服连接成功
                                    $scope.csUserInfo = response.data.userInfo;
                                    $scope.chatId = response.data.chatId;
                                    console.log('开始循环');
                                    $scope.loopGetMsg();//开始循环
                                }

                            } else {
                                console.log("创建对话失败 －－－－");
                            }

                        }, function (errMsg) {
                            alert(errMsg);
                        })
                    }
                    else {
                        console.log('server response error' + res);
                    }
                }, function (error) {
                    alert(error);

                });
            }
            return;
        };

        $scope.getMsg = function () {
            var defer = $q.defer();
            var params = {
                cmd: 'getMessage',
                _t: new Date() - 0,
                c: $scope.csId,
                v: $scope.uuID,
                cId: $scope.chatId
            };
            CustomerConversationService.getMsg(params).then(function (res) {
                if (res && res.data && res.data.msgs && res.data.msgs.length != 0) {
                    for (var i = 0; i < res.data.msgs.length; i++) {
                        //处理 访客页面 含有url的msg
                        if(res.data.msgs[i].message && res.data.msgs[i].message.indexOf('http')>-1 && res.data.msgs[i].message.indexOf('.jpg')>-1){
                            res.data.msgs[i].fileType ='.jpg';
                            res.data.msgs[i].imageUrl = res.data.msgs[i].message

                        }else if(res.data.msgs[i].message && res.data.msgs[i].message.indexOf('http')>-1 && res.data.msgs[i].message.indexOf('.wav')>-1){
                            res.data.msgs[i].fileType ='.wav';
                            var tempUrl = res.data.msgs[i].message;
                            res.data.msgs[i].imageUrl = $sce.trustAsResourceUrl(tempUrl);
                        }
                        $scope.messages.push(res.data.msgs[i]);
                    }
                    defer.resolve(1);//根据 todo 传递返回的eventType，以确定后续操作
                }
                else {
                    console.log("接收消息无消息，或出错");
                    defer.reject(1);
                }
            });
            return defer.promise;
        };

        //发送消息
        $scope.sendMsg = function () {
            var params = {
                cmd: 'addMessage',
                _t: new Date() - 0,
                c: $scope.csId,
                v: $scope.uuID,
                u: $scope.uuID,
                cId: $scope.chatId,
                msg: $scope.CustumerParam.msg

            };
            CustomerConversationService.sendMsg(params).then(function (response) {
                    $scope.messages.push({message: params.msg})

                }, function (error) {


                }
            );

            console.log('发送客服消息----->  ');
        };

        $scope.create = function () {

            CustomerConversationService.create().success(function (response) {
                $scope.chatId = response.chatId;
                console.log(response);
            });
        };
        //评价
        $scope.opinion = function () {
            var params = {
                cmd: 'opinion',
                c: $scope.csId,
                v: $scope.uuID,
                u: $scope.uuID,
                op: '2',//评价等级 todo 暂时写死
                desp: '非常不错！！',
                b_op: 4,  //暂时不知道什么用 ，写死为4
                cId: $scope.chatId
            };
            CustomerConversationService.opinion(params).then(function (response) {
                if (response && response.data) {
                    if (response.data.result == "success") {
                        PopupService.showToastShort('评价成功');
                        var paramsEvent = {
                            cmd: 'addEvent',
                            c: $scope.csId,
                            v: $scope.uuID,
                            u: $scope.uuID,
                            cusId: $scope.csUserInfo.userId,
                            msg: 'finn',
                            type: 'EVENT_OPINION',
                            cId: $scope.chatId
                        };
                        //通知客服端 评价成功
                        CustomerConversationService.addEvent(paramsEvent).then(function (response) {
                            if (response) {
                                var aa = response;

                            } else {
                                console.log("评价结束后 发event 失败");
                            }

                        }, function (error) {
                            alert("评价结束后 发event 错误");
                        });
                    } else {

                        console.log('评价时 ，服务端发生异常' + response.data.result);
                    }
                } else {
                    console.log('net error !!!!');
                }

            }, function (error) {
                alert("网络错误");
            });

        };

        $scope.endChat = function () {
            var params = {
                cmd: 'endChat',
                c: $scope.csId,
                v: $scope.uuID,
                u: $scope.uuID,
                cId: $scope.chatId
            };
            CustomerConversationService.endChat(params).then(function (response) {
                if (response && response.data) {
                    if (response.data.result == "success") {
                        PopupService.showToastShort('关闭对话成功');

                    } else {
                        console.log('评价时 ，服务端发生异常' + response.data.result);
                    }
                } else {
                    console.log('net error !!!!');
                }
            }, function (error) {
                alert("网络错误");
            });

        };


        $scope.sendPic = function () {
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
                buttonClicked: function (index) {
                    if (index == 0) {//拍照
                        navigator.camera.getPicture(getSuccess, getFail, {
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URI,
                            allowEdit: true,
                            targetWidth: 720,
                            targetHeight: 720,
                            saveToPhotoAlbum: false//true会报错
                        });
                        function getSuccess(imageData) {
                            alert("getPicSuccess");
                            $scope.avatarImage = imageData;

                            //调用图片上传接口
                            var win = function (r) {
                                $ionicLoading.hide();
                                PopupService.showToast('上传成功');
                                var resp = JSON.parse(r.response);
                                $scope.avatarImage = resp.data.imageUrl;
                                resp.data.message ="拍照图片";
                                $scope.$apply(function(){
                                    $scope.messages.push(resp.data);
                                });

                                var eventParam  ={
                                    cmd:'addEvent',
                                    //  _t:'',
                                    c:1,
                                    cId:$scope.chatId,//chatId
                                    v:$scope.uuID,//uuId
                                    cusId:'admin',// todo 暂时写死,这是什么
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
                            };
                            var fail = function (error) {
                                $ionicLoading.hide();
                                PopupService.showToast('上传失败');
                            };
                            var options = new FileUploadOptions();
                            options.fileKey = 'imageFile';
                            options.fileName = $scope.avatarImage.substr($scope.avatarImage.lastIndexOf('/') + 1);
                            options.mimeType = 'image/jpeg';
                            var params = {};
                            params.userName = "18560683520"; //高斌 服务器地址  "http://172.16.63.71:8080/v3/platform/web/app/uploadImage" todo 上传接口 chatId 暂时写死了
                            options.params = params;
                            var ft = new FileTransfer();
                            ft.upload(imageData, encodeURI("http://123.56.3.136:8088/live/receive.jsp?fileType=.jpg&chatId="+$scope.chatId+"&cId=1"), win, fail, options);

                        }

                        function getFail(message) {//得到照片error
                            alert(message);
                        }

                    } else if (index == 1) {

                        navigator.camera.getPicture(getSuccessTwo, getFailTwo, {
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                            allowEdit: true,
                            targetWidth: 720,
                            targetHeight: 720
                        });
                        function getSuccessTwo(imageURI) {
                            $scope.avatarImage = imageURI;
                            //调用图片上传接口
                            var win = function (r) {
                                PopupService.showToast('上传成功');
                                $ionicLoading.hide();
                                var resp = JSON.parse(r.response);
                                resp.data.message ="相册图片";
                                $scope.$apply(function(){
                                    $scope.messages.push(resp.data);
                                });

                                var eventParam  ={
                                    cmd:'addEvent',
                                    //  _t:'',
                                    c:1,
                                    cId:$scope.chatId,//chatId
                                    v:$scope.uuID,//uuId
                                    cusId:'admin',// todo 暂时写死,这是什么
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
                            };
                            var fail = function (error) {
                                PopupService.showToast('上传失败');
                                $ionicLoading.hide();
                            };
                            var options = new FileUploadOptions();
                            options.fileKey = 'imageFile';
                            options.fileName = $scope.avatarImage.substr($scope.avatarImage.lastIndexOf('/') + 1);
                            options.mimeType = 'image/jpeg';
                            var params = {};
                            params.userName = "18560683520";
                            options.params = params;
                            var ft = new FileTransfer();
                            ft.upload($scope.avatarImage, encodeURI("http://123.56.3.136:8088/live/receive.jsp?fileType=.jpg&chatId="+$scope.chatId+"&cId=1"), win, fail, options);
                        }

                        function getFailTwo(message) {

                        }

                    }
                    return true;
                }
            });
        };

        // 音频所需要的参数

        // Capture configuration object
        var captureCfg = {};

// Audio Buffer
        var audioDataBuffer = [];

// Timers
        var timerInterVal, timerGenerateSimulatedData;

        var objectURL = null;

// Info/Debug
        var totalReceivedData = 0;

// URL shim
        window.URL = window.URL || window.webkitURL;

// File URL
        var fileURL = '';
        var isContinue = true;

        function onAudioInputCapture(evt) {
            try {
                if (evt && evt.data) {
                    if(isContinue){
                        // Increase the debug counter for received data
                        totalReceivedData += evt.data.length;

                        // Add the chunk to the buffer
                        audioDataBuffer = audioDataBuffer.concat(evt.data);
                    }else{
                        // Increase the debug counter for received data
                        totalReceivedData = evt.data.length;

                        // Add the chunk to the buffer
                        audioDataBuffer = evt.data;
                        isContinue = true;
                    }
                }
            }
            catch (ex) {
                alert("onAudioInputCapture ex: " + ex);
            }
        }

        /**
         * Called when a plugin error happens.
         */
        function onAudioInputError(error) {
            alert("onAudioInputError event recieved: " + JSON.stringify(error));
        }
        $scope.showRecord = function () {
            $scope.isShowRecord = true;
        };
        $scope.hideRecord = function () {
            $scope.isShowRecord = false;
        };
        var startCapture = function () {
            try {
                if (window.audioinput && !audioinput.isCapturing()) {

                    captureCfg = {
                        sampleRate: 8000,//parseInt(document.getElementById('sampleRate').value),//8000
                        bufferSize: 16384, //parseInt(document.getElementById('bufferSize').value),//16384
                        channels: 1,// parseInt(document.querySelector('input[name="channels"]:checked').value),//1
                        format: "PCM_16BIT", //document.querySelector('input[name="format"]:checked').value,
                        audioSourceType: 0 //parseInt(audioSourceType)//0
                    };
                    audioinput.start(captureCfg);
                    console.log("Microphone input started!");

                    // Throw previously created audio
                    //  document.getElementById("recording-list").innerHTML = "";
                    if (objectURL) {
                        URL.revokeObjectURL(objectURL);
                    }
                }

                var alertPopup = $ionicPopup.alert({
                    title: '开始录音',
                    template: '录音已经开始，按下确定结束'
                });
                alertPopup.then(function(res){
                    stopCapture();
                });
            }
            catch (e) {
                alert("startCapture exception: " + e);
            }
        };
        $scope.startRecord = startCapture;

        var stopCapture = function () {
            try {
                if (window.audioinput && audioinput.isCapturing()) {

                    if (window.audioinput) {
                        audioinput.stop();
                    }
                    else {

                    }

                    totalReceivedData = 0;

                    console.log("Encoding WAV...");
                    var encoder = new WavAudioEncoder(captureCfg.sampleRate, captureCfg.channels);
                    encoder.encode([audioDataBuffer]);

                    console.log("Encoding WAV finished");

                    var blob = encoder.finish("audio/wav");
                    console.log("BLOB created");

                    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dir) {
                        var fileName = "xuftest" + "123" + ".wav";
                        dir.getFile(fileName, {create: true}, function (file) {
                            file.createWriter(function (fileWriter) {
                                fileWriter.write(blob);

                                // Add an URL for the file
                                // var a = document.createElement('a');
                                // var linkText = document.createTextNode(file.toURL());
                                // a.appendChild(linkText);
                                // a.title = file.toURL();
                                // a.href = file.toURL();
                                // a.target = '_blank';
                                // document.getElementById("recording-list").appendChild(a);
                                console.log("File created!");
                                setTimeout(function () {
                                    // var reader = new FileReader();
                                    // var aa = reader.readAsDataURL(file);
                                    // var bb = reader.readAsText(file);
                                    // alert(aa);
                                    // alert(bb);
                                    fileURL = file.toURL();
                                    document.getElementById("source").src = fileURL;
                                    document.getElementById("audio").load();
                                }, 500);
                            }, function () {
                                alert("FileWriter error!");
                            });
                        });
                    });
                }
            }
            catch (e) {
                alert("stopCapture exception: " + e);
            }
        };
        $scope.endRecord = stopCapture;

        //删除 音频
        var deleteMedia = function () {
            window.resolveLocalFileSystemURL(fileURL, function (fileEntry) {
                fileEntry.remove(function () {
                    alert('delete success');
                    isContinue = false;
                    document.getElementById("source").src = '';
                    document.getElementById("audio").load();
                }, function (err) {
                    alert(JSON.stringify(err));
                }, function () {
                    alert('file not exist');
                });
            })
        };

        $scope.deleteRecord = deleteMedia;


        var transfer = function () {
            alert("start transfer");
            var win = function (r) {
                alert('上传成功');//音频
                var resp = JSON.parse(r.response);
                resp.data.message ="音频文件";
                resp.data.imageUrl = $sce.trustAsResourceUrl(resp.data.imageUrl);
                $scope.$apply(function(){
                    $scope.messages.push(resp.data);
                });

                var eventParam  ={
                    cmd:'addEvent',
                    //  _t:'',
                    c:1,
                    cId:$scope.chatId,//chatId
                    v:$scope.uuID,//uuId
                    cusId:'admin',// todo 暂时写死,这是什么
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
            };
            var fail = function (error) {
                alert('上传失败');
            };
            var options = new FileUploadOptions();
            options.fileKey = 'imageFile';
            options.fileName = 'aaa';
            // options.mimeType = 'image/jpeg';
            var params = {};
            params.userName = "18560683520"; //高斌 服务器地址  "http://172.16.63.71:8080/v3/platform/web/app/uploadImage"
            options.params = params;
            var ft = new FileTransfer();
            //todo 客服id暂时写死
            var audioUrl = "http://123.56.3.136:8088/live/receive.jsp?fileType=.wav&chatId="+$scope.chatId+"&cId=1";
            ft.upload(fileURL, encodeURI(audioUrl), win, fail, options);
        };
        $scope.transfer = transfer;

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
            window.addEventListener('audioinput', onAudioInputCapture, false);
            window.addEventListener('audioinputerror', onAudioInputError, false);
            //angular.forEach(fangkeData,function(data,index){
            //   if(data.message &&  data.message.indexOf('http')>-1 && data.message.indexOf('.jpg')>-1){
            //
            //       data.fileType = '.jpg';
            //       data.imageUrl =data.message;
            //   }else if(data.message &&  data.message.indexOf('http')>-1 && data.message.indexOf('.wav')>-1){
            //       data.fileType = '.wav';
            //       data.imageUrl = $sce.trustAsResourceUrl(data.message);
            //   }
            //});
            //$scope.messages = fangkeData;

            $scope.messages = [];
        });

        $scope.$on('$ionicView.afterEnter', function () {
        });
        //离开页面 停止循环取消息
        $scope.$on('$ionicView.beforeLeave', function () {
            //todo killTimer 去除 window 事件
            window.removeEventListener('audioinput', onAudioInputCapture);
            window.removeEventListener('audioinputerror', onAudioInputError);

            $scope.killTimer();
        });

        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };

    }]);


APP.service('CustomerConversationService', ['$http', 'UrlService', function ($http, UrlService) {
    //登录
    var customerHost = "http://123.56.3.136:8088";//牛发旺的后台
    var webapp = '/live/';


    this.login = function (params) {
        var params = {
            'c': 'li',
            'u': 'admin',
            'p': '123456'

        };
        var host = 'http://172.16.63.98:8080';
        var url = host + '/ios/api/invoke';
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

        var url = customerHost + webapp + '/msg.dll';
        return $http.get(url, params);
    };//获得历史消息


    this.sendMsg = function (params) {

        var url = customerHost + webapp + 'msg.dll';
        return $http.get(url, params);

    };

    this.create = function (params) {
        var url = customerHost + webapp + 'msg.dll';
        return $http.get(url, params);
    };

    this.getUUID = function () {
        return $http.get(customerHost + webapp + "getVistorId.dll");
    };

    this.opinion = function (params) {
        return $http.get(customerHost + webapp + "msg.dll", params);
    };

    this.endChat = function (params) {
        return $http.get(customerHost + webapp + "msg.dll", params);
    };
    this.addEvent = function (params) {
        return $http.get(customerHost + webapp + "msg.dll", params);
    };

    //http://123.56.3.136:8088/live/receive.jsp?fileType=.jpg&chatId=1612&cId=1 上传图片
    this.upload = function () {

    };

    //上传完 图片或音频后 都要发送event 给客服端
    this.addEvent = function(params){

        return $http.get(customerHost + webapp + "msg.dll", params);
    }


}]);
//1.	EVENT_END 系统关闭对话
//2.	EVENT_CLOSE坐席关闭对话
//3.	EVENT_SAMEVISITOR该访客重复进入
//4.	EVENT_ACCEPT这块是用于网页提醒。比方说坐席发送消息了。之类的
//5.	EVENT_FILE 坐席发送了文件
//6.	EVENT_SCREENSHOTS_SELF坐席发送了截图
//7.	EVENT_OPTION 坐席发送评价
//8.	RECORD_RECORD 普通消息

var fangkeData = [

    {
        "category": 1,
        "chatId": "2452",
        "class": "cn.jesong.webcall.object.message.ChatMessage",
        "colleagueMessage": false,
        "command": null,
        "companyId": 1,
        "dstUserId": null,
        "event": true,
        "exts": {},
        "fromUserId": "admin",
        "message": "admin",
        "reseveKey": null,
        "toUserId": "311bb4357362452fa08e3a5cbab637a4",
        "type": "EVENT_ACCEPT",
        "viewUserId": "admin"
    },
    {
        "category": 1,
        "chatId": "2452",
        "class": "cn.jesong.webcall.object.message.ChatMessage",
        "colleagueMessage": false,
        "command": null,
        "companyId": 1,
        "dstUserId": "311bb4357362452fa08e3a5cbab637a4",
        "event": false,
        "exts": {},
        "fromUserId": "admin",
        "message": "hhah",
        "reseveKey": null,
        "toUserId": "311bb4357362452fa08e3a5cbab637a4",
        "type": "RECORD_RECORD",
        "viewUserId": null
    }, {
        "category": 1,
        "chatId": "2452",
        "class": "cn.jesong.webcall.object.message.ChatMessage",
        "colleagueMessage": false,
        "command": null,
        "companyId": 1,
        "dstUserId": "311bb4357362452fa08e3a5cbab637a4",
        "event": false,
        "exts": {},
        "fromUserId": "admin",
        "message": "http://123.56.3.136:8088/file/1/20161229/24521483014076122.jpg",
        "reseveKey": null,
        "toUserId": "311bb4357362452fa08e3a5cbab637a4",
        "type": "RECORD_RECORD",
        "viewUserId": null
    },
    {
        "category": 1,
        "chatId": "2452",
        "class": "cn.jesong.webcall.object.message.ChatMessage",
        "colleagueMessage": false,
        "command": null,
        "companyId": 1,
        "dstUserId": "311bb4357362452fa08e3a5cbab637a4",
        "event": false,
        "exts": {},
        "fromUserId": "admin",
        "message": "http://123.56.3.136:8088/file/1/20161229/24521483014105480.wav",
        "reseveKey": null,
        "toUserId": "311bb4357362452fa08e3a5cbab637a4",
        "type": "RECORD_RECORD",
        "viewUserId": null
    }
];


