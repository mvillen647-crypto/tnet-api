const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  SIGHTENGINE_API_USER: process.env.SIGHTENGINE_API_USER || "",
  SIGHTENGINE_API_SECRET: process.env.SIGHTENGINE_API_SECRET || ""
};

export default env;
