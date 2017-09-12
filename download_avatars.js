require('dotenv').config();
const request = require('request');
const fs = require('fs');
const GITHUB_USER = "achl93";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (typeof(GITHUB_TOKEN) !== 'string') {
  console.log("Your .env variable is missing or invalid");
  return;
}

// Defines an options object for the http request
let options = {
  headers: {
    'User-Agent': 'Github Avatar Downloader - Student Project'
  }
};

// Accesses the github api to return a JSON object with contributor info
function getRepoContributors(repoOwner, repoName, cb) {
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  options.url = requestURL;
  request(options, (err, response, body) => {
    if (err) {
      return cb(err);
    }
    if (body !== null) {
      let content = JSON.parse(body);
      if (content.message === "Not Found") {
        console.log("This repo does not exist");
        return;
      }
      else {
        return cb(null, content);
      }
    }
  });
}

// Takes a URL and destination filepath to download the image to
function downloadImageByURL(url, filepath) {
  request.get(url)
    .on('error', (err) => {
      throw (err);
    })
    .pipe(fs.createWriteStream(filepath)
      .on('finish', () => {
        console.log("Image downloaded");
      })
      .on('error', (err) => {
        throw (err);
      })
    );
}

// Calls the getRepoContributors function using command line parameters and supplies the downloadImageByURL
// function with each contributor's avatar url
getRepoContributors(process.argv[2], process.argv[3], (err, result) => {
  if (process.argv[2] === undefined || process.argv[3] === undefined) throw new Error('You must pass the parameters as such: node download_avatars.js <repoOwner> <repoName>');
  for (element in result) {
    downloadImageByURL(result[element].avatar_url, './avatars/'+result[element].id+'.jpg');
  }
});
