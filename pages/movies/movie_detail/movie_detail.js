var utils = require("../../../utils/util.js");
Page({
  data: {

  },
  onLoad: function (options) {
    var detaliUrl = "/v2/movie/subject/" + options.id;
    utils.http(detaliUrl, this.movieDetaliData);
  },
  movieDetaliData: function (data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    var srcData = [];
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: utils.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: utils.convertToCastString(data.casts),
      castsInfo: utils.convertToCastInfos(data.casts),
      summary: data.summary
    }
    if (data.images){
      srcData.push(data.images.large);
    }
    for (var p of movie.castsInfo){
      srcData.push(p.img);
    }
    this.setData({
      movie: movie,
      srcData: srcData
    })
  },
  viewMoviePostImg:function(event){
    var srcData = this.data.srcData;
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current:src,
      urls: srcData,
    })
  }
})