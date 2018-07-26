// pages/school-list/school-list.js
var util = require('../../utils/util');
//获取应用实例
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolslist: []
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
        const than = this;
        wx.getStorage({
            key: 'schools',
            success: function (res) {
                console.log(res.data, '学校列表页面!')
                than.setData({        // 设置学校列表循环数据
                    schoolslist: JSON.parse(res.data)
                })
            }
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
     * 跳转楼栋选择页面
     */
    gochoice: function(event){
        console.log(event);
        const id = event.target.dataset.id;
        // 带id参数跳转选择页面
        wx.navigateTo({
            url: '../choice/choice?id=' + id
        })
        /*
        wx.removeStorage({
            key: 'schools',
            success: function (res) {
                console.log(res.data, '移除schools本地缓存！')
            }
        })*/
    }
})