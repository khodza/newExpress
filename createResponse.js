const path =require('path');
const fs = require('fs')
function createResponse(res) {
  //send text
    res.send = (message) => res.end(message);
  //send json
    res.json = (data) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    };
  //set status code
    res.status = (statusCode) => {
      res.statusCode = statusCode;
      return res;
    };
  //send file
    res.sendFile = (filePath) => {
      const file = path.resolve(filePath);
      fs.readFile(file, (err, content) => {
        if (err) {
          console.log(err);
          res.status(500).send("No File Found");
        } else {
          res.end(content);
        }
      });
    };
    
    return res;
  }

  module.exports =createResponse;