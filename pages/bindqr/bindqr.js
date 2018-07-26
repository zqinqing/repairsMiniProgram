// pages/bindqr/bindqr.js
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '绑定设备二维码'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            picUrl: "http://tuofu." + util.host + "/operation/img/apps/bindqr.png"
        })
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
     * 绑定二维码判断
     */
    bindqr: function(){
        wx.getStorage({
            key: 'schools',
            success: function (res) {
                console.log(res.data, '立即绑定页面')
                var arr = JSON.parse(res.data);
                if (arr.length > 1) { // 跳转学校列表页面
                    console.log('schools长度大于1');
                    wx.navigateTo({
                        url: '../school-list/school-list'
                    })
                }else {              // 当学校列表只有1个的时候，直接跳转楼栋选择页面
                    console.log('school长度等于1');
                    const id = arr[0].id;
                    // 带id参数跳转选择页面
                    wx.navigateTo({
                        url: '../choice/choice?id=' + id
                    })
                }
            }
        })
        
    }
})