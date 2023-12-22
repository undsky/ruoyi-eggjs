/** @type Egg.EggPlugin */
module.exports = {
  cors: {
    enable: true,
    package: "egg-cors",
  },
  decoratorRouter: {
    enable: true,
    package: "egg-decorator-router",
  },
  jwt: {
    enable: true,
    package: "egg-jwt",
  },
  static: {
    enable: true,
  },
};
