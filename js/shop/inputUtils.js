//============================//
// ページ読み込み後処理       //
//============================//
var zipSearthSubmit = false; // 郵便番号検索処理中フラグ (2度押し制御)

$(document).ready(function() {
	// blurイベントを挿入する。
	$('#frm :input').blur(function (){
		var data = {
			name : $(this).attr('name'),
			value : $(this).attr('value')
		};
		
		$.ajax({
			url: '/shop/input-check.svlt',
			type: 'POST',
			global: false,
			data: data,
			dataType: 'xml',
			success: inputCheckSuccess,  // 通信成功時
			error: inputCheckError,      // 通信失敗時
			complete: inputCheckComplete // 処理終了時
		});
	}).blur();
	
	$("#loading").bind("ajaxSend", function(){
		$('#loading').fadeIn(500);
	}).bind("ajaxComplete", function(){
		$('#loading').hide();
	});
	
	// サーバーからのエラーメッセージが設定されている場合、表示する。
	var errMsg = $('#errMsg').attr('value');
	if (errMsg != undefined && errMsg != '') {
		setTimeout(function(){
			window.alert(errMsg);
		}, 1000);
	}
});

$('form').submit(function() {
	
	if ($('#frm :input').hasClass('required') || $('#frm :input').hasClass('error')) {
		return true;
	} else {
		return false;
	}
});

function nextActionBtn() {
	if ($('#frm :input').hasClass('required') || $('#frm :input').hasClass('error')) {
		$('#affirmation').css('display', 'inline');
		$('#affirmation_on').hide();
	} else {
		$('#affirmation_on').css('display', 'inline');
		$('#affirmation').hide();
	}
}

//============================//
// エラーチェック関連         //
//============================//
/**
 * Ajax通信成功時の処理
 * @param data
 * @param dataType
 * @return
 */
var inputCheckSuccess = function(data, dataType) {
	var params = data.getElementsByTagName('param');
	var i, n;
	for (i = 0, n = params.length; i < n; i++) {
		var name = params[i].getAttribute('name');
		var msg  = params[i].getAttribute('msg');
		if (msg == '') {
			$('#'+name).removeClass('error');
			// 必須項目の場合
			if ($('#'+name).hasClass('required')) {
				$('#'+name).addClass('ok').removeClass('required');
				if (!$('#'+name).parents('tr').find(':input').hasClass('required')) {
					$('#'+name).parents('tr').find('th.required').addClass('ok').removeClass('required').find('em').html('ＯＫ');
				}
			}
		} else {
			if ($('#'+name).attr('value') == '') {
				$('#'+name).removeClass('error');
				msg = '';
			} else {
				$('#'+name).addClass('error');
			}
			// 必須項目の場合
			if ($('#'+name).hasClass('ok')) {
				$('#'+name).addClass('required').removeClass('ok');
				$('#'+name).parents('tr').find('th.ok').addClass('required').removeClass('ok').find('em').html('必須');
			}
		}
		
		// メールアドレス相関チェック。
		if (name == 'emailAddress' || name == 'emailAddressRe') {
			// メールアドレス入力に問題がない場合。
			if ($('#emailAddress').hasClass('ok') &&
					$('#emailAddressRe').attr('value') != '' &&
					!$('#emailAddressRe').hasClass('error')) {
				// メールアドレスが一致していなければ、確認用アドレス側をエラー扱いにする。
				if ($('#emailAddress').val() != $('#emailAddressRe').val()) {
					$('#emailAddressRe').addClass('required').removeClass('ok');
					$('#emailAddressRe').parents('tr').find('th.ok').addClass('required').removeClass('ok');
					name = 'emailAddressRe';
					msg  = 'メールアドレスの入力内容が異なります。';
				} else {
					$('#emailAddressRe').addClass('ok').removeClass('required error');
					$('#emailAddressRe').parents('tr').find('th.required').addClass('ok').removeClass('required');
				}
			}
			
		// 郵便番号の入力に問題がなければ郵便番号検索ボタンを使用可能にする。
		} else if (name == 'zipCode') {
			
			if ($('#zipCode').hasClass('ok')) {
				$('#zip-search_on').css('display', 'inline');
				$('#zip-search').hide();
			} else {
				$('#zip-search').css('display', 'inline');
				$('#zip-search_on').hide();
			}
		}
		
		if (msg != '') {
			var position = $('#'+ name).offset();
			var positionTop    = position.top + $('#'+ name).outerHeight();
			var positionLeft   = position.left;
			var bgPositionTop  = 0;
			var bgPositionLeft = 40;
			$('#err_'+ name).remove();
			$('body').append('<div id="err_'+ name +'" class="errorMS"><span><ul><li>'+ msg +'</li></ul></span></div>');
			var overWidth = position.left + $('#err_'+ name).outerWidth() + 15 - $(document).width();
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
var inputCheckError = function (XMLHttpRequest, textStatus, errorThrown) {
}

/**
 * Ajax通信終了時の処理
 * @param XMLHttpRequest
 * @param textStatus
 * @return
 */
var inputCheckComplete = function(XMLHttpRequest, textStatus) {
	nextActionBtn();
}


//============================//
// 郵便番号検索関連           //
//============================//
function zipSearch() {
	
	if (zipSearthSubmit != true) {
		zipSearthSubmit = true; // フラグを立てる
		var data = {
			zipCode : $('#zipCode').val()
		};
		
		new $.ajax({
			url: '/shop/zip-search.svlt',
			type: 'POST',
			data: data,
			dataType: 'xml',
			success: zipSearchSuccess,  // 通信成功時
			error: zipSearchError,      // 通信失敗時
			complete: zipSearchComplete // 処理終了時
		});
	}
	
}


/**
 * Ajax通信成功時の処理
 * @param data
 * @param dataType
 * @return
 */
var zipSearchSuccess = function(data, dataType) {
	var params = data.getElementsByTagName('param');
	
	var todoguken   = params[0].getAttribute('value');
	var shikuchoson = params[1].getAttribute('value');
	var choiki      = params[2].getAttribute('value');
	if (todoguken != '') {
		$('#address1').val(todoguken).addClass('ok').removeClass('required error')
		              .parents('tr').find('th.required').addClass('ok').removeClass('required')
		                                                .find('em').html('ＯＫ');
		$('#address2').val(shikuchoson + choiki).addClass('ok').removeClass('required error')
		              .parents('tr').find('th.required').addClass('ok').removeClass('required')
		                                                .find('em').html('ＯＫ');
		nextActionBtn();
	} else {
		var position = $('#zipCode').offset();
		var positionTop    = position.top + $('#zipCode').outerHeight();
		var positionLeft   = position.left;
		var bgPositionTop  = 0;
		var bgPositionLeft = 40;
		$('body').append('<div id="err_zipsearch" class="errorMS"><span><ul><li>郵便番号に該当する住所情報がみつかりませんでした。</li></ul></span></div>');
		var overWidth = position.left + $('#err_zipsearch').outerWidth() + 15 - $(document).width();
		if (overWidth > 0) {
			positionLeft   -= overWidth;
			bgPositionLeft += overWidth;
		}
		$('#err_zipsearch').css({
			backgroundPosition: bgPositionLeft +'px '+ bgPositionTop +'px',
			top: positionTop,
			left: positionLeft
		});
		$('#err_zipsearch').slideDown(150);
		var delEv = setTimeout(function(){
			$('#err_zipsearch').fadeOut(500, function(){$(this).remove();});
		}, 1500);
	}
}

/**
 * Ajax通信失敗時の処理
 * @param XMLHttpRequest
 * @param textStatus
 * @param errorThrown
 * @return
 */
var zipSearchError = function (XMLHttpRequest, textStatus, errorThrown) {
}

/**
 * Ajax通信終了時の処理
 * @param XMLHttpRequest
 * @param textStatus
 * @return
 */
var zipSearchComplete = function(XMLHttpRequest, textStatus) {
	zipSearthSubmit = false; // フラグを折る
}
