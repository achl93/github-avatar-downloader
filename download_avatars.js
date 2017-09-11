const request = require('request');
const fs = require('fs');
const GITHUB_USER = "achl93";
const GITHUB_TOKEN = "aaf5c2635ba1e9d5d19c126d095ed1a1fbd14e6b";

let options = {
  headers: {
    'User-Agent': 'Github Avatar Downloader - Student Project'
  }
};

function getRepoContributors(repoOwner, repoName, cb) {
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  options.url = requestURL;
  // console.log(options);
  request(options, (err, response, body) => {
    if (err) {
      return cb(err);
    }
    if (body !== null) {
      return cb(null, JSON.parse(body));
    }
  });
}

function downloadImageByURL(url, filepath) {
  request.get(url)
    .on('error', (err) => {
      throw (err);
    })
    .pipe(fs.createWriteStream(filepath)
      .on('finish', () => {
        console.log("Download complete");
      })
      .on('error', (err) => {
        throw (err);
      })
    );
}

getRepoContributors(process.argv[2], process.argv[3], (err, result) => {
  // console.log("Errors:", err);
  // console.log("Results:");
  // console.log(typeof(result));
  for (element in result) {
    downloadImageByURL(result[element].avatar_url, './avatars/'+result[element].id+'.jpg');
  }
});
