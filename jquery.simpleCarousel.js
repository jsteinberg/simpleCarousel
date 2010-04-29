/*
jQuery simpleCarousel Plugin
  * Version 1.0
  * 2009-03-22 19:30:05
  * URL: http://github.com/mdbiscan/simpleCarousel
  * Description: jQuery simpleCarousel Plugin makes carousels easy
  * Author: M.Biscan
  * Copyright: Copyright (c) 2010 M.Biscan
  * Licence: dual, MIT/GPLv2
  * requires jQuery1.4.2
*/
(function($){
  $.fn.simpleCarousel = function(options) {
    $settings = $.extend({}, $.fn.simpleCarousel.defaults, options);  
    
    return this.each(function() {
      $this = $(this);
      $list = $this.find('> ul');
      $items = $list.children();
      // Generated elements for the carousel
      $wrapper = $('<div class="simpleCarouselWrapper">');
      $nextButton = $('<a href="#next" class="simpleCarouselNext">next</a>');
      $prevButton = $('<a href="#prev" class="simpleCarouselPrev">prev</a>');
      // sizes
      $currentPage = 1;
      $pages = Math.ceil($items.length/$settings.showItems);

      setup();
      bindEvents();
    });
  };
  
  // Private functions
  function setup() {
    $nextButton.appendTo($this);
    $prevButton.appendTo($this);
    
    if($settings.loop == false) {
      setControls($currentPage);
    }
    
    $wrapper
      .css({
        'overflow':'hidden',
        height:$settings.height,
        width:$settings.width*$settings.showItems
      })
      .appendTo($this);
      
    $list
      .css({
        height:$settings.height,
        width:$settings.width*$items.length
      })
      .appendTo($wrapper);
    
    $items
      .css({
        'float':'left',
        height:$settings.height,
        width:$settings.width
      });
  };
  
  function bindEvents($settings) {
    $nextButton.click(function() {
      controlContext(this, $currentPage+1);
      return false;
    });
    $prevButton.click(function() {
      controlContext(this, $currentPage-1);
      return false;
    });
  };
  
  function controlContext(control, page) {
    if(!$(control).hasClass('disabled')) {
      if(!$(control).hasClass('active')) {
        $(control).addClass('active');
        gotoPage(control, page);
      }
    }
  };
  
  function setControls(page) {        
    if(page == $pages) {
      $nextButton.addClass('disabled');
      $prevButton.removeClass('disabled');
    } else if(page == 1) {
      $nextButton.removeClass('disabled');
      $prevButton.addClass('disabled');         
    } else {
      $nextButton.removeClass('disabled');
      $prevButton.removeClass('disabled');
    }
  };
  
  function gotoPage(control, page) {
    if($settings.loop == true) {
      if(page > $pages) {
        page = 1;
      } else if(page == 0) {
        page = $pages;
      }
    } else {
      setControls(page);
    }
       
    var dir = page < $currentPage ? -1 : 1,
        n = Math.abs($currentPage - page),
        left = $settings.width*dir*$settings.showItems*n;

    $wrapper.filter(':not(:animated)').animate({
      scrollLeft:'+='+left
      }, 
      $settings.animationSpeed, 
      function() {
        $currentPage = page;
        $(control).removeClass('active');
    });
  };
  
  // Public functions
  $.fn.simpleCarousel.getHeight = function() {
    console.log($settings.height);
    return $settings.height;
  };
  $.fn.simpleCarousel.getWidth = function() {
    return $settings.width;
  };
  
  // Default values
  $.fn.simpleCarousel.defaults = {
    width:640,
    height:480,
    showItems:1,
    animationSpeed:250,
    loop:false
  };
})(jQuery);