/**
 * Created by lmz on 16/4/14.
 */


var library = self = (function() {

    var library = $("#library");

    return {
        curves: {},
        predefined: {
            'ease': '.25,.1,.25,1',
            'linear': '0,0,1,1',
            'ease-in': '.42,0,1,1',
            'ease-out': '0,0,.58,1',
            'ease-in-out':'.42,0,.58,1'
        },

        render: function() {
            var items = $('a',library );

            for(var i=items.length; i--;) {
                items[i].remove();
            }

            for (var name in self.curves) {
                try { var bezier = self.curves[name]; }
                catch(e) { continue; }

                self.add(name, bezier);
            }
        },

        rename: function (name) {

            if(name.indexOf(",")==-1){
                return name;
            }else{
                return "id"+parseInt(1000*Math.random());
            }
        },

        add: function (name, bezier) {
            name = self.rename(name);
            var svg = $(cubic.util.svg('svg')).attr({
                    width:100,
                    height:100
                }),
                a = $('<a>').attr({
                    bezier: bezier
                });
            svg.append($(cubic.util.svg('g')).attr('id','grid'));
            a.insertBefore($('#importexport', library));
            a.attr('id',name);

            a.append(svg);

            a.append($('<span>').attr({
                title: name
            }).html(name));

            a.append($('<button>').attr({

                title: 'Remove from library',

            }).html('x').click(function(evt){
                    evt.stopPropagation();

                    if (confirm('Are you sure you want to delete this? There is no going back!')) {
                        self.deleteItem($(this).parent());
                    }
                    return false;
            }));

            var ease_data = bezier.split(',');
            new cubic.editor.BezierEditor($("#"+name), {
                viewbox_rec: [new vec2(0, -100), new vec2(100, 100)],
                x1:ease_data[0]*300,
                y1:-ease_data[1]*300,
                x2:ease_data[2]*300,
                y2:-ease_data[3]*300,
                padding:100*0.4/2,
            });

            //a.bezierCanvas.plot(self.thumbnailStyle);

            a.click(function(){
                self.selectThumbnail($(this));
            });


        },

        selectThumbnail: function(a) {
            var selected = $('.selected', a.parent());
            var bezierArgs = a.attr('bezier').split(',');


            if (selected) {
                selected.removeClass('selected');
            }

            a.addClass('selected');

            $('g',$("#compare")).empty();

            new cubic.editor.BezierEditor($("#compare"), {
                hightlight: '#f08',
                viewbox_rec: [new vec2(0, -60), new vec2(60, 60)],
                x1:bezierArgs[0]*300,
                y1:-bezierArgs[1]*300,
                x2:bezierArgs[2]*300,
                y2:-bezierArgs[3]*300,
                padding:60*0.4/2,
            });


            var data = sprintf("cubic-bezier(%.2f, %.2f,%.2f, %.2f)", bezierArgs[0], bezierArgs[1], bezierArgs[2], bezierArgs[3]);

            $("#compare").css({
                'transition-timing-function':data
            })
            //compare.style.cssText = this.style.cssText;
            //
            //compare.style.setProperty(prefix + 'transition-duration', getDuration() + 's', null);
            //
            //compareCanvas.bezier = this.bezier;
            //
            //compareCanvas.plot({
            //    handleColor: 'rgba(255,255,255,.5)',
            //    bezierColor: 'white',
            //    handleThickness: .03,
            //    bezierThickness: .06
            //});
        },

        deleteItem: function(a) {
            var name = $('span', a).html();

            delete self.curves[name];

            self.save();

            a.remove();

            if (a.hasClass('selected')) {
                $('a:first-of-type', library).onclick();
            }
        },

        save: function(curves) {
            localStorage.curves = JSON.stringify(curves || self.curves);
        },

        thumbnailStyle: {
            handleColor: 'rgba(0,0,0,.3)',
            handleThickness: .018,
            bezierThickness: .032
        },

        thumbnailStyleSelected: {
            handleColor: 'rgba(255,255,255,.6)',
            bezierColor: 'white',
            handleThickness: .018,
            bezierThickness: .032
        }
    };

})();