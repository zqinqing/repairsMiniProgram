// pages/scan/scan.js
var util = require('../../utils/util');
//获取应用实例
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		picUrl: ''       // 页面二维码图片地址
	},
	startScan: function(){
		var than = this;
		wx.scanCode({
			onlyFromCamera:true,
			scanType: ['qrCode'],
			success: function (response){
				console.log(response, '获取扫码之后得到的信息')
                var qrcode = response.path.split('=')[1].split('_');
                if (qrcode.length === 2){ // 判断长度
                    if (qrcode[0] == "code") { 	   // 如果二维码里面有 id
                        
                        wx.redirectTo({
                            url: "../../"+response.path,
                        })
                    
                        /*
                        var url = than.globalData.url + "qr/info/" + qrcode[1];
                        than.isbindingqr(url);     // 请求并进行判断是否绑定
                        */
                    } else {
                        console.log('当前二维码没有id！');
                        wx.redirectTo({
                            url: '../scan/scan'
                        })
                    }
                } else if (qrcode.length == 3) {
                    wx.redirectTo({// 跳转到报修页面   跳转到报修页面需要携带参数跳转
                        url: '../index/index?school_id=' + qrcode[0] + '&room_id=' + qrcode[1],
                    })
                }

				// result	 所扫码的内容
				// scanType  所扫码的类型
				// charSet	 所扫码的字符集
				// path	     当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
				// rawData	 原始数据，base64编码
				/*
					wx.navigateTo({ // 打开新页面
						url: "../../" + response.path
					})
					wx.redirectTo({ // 重定向
						url: "../../" + response.path
					})
				*/
			},
			fail: function(error){
				console.log(error, '扫描二维码获取id失败!');
			}
		});
	},
	goList: function () {
        wx.navigateTo({
            // url: '../list/list' // 之前跳转的页面
            url: '../work-order-list/work-order-list'
		})
	}, 
    /**
     * 判断二维码是否绑定
     */
    /*
	isbindingqr: function (url){
		wx.request({
			url: url,
			data: {},
			method: 'GET',
			success: function (response) {
				if (response.statusCode === 200) {
					console.log(response)
					if (response.data.code === 0) { // 已绑定时
                        console.log(response, '已绑定!');
                        var school_id = response.data.data.school_id,
                            room_id = response.data.data.room_id;
                        wx.redirectTo({// 跳转到报修页面   跳转到报修页面需要携带参数跳转
                            url: '../index/index?school_id=' + school_id + '&room_id=' + room_id,
                        })
					} else { // 未绑定时
						console.log('未绑定!'); // 跳转未绑定页面，前去绑定教室id
                        wx.redirectTo({// 打开新页面 前去未绑定id页面
                            url: "../not-bound/not-bound",
                        })
					}
				} else {
					console.log('网络繁忙，获取unionId失败！')
				}
			},
			fail: function (error) {
				console.log(error)
			}
		})
	},*/
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({
			title: '扫码报修'
		});
	},
  	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({
			picUrl: "http://tuofu."+util.host+"/operation/img/apps/qrcode.png"
		})
	},
	globalData: {
		url: "https://www." + util.host + "/",
		getQrCodeStateUrl: ''
	}
})