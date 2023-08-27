import { Client } from './Structures'
import { MessageHandler, AssetHandler, CallHandler, EventHandler, NewsHandler, ModHandler } from './Handlers'
;(async () => {
    const client = new Client()

    await client.start()

    new AssetHandler(client).loadAssets()

    const messageHandler = new MessageHandler(client)

    const { handleEvents, sendMessageOnJoiningGroup } = new EventHandler(client)

    const { handleCall } = new CallHandler(client)

    const modHandler = new ModHandler(client)

    const newsHandler = new NewsHandler(client, messageHandler)

    messageHandler.loadCommands()

    client.on('new_message', async (M) => await messageHandler.handleMessage(M))

    client.on('participants_update', async (event) => await handleEvents(event))

    client.on('new_group_joined', async (group) => {
        messageHandler.groups.push(group.jid)
        await sendMessageOnJoiningGroup(group)
    })

    client.on('new_call', async (call) => await handleCall(call))

    client.on(
        'pokemon_levelled_up',
        async (data) =>
            await messageHandler.handlePokemonStats(data.M, data.pokemon, data.inBattle, data.player, data.user)
    )

    client.once('open', async () => {
        messageHandler.groups = await client.getAllGroups()
        await messageHandler.loadCardsEnabledGroups()
        await messageHandler.loadWildEnabledGroups()
        await newsHandler.loadNewsEnabledGroups()
        await modHandler.loadMods()
    })
})()
