/*
  封装得到 图片 ，删除图片， 得到音频，删除音频的代码的服务

 */
APP.service('MediaService',['$http', 'UrlService','$ionicPopup','$rootScope', function ($http,UrlService,$ionicPopup,$rootScope) {

    //sourceType 0 代表拍照，1 代表从相册  getSuccess  默认传一个imageData getFail
    this.getPicture = function (sourceType, getSuccess, getFail) {

        if (!navigator.camera || !navigator.camera.getPicture) {
            console.error('navigator.camera undefinde not support camera !!!');
            return;
        }
        if (sourceType == 0) {//拍照

            navigator.camera.getPicture(getSuccess, getFail, {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                allowEdit: true,
                targetWidth: 720,
                targetHeight: 720,
                saveToPhotoAlbum: false//true会报错 todo 问原生人员
            });

        } else if (sourceType == 1) {//从相册取
            navigator.camera.getPicture(getSuccess, getFail, {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit: true,
                targetWidth: 720,
                targetHeight: 720
            });


        } else {
            console.error('MediaService . getPicture ERROR ,ILLEGAL SourceType');
        }

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

    this.addAudioEventOnWindow = function(){
        window.addEventListener('audioinput', onAudioInputCapture, false);
        window.addEventListener('audioinputerror', onAudioInputError, false);
    };

    this.removeAudioEventOnWindow = function(){
        window.removeEventListener('audioinput', onAudioInputCapture);
        window.removeEventListener('audioinputerror', onAudioInputError);
    };

    //参数，录制好 音频 后存放音频 的 audio 元素 的domId
    this.startCapture = function (sourceId,audioId) {
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
            //var alertPopup = $ionicPopup.alert({废弃了原来的录音方式
            //    title: '开始录音',
            //    template: '录音已经开始，按下确定结束'
            //});
            //alertPopup.then(function(res){
            //    stopCapture(sourceId,audioId);
            //});
        }
        catch (e) {
            alert("startCapture exception: " + e);
        }
    };

    var stopCapture = function (sourceId,audioId,finishCb) {
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
                    //注意 ios  cordova.file.dataDirectory 文件的路径  android 用 cordova.file.externalDataDirectory
                window.resolveLocalFileSystemURL($rootScope.isIOS?cordova.file.dataDirectory:cordova.file.externalDataDirectory, function (dir) {
                    var fileName = "temp" + (new Date()-0)+ ".wav";
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
                                document.getElementById(sourceId).src = fileURL;
                                document.getElementById(audioId).load();

                                if(finishCb){
                                    finishCb();
                                }
                            }, 500);//为了使元素能够 加载完音频资源
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
    this.stopCapture = stopCapture;


    //删除 音频
    var deleteMedia = function () {
        window.resolveLocalFileSystemURL(fileURL, function (fileEntry) {
            fileEntry.remove(function () {
                console.log('删除成功');
                isContinue = false;
                //document.getElementById("source1").src = '';
                //document.getElementById("audio1").load();
            }, function (err) {
                alert(JSON.stringify(err));
            }, function () {
                alert('file not exist');
            });
        })
    };
    this.deleteMedia = deleteMedia;

    this.getAudioUrl = function(){
        return fileURL;
    }

}
]);
