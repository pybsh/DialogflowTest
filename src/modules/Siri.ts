import { applicationCommand, Extension, listener, option } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js"
import { config } from "../config"

import * as dialogflow from "@google-cloud/dialogflow"
import * as uuid from 'uuid'

class SiriExtension extends Extension {
  @applicationCommand({
    name: "siri",
    type: ApplicationCommandType.ChatInput,
    description: "hey siri",
  })

  async siri(i: ChatInputCommandInteraction, 
    @option({
    type: ApplicationCommandOptionType.String,
        name: "says",
        description: "Something to say with Siri",
        required: true,
    }) says: string
    ) {

    const projectId = config.projectId
    const sessionId = uuid.v4()

    const sessionClient = new dialogflow.SessionsClient()
    const sessionPath = await sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    )

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: says,
                languageCode: 'ko-KR',
            }
        }
    }

    const responses = await sessionClient.detectIntent(request)
    const result = responses[0].queryResult

    await i.reply(`${result?.fulfillmentText}`)
  }
}

export const setup = async () => {
  return new SiriExtension()
}
