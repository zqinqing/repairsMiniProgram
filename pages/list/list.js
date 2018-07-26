var util = require("../../utils/util.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailSrc: ""
    },
    globalData: {
        userinfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        wx.showNavigationBarLoading();
        wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://www.'+util.host+'/weixinweb/xiaochengcxulogin/' + res.code,
                        success: function (res) {
                            if (res.data.code == 0) {
                                if (res.data.openid) {
                                    var openid = res.data.openid;
                                    _this.reqUserInfo(openid);
                                }

                            }
                        }
                    })
                }
            }
        });
    },
    reqUserInfo: function (openid) {
        var _this = this;
        wx.request({
            url: 'https://www.' + util.host + '/weixinweb/loaduserinfobyopenid/' + openid,
            method: 'GET',
            success: function (res) {
                console.log(res, 'list列表页返回数据!')
                wx.hideNavigationBarLoading(); // 隐藏导航条加载动画
                /*
                var data = res.data.data,
                    userid = data.userid,
                    session = data.session,
                    src = "https://www."
                        + util.host
                        + "/operation/pages/smallprogram/work-order.html?userid="
                        + userid
                        + "&session="
                        + session
                        + "&issmallprogram=1"
                        + "&https=1";

                console.log(src);
                _this.setData({
                    listSrc: src
                });
                */
                
                var data = res.data.data,
                    schools = data.schools;
                if (schools && schools.length == 1) {
                    var src = "https://www."
                        + util.host
                        + "/operation/pages/usr/myreport.html?source=xcx&userid="
                        + data.userid
                        + "&nickname="
                        + encodeURIComponent(data.nick_name)
                        + "&headimg="
                        + encodeURIComponent(data.head_img)
                        + "&session=" + data.session + "&schoolid=" + data.schools[0].id + "&notitle=1&https=1";
                } else {
                    var src = "https://www."
                        + util.host 
                        + "/operation/pages/usr/selectschool.html?source=xcx&userid=" 
                        + data.userid 
                        + "&nickname="
                        + encodeURIComponent(data.nick_name) 
                        + "&headimg="
                        + encodeURIComponent(data.head_img) 
                        + "&session="
                        + data.session 
                        + "&schools="
                        + encodeURIComponent(JSON.stringify(schools));
                }
                console.log(src);
                _this.setData({
                    listSrc: src
                });
                
            }
        });
    }
})