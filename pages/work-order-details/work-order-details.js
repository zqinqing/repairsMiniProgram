// pages/work-order-details/work-order-details.js
const util = require('../../utils/util');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        datum: '',          // 页面数据请求
        alist: '',          // 用户回复列表
        adminInfo: '',      // 用户信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
            mask: true,
        })  

        var _this = this,
            arr = options.scene.split('f')[1].split('s'),
            fault_id = arr[0],
            school_id = arr[1];
        // console.log(fault_id, school_id, options);
        _this.setData({
            fault_id: parseInt(fault_id),
            school_id: parseInt(school_id),
        })
        _this.getUserInfo();              
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
     * 获取用户信息
     */
    getUserInfo: function () {
        var _this = this,
            fault_id = _this.data.fault_id,
            school_id = _this.data.school_id;
        if (fault_id && school_id) {
            // console.log(fault_id, school_id);
            wx.getStorage({
                key: 'admin',
                success: function (res) {
                    if (res.errMsg === "getStorage:ok") {
                        var data = JSON.parse(res.data);
                        // console.log(data, '工单详情获取本地用户信息缓存成功!');
                        data.fault_id = fault_id;
                        data.school_id = school_id;
                        if (data.fault_id && data.school_id) {
                            _this.setData({
                                adminInfo: data
                            })
                            console.log(_this.data.adminInfo);
                            _this.getReportDetails();  // 获取用户获取报修详情
                            _this.getReplyToList();    // 获取用户获取检修回复列表
                            setTimeout(function () {
                                wx.hideLoading();
                            }, 300)
                        }
                    }
                },
                fail: function (res) {
                    console.log(res, '工单详情获取本地用户信息缓存失败!');
                    _this.loginCode();  // 重新登录获取用户信息
                },
                complete: function (res) { },
            })
        }  
    },
    /**
     * 登录，获取login code
     */
    loginCode: function () {
        let _this = this;
        wx.login({
            success: function (res) {
                if (res.errMsg === "login:ok") {
                    // console.log(res, '登录获取code成功!');
                    _this.getUnionid(res.code);
                }
            },
            fail: function (res) {
                console.log(res, '登录获取code失败!');
            },
            complete: function (res) { },
        })
    },
    /** 
     * 通过login code 获取用户信息
     */
    getUnionid: function (code) {
        let _this = this,
            url = "https://www." + util.host + "/weixinweb/xiaochengcxulogin/" + code;
        wx.request({
            url: url,
            data: '',
            header: {},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
                if (res.statusCode === 200) {
                    let data = JSON.stringify(res.data);
                    // console.log(data);
                    wx.setStorage({  // 缓存管理员用户信息
                        key: "admin",
                        data: data,
                        success: function (res) {
                            _this.getUserInfo(); // 重新获取列表数据
                        }
                    })
                }
            },
            fail: function (res) {
                console.log(res, '获取unionid失败!');
            },
            complete: function (res) { },
        })
    },
    /**
     * 用户获取报修详情
     */
    getReportDetails: function(){
        // console.log(data);
        if (this.data.adminInfo !== ''){
            var _this = this,
                data = _this.data.adminInfo,
                url = 'https://www.'
                    + util.host
                    + '/usr/'
                    + data.userid
                    + '/'
                    + data.session
                    + '/operation/getmodifydetail/'
                    + data.school_id + '/'
                    + data.fault_id;
            // console.log(url);
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (response) {
                    if (response.errMsg === "request:ok") {
                        // console.log(response.data.data, '获取用户获取报修详情成功！');
                        _this.setData({
                            datum: response.data.data[0]
                        })
                        // console.log(_this.data.datum, '获取用户获取报修详情成功！');
                        if (response.data.data[0].status === 2 || response.data.data[0].status === 3){
                            _this.commentroll();       // 判断是否需要评论
                        }
                    }
                },
                fail: function (res) {
                    console.log(res, '获取用户获取报修详情失败!')
                },
                complete: function (res) { },
            })
        }else {
            console.log('用户信息获取错误，请给正确的设备保修id以及学校id!');
        }
    },
    /**
     * 用户获取检修回复列表 /usr/:userid/:session/operation/getreplylist/:school_id/:recid/:page/:offset
     */
    getReplyToList(){
        // console.log(this.data.adminInfo)
        if (this.data.adminInfo !== '') {
            var _this = this,
                data = _this.data.adminInfo,
                url = 'https://www.' + util.host + '/usr/' 
                + data.userid  + '/'
                + data.session 
                + '/operation/getreplylist/'
                + data.school_id + '/'
                + data.fault_id;
            // console.log(url)
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (response) {
                    if (response.statusCode === 200 && response.data.code === 0) {
                        var arr = response.data.data;
                        if (arr.length > 0){
                            // console.log(response.data, '用户获取检修回复列表数据获取成功！');
                            // console.log(response.data.data, '用户获取检修回复列表数据获取成功！');
                            var aimg = [],
                                data = response.data.data;
                            data.forEach((value, index, arr) => {
                                /*
                                if (value.reply_desc.indexOf('程:') !== -1) {
                                    data[index].reply_desc = data[index].reply_desc.replace('程:', '程:\n')
                                }
                                if (value.reply_desc.indexOf('备:') !== -1) {
                                    data[index].reply_desc = data[index].reply_desc.replace('备:', '备:\n')
                                }
                                */
                                if (value.reply_desc.indexOf('<br />') !== -1){
                                    data[index].reply_desc = data[index].reply_desc.replace('<br />','\n')
                                }
                                if (value.reply_imgs !== ""){
                                    var arr = value.reply_imgs.split(',');
                                    for(let i in arr){
                                        aimg.push(arr[i]);
                                    }
                                    data[index].reply_imgs = aimg;
                                }
                                // console.log(value);
                            })
                            _this.setData({
                                alist: data
                            })
                        }else {
                            _this.setData({
                                alist: []
                            })
                        }
                    }
                },
                fail: function (res) {
                    console.log(res, '用户获取检修回复列表数据获取失败!')
                },
                complete: function (res) { },
            })
        }
    },
    /**
     * 图片预览
     */
    changePreview: function(event){
        var _this = this,
            at = event.currentTarget.dataset.src,
            arr = event.currentTarget.dataset.arr;
        // console.log(event)
        wx.previewImage({
            current: at,
            urls: arr
        })
    },
    /**
     * 催单
     */
    reminder: function(){
        var _this = this,
            data = _this.data.adminInfo;
        console.log(data);
        if (data.school_id && data.fault_id){
            var url = 'https://www.' + util.host + '/usr/'
                + data.userid + '/'
                + data.session
                + '/operation/speedup/'
                + data.school_id + '/'
                + data.fault_id;
            console.log(url)
            wx.showModal({
                title: '催单',
                content: '确认催促检修员加速处理吗？',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        wx.request({
                            url: url,
                            data: '',
                            header: {},
                            method: 'GET',
                            dataType: 'json',
                            responseType: 'text',
                            success: function (res) {
                                if (res.statusCode === 200 && res.data.code === 0){
                                    console.log(res, '催单成功');
                                    wx.showToast({
                                        title: '催单成功!',
                                        icon: 'success'
                                    })
                                } else if (res.data.code === -2) {
                                    wx.showToast({
                                        title: '请勿频繁操作!',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            },
                            fail: function (res) {
                                console.log(res, '催单失败!')
                            },
                            complete: function (res) { },
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    /**
     * 是否需要评论  /usr/:userid/:session/operation/checkscored/:school_id/:recid
     */
    commentroll: function(){
        var _this = this,
            data = this.data.adminInfo,
            url = 'https://www.' + util.host + '/usr/' 
                + data.userid + '/'
                + data.session
                + '/operation/checkscored/'
                + data.school_id + '/'
                + data.fault_id
        // console.log(data, '进入是否需要评论环节');
        if (data !== '') {
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function(response) {
                    if (response.statusCode === 200 && response.data.code === 0){
                        var datum = response.data.data;
                        // console.log(datum)
                        if (datum.length === 0) {
                            console.log('需要评论!');
                            var commentUrl = '../comment/comment'
                                + '?userid=' + data.userid
                                + '&session=' + data.session
                                + '&school_id=' + data.school_id
                                + '&recid=' + data.fault_id;
                            // sconsole.log(commentUrl)
                            setTimeout(function(){
                                wx.navigateTo({
                                    url: commentUrl,
                                })
                            },1000)
                        } else {
                            console.log('暂不需要评论!');
                        }
                    }else {
                        console.log(response, '信息获取有误!')
                    }
                },
                fail: function(res) {
                    console.log(res, '获取是否需要评论接口失败!')
                },
                complete: function(res) {},
            })
        }
    },
    /**
     * 投诉建议  /usr/:userid/:session/operation/postsuggest
     */
    complaint: function(){
        let _this = this,
            data = _this.data.adminInfo;
        if (data !== ''){
            // console.log(data);
            var url = 'https://www.' + util.host + '/usr/' + data.userid + '/' + data.session + '/operation/postsuggest',
                path = '../complaint/complaint?submitpath=' + url 
                     + '&school_id=' + data.school_id 
                     + '&rec_id=' + data.fault_id;
            // console.log(path); 
            wx.navigateTo({
                url: path,
            })
        }
    }
})

