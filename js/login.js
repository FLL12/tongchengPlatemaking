mui.init();
mui.plusReady(function() {

	localStorage.clear();
	var serverAddress, portNum;
	if(localStorage.getItem('serverAddress') != null && localStorage.getItem('portNum') != null) {
		document.getElementById("serverAddress").value = localStorage.getItem('serverAddress');
		document.getElementById("portNum").value = localStorage.getItem('portNum');
	} else if(document.getElementById('serverAddress').value.length == 0) {

		mui('.mui-off-canvas-wrap').offCanvas('toggle');
	} else {
		serverAddress = document.getElementById("serverAddress").value;
		portNum = document.getElementById("portNum").value;
		localStorage.setItem("serverAddress", serverAddress);
		localStorage.setItem("portNum", portNum);
	}

	plus.screen.lockOrientation("portrait-primary"); //禁止横屏

	//系统设置侧滑打开
	document.querySelector('#system_setting').addEventListener('tap', function() {
		mui('.mui-off-canvas-wrap').offCanvas('toggle');

	});

	//点击保存按钮，保存端口号，对应的服务器ip，侧滑关闭
	document.getElementById("save").addEventListener('tap', function() {

		mui('.mui-off-canvas-wrap').offCanvas('toggle');
		serverAddress = document.getElementById("serverAddress").value;
		portNum = document.getElementById("portNum").value;
		localStorage.setItem("serverAddress", serverAddress);
		localStorage.setItem("portNum", portNum);
		mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetHomeInfo', {
			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				document.getElementById('logo_name_1').innerHTML = data[0].ComponyName;
				document.getElementById('logo_name_2').innerHTML = data[0].VsrsionName;
				document.getElementById('logo').innerHTML = "<img src = " + "http://" + localStorage.getItem('serverAddress') + ":" + localStorage.getItem('portNum') + '/WebRoot/homeImage/homeImage.png' + ">";
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});
	});
	
	//记住密码模块
	function rememberPass() {
		var iActive = document.getElementById("mySwitch").classList.contains("mui-active");
		if(iActive) {
			//console.log("打开状态");
			document.getElementById("userCode").value = localStorage.getItem('userCodeVa');
			document.getElementById("passWord").value = localStorage.getItem('passWordVa');
		} else {
			//console.log("关闭状态"); 
			document.getElementById("userCode").value = null;
			document.getElementById("passWord").value = null; 
		}
	}
	rememberPass();
	//push模块
	/*mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebApi/DataExchange/SendData/WebApp_PostUserToken?datakey=00-00-00-00', {
		data: JSON.stringify({
			user: document.getElementById("userCode").value,
			token: plus.push.getClientInfo().clientid,
		}),
		headers: {
			'Content-Type': 'application/json'
		},
		dataType: 'json',
		type: 'post',
		timeout: 5000,
		processData: false,
		success: function(data) {

		},
	});*/
	var status = '1.1.1';
	mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetHomeInfo', {
			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {//服务器返回响应，根据响应结果，分析是否登陆成功
				
				if ( data[0].Vsrsionnumber != status){
					
					plus.nativeUI.confirm(' ',confirmCB, '版本更新', ['取消', '确认']);
					function confirmCB (event) {
						if ( event.index == 1) {
							var dtask = plus.downloader.createDownload(data[0].UpdateLink,{},function (d,status) {
							if ( status == 200) {//下载成功
									var path = d.filename;
									plus.runtime.install(path);
								} else {
									alert('Download failed' + status);
								}
							});
							dtask.start();
						} 
						 
					}
				}
				
				
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败') 
			}
		});
	//软件更新模块
	/*var content = {
		"status":'1.1',
		"version": "1.1.0",
	};
	var server =  'http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") +'/WebApi/DataExchange/GetData/WebApp_CheckAppVersion?dataKey=00-00-00-00&AppVersion='+content.status+'&ApplicationID=a121e2e6-c0e6-11e6-98bc-000c29624c55';
	mui.getJSON(server, null, function(data) {
		var getDatas = data['DataSource']['Tables'][0]['Datas']; 
		if ( getDatas[0].appinfo != '1') {
			plus.nativeUI.confirm(' ',confirmCB, '版本更新', ['取消', '确认']);
			function confirmCB (event) {
				if ( event.index == 1) {
					var url='http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") +getDatas[0].appName; // 下载文件地址
					var dtask = plus.downloader.createDownload( 'http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + getDatas[0].appinfo, {}, function ( d, status ) {
					    if ( status == 200 ) { // 下载成功
					        var path = d.filename;
					        plus.runtime.install(path);
					    } else {//下载失败
					        alert( "Download failed: " + status ); 
					    }  
					});
					dtask.start(); 
				}
			}
			
			
		}
	});*/
	//登录模块
	//http://123.56.68.127/WebRoot/Login?UserCode=zhangzijian&Password=123456
	mui(".mui-btn-primary")[0].addEventListener('tap', function() {
		var userCodeVa = document.getElementById("userCode").value;
		var passWordVa = document.getElementById("passWord").value;
		localStorage.setItem('userCodeVa',userCodeVa);
		localStorage.setItem('passWordVa',passWordVa)
		if ( passWordVa == '' || passWordVa == '') {  
			mui.toast('账户或密码不能为空')
		} else {
			mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/Login?UserCode='+userCodeVa+'&'+'Password='+passWordVa, {
				data: null,
				dataType: 'json', //返回
				type: 'get',
				timeout: 5000, 
				success: function(data) {
					rememberPass();
					//服务器返回响应，根据响应结果，分析是否登陆成功
					if ( data == 'error') {
						mui.toast('账户名或密码错误')
					} else  {
						localStorage.setItem('userCode',data[0].UserCode);
						console.log(localStorage.getItem('userCode')) 
						localStorage.setItem('userId',data[0].UserID);
						mui.openWindow({
								url: 'main.html',
								id: 'main'
						})
					}
				},
				error: function() {
					//异常处理
					mui.toast('账户名或密码错误')
				}
			});
	}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		/*mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/Login',{
			data:JSON.stringify({
				UserCode: userCodeVa,
				Password: passWordVa,
				
			}),
			headers: {
				'Content-Type': 'application/json'
			}, //提交
			dataType: 'json', //返回
			type: 'post',
			timeout: 5000,
			processData: false,
			crossDomain:true,
			success:function (data) {
				console.log(1)
				/*console.log(JSON.stringify(data));
				mui.openWindow({
						url: 'main.html',
						id: 'main'
					})
			},
			error : function () {
				mui.toast('数据请求失败')
			}
		})*/
		
		/*if ( userCodeVa == 'shenM' && passWordVa == '123456') {
			
		} else {
			mui.toast('账户名或密码输入错误')
		};*/
		
	});
	document.getElementById('logo_name_1').innerHTML = 'shenM';
				document.getElementById('logo_name_2').innerHTML = '测试版本';
				document.getElementById('logo').innerHTML = "<img src = ' '>"
	//登录页面header部分数据展示
	console.log('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetHomeInfo')
	mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetHomeInfo', {
			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				document.getElementById('logo_name_1').innerHTML = data[0].ComponyName;
				document.getElementById('logo_name_2').innerHTML = data[0].VsrsionName;
				document.getElementById('logo').innerHTML = "<img src = " + "http://" + localStorage.getItem('serverAddress') + ":" + localStorage.getItem('portNum') + '/WebRoot/homeImage/homeImage.png' + ">";
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});
	
		
		/*mui.ajax('http://123.56.68.127/WebRoot/Login?usermobile=13581905786', {
			
			headers: {
				'Content-Type': 'application/json'
			}, //提交
			dataType: 'json', //返回
			type: 'post',
			timeout: 5000,
			crossDomain:true,
			processData: false,
			success: function(data) {
 
				console.log("----data------"+data[0].user_id+"-"+data[0].user_name+"-"+data[0].user_password+"-"+data[0].user_mobile+"-"+data[0].user_address+"-"+data[0].user_email+"-"+data[0].user_status+"-"+data[0].user_type+"-");
				//});
			},
			error: function() {
				//异常处理
				//console.log(type);
				mui.toast('数据请求失败')
			}
		});*/

/*	mui.ajax('http://'  , {
		data: null,
		dataType: 'json', //返回
		type: 'get', 
		timeout: 10000,
		success: function(data) {
			console.log(JSON.stringify(data))

		},
		error: function() {
			//异常处理
			mui.toast('数据请求失败')
		}
	});*/
		mui.ajax('http://127.0.0.1:8080/WebRoot/GetNewsPhone?NewsCode=', {
			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {//服务器返回响应，根据响应结果，分析是否登陆成功
				
				if ( data[0].Vsrsionnumber != status){
					
					plus.nativeUI.confirm(' ',confirmCB, '版本更新', ['取消', '确认']);
					function confirmCB (event) {
						if ( event.index == 1) {
							var dtask = plus.downloader.createDownload(data[0].UpdateLink,{},function (d,status) {
							if ( status == 200) {//下载成功
									var path = d.filename;
									plus.runtime.install(path);
								} else {
									alert('Download failed' + status);
								}
							});
							dtask.start();
						} 
						 
					}
				}
				
				
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败') 
			}
		});
})