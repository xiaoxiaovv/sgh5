/**
 * Created by Andy on 2016/12/10.
 */
/**
 * Created by Andy on 2016/12/8.
 */
APP.controller('PublishEditController', ['$scope', '$rootScope', '$state', '$stateParams', 'PublishEditService', 'PopupService', '$timeout',
    '$ionicActionSheet','$ionicLoading','$ionicScrollDelegate',
    function ($scope, $rootScope, $state, $stateParams, PublishEditService, PopupService, $timeout,$ionicActionSheet,$ionicLoading,$ionicScrollDelegate) {

        /** 变量定义 **/
        /** 定义变量 **/
        $scope.identifyCode = '';//接收圈子页传参，判断拍照还是相册

        // 发布所提交的信息
        $scope.publishInfo = {
            id: $stateParams.topicId,
            mainImg: '',
            storyContent: ''
        };
        $scope.iconImageData = [];//存储本地图片path

        /** 方法 **/

        /* 返回前一页*/
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };
        //判断字数
        $scope.$watch('publishInfo.storyContent',function(){
            console.log('字数变动');
            $ionicScrollDelegate.scrollBottom();
            $scope.wordsNum = 500 - $scope.publishInfo.storyContent.length;
            if ($scope.publishInfo.storyContent.length == 500) {
                PopupService.showToast('话题内容不得超过500字');
            }
        });
        //获取发话题详情
        $scope.getNoteDetail = function () {
            $scope.iconImageData = [];
            $scope.imgUrlList = [];
            var id = {id: $stateParams.topicId};//接收话题详情传来的id

            PublishEditService.getDetails(id).success(function (response) {
                $scope.detailData = response.data;
                $scope.publishInfo.storyContent = $scope.detailData.storyContent;

                for (var i = 0; i < $scope.detailData.mainImgArray.length; i++) {
                    var mainImgList = {
                        imgUrl: $scope.detailData.mainImgArray[i]
                    };
                    $scope.imgUrlList.push($scope.detailData.mainImgArray[i]);//
                    $scope.iconImageData.push(mainImgList);//接口图片地址存储页面用来显示图片
                    console.log($scope.iconImageData);
                    console.log('UrlPath', $scope.imgUrlList);
                }
            })
        };
        /*提交方法*/
        $scope.publishClick = function (arrayData) {
            // var words = $scope.publishInfo.storyContent;
            var keywords = {
                keywords: $scope.publishInfo.storyContent
            };
            PublishEditService.judgeWords(keywords)
                .success(function (response) {
                    if (response.message == '没有敏感词') {
                        $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//将图片Url地址转化成string类型传给接口
                        if ($scope.publishInfo.storyContent.length == 0 && !$scope.publishInfo.mainImg) {
                            $scope.publishNotice = true;
                            $timeout(function () {
                                $scope.publishNotice = false;
                            }, 1000);
                        } else if($scope.iconImageData.length != $scope.imgUrlList.length) {
                            PopupService.showToast('图片正在上传，请稍后再试');
                        } else {
                            PublishEditService.publish(arrayData)//发布
                                .success(function (response) {
                                    if (response.success == true) {
                                        PopupService.showToast('发布成功');
                                        $rootScope.editSuccess = true;
                                        $timeout(function () {
                                            $rootScope.editSuccess = false;
                                        }, 1000);
                                        // 发布所提交的信息
                                        $scope.publishInfo = {
                                            id: $stateParams.topicId,
                                            mainImg: '',
                                            storyContent: ''
                                        };
                                        $scope.iconImageData = '';
                                        $scope.imgUrlList = [];
                                        // $state.go('circlePage',{circleId:$scope.topicId});
                                        $state.go('noteDetails', {noteId: $scope.circleId, isShortStory: $scope.ifShort});
                                    } else {
                                        PopupService.showToast(response.message);
                                    }
                                })
                                .error(function () {

                                })
                        }
                    } else {
                        PopupService.showToast('存在敏感词', response.data);//提示接口返回的提示
                    }
                }).error(function () {

                });


        };

        $scope.imgUrlList = [];
        /*添加相片方法*/
        $scope.imgPush = function (index) {
            //相片最多添加9张，超出提示
            if ($scope.iconImageData.length >= 9) {
                PopupService.showToast('最多添加9张');

                return;
            }
            //选图方法
            $ionicActionSheet.show({
                buttons: [
                    {text: '<b>拍照</b>'},
                    {text: '<b>从相册选取</b>'}
                ],
                // destructiveText: 'Delete',
                titleText: '照片选取方式',
                cancelText: '取消',
                buttonClicked: function (index) {
                    if (index == 0) {
                        navigator.camera.getPicture(getSuccess, getFail, {//拍照
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            saveToPhotoAlbum: true,
                            allowEdit: true,
                            targetWidth: 720,
                            targetHeight: 720
                        });
                        function getSuccess(imageData) {
                            var a = {imgUrl: imageData};
                            //   $scope.iconImageData.push(a);
                            $timeout(function () {
                                $scope.iconImageData.push(a);
                                $scope.existPhoto = true;
                            }, 200);

                            var win = function (r) {
                                $ionicLoading.hide();
                                console.log('上传成功');
                                var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
                                var iconImageR = jsonResp.urls;
                                $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
                                $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
                                console.log('jsonResp:', jsonResp);
                                console.log(iconImageR);
                            };
                            var fail = function (error) {
                                console.log('上传失败');
                                $ionicLoading.hide();
                            };
                            //调用上传图片接口
                            var options = {};
                            var uploadPhoto = new FileTransfer();
                            uploadPhoto.upload(a.imgUrl, encodeURI(PublishEditService.uploadImage()), win, fail, options);

                        }

                        function getFail() {
                            console.log('get fail ---');
                        }

                        return true;
                    } else if (index == 1) {
                        console.log('从相册中获取');
                        navigator.camera.getPicture(getSuccessTwo, getFailTwo, {//相册
                            quality: 100,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                            allowEdit: true,
                            targetWidth: 720,
                            targetHeight: 720
                        });
                        function getFailTwo() {
                            console.log('get fail ---');
                        }

                        function getSuccessTwo(imageData) {
                            var a = {imgUrl: imageData};
                            $scope.iconImageData.push(a);
                            $scope.existPhoto = true;
                            $timeout(function () {
                                // $scope.iconImageData.push(a);

                                for (var i = 0; i < $scope.iconImageData.length; i++) {
                                    console.log($scope.iconImageData[i]);
                                }
                            }, 200);

                            var win = function (r) {
                                $ionicLoading.hide();
                                console.log('上传成功');
                                var jsonResp = JSON.parse(r.response);//图片接口返回的图片地址
                                var iconImageR = jsonResp.urls;
                                $scope.imgUrlList.push(iconImageR);//存储返回的图片地址
                                $scope.publishInfo.mainImg = $scope.imgUrlList.toString();//转化成string类型传给接口
                                console.log('jsonResp:', jsonResp);
                                console.log(iconImageR);
                            };
                            var fail = function (error) {
                                console.log('上传失败');
                                $ionicLoading.hide();
                            };
                            //调用上传图片接口
                            var options = {};
                            var uploadPhoto = new FileTransfer();
                            uploadPhoto.upload(a.imgUrl, encodeURI(PublishEditService.uploadImage()), win, fail, options);

                        }

                        return true;
                    }
                }

            })
        };
        /*点击放大照片*/
        $scope.showLarge = function (img) {
            $scope.showBigImage = true;
            $scope.Url = img;
        };
        $scope.closeImg = function () {
            console.log('点到我了');
            $scope.showBigImage = false;
        };
        // 删除相片
        $scope.deleteImg = function (index) {
            $scope.iconImageData.splice(index, 1);
            $scope.imgUrlList.splice(index,1);
        };

        $scope.init = function () {
            $scope.trendHeight = {
                height:document.getElementById('getWidth').offsetWidth + 'px'
            };
            console.log('$scope.height',$scope.height);

            $scope.showBigImage = false;
            $scope.circleId = $stateParams.noteId;//接收传参
            $scope.ifShort = $stateParams.isShortStory;//判断长文短文
            $scope.getNoteDetail();

        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }]);

APP.service('PublishEditService', ['$http', 'UrlService', function ($http, UrlService) {
    //提交发表内容
    this.publish = function (params) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('UPDATE_STORY'),
            data: params
        });
    };
    //上传图片接口
    this.uploadImage = function () {
        return UrlService.getUrl('UPLOAD_ASSESS_IMG');
    };
    //圈子详情接口取到详情信息
    this.getDetails = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('CIRCLE_STORY_INFO'),
            data: param
        });
    };
    //敏感词判断
    this.judgeWords = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('BY_CONDITION'),
            data: param
        });
    }
}]);
