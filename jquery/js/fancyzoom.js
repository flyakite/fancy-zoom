(function($){
$.fn.fancyzoom = function(options){

    var options = options || {},
        directory = options && options.directory ? options.directory : 'img',
        zooming = false;
    
    // init value
    options.scaleImg = options.scaleImg || true;
    options.closeOnClick = options.closeOnClick || true;
    options.showLoading = options.showLoading || true;

    if ($('#zoom').length == 0) {
        var ext = $.browser.msie ? 'gif' : 'png';
        var html = '<div id="zoom" style="display:none;"><div id="zoomcontent"></div> \
                    <div id="zoomcaption"></div> \
                    <a href="#" title="Close" id="zoomclose"> \
                    </a></div>';
                    //<img src="' + directory + '/closebox.' + ext + '" alt="Close" style="border:none; margin:0; padding:0;" /> \\

        $('body').append(html);

        $('html').click(function(e){if($(e.target).parents('#zoom:visible').length == 0) hide();});
        $(document).keyup(function(event){
            if (event.keyCode == 27 && $('#zoom:visible').length > 0) 
                hide();
        });

        $('#zoomclose').click(hide);
    }

    var $zoom = $('#zoom'),
        $zoomclose = $('#zoomclose'),
        $zoomcontent = $('#zoomcontent');

    this.each(function(i) {
        $(this).click(show);
    });

    return this;
    
    function show(e) {
        if (zooming){
            return false;
        } 
        
		zooming = true;
		var src;
	    if( e.target.targetSrc ){
	        src = options.targetSrc
	    }else{
		    src = $(this).attr('href');
	    }
	    if( e.target.caption && _){
	        console.log(e.target.caption);
	        $('#zoomcaption').html(_.escape(e.target.caption));
	    }
		var $img = $('<img />').attr('src', src),
		    $content = $('<div />').addClass('garbage').append($img),
    	    zoom_width = options.width,
		    zoom_height = options.height;
		var width   = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
    	var height  = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
    	var x = window.pageXOffset || (window.document.documentElement.scrollLeft || window.document.body.scrollLeft);
    	var y = window.pageYOffset || (window.document.documentElement.scrollTop || window.document.body.scrollTop);
    	var window_size = {'width':width, 'height':height, 'x':x, 'y':y};
        var $loading = $('<img class="zoom-loading"/>').attr('src', directory + '/loading.gif')
            .css({'top' : e.clientY + y, 'left' : e.clientX + x})
            .appendTo('body');
	    
	    $content.appendTo('body').hide()
	       .find('img').load(function(){
    
    		var width = (zoom_width || $content.width());
    		var height = (zoom_height || $content.height());
    		var d = window_size;
    		// ensure that newTop is at least 0 so it doesn't hide close button
    		var newTop = Math.max((d.height/2) - (height/2) + y, 0);
    		var newLeft = (d.width/2) - (width/2);
    		var curTop = e.pageY;
    		var curLeft = e.pageX;
            
            $('.garbage').remove();
    		$zoomclose
    	        .attr('curTop', curTop)
    		    .attr('curLeft', curLeft)
    		    .attr('scaleImg', options.scaleImg ? 'true' : 'false')
    		    .hide();
    
            $('#zoom').hide().css({
    			position : 'absolute',
    			top : curTop + 'px',
    			left : curLeft + 'px',
    			width : '1px',
    			height : '1px'
    		});
    
    
            if (options.closeOnClick) {
                $('#zoom').click(hide);
            }
    
    		if (options.scaleImg) {
        		$zoomcontent.html($content.html());
        		$('#zoomcontent img').css('width', '100%');
    		} else {
    		    $zoomcontent.html('');
    		}
        
            $('#zoom').animate({
                top         : newTop + 'px',
                left        : newLeft + 'px',
                opacity : "show",
                width     : width,
                height    : height
            }, 200, null, function() {
                if (options.scaleImg != true) {
            		$zoomcontent.html($content.html());
        		}
    			$zoomclose.show();
    			zooming = false;
            });
            $loading.remove();
        });
        return false;
    }

    function hide() {
        if (zooming) return false;
		zooming = true;
	    $('#zoom').unbind('click');
		if ($zoomclose.attr('scaleImg') != 'true') {
    		$zoomcontent.html('');
		}
		$zoomclose.hide();
		$('#zoom').animate({
            top         : $zoomclose.attr('curTop') + 'px',
            left        : $zoomclose.attr('curLeft') + 'px',
            opacity : "hide",
            width     : '1px',
            height    : '1px'
        }, 200, null, function() {
            if ($zoomclose.attr('scaleImg') == 'true') {
        		$zoomcontent.html('');
    		}
			zooming = false;
        });
        return false;
    }
}
})(jQuery);