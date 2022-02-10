APP.factory('CalculateStrLength',function(){
    var functionObject = {};
    //超出显示省略号 方法 param1：原始字符串 param2：容器可容纳字符长度
    functionObject.limitStrLength = function(str,limitLength){
      var temLength = 0;//暂时存储字符长度的变量
      for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>127 || str.charCodeAt(i)==94){
          temLength +=2;
          if(temLength>limitLength){
          return str.substring(0,i-1)+'...';
        }
        }else{
          temLength ++;
          if(temLength>limitLength){
          return str.substring(0,i-1)+'...';
        }
        }
      }
      //如果遍历完字符串 并没有超出容器 就直接全部展示
      if(temLength<=limitLength){
        return str;
      }
    }
    //把一个含有超过2位小数位的价格转化为一个包含整数部分和小数部分的对象
    functionObject.dealPrice = function(price){
      if(price!=null&&price!=undefined){
        var price = price.toString();
        var pointIndex = price.indexOf(".");
        if(pointIndex==-1){
          return {
          "priceInt":price,
          "priceFloat":'00'
        }
        }else{
          var priceInt = price.substring(0,pointIndex);
          var priceFloat = price.substring(pointIndex+1).substring(0,2);
          return {
            "priceInt":priceInt,
            "priceFloat":priceFloat
          }
        }
      }
    }
    return functionObject;
})