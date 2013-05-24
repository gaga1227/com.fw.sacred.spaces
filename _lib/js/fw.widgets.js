/* ------------------------------------------------------------------------------ */
/* initSelectBox */
/* ------------------------------------------------------------------------------ */
function initSelectBox(cls) {
		
	//vars
	var selectCls = cls || '.selectBox',
		$selectBoxes = $(selectCls),
		iconOpenCls = 'icon icon-angle-up',
		iconCloseCls = 'icon icon-angle-down';
		
	//exit if no instance found
	if ( !$selectBoxes.length ) return false;
	
	//function - initCal
	function initSelect(idx, ele) {
		
		//vars
		var $select = $(ele),
			settings = { 
				menuTransition:	'slide',	//[default,slide,fade] - the show/hide transition for dropdown menus
				menuSpeed:		'fast',		//[slow,normal,fast] - the show/hide transition speed
				loopOptions:	true		//[boolean] - flag to allow arrow keys to loop through options
			},
			toggleIcon = function(isOpen) {
				var $dropdown = $( $select.selectBox('control') ),
					$btn = $dropdown.find('.selectBox-arrow');
				if ( isOpen ) { 
					$btn.removeClass(iconCloseCls);
					$btn.addClass(iconOpenCls); 
				} else {
					$btn.removeClass(iconOpenCls); 
					$btn.addClass(iconCloseCls); 
				}
			};
		
		//init plugin
		$select
			.selectBox(settings)
			.bind({
				'open': 	function() { toggleIcon( true ); },
				'close':	function() { toggleIcon( false ); }
			});
			
		//add initial icon
		toggleIcon( false );
											
	}
	
	//loop through and process each instance
	$.each( $selectBoxes, initSelect );
	
}
/* ------------------------------------------------------------------------------ */
/* initDatepicker */
/* ------------------------------------------------------------------------------ */
function initDatepicker(){
	
	//vars
	var $datepickers = $('.datepicker'),
		datepickerObj = { count:0 },
		format = 'dd-mm-yy';
	
	//exit if no instance
	if ( !$datepickers.length ) return false;
	
	//process instances
	$.each($datepickers, function(idx,ele){
		
		//cache elems
		var $ele = $(ele),
			$btnTrigger = $ele.next('.btnDatepicker');
		
		//init jqui
		$ele.attr('readonly', 'true');
		datepickerObj['datepicker' + (idx+1)] = $ele.datepicker({
			dateFormat: 	format,
			numberOfMonths: 1,
			onSelect: 		function( selectedDate ) {},
			beforeShow: 	function(input, inst) {}
		});
		
		//add to window obj
		datepickerObj.count++;
		
		//bind trigger btn
		$btnTrigger.on('click', function(e){
			e.preventDefault();
			$ele.datepicker('show').focus();
		});
		
	});	
	
	return datepickerObj;
		
}
/* ------------------------------------------------------------------------------ */
/* initMaps */
/* ------------------------------------------------------------------------------ */
function initMaps(opts){
	
	//exit if no address
	if (!opts.lat || !opts.lng) return false;
	
	//init maps
	function init() {
		//vars
		var mapOptions = {
				zoom: opts.zoom || 16,
				center: new google.maps.LatLng(opts.lat, opts.lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			},
			map = new google.maps.Map(document.getElementById(opts.target), mapOptions),
			marker = new google.maps.Marker({
				map: 		map,
				position: 	map.getCenter(),
				title: 		opts.title || ''
				//animation: 	google.maps.Animation.DROP,
			}),
			infowindow = new google.maps.InfoWindow({
				content: 	opts.info || '',
				maxWidth: 	opts.infoWidth || 300
			}),
			latlng = new google.maps.LatLng(opts.lat,opts.lng),
			centerLatLng = new google.maps.LatLng(opts.center.lat,opts.center.lng);
		
		//infowindow
		if (opts.info) {
			infowindow.open(map, marker);
			map.setCenter(centerLatLng);
		}
		
		//events
		google.maps.event.addListener(map, 'center_changed', function() {
			// 3 seconds after the center of the map has changed, pan back to the
			// marker.
			/*
			window.setTimeout(function() {
				map.panTo(marker.getPosition());
			}, 3000);
			*/
		});
		google.maps.event.addListener(marker, 'click', function() {
			if (opts.info) infowindow.open(map, marker);
		});
		google.maps.event.addDomListener(window, 'resize', function() {
			if (opts.info) map.panTo(centerLatLng);
			else map.panTo(latlng);
		});
	}
	
	//init
	init();
}
