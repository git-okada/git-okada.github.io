//============================//
// ページ読み込み後処理       //
//============================//
$(document).ready(function() {
	// サーバーからのエラーメッセージが設定されている場合、表示する。
	var errMsg = $('#errMsg').attr('value');
	if (errMsg != undefined && errMsg != '') {
		setTimeout(function(){
			window.alert(errMsg);
		}, 1000);
	}
});
