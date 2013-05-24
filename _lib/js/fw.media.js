/* ------------------------------------------------------------------------------ */
/* initSlideshows */
/* ------------------------------------------------------------------------------ */
function initSlideshows(ssCls) {		
	
	//vars
	var slideshows = { 'count' : 0, 'hasTouch' : Modernizr.touch },//prepare container obj with count
		slideshowCls = ssCls || '.slideshow',//get slideshow element class or by default
		
		//function - go through container obj to pause all slideshows
		pauseAll = function(){
			for (var i=1; i<=slideshows.count; i++) {
				slideshows['slideshow'+i].cycle('pause');
			}
		},
		
		//function - updateCaption
		updateCaption = function(nextSlide, $tgt) {
			var $src = $(nextSlide).find('img:first'),
				captionText = $.trim($src.attr('alt'));
			$tgt
				.hide()
				.text(captionText)
				.fadeIn(300);
		};
	
	//only proceed if found slideshow element
	if (!$(slideshowCls).length) return false;
	
	//going through all slideshow elements
	$.each($(slideshowCls),function(idx,ele){
		
		//vars
		var $ele = $(ele),//cache element
			$slides = $ele.find('.slide'),//cache slides
			autoplay = ($ele.attr('data-autoplay')=='1') ? true : false,//get autoplay setting
			effect = $ele.attr('data-effect') ? effect = $ele.attr('data-effect') : effect = 'fade',//get effect setting
			pauseonhover = ($ele.attr('data-pauseonhover')=='1') ? true : false,//get pauseonhover setting
			$btnToggle = $ele.find('.btnToggle'),//cache toggle button
			$caption = $ele.find('.caption'),//cache caption container
			hasCaption = $caption.length,//determine if has caption
			
			//functions - cycle plugin handlers
			onPaused = function( cont, opts, byHover ){
				//pause event callback to swap states
				!byHover && $btnToggle.removeClass('btnTogglePause').html('<span>Play</span>');
			},
			onResumed = function( cont, opts, byHover ){
				//resume event callback to swap states
				!byHover && $btnToggle.addClass('btnTogglePause').html('<span>Pause</span>');
			},
			onBefore = function( currSlide, nextSlide, opts, forwardFlag ){//onBefore transition handler
				//update caption text if has caption
				if (hasCaption) updateCaption(nextSlide, $caption);
			},
			
			//init cycle plugin
			slideshowObj = slideshows['slideshow'+(idx+1)] = $ele.cycle({//init cycle for element and save to obj 
				fx:     	effect, 
				speed:  	'slow', 
				timeout: 	6000,
				nowrap:		0,
				prev:   	$ele.find('.btnPrev'), 
				next:   	$ele.find('.btnNext'),
				pager:		$ele.find('.pager'),
				slideExpr:	$ele.find('.slide'),
				before:		onBefore,
				paused: 	onPaused,
				resumed:	onResumed
			});		
		
		//pause/play slideshow based on autoplay, play from 1st slide
		slideshowObj.cycle(autoplay ? 'resume' : 'pause', false);
		
		//add to slideshow count
		slideshows.count++;
		
		//toggle button behaviors
		$btnToggle.click(function(e) {
			e.preventDefault();
			var paused = slideshowObj.is(':paused');//get slideshow pause state
			//if (paused) pauseAll();//pause all slideshows if click to play, disabled now with autoplay setting
			slideshowObj.cycle(paused ? 'resume' : 'pause', true);//play/pause slideshow, play from next slide after pause
		})
		
		//pause on hover
		if ( !slideshows.hasTouch && autoplay && pauseonhover ) {
			$ele.hover( function(e){
				slideshowObj.cycle('pause', true);
			}, function(e){
				slideshowObj.cycle('resume');
			} );	
		}
		
		//bind events for touch devices
		if ( slideshows.hasTouch && typeof($.fn.touchSwipe) == 'function' ) {
			/*using jquery mobile touch*/
			$ele.touchSwipe(function(dir) {
				if ( dir == 'left' ) 		{slideshowObj.cycle('next'); }
				else if ( dir == 'right' ) 	{slideshowObj.cycle('prev'); }
			});
		}
		
	});
	
	//return container obj
	return slideshows;

}
