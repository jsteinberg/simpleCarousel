/*
jQuery simpleCarousel Plugin
  * Version 1.0
  * 04-30-2010
  * URL: http://github.com/mdbiscan/simpleCarousel
  * Author: M.Biscan
  * requires jQuery1.4.2
  
  Copyright (c) 2010 M.Biscan

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
      $nextControl = $('<a href="#" class="simpleCarouselNext">next</a>');
      $prevControl = $('<a href="#" class="simpleCarouselPrev">prev</a>');
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
      
    updateControlTitle($currentPage);
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
  
  function updateControlTitle(currentPage) {    
    if(currentPage == $pages) {
      var nextPage = 1;
      var prevPage = $currentPage-1;
    } else if(currentPage == 1) {
      var nextPage = $currentPage+1;
      var prevPage = $pages;
    } else {
      var nextPage = currentPage+1;
      var prevPage = currentPage-1;
    }
    
    $nextControl.attr('href', nextPage);
    $prevControl.attr('href', prevPage);
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

    var that = this;
    $wrapper.filter(':not(:animated)').animate({
      scrollLeft:'+='+left
      }, 
      $animationSpeed, 
      function() {
        $currentPage = page;
        if(control != 'externalPager') {
          $(control).removeClass('active');
          updateControlTitle($currentPage);
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