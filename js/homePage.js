	mui.init();
			mui.plusReady(function() {
				mui('.mui-table-view').on('tap','.mui-table-view-cell',function () {
					console.log()
			  		mui.openWindow({
			  			url : 'homePage_childrenWeb.html',
			  			id  : 'homePage_childrenWeb',
			  			extras : {
			  				code  : this.childNodes[0].value
			  			}
			  		}) 
			   });
			   //获得slider插件对象
				var gallery = mui('.mui-slider');
				gallery.slider({
				  interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
				});
				
				
				//http://127.0.0.1:8080/WebRoot/GetNewsPhone?NewsCode=1
				//http://127.0.0.1:8080/WebRoot/GetNewsPhone?NewsCode=
				function news () {
					plus.nativeUI.showWaiting('正在加载中');
					mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebRoot/GetNewsPhone?NewsCode=', {
						data: null,
						dataType: 'json', //返回
						type: 'get',
						timeout: 5000,
						success: function(data) {//服务器返回响应，根据响应结果，分析是否登陆成功
							var html = '';
							mui.each(data,function (index,item) {
								html += "<li class='mui-table-view-cell'"  +">" + 
										"<input type = 'hidden' value ="+ item.NewsCode +" >"+
							           	 "<a class='mui-navigate-right'>" +  item.title +      
							          	  "</a>" +
							        	"</li>"
							})	
						document.getElementById("homePageContent").innerHTML = html; 
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
			
				news();
			})


		
		
			