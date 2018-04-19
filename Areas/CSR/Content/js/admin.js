$(document).ready(function($){
    //alert('cart');

    // ordering carousel settting
    $(".device-list").slick({
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        arrows: false,
        slide: '.device-item',

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 390,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }

        ]

    });




    $(".moreProducts").slick({
        dots: false,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        slide: 'related-item'

    });

    setTimeout(function () {
        $(".more-devices").on('init', function () {
            $('.more-devices').fadeIn(3000);
        }).slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: false,
            arrows: false,
            slide: '.related-item',



            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 390,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }

            ]

        });

        $(".more-devices").resize();
    }, 0);


    // popover
    $('[data-toggle="popover"]').popover();

    $('[data-toggle="tooltip"]').tooltip();

    // secure section modal
    $(document).on('click', ".btn-expand", function () {
        $(this).addClass("collapsed");
        $(this).closest('.btn-expand').siblings().removeClass("collapsed");
    });


    $(document).on('hidden.bs.collapse', ".expand-content", function () {
        $('.btn-expand').removeClass("collapsed");
    });












});

















//$(function(){
//    /* the top search for index page */
//    $('.icon-search').click(function() {
//        $('.status').toggleClass('status-block');
//    });

//    var callbacks_list = $('.demo-callbacks ul');
//    $('.demo-list input').on('ifCreated ifClicked ifChanged ifChecked ifUnchecked ifDisabled ifEnabled ifDestroyed', function (event) {
//        callbacks_list.prepend('<li><span>#' + this.id + '</span> is ' + event.type.replace('if', '').toLowerCase() + '</li>');
//    }).iCheck({
//        checkboxClass: 'icheckbox_square-red',
//        radioClass: 'iradio_square-red',
//        increaseArea: '20%'
//    });
//    //$("#pinned").hide();
//    $("#icon-info").click(function () {
//        $(".pinned-normal").fadeToggle(300);
//        $(".iconinfo-bg").fadeToggle(300);
//    });
//    $(".pinned").pin({
//        containerSelector: ".container"
//    });
//    $(".pinned-normal").hide();

//    //$("#icon-info").click(function() {
//    //    $("#pinned").toggle();
//    //});
//});

//$("#pinned").hide();


//$(function () {
//    var callbacks_list = $('.demo-callbacks ul');
//    $('.demo-list input').on('ifCreated ifClicked ifChanged ifChecked ifUnchecked ifDisabled ifEnabled ifDestroyed', function (event) {
//        callbacks_list.prepend('<li><span>#' + this.id + '</span> is ' + event.type.replace('if', '').toLowerCase() + '</li>');
//    }).iCheck({
//        checkboxClass: 'icheckbox_square-red',
//        radioClass: 'iradio_square-red',
//        increaseArea: '20%'
//    });
//    //$("#pinned").hide();
//    $("#icon-info").click(function () {
//        $(".pinned-normal").fadeToggle(300);
//        $(".iconinfo-bg").fadeToggle(300);
//    });
//    $(".pinned").pin({
//        containerSelector: ".container"
//    });
//    $(".pinned-normal").hide();

//    //$("#icon-info").click(function() {
//    //    $("#pinned").toggle();
//    //});

//});

//agung meinastesi 17-09-2015
//themes, switch the css class
//$(document).ready(function () {

//        var themesone = function () {
//            $('head').append('<link rel="stylesheet" href="/Areas/CSR/Content/styles/themes/theme1.css" type="text/css" />'); //injdect css class
//        },
//            themestwo = function () {
//                $('head').append('<link rel="stylesheet" href="/Areas/CSR/Content/styles/themes/theme2.css" type="text/css" />');
//            },
//            themesthree = function () {
//                $('head').append('<link rel="stylesheet" href="/Areas/CSR/Content/styles/themes/theme3.css" type="text/css" />');
//            },
//            themesfour = function () {
//                $('head').append('<link rel="stylesheet" href="/Areas/CSR/Content/styles/themes/theme4.css" type="text/css" />');
//            }
//        ;

//        $("#theme1").click(function () {
//            localStorage.setItem('theme', 'themes1');
//            themesone();
//        });

//        $("#theme2").click(function () {
//            localStorage.setItem('theme', 'themes2');
//            themestwo();
//        });

//        $("#theme3").click(function () {
//            localStorage.setItem('theme', 'themes3');
//            themesthree();
//        });

//        $("#theme4").click(function () {
//            localStorage.setItem('theme', 'themes4');
//            themesfour();
//        });


//        if (localStorage.getItem('theme') == null) {
//            themesone();
//        } else if (localStorage.getItem('theme') == 'themes2') {
//            themestwo();
//        } else if (localStorage.getItem('theme') == 'themes3') {
//            themesthree();
//        }
//        else if (localStorage.getItem('theme') == 'themes4') {
//            themesfour();
//        }
//        else if (localStorage.getItem('theme') == 'themes1') {
//            themesone();
//        }


//    });
