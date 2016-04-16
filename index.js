

var svg_container = $("#svg_container");
var curveBoundingBox = {
	left: svg_container.offset().left,
	top: svg_container.offset().top,
	width:svg_container.width(),
	height:svg_container.height()
};


//function extraBezierArg(data) {
//	var url = /\w+\((\d+(\.\d+)?), (\d+(\.\d+)?), (\d+(\.\d+)?), (\d+(\.\d+)?)\)/;
//	var result = [];
//
//	var array = data.match(url);
//
//	for (var i = 1,j=0; i < 9; i++){
//		if(array[i]){
//			if(array[i].indexOf('.')!=0) {
//				result[j] = array[i];
//				i++;
//				j++;
//			}
//		}
//	}
//	return result;
//}


$( function () {

	var bezierArgs = $('#compare').attr('bezier').split(',');

	var current = new cubic.editor.BezierEditor($("#current"), {
		hightlight: true,
		viewbox_rec: [new vec2(0, -60), new vec2(60, 60)],
		padding:60*0.4/2

	});
	var compare =  new cubic.editor.BezierEditor($("#compare"), {
		hightlight: true,
		viewbox_rec: [new vec2(0, -60), new vec2(60, 60)],
		x1:bezierArgs[0]*300,
		y1:-bezierArgs[1]*300,
		x2:bezierArgs[2]*300,
		y2:-bezierArgs[3]*300,
		padding:60*0.4/2,
	});
	var editor = new cubic.editor.BezierEditor(svg_container, {
				show_grid: true,
				viewbox_rec: [new vec2(0, -450)],
				interative: true,
  				link:[current],
  	});


	if (!localStorage.curves) {
		library.save(library.predefined);
	}

	library.curves = JSON.parse(localStorage.curves);

	library.render();


	var params = $('.param');


	function fomatFloat(src,pos){
		return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
	}

	$("#current").bind("update_cubic_function_event", function (event,values) {
		var data = sprintf("cubic-bezier(%.2f, %.2f,%.2f, %.2f)", values[0], -values[1], values[2], -values[3]);

		$(this).css({
			'transition-timing-function':data
		})
	});

	$("#values").bind('update_cubic_function_value', function (event,values) {
		//console.log(values);
		for(var i=0;i<params.length; i++) {
			params[i].textContent = fomatFloat(values[i]<0?-values[i]:values[i],2);
		}
	});


});

