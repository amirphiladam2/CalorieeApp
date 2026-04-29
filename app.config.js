const fs = require("fs");
const path = require("path");

const appJson = require("./app.json");

module.exports = ({ config }) => {
  const baseConfig = appJson.expo ?? config ?? {};

  const localAndroidGoogleServicesPath = "./google-services.json";
  const resolvedLocalAndroidGoogleServicesPath = path.join(
    __dirname,
    "google-services.json"
  );

  const androidGoogleServicesFile =
    process.env.GOOGLE_SERVICES_JSON ??
    process.env.EXPO_ANDROID_GOOGLE_SERVICES_FILE ??
    (fs.existsSync(resolvedLocalAndroidGoogleServicesPath)
      ? localAndroidGoogleServicesPath
      : undefined);

  return {
    ...baseConfig,
    android: {
      ...baseConfig.android,
      ...(androidGoogleServicesFile
        ? { googleServicesFile: androidGoogleServicesFile }
        : {}),
    },
  };
};
