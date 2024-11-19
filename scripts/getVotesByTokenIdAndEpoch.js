const { getVotesByTokenIdAndEpoch } = require("../subgraph/services")

const TOKEN_ID = 1
const EPOCH = 20027

async function main() {
    const votes = await getVotesByTokenIdAndEpoch({
        tokenId: TOKEN_ID,
        epoch: EPOCH,
        where: {}
    })
    console.log(votes)
    //HAY QUE FILTRAR Y QUEDARSE CON LOS VOTES DE LA ÚLTIMA EPOCH QUE NOS APAREZCA AUNQUE SEA MENOR A LA PASADA POR PARAM
    //SI NO APARECE NINGÚN REGISTRO ES QUE NO HEMOS VOTADO NUNCA CON ESE NFT.
}

main()