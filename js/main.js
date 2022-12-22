var singleArticleContainer;
var singleAtricleH;
var mainContent;
$(function(){
    var wH;
    var wrapper = $('#wrapper');
    var slideInSpeed = 300;
    var mainMenu = $('aside.menu .mainMenu');
    var mainMenuNavContainer = $('aside.menu nav');
    var banners = $('.banners');
    var bannersWrap = $('.banners > .bannersWrap');
    var bannersBtn = $('#bannersBtn');
    var bannersCloseBtn = $('.banners > .bannersWrap > .close');
    var contentWrap = $('.contentWrap');
    var topContentContainer = $('#top > div');
    var footer = $('footer');
    var footerH = footer.outerHeight();
    var totopBtn = $('#totop');

    var singleMinHeight = 0;

    if(!contentWrap.children('section').hasClass('top')){
        wrapper.css('opacity', 0);
    }

    $(window).on('load resize', function(){
        wH = $(window).height();
        mainMenuLayoutSet();
        if(!contentWrap.children('section').hasClass('top')){
            contentWrap.css({minHeight: wH - footerH});
        }
        singleMinHeight = $(".contentWrap > .content .mainContent ul.items").outerHeight();
    });
    $(window).on('load', function(){
        wrapper.animate({opacity: 1}, 600, function(){
            if(PAGE_TYPE == "ACTORS" || PAGE_TYPE == "MUSIC" || PAGE_TYPE == "NOVEL" || PAGE_TYPE == "COMIC" || PAGE_TYPE == "ANIMATION" || PAGE_TYPE == "OTHER"){
                new honeyCombBG([
                    [0,2],[1,2],[1,1],[2,2],
                    [2,1],[3,3],[2,0],[3,1],
                    [3,0],[4,1],[6,2],[4,0],
                    [5,1],[5,0],[6,1],[6,0],
                    [7,1],[7,2],[7,0],[8,0],
                    [8,2],[9,1],[9,0]
                ], "honeycombBGCanvas", WWW_RT_BG_IMG_URL);
                new honeyCombBG([
                    [9,1],[8,1],[8,2],[7,2],
                    [7,1],[6,0],[6,2],[5,2],
                    [4,2],[3,2],[3,1],[2,1],
                    [2,2],[1,1],[0,2]
                ], "honeycombBGCanvasBottom", WWW_LB_BG_IMG_URL);
            }
        });
        setTimeout(mainMenuLayoutSet(), 100);
    });
    function mainMenuLayoutSet(){
        var documentH = footer.offset().top + footerH;
        mainMenuNavContainer.height(documentH);
        bannersWrap.height(documentH);
    }

// to top click function
    totopBtn.click(function(){
        $('html,body').animate({scrollTop: 0}, 300);
    })

// ajax
    var mainContentItemsLink = $('.mainContent ul.items li a');
    mainContent = $('.mainContent');
    mainContent.append('<div id="articleContainer" />');
    singleArticleContainer = $('#articleContainer');

    mainContentItemsLink.click(function(){
        var thisHref = $(this).attr('href');
        $.ajax({
            url: thisHref + "?ajax=true",
            dataType: "html",
            cache: false,
            success: function(data, textStatus){
                singleArticleContainer.show().html(data).css({opacity : 0}).children().show();
                singleArticleContainer.animate({opacity : 1}, 600);
                $('article.single').css({minHeight : singleMinHeight});
                var singleAtricleH = $('article.single').outerHeight();
                mainContent.css({minHeight: singleAtricleH});
            },
            error: function(xhr, textStatus, errorThrown){
            // エラー処理
            }
        });
        return false;
    });

    $('article.single .close').live("click", function(){
        hideSingleArticle();
        return false;
    });

    function hideSingleArticle(){
        singleArticleContainer.fadeOut(600, function(){
            mainContent.css({minHeight: 0});
            singleArticleContainer.children().remove();
        });
    }

    $('article.single .pager a').live("click", function(){
        var thisHref = $(this).attr('href');
        var singleArticle = $('article.single');
        $.ajax({
            url: thisHref + "?ajax=true",
            dataType: "html",
            cache: false,
            success: function(data, textStatus){
                singleArticle.fadeOut(600, function(){
                    singleArticleContainer.html(data);
                    var nextArticle = $('article.single');
                    nextArticle.css({minHeight : singleMinHeight});
                    nextArticle.fadeIn(1000);
                    setTimeout(function(){
                        var singleAtricleH = nextArticle.outerHeight();
                        mainContent.css({minHeight: singleAtricleH});
                    }, 200);
                })
            },
            error: function(xhr, textStatus, errorThrown){
            }
        });
        return false;
    });


// menu hover action
    var timeout = false;
    function mainMenuTimeout(){
        timeout = setTimeout(function(){
            mainMenu.removeClass('open');
        }, 200);
    };
    mainMenu.children().hover(function(){
        if(timeout !== false){
            clearTimeout(timeout)
        }
        mainMenu.addClass('open');
    },function(){
        mainMenuTimeout();
    });

// banner hover close action
    bannersBtn.hover(function(){
        if(!banners.hasClass("show")){
            banners.addClass("show");
        }
    });
    bannersCloseBtn.click(function(){
        banners.removeClass("show");
        return false;
    });

    $("#wrapper > aside .lang").click(function(){
        $("#wrapper > aside .selectLang").slideToggle(300);
        return false;
    });

    $(document).click(function(event) {
        if(singleArticleContainer.width() > 0){
            if(!$.contains(singleArticleContainer[0], event.target)){
                hideSingleArticle();
            }
        }
        if(bannersWrap.width() > 0){
            if(!$.contains(bannersWrap[0], event.target)){
                banners.removeClass("show");
            }
        }
    });

    if(contentWrap.children('section').hasClass('top')){
        wrapper.addClass('top');
    }


});
