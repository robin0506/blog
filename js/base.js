

window.onload = function () {
   var $tap = '.js_tap';
   var tapTimer;
   var count = 0;
   var currentPage = 1;
   var size = 6;
   var domain = "http://api.golf.lesports.com/";
   var has_next = true;
   var message={};

   var getURLParameter =function(name) {
     return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
   }
   var inOutInit = function() {
     mui('.intro span').on('tap',function(e) {
       if (e.target.className == "out") {
         $('.intro p').css('-webkit-line-clamp', '100').css('text-align', 'justify');
         $('.intro .out').hide();
         $('.intro .in').show();
       } else if (e.target.className = "in") {
         $('.intro p').css('-webkit-line-clamp', '2').css('text-align', '');
         $('.intro .in').hide();
         $('.intro .out').show();
       }
     });
   }; //end in_out_init

   var eventInit = function() {

     mui(document).on('tap','.js_native',function(){
      if( window.webkit){
        message.type= $(this).attr('data-type');
        message.subtype=$(this).attr('data-subtype') || '';
        message.id = $(this).attr('data-id');
        window.webkit.messageHandlers.segue_item.postMessage(message);
        }
     })

     mui(document).on('tap','.js_jump',function(){
        console.log('jump');
        if(window.webkit){
          mui.openWindow($(this).attr('href')||'#');
        }
     })

     mui(document).on('tap','a',function(){
        if(!window.webkit){
          mui.openWindow($(this).attr('href')||'#');
        }
     })

     $(document).on('touchstart','.focus .swiper-slide', function() {
       $(this).data('highlight', true);
       var _this = $(this);
       tapTimer = setTimeout(function() {
         _this.find('.modal').hide();
         _this.find('.modalword').hide();
       }, 100)

     })
     $('.focus .swiper-slide').on('touchmove', function() {
       if ($(this).data('highlight')) {
         clearTimeout(tapTimer);
         $(this).data('highlight', false);
         $(this).find('.modal').show();
         $(this).find('.modalword').show();
       }
     })

     $('.focus .swiper-slide').on('touchend', function() {
       if ($(this).data('highlight')) {
         clearTimeout(tapTimer);
         $(this).data('highlight', false);
         $(this).find('.modal').show();
         $(this).find('.modalword').show();
       }
     })

     //页顶icon点击态
     $('.back').on('touchstart', function() {
       $(this).data('highlight', true).find('img').attr('src', "image/icon_back_s.png");
     });
     $('.back').on('touchmove', function() {
       if ($(this).data('highlight')) {
         // console.log('hide back')
         $(this).data('highlight', false).find('img').attr('src', "image/icon_back.png");
       }
     });
     $('.back').on('touchend', function() {
       if ($(this).data('highlight')) {
         $(this).data('highlight', false).find('img').attr('src', "image/icon_back.png");
       }
     });

     $('.share').on('touchstart', function() {
       $(this).data('highlight', true).find('img').attr('src', "image/icon_share_s.png");
     });
     $('.share').on('touchmove', function() {
       if ($(this).data('highlight')) {
         $(this).data('highlight', false).find('img').attr('src', "image/icon_share.png");
       }
     });

     $('.share').on('touchend', function() {
       if ($(this).data('highlight')) {
         $(this).data('highlight', false).find('img').attr('src', "image/icon_share.png");
       }
     });//页顶icon点击态end
     
   }; //end event_init

   var swiperInit = function() {
       var swiper = new Swiper('.focus', {
         slidesPerView: 'auto',
         spaceBetween: 7
       })
       var swiper1 = new Swiper('.slide', {
         slidesPerView: 'auto',
         pagination: '.swiper-pagination',
         spaceBetween: 10,
         autoplay: 3000,
         autoplayDisableOnInteraction: false
       })
     } //end swiper_init

   var tapStatusInit = function() {
     var touchStartHandler = function(e) {
       $(this).data('highlight', true);
       var _this = $(this);
       tapTimer = setTimeout(function() {
         _this.find('.tapModal').show();
       }, 100)
     };

     var touchMoveHandler = function(e) {
       if ($(this).data('highlight')) {
         clearTimeout(tapTimer);
         $(this).data('highlight', false).find('.tapModal').hide();
       }
     }

     var touchEndHandler = function(e) {
       if ($(this).data('highlight')) {
         clearTimeout(tapTimer);
         $(this).data('highlight', false).find('.tapModal').hide();
       }
     }

     $(document).on('touchstart',$tap,touchStartHandler);
     $(document).on('touchmove',$tap,touchMoveHandler);
     $(document).on('touchend',$tap,touchEndHandler);
   }

   var pulldownRefresh = function() {

   }

   var pullupRefresh = function() {
   
    getNews();    

   }

   var muiInit = function() {
     mui.init({
       pullRefresh: {
        click:true,
         container: '#pullrefresh',
         // down: {
         //   callback: pulldownRefresh
         // },
         up: {
           show:true,
           contentrefresh: '正在加载...',
           offset:500,
           callback: pullupRefresh
         }
       }
     });
   }

   var picPreload = function(){
      var images= new Array();
      function preload(){
        for(var i=0; i<preload.arguments.length;i++){
          images[i] = new Image();
          images[i].src = preload.arguments[i];
        }
      }
      preload(
        "image/icon_back_s.png",
        "image/icon_share_s.png"
        )
   }

   var hideMask = function(){
    $('#loading').hide();
   }

   var init = function() {
     inOutInit();
     eventInit();
     swiperInit();
     tapStatusInit();
     muiInit();
     picPreload();
     hideMask();
   }

   // init();

   var dealInfo=function(data){
    //logo
    if(data.logo_image){
      $('.mark img').attr('src',data.logo_image);
    };
    //标题
    if(data.title){
      $('.mark span').html(data.title);
      $('title').html(data.title);

    };
    //描述
    if(data.detail_desc){
      $('.intro p').html(data.detail_desc);
      if($('.intro p').height() > 38){
          $('.intro p').css('-webkit-line-clamp','2');
          $('.intro .out').show();
      }
    }
    if(data.news_title){
      $('.b3 .title').html(data.news_title);
    }
   }

   var dealmatch = function(data){
    var match_items = data.matches;
    for(var i=0;i<match_items.length;i++){
      var appendString = ' <div class="b2 js_tap js_native" data-id="'+match_items[i].id+'" data-type="MATCH" data-live="'+match_items[i].is_live+'" data-mid="'+(match_items[i].mid?match_items[i].mid : '')+'"> <div class="tapModal"></div>  <a class href="#">  <div class="b2in border-1px-down"> <div class="online">  <img class="mainpic" src="image/online.jpg" > <div class="onlineword">   <p class="title wordEllipsis2">'+match_items[i].name+'</p>    <p class="time">'+match_items[i].start_time.substring(5,16)+'</p>'+(match_items[i].is_live?'<img class="enter" src="image/button.png">':'') +'  </div>  </div>  <div class="location"> <img src="image/location.png"><span>'+match_items[i].area+'</span>    </div>       </div>    </a>   </div>      ';
      $('.match').append(appendString);
    }
   }

   var dealNewsPic=function(data){
      var news_items = data.news;
      for(var i=0;i<news_items.length;i++){
        var appendString = '<div class="swiper-slide js_native" data-type="NEWS" data-subtype="IMAGES" data-id="'+news_items[i].id+'">  <a href="http://www.lesports.com/news/'+news_items[i].id+'">  <img src="'+news_items[i].image_uris['default'].replace('bak','300_300')+'" > <div class="modal"></div>  <div class="modalword"> <p class="l1">'+(news_items[i].title||'')+'</p>  <p class="l2">'+(news_items[i].subtitle||'')+'</p>  </div>   </a>    </div>';
        $('.focus .swiper-wrapper').append(appendString);
      }
      var width = document.body.clientWidth;
      var setValue = Math.round(150/375*width);
      $('.focus').css('height',setValue+'px');
      $('.focus .swiper-slide').css('width',setValue+'px');
      $('.focus .swiper-slide img').css('width',setValue+'px');
   }

   var dealFocus=function(data){
    var focus_items = data.focus_pictures;
    for(var i=0; i<focus_items.length;i++){
      var appendString = '<div class="swiper-slide js_tap" data-type="'+focus_items[i].content_type+'" data-id="'+focus_items[i].content_id+'"> <a href="'+(focus_items[i].html_url||'#')+'" class="js_jump a_click"> <img class="focusImg" src="'+focus_items[i].base_thumbnail_uri+'"> <div class="tapModal"></div> </a> </div>';
      $('.slideout .swiper-wrapper').append(appendString);
    }

  
    //设置focus的高度
    var width = $('.slide').width() ||document.body.clientWidth;
    var setValue;
    $('.focusImg').each(function(index){
      if(setValue){
        if($(this)[0].naturalHeight/ $(this)[0].naturalWidth < setValue){
          setValue = $(this)[0].naturalHeight/ $(this)[0].naturalWidth;
        }
      }else{
        setValue = $(this)[0].naturalHeight/ $(this)[0].naturalWidth;
      }

    })
    var setValue = Math.round(setValue*width);
    $('.slide').css('height',setValue+'px');

   }

   var sendSharedItem = function (data){
    if(window.webkit){
      var message = {};
      message.title = data.title;
      message.thumbnail_uri = data.logo_image;
      message.id = getURLParameter('id');
      message.type = "H5SHARE_MATCH";
      window.webkit.messageHandlers.shared_item.postMessage(message);
    }
   }

   var dealBase = function(res){
    var data = res.data;
    dealInfo(data);  //处理标题、logo、介绍
    dealmatch(data); //处理赛事
    dealNewsPic(data);//处理上面新闻图集
    dealFocus(data);//处理焦点图
    init();  //base接口完毕后初始化页面
    sendSharedItem(data); //将页面信息发送给客户端
  }

   var getBase = function(){
    $.ajax({
       type: 'get',
       url: domain+'albatross/v1/h5/topic-page/match/'+getURLParameter('id'),
       success: function(res) {
        console.log('success:getBase');
        dealBase(res);
       }
     });
   };

   var dealNews = function(res,currentPage){
      currentPage = currentPage || 1;
      var data = res.data;
      var length = data._content_size;
      var content = data._content;   
      var fragmentUp = document.createDocumentFragment();
      var fragmentDown = document.createDocumentFragment();
      has_next = data._has_next;
      for(var i =0;i<length;i++){
        var item = content[i];
        var subtype;
        switch(item.news_type){
          case 0:
            subtype = "RICH";
            break;
          case 1:
            subtype = "VIDEO";
            break;
          case 2:
            subtype = "PLAIN_TEXT";
            break;
          case 3:
            subtype = "IMAGES";
            break;
        }
        if(item.news_type == 3){  //图集
          var appendString = '<div class="news3 outer js_tap js_native" data-type="NEWS" data-subtype="'+subtype+'" data-id="'+item.id+'">  <a href="http://www.lesports.com/news/'+item.id+'" target="_blank"> <div class="tapModal"></div>  <div class="inner border-1px-up"> <p class="subtitle wordEllipsis1">'+item.title+'</p> <div class="piclist">  <div class="picout">   <img class="pic" src="'+item.image_uris['400_300_1']+'"> </div> <div class="picout">  <img class="pic" src="'+item.image_uris['400_300_2']+'"> </div> <div class="picout"> <img class="pic" src="'+item.image_uris['400_300_3']+'">  </div>   </div>  </div>  </a> </div>';
          var div = document.createElement('div');
          div.innerHTML = appendString;
        }else{
          var appendString = '<div class="news1 outer js_tap js_native" data-highlight=false data-type="NEWS" data-subtype="'+subtype+'" data-id="'+item.id+'"> <div class="tapModal"></div> <a href="http://www.lesports.com/news/'+item.id+'" class="a_click"> <div class="inner  border-1px-up"> <div class="news"> <img class="mainpic" src="'+item.image_uris['400*300']+'"> <div class="word"> <div class="pack"> <p class="title1 wordEllipsis2">'+item.title+'</p> <p class="time">'+item.create_time.substring(5,16)+'</p> </div> </div> </div> </div></a> </div>';
          var div = document.createElement('div');
          div.innerHTML = appendString;
        }
        if(currentPage==1 && i<3){
          //$('.upNews').append(div);
          fragmentUp.appendChild(div);
        }else{
          fragmentDown.appendChild(div);
         // $('.downNews').append(div);
        }
      }
      $('.upNews').append(fragmentUp);
      $('.downNews').append(fragmentDown);

   }

   var getNews = function(){
    $.ajax({
      type:'get',
      url:domain+'albatross/v1/h5/topic-page/match/'+getURLParameter('id')+'/news?page='+currentPage+'&size='+size,
      success:function(res){       
        console.log('success:getNews');
        b= res;
        dealNews(res,currentPage);
        if(currentPage !=1){  //页面初始化第一页数据不进行mui
           mui('#pullrefresh').pullRefresh().endPullupToRefresh(!has_next);
        }
        currentPage++;
      },error:function(){
        alert('数据出错啦，请稍后刷新页面');
      }
    })
   };

   getBase();
   getNews();

 }

