APP.controller('CompetitionController', ['$scope', '$ionicHistory', 'MemberCompleteService', 'PopupService', 'CreditService', 'UrlService', '$state','$stateParams','$http','InAppBrowserService', '$ionicSlideBoxDelegate','$location','$rootScope',
  function($scope, $ionicHistory, MemberCompleteService, PopupService, CreditService, UrlService, $state, $stateParams,$http,InAppBrowserService, $ionicSlideBoxDelegate,$location, $rootScope) {
    var taskDestId = $stateParams.taskDestId;
    $scope.taskType = $stateParams.taskType;
    $scope.xyzMemberId = $stateParams.memberId;

    // 自定义随机轮播
    var firstName = [
          '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨'
           ,'朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '苏', '潘', '葛', '奚', '范', '彭', '郎'
           , '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟'
           , '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危',
            '江', '童', '颜', '郭', '梅', '盛', '林', '刁', '钟', '徐', '邱', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍', '虞', '万', '支', '柯', '昝', '管', '卢', '莫', '经', '房', '裘'
            , '缪', '干', '解', '应', '宗', '丁', '宣', '贲', '邓', '郁', '单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '钮', '龚', '程', '嵇', '邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '於', '惠', '甄', '麴', '家', '封', '芮', '羿', '储', '靳', '汲', '邴', '糜', '松', '井', '段', '富', '巫', '乌', '焦', '巴', '弓', '牧', '隗', '山', '谷', '车', '侯', '宓', '蓬', '全', '郗', '班', '仰', '秋', '仲', '伊', '宫', '宁', '仇', '栾', '暴', '甘', '钭', '厉', '戎', '祖', '武', '符', '刘', '景', '詹', '束', '龙', '叶', '幸', '司', '韶', '郜', '黎', '蓟', '薄', '印', '宿', '白', '怀', '蒲', '邰', '从', '鄂', '索', '咸', '籍', '赖', '卓', '蔺', '屠', '蒙', '池', '乔', '阴', '郁', '胥', '能', '苍', '双', '闻', '莘', '党', '翟', '谭', '贡', '劳', '逄', '姬', '申', '扶', '堵', '冉', '宰', '郦', '雍', '舄', '璩', '桑', '桂', '濮', '牛', '寿', '通', '边', '扈', '燕', '冀', '郏', '浦', '尚', '农', '温', '别', '庄', '晏', '柴', '瞿', '阎', '充', '慕', '连', '茹', '习', '宦', '艾', '鱼', '容', '向', '古', '易', '慎', '戈', '廖', '庾', '终', '暨', '居', '衡', '步', '都', '耿', '满', '弘', '匡', '国', '文', '寇', '广', '禄', '阙', '东', '殴', '殳', '沃', '利', '蔚', '越', '夔', '隆', '师', '巩', '厍', '聂', '晁', '勾', '敖', '融', '冷', '訾', '辛', '阚', '那', '简', '饶', '空', '曾', '毋', '沙', '乜', '养', '鞠', '须', '丰', '巢', '关', '蒯', '相', '查', '後', '荆', '红', '游', '竺', '权', '逯', '盖', '益', '桓', '公', '万',,'俟', '司马',
            '上官', '欧阳', '夏侯', '诸葛', '闻人', '东方', '赫连', '皇甫', '尉迟', '公羊', '澹台', '公冶', '宗政', '濮阳', '淳于', '单于', '太叔', '申屠', '公孙', '仲孙', '轩辕', '令狐', '钟离', '宇文', '长孙', '慕容', '鲜于', '闾丘', '司徒', '司空', '亓官', '司寇', '仉', '督', '子车', '颛孙', '端木', '巫马', '公西', '漆雕', '乐正', '壤驷', '公良', '拓跋', '夹谷', '宰父', '谷梁', '晋', '楚', '闫', '法', '汝', '鄢', '涂', '钦', '段干', '百里', '东郭', '南门', '呼延', '归', '海', '羊舌', '微生', '岳', '帅', '缑', '亢', '况', '后', '有', '琴', '梁丘', '左丘', '东门', '西门', '商', '牟', '佘', '佴', '伯', '赏', '南宫', '墨', '哈', '谯', '笪', '年', '爱', '阳', '佟', '第五', '言', '福'
    ]
    var lastName = ['奕柯','消沉','天乐','维妙','峻','哲','晓培','益申','莹莹','占宇','雨','凌昕','婉婷','建雄','小文','小冉','子安','老杰','胖胖','文','剑','霖','锰','克谦','小仙','帅帅','逸','旭梅','萍','元雪','晓莉','明燕','九庆','留强','汝彬','台铭','帆','昆仑','万里','中锋','志伟','明汉','琴','珍美','明君','涛','文武','艳艳','小刚','霞','浩','志豪','军林','叶东','远青','伟军','明浩','佑军','盛露','少青','发祥','钟森','永发','运瑞','自珍','家宝','建联','迪','慧','盛锦','素素','生平','海峰','喧喧','文宏','景翔','子博','炳良','保胜','希玮','莱','宇佳','博飞','文诺','宸萧','萍','利','墨语','宇凡','方丰','景宝','乐新','康帅','睿继','温雁','呈远','运','恩','叶','涵琰','文文','杰宪','迪勋','颜悦','杭','彬','信','帅鸿','庭达','然','睿进','锦远','康飞','茂轩']
    $scope.indexNum = 0;
    //随机的用户个数
    var userLen = 10;

    function getRandoms(min, max, arr, toFixed) {
      while (true) {
        var isExists = false;
        // 获取一个10–100范围的数
        var random;
        if (toFixed) {
          random = (min + ((max-min) - min) * (Math.random())).toFixed(2);
        } else {
          random = Math.ceil(min + ((max-min) - min) * (Math.random()));
        }
        // 判断当前随机数是否已经存在
        for (var i = 0; i < arr.length; i++) {
            if (random === arr[i]) {
                isExists = true;
                break;
            }
        }
        // 如果不存在，则添加进去
        if (!isExists)
            arr.push(random);
        // 如果有10位随机数了，就跳出
        if (arr.length === userLen)
            break;
      }
    }
    //随机金额
    var minMon = 50;
    var maxMon = 3000;
    $scope.moneyRandoms=[];
    getRandoms(minMon, maxMon, $scope.moneyRandoms, true);
    // 随机时间
    var minTime = 1;
    var maxTime = 60;
    $scope.timeRandoms = []
    getRandoms(minTime, maxTime, $scope.timeRandoms, false);
    //随机头像
    var minImg = 0;
    var maxImg = 198;
    $scope.userImg = [];
    getRandoms(minImg, maxImg, $scope.userImg, false);
    // 获取随机 firstName 和 lastName
    function getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
      while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
      }
      return shuffled.slice(min);
    }
    $scope.userList = [];
    $scope.firstName = getRandomArrayElements(firstName, userLen);
    $scope.lastName = getRandomArrayElements(lastName, userLen);
    $scope.allName = [];
    // 将姓和名拼在 一起;
    function allName(n,m) {
      for (var i=0;i<userLen;i++) {
        $scope.allName.push(n[i]+''+m[i]);
      }
      return $scope.allName;
    }
    allName($scope.firstName, $scope.lastName);
    for (var i =0 ;i<userLen;i++) {
      $scope.userList.push({src: $rootScope.imgBaseURL + 'img/userImg/'+$scope.userImg[i]+'.jpg',money: $scope.moneyRandoms[i], allName: $scope.allName[i], time: $scope.timeRandoms[i]});
    }
    //返回
    $scope.goBack = function() {
      $ionicHistory.goBack();
    };
    $scope.share = function() {
      if (window.cordova) {
        $scope.showShare = true;
      } else {
        PopupService.showAlert('只能在app分享', '抱歉，只能在app分享');
      }
    };
    $scope.toRules = function(){
      var u = navigator.userAgent;

      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=609','金币（积分）说明');
        ref.addEventListener('exit', function (event) {
        });
      } else {
        $state.go('helpDetail', {'helpId': '609', 'content': '金币（积分）说明'});
      }
    }
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "padding-top": "22px",
        "height":"66px"

      }
    }else{
      $scope.paddingtopClass = {
        "padding-top": "6px",
        "height":"50px"
      }
    }

    /*********************分享标签－whiteBird start*********************/
    //复制
    $scope.copeText = function(text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
        $scope.isShowCopyButton = false;
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };

    $scope.hideblackCover = function() {
      $scope.showShare = false;
    };
    //分享事件
    $scope.shareToPlatform = function(index) {

      var title = $scope.competition.storeName + '的综合竞争力指数',
        content = '综合竞争力指数全球排名' + $scope.competition.userRank + '位' + '颤抖吧人类',
        pic = $scope.competition.avatarImageFileId, //product 里只有这个img
        url = UrlService.getShareLinkHeader() + 'competition//'+ $scope.taskType+'/'+$scope.xyzMemberId;
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, function(){
              MemberCompleteService.missionShare($scope.taskType, taskDestId, '微博')
               .success(function(){
                 console.log('成功分享到微博');
               });
               CreditService.shareSuccessCallback('微博');
          });
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, function(){
              MemberCompleteService.missionShare($scope.taskType, taskDestId, '微信')
                .success(function(){
                  console.log('成功分享到微信');
                });
                CreditService.shareSuccessCallback('微信');
          });
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, function(){
              MemberCompleteService.missionShare($scope.taskType, taskDestId, '朋友圈')
              .success(function(){
                console.log('成功分享到朋友圈');
              });
              CreditService.shareSuccessCallback('朋友圈');
          });
        }else if(index==3){
          window.umeng.shareToQQ(title, content, pic, url, 0, null, function(){
            MemberCompleteService.missionShare($scope.taskType, taskDestId, '朋友圈')
              .success(function(){
                console.log('成功分享到QQ');
              });
            CreditService.shareSuccessCallback('QQ');
          });
        }else if(index == 4){
          window.umeng.shareToQzone(title, content, pic, url, 0, null, function(){
            MemberCompleteService.missionShare($scope.taskType, taskDestId, '朋友圈')
              .success(function(){
                console.log('成功分享到QQ空间');
              });
            CreditService.shareSuccessCallback('QQ空间');
          });
        }else if (index == 5) {
          $scope.copeText(url);
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      taskDestId = $stateParams.taskDestId;
      $scope.taskType = $stateParams.taskType;
      $scope.competition = '';
      /*********************分享标签－whiteBird start*********************/
      $scope.showShare = false;
      /*********************分享标签－whiteBird end*********************/

      $scope.xyzMemberId = $stateParams.memberId;
      $scope.gameId = $stateParams.gameId;
      $scope.storeId = '';
      var begin=new Date().getTime();
      MemberCompleteService.myComplete($scope.xyzMemberId).success(function(response) {
        console.log("查询晒战绩用时:"+(new Date().getTime()-begin)+"ms");
        $scope.competition = response.data;
        //alert(JSON.stringify(response.data));
        if($scope.competition.myInCome==undefined) {
          //异步加载佣金信息
          begin=new Date().getTime();
          $.ajax({
            url: UrlService.getUrl('BROKERAGE_SETTLEMENT'),
            data:{memberId:$scope.xyzMemberId},
            type: "post",
            dataType: "json",
            success: function (data) {
              console.log("查询佣金结算用时:"+(new Date().getTime()-begin)+"ms");
              if (data.success && data.data) {
				$scope.competition.myInCome = data.data["totalBrokerageAmount"];
				$scope.$apply();
              }
            },
            error:function(){
              console.error("查询佣金结算信息出错!");
            }
          });
        }
        $scope.storeId = response.data.memberId;
        $scope.userCurrentLevelId = response.data.order;
        console.log($scope.competition);
        var colors=[
          [248,46,91],
          [172,123,171],
          [88,234,231],
          [217,226,109],
          [253,181,70],
          [248,115,60]
        ];
        //TODO
        //订单:伙伴：评价：社区互动：登录：分享=1:1：1：1：1：30：50：50
        var mData = [
          ['店铺单数', $scope.competition.ordersCount/1],
          ['招募结识了', $scope.competition.partner/2],
          ['进行评价', $scope.competition.accessCount/1],
          ['分享', $scope.competition.sharesCount/50],
          ['登录', $scope.competition.loginsCount/50],
          ['社区互动', $scope.competition.comunityCount/30]
        ];
        var max=1;
        for(var i=0;i<mData.length;i++){
          if(mData[i][1]>max){
            max=mData[i][1];
          }
        }
        var mCount=mData.length;
        var radarMap=document.getElementById("radarMap");
        var canvas = document.getElementById("radarMapCanvas");
        if(canvas==null){
          canvas = document.createElement('canvas');
          canvas.id="radarMapCanvas";
          radarMap.appendChild(canvas);
        }
        var width = $(document).width()*0.49;
        var height = width * 402 / 370;
        canvas.style = "position:relative;position: absolute;z-index: -1";
        canvas.width = width;
        canvas.height = height;
        var mCtx=canvas.getContext("2d");
        var mW = width;
        var mH = height;
        var mWCenter = mW /2; //中心点
        var mHCenter=mH/2;
        var mRadius = mWCenter - 3; //半径(减去的值用于给绘制的文本留空间)
        var mAngle = Math.PI * 2 / mCount; //角度
        var mColorPolygon = '#B8B8B8'; //多边形颜色
        var mColorLines = '#B8B8B8'; //顶点连线颜色
        var mColorText = '#000000';

        drawPolygon(mCtx);
        drawLines(mCtx);
        drawRegion(mCtx);
        // 绘制多边形边
        function drawPolygon(ctx){
          ctx.save();
          //ctx.strokeStyle = mColorPolygon;
          var alpha=1/3;
          var r = mRadius/ 3; //单位半径
          //画6个圈
          for(var i = 0; i < 3; i ++){
            ctx.beginPath();
            var currR = r * ( i + 1); //当前半径
            var locations=[];
            //画6条边
            for(var j = 0; j < mCount; j ++){
              var x = mWCenter + currR * Math.cos(mAngle * j-mAngle/2);
              var y = mHCenter + currR * Math.sin(mAngle * j-mAngle/2);
              locations.push([x,y]);

            }
            for(var j=0;j<locations.length;j++){
              ctx.beginPath();
              ctx.moveTo(locations[j][0], locations[j][1]);
              ctx.lineTo(locations[(j+1)%locations.length][0], locations[(j+1)%locations.length][1]);
              ctx.closePath();
              var gradient=ctx.createLinearGradient(locations[j][0], locations[j][1],locations[(j+1)%locations.length][0], locations[(j+1)%locations.length][1]);
              gradient.addColorStop("0.2","rgba("+colors[j].join(",")+","+((i+1)*alpha)+")");
              gradient.addColorStop("0.8","rgba("+colors[(j+1)%locations.length].join(",")+","+((i+1)*alpha)+")");
              ctx.strokeStyle=gradient;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(locations[locations.length-1][0], locations[locations.length-1][1]);
            ctx.lineTo(locations[0][0], locations[0][1]);
            ctx.closePath();
            var gradient=ctx.createLinearGradient(locations[locations.length-1][0], locations[locations.length-1][1],locations[0][0], locations[0][1]);
            gradient.addColorStop("0.2","rgba("+colors[locations.length-1].join(",")+","+((i+1)*alpha)+")");
            gradient.addColorStop("0.8","rgba("+colors[0].join(",")+","+((i+1)*alpha)+")");
            ctx.strokeStyle=gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          ctx.restore();
        };

        //顶点连线
        function drawLines(ctx){
          ctx.save();
          //ctx.strokeStyle = mColorLines;
          for(var i = 0; i < mCount; i ++){
            var x = mWCenter + mRadius * Math.cos(mAngle * i-mAngle/2);
            var y = mHCenter + mRadius * Math.sin(mAngle * i-mAngle/2);
            ctx.beginPath();
            ctx.moveTo(mWCenter, mHCenter);
            ctx.lineTo(x, y);
            var gradient=ctx.createLinearGradient(x,y,mWCenter,mHCenter);
            gradient.addColorStop("0","rgba("+colors[i].join(",")+",1)");
            gradient.addColorStop("0.8","rgba("+colors[i].join(",")+",0.2)");
            ctx.strokeStyle=gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          ctx.restore();
        };

        //绘制数据区域
        function drawRegion(ctx){
          ctx.save();
          ctx.beginPath();

          for(var i = 0; i < mCount; i ++){
            var x = mWCenter + mRadius * Math.cos(mAngle * i-mAngle/2) * mData[i][1]*(100/max) / 100;
            var y = mHCenter + mRadius * Math.sin(mAngle * i-mAngle/2) * mData[i][1]*(100/max) / 100;
            ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.lineWidth = 0.5;
          ctx.strokeStyle="rgba(167,241,224,1)";
          ctx.stroke();
          ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
          ctx.fill();
          ctx.restore();
        };
      }).error(function(response) {
        console.log(response + 'error');
      });
      // 顺逛
      MemberCompleteService.storeDetail($scope.gameId).success(function(response) {
        console.log(response);
        if (response.success == true) {
          $scope.storeCreditWithLevel = response.data.storeCreditWithLevel;
          if($scope.storeCreditWithLevel){
            $scope.storeCurrentLevelId = response.data.storeCreditWithLevel.order;
            // $scope.creditNum = response.data.storeCreditWithLevel.creditNum;
            $scope.starName = response.data.storeCreditWithLevel.name;
            $scope.levelArray = [];

            if($scope.storeCurrentLevelId<=3){
              $scope.levelArray = [$rootScope.imgBaseURL+'img/StarLevel@2x.png'];
            }else{
              $scope.levelArray = [$rootScope.imgBaseURL+'img/Diamond@2x.png'];
            }
          }
        }
      });
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
      $ionicSlideBoxDelegate.enableSlide(false);
    });
    $scope.foots = [
      {src: $rootScope.imgBaseURL+'img/touxiang@2x.png',name: 'aaa',money: '1',time: 10},
      {src: $rootScope.imgBaseURL+'img/touxiang@2x.png',name: 'bbb',money: '2',time: 20},
      {src: $rootScope.imgBaseURL+'img/touxiang@2x.png',name: 'ccc',money: '3',time: 30},
      {src: $rootScope.imgBaseURL+'img/touxiang@2x.png',name: 'ddd',money: '4',time: 40},
      {src: $rootScope.imgBaseURL+'img/touxiang@2x.png',name: 'eee',money: '5',time: 50},
    ]

  }
]);

APP.service('MemberCompleteService', ['$http', 'UrlService', function($http, UrlService) {
  //获取会员信息
  this.myComplete = function(mid) {
    var params = {
      'ownerId': mid
    };
    return $http.get(UrlService.getUrl('MEMER_COMPETE'), params);
  };
  this.missionShare = function(taskType,taskDestId,sharePlatform){
    var params = {
      taskType:taskType,
      taskDestId:taskDestId,
      sharePlatform:sharePlatform
    }
    return $http.get(UrlService.getUrl('MISSION_SHARE'),params);
  };
  this.storeDetail = function (param) {
    var url = UrlService.getUrl('SHUNGUANG_VIP');
    return $http.get(url,param);
  }
}]);
