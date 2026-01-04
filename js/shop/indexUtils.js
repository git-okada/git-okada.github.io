//============================//
// ページ読み込み後処理       //
//============================//
$(document).ready(function() {
	// blurイベントを挿入する。
	$('#frm :input').blur(function (){
		var data = {
			name : $(this).attr('name'),
			value : $(this).attr('value')
		};
		
		$.ajax({
			url: '/shop/index-check.svlt',
			type: 'POST',
			data: data,
			dataType: 'xml',
			success: indexCheckSuccess,  // 通信成功時
			error: indexCheckError,      // 通信失敗時
			complete: indexCheckComplete // 処理終了時
		});
	}).blur();
	
	// サーバーからのエラーメッセージが設定されている場合、表示する。
	var errMsg = $('#errMsg').attr('value');
	if (errMsg != undefined && errMsg != '') {
		setTimeout(function(){
			window.alert(errMsg);
		}, 1000);
	}
});

$('form').submit(function() {
	
	if ($('#frm :input[value!=]').length > 0 && !$('#frm :input[value!=]').hasClass('error')) {
		return true;
	} else {
		return false;
	}
});

function nextActionBtn() {
	if ($('#frm :input[value!=]').length > 0 && !$('#frm :input[value!=]').hasClass('error')) {
		// aタグ追加と共に画像切り替えイベントを挿入
		if (!$('#affirmation').hasClass('on')) {
			$('#affirmation').addClass('on').wrap('<a href="javascript:void(0);" onclick="frm.submit(); return false;"></a>').each(function(){
				this.originalSrc = $(this).attr('src');
				this.rolloverSrc = this.originalSrc.replace(/(\.gif|\.jpg|\.png)/, "_on$1");
				yuga.preloader.load(this.rolloverSrc);
			}).hover(function(){
				$(this).attr('src',this.rolloverSrc);
			},function(){
				$(this).attr('src',this.originalSrc);
			});
		}
	} else {
		// aタグ除去と共に画像切り替えイベントを削除
		$('#affirmation').removeClass('on').parent('a').each(function(){
		    $(this).replaceWith($(this).html());
		});
	}
}

//============================//
// Ajax関連                   //
//============================//
/**
 * Ajax通信成功時の処理
 * @param data
 * @param dataType
 * @return
 */
var indexCheckSuccess = function(data, dataType) {
	var params = data.getElementsByTagName('param');
	var i, n;
	for (i = 0, n = params.length; i < n; i++) {
		var name = params[i].getAttribute('name');
		var msg  = params[i].getAttribute('msg');
		if (msg == '') {
			$('#'+name).removeClass('error');
		} else {
			$('#'+name).addClass('error');
		}
		
		if (msg != '') {
			var position = $('#'+ name).offset();
			var positionTop    = position.top + $('#'+ name).outerHeight();
			var positionLeft   = position.left;
			var bgPositionTop  = 0;
			var bgPositionLeft = 40;
			$('#err_'+ name).remove();
			$('body').append('<div id="err_'+ name +'" class="errorMS"><span><ul><li>'+ msg +'</li></ul></span></div>');
			var overWidth = position.left + $('#err_'+ name).outerWidth() + 15 - $(window).width();
			if (overWidth > 0) {
				positionLeft   -= overWidth;
				bgPositionLeft += overWidth;
			}
			$('#err_'+ name).css({
				backgroundPosition: bgPositionLeft +'px '+ bgPositionTop +'px',
				top: positionTop,
				left: positionLeft
			});
			$('#err_'+ name).slideDown(150);
			var delEv = setTimeout(function(){
				$('#err_'+ name).fadeOut(500, function(){$(this).remove();});
			}, 1500);
		}
	}
}

/**
 * Ajax通信失敗時の処理
 * @param XMLHttpRequest
 * @param textStatus
 * @param errorThrown
 * @return
 */
var indexCheckError = function (XMLHttpRequest, textStatus, errorThrown) {
}

/**
 * Ajax通信終了時の処理
 * @param XMLHttpRequest
 * @param textStatus
 * @return
 */
var indexCheckComplete = function(XMLHttpRequest, textStatus) {
	nextActionBtn();
}
