(function($) {

    'use strict'

   

    $('.product-carousel').owlCarousel({
        loop:true,
        margin:30,
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            400:{
                items:2
            },
            576:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    //======================
    // Mobile menu 
    //======================
    $('#mobile-menu-toggler').on('click', function(e) {
        e.preventDefault();
        $('.navbar-nav').slideToggle();
    })
    $('.has-menu-child').append('<i class="menu-dropdown ti-angle-down"></i>');
    
    if ($(window).width() <= 991) {
        $('.menu-dropdown').on('click', function() {
            $(this).prev().slideToggle('slow');
            $(this).toggleClass('ti-angle-down ti-angle-up')
        })
    }
    function request_access($this){
        console.log("button clicked");
        var request_data = $this.id;
        console.log("data: " + request_data)
        $.post( "request_access",{ request_data: request_data},function(json) {
             $("#request-access").hide();
             console.log("requested access complete");
        })
    }

}) (jQuery);