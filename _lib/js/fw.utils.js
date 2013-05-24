/* ------------------------------------------------------------------------------ */
/* common - debug - Avoid 'console' errors in browsers that lack a console. */
/* ------------------------------------------------------------------------------ */
(function() {
    var method,
		methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeStamp', 'trace', 'warn'
   		],
    	length = methods.length,
    	console = (window.console = window.console || {}),
		noop = function () {};
	
    while (length--) {
        method = methods[length];
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
/* ------------------------------------------------------------------------------ */
/* common - debug - displayDebugInfo */
/* ------------------------------------------------------------------------------ */
function displayDebugInfo(debug){
	
	//vars
	var $debug = $(debug),
		$html = $('html'),
		on = '',
		toggle = function() {
			if ( on == 'true' ) {
				$debug.css('opacity', '1');
				$html.addClass('debug');	
			} else {
				$debug.css('opacity', '0');
				$html.removeClass('debug');
			}
		},
		update = function(){
			$debug.attr('data-width',$(window).width());
			on = $debug.attr('data-on');
			toggle();
		};
	
	//init and bind event
	$debug.on('click', function(e){
		e.preventDefault();
		var state = '';
		( on == 'true' ) ? state = 'false' : state = 'true';
		$debug.attr('data-on', state);
		update();
	});
	
	//init
	update();
	$(window).bind('resize', update);
		
}
/* ------------------------------------------------------------------------------ */
/* common - get Platform */
/* ------------------------------------------------------------------------------ */
var Platform = new function(){
	//detecting functions
	function checkPlatform(os) { return (navigator.userAgent.toLowerCase().indexOf(os.toLowerCase())>=0); }
	function checkEvent(e) { return (e in document.documentElement); }
	//add properties
	this.iPhone = checkPlatform('iPhone');
	this.iPad = checkPlatform('iPad');
	this.iPod = checkPlatform('iPod');
	this.iOS = this.iPhone||this.iPad||this.iPod;
	this.android = checkPlatform('android');
	this.touchOS = checkEvent('ontouchstart');
	this.addDOMClass = function(){
		var $html = $('html'),
			cls = '';
		if ( this.iPhone )	cls = 'iPhone';
		if ( this.iPad )	cls = 'iPad';
		if ( this.iPod )	cls = 'iPod';
		if ( this.iOS )		cls = 'iOS';
		if ( this.android )	cls = 'android';
		$html.addClass(cls);
	}
	this.debugLog = function(){
		console.log('iPhone: '+this.iPhone);
		console.log('iPad: '+this.iPad);
		console.log('iPod: '+this.iPod);
		console.log('iOS: '+this.iOS);
		console.log('android: '+this.android);
		console.log('touchOS: '+this.touchOS);
	}
	//css3 transition end event
	this.transEndEventNames = {
		'WebkitTransition' : 'webkitTransitionEnd',
		'MozTransition'    : 'transitionend',
		'OTransition'      : 'oTransitionEnd',
		'msTransition'     : 'MSTransitionEnd',
		'transition'       : 'transitionend'
	}
	this.transEndEventName = this.transEndEventNames[ Modernizr.prefixed('transition') ];
	
	//return self
	return this;
}
/* ------------------------------------------------------------------------------ */
/* common - mqStates */
/* ------------------------------------------------------------------------------ */
var mqStates = {
	max1200:'only screen and (max-width:1200px)',
	max980:	'only screen and (max-width:980px)',
	max960:	'only screen and (max-width:960px)',
	max800:	'only screen and (max-width:800px)',
	max640:	'only screen and (max-width:640px)',
	max500:	'only screen and (max-width:500px)',
	max400:	'only screen and (max-width:400px)',
	max320:	'only screen and (max-width:320px)'
}
/* ------------------------------------------------------------------------------ */
/* common - matchMQStates */
/* ------------------------------------------------------------------------------ */
function matchMQStates(mqState) {
	//exit if requested mq state is not available
	if ( !mqStates[mqState] || !Modernizr._version ) return;
	
	//vars
	var mq = Modernizr.mediaqueries,
		mqMax = (mqState.indexOf('max') != -1) ? true : false,
		mqMin = (mqState.indexOf('min') != -1) ? true : false,
		mqNum, mqResult;
		
	//get mqNum for IE
	if ( mqMax ) mqNum = parseInt(mqState.replace('max',''),10);
	if ( mqMin ) mqNum = parseInt(mqState.replace('min',''),10);
	
	//check mq
	if ( !mq ) {
		if (mqMax) {
			mqResult = ( $(window).innerWidth() <= mqNum ) ? true : false;
		} else if (mqMin) {
			mqResult = ( $(window).innerWidth() >= mqNum ) ? true : false;
		}
	} else {
		mqResult = Modernizr.mq(mqStates[mqState]);
	}
	
	//return mq
	return mqResult;
}
/* ------------------------------------------------------------------------------ */
/* common - insert First and Last Child */
/* ------------------------------------------------------------------------------ */
function insertFirstLastChild(selection) {
	var $tgts = $(selection);//cache selection
	if (!$tgts.length) return false;//cancel if no target found
	$.each($tgts,function(idx,ele){//go through all selected items
		var $ele = $(ele),//cache current item
			$fstChild = $ele.find('> :first-child'),//find and cache first-child
			$lstChild = $ele.find('> :last-child');//find and cache last-child
		//add class if not already
		if (!$fstChild.hasClass('first-child')) { $fstChild.addClass('first-child'); }
		if (!$lstChild.hasClass('last-child')) { $lstChild.addClass('last-child'); }
	});	
}
/* ------------------------------------------------------------------------------ */
/* common - initCSS3PIE */
/* ------------------------------------------------------------------------------ */
function initCSS3PIE() {
	var oldIE = $('html').hasClass('oldie'),
		triggerCLS = 'css3pie';
	if ( oldIE && window.PIE ) {
		$.each( $('.' + triggerCLS), function(idx, ele){
			PIE.attach(ele);
		});
	} else {
		return false;	
	}
}
/* ------------------------------------------------------------------------------ */
/* common - cssAnim (working specifically with animate.css) */
/* ------------------------------------------------------------------------------ */
function cssAnim(target,anim) {
	if ( !Modernizr.cssanimations || !target.length || !anim ) return false;
	var $target = target,
		animCls = anim,
		scopeCls = 'animated',
		cleanTarget = function(){ $target.removeClass(scopeCls).removeClass(animCls); },
		updateTarget = function(){ cleanTarget(); $target.addClass(scopeCls).addClass(animCls); },
		delay;
	updateTarget();
	delay = window.setTimeout( function(){ cleanTarget() }, 1300 );
}
/* ------------------------------------------------------------------------------ */
/* common - initBtnScroll */
/* ------------------------------------------------------------------------------ */
function initBtnScroll( cls ) {
	//vars
	var btnScrollsCls = cls || '.btnScroll',
		$btnScrolls = $(btnScrollsCls),
		defaultTarget = '#container',
		defaultSpeed = 1000;
	
	//exit if no btnScrolls or scrollTo not loaded
	if ( !$btnScrolls.length || !$().scrollTo ) return false;
	
	//process each btnScrolls instance
	$.each($btnScrolls, function(idx,ele){
		//vars
		var $ele = $(ele);
		//attach behavior to instance
		$ele.on('click',function(e){
			e.preventDefault();
			var target = $ele.attr('data-target') || defaultTarget,
				speed = Number($ele.attr('data-speed') || defaultSpeed);
			console.log(target, speed);
			$.scrollTo( $(target), speed, {axis:'y'} );
		});
	});	
}