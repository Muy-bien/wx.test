var utils = require("../../../utils/util.js");
Page({
  data: {

  },
  onLoad: function (options) {
    var category = options.category;
    var dataUrl = "";
    switch (category) {
      case "热映电影":
        dataUrl = "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = "/v2/movie/top250";
        break;
    };
    this.setData({
      category: category,
      dataUrl: dataUrl,
      isEmpty: true,
      totalCount: 0
    });
    utils.http(dataUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.category,
    })
  },
  onReachBottom: function () {
    var nextUrl = this.data.dataUrl + "?start=" + this.data.totalCount + "&count=20";
    utils.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh:function(event){
    var nextUrl = this.data.dataUrl + "?start=0&count=20";
    this.setData({
      isEmpty: true,
      totalCount:0
    })
    utils.http(nextUrl, this.processDoubanData);
  },
  processDoubanData: function (moviesData) {
    var movies = [];
    for (var subjects of moviesData.subjects) {
      var title = subjects.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var modle = {
        stars: utils.convertToStarsArray(subjects.rating.stars),
        title: title,
        average: subjects.rating.average,
        coverageUrl: subjects.images.large,
        movieId: subjects.id
      }
      movies.push(modle);
    }
    var isEmpty = this.data.isEmpty;
    var totalMovies = {};
    if (!isEmpty) {
      var movie = this.data.movies;
      totalMovies = movie.concat(movies);
    } else {
      totalMovies = movies;
      isEmpty = false;
      this.setData({
        isEmpty: isEmpty
      })
    }
    var totalCount = this.data.totalCount;
    totalCount += 20;
    this.setData({
      movies: totalMovies,
      totalCount: totalCount
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  }
})