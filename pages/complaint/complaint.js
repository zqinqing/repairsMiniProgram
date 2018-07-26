// pages/complaint/complaint.js
const util = require('../../utils/util');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        radioData: {
            arr: ['建议', '投诉'],
            state: 0
        },
        text: '',        // textarea
        imgs: [],        // 图片数组
        uploadingpath: '',    // 上传图片
        path: 'http://desk.fd.zol-img.com.cn/t_s1920x1080/g5/M00/05/0C/ChMkJ1l_JRCIA-oAAAS5EW43hXUAAfSaAEVxL8ABLkp466.jpg'
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
        this.setData({
            uploadingpath: "http://tuofu." + util.host + "/operation/img/apps/camera.png"
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
     * 状态选择
     * radioData: {
            arr: ['建议', '投诉'],
            state: 0
        },
     */
    complainttype: function(event){
        var _this = this,
            index = event.currentTarget.dataset.index,
            data = _this.data.radioData;
        index ? data.state = 1 : data.state = 0;
        _this.setData({
            radioData: data
        })
        // console.log(data.state + 1, data, index);
    },
    /**
     * 上传图片
     */
    chooseImg: function(event){
        var _this = this,
            imgs = _this.data.imgs;
        wx.chooseImage({
            count: 4 - imgs.length,
            sizeType: "compressed",
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;//这里是选好的图片的地址，是一个数组
                tempFilePaths.forEach((value, index, array) => {
                    imgs.push(value)
                })
                // var arr = imgs.push(tempFilePaths);
                _this.setData({
                    imgs: imgs
                })
                // console.log(_this.data.imgs);
            },
            fail: function(res){
                console.log(res);
            }
        })
    },
    /**
     * 删除已选择的图片
     */
    deleteImg: function(event){
        var _this = this,
            index = event.currentTarget.dataset.index,
            print = _this.data.imgs;
        //console.log(print);
        print.splice(index, 1);
        _this.setData({
            imgs: print
        })
    },
    /**
     * 图片上传预览
     */
    previewImg: function(event){
        var _this = this,
            index = event.currentTarget.dataset.index,
            imgs = _this.data.imgs;
        // console.log(event)
        wx.previewImage({
            current: imgs[index],
            urls: imgs
        })
    },
    /**
     * 投诉建议 提交
     */
    submit: function(){
        console.log('点击！')
    }
})