/*
 * vec2.js from BezierEditor
 *
 * author: (c) 2014-2015 Hayato Hashimoto
 */

"use strict";

var vec2 = function (x, y) { this.x = x; this.y = y; };

vec2.prototype = {
  equals    : function (v) { return (this.x == v.x && this.y == v.y); },
  toString  : function () { return "(" + this.x.toFixed(1) + ", " + this.y.toFixed(1) + ")"; },
  scale     : function (a) { return new vec2(a * this.x, a * this.y); },
  add       : function (v) { return new vec2(this.x + v.x, this.y + v.y); },
  substract : function (v) { return new vec2(this.x - v.x, this.y - v.y); },
  mul       : function (v) { return new vec2 (this.x * v.x - this.y * v.y, this.x * v.y + this.y * v.x); },
  inv       : function ()  { return (new vec2 (this.x, -this.y)).scale(1 / this.norm() / this.norm()); },
  div       : function (v) { return this.mul(v.inv()); },
  arg       : function () { return Math.atan2(this.y, this.x); },
  norm      : function ()  { return Math.sqrt(this.x * this.x + this.y * this.y); },
  normalize : function ()  { return this.scale(1.0 / this.norm()); },
  distance  : function (v) { return this.substract(v).norm(); },
  dot       : function (v) { return this.x * v.x + this.y * v.y; },
  cross     : function (v) { return this.x * v.y - this.y * v.x; },
  rotate    : function (rad) { return new vec2 (this.x * Math.cos(rad) - this.y * Math.sin(rad), this.x * Math.sin(rad) + this.y * Math.cos(rad)); },
  in_rectangle : function (p, d) { return (p.x <= this.x && this.x <= p.x + d.x && p.y <= this.y && this.y <= p.y + d.y); },
  css       : function () { return { left: this.x, top: this.y }; },
};

vec2.fromCss = function (css) {
  return new vec2(css.left, css.top);
};
