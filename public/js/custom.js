
 /* jQuery Pre loader
  -----------------------------------------------*/
// $(window).load(function(){
//     $('.preloader').fadeOut(1000); // set duration in brackets    
// });


/* Istope Portfolio
-----------------------------------------------*/
// jQuery(document).ready(function($){

//   if ( $('.iso-box-wrapper').length > 0 ) { 

//       var $container  = $('.iso-box-wrapper'), 
//         $imgs     = $('.iso-box img');

//       $container.imagesLoaded(function () {

//         $container.isotope({
//         layoutMode: 'fitRows',
//         itemSelector: '.iso-box'
//         });

//         $imgs.load(function(){
//           $container.isotope('reLayout');
//         })

//       });

//       //filter items on button click

//       $('.filter-wrapper li a').click(function(){

//           var $this = $(this), filterValue = $this.attr('data-filter');

//       $container.isotope({ 
//         filter: filterValue,
//         animationOptions: { 
//             duration: 750, 
//             easing: 'linear', 
//             queue: false, 
//         }                
//       });             

//       // don't proceed if already selected 

//       if ( $this.hasClass('selected') ) { 
//         return false; 
//       }

//       var filter_wrapper = $this.closest('.filter-wrapper');
//       filter_wrapper.find('.selected').removeClass('selected');
//       $this.addClass('selected');

//         return false;
//       }); 

//   }

// });


// /* Mobile Navigation
//     -----------------------------------------------*/
// $(window).scroll(function() {
//     if ($(".navbar").offset().top > 50) {
//         $(".navbar-fixed-top").addClass("top-nav-collapse");
//     } else {
//         $(".navbar-fixed-top").removeClass("top-nav-collapse");
//     }
// });


/* HTML document is loaded. DOM is ready. 
-------------------------------------------*/
$(document).ready(function() {

  /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });


  /*  smoothscroll
  ----------------------------------------------*/
   $(function() {
        $('.custom-navbar a, #home a').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 49
            }, 1000);
            event.preventDefault();
        });
    });


  /* Home slider section
  -----------------------------------------------*/
  $(function(){
    jQuery(document).ready(function() {
    $('#home').backstretch([
       "../img/home-bg-slider-img1.jpg", 
       "../img/home-bg-slider-img2.jpg",
        ],  {duration: 2000, fade: 750});
    });
  });


 /* Parallax section
    -----------------------------------------------*/
  function initParallax() {
    $('#home').parallax("100%", 0.1);
    $('#about').parallax("100%", 0.3);
    $('#counter').parallax("100%", 0.2);
    $('#team').parallax("100%", 0.3);
    $('#charity').parallax("100%", 0.1);
    $('#howtoplay').parallax("100%", 0.3);
    $('#portolio').parallax("100%", 0.1);
    $('#warning').parallax("100%", 0.2);

  }
  initParallax();


  /* Nivo lightbox
    -----------------------------------------------*/
  $('#portfolio .col-md-4 a').nivoLightbox({
        effect: 'fadeScale',
    });


  /* Counter
    -----------------------------------------------*/
  jQuery('.counter-item').appear(function() {
    jQuery('.counter-number').countTo();
    jQuery(this).addClass('funcionando');
    console.log('funcionando');
  });


  /* Back top
  -----------------------------------------------*/
  $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
        $('.go-top').fadeIn(200);
        } else {
          $('.go-top').fadeOut(200);
        }
        });   
        // Animate the scroll to top
      $('.go-top').click(function(event) {
        event.preventDefault();
      $('html, body').animate({scrollTop: 0}, 300);
    });


  /* wow
  -------------------------------*/
  new WOW({ mobile: false }).init();

  });

