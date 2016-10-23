/**
 * MovieController
 *
 * @description :: Server-side logic for managing movies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
                dbMovie: function(req, res){
                                console.log("start DB");
                              var request = require('request');
                              var cheerio = require('cheerio');
                              var imdb = require('node-movie');
                               var magnetLink = require('magnet-link')
                              var page = 1;
                              var $;
                              var $2;
                              var poster;
                              var dataMovie;
                              var title;
                              var url1 = "https://yts.ag/api/v2/list_movies.json?limit=50&page=";
                              var url2 = "https://www.yify-torrent.org/search/mp4/t-";

                              search(url1+page);

                              function search(url){
                                  console.log(url);
                                  request(url, {headers: { 'Content-Type': 'application/json' }},function(error, response, html){
                                     if (!error && response.statusCode == 200) {
                                         dataMovie = JSON.parse(html);
                                           for (let i = 0; i < dataMovie.data.movies.length; i++) {
                                                               if(dataMovie.data.movies && dataMovie.data.movies[i] && dataMovie.data.movies[i].torrents && dataMovie.data.movies[i].torrents[0] && dataMovie.data.movies[i].torrents[0].quality != "3D"){
                                                                    if(dataMovie.data.movies && dataMovie.data.movies[i] && dataMovie.data.movies[i].torrents && dataMovie.data.movies[i].torrents[0] && dataMovie.data.movies[i].torrents[0].quality == "720p") {
                                                                               magnetLink(dataMovie.data.movies[i].torrents[0].url, function (err, link) {
                                                                                               if (!link)
                                                                                                    return
                                                                                               Movie.findOrCreate({magnet: link}, {
                                                                                                 title : dataMovie.data.movies[i].title,
                                                                                                 year: dataMovie.data.movies[i].year,
                                                                                                 note: dataMovie.data.movies[i].rating,
                                                                                                 poster: dataMovie.data.movies[i].medium_cover_image ? dataMovie.data.movies[i].medium_cover_image : 'N/A',
                                                                                                 magnet: link,
                                                                                                 path: "path",
                                                                                                 genre: "all,"+dataMovie.data.movies[i].genres,
                                                                                                 resolution: "all,720"},
                                                                                                 function(err, created){
                                                                                                     if (err)
                                                                                                     {
                                                                                                       console.log("error dbMovie");
                                                                                                       console.log(err);
                                                                                                       return res.redirect("/");
                                                                                                     }
                                                                                                 })
                                                                                })
                                                                }
                                                                                if(dataMovie.data.movies && dataMovie.data.movies[i] && dataMovie.data.movies[i].torrents && dataMovie.data.movies[i].torrents[1] && dataMovie.data.movies[i].torrents[1].quality == "1080p") {
                                                                                        magnetLink(dataMovie.data.movies[i].torrents[1].url, function (err, link) {
                                                                                                        if (!link)
                                                                                                             return
                                                                                                Movie.findOrCreate({magnet: link}, {
                                                                                                  title : dataMovie.data.movies[i].title,
                                                                                                  year: dataMovie.data.movies[i].year,
                                                                                                  note: dataMovie.data.movies[i].rating,
                                                                                                  poster: dataMovie.data.movies[i].medium_cover_image ? dataMovie.data.movies[i].medium_cover_image : 'N/A',
                                                                                                  magnet: link,
                                                                                                  path: "path",
                                                                                                  genre: "all,"+dataMovie.data.movies[i].genres,
                                                                                                  resolution: "all,1080"},
                                                                                                  function(err, created){
                                                                                                      if (err)
                                                                                                      {
                                                                                                        console.log("error dbMovie");
                                                                                                        console.log(err);
                                                                                                        return res.redirect("/");
                                                                                                      }
                                                                                                  })
                                                                                        })
                                                                                }
                                                               }else if(dataMovie.data.movies && dataMovie.data.movies[i] && dataMovie.data.movies[i].torrents && dataMovie.data.movies[i].torrents[0] && dataMovie.data.movies[i].torrents[0].quality == "3D"){
                                                                               if(dataMovie.data.movies && dataMovie.data.movies[i] && dataMovie.data.movies[i].torrents && dataMovie.data.movies[i].torrents[1] && dataMovie.data.movies[i].torrents[1].quality == "720p"){
                                                                                               magnetLink(dataMovie.data.movies[i].torrents[1].url, function (err, link) {
                                                                                                               if (!link)
                                                                                                                    return
                                                                                                               Movie.findOrCreate({magnet: link}, {
                                                                                                                 title : dataMovie.data.movies[i].title,
                                                                                                                 year: dataMovie.data.movies[i].year,
                                                                                                                 note: dataMovie.data.movies[i].rating,
                                                                                                                 poster: dataMovie.data.movies[i].medium_cover_image ? dataMovie.data.movies[i].medium_cover_image : 'N/A',
                                                                                                                 magnet: link,
                                                                                                                 path: "path",
                                                                                                                 genre: "all,"+dataMovie.data.movies[i].genres,
                                                                                                                 resolution: "all,720"},
                                                                                                                 function(err, created){
                                                                                                                     if (err)
                                                                                                                     {
                                                                                                                       console.log("error dbMovie");
                                                                                                                       console.log(err);
                                                                                                                       return res.redirect("/");
                                                                                                                     }
                                                                                                                 })
                                                                                                })
                                                                                }
                                                                                if(dataMovie.data.movies && dataMovie.data.movies[i] && dataMovie.data.movies[i].torrents && dataMovie.data.movies[i].torrents[2] && dataMovie.data.movies[i].torrents[2].quality == "1080p") {
                                                                                        magnetLink(dataMovie.data.movies[i].torrents[2].url, function (err, link) {
                                                                                                        if (!link)
                                                                                                             return
                                                                                                Movie.findOrCreate({magnet: link}, {
                                                                                                  title : dataMovie.data.movies[i].title,
                                                                                                  year: dataMovie.data.movies[i].year,
                                                                                                  note: dataMovie.data.movies[i].rating,
                                                                                                  poster: dataMovie.data.movies[i].medium_cover_image ? dataMovie.data.movies[i].medium_cover_image : 'N/A',
                                                                                                  magnet: link,
                                                                                                  path: "path",
                                                                                                  genre: "all,"+dataMovie.data.movies[i].genres,
                                                                                                  resolution: "all,1080"},
                                                                                                  function(err, created){
                                                                                                      if (err)
                                                                                                      {
                                                                                                        console.log("error dbMovie");
                                                                                                        console.log(err);
                                                                                                        return res.redirect("/");
                                                                                                      }
                                                                                                  })
                                                                                        })
                                                                                }
                                                               }
                                           }
                                           page++;
                                           if (page == 117)
                                           {
                                                console.log("2eme partie");
                                                page = 2;
                                                search2(url2+page+"/");
                                           }
                                           else
                                                search(url1+page);
                                      }
                                  })
                              }
                                function search2(url){
                                                console.log(url);
                                                if (page == 255){
                                                                console.log("end");
                                                                return res.redirect("/");
                                                }
                                                else{
                                                    request(url, function(error, response, html){
                                                                if (!error && response.statusCode == 200) {
                                                                         $ = cheerio.load(html);
                                                                       fill_movie2($('.mdif a'), 0);
                                                                }
                                                                else {
                                                                                page++;
                                                                                search2(url2+page+"/");
                                                                }
                                                    })
                                                }
                                }

                              function fill_movie2(url, j){
                                                  if (j == url.length)
                                                  {
                                                          page++;
                                                          search2(url2+page+"/");
                                                  }else {
                                                     request("https://www.yify-torrent.org"+url[j].attribs.href, function(error, response, html){
                                                                     if (!error && response.statusCode == 200) {
                                                                                     $2 = cheerio.load(html);
                                                                                     dataMovie2();
                                                                                     fill_movie2(url, j + 1);
                                                                                     return ;
                                                                     }else {
                                                                                fill_movie2(url, j + 1);
                                                                     }

                                                     })
                                                  }
                              }

                              function dataMovie2() {
                                               title = $2('.name h1').text().replace(/\(.*\).+/, "");
                                               title = title.replace(/(rar|mp4|EXTENDED|UNRATED)/g, "");
                                               imdb(title, function (err, data) {
                                                       if (data.Actors == "N/A"){
                                                           title = $2('.name h1').text().replace(/(and)/, "&");
                                                           dataMovie2();
                                                       }
                                                       else {
                                                                if ($2('.name h1').text().match(/3D/) || !title || !$2('.large.button.orange').attr('href') || !data.Genre || !$2('.inattr li a').text())
                                                                                      return ;
                                                                Movie.findOrCreate({magnet: $('.magnet-download').attr('href')},{
                                                                                       title : $2('.name h1').text(),
                                                                                       year: data.Year && data.Type == "movie" ? data.Year : 'N/A',
                                                                                       note: data.imdbRating && data.Type == "movie" ? data.imdbRating : 'N/A',
                                                                                       poster: data.Poster && data.Type == "movie" ? data.Poster : 'https:'+$2('.cover img').attr('src'),
                                                                                       magnet: $2('.large.button.orange').attr('href'),
                                                                                       path: "path",
                                                                                       genre: data.Genre && data.Type == "movie" ? "all,"+data.Genre : "all,"+$2('.inattr li a').text(),
                                                                                       resolution: $2('.name h1').text().match(/1080/) ? "all,1080" : "all,720"},
                                                                                       function(err, created){
                                                                                                       if (err)
                                                                                                       {
                                                                                                                       console.log("error dbMovie");
                                                                                                                       console.log(err);
                                                                                                                       return res.redirect("/");
                                                                                                       }
                                                                                       })
                                                                       }
                                                       });
                               }
                },
///////////////////////////////////////////////////////DOWNLOAD////////////////////////////////////////////////////////////////////////////////////////////////
download: function(req, res){
  if (!req.isSocket) {
                  return res.badRequest();
  }
  var viewId = "0";
  View.find({id_movie: req.param('eventpop')}, {id_user: req.session.user.id}).exec(function(err, data){
                  View.create({id_user: req.session.user.id, id_movie: req.param('eventpop'), title: req.param('title_movie')}).exec(function(err, data){
                  });
  });

  var pathmovie = "path";
  var pathvtt = "path";
  Movie.find({id: req.param('eventpop')}).exec(function(err, data){
   pathmovie = data[0].path;
   pathvtt = data[0].path_vtt;
   function emitProg(value){
     sails.sockets.join(req, req.session.user.id);
     sails.sockets.broadcast(req.session.user.id, "load_"+req.param('loadpop'),Math.floor(value.percentage));
   }
   if (pathmovie == "path" || !pathmovie)
   {
           var srt2vtt = require('srt-to-vtt')
           var fs = require('fs')
           var Torrent = require('torrent-xiv');
           var prog = [];
           var torrent = new Torrent(req.param('magnet_link'), { connections: 100,      // Max number of connections
           uploads: 10,           // Max number of upload slots
           path: 'assets/videos-xiv',     // Directory to save files to
           mkdir: true,           // Make a directory in opts.path? Name will be the info hash
           seed: false,           // NYI - Seed the torrent when done instead of quitting?
           start: true,           // Auto-start the download?
           statFrequency: 4000 });
           torrent.on('progress', emitProg);

           torrent.on('complete', emitMovie);
           function emitMovie(value){

             var i = -1;
             var linkmkv = "error";
             var link = "error";
             var srt = "path";
             var vtt = "path";
             while (++i > -1)
             {
               console.log("test file "+i);
               if (torrent.metadata.files[i] && torrent.metadata.files[i].path && !torrent.metadata.files[i].path.match(/WWW.YTS.AG/) && !torrent.metadata.files[i].path.match(/RARBG.COM/) && (torrent.metadata.files[i].path.match(/.mp4/) || torrent.metadata.files[i].path.match(/.mkv/)))
                {
                  if (torrent.metadata.files[i].path.match(/.mkv/))
                  {
                    linkmkv = torrent.metadata.files[i].path;
                  }
                  else {
                    link = torrent.metadata.files[i].path;
                  }

                }
               else if (torrent.metadata.files[i] && torrent.metadata.files[i].path && !torrent.metadata.files[i].path.match(/YTS.AG/) && !torrent.metadata.files[i].path.match(/RARBG.COM/) && torrent.metadata.files[i].path.match(/.srt/))
               {
                 srt = torrent.metadata.files[i].path;

                 vtt = srt.replace("srt", "vtt");
                 fs.access('/.tmp/public' + (vtt.replace("assets", "")), (err) => {
                   if (!err) {
                     console.error('vtt already exists');
                   }
                   else {
                        fs.createReadStream(srt).pipe(srt2vtt()).pipe(fs.createWriteStream("assets"+vtt));
                        var tempLocation = process.cwd() + '/.tmp/public' + vtt.replace("assets", "");
                        fs.createReadStream(srt).pipe(srt2vtt()).pipe(fs.createWriteStream(tempLocation));

                   }
                });
                vtt = vtt.replace("assets", "");

               }
               else if (!torrent.metadata.files[i])
               {
                break;
               }

             }
             function addVideo(link2, vtt2){
                 link2 = link2.replace("mkv", "mp4");
                 dataStream = new Array(vtt2, link2);
                 Movie.update({id: req.param('eventpop')}, {path_vtt : vtt2}).exec(function(err, data){
                    console.log(".vtt added in db");
                 });

               Movie.update({id: req.param('eventpop')}, {path: link2}).exec(function(err, data){
                 sails.sockets.join(req, req.session.user.id);
                 sails.sockets.broadcast(req.session.user.id, "stream_"+req.param('eventpop'),dataStream);
               });
             }
             function mp4prepare(link2, vtt2) {
              link2 =  link2.replace("assets", "");
              link2 = link2.replace("mkv", "mp4");

                fs.createReadStream("assets"+link2).pipe(fs.createWriteStream(process.cwd() + '/.tmp/public' +link2).on('finish', function() {

                                addVideo(link2, vtt2);
                }));

             }
             function convertMkv(link2, vtt2) {
                var hbjs = require("handbrake-js");
                linkmkv = link2;

                hbjs.spawn({ input: link2, output: link2.replace("mkv", "mp4") })
                 .on("error", function(err){
                   // invalid user input, no video found etc
                 })
                 .on("progress", function(progress){
                   sails.sockets.join(req, req.session.user.id);
                   sails.sockets.broadcast(req.session.user.id, "load_"+req.param('loadpop'),Math.floor(progress.percentComplete));
                 })
                 .on("complete", function(){
                   mp4prepare(link2.replace("mkv", "mp4"), vtt2);
                 });
               }
               if (link != "error")
               {
                 mp4prepare(link, vtt);
               }
               else if (link == "error" && linkmkv != "error")
               {
                 convertMkv(linkmkv, vtt);
               }
            }

         } else {
           dataStream = new Array(pathvtt, pathmovie);
           Movie.update({id: req.param('eventpop')}, {id : req.param('eventpop')}).exec(function(err, data){

           });
           sails.sockets.join(req, req.session.user.id);
           sails.sockets.broadcast(req.session.user.id, "stream_"+req.param('eventpop'),dataStream);
         }
  });

},

///////////////////////////////////////////////////////SEARCH MOVIE////////////////////////////////////////////////////////////////////////////////////////////////

searchMovie: function(req, res){
          if (req.param("movie") === "" || !req.param("movie") || req.param('movie') == "populate"){
                var date = new Date().getFullYear();
                Movie.find({
                  where : {note : {"!": "N/A"}, year: date},
                  limit : req.param('limit'),
                  skip : req.param('skip'),
                  sort : "note DESC"
                }).exec(function (err, movies){
                                View.find({id_user: req.session.user.id}).exec(function(err2, match){
                                                res.end(JSON.stringify([movies, req.session.user.id, match]));
                                });
                });
          }else {
            if (!req.param('name_direction') || !req.param('note') || !req.param('year_min') ||
                !req.param('year_max') || !req.param('dateYearNow') || !req.param('genre_movie') || !req.param('quality')){
                res.end(JSON.stringify());
            }
            else if (req.param('name_direction') != "name_up" && req.param('name_direction') != "name_down"){
                res.end(JSON.stringify());
            }
            else if (Number.isInteger(req.param('year_min')) || Number.isInteger(req.param('year_max'))) {
                res.end(JSON.stringify());
            }
            else if (req.param('year_min') > req.param('year_max')){
                res.end(JSON.stringify());
            }
            else if (parseInt(req.param('year_min')) < 1900 || parseInt(req.param('year_max')) > parseInt(req.param('dateYearNow')) || parseInt(req.param('year_min')) > parseInt(req.param('dateYearNow')) || parseInt(req.param('year_max')) < 1900) {
                res.end(JSON.stringify());
            }
            else if (req.param('genre_movie') != "Action" && req.param('genre_movie') != "Comedy" &&
                req.param('genre_movie') != "Horror" && req.param('genre_movie') != "Fantasy" &&
                req.param('genre_movie') != "Science Fiction" && req.param('genre_movie') != "Adventure" &&
                req.param('genre_movie') != "Romance" && req.param('genre_movie') != "Thriller" &&
                req.param('genre_movie') != "all") {
                res.end(JSON.stringify());
            }
            else if (parseInt(req.param('quality')) != "720" && parseInt(req.param('quality')) != "1080" &&
                req.param('quality') != "all") {
                res.end(JSON.stringify());
            }
            else if (parseInt(req.param("note")) >= 0 && parseInt(req.param("note")) < 10){
              var sort;
              if (req.param('name_direction') == "name_down"){
                sort = 'title DESC'
              }else {
                sort = 'title ASC';
              }

              Movie.find({title: {'like': '%'+req.param("movie")+'%'},
                          genre: {'like': '%'+req.param("genre_movie")+'%'},
                          year: {'>=': parseInt(req.param("year_min")), '<=': parseInt(req.param("year_max"))},
                          note: {'>=': parseInt(req.param("note")), '<=': 10},
                          resolution: {'like': '%'+req.param("quality")+'%'},
                          limit : req.param("limit"),
                          skip : req.param("skip"),
                          sort: sort}).exec(function(err, records){
                                View.find({id_user: req.session.user.id}).exec(function(err2, match){
                                    res.end(JSON.stringify([records, req.session.user.id, match]));
                                 });
              });
            }
            else {
              res.end(JSON.stringify());s
            }
          }
},

///////////////////////////////////////////////////////POPULATE MOVIE////////////////////////////////////////////////////////////////////////////////////////////////

                populate: function(req, res){
                  var date = new Date().getFullYear();
                  Movie.find({
                    where : {note : {"!": "N/A"}, year: date},
                    limit : 40,
                    sort : "note DESC"
                  }).exec(function (err, movies){
                      View.find({id_user: req.session.user.id}).exec(function(err2, match){
                                                res.end(JSON.stringify([movies, req.session.user.id,match]));
                                                });
                  });
                },


}
