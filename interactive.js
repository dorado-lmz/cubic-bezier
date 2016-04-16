
/**
 * Event handlers
 */

//export template
var template = 'div{-webkit-transition: all {timeout}s cubic-bezier({x1}, {y1}, {x2},{y2});' +
    'transition: all {timeout}s cubic-bezier({x1}, {y1}, {x2},{y2});}';

//模板函数
function substitute(str,o,regexp){
    return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
        return (o[name] === undefined) ? '' : o[name];
    });
}

//将数据填充到template
function templateToCss(bezier,timeout){
    var bezier_array = bezier.split(",");
    var data = {
       x1: bezier_array[0],
       y1: bezier_array[1],
       x2: bezier_array[2],
       y2: bezier_array[3],
       timeout:timeout
    };
    var str = substitute(template,data);
    return str;
}


 save.onclick = function() {
	 var values = [];
     var rawValues = '';
	 var params = $('.param');
	 for(var i=0;i<params.length; i++) {
		 values[i] = params[i].textContent;
         rawValues  += values[i]+','
	 }

     rawValues = rawValues.substring(0,rawValues.length-1);
 	 var name = prompt('If you want, you can give it a short name', rawValues);
	
 	if(name) {
        library.add(name, rawValues);

        library.curves[name] = rawValues;
		
 		library.save();
 	}
 };

go.onclick = function() {
	//updateDelayed();

	$("#current").toggleClass('move');
	$("#compare").toggleClass('move');
};

duration.oninput = function() {
	var val = getDuration();
	this.nextElementSibling.textContent = val + ' second' + (val == 1? '' : 's');
	$("#current").css('transition-duration', val + 's');
	//compare.style.setProperty(prefix + 'transition-duration', val + 's', null);
};


window['import'].onclick = function() {
json.value = '';

importexport.className = 'import';

json.focus();
};

window['export'].onclick = function() {
//json.value = localStorage.curves;

    var selected = $('.selected', $('#library'));
    if(selected.length == 0 ){
        alert('请选择你要导出的library');
        return;
    }
    importexport.className = 'export';
    var bezier = selected.attr('bezier');
    text = templateToCss(bezier,getDuration());
    $('#json').html(text);

    json.focus();
};

 // Close button
 importexport.elements[2].onclick = function() {
 	this.parentNode.removeAttribute('class');
	
 	return false;
 };

 importexport.onsubmit = function() {
 	if(this.className === 'import') {
 		var overwrite = !confirm('Add to current curves? Clicking “Cancel” will overwrite them with the new ones.');
		
 		try {
 			var newCurves = JSON.parse(json.value);
 		}
 		catch(e) {
 			alert('Sorry mate, this doesn’t look like valid JSON so I can’t do much with it :(');
 			return false;
 		}
		
 		if(overwrite) {
 			library.curves = newCurves;
 		}
 		else {
 			for(var name in newCurves) {
 				var i = 0, newName = name;
				
 				while(library.curves[newName]) {
 					newName += '-' + ++i;
 				}

				library.curves[newName] = newCurves[name];
 			}
 		}

		library.render();
		library.save();
 	}
	
 	this.removeAttribute('class');
 };

// /**
//  * Helper functions
//  */

 function getDuration() {
 	return (isNaN(val = Math.round(duration.value * 10) / 10)) ? null : val;
 }


