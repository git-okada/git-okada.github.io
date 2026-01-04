/*
 * yuga.js 0.3.0 - 優雅なWeb制作のためのJS
 *
 * Copyright (c) 2007 Kyosuke Nakamura (kyosuke.jp)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since:     2006-10-30
 * Modified:  2007-06-18
 * Modified:  2010-09-04 by M.Tanaka
 *
 */

/* common.js内で使っているfunction群 */
myDate = new Date();
var $thisYear = myDate.getFullYear();
var yuga = {
	// imageのプリローダー
	preloader: {
		loadedImages: [],
		load: function (url){
			var img = this.loadedImages;
			var l = img.length;
			img[l] = new Image();
			img[l].src = url;
		}
	},
	// URIを解析したオブジェクトを返すfunction
	URI: function(s){
		this.originalPath = s;
		
		// 絶対パスを取得
		this.getAbsolutePath = function(path){
			var img = new Image();
			img.src = path;
			path = img.src;
			img.src = '#';
			return path;
		};
	
		this.absolutePath = this.getAbsolutePath(s);
	
		// 同じ文書にリンクしているかどうか
		this.isSelfLink = (this.absolutePath == location.href);
	
		// 絶対パスを分解
		var a = this.absolutePath.split('://');
		this.schema = a[0];
		var d = a[1].split('/');
		this.host = d.shift();
		var f = d.pop();
		this.dirs = d;
		this.file = f.split('?')[0].split('#')[0];
		var fn = this.file.split('.');
		this.fileExtension = (fn.length == 1) ? '' : fn.pop();
		this.fileName = fn.join('.');
		var fq = f.split('?');
		this.query = (fq[1]) ? fq[1].split('#')[0] : '';
		var ff = f.split('#');
		this.fragment = (ff[1]) ? ff[1].split('?')[0] : '';	
	}
};

$(function(){
		
	// [RollOver] class="on"
	$('.on').each(function(){
		this.originalSrc = $(this).attr('src');
		this.rolloverSrc = this.originalSrc.replace(/(\.gif|\.jpg|\.png)/, "_on$1");
		yuga.preloader.load(this.rolloverSrc);
	}).hover(function(){
		$(this).attr('src',this.rolloverSrc);
	},function(){
		$(this).attr('src',this.originalSrc);
	});
	
	// Link Setting
	//   [1] Blank
	$('a[href$=".pdf"]').attr('target', '_blank');
	$('a[href^="http"],a[href^="https"],area[href^="http"]').filter(function(){
		var $SearchResult1 = $(this).attr('href').indexOf("http://wasanbon.dsg.pro-s.co.jp/",0);
		var $SearchResult2 = $(this).attr('href').indexOf("http://www.wasanbon.co.jp/",0);
		var $Result = ($(this).attr('class') != 'notblank' && $SearchResult1 < 0 && $SearchResult2 < 0 );
		return $Result;
	}).attr('target', '_blank');


	//   [3] FileLink
	$('#contents a[href$=".pdf"]').each(function(){ $(this).addClass('pdf'); });

	// [Detail] .box
	$('.box').wrapInner("<span></span>");
	$('.box').css("padding","0");

});

