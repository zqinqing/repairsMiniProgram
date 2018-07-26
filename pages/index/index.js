//index.js
var util = require("../../utils/util.js");

//获取应用实例
const app = getApp();

Page({
    data: {
        popHidden: true,
        school_name: "",
        room_name: "",
        videoPreview: true,
        videowidth: 0,
        videosrc: '',
        videoadd: false,
        btn_opacity: 0.4,
        videoicon: ''
    },
    globalData: {
        hasVideo: false,
        fileType: 0,
        faultText: '',
        userinfo: {

        },
        formIds: []
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function(options) {
        console.log(options, '进入报修页面，输出跳转过来的所带参数');
        /*
        if (util.flag) { // 判断如果flag为true，退出
            wx.navigateBack({
                delta: 1
            })
        } else {
            console.log('这里是index')
        }
        */

        wx.setNavigationBarTitle({
            title: '报修'
        })
        var _this = this;
        wx.getSystemInfo({
            success: function(res) {
                _this.setData({
                    videowidth: res.screenWidth - 32
                })
            }
        });
        if (options.school_id && options.room_id) {
            this.globalData.school_id = options.school_id;
            this.globalData.room_id = options.room_id;
            this.loadRoomInfo();
        } else if(options.scene) {
            var scene = decodeURIComponent(options.scene);
            var params = scene.split('_');
            this.globalData.school_id = params[0];
            this.globalData.room_id = params[1];
            this.loadRoomInfo();
        }
        
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://www.' + util.host + '/weixinweb/xiaochengcxulogin/' + res.code,
                        success: function (res) {
                            if (res.data.code == 0) {
                                if (res.data.unionid) {
                                    _this.globalData.userinfo.unionid = res.data.unionid;
                                }
                                if (res.data.openid) {
                                    _this.globalData.userinfo.mp_openid = res.data.openid;
                                }
                                wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (obj) {
                                        _this.globalData.userinfo.nickname = obj.userInfo.nickName;
                                        _this.globalData.userinfo.head_img = obj.userInfo.avatarUrl;
                                        _this.globalData.userinfo.sex = obj.userInfo.gender;
                                        if (_this.globalData.userinfo.unionid) {
                                            _this.createUser();
                                        } else {
                                            var item = {
                                                mp_openid: _this.globalData.userinfo.mp_openid,
                                                encryptedData: obj.encryptedData,
                                                iv: obj.iv
                                            }
                                            wx.request({
                                                url: 'https://www.' + util.host + '/xiaochengxu/decodeunionid',
                                                data: item,
                                                method: 'POST',
                                                success: function (res) {
                                                    if (res.data.unionid) {
                                                        _this.globalData.userinfo.unionid = res.data.unionid;
                                                    }
                                                    _this.createUser();
                                                }
                                            });
                                        }

                                    },
                                    fail: function (obj) {
                                        if (obj.errMsg) {
                                            _this.globalData.userinfo.nickname = "匿名用户";
                                            _this.globalData.userinfo.head_img = "";
                                            _this.globalData.userinfo.sex = "2";
                                            _this.createUser();
                                        }
                                    }
                                });
                            }
                        }
                    })
                }

            }
        });        

    },
    loadBindedRoom(id) {
        wx.request({
            url: 'https://www.' + util.host + '/qr/info/' + id,
            success: function(res) {
                console.log(res);
                if (res.data.code == 0) {

                } else {
                    wx.redirectTo({
                        url: '../bind/bind',
                    })
                }

            }
        });
    },
    formSubmit: function(e) {
        console.log('进入!')
        this.globalData.formIds.push(e.detail.formId);
        this.saveFaultRec();
    },
    checkAuthKey: function() {
        wx.request({
            url: 'https://www.' + util.host + '/operation/checkauthkey/' + this.globalData.school_id + "/" + this.globalData.auth_key,
            success: function(res) {
                if (res.data.code != 0) {
                    if (res.data.code == -2) {

                    } else {
                        wx.redirectTo({
                            url: '../scan/scan',
                        })
                    }
                }
            }
        });
    },
    loadRoomInfo: function() {
        var _this = this;
        wx.request({
            url: 'https://www.' + util.host + '/weixinweb/operation/loadroominfo/' + this.globalData.school_id + "/" + this.globalData.room_id,
            success: function(res) {

                if (res.data.code == 0) {
                    var data = res.data.data;
                    _this.globalData.building_id = data.building_id;
                    _this.globalData.building_name = data.building_name;
                    _this.globalData.room_name = data.room_name;
                    _this.setData({
                        school_name: data.school_name,
                        room_name: data.building_name + "  " + data.room_name
                    })
                }
            },
            fail: function(res) {
                wx.showToast({
                    title: JSON.stringify(res),
                    icon: 'none',
                    duration: 3000
                });
            }

        });
    },
    selectVideo: function(e) {
        var _this = this;
        this.globalData.formIds.push(e.detail.formId);
        wx.chooseVideo({
            sourceType: ['camera'],
            maxDuration: 20,
            success: function(res) {
                _this.globalData.hasVideo = true;
                _this.setData({
                    videoPreview: false,
                    videosrc: res.tempFilePath,
                    videoadd: true,
                    btn_opacity: 1
                })
            }
        })
    },
    createUser: function() {
        var _this = this;
        /**
         * 创建用户
         */
        var ui = this.globalData.userinfo;
        wx.request({
            url: 'https://www.' + util.host + '/operation/createuser',
            method: 'POST',
            data: ui,
            success: function(res) {
                if (res.data.code == 0) {
                    var data = res.data;
                    _this.globalData.user_id = data.user_id;
                }
            }
        });
    },

    uploadFiles: function(type) {
        var _this = this;
        wx.showLoading({
            title: '上传文件中...',
            mask: true
        })
        var data = this.data;
        // console.log('进入', 'type:', type, 'data', data)
        if (type == 0) {
            wx.uploadFile({
                name: 'upfile',
                url: 'https://www.' + util.host + '/weixinweb/xiaochengcxufile/0',
                filePath: data.videosrc,
                success: function(res) {
                    var resData = JSON.parse(res.data);
                    wx.hideLoading();
                    _this.postData(0, [resData.url])
                }
            });
        }
    },
    saveFaultRec: function() {
        var globalData = this.globalData;
        var ui = globalData.userinfo;
        if (!globalData.user_id) {
            console.log("未创建用户");
            this.createUser();
            return;
        } else {
            if (this.globalData.fileType == 0) {
                if (this.data.videosrc != '') {
                    this.uploadFiles(0);
                } else {
                    wx.showToast({
                        title: '请先拍摄一段故障小视频',
                        icon: 'none'
                    })
                }
            } else {
                if (this.data.photoArr[0] != 'http://tuofu.' + util.host + '/public/img/add.png') {
                    this.uploadFiles(1);
                } else {
                    this.postData();
                }
            }
        }

    },
    postData: function(type, urls) {
        var data = this.data;
        var globalData = this.globalData;

        var item = {
            device: 0,
            deviceName: "",
            fault_type: 0,
            faultName: "",
            detail: "",
            school_id: globalData.school_id,
            room_id: globalData.room_id,
            user_id: globalData.user_id,
            building_id: globalData.building_id,
            nickname: globalData.userinfo.nickname,
            isimportent: 0,
            groupname: globalData.building_name,
            roomname: globalData.room_name,
            form_id: globalData.formIds.join("_")
        }
        if (urls != 'undefined') {
            item.imgs = urls;
            item.img_type = type;
        }
        wx.request({
            url: 'https://www.' + util.host + '/weixinweb/baoxiu/baoxiu',
            data: item,
            method: 'POST',
            success: function(res) {
                var data = res.data;
                if (data.code == 0) {
                    wx.redirectTo({
                        url: '../success/success'
                    })
                } else {
                    wx.showToast({
                        title: '报修失败',
                        icon: 'none'
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            videoicon: "http://tuofu." + util.host + "/operation/img/apps/shoot.png"
        })
    }
})