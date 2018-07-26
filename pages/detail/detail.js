// pages/detail/detail.js

var util = require("../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailSrc: ""
    },
    globalData:{
        userinfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var scene = options.scene;
        console.log(scene)
        var ps = scene.split("_");
        var _this=this;
        wx.login({
            success: function (res) {
                if (res.code) {
                //发起网络请求
                    wx.request({
                        url: 'https://www.' + util.host+'/weixinweb/xiaochengcxulogin/' + res.code,
                        success: function (res) {
                            if (res.data.code == 0) {
                                if (res.data.unionid) {
                                    console.log(res.data);
                                    var unionid=res.data.unionid;
                                    _this.reqUserInfo(unionid,ps);
                                }
                                
                            }
                        }
                    })
                }

            }
        });
    },
    reqUserInfo:function(unionid,ps){
        var _this=this;
            wx.request({
            url: 'https://www.' + util.host+'/weixinweb/loaduserinfobyunion/' + unionid,
            method: 'GET',
            success: function (res) {
                var data=res.data.data;
                var url = "https://www." 
                        + util.host
                        +"/operation/pages/baoxiu/userdetail.html?recid=" 
                        + ps[1] 
                        + "&source=xcx&userid=" 
                        + data.userid 
                        + "&nickname=" 
                        + encodeURIComponent(data.nick_name) 
                        + "&headimg=" 
                        + encodeURIComponent(data.head_img) 
                        + "&session=" 
                        + data.session 
                        + "&schoolid=" 
                        + ps[0] 
                        + "&https=1#page1";
                _this.setData({        
                    detailSrc: url
                })
            }
        });
    }
})