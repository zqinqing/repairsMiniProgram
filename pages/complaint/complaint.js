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
        uploadingpath: '',// 上传图片
        path: 'http://desk.fd.zol-img.com.cn/t_s1920x1080/g5/M00/05/0C/ChMkJ1l_JRCIA-oAAAS5EW43hXUAAfSaAEVxL8ABLkp466.jpg',
        submitData: {}    // 提交链接
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.submitpath !== ''){
            // console.log(options.submitpath, '设置数据完毕!');
            var obj = {
                url: options.submitpath,
                school_id: options.school_id,
                rec_id: options.rec_id
            }
            this.setData({
                submitData: obj
            })
        }else {
            console.log('提交数据出错,请检查上一个页面跳转链接');
        }
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
                console.log(_this.data.imgs);
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
     * 
     */
    textareavalue: function(event){
        var value = event.detail.value;
        this.setData({
            text: value
        })
    },
    /**
     * 投诉建议 提交
     */
    submit: function(){
        let _this = this,
            simgs = this.data.imgs;
        if (simgs.length > 0){
            wx.showLoading({
                title: '上传文件中...',
                mask: true
            })
            var aimg = [],
                imgspath = this.data.imgs;
            simgs.forEach((value, index, array) => {
                wx.uploadFile({
                    name: 'upfile',
                    url: 'https://www.' + util.host + '/weixinweb/xiaochengcxufile/1',
                    filePath: value,
                    formData: null,
                    success: function (res) {
                        var data = JSON.parse(res.data);
                        if (res.statusCode === 200 && data.code === 0) {
                            // console.log(data.url, 'url');
                            aimg.push(data.url);
                        }
                    },
                    fail: function (res) {
                        console.log(res, '上传图片失败!');
                    },
                    complete: () => {
                        if (aimg.length === imgspath.length) {
                            wx.hideLoading();
                            _this.submitVerify(aimg);
                        }
                    }
                });
            })
        }else {
            _this.submitVerify('');
        }
    },
    /**
     * submit img 提交图片
     */
    submitVerify: function (aimg){
        let _this = this,
            datum = this.data.submitData,
            ntype = this.data.radioData,
            stext = this.data.text,
            data = {};

        if (stext !== '' && JSON.stringify(datum) !== '{}' && datum.url && datum.school_id && datum.rec_id) {
            // console.log('点击！', datum)
            data.school_id = datum.school_id;
            data.rec_id = datum.rec_id;
            data.type = ntype.state === 0 ? 2 : 1;
            data.suggest_text = stext;
            if (aimg instanceof Array){
                data.suggest_img = aimg.join(',');
            }else {
                data.suggest_img = '';
            }
            // console.log(data, 'data');
            this.submitcomplaint(datum.url, data);
        } else if (stext === '') {
            wx.showToast({
                title: '你的反馈意见不能为空！',
                icon: 'none',
            })
        } else {
            console.log("提交数据有误,请检查数据来源", datum);
        }
    },
    /**
     * 提交投诉建议
     */
    submitcomplaint: function (url, data){
        wx.request({
            url: url,
            data: data,
            header: {},
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: function (response) {
                if (response.statusCode === 200 && response.data.code === 0) {
                    // console.log('提交成功!', response);
                    wx.showToast({
                        title: '提交成功！',
                        icon: 'success',
                        success: function (response) {
                            setTimeout(function () {
                                wx.navigateBack({
                                    delta: 1,
                                })
                            }, 3000)
                        }
                    })
                }
            },
            fail: function (res) {
                console.log('提交失败!', res);
                wx.showToast({
                    title: '提交失败！',
                    icon: 'none',
                })
            },
            complete: function (res) { },
        })
    }
})