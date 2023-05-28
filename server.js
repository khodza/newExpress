const http = require("http");
const parse = require("./url-to-regex");
const queryParse = require("./query-params");
const processMiddleware =require('./processMiddleware');
const createResponse = require('./createResponse');


let server;

function myExpress() {
  let routeTable = {};
  let parseMethod = "json"; 
  let middlewareStack = []; // Added middlewareStack array

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += "" + chunk;
      });
      req.on("end", () => {
        resolve(body);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
  }

  server = http.createServer(async(req, res) => {
    const routes = Object.keys(routeTable);
    let match = false;

     // Process middleware for each request
     const processMiddlewarePromise = processMiddleware(middlewareStack, req, createResponse(res));

    for(let i =0; i < routes.length; i++) {
       const route = routes[i];
       const parsedRoute = parse(route);
       if (
         new RegExp(parsedRoute).test(req.url) &&
         routeTable[route][req.method.toLowerCase()]
       ) {
         let cb = routeTable[route][req.method.toLowerCase()];
         let middleware = routeTable[route][`${req.method.toLowerCase()}-middleware`]; 
         const m = req.url.match(new RegExp(parsedRoute));
         
         req.params = m.groups;
         req.query = queryParse(req.url);

         let body = await readBody(req);
         if (parseMethod === "json") {
          body = body ? JSON.parse(body) : {};
         }
         req.body = body;
         const result = await processMiddleware(middleware, req, createResponse(res));
         if (result) {
           cb(req, res);
         } 
         
         match = true;
         break;
       }
    }


    // Wait for middleware to finish processing
    const middlewareResult = await processMiddlewarePromise;

    if (!match) {
      res.statusCode = 404;
      res.end("Not found");
    }
  });

  function registerPath(path, cb, method, middleware) {
    if (middleware) {
      middlewareStack.push(middleware);
    }
    if (!routeTable[path]) {
      routeTable[path] = {};
    } 
    routeTable[path] = { ...routeTable[path], [method]: cb, [method + "-middleware"]: middleware };
  }
  
    // Added use() function to register middleware globally
    function use(middleware) {
      middlewareStack.push(middleware);
    }
  return {
    get: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0] , "get");
      } else {
        registerPath(path, rest[1], "get", rest[0]);
      }
    },
    post: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "post");
      } else {
        registerPath(path, rest[1], "post", rest[0]);
      }
    },
    put: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "put");
      } else {
        registerPath(path, rest[1], "put", rest[0]);
      }
    },
    delete: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "delete");
      } else {
        registerPath(path, rest[1], "delete", rest[0]);
      }
    },
    bodyParse: (method) => parseMethod = method,
    listen: (port, cb) => {
      server.listen(port, cb);
    },
    _server: server,
    use: use, // Added use() function to the returned object
  };
}

module.exports = myExpress;