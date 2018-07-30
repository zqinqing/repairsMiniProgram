// pages/transition/transition.js
const util = require('../../utils/util');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hintPath: ''  			//页面图片路径
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const than = this;
        console.log(options, 'options，返回二维码信息');
		if (options.scene) {
			var scene = decodeURIComponent(options.scene);
			var params = scene.split('_');
            // console.log(params, '二维码参数');
			if (params.length == 2) {
				if (params[0] == "code") { 		     // 如果二维码里面有 id
					than.isbindingqr(params[1]);     // 请求并进行判断是否绑定
				}else {
                    console.log('当前二维码没有id！');
                    /*
					wx.redirectTo({
						url: '../scan/scan'
					})*/
                }
			}else if (params.length == 3) {
                console.log('当有三个参数时，是旧二维码，直接跳转报修页面')
                wx.redirectTo({// 跳转到报修页面   跳转到报修页面需要携带参数跳转
                    url: '../index/index?school_id=' + params[0] + '&room_id=' + params[1],
                })
            }
		}else{
            wx.redirectTo({
                url: '../scan/scan',
            }) 
        }
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		this.setData({
			hintPath: "http://tuofu." + util.host + "/operation/img/apps/transition.png"
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
	 * 定义全局变量
	 */
	globalData: {
		apiUrl: "https://www." + util.host + "/",
		loginCode: '',
		unionid: '',
		openid: ''
	},
    /**
	 *  判断当前二维码是否绑定
	 */
    isbindingqr(id) {
        const than = this;
        wx.request({
            url: than.globalData.apiUrl + 'qr/info/' + id,
            success: function (res) {
                console.log(res, '返回请求数据, 二维码判断是否绑定');
                if (res.data.code == 0) { // 二维码已绑定
                    var school_id = res.data.data.school_id,
                        room_id = res.data.data.room_id;
                    wx.redirectTo({// 跳转到报修页面   跳转到报修页面需要携带参数跳转
                        url: '../index/index?school_id=' + school_id + '&room_id=' + room_id,
                    })
                } else {  // 未绑定
                    wx.setStorage({
                        key: 'bind_id',
                        data: id,
                        success: function (res) {
                            // console.log(res, '二维码扫码获取的code参数, 存储成功!');
                        },
                        fail: function (res) {
                            // console.log(res, '二维码扫码获取的code参数, 存储失败!');
                        },
                        complete: function (res) { },
                    })
                    than.gainLoginInfo(); // 去请求判断管理员权限
					/*
					wx.redirectTo({
						url: '../bind/bind',
					})*/
                }
            }
        });
    },
    /**
     * 判断是否已有个人信息缓存
     */
    gainLoginInfo() {
        var _this = this;
        wx.getStorage({
            key: 'admin',
            complete: function (res) {
                if (res.errMsg === "getStorage:ok") {
                    // console.log(res, '请求成功! complete');
                    var data = JSON.parse(res.data);
                    // console.log(data.schools.length)
                    if (data) { // 判断当前admin是否存在
                        if (data.schools.length > 0) {
                            wx.redirectTo({
                                url: '../bindqr/bindqr'
                            })
                        } else {	  // 没权限 跳转到联系管理员页面
                            wx.redirectTo({
                                url: '../not-bound/not-bound'
                            })
                        }
                    }
                } else {
                    console.log(res, '获取个人信息缓存失败! complete');
                    _this.getLoginCode();
                }
            },
        })
    },
    /**
     * 获取微信登录code
     */
    getLoginCode() {
        var _this = this;
        wx.login({
            success: function (res) {
                // console.log(res, 'getLoginCode')
                if (res.errMsg === 'login:ok' && res.code !== '') {
                    _this.getUnionid(res.code);
                }
            },
            fail: function (res) {
                console.log('login登录获取数据失败', res);
            },
            complete: function (res) { },
        })
    },
    /**
     * 获取unionid
     */
    getUnionid(code) {
        const _this = this;
        if (code) {
            var url = "https://www." + util.host + "/weixinweb/xiaochengcxulogin/" + code;
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (response) {
                    if (response.statusCode === 200 && response.data.code === 0) {
                        // console.log(response, 'unionid and openid存储')
                        if (response.data.openid !== '') {
                            _this.getAdminJurisdiction(response.data.openid); // 获取管理员信息
                        }
                    }
                },
                fail: function (res) {
                    console.log('getUnionid获取数据失败', res);
                },
                complete: function (res) { },
            })
        }
    },
    /**
     * 
     */
    getAdminJurisdiction(openid) {
        const _this = this;
        // console.log(openid)
        if (openid) {
            const url = "https://www." + util.host + "/weixinweb/loadadmininfobyunion/" + openid;
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (response) {
                    // console.log(response, 'getAdminJurisdiction')
                    if (response.statusCode === 200 && response.data.code === 0) {
                        var data = response.data.data,
                            schoolsData = JSON.stringify(data.schools),
                            adminData = JSON.stringify(data);
                        // console.log(schoolsData)
                        // wx.setStorage({  // 缓存学校列表
                        //     key: "schools",
                        //     data: schoolsData
                        // })
                        wx.setStorage({  // 缓存管理员用户信息
                            key: "admin",
                            data: adminData,
                            success: function () {
                                _this.gainLoginInfo(); // 再次返回获取缓存判断去哪个页面
                            }
                        })
                    }
                },
                fail: function (res) { },
                complete: function (res) { },
            })
        }
    },
})