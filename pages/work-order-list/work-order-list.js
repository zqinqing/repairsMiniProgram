// pages/work-order-list/work-order-list.js
const util = require('../../utils/util');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nodata: '',         // 当无数据时，展示图片路径
        nodatashow: false,  // 是否展示无数据图片
        lowendtip: false,   // 是否展示数据已经加载完毕
        datum: {},          // 页面循环数据

        pageNum: 1,          // 设置加载的第几次，默认是第一次
        isFirstLoad: true,   // 用于判断List数组是不是空数组，默认true，空的数组
        hasMore: false,      // “加载更多”
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this,
            data = _this.data.datum;
        if (JSON.stringify(data) === '{}'){
            wx.showLoading({
                title: '加载中',
                mask: true,
            })
        }
        this.getUserInfo(); // 获取用户信息
    },

    /**
	 * 生命周期函数--监听页面初次渲染完成
	 */
    onReady: function () {
        this.setData({
            nodata: "http://tuofu." + util.host + "/operation/img/apps/transition.png"
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad(); //再次加载，实现进入页面刷新
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
     * 获取用户信息
     */
    getUserInfo: function(){
        const _this = this;
        wx.getStorage({
            key: 'admin',
            success: function (res) {
                if (res.errMsg === 'getStorage:ok') {
                    var data = JSON.parse(res.data);
                    // console.log(data, '加载本地缓存信息')
                    var url = 'https://www.' + util.host + '/usr/' + data.userid + '/' + data.session + '/operation/getmyreport';
                    // console.log(url, '获取请求的url')
                    _this.getWorkOrderList(url);
                }
            },
            fail: function (res) {
                console.log(res, "获取本地用户缓存失败!");
                _this.loginCode();  // 重新登录获取用户信息            
            },
            complete: function (res) {},
        })
    },
    /**
     * 登录，获取login code
     */
    loginCode: function(){
        let _this = this;
        wx.login({
            success: function(res) {
                if (res.errMsg === "login:ok"){
                    // console.log(res, '登录获取code成功!');
                    _this.getUnionid(res.code);
                }
            },
            fail: function(res) {
                console.log(res, '登录获取code失败!');
            },
            complete: function(res) {},
        })
    },
    /** 
     * 通过login code 获取用户信息
     */
    getUnionid: function(code){
        let _this = this,
            url = "https://www." + util.host + "/weixinweb/xiaochengcxulogin/" + code;
        wx.request({
            url: url,
            data: '',
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
                if (res.statusCode === 200){
                    console.log(data);
                    let data = JSON.stringify(res.data);
                    wx.setStorage({  // 缓存管理员用户信息
                        key: "admin",
                        data: data,
                        success: function(res) {
                            _this.getUserInfo(); // 重新获取列表数据
                        }
                    })
                }
            },
            fail: function(res) {
                console.log(res, '获取unionid失败!');
            },
            complete: function(res) {},
        })
    },
    /**
     * 获取工单列表数据
     */
    getWorkOrderList: function(url){
        const _this = this;
        wx.request({
            url: url,
            data: '',
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
                if (res.errMsg === "request:ok" && res.data.code === 0){
                    console.log(res, '获取工单列表数据成功')
                    if (res.data.data.length > 0){
                        _this.setData({
                            datum: res.data.data,
                            lowendtip: true
                        })
                    }else {
                        if (res.data.data.length === 0){
                            _this.setData({
                                nodatashow: true
                            })
                        }
                    }
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 300)
                }
            },
            fail: function (res) { 
                console.log(res, "获取工单列表数据失败!");
                _this.setData({
                    nodatashow: true
                })
            },
            complete: function (res) { },
        })
    },
    /**
     * 前往工单详情页
     */
    godetails: function(e) {
        const _this = this;
        var fault_id = e.currentTarget.dataset.fault_id,
            school_id = e.currentTarget.dataset.school_id,
            status = e.currentTarget.dataset.status,
            navigateUrl = '../work-order-details/work-order-details?scene=f' + fault_id + 's' + school_id;
        // console.log("status:", status, "fault_id:", fault_id, "school_id:", school_id, '前往工单详情页');
        console.log(navigateUrl);
        wx.navigateTo({
            url: navigateUrl
        })
    }
})