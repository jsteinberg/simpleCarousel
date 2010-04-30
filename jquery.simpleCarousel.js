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
    var settings = $.extend({}, $.fn.simpleCarousel.defaults, options);  
    
    return this.each(function() {
      $this = $(this);
      $list = $this.children();
      $items = $list.children();
      // Generated elements for the carousel
      $wrapper = $('<div class="simpleCarouselWrapper">');
      $nextControl = $('<a href="#next" class="simpleCarouselNext">next</a>');
      $prevControl = $('<a href="#prev" class="simpleCarouselPrev">prev</a>');
      // settings
      $width = settings.width;
      $height = settings.height;
      $showItems = settings.showItems;
      $animationSpeed = settings.animationSpeed;
      $loop = settings.loop;
      // sizes
      $currentPage = 1;
      $pages = Math.ceil($items.length/$showItems);
      setup();
      bindEvents();
    });
  };
  
  // Private functions
  function setup() {
    $nextControl.appendTo($this);
    $prevControl.appendTo($this);
    $wrapper.scrollLeft(0);

    if($loop == false) {
      setControls($currentPage);
    }
    $wrapper
      .css({
        'overflow':'hidden',
        height:$height,
        width:$width*$showItems
      })
      .appendTo($this);
      
    $list
      .css({
        height:$height,
        width:$width*$items.length
      })
      .appendTo($wrapper);
    
    $items
      .css({
        'display':'block',
        'float':'left',
        height:$height,
        width:$width
      });
  };
  
  function bindEvents() {
    $nextControl.click(function() {
      controlContext(this, $currentPage+1);
      return false;
    });
    $prevControl.click(function() {
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
      $nextControl.addClass('disabled');
      $prevControl.removeClass('disabled');
    } else if(page == 1) {
      $nextControl.removeClass('disabled');
      $prevControl.addClass('disabled');         
    } else {
      $nextControl.removeClass('disabled');
      $prevControl.removeClass('disabled');
    }
  };
  
  function gotoPage(control, page) {
    if($loop == true) {
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
        left = $width*dir*$showItems*n;

    $wrapper.filter(':not(:animated)').animate({
      scrollLeft:'+='+left
      }, 
      $animationSpeed, 
      function() {
        $currentPage = page;
        if(control != 'externalPager') {
          $(control).removeClass('active');
        }
    });
  };
  
  // Public functions
  $.fn.simpleCarousel.externalPager = function(page) {
    gotoPage('externalPager', page);
  };
  $.fn.simpleCarousel.getDimensions = function() {
    return {width: $width, height: $height};
  };
  $.fn.simpleCarousel.getControls = function() {
    return {next: $nextControl, prev: $prevControl};
  };
  
  // Default values
  $.fn.simpleCarousel.defaults = {
    width:'auto',
    height:'auto',
    showItems:1,
    animationSpeed:250,
    loop:false
  };
})(jQuery);