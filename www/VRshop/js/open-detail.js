/* global AFRAME */

/**
 * Component that listens to an event, fades out an entity, swaps the texture, and fades it
 * back in.
 */

var product_data={
  "16119":{
    imgurls:[cdn_url+"image/products/fridge_1.png", cdn_url+"image/products/fridge_2.png", cdn_url+"image/products/fridge_3.png"],
    product_name:"冰箱",
    feature_short:"全空间保鲜 干湿分储",
    tag:"470升",
    type:"BCD-470WDPG",
    feature:["变频静音","T·ABT杀菌技术","风尚外观"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/16119/0///",
  },
  "14937":{
    imgurls:[cdn_url+"image/products/tv_1.png", cdn_url+"image/products/tv_2.png", cdn_url+"image/products/tv_3.png"],
    product_name:"彩电",
    feature_short:"巨幕4K高清 YUNOS系统",
    tag:"86英寸",
    type:"LS86A31",
    feature:["金色尊贵外观","32G大存储","LG硬屏"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/14937/0///",
  },
  "14473":{
    imgurls:[cdn_url+"image/products/vent_1.png", cdn_url+"image/products/vent_2.png", cdn_url+"image/products/vent_3.png"],
    product_name:"厨电",
    feature_short:"“自净芯”智能油烟机 智能清洗",
    tag:"吸油烟机",
    type:"CXW-200-E800C7(T)",
    feature:["WIFI控制","16m³大风量","360°漩吸"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/14473/0///",	
  },
  "13763":{
    imgurls:[cdn_url+"image/products/stove_1.png", cdn_url+"image/products/stove_2.png", cdn_url+"image/products/stove_3.png", cdn_url+"image/products/stove_4.png", cdn_url+"image/products/stove_5.png", cdn_url+"image/products/stove_6.png", cdn_url+"image/products/stove_7.png", cdn_url+"image/products/stove_8.png"],
    product_name:"厨电",
    feature_short:"4.5KW大火力设计 聚能炉头",
    tag:"燃气灶",
    type:"JZT-QE7B(12T)",
    feature:["铜锁保护","五重防爆钢化玻璃面板","脉冲点火"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/13763/0///",	
  },
  "14685":{
    imgurls:[cdn_url+"image/products/livingroom_ac_1.png", cdn_url+"image/products/livingroom_ac_2.png", cdn_url+"image/products/livingroom_ac_3.png", cdn_url+"image/products/livingroom_ac_4.png"],
    product_name:"空调",
    feature_short:"除PM0.3模块 一键自清洁",
    tag:"3匹",
    type:"KFR-72LW/12MAP22AU1套机",
    feature:["二级能效更省电","定位送风","变频静音"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/14685/0///",
  },
  "12979":{
    imgurls:[cdn_url+"image/products/bedroom_ac_1.png", cdn_url+"image/products/bedroom_ac_2.png", cdn_url+"image/products/bedroom_ac_3.png"],
    product_name:"空调",
    feature_short:"变频自清洁 高效去除PM2.5",
    tag:"1.5匹",
    type:"KFR-35GW/03EAAAL22AU1套机",
    feature:["二级能效更省电","品质压缩机", "PMV人体舒适控制系统"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/12979/0///",
  },
  "13175":{
    imgurls:[cdn_url+"image/products/washing_1.png", cdn_url+"image/products/washing_2.png", cdn_url+"image/products/washing_3.png"],
    product_name:"洗衣机",
    feature_short:"水晶智能变频 斐雪派克电机",
    tag:"8公斤",
    type:"EG8014BDX59STU1",
    feature:["洗衣液自动添加","智能手机控制","摇篮柔洗"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/13175/0///",
  },
  "16311":{
    imgurls:[cdn_url+"image/products/heater_1.png", cdn_url+"image/products/heater_2.png", cdn_url+"image/products/heater_3.png", cdn_url+"image/products/heater_4.png"],
    product_name:"热水器",
    feature_short:"变容速热洗 智能防电墙热水器",
    tag:"60升",
    type:"EC6003-MT3(U1)",
    feature:["智能抑菌","WIFI智能操控","1级能效更省电"],
    detail_url:"http://m.ehaier.com/www/index.html#/productDetail/16311/0///",
  }
}

// var product_obj;
// var overlay;
// AFRAME.registerComponent('open-detail', {
//   schema: {
//     on: {type: 'string'},
//     product_id: {type: 'string'},
//   },

//   init: function () {
//     var data = this.data;
//     var el = this.el;

//     el.addEventListener(data.on, function () {
//       $("#details").css("display","block");
      
//       product_obj = product_data[data.product_id];
//       document.getElementById("item_id").innerHTML = product_obj.product_name;
//       document.getElementById("featureshort").innerHTML = product_obj.feature_short;
//       document.getElementById("tag").innerHTML = product_obj.tag;
//       document.getElementById("type").innerHTML = product_obj.type;
      
//       document.getElementById("feature").innerHTML = product_obj.feature;
//       document.getElementById("more").href = product_obj.detail_url;
//       document.getElementById("buy").href = product_obj.detail_url;
      
      // // images
      // var imageBlock = document.getElementById("imageBlock");
      // var arrayLength = product_obj.imgurls.length;
      // slideIndex = 0;
      // for(var i = 0; i < arrayLength; i++){
      //   $('.imageBlock').slick('slickAdd', '<div><img src=\"' + product_obj.imgurls[i] + '\" style=\'height: 100%; width: 100%; object-fit: contain\'></div>');
      //   slideIndex++;
      // }
      
//       // skybox
//       document.querySelector('#image-360').setAttribute('src', currentRoomTag+'-blur');
      
//       overlay = $('<div></div>').prependTo('body').attr('id', 'overlay-blocker');
//       $('#back-to-origin').css('display', 'none');
//     });
    
    
//   },

// });;

// function sliderChange(current, min, max){
//   $('#product_img').attr('src', product_obj.imgurls[current]);
// }


function showProduct(product_id){
      $("#my-div").css("display","block");
      $("#details").css("display","block");
      
      product_obj = product_data[product_id];
      document.getElementById("item_id").innerHTML = product_obj.product_name;
      document.getElementById("featureshort").innerHTML = product_obj.feature_short;
      document.getElementById("tag").innerHTML = product_obj.tag;
      document.getElementById("type").innerHTML = product_obj.type;
      
      document.getElementById("feature").innerHTML = product_obj.feature;
      document.getElementById("more").href = product_obj.detail_url;
      document.getElementById("buy").href = product_obj.detail_url;
      
      // images
      var imageBlock = document.getElementById("imageBlock");
      var arrayLength = product_obj.imgurls.length;
      slideIndex = 0;
      for(var i = 0; i < arrayLength; i++){
        $('.imageBlock').slick('slickAdd', '<div><img src=\"' + product_obj.imgurls[i] + '\" style=\'height: 100%; width: 100%; object-fit: contain\'></div>');
        slideIndex++;
      }
      
      console.log("slideIndex:"+slideIndex);
      $('#back-to-origin').css('display', 'none');
}




