/* ------------------------------------------------------------------------------ */
/* initNav */
/* ------------------------------------------------------------------------------ */
function initNav() {
	
	//vars
	var $navItems = $('#navItems').find('.navItem'),
		hasTouch = Modernizr.touch;
	
	//process
	$.each($navItems, function(idx,ele){
		
		//vars
		var $ele = $(ele),
			$sepLeft = $ele.prev('.sep'),
			$sepRight = $ele.next('.sep'),
			$sepBgLeft = $sepLeft.find('.bg'),
			$sepBgRight = $sepRight.find('.bg'),
			//functions
			onHover = function(){
				if ( $sepLeft.length ) $sepLeft.addClass('left');
				if ( $sepRight.length ) $sepRight.addClass('right');
			},
			onHoverOff = function(){
				if ( $sepLeft.length ) $sepLeft.removeClass('left');
				if ( $sepRight.length ) $sepRight.removeClass('right');	
			};
		
		//attach behaviors to events
		if (!hasTouch && !$ele.hasClass('selected')) $ele.hover(onHover, onHoverOff);
		
		//init onHover for selected
		if ($ele.hasClass('selected')) {
			onHover();
		}
		
	});
	
}
/* ------------------------------------------------------------------------------ */
/* initBanner */
/* ------------------------------------------------------------------------------ */
function initBanner() {
	//vars
	var $banner = $('#banner'),
		$heading = $banner.find('.headingBox'),
		animOptsOut = { opacity:0 },
		animOptsIn = { opacity:1 },
		hasTouch = Modernizr.touch,
		delay = 3000,
		speed = 3000,
		//functions
		onHover = function(){
			$heading.animate(animOptsIn, speed/2);
		},
		onHoverOff = function(){
			$heading.animate(animOptsOut, speed/2);
		},
		initInteraction = function(){
			if (hasTouch) {
				$banner.toggle( onHover, onHoverOff );
			} else {
				$.fn.hoverIntent ? $banner.hoverIntent( onHover, onHoverOff ) : $banner.hover( onHover, onHoverOff );
			}
		};
	//init
	$heading.delay(delay).animate(animOptsOut, speed, initInteraction);
}
/* ------------------------------------------------------------------------------ */
/* initFocus */
/* ------------------------------------------------------------------------------ */
function initFocus() {
	
	//exit if no focus
	if (!$('#focus').length || !$('#intro').length) return false;
	
	//vars
	var $window = $(window),
		$header = $('#header'), 
		$focus = $('#focus'),
		$slideshow = $focus.find('.slideshow'),
		$slides = $slideshow.find('.slide'),
		$intro = $('#intro'),
			
		winH, winW, winHeightLimit = 1200,
		focusW, focusH, focusAR, focusHeightLimit = 350,
		slideW, slideH, slideAR = 1536/725,
		
		//getWindowInfo
		getWindowInfo = function(){
			winW = $window.innerWidth();
			winH = $window.innerHeight();
		},
		//getSlideInfo
		getSlideInfo = function(){
			slideW = $slides.width();
			slideH = $slides.height();
			if ( slideW == 0 ) slideW = Math.round(focusH * slideAR);
			if ( slideH == 0 ) slideH = Math.round(winW / slideAR);
		},
		//updateSlides
		updateSlides = function(){
			//get slide info
			getSlideInfo();
			//compare slide and container AR and update size and pos
			if ( focusAR > slideAR ) {
				//size
				$slides.removeClass('resizeByHeight');
				$slides.addClass('resizeByWidth');
				//pos
				//console.log('slideH:'+slideH, 'focusH:'+focusH);
				getSlideInfo();
				$slides.css( 'margin-left', 0 );
				$slides.css( 'margin-top', -1 * Math.abs((slideH - focusH)/2) );
				//console.log('byW', slideH - focusH);
			} else {
				//size
				$slides.removeClass('resizeByWidth');
				$slides.addClass('resizeByHeight');	
				//pos
				//console.log('slideW:'+slideW, 'focusW:'+focusW);
				getSlideInfo();
				$slides.css( 'margin-top', 0 );
				$slides.css( 'margin-left', -1 * Math.abs((slideW - focusW)/2) );
				//console.log('byH', slideW - focusW);
			}	
		},
		//updateFocus
		updateFocus = function(){
			//get focus info
			focusW = $focus.width();
			focusH = winH - $intro.outerHeight() - $header.outerHeight();
			console.log(winH, $intro.height(), $header.height());
			if (focusH < focusHeightLimit) focusH = focusHeightLimit;
			focusAR = focusW/focusH;
			//apply updated height to make focus in first fold
			$focus.height(focusH);
			//apply updates to slides
			updateSlides();
		};
	
	//update all
	function update(){
				
		//get curremt window info
		getWindowInfo();
		
		//apply window height limit
		if (winH > winHeightLimit) {
			winH = winHeightLimit;	
		}
		
		//update focus if current 
		updateFocus();
		
	}
	
	//init focus
	function init(){
		//first update
		update();
		//update on later resize
		$window.on('resize', update);
	}
	
	//kick-off
	init();
	
}
/* ------------------------------------------------------------------------------ */
/* initGallery */
/* ------------------------------------------------------------------------------ */
function initGallery(){
	
	//vars
	var $galleries = $('.gallery'),
		settings = { 
			margin		: [50,30,30,30],
			padding		: 10,
			loop		: false,
			openEffect	: 'fade',
			closeEffect	: 'fade',
			prevEffect 	: 'fade',
			nextEffect 	: 'fade',
			beforeShow	: function(){ 
							this.title = ('<span class="txtNormal">Image ' + (this.index + 1) + ' of ' + this.group.length) + '</span><br/>' + (this.title ? this.title : ''); 
						  },
			tpl			: {
							closeBtn :'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><span class="label">Close</span><i class="icon icon-remove"></i></a>',
							next     :'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span><i class="icon icon-angle-right"></i></a>',
							prev     :'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span><i class="icon icon-angle-left"></i></a>'
						  }
		};
	
	//exit if no instance found
	if (!$galleries.length) return false;
	
	//get gallery data
	function getGalleryData($tgt){
		//vars
		var data = [],
			$imgs = $tgt.find('img');
		//collect each image data
		$.each($imgs, function(idx,ele){
			var $img = $(ele);
			data.push({ 
				href:$img.attr('src'),
				title:$img.attr('alt')
			});
		});
		//return for launch function
		return data;
	}
	
	//process gallery instacne
	$.each($galleries, function(idx,ele){
		//vars
		var $gallery = $(ele),
			galleryData = getGalleryData($gallery), //get data
			$btnTrigger = $gallery.prev('.btnSlideshow'); //get trigger button
		//attach fancybox trigger to button
		$btnTrigger.on('click', function(e){
			e.preventDefault();
			$.fancybox.open(galleryData, settings); //launch fancybox with data
		});
	});
	
}
/* ------------------------------------------------------------------------------ */
/* initPastEvents */
/* ------------------------------------------------------------------------------ */
function initPastEvents(){
	
	//vars
	var $pastevents = $('#pastevents'),
		$btnEvents = $pastevents.find('.btnEvent'),
		$btnConcerts = $('#btnConcerts'),
		settings = { 
			type		: 'ajax',
			width		: '70%',
			height		: '70%',
			maxWidth	: 820,
			maxHeight	: 1200,
			autoSize	: false,
			fitToView	: false,
			openEffect	: 'fade',
			closeEffect	: 'fade',
			prevEffect 	: 'fade',
			nextEffect 	: 'fade',
			margin		: [50,30,30,30],
			padding		: 10,
			tpl			: {	closeBtn :'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"><span class="label">Close</span><i class="icon icon-remove"></i></a>' }
		};
	
	//exit if no instance found
	if (!$pastevents.length || !$btnEvents.length) return false;
	
	//attach fancybox
	$btnEvents.fancybox(settings);
	$btnConcerts.fancybox(settings);
	
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var Slideshows;
function init(){
	
	//layout assistance
	insertFirstLastChild('#navItems');
	
	//interaction
	initNav();
	
	//media
	Slideshows = initSlideshows();
	
	//template specific functions
	if ( $('body#home').length ) {
		initHome();
	} else {
		//initBanner
		initBanner();
		//form
		initSelectBox();
		initDatepicker();
		//$('input, textarea').placeholder();
		//initGallery
		initGallery();
		//events
		if ($('body#concerts').length) initPastEvents();		
		//maps
		if ($('body#contact').length) {
			initMaps({
				target:		'map',
				lat:		-32.559721,
				lng:		151.180498,
				title:		'The Convent of Mercy Singleton',
				info:		'<div id="mapInfoWindowContent"><h3>The CONVENT of MERCY SINGLETON</h3><p>30 Queen Street, Singleton NSW Australia,<br/>in the heart of the Hunter Valley</p></div>',
				infoWidth:	400,
				center:		{ lat:-32.55815973263073, lng:151.18049799999994 }
			});
		}
	}

	//css3pie rendering
	initCSS3PIE();
	
	//debug
	displayDebugInfo('#debugInfo');
	
}
function initHome(){
	initFocus();
}
/* DOM.ready */
$(document).ready(function(){ 
	Platform.addDOMClass();
	init();	
});
