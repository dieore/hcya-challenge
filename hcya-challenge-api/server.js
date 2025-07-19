const cors = require("cors");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(cors()); 

// Support for partial text searches
server.use((req, res, next) => {
  const query = req.query;
  const likeKeys = Object.keys(query).filter((key) => key.endsWith('_like'));

  if (likeKeys.length > 0) {
    const resource = req.path.replace('/', '');
    let data = router.db.get(resource).value();

    likeKeys.forEach((key) => {
      const actualKey = key.replace('_like', '');
      const value = String(query[key]).toLowerCase();
      data = data.filter((item) => {
        const field = item[actualKey];
        return typeof field === 'string' && field.toLowerCase().includes(value);
      });
    });

    return res.jsonp(data);
  }

  next();
});


server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log("✅ Server listening on http://localhost:3000");
});
