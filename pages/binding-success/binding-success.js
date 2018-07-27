// pages/binding-success/binding-success.js
var util = require('../../utils/util');
//获取应用实例
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * 跳转页面
     */
    continuebind: function () {
        /*
        wx.redirectTo({
            url: '../scan/scan',
        })*/
        var than = this;
        wx.scanCode({
            onlyFromCamera: true,
            scanType: ['qrCode'],
            success: function (response) {
                console.log(response, '获取扫码之后得到的信息')
                var qrcode = response.path.split('=')[1].split('_');
                if (qrcode.length === 2) { // 判断长度
                    if (qrcode[0] == "code") { 	   // 如果二维码里面有 id
                        wx.redirectTo({
                            url: "../../" + response.path,
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
            fail: function (error) {
                console.log(error, '扫描二维码获取id失败!');
            }
        });
    },
    /**
     * 退出页面
     */
    /*
    quit: function () {
        wx.navigateBack({
            delta: 1
        })
    }*/
})