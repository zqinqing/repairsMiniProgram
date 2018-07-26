// pages/success/success.js
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
        wx.setNavigationBarTitle({
            title: '成功'
        })
    },

    goHistory:function(){
        wx.navigateTo({
            url: '../work-order-list/work-order-list',
        })
    }
})