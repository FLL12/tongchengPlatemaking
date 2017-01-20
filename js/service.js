		mui.init({
			swipeBack : false,
			//beforeback : back,
			keyEventBind: {
				backbutton: false  //关闭back按键监听
			}
		});
			
			
		mui.plusReady(function () {
			
			
			function serviceOrder () {
				plus.nativeUI.showWaiting('正在加载中')
				mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetAllOrder?Model=0&Type=2&Condition=&CreatedBy='+ localStorage.getItem('userCode') +'&CurrentPage=0&EachPage=10', {
					data: null,
					dataType: 'json', //返回    
					type: 'get',
					timeout: 5000,
					success: function(data) { 
						
						//服务器返回响应，根据响应结果，分析是否登陆成功
						var html = '';
						mui.each(data,function (index,item) { 
						    
							html += "<li class='mui-table-view-cell'"  +">" + 
						           	 "<a class='mui-navigate-right'>" +  item.OrderCode +      
						          	  "</a>" +
						        	"</li>" 
	
							
						})
						document.getElementById("serviceOrder").innerHTML = html; 
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
		   serviceOrder();
			
			window.addEventListener('service',serviceOrder);
			
				//刷新模块
		document.getElementById('btnReload').onclick = function () {
			serviceOrder();
			mui.fire(plus.webview.getWebviewById('enquiry'),'enquiry');
			mui.fire(plus.webview.getWebviewById('documentary'),'documentary');
		}
		
		
		//search
		function search () {
			var content = document.getElementById('searchContent').value;
			plus.nativeUI.showWaiting('正在加载中');
			mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetAllOrder?Model=0&Type=2&Condition='+ content +'&CreatedBy='+ localStorage.getItem('userCode') +'&CurrentPage=0&EachPage=10', {
					data: null,
					dataType: 'json', //返回    
					type: 'get',
					timeout: 5000,
					success: function(data) {
							
							
							console.log(JSON.stringify(data));
						
						//服务器返回响应，根据响应结果，分析是否登陆成功
						var html = '';
						mui.each(data,function (index,item) { 
						    
							html += "<li class='mui-table-view-cell'"  +">" + 
						           	 "<a class='mui-navigate-right'>" +  item.OrderCode +      
						          	  "</a>" +
						        	"</li>" 
	
							
						})
						document.getElementById("serviceOrder").innerHTML = html; 
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
		
		document.getElementById("search").onclick = function () {
			search();
		};
		
			
			mui(".mui-table-view").on('tap','.mui-table-view-cell',function () {
			
				mui.openWindow({
			  			url : 'dingdanxinxi.html',
			  			id  : 'dingdanxinxi',
			  			extras : {
			  				orderNum : this.childNodes[0].innerHTML 
			  			} 
			  		})
			})
		})