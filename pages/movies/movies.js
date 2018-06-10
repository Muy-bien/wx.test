var utils = require("../../utils/util.js");
var appData = getApp();
Page({
  data: {
    containerShow: true,
    searchPanelShow: false
  },
  onLoad: function (options) {
    var apiUrl = appData.globalData.apiUrl;
    this.setData({
      apiUrl: apiUrl
    });

    var inTheatersUrl = apiUrl + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = apiUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = apiUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters", "热映电影");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function (url, types, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      header: {
        "Content-Type": "json"
      },
      method: "GET",
      success: function (res) {
        that.processDoubanData(res.data, types, categoryTitle)
      },
      fail: function () {

      },
      complete: function () {

      }
    })
  },
  processDoubanData: function (moviesData, types, categoryTitle) {
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
    var modles = {};
    modles[types] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(modles);
  },
  onMoreTop: function (event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more_movies/more_movies?category=' + category,
    })
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie_detail/movie_detail?id=' + movieId,
    })
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      searchResult: {}
    })
  },
  onBindBlur: function (event) {
    console.log(event.detail.value);
    var searchUrl = this.data.apiUrl + "/v2/movie/search?q=" + event.detail.value;
    this.getMovieListData(searchUrl, "searchResult", "搜索");
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  }
})