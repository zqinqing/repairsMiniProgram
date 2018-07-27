// pages/comment/comment.js
const util = require('../../utils/util');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        remark: [
            {
                name: '处理速度',
                score: 0
            },
            {
                name: '服务质量',
                score: 0
            },
            {
                name: '服务态度',
                score: 0
            }
        ],
        datum: '',        // 数据
        submitswitch: false, // 提交开关
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        this.setData({
            datum: options
        })
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
     * 评分
     */
    grade: function(event) {
        var _this = this,
            _array = this.data.remark,
            index = event.currentTarget.dataset.index,
            status = event.currentTarget.dataset.status;
        if (index + 1 && status + 1){
            _array[status].score = (index + 1);
            var num = 0;
            _array.forEach((vaule, index, array) => {
                if (_array[index].score > 0) {
                    num++;
                }
            })
            _this.setData({
                remark: _array,
                submitswitch: num === 3 ? true : false,
            })
        }
        //console.log(_array)
    },
    /**
     * 提交评论  /usr/:userid/:session/operation/scorefinishrec/:school_id/:recid/:speed_score/:quality_score/:attitude_score
     */
    submitcomments: function(){
        var _this = this,
            datum = this.data.datum,
            remark = this.data.remark,
            off = true;
        remark.forEach((value, index, arr) => {
            if (remark[index].score === 0){
                off = false;
            }
        })
        // console.log(datum)
        if (off && datum !== ''){
            // console.log('可以进行提交');
            var url = 'https://www.'
                + util.host
                + '/usr/'
                + datum.userid + '/'
                + datum.session 
                + '/operation/scorefinishrec/'
                + datum.school_id + '/'
                + datum.recid + '/'
                + remark[0].score + '/'
                + remark[1].score + '/'
                + remark[2].score;
            // console.log(url)
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function(response) {
                    if (response.statusCode === 200 && response.data.code === 0){
                        console.log(response, '评价提交成功!');
                        wx.showToast({
                            title: '提交成功!',
                            icon: 'success',
                            success: function(response){
                                setTimeout(function(){
                                    wx.navigateBack({
                                        delta: 1,
                                    })
                                }, 2000)
                            }
                        })
                    }
                },
                fail: function(res) {
                    console.log(res, '评价提交失败！')
                },
                complete: function(res) {},
            })
        }else {
            if (!off){
                wx.showToast({
                    title: '请对此次维修进行完整的评价',
                    icon: 'none',
                })
            }
            console.log('数据有误, 不能提交！ off:', off, 'datum:', datum);
        }
    }
})