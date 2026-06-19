const redisClient = require("./redis");

(async () => {
  await redisClient.set("name", "Aravinth");

  const value = await redisClient.get("name");

  console.log(value);
})();