type Config = {
  token: string
  guilds: string[]
  projectId: string
}

export const config: Config = require("../config.json")
