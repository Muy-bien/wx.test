var postsData = require("../../data/posts_data.js");
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
      info: postsData.postList
    })
  },
  on_poststap: function (event) {
    var postId = event.currentTarget.dataset.postsid;
    wx.navigateTo({
      url: 'posts_detail/posts_detail?id=' + postId
    })
  },
  on_swipertap:function(event){
    var postId = event.target.dataset.postsid;
    wx.navigateTo({
      url: 'posts_detail/posts_detail?id=' + postId
    })
  }
})