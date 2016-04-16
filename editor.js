/**
 * Created by lmz on 16/4/13.
 */

/**
 * 该对象封装了绘制贝塞尔曲线的API
 * util 存放工具函数
 * BezierEditor是bezier曲线绘制的构造函数
  * @type {{util: {svg}, editor: {BezierEditor}}}
 */

var cubic = {
    util:{},
    editor:{},
};

cubic.util.svg = function (tag_name) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag_name);
};


cubic.editor = (function(){
    /**
     * bezier曲线绘制的构造函数
     * @param svg_container jquery包装的容器,里面必须存放一个svg元素,svg元素下面放一个id为grid的g元素
     * @param opt 配置参数对象
     * {
     *   show_grid:是否显示grid,如#svg_container
     *   hightlight:高对比度,stroke为白色
     *   viewbox_rec:viewbox设置
     *   x1,y1,x2,y2:设置两个控制点的坐标
     *   padding:距离边框的距离
     *   link:两个editor共享相同的bezier
     *
     * }
     * @constructor
     */
    function BezierEditor(svg_container,opt){
        opt = opt || {};
        this.svg = svg_container.children("svg");

        opt.viewbox_rec[0] = opt.viewbox_rec[0] || new vec2(0,0);
        opt.viewbox_rec[1] = opt.viewbox_rec[1] || new vec2(this.svg.attr("width"), this.svg.attr("height"));

        this.src = {x:0,y:0};
        this.des = {x:300,y:300};

        this.padding = opt.padding || 0;

        this.zoom = (opt.viewbox_rec[1].x-2*this.padding)/300;




        this.link = opt.link;

        this.dimention = new vec2(this.svg.attr("width"), this.svg.attr("height"));
        this.viewbox =  opt.viewbox_rec;
        this.apply_viewbox();
        this.grid = new vec2(20, 20);

        this.g = $("#grid",svg_container);

        if(opt.hightlight){
            this.hightlight = "#eee";
        }
        if(opt.show_grid){
            this.show_grid(opt);
        }
        this.init_svg(opt);
        var p1 = {
            x: this.p1.attr('cx'),
            y: this.transform(this.p1.attr('cy'))
        };
        var p2 = {
            x: this.p2.attr('cx'),
            y: this.transform(this.p2.attr('cy'))
        };

        this.updateSvg(p1,p2);


        this.g.append(this.p1);
        this.g.append(this.p2);
        if(opt.interative){
            this.p1.bind('mousedown',{self:this},controlPointEvent_down);
            this.p2.bind('mousedown',{self:this},controlPointEvent_down);

        }

    }
    BezierEditor.prototype = {
        apply_viewbox: function () {
            this.svg[0].setAttribute("viewBox", sprintf("%f, %f, %f, %f", this.viewbox[0].x, this.viewbox[0].y, this.viewbox[1].x, this.viewbox[1].y));
        },
        init_svg:function(opt){

            this.p1 =  $(cubic.util.svg("circle")).attr({
                cx:(typeof(opt.x1)=="undefined"?20:opt.x1),cy:(typeof(opt.y1)=="undefined"?-200:opt.y1),
                r:10*this.zoom,
                fill:this.hightlight||"#f08",
            });

            this.p2 =  $(cubic.util.svg("circle")).attr({
                cx:(typeof(opt.x2)=="undefined"?200:opt.x2),cy:(typeof(opt.y2)=="undefined"?-20:opt.y2),
                r:10*this.zoom,
                fill:this.hightlight||"#0ab",
            });

        },
        show_grid:function (opt) {
            var g = this.g ;

            // g.empty();
            var x = 0, y = 0, i;
            var w = this.dimention.x, h = this.dimention.y;
            var grid_base = 10;
            var grid_factor = Math.pow(grid_base, Math.round(Math.log(this.zoom) / Math.log(grid_base)));
            var grid_x = grid_factor * this.grid.x;
            var grid_y = grid_factor * this.grid.x;

            x = 0, y = 0;

            for (i = 0; i < h/2 / grid_y; i++) {
                y = i * grid_y;
                var color = i%2==0?'#fff':'#eee';
                g.append($(cubic.util.svg("rect")).attr({"stroke-width": grid_factor, x: 0, y:this.transform(y), width: w, height: 20,fill:color}));
            }
            g.append($(cubic.util.svg("line")).attr({"stroke-width": 2 * grid_factor, x1: 0, y1: 0, x2: 300, y2: -300,stroke:'#ccc'}));

        },
        updateSvg:function(p1,p2){
            var src = {
                x:this.src.x,
                y:this.src.y
            };
            var des = {
                x:this.des.x,
                y:this.des.y
            };
            this.transform([p1,p2,src,des]);

            this.p1.attr({
                cx: p1.x,
                cy: p1.y
            });

            this.p2.attr({
                cx: p2.x ,
                cy: p2.y ,
            });

            if(!this.p1_line){
                this.p1_line =  $(cubic.util.svg("line")).attr({
                    x1:p1.x,y1:p1.y,
                    x2:src.x,y2:src.y,
                    stroke:this.hightlight||"#777",
                    'stroke-width':1,
                });
                this.g.append(this.p1_line);
            }
            this.p1_line.attr({
                x1:p1.x,
                y1:p1.y
            });

            if(!this.p2_line){
                this.p2_line =  $(cubic.util.svg("line")).attr({
                    x1:p2.x,y1:p2.y,
                    x2:des.x,y2:des.y,
                    stroke:this.hightlight||"#777",
                    'stroke-width':1
                });
                this.g.append(this.p2_line);
            }
            this.p2_line.attr({
                x1:p2.x,
                y1:p2.y
            });
            if(!this.bezier){
                this.bezier = $(cubic.util.svg("path")).attr({
                    d:sprintf("M %f %f C %f %f %f %f %f %f", src.x,src.y,p1.x, p1.y, p2.x, p2.y,des.x,des.y) ,
                    stroke: this.hightlight||"#222",
                    'stroke-width': 3,
                    fill: "none"
                });
                this.g.append(this.bezier);
            }else{
                this.bezier.attr({
                    d:sprintf("M %f %f C %f %f %f %f %f %f", src.x,src.y,p1.x, p1.y, p2.x, p2.y,des.x,des.y) ,
                });
            }


            if(this.link){

                var event_args = [p1,p2];
                var values = [];
                var i=0;
                var self = this;
                event_args.forEach(function (item) {
                    values[i++] = item.x/self.viewbox[1].x;
                    values[i++] = item.y/self.viewbox[1].x;
                });
                $("#current").trigger("update_cubic_function_event",[values]);

                $("#values").trigger("update_cubic_function_value",[values]);

                this.link.forEach(function(element) {
                    element.updateSvg(p1,p2);
                });
            }
        },
        transform:function(obj){
            self = this;
            var self = this;
            if(!isNaN(obj)){
                if(obj>0){
                    return -obj;
                }
                return obj;

            }
            var padding = self.padding;
            if(obj instanceof Array){

                obj.forEach(function (item) {
                    item.y = self.transform(item.y);
                    //var sum = item.x-item.y;
                    //if(item.x==300 && item.y==300){
                    //    item.x=item.x*self.zoom ;
                    //    item.y=item.y*self.zoom + padding;
                    //}else{
                        item.x = item.x*self.zoom +padding;
                        item.y = item.y*self.zoom - padding ;
                    //}



                    //
                    //if(sum<300){
                    //
                    //}
                    //else{
                    //    item.x = item.x*self.zoom - padding;
                    //    item.y = item.y*self.zoom + padding ;
                    //}

                })
            }

        }
    }
    function controlPointEvent_down(e){
        var self = e.data.self;
        self.controlPoint = $(this);
        self.svg.bind('mousemove',{self:self},controlPointEvent_move);
        self.svg.bind('mouseup',{self:self},controlPointEvent_up)
    }
    function controlPointEvent_move(e){
        var self = e.data.self;
        var left = curveBoundingBox.left,
            top = curveBoundingBox.top,
            x = e.pageX,
            y = e.pageY;


        if (x - left < 0 || y - top < 0) {
            return;
        }

        // Constrain x
        x = Math.min(Math.max(left, x), left + curveBoundingBox.width);


        self.controlPoint.attr({
            cx: x -left ,
            cy: y + self.viewbox[0].y-top
        });

        var p1 = {
            x: self.p1.attr('cx'),
            y: self.transform(self.p1.attr('cy'))
        };
        var p2 = {
            x: self.p2.attr('cx'),
            y: self.transform(self.p2.attr('cy'))
        };


        self.updateSvg(p1,p2);
    }
    function controlPointEvent_up(e) {
        var self = e.data.self;
        self.svg.unbind("mousemove");
        self.svg.unbind("mouseup");
    }

    return {
        BezierEditor:BezierEditor,
    }
})();