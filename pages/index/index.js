// pages/posts/posts.js
Page({
  on_tap: function () {
    console.log("111");
    wx.switchTab({
      url:"../posts/posts"
    })
    // wx.redirectTo({
    //   url: "/pages/posts/posts"
    // })
    // wx.navigateTo({
    //   url: '',
    //   success:function(){

    //   },
    //   fail:function(){

    //   },
    //   complete:function(){

    //   }
    // })
  }
})