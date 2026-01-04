$(document).ready(function() {
	var agree = $('#agree');
	
	if (agree.attr('checked')) {
		agree.parents('ul.required').addClass('ok').removeClass('required').find('.formRequiredItem').html('ＯＫ');
		$('#affirmation_on').css('display', 'inline');
		$('#affirmation_on_2').css('display', 'inline');
		$('#affirmation').hide();
		$('#affirmation_2').hide();
	} else {
		agree.parents('ul.ok').addClass('required').removeClass('ok').find('.formRequiredItem').html('必須');
		$('#affirmation').css('display', 'inline');
		$('#affirmation_2').css('display', 'inline');
		$('#affirmation_on').hide();
		$('#affirmation_on_2').hide();
	}

	agree.click(function (){
		if ($(this).attr('checked')) {
			$(this).parents('ul.required').addClass('ok').removeClass('required').find('.formRequiredItem').html('ＯＫ');
			$('#affirmation_on').css('display', 'inline');
			$('#affirmation_on_2').css('display', 'inline');
			$('#affirmation').hide();
			$('#affirmation_2').hide();
		} else {
			$(this).parents('ul.ok').addClass('required').removeClass('ok').find('.formRequiredItem').html('必須');
			$('#affirmation').css('display', 'inline');
			$('#affirmation_2').css('display', 'inline');
			$('#affirmation_on').hide();
			$('#affirmation_on_2').hide();
		}
	});

	// サーバーからのエラーメッセージが設定されている場合、表示する。
	var errMsg = $('#errMsg').attr('value');
	if (errMsg != undefined && errMsg != '') {
		setTimeout(function(){
			window.alert(errMsg);
		}, 1000);
	}
});
