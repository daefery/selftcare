$(function () {
    $("#scrollAble").niceScroll({ cursorcolor: "#7A014E" });


    // Header on scroll
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.main-header.selfcare').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('.main-header.selfcare').removeClass('sticky-down').addClass('sticky-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('.main-header.selfcare').removeClass('sticky-up').addClass('sticky-down');
            }
        }

        lastScrollTop = st;
    }



});