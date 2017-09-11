const request = require('request');
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

getRepoContributors("jquery", "jquery", (err, result) => {
  console.log("Errors:", err);
  console.log("Results:");
  // console.log(typeof(result));
  for (element in result) {
    console.log(result[element].avatar_url);
  }
});
