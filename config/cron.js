module.exports.cron = {
  myFirstJob: {
    schedule: '30 10 * * * *',
    onTick: function () {
      var timeNow1 = new Date();
      var timeNow = new Date(timeNow1 - 2592000);
      console.log(timeNow);
      Movie.find({updatedAt	: {'<=' : timeNow}}).exec(function(err, data){
        console.log("take movie");
        const fs = require('fs');
        data.forEach(function(result){
          if (result.path != "path")
          {
            var arr = ("assets"+result.path).split("/");
            var path = arr[0]+"/"+arr[1]+"/"+arr[2]+"/"+arr[3];
            console.log(path+" go to deleted.");

            if( fs.existsSync(path) ) {
              fs.readdirSync(path).forEach(function(file) {
                var curPath = path + "/" + file;
                  if(fs.statSync(curPath).isDirectory()) { // recurse
                      deleteFolderRecursive(curPath);
                  } else { // delete file
                      fs.unlinkSync(curPath);
                      console.log(curPath+" deleted.");
                  }
              });

              fs.rmdirSync(path);
            }
            Movie.update({id : result.id}, {path : "path"}).exec(function(err, data){
              console.log(result.id+" updated.");
            });
          }
         });
      });
    }
  }
};
