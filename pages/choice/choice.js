// pages/choice/choice.js
var util = require('../../utils/util');
//获取应用实例
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        buildingData: null,     // 楼栋数据
        submitbtn: false,
        room_id: 0,
        schools_id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options, '选择教室页面!');
        var than = this,
            id = parseInt(options.id),
            schoolsName = '',
            off = false;
        if (id){
            than.setData({
                schools_id: id
            })
        }else {
            console.log('网络繁忙，学校id未获取到！')
        }
        wx.getStorage({
            key: 'schools',
            success: function(response) {
                console.log(response)
                if (response.errMsg === "getStorage:ok"){
                    var data = JSON.parse(response.data);
                    console.log(data, '获取学校本地缓存信息');
                    data.forEach((value, index, array) => {
                        console.log(data[index].id, id, '输出所有缓存');
                        console.log(data[index].id === id);
                        if (data[index].id === id){
                            console.log('有符合的id!');
                            off = true;
                            schoolsName = data[index].name;
                            return true;
                        }
                    })
                    if (off){   // 有当前学校id
                        console.log(id, schoolsName);
                        wx.setNavigationBarTitle({
                            title: schoolsName
                        });
                        than.globalData.school_id = id;
                        if (than.globalData.school_id !== 0){
                            than.getBuildingList(); // 请求教室列表
                        } 
                    }else {
                        console.log('跳转链接所传ID 与缓存获取ID不符!')
                    }
                }
            },
            fail: function(res) {
                console.log(res, 'schools缓存获取错误!')
            },
            complete: function(res) {},
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
	 * 定义全局变量
	 */
    globalData: {
        apiUrl: "https://www." + util.host + "/",
        infoData: null,
        school_id: 0,
        $index: 0
    },
    /**
     * 根据判断请求教室列表
     */
    getBuildingList: function(){
        var than = this;
        wx.getStorage({
            key: 'admin',
            success: function (response) {
                console.log(response, '获取成功，本地缓存的管理员信息');
                if (response.errMsg === 'getStorage:ok') {
                    var data = JSON.parse(response.data);
                        than.globalData.infoData = data;
                    console.log(data , '输出拿到后解析为对象的本地缓存!');
                    if (data.supplier) { // 当是运维商
                        than.getOperations(); // 调用运维商获取数据接口
                        console.log('我是运营商管理员');
                    } else {             // 当不是运维商
                        than.getSchool();    // 调用学校获取数据接口
                        console.log('我是学校管理员');
                    }
                }
            },
            fail: function (res) {
                console.log('获取管理员信息本地缓存失败!', res)
            },
            complete: function (res) { },
        })
    },
    /**
     * 运维商获取数据接口
     */
    getOperations: function(){
        // 运维商请求接口地址 /supplier/:userid/:session/:sid/operation/loadschoolroomlist/:school_id
        const than = this;
        if (than.globalData.infoData !== null && than.globalData.school_id !== 0) {
            var datum = than.globalData.infoData;
            var url = than.globalData.apiUrl + 'supplier/' + datum.userid + '/' + datum.session + '/' + datum.supplier_id + '/operation/loadschoolroomlist/' + than.globalData.school_id;
            console.log(url);
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (response) {
                    console.log(response, '获取运维商数据接口');
                    if (response.statusCode === 200 && response.data.code === 0) {
                        console.log(response, '学校获取数据接口');
                        var arr = response.data.data;
                        arr.forEach((value, index, array) => {
                            value.state = false;
                            for (var i in value.rooms) {
                                value.rooms[i].state = false;
                            }
                        })
                        than.setData({
                            buildingData: arr
                        })
                        console.log(than.data.buildingData, '当前循环页面的数据');
                    }else {
                        var data = response.data;
                        wx.showToast({
                            title: data.msg,
                            icon: 'none',
                            mask: true
                        })
                    }
                },
                fail: function (res) {
                    console.log('获取运维商数据接口失败!', res);
                },
                complete: function (res) { },
            })
        }
    },
    /**
     * 学校获取数据接口
     */
    getSchool: function(){
        // 学校请求接口地址 /tuofu/: userid /: session /: school_id / operation / loadschoolandroomlist
        //                /tuofu/:userid/:session/:school_id/operation/loadschoolroomlist
        const than = this;
        if (than.globalData.infoData !== null && than.globalData.school_id !== 0){
            var datum = than.globalData.infoData;
            // console.log(datum)
            var url = than.globalData.apiUrl + 'tuofu/' + datum.userid + '/' + datum.session + '/' + than.globalData.school_id + '/operation/loadschoolroomlist';
            console.log(url);
            wx.request({
                url: url,
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function (response) {
                    // console.log(response, '学校获取数据接口');
                    if (response.statusCode === 200 && response.data.code === 0) {
                        console.log(response, '学校获取数据接口');
                        var arr = response.data.data;
                        arr.forEach((value, index, array) => {
                            value.state = false;
                            for (var i in value.rooms) {
                                value.rooms[i].state = false;
                            }
                        })
                        than.setData({
                            buildingData: arr
                        })
                        console.log(than.data.buildingData, '当前循环页面的数据');
                    }
                },
                fail: function (res) {
                    console.log('获取学校数据接口失败!', res);
                },
                complete: function (res) { },
            })
        }
    },
    /**
     * 菜单切换
     */
    menuswitch: function(event){
        console.log(event);
        const than = this;
        var $index = event.target.dataset.index,
            arr = than.data.buildingData;
        if ($index !== undefined){
            console.log('进入当前!', $index);
            arr.forEach((value, index, array) => {
                for (var i in value.rooms){
                    value.rooms[i].state = false;
                }
                than.setData({
                    submitbtn: false,
                    room_id: 0
                })
                if (index === $index){
                    console.log('true');
                    if (arr[index].state){
                        arr[index].state = false;
                    }else {
                        arr[index].state = true;
                        than.globalData.$index = index;
                    }
                }else {
                    console.log('false');
                    arr[index].state = false;
                }
            })  
            console.log(arr)
        }
        than.setData({
            buildingData: arr
        })
    },
    /**
     * 选择具体教室
     */
    choice: function(event){
        const than = this;
        var id = event.target.id,
            $index = event.target.dataset.index,
            arr = than.data.buildingData;
        console.log('当前id是:', id, '当前索引值是:', $index, '当前父集盒子是第几个：', than.globalData.$index);
        arr[than.globalData.$index].rooms.forEach((value, index, array) => {
            //console.log(value);
            if (index === $index) {
                console.log('true', arr[than.globalData.$index].rooms[index].state);
                if (arr[than.globalData.$index].rooms[index].state) {
                    arr[than.globalData.$index].rooms[index].state = false;
                    than.setData({
                        submitbtn: false,
                        room_id: 0
                    })
                } else {
                    for (var i in arr[than.globalData.$index].rooms){
                        arr[than.globalData.$index].rooms[i].state = false;
                    }
                    arr[than.globalData.$index].rooms[index].state = true;
                    // than.globalData.$index = index;
                    than.setData({
                        submitbtn: true,
                        room_id: arr[than.globalData.$index].rooms[index].room_id
                    })
                }
            } else {
                console.log('false');
                arr[than.globalData.$index].rooms[index].state = false;
            }
        })
        console.log(arr)
        than.setData({
            buildingData: arr
        })
    },
    /**
     * submit 绑定提交按钮
     */
    submit: function(event){
        console.log(event)
        const than = this;
        var off = parseInt(event.target.dataset.off);
        if(off){
            wx.getStorage({
                key: 'bind_id',
                success: function (res) {
                    if (res.errMsg === "getStorage:ok") {
                        console.log(res, '获取本地缓存， 二维码绑定id成功!');
                        var bind_id = parseInt(res.data);
                        console.log(than.data.room_id, than.data.schools_id, bind_id, '提交数据判断');
                        if (than.data.room_id && than.data.schools_id && bind_id) {
                            var data = {
                                room_id: than.data.room_id,
                                school_id: than.data.schools_id,
                                bind_id: bind_id 
                            };
                            console.log(data, "可以提交!");
                            var url = than.globalData.apiUrl + 'qr/room/bind';
                            wx.request({
                                url: url,
                                data: data,
                                method: 'POST',
                                dataType: 'json',
                                responseType: 'text',
                                success: function (response) {
                                    console.log(response, '绑定二维码成功!');

                                    wx.reLaunch({
                                        url: '../binding-success/binding-success',
                                    })
                                },
                                fail: function (res) {
                                    console.log(res, '绑定二维码失败!')
                                },
                                complete: function (res) { },
                            })
                        } else {
                            console.log("数据错误，提交失败!");
                        }
                    }
                },
                fail: function (res) {
                    console.log(res, '获取本地缓存， 二维码绑定id失败!')
                },
                complete: function (res) { },
            })
        }else {
            console.log('不能提交!');
        }
    }
})