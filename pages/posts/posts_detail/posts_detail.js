var postsdata = require("../../../data/posts_data.js");
var appdata = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    var data = postsdata.postList[options.id];
    var postsId = options.id;
    var AppOnMusic = appdata.globalData.onMusic;
    var AppMusicId = appdata.globalData.musicId;
    this.setData({
      data: data,
      postsId: postsId
    })
    var collection = wx.getStorageSync("collection");
    if (collection) {
      var this_collection = collection[postsId] ? true : false;
      collection[postsId] = this_collection;
      this.setData({
        collection: this_collection
      })
      wx.setStorageSync("collection", collection);
    } else {
      var this_collection = {};
      this_collection[postsId] = true;
      wx.setStorageSync("collection", this_collection);
    }
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        onMusic: true
      })
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        onMusic: false
      })
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        onMusic: false
      })
    })
    if (AppMusicId == postsId) {
      this.setData({
        onMusic: AppOnMusic
      })
    }
  },
  onUnload: function () {
    appdata.globalData.onMusic = this.data.onMusic;
    appdata.globalData.musicId = this.data.postsId;
  },
  onclickCollection: function (event) {
    var collection = wx.getStorageSync("collection");
    var postsId = this.data.postsId;
    collection[postsId] = !collection[postsId];
    this.showToast(collection[postsId], collection);
  },
  showToast: function (this_collection, collection) {
    var that = this;
    wx.showToast({
      title: this_collection ? "收藏成功" : "已取消收藏",
      icon: "none",
      duration: 1000,
      success: function () {
        wx.setStorageSync("collection", collection);
        that.setData({
          collection: this_collection
        })
      }
    })
  },
  showModal: function (this_collection, collection) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: this_collection ? "是否收藏该文章?" : "是否取消收藏该文章？",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("collection", collection);
          that.setData({
            collection: this_collection
          })
        }
      }
    })
  },
  onclickActionSheet: function (event) {
    wx.showActionSheet({
      itemList: [
        "分享给朋友",
        "分享到朋友圈"
      ],
      success: function (res) {
        if (res.tapIndex) {

        }
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },
  onClickMusic: function (event) {
    this.onMusic()
  },
  onMusic: function () {
    var onMusic = this.data.onMusic;
    var dataMusic = this.data.data.music;
    if (onMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        onMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: dataMusic.url,
        title: dataMusic.title,
        coverImgUrl: dataMusic.coverImg
      })
      this.setData({
        onMusic: true
      })
    }
  }
})
