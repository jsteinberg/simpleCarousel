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
(function(){
  jQuery.fn.simpleCarousel = function(options) {
    var settings = $.extend({}, { 
      width:640,
      height:480,
      showItems:1,
      animationSpeed:250,
      loop:false
    }, options);
    
    SimpleCarousel = function(carousel) {
      // elements
      this.carousel = $(carousel);
      this.wrapper = $('<div class="simpleCarouselWrapper">');
      this.list = this.carousel.find('> ul');
      this.items = this.list.children();
      // generate for this plugin
      this.nextButton = $('<a href="#next" class="simpleCarouselNext">next</a>');
      this.prevButton = $('<a href="#prev" class="simpleCarouselPrev">prev</a>');
      // sizes
      this.currentPage = 1;
      this.pages = Math.ceil(this.items.length/settings.showItems);
    };
    
    SimpleCarousel.prototype = {
      setup: function() {
        this.nextButton.appendTo(this.carousel);
        this.prevButton.appendTo(this.carousel);
        
        if(settings.loop == false) {
          this.setControls(this.currentPage);
        }
        
        this.wrapper
          .css({
            'overflow':'hidden',
            height:settings.height,
            width:settings.width*settings.showItems
          })
          .appendTo(this.carousel);
          
        this.list
          .css({
            height:settings.height,
            width:settings.width*this.items.length
          })
          .appendTo(this.wrapper);
        
        this.items
          .css({
            'float':'left',
            height:settings.height,
            width:settings.width
          });
      },
      
      bindEvents: function() {
        var that = this;
        
        this.nextButton.click(function() {
          that.controlContext(this, that.currentPage+1);
          return false;
        });
        this.prevButton.click(function() {
          that.controlContext(this, that.currentPage-1);
          return false;
        });
      },
      
      controlContext: function(control, page) {
        if(!$(control).hasClass('disabled')) {
          if(!$(control).hasClass('active')) {
            $(control).addClass('active');
            this.gotoPage(control, page);
          }
        }
      },
      
      setControls: function(page) {        
        if(page == this.pages) {
          this.nextButton.addClass('disabled');
          this.prevButton.removeClass('disabled');
        } else if(page == 1) {
          this.nextButton.removeClass('disabled');
          this.prevButton.addClass('disabled');         
        } else {
          this.nextButton.removeClass('disabled');
          this.prevButton.removeClass('disabled');
        }
      },
      
      gotoPage: function(control, page) {   
        if(settings.loop == true) {
          if(page > this.pages) {
            page = 1;
          } else if(page == 0) {
            page = this.pages;
          }
        } else {
          this.setControls(page);
        }
           
        var dir = page < this.currentPage ? -1 : 1,
            n = Math.abs(this.currentPage - page),
            left = settings.width*dir*settings.showItems*n;

        var that = this;
        this.wrapper.filter(':not(:animated)').animate({
          scrollLeft:'+='+left
          }, 
          settings.animationSpeed, 
          function() {
            that.currentPage = page;
            $(control).removeClass('active');
        });
      }
    };
    
    // jQuery Distribution
    return this.each(function() {
      var carousel = new SimpleCarousel(this);
      carousel.setup();
      carousel.bindEvents();
    });
  };
})(jQuery);