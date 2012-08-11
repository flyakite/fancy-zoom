(function($){
$.fn.fancyzoom = function(options){

    var options     = options || {};
    var directory = options && options.directory ? options.directory : 'images';
    var zooming     = false;

    if ($('#zoom').length == 0) {
        var ext = $.browser.msie ? 'gif' : 'png';
        var html = '<div id="zoom" style="display:none;"><div id="zoom_content"></div> \
                    <a href="#" title="Close" id="zoom_close"> \
                    </a></div>';
                    //<img src="' + directory + '/closebox.' + ext + '" alt="Close" style="border:none; margin:0; padding:0;" /> \\

        $('body').append(html);

        $('html').click(function(e){if($(e.target).parents('#zoom:visible').length == 0) hide();});
        $(document).keyup(function(event){
                if (event.keyCode == 27 && $('#zoom:visible').length > 0) hide();
        });

        $('#zoom_close').click(hide);
    }

    var zoom = $('#zoom'),
        zoom_close = $('#zoom_close'),
        zoom_content = $('#zoom_content');

    this.each(function(i) {
        $($(this).attr('href')).hide();
        $(this).click(show);
    });

    return this;

    function show(e) {
        if (zooming) return false;
		zooming                 = true;
		var content_div = $($(this).attr('href'));
    	var zoom_width    = options.width;
		var zoom_height = options.height;

		var width             = window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth);
    	var height            = window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight);
    	var x                     = window.pageXOffset || (window.document.documentElement.scrollLeft || window.document.body.scrollLeft);
    	var y                     = window.pageYOffset || (window.document.documentElement.scrollTop || window.document.body.scrollTop);
    	var window_size = {'width':width, 'height':height, 'x':x, 'y':y}

		var width                            = (zoom_width || content_div.width());
		var height                         = (zoom_height || content_div.height());
		var d                                    = window_size;

		// ensure that newTop is at least 0 so it doesn't hide close button
		var newTop                         = Math.max((d.height/2) - (height/2) + y, 0);
		var newLeft                        = (d.width/2) - (width/2);
		var curTop                         = e.pageY;
		var curLeft                        = e.pageX;

		zoom_close.attr('curTop', curTop);
		zoom_close.attr('curLeft', curLeft);
		zoom_close.attr('scaleImg', options.scaleImg ? 'true' : 'false');

        $('#zoom').hide().css({
			position	: 'absolute',
			top				: curTop + 'px',
			left			: curLeft + 'px',
			width         : '1px',
			height        : '1px'
		});

        zoom_close.hide();

        if (options.closeOnClick) {
            $('#zoom').click(hide);
        }

		if (options.scaleImg) {
    		zoom_content.html(content_div.show());
    		$('#zoom_content img').css('width', '100%');
		} else {
		    zoom_content.html('');
		}

        $('#zoom').animate({
            top         : newTop + 'px',
            left        : newLeft + 'px',
            opacity : "show",
            width     : width,
            height    : height
        }, 500, null, function() {
            if (options.scaleImg != true) {
        		zoom_content.html(content_div.show());
    		}
			zoom_close.show();
			zooming = false;
        })
        return false;
    }

    function hide() {
        if (zooming) return false;
		zooming                 = true;
	    $('#zoom').unbind('click');
		if (zoom_close.attr('scaleImg') != 'true') {
    		zoom_content.html('');
		}
		zoom_close.hide();
		$('#zoom').animate({
            top         : zoom_close.attr('curTop') + 'px',
            left        : zoom_close.attr('curLeft') + 'px',
            opacity : "hide",
            width     : '1px',
            height    : '1px'
        }, 500, null, function() {
            if (zoom_close.attr('scaleImg') == 'true') {
        		zoom_content.html('');
    		}
			zooming = false;
        });
        return false;
    }
}
})(jQuery);