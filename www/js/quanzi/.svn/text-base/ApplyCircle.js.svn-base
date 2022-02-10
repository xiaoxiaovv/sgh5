APP.controller('ApplyCircleController', ['$scope', '$rootScope', '$state', 'ApplyCircleService', 'PopupService', '$ionicActionSheet', '$timeout',
    '$ionicLoading', '$ionicScrollDelegate', '$ionicPopup','$ionicModal','$ionicScrollDelegate',
    function ($scope, $rootScope, $state, ApplyCircleService, PopupService, $ionicActionSheet, $timeout, $ionicLoading, $ionicScrollDelegate, $ionicPopup,$ionicModal,$ionicScrollDelegate) {
        /** 变量声明 **/
        $scope.userPicUrl = '';//存储头像本地图片
        $scope.bigPicUrl = '';//存储背景图本地图片
        $rootScope.storeId = [];//存放标签id
        $rootScope.nameStringToObj = [];//将所选标签数组转对象
        $rootScope.addedTags = [];//存放自定义的标签组name
        $scope.applyData = {
            topicImg: '',
            topicBgImg: '',
            topicName: '',
            topicDescription: '',
            topicReason: '',
            tagIds: '',
            tagNames: '',
            auditStatus:2,
            topicId:''
        };

        /** 方法 **/
        $scope.init = function () {
            if ($rootScope.showApplyTag == 1) {
                $scope.showApplyBtn = false;
            } else {
                $scope.showApplyBtn = true;
            }
            //申请消息弹框
            $ionicModal.fromTemplateUrl('templates/quanzi/applyCircleModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.applyCircleModal = modal;
                // $scope.applyCircleModal.show();
            });

            if ($rootScope.ifInit == 1) {
                $scope.tagsName = $rootScope.allNames;
                console.log('tagsName', $scope.tagsName);
                $rootScope.ifInit = 2;
            } else {
                $scope.topicId ='';
                $scope.auditRefuseStatus = '';
                $rootScope.allNames = '';
                $rootScope.addedTags = [];
                $rootScope.nameStringToObj = [];
                $rootScope.frequentTags = '';
                $scope.tagsName = '';

                if($rootScope.reviewCircleId) {
                    $scope.reviewApplyCircle();//review申请圈子信息
                    $scope.getTags();//获取标签
                }
                $scope.auditOpinion = '';
                $ionicScrollDelegate.resize();
            }
        };
        //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
            $rootScope.showApplyTag = '';
            delete $rootScope.reviewCircleId;
            console.log($rootScope.reviewCircleId);
        };
        //删除贴子给提示
        $scope.warnDelete = function (id) {
            $scope.isDisplay = false;
            // 一个精心制作的自定义弹窗
            // $scope.commentId = id;
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<img src="'+$rootScope.imgBaseURL+'img/circleIcon/pinkDelete.png" style="width: 30px" alt=""><div>确认删除草稿吗？</div>',
                title: '删除草稿',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {
                        text: '<span>确认</span>',
                        type: '',
                        onTap: function () {
                            $scope.deleteDraftCircle();
                        }
                    },
                    {text: '放弃'}
                ]
            });
            // myPopup.then(function(res) {
            //     console.log('Tapped!', res);
            // });
            $timeout(function () {
                // myPopup.close();
            }, 3000);
        };
        //隐藏modal
        $scope.hideApplyCircleModal = function () {
            $scope.applyCircleModal.hide();
        };
        //抽屉显示审批历史
        $scope.openStatus = function (index) {
            $scope.auditOpinion[index].open_status = !$scope.auditOpinion[index].open_status;
        };
        //跳选择标签页
        $scope.jumpSelect = function () {
            $state.go('selectTags')
        };
        //删除申请草稿
        $scope.deleteDraftCircle = function () {
            var param = {
                id:$rootScope.reviewCircleId
            };
            ApplyCircleService.delectDraft(param)
                .success(function (response) {
                    if(response.success){
                        delete $rootScope.reviewCircleId;
                        $scope.$ionicGoBack();
                        console.log('删除成功');
                    }
                })
        };
        /**
         * 选择头像图片
         */
        $scope.imgPush = function (index) {
            //选图方法
            $ionicActionSheet.show({
                buttons: [
                    {text: '<b>拍照</b>'},
                    {text: '<b>从相册选取</b>'}
                ],
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
                        function getFail() {
                            console.log('选图失败');
                        }

                        function getSuccess(imageData) {
                            $scope.userPicUrl = imageData;
                            $timeout(function () {
                                $scope.existPhoto = true;
                            }, 200);

                            var win = function (r) {
                                $ionicLoading.hide();
                                console.log('上传成功');
                                console.log('r', r);
                                var jsonResp = JSON.parse(r.response);
                                $scope.applyData.topicImg = jsonResp.urls.toString();
                                console.log('jsonResp:', jsonResp);
                                //console.log(iconImageR);
                            };
                            var fail = function (error) {
                                $ionicLoading.hide();
                            };
                            //调用上传图片接口
                            var options = {};
                            var uploadPhoto = new FileTransfer();
                            uploadPhoto.upload($scope.userPicUrl, encodeURI(ApplyCircleService.uploadImage()), win, fail, options);
                        }

                        return true;
                    } else if (index == 1) {
                        console.log('从相册中获取');
                        navigator.camera.getPicture(getSuccessTwo, getFailTwo, {//相册
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                            allowEdit: true,
                            targetWidth: 720,
                            targetHeight: 720
                        });

                        function getFailTwo() {
                            console.log('选图失败');
                        }

                        function getSuccessTwo(imageData) {
                            $scope.userPicUrl = imageData;
                            $scope.existPhoto = true;
                            $timeout(function () {
                                // $scope.iconImageData.push(a);
                            }, 200);

                            var win = function (r) {
                                $ionicLoading.hide();
                                console.log('上传成功');
                                var jsonResp = JSON.parse(r.response);
                                $scope.applyData.topicImg = jsonResp.urls.toString();
                                //console.log('打印地址', iconImageR);//打印地址
                            };
                            var fail = function (error) {
                                $ionicLoading.hide();
                            };
                            //调用上传图片接口
                            var options = {};
                            var uploadPhoto = new FileTransfer();
                            uploadPhoto.upload($scope.userPicUrl, encodeURI(ApplyCircleService.uploadImage()), win, fail, options);
                        }

                        return true;
                    }
                }
            })
        };

        /**
         * 选择背景图片
         */
        $scope.imgBigPush = function (index) {
            //选图方法
            $ionicActionSheet.show({
                buttons: [
                    {text: '<b>从相册选取</b>'}
                ],
                titleText: '照片选取方式',
                cancelText: '取消',
                buttonClicked: function (index) {
                    if (index == 0) {
                        console.log('从相册中获取');
                        navigator.camera.getPicture(getSuccessTwo, getFailTwo, {//相册
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                            allowEdit: true,
                            targetWidth: 640,
                            targetHeight: 180
                        });

                        function getFailTwo() {
                            console.log('选图失败');
                        }

                        function getSuccessTwo(imageData) {
                            $scope.applyData.topicBgImg = '';
                            $scope.bigPicUrl = imageData;
                            $scope.existPhoto = true;
                            $timeout(function () {
                                // $scope.iconImageData.push(a);
                            }, 200);

                            var win = function (r) {
                                $ionicLoading.hide();
                                console.log('上传成功');
                                var jsonResp = JSON.parse(r.response);
                                $scope.applyData.topicBgImg = jsonResp.urls.toString();
                                //console.log('打印地址', iconImageR);//打印地址
                            };
                            var fail = function (error) {
                                $ionicLoading.hide();
                            };
                            //调用上传图片接口
                            var options = {};
                            var uploadPhoto = new FileTransfer();
                            uploadPhoto.upload($scope.bigPicUrl, encodeURI(ApplyCircleService.uploadImage()), win, fail, options);
                        }

                        return true;
                    }
                }
            })
        };

        //删除自定义标签
        $scope.deleteTags = function (index) {
            $rootScope.addedTags.splice(index, 1);
            console.log('删除了哈' + index);
        };
        //删除常用标签
        $scope.deleteFrequentTags = function (index, name) {
            for (var i = 0; i < $rootScope.frequentTags.length; i++) {
                if ($rootScope.frequentTags[i].name == name) {
                    $rootScope.frequentTags[i].isChecked = false;
                }
            }
            console.log('删除了哈' + index);
            $rootScope.storeNames.splice(index, 1);
            $rootScope.storeId.splice(index, 1);
            $rootScope.nameStringToObj.splice(index, 1);
        };

        //提交
        $scope.commitData = function () {
            var keywords = {
                keywords: $scope.applyData.topicName + $scope.applyData.topicDescription + $scope.applyData.topicReason
            };
            ApplyCircleService.judgeWords(keywords)
                .success(function (response) {
                    if (response.message == '没有敏感词') {

                        var submitData = $scope.applyData;
                        submitData.tagIds = $rootScope.storeId.toString();
                        console.log('转换后id', submitData.tagIds);
                        console.log('addedTags', $rootScope.addedTags);
                        $scope.pushTags = [];//转换一下格式
                        for (var i = 0; i < $rootScope.addedTags.length; i++) {
                            console.log($rootScope.addedTags[i].name);
                            $scope.pushTags.push($rootScope.addedTags[i].name);
                            console.log($scope.pushTags);
                        }
                        submitData.tagNames = $scope.pushTags.toString();
                        console.log('转换后name', submitData.tagNames);

                        if ($scope.darftStatus == 3){
                            submitData.auditStatus = 2;
                            ApplyCircleService.storageDraft(submitData)//提交
                                .success(function (response) {
                                    if (response.success == false) {
                                        PopupService.showToast(response.message);
                                    } else {
                                        $scope.$ionicGoBack();
                                        // $state.go('allCircle');//跳回全部圈子
                                        $rootScope.applyBottomNotice = true;
                                        $scope.applyData = {};//数据置空
                                        $rootScope.nameStringToObj = [];
                                        $scope.userPicUrl = '';//存储头像本地图片
                                        $scope.bigPicUrl = '';//存储背景图本地图
                                        submitData = '';
                                        keywords = '';
                                        $scope.tagsName = '';
                                        $timeout(function () {
                                            $rootScope.applyBottomNotice = false;
                                        }, 3000);
                                    }
                                })
                                .error(function (err) {
                                    console.log(err);
                                });
                        } else if ($rootScope.reviewCircleId){
                            ApplyCircleService.refuseStorage(submitData)//提交
                                .success(function (response) {
                                    if (response.success == false) {
                                        PopupService.showToast(response.message);
                                    } else {
                                        $scope.$ionicGoBack();
                                        // $state.go('allCircle');//跳回全部圈子
                                        $rootScope.applyBottomNotice = true;
                                        $scope.applyData = {};//数据置空
                                        $rootScope.nameStringToObj = [];
                                        $scope.userPicUrl = '';//存储头像本地图片
                                        $scope.bigPicUrl = '';//存储背景图本地图
                                        submitData = '';
                                        keywords = '';
                                        $scope.tagsName = '';
                                        $timeout(function () {
                                            $rootScope.applyBottomNotice = false;
                                        }, 3000);
                                    }
                                })
                                .error(function (err) {
                                    console.log(err);
                                });
                        } else {
                            ApplyCircleService.applyCircleInfo(submitData)//提交
                                .success(function (response) {
                                    if (response.success == false) {
                                        PopupService.showToast(response.message);
                                    } else {
                                        $scope.$ionicGoBack();
                                        // $state.go('allCircle');//跳回全部圈子
                                        $rootScope.applyBottomNotice = true;
                                        $scope.applyData = {};//数据置空
                                        $rootScope.nameStringToObj = [];
                                        $scope.userPicUrl = '';//存储头像本地图片
                                        $scope.bigPicUrl = '';//存储背景图本地图
                                        submitData = '';
                                        keywords = '';
                                        $scope.tagsName = '';
                                        $timeout(function () {
                                            $rootScope.applyBottomNotice = false;
                                        }, 3000);
                                    }
                                })
                                .error(function (err) {
                                    console.log(err);
                                });
                        }

                    } else {
                        PopupService.showToast('存在敏感词' + response.data);//提示接口返回的提示
                    }
                }).error(function () {

            });
        };
        //提交给提示
        $scope.applyTopicNotice = function () {
            // 一个精心制作的自定义弹窗
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<p>确认提交圈子申请吗？</p>',
                title: '删除评论',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {text: '放弃'},
                    {
                        text: '<span>提交</span>',
                        type: '',
                        onTap: function () {
                            // $scope.applyTopic($scope.applyData);
                            $scope.commitData();
                        }
                    }
                ]
            });
            $timeout(function () {
                // myPopup.close();
            }, 3000);
        };
        //申请方法
        $scope.applyTopic = function (applyData) {
            if ($scope.userPicUrl) {
                if ($scope.applyData.topicImg == '') {
                    PopupService.showToast('图片正在上传，请稍后再试');
                } else if ($scope.bigPicUrl) {
                    if ($scope.applyData.topicBgImg == '') {
                        PopupService.showToast('图片正在上传，请稍后再试');
                    } else if (!applyData.topicImg) {
                        PopupService.showToast('亲，你没有设置头像哦');
                    } else if (!applyData.topicBgImg) {
                        PopupService.showToast('亲，你没有设置背景图哦');
                    } else if (!applyData.topicName) {
                        PopupService.showToast('请输入圈子名称');
                    } else if (!applyData.topicDescription) {
                        PopupService.showToast('请输入圈子介绍');
                    } else if (!applyData.topicReason) {
                        PopupService.showToast('请输入圈子申请理由');
                    } else if (applyData.topicReason.length < 20) {
                        PopupService.showToast('申请理由不能少于20字');
                    } else if (($rootScope.nameStringToObj.length + $rootScope.addedTags.length)<3) {
                        PopupService.showToast('选择标签不能少于三个');
                    } else {
                        $scope.applyTopicNotice();
                    }
                } else {
                    if (!applyData.topicImg) {
                        PopupService.showToast('亲，你没有设置头像哦');
                    } else if (!applyData.topicBgImg) {
                        PopupService.showToast('亲，你没有设置背景图哦');
                    } else if (!applyData.topicName) {
                        PopupService.showToast('请输入圈子名称');
                    } else if (!applyData.topicDescription) {
                        PopupService.showToast('请输入圈子介绍');
                    } else if (!applyData.topicReason) {
                        PopupService.showToast('请输入圈子申请理由');
                    } else if (applyData.topicReason.length < 20) {
                        PopupService.showToast('申请理由不能少于20字');
                    } else if (($rootScope.nameStringToObj.length + $rootScope.addedTags.length)<3) {
                        PopupService.showToast('选择标签不能少于三个');
                    } else {
                        $scope.applyTopicNotice();
                    }
                }
            } else {
                if ($scope.bigPicUrl) {
                    if ($scope.applyData.topicBgImg == '') {
                        PopupService.showToast('图片正在上传，请稍后再试');
                    } else if (!applyData.topicImg) {
                        PopupService.showToast('亲，你没有设置头像哦');
                    } else if (!applyData.topicBgImg) {
                        PopupService.showToast('亲，你没有设置背景图哦');
                    } else if (!applyData.topicName) {
                        PopupService.showToast('请输入圈子名称');
                    } else if (!applyData.topicDescription) {
                        PopupService.showToast('请输入圈子介绍');
                    } else if (!applyData.topicReason) {
                        PopupService.showToast('请输入圈子申请理由');
                    } else if (applyData.topicReason.length < 20) {
                        PopupService.showToast('申请理由不能少于20字');
                    } else {
                        $scope.applyTopicNotice();
                    }
                } else {
                    if (!applyData.topicImg) {
                        PopupService.showToast('亲，你没有设置头像哦');
                    } else if (!applyData.topicBgImg) {
                        PopupService.showToast('亲，你没有设置背景图哦');
                    } else if (!applyData.topicName) {
                        PopupService.showToast('请输入圈子名称');
                    } else if (!applyData.topicDescription) {
                        PopupService.showToast('请输入圈子介绍');
                    } else if (!applyData.topicReason) {
                        PopupService.showToast('请输入圈子申请理由');
                    } else if (applyData.topicReason.length < 20) {
                        PopupService.showToast('申请理由不能少于20字');
                    } else {
                        $scope.applyTopicNotice();
                    }
                }
            }
        };


        $scope.$on('$ionicView.beforeEnter', function (e, v) {
            if (v.direction === 'back') {
                $scope.init();
            } else {
                $scope.init();
                $scope.userPicUrl = '';//存储头像本地图片
                $scope.bigPicUrl = '';//存储背景图本地图
                $scope.applyData = {
                    topicImg: '',
                    topicBgImg: '',
                    topicName: '',
                    topicDescription: '',
                    topicReason: '',
                    tagIds: '',
                    tagNames: '',
                    auditStatus:$scope.topicId?3:2,
                    topicId:$rootScope.reviewCircleId?$rootScope.reviewCircleId:''
                };
            }
        });
        //review 申请圈子信息
        $scope.reviewApplyCircle = function () {
            var param = {
                topicId:$rootScope.reviewCircleId
            };
            ApplyCircleService.reviewEditApply(param)
                .success(function (response) {
                    $scope.darftStatus = response.data.list.auditStatus;
                    $scope.topicId = response.data.list.id;
                    $scope.auditRefuseStatus = response.data.list.auditStatus;
                    $scope.applyData.topicImg = response.data.list.topicImg;//头像
                    $scope.applyData.topicBgImg = response.data.list.topicBgImg;//背景图
                    $scope.bigPicUrl = response.data.list.topicBgImg;//背景图
                    $scope.userPicUrl = response.data.list.topicImg;//头像
                    $scope.applyData.topicName = response.data.list.topicName;
                    $scope.applyData.topicDescription = response.data.list.topicDescription;
                    $scope.applyData.topicReason = response.data.list.entryReason;
                    $scope.auditOpinion = response.data.list.auditHistory;//审批意见
                    console.log($scope.auditOpinion);
                    $ionicScrollDelegate.resize();
                }).error(function () {

            });
        };
        // 获取标签
        $scope.getTags = function () {
            var id = {
                id: $rootScope.reviewCircleId
            };
            ApplyCircleService.getTags(id)
                .success(function (response) {
                    $scope.tags = response.data.list;//获取自定义标签和常用标签
                    console.log($scope.tags);

                    for (var i =0;i<$scope.tags.length;i++) {
                        if($scope.tags[i].approval){
                            var name = {
                                name:$scope.tags[i].name
                            };
                            $rootScope.addedTags.push(name);
                            console.log($rootScope.addedTags);
                        } else {
                            var name2 = {
                                name:$scope.tags[i].name
                            };
                            $rootScope.nameStringToObj.push(name2);
                            // $rootScope.storeId.push($scope.tags[i].id);
                            // $rootScope.storeNames.push($scope.tags[i].name);
                            console.log($rootScope.nameStringToObj);
                        }
                    }
                })
        };

        //保存草稿
        $scope.storageDraft = function () {

            if (!$scope.applyData.topicImg && !$scope.applyData.topicBgImg && !$scope.applyData.topicName && !$scope.applyData.topicDescription && !$scope.applyData.topicReason && !$scope.applyData.topicReason ) {
                PopupService.showToast('亲，请至少填一项哦');
                return;
            }

            var keywords = {
                keywords: $scope.applyData.topicName + $scope.applyData.topicDescription + $scope.applyData.topicReason
            };
            $scope.applyData.auditStatus = 3;
            ApplyCircleService.judgeWords(keywords)
                .success(function (response) {
                    if (response.message == '没有敏感词') {
                        var submitData = $scope.applyData;
                        submitData.tagIds = $rootScope.storeId.toString();
                        console.log('转换后id', submitData.tagIds);
                        console.log('addedTags', $rootScope.addedTags);
                        $scope.pushTags = [];//转换一下格式
                        for (var i = 0; i < $rootScope.addedTags.length; i++) {
                            console.log($rootScope.addedTags[i].name);
                            $scope.pushTags.push($rootScope.addedTags[i].name);
                            console.log($scope.pushTags);
                        }
                        submitData.tagNames = $scope.pushTags.toString();
                        console.log('转换后name', submitData.tagNames);
                        if($scope.topicId && ($scope.auditRefuseStatus == 3)) {//如果有圈子id就调保存草稿接口
                            ApplyCircleService.storageDraft(submitData)//保存
                                .success(function (response) {
                                    if (response.success == false) {
                                        PopupService.showToast(response.message);
                                    } else {
                                        // PopupService.showToast('保存成功');
                                        $scope.draftStorgeSuccess = true;
                                        $timeout(function () {
                                            $scope.draftStorgeSuccess = false;
                                        }, 1000);
                                    }
                                })
                                .error(function (err) {
                                    console.log(err);
                                });
                        } else if($scope.auditRefuseStatus == 1){
                            ApplyCircleService.refuseStorage(submitData)//保存
                                .success(function (response) {
                                    if (response.success == false) {
                                        PopupService.showToast(response.message);
                                    } else {
                                        // PopupService.showToast('保存成功');
                                        $scope.draftStorgeSuccess = true;
                                        $timeout(function () {
                                            $scope.draftStorgeSuccess = false;
                                        }, 1000);
                                    }
                                })
                                .error(function (err) {
                                    console.log(err);
                                });
                        } else {
                            ApplyCircleService.applyCircleInfo(submitData)//保存
                                .success(function (response) {
                                    if (response.success == false) {
                                        PopupService.showToast(response.message);
                                    } else {
                                        $rootScope.reviewCircleId = response.data;
                                        $scope.auditRefuseStatus = 3;
                                        $scope.topicId = response.data;
                                        $scope.applyData.topicId = response.data;
                                        // PopupService.showToast('保存成功');
                                        $scope.draftStorgeSuccess = true;
                                        $timeout(function () {
                                            $scope.draftStorgeSuccess = false;
                                        }, 1000);
                                    }
                                })
                                .error(function (err) {
                                    console.log(err);
                                });
                        }

                    } else {
                        PopupService.showToast('存在敏感词' + response.data);//提示接口返回的提示
                    }
                }).error(function () {

            });
        };

    }
]);
/**
 * Created by Andy on 2016/10/11.
 */
APP.service('ApplyCircleService', ['$http', 'UrlService', function ($http, UrlService) {
    //申请圈子接口
    this.applyCircleInfo = function (params) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('APPLY_TOPIC'),
            data: params
        });
    };
    //上传图片接口
    this.uploadImage = function () {
        return UrlService.getUrl('UPLOAD_ASSESS_IMG');
    };
    //敏感词判断
    this.judgeWords = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('BY_CONDITION'),
            data: param
        });
    };
    //申请结果回显接口
    this.reviewEditApply = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('REVIEW_APPLY_TOPIC'),
            data: param
        });
    };
    //获取标签
    this.getTags = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('SELECT_TAGS_BY_TOPICID'),
            data: param
        });
    };
    //保存草稿,草稿状态提交申请
    this.storageDraft = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('STORAGE_APPLY_DRAFT'),
            data: param
        });
    };
    //删除草稿
    this.delectDraft = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('DELETE_APPLY_TOPIC_DRAFT'),
            data: param
        });
    };
    //refuse之后再保存
    this.refuseStorage = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('STORAGE_APPLY_REFUSE'),
            data: param
        });
    };
}
]);
