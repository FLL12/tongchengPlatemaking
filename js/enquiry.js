mui.init({
	swipeBack: false,
	//beforeback : back,
	keyEventBind: {
		backbutton: false //关闭back按键监听
	}

});

mui.plusReady(function() {

	//调用安卓端软键盘
	/*function Context () {
				   	var Context = plus.android.importClass("android.content.Context");
				    var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				    var main = plus.android.runtimeMainActivity();
				    var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				    imm.toggleSoftInput(0,InputMethodManager.SHOW_FORCED);
			  		mui.fire(plus.webview.getWebviewById('main','main:fix'))
			   } */
	//Context();  

	//关闭安卓软键盘
	/*function Close () {
		
	}
	document.getElementById('userCode').onfocus = function () {
			Context();
			document.getElementById('headerContent').style.display = 'none';
	}
	document.getElementById('userCode').onblur = function () {
			document.getElementById('headerContent').style.display = 'block';
	}*/
	//input focus时设置为relative blur时设置为fixed
	/* document.getElementById("guige").onfocus = function () {
	 	mui.fire(plus.webview.getWebviewById('main'),'main:relative')
	 }
	   document.getElementById("guige").onblur = function () {
	   	setTimeout(function () {
	   			mui.fire(plus.webview.getWebviewById('main'),'main:fix')
	   	},200)
	 
	 }*/

	/*var height = document.documentElement.clientHeight; //这里的725就是你的页面原始高度
	var tempHeight = document.querySelector("body").offsetHeight;//tempHeight是你当前页面高度
		if (height != tempHeight){
			mui.fire(plus.webview.getWebviewById('main'),'main:relative')
		}*/
	document.getElementById('fatherSel').onchange = function() {
		if(this.value == '未选择' || this.value == '三层复膜') {
			document.getElementById('firstSel').removeAttribute("disabled");
			document.getElementById("firstSel").style.background = 'white'
			document.getElementById('secondSel').removeAttribute("disabled");
			document.getElementById("secondSel").style.background = 'white'
			document.getElementById('thirdSel').removeAttribute("disabled");
			document.getElementById("thirdSel").style.background = 'white';

		};
		if(this.value == '一层复膜') {
			document.getElementById('firstSel').removeAttribute("disabled");
			document.getElementById("firstSel").style.background = 'white'
			document.getElementById('secondSel').removeAttribute("disabled");
			document.getElementById("secondSel").style.background = 'white'
			document.getElementById('thirdSel').removeAttribute("disabled");
			document.getElementById("thirdSel").style.background = 'white';

			document.getElementById('secondSel').setAttribute('disabled', 'disabled');
			document.getElementById("secondSel").style.background = '#999999';
			document.getElementById("secondSel").value = '未选择';
			document.getElementById('thirdSel').setAttribute('disabled', 'disabled');
			document.getElementById("thirdSel").style.background = '#999999'
			document.getElementById("thirdSel").value = '未选择';
		};
		if(this.value == '二层复膜') {
			document.getElementById('firstSel').removeAttribute("disabled");
			document.getElementById("firstSel").style.background = 'white'
			document.getElementById('secondSel').removeAttribute("disabled");
			document.getElementById("secondSel").style.background = 'white'
			document.getElementById('thirdSel').removeAttribute("disabled");
			document.getElementById("thirdSel").style.background = 'white';

			document.getElementById('thirdSel').setAttribute('disabled', 'disabled');
			document.getElementById("thirdSel").style.background = '#999999';
			document.getElementById("thirdSel").value = '未选择';
		};

	}

	function numTrans(s) {
		return s < 10 ? '0' + s : s;
	}
	document.getElementById('btnOrder').onclick = function() {
		var orderInf = document.getElementById('orderInf').value;
		var wid = document.getElementById("wid").value;
		var hei = document.getElementById("hei").value;
		var thickNess = document.getElementById("thickNess").value;
		var bagType = document.getElementById("bagType").value;
		var print = document.getElementById("print").value;
		var fatherSel = document.getElementById("fatherSel").value;
		var firstSel = document.getElementById("firstSel").value;
		var secondSel = document.getElementById("secondSel").value;
		var thirdSel = document.getElementById("thirdSel").value;
		var num = document.getElementById("num").value;
		var unit = document.getElementById("unit").value;
		var beizhu = document.getElementById("beizhu").value;
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth() + 1;
		var day = myDate.getDate();
		var hours = myDate.getHours();
		var minutes = myDate.getMinutes();
		var second = myDate.getSeconds();
		numTrans(month);
		numTrans(day);
		numTrans(hours);
		numTrans(minutes);
		numTrans(second);

		var time = year + '' + numTrans(month) +
			numTrans(day) + numTrans(hours) +
			numTrans(minutes) + numTrans(second);
		var content = '订单信息: ' + orderInf +
			'\n宽度: ' + wid +
			'\n长度: ' + hei +
			'\n厚度: ' + thickNess +
			'\n袋型: ' + bagType +
			'\n印模: ' + print +
			'\n复合层数: ' + fatherSel +
			'\n一层复膜: ' + firstSel +
			'\n二层复膜: ' + secondSel +
			'\n三层复膜: ' + thirdSel +
			'\n订单数量: ' + num +
			'\n订单单位: ' + unit +
			'\n备注: ' + beizhu;
	
		var content1 = '订单信息: ' + orderInf +
						'<br/>宽度(cm): ' + wid +
						'<br/>长度(cm): ' + hei +
						'<br/>厚度(双): ' + thickNess +
						'<br/>袋型: ' + bagType +
						'<br/>印模: ' + print +
						'<br/>复合层数: ' + fatherSel +
						'<br/>一层复膜: ' + firstSel +
						'<br/>二层复膜: ' + secondSel +
						'<br/>三层复膜: ' + thirdSel +
						'<br/>订单数量: ' + num +
						'<br/>订单单位: ' + unit +
						'<br/>备注: ' + beizhu;
		var r = confirm(content + '\n订单编号:' +time); 
		if(r) {
			//询价传输 订单内容
			//console.log('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/SubmittedMaterial?OrderCode=' + localStorage.getItem('userCode') + '-' + time + '&Remark=' + content + '&CreatedBy=' + localStorage.getItem('userCode'))

			mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/SubmittedMaterial?OrderCode=' + localStorage.getItem('userCode') + '-' + time + '&Remark=' + content1 + '&CreatedBy=' + localStorage.getItem('userCode'), {
				data: null,
				type: 'get',
				timeout: 5000,
				success: function(data) {
					plus.nativeUI.showWaiting('加载中');
					setTimeout(function () {
						enquiryOrder();
						plus.nativeUI.closeWaiting();
					},300)
					
				},
				error: function() {
					//异常处理

					mui.toast('数据请求失败')
				}
			});

		} else {
			
		}
	} 
//http://123.56.68.127/WebRoot/LaunchOrder?OrderCode=zzj20170113&CreatedBy=zhangzijian
	//http://123.56.68.127/WebRoot/GetAllOrder?Model=0&Type=0&Condition=&CreatedBy=zzj&CurrentPage=0&EachPage=10
	 function enquiryOrder() {
	 	plus.nativeUI.showWaiting('正在加载中');
	 	mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetAllOrder?Model=0&Type=0&Condition=&CreatedBy='+ localStorage.getItem('userCode') +'&CurrentPage=0&EachPage=10', {
			data: null,
			dataType: 'json', //返回    
			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				var html = '';
				var a = " style = 'color: rgb(255, 0, 102)' ";//红色  rgb(255, 0, 102)订单已提交价格还未出来
				var b = "style = '  color:rgb(0, 153, 51)' ";//绿色   rgb(0, 153, 51)订单已提交价格出来了 可以点击进去看价格，订单详情
				var c = "style = ' color:rgb(153,102,0)'";//黄色  rgb(153,102,0) 订单已经提交，公司收到订单还未开始生产。
				var d;
				mui.each(data,function (index,item) {
					//console.log(item.Status)
					if ( item.Status == '-1') {
						
					} else {
						if ( item.Status == '0') {
						d = a;
					} else if ( item.Status == '1') {
						d = b;
					} else  {
						d = c; 
					}
					html += "<li class='mui-table-view-cell'" + d +">" + 
				            "<a class='mui-navigate-right'>" +  item.OrderCode +      
				            "</a>" +
				        "</li>"
					}
					
				})
				document.getElementById("enquiryTask").innerHTML = html; 
				setTimeout(function () {
					plus.nativeUI.closeWaiting();
				},300)
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败') 
			}
			
		});
	 }
	enquiryOrder();
	
	
		mui(".mui-table-view").on("tap",".mui-table-view-cell",function () {
				mui.openWindow({ 
					url : 'enquiryChildrenHtml.html',
			  		id  : 'enquiryChildrenHtml',
			  		extras : {
			  				color : this.style.color,
			  				orderNum : this.childNodes[0].innerHTML 
			  			}
				})
			})
		window.addEventListener('enquiry',enquiryOrder);
		
		
		//刷新模块
		document.getElementById('btnReload').onclick = function () {
			enquiryOrder();
			mui.fire(plus.webview.getWebviewById('documentary'),'documentary');
			mui.fire(plus.webview.getWebviewById('service'),'service')
		}
		
});