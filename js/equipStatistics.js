mui.init({
	swipeBack: false,
	//beforeback : back,
	keyEventBind: {
		backbutton: false //关闭back按键监听
	}
});
var main, menu;
var showMenu = false,
	mode = 'menu-move';
//实现webview侧滑模块
function back() {
	if(showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
		closeMenu();
		return false;
	} else {
		//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
		menu.close('none');
		return true;
	}
}
var page = ['equipStatistics_classCode.html', 'equipStatistics_area.html'];

function cutWebviewId(url) {
	var startIndex = url.lastIndexOf("/");
	var endIndex = url.lastIndexOf(".html");
	var wvId = url.substring(startIndex + 1, endIndex);
	return wvId;
}
//不同的点击事件触发不同的初始化页面
mui('.header-for-time-area').on('tap', '#search', function() {
	mui.fire(plus.webview.currentWebview().opener(), 'main:maskShow');
	plus.nativeUI.showWaiting('加载中...');
	menu = mui.preload({
		url: page[1],
		id: cutWebviewId(page[1]),
		styles: {
			left: "30%",
			width: "70%",
			zindex: 9997
		}
	});	
	setTimeout(function() {
		switch(mode) {
		case 'menu-move':
			menu.setStyle({
				left: '100%',
				zindex: 9999
			});
			mode = 'menu-move';
			break;
	};
		openMenu();
		plus.nativeUI.closeWaiting()
	}, 300)
});
document.getElementById('equipName').addEventListener('tap', function() {
	mui.fire(plus.webview.currentWebview().opener(), 'main:maskShow');
	plus.nativeUI.showWaiting('加载中...');
	menu = mui.preload({
		url: page[0],
		id: cutWebviewId(page[0]),
		styles: {
			left: "30%",
			width: "70%",
			zindex: 9997
		}
	});
	setTimeout(function() {
		switch(mode) {
		case 'menu-move':
			menu.setStyle({
				left: '100%',
				zindex: 9999
			});
			mode = 'menu-move';
			break;
		}
		openMenu();
		plus.nativeUI.closeWaiting()
	}, 300)
}, false)
mui.plusReady(function() {

	//初始化的 地区的显示
	document.getElementById('forArea').value = localStorage.getItem('init_areaName');

	

	//地区变化数据变化 
	window.addEventListener('equipStatistics:area', function() {
		document.getElementById('forArea').value = localStorage.getItem('areaName');
		equipNum(localStorage.getItem('OrganiseUnitCode'));
		topTen(localStorage.getItem('OrganiseUnitCode'));
		if(document.getElementById('equipName').value == '全部设备') {
			GetUnitEqCount('', localStorage.getItem('OrganiseUnitCode'))
		} else {
			GetUnitEqCount(yunMapClassCode.get(document.getElementById('equipName').value), localStorage.getItem('OrganiseUnitCode'));
		}
		mui.fire(plus.webview.getWebviewById('equipStatus'), 'equipStatus:all');
		mui.fire(plus.webview.getWebviewById('totalTarget'), 'totalTarget:all');
		mui.fire(plus.webview.getWebviewById('checkStatistics'), 'checkStatistics:all');
		mui.fire(plus.webview.getWebviewById('operationStatistics'), 'operationStatistics:all');

	});

	//添加事件 classCode
	window.addEventListener('equipStatistics:classCode', function() {
		document.getElementById('equipName').value = localStorage.getItem('equipName');
		console.log( localStorage.getItem('equipName').length)
		if ( localStorage.getItem('equipName').length <= 6){
			document.getElementById('equipName').style.width = (14*localStorage.getItem('equipName').length + 4 )+ 'px';
		} else {
			document.getElementById('equipName').style.width = 13*localStorage.getItem('equipName').length + 'px';
		}
		console.log(document.getElementById('equipName').style.width)
		GetUnitEqCount(localStorage.getItem('ClassCode'), yunMapArea.get(document.getElementById('forArea').value));
	})

	window.addEventListener('equipStatistics:all', function() {
		document.getElementById('forArea').value = localStorage.getItem('areaName');
		equipNum(localStorage.getItem('OrganiseUnitCode'));
		topTen(localStorage.getItem('OrganiseUnitCode'));
		if(document.getElementById('equipName').value == '全部设备') {
			GetUnitEqCount('', localStorage.getItem('OrganiseUnitCode'))
		} else {
			GetUnitEqCount(yunMapClassCode.get(document.getElementById('equipName').value), localStorage.getItem('OrganiseUnitCode'));
		}

	})

	//通过map来得到area对应的organiseUnitcode
	var yunMapArea = new Map();

	function getAreaArr() {
		//var arr = [];
		mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebApi/DataExchange/GetData/WebApp_GetOrganiseUnit?dataKey=00-00-00-00&userID=' + localStorage.getItem('userCodeVa'), {

			data: null,
			dataType: 'json', //返回

			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				var getDatas = data['DataSource']['Tables'][0]['Datas'];

				for(var i = 0; i < getDatas.length; i++) {
					yunMapArea.set(getDatas[i].OrganiseUnitName, getDatas[i].OrganiseUnitCode);
					//arr[getDatas[i].OrganiseUnitName] = getDatas[i].OrganiseUnitCode;
				};

			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});

	}
	getAreaArr();

	//通过map得到classcode 
	var yunMapClassCode = new Map();

	function getClassCode() {
		mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebApi/DataExchange/GetData/WebApp_GetEquipmentStatus?dataKey=00-00-00-00&ClassCode=EquipmentClass&ApplicationID=' + localStorage.getItem('ApplicationID'), {
			async: false,
			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				var getDatas = data['DataSource']['Tables'][0]['Datas'];
				// document.getElementById('equipName').value = getDatas[0].ItemName;
				localStorage.setItem('init_classcode', getDatas[0].ItemCode);
				for(var i = 0; i < getDatas.length; i++) {
					yunMapClassCode.set(getDatas[i].ItemName, getDatas[i].ItemCode);
				}
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});
	}
	getClassCode();

	//通过ApplicationID  和  UnitCode 得到运维统计设备总数量数据
	function equipNum(UnitCode) {
		mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebApi/DataExchange/GetData/WebApp_GetEqTotalCount?dataKey=00-00-00-00&ApplicationID=' + localStorage.getItem('ApplicationID') + '&UnitCode=' + UnitCode, {
			async: false,
			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				var getDatas = data['DataSource']['Tables'][0]['Datas'];
				var arrName = [];
				var arrValue = [];
				var num = 0;
				if(getDatas.length == 0) {
					arrName = ['无', '无'];
					arrValue = ['0', '0'];
				} else {
					mui.each(getDatas, function(index, item) {
						arrName.push(item.ItemName.slice(0,4));
						arrValue.push(item.count);
						num += parseInt(item.count);
					});
				}
				document.getElementById('numFir').innerHTML = num;
				equipStatistics_fir(arrName, arrValue)
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});
	}
	equipNum(localStorage.getItem('UnitCode'));

	function topTen(UnitCode) {
		mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebApi/DataExchange/GetData/WebApp_GetTop10Brands?dataKey=00-00-00-00&ApplicationID=' + localStorage.getItem('ApplicationID') + '&ClassCode=&UnitCode=' + UnitCode, {

			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {

				//服务器返回响应，根据响应结果，分析是否登陆成功
				var getDatas = data['DataSource']['Tables'][0]['Datas'];
				var arrName = [];
				var arrValue = [];
				var arrFullName = [];
				var num = 0;
				if(getDatas.length == 0) {
					arrName = ['无', '无'];
					arrValue = [{
						'value': '0',
						'name': '无',
						'fullName': '无'
					}, {
						'value': '0',
						'name': '无',
						'fullName': '无'
					}];
				} else {
					mui.each(getDatas, function(index, item) {
						arrName.push(item.EnterpriseName.slice(0, 4) + '..');
						arrValue.push({
							'value': item.eqNUm,
							'name': item.EnterpriseName.slice(0, 4) + '..',
							'fullName': item.EnterpriseName + '(' + item.eqNUm + ')'
						});
						arrFullName.push(item.EnterpriseName);
						num += parseInt(item.eqNUm);
					})
				}
				document.getElementById('numSec').innerHTML = num;
				equipStatistics_sec(arrName, arrValue);
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});
	}
	topTen(localStorage.getItem('UnitCode'));

	function GetUnitEqCount(ClassCode, UnitCode) {
		mui.ajax('http://' + localStorage.getItem("serverAddress") + ':' + localStorage.getItem("portNum") + '/WebApi/DataExchange/GetData/WebApp_GetUnitEqCount?dataKey=00-00-00-00&ApplicationID=' + localStorage.getItem('ApplicationID') + '&ClassCode=' + ClassCode + '&UnitCode=' + UnitCode, {

			data: null,
			dataType: 'json', //返回
			type: 'get',
			timeout: 5000,
			success: function(data) {
				//服务器返回响应，根据响应结果，分析是否登陆成功
				var getDatas = data['DataSource']['Tables'][0]['Datas'];
				var arrVal = [];
				var arrName = [];
				if(getDatas.length == 0) {
					arrName = ['无', '无'];
					arrVal = ['0', '0'];
				} else {
					mui.each(getDatas, function(index, item) {
						arrName.push(item.OrganiseUnitName);
						arrVal.push(item.count);
					});
				}
				equipStatistics_thi(arrName, arrVal);
			},
			error: function() {
				//异常处理
				mui.toast('数据请求失败')
			}
		});
	}
	GetUnitEqCount('', localStorage.getItem('UnitCode'));
	//设备统计总数量柱状图	
	function equipStatistics_fir(arrName, arrValue) {
		var myChart = echarts.init(document.getElementById('equipStatistics_first'));
		option = {
			color: ['#738ffe'],
			backgroundColor: '#ffffff',
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			textStyle: {
				fontSzie: 8,
			},
			grid: {
				width: 500,
				show: false,
				top: '7%',
				left: '-2%',
				bottom: '3%',
				height: "90%",
				width: "100%",
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: arrName,
				axisTick: {
					show: false,
					alignWithLabel: true
				},
				splitLine: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: '#999'
					}
				},
				axisLabel: {
					show: true,
					interval: 0,
					textStyle: {
						fontSize: 9,
						color: '#666666'
					}
				},

			}],
			yAxis: [{
				type: 'value',
				axisLine: {
					show: false
				},
				splitLine: {
					show: false
				},
				axisLabel: {
					show: false
				},
				axisTick: {
					show: false
				}

			}],
			series: [{
				name: '设备数量',
				type: 'bar',
				barWidth: '60%',
				label: {
					normal: {
						show: true,
						position: "top",
					}
				},
				data: arrValue
			}]
		};

		myChart.setOption(option);
	};

	//设备统计前十品牌比例
	function equipStatistics_sec(arrName, arrValue, arrFullName) {
		var myChart = echarts.init(document.getElementById('equipStatistics_second'));
		option = {
			backgroundColor: '#ffffff',
			tooltip: {
				trigger: 'item',
				triggerOn: 'click',
				position: 'inside',
				formatter: /*"{b} : {c} ({d}%)"*/ function(params, ticket, callback) {
					return params.data.fullName
				}
			},
			legend: {
				orient: 'vertical',
				right: 10,
				top: '15%',
				textStyle: {
					fontSize: 10,
					color: '#666'
				},
				/*改变文字前图标的大小*/
				itemHeight: 10,
				itemWidth: 10,
				padding: 0,
				height: '100%',
				data: arrName
			},
			series: [{
				type: 'pie',
				radius: '60%',
				center: ['40%', '50%'],
				label: {
					normal: {
						textStyle: {
							fontSize: 11
						}
					}

				},
				labelLine: {
					normal: {
						show: true,
						length: 5,
						length2: 5,
						smooth: false,
					}
				},
				data: arrValue,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		myChart.setOption(option);
	};

	//设备统计单位设备分布
	function equipStatistics_thi(arrName, arrVal) {
		var myChart = echarts.init(document.getElementById('equipStatistics_third'));
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			backgroundColor: '#ffffff',
			grid: {
				left: '3%',
				right: '4%',
				top: 5,
				height: '100%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				axisLine: {
					show: false,
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					show: false
				},
				splitLine: {
					show: false
				},
				boundaryGap: [0, 0.01]
			},
			yAxis: {
				type: 'category',
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						fontSize: 11,
						color: "#666"
					}
				},
				/*	axisLine: {
									show: false
								},
								splitLine:{
									show:false
								},*/
				textStyle: {
					color: "#999999"
				},
				data: arrName,
			},
			series: [{
				name: '单位设备分布',
				type: 'bar',
				barGap: '80%',
				label: {
					normal: {
						show: true,
						position: 'right',
						textStyle: {
							color: "#999999"
						}
					}
				},
				barCategoryGap: "40%",
				data: arrVal,
			}, ]
		};
		myChart.setOption(option);
	}

	//实现webview侧滑模块
	main = plus.webview.currentWebview();
	/*window.addEventListener('equipStatus:all',function() {
		equipStatus(localStorage.getItem('OrganiseUnitCode'));
		fenleitongji(localStorage.getItem('ApplicationID'),localStorage.getItem('OrganiseUnitCode'));
	});*/
});

//显示菜单
function openMenu() {
	if(!showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			//document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；				
		menu.show('slide-in-right', 150, function() {
			switch(mode) {
				case 'menu-move':
					menu.setStyle({
						left: '30%',
						transition: {
							duration: 150
						}
					});
					break;
			}
		});
		//显示主窗体遮罩
	
		showMenu = true;
	}
}

function closeMenu() {
	//窗体移动
	_closeMenu();
	//

}
//关闭侧滑菜单页
function _closeMenu() {
	
	if(showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			//document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}
		switch(mode) {
			case "menu-move":
				//主窗体开始侧滑；
				menu.setStyle({
					left: '100%',
					transition: {
						duration: 150
					}
				});
				break;
		}
		//等待窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			menu.hide();
		}, 300);

		showMenu = false;
	}
}
//document.getElementById("time").addEventListener('tap',openMenu);

//重写mui.menu方法，Android版本menu按键按下可自动打开，关闭侧滑菜单；
mui.menu = function() {
	if(showMenu) {
		closeMenu();
	} else {
		openMenu();
	}
}
window.addEventListener("dtpicker:close",dtpickerClose);
function dtpickerClose () {
	
	plus.webview.currentWebview().opener().setStyle({
			mask: 'none'
		})
	_closeMenu();
}
window.addEventListener('closeMenu', _closeMenu)
		