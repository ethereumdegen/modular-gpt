const defaultConfig = {
  numWebResults: 3,
  webAccess: true,
  region: "wt-wt",
  timePeriod: "",
  language: "en",
  promptUUID: "default",
  trimLongText: false,
};

export type UserConfig = typeof defaultConfig;

export async function getUserConfig(): Promise<UserConfig> {
  // const config = await Browser.storage.sync.get(defaultConfig)
  return defaultConfig; //defaults(config, defaultConfig)
}
/*
export async function updateUserConfig(config: Partial<UserConfig>): Promise<void> {
    await Browser.storage.sync.set(config)
}
*/
