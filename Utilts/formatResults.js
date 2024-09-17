module.exports = formatResults;

const pb = {
    leGreen: '<:_:1206072263716380725>',
    meGreen: '<:_:1206072335699017729>',
    reGreen: '<:_:1206072366967427142>',
    lfGreen: '<:_:1206072407333277716>',
    mfGreen: '<:_:1206072457824309248>',
    rfGreen: '<:_:1206072540598902784>',
    leRed: '<:_:1206072598954516500>',
    meRed: '<:_:1206072651429445642>',
    reRed: '<:_:1206072696027353161>',
    lfRed: '<:_:1206072729665802250>',
    mfRed: '<:_:1206072753988575252>',
    rfRed: '<:_:1206072784615383120>',
};

function calculateColor(upvotePercentage, downvotePercentage) {
    if (upvotePercentage === 0) {
        return 'red';
    } else if (downvotePercentage === 0) {
        return 'green';
    } else {
        return 'mixed';
    }
}

function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 26;

    const upvotePercentage = upvotes.length / totalVotes;
    const downvotePercentage = downvotes.length / totalVotes;

    const color = calculateColor(upvotePercentage, downvotePercentage);

    const halfProgressBarLength = progressBarLength / 2;
    const filledSquaresGreen = Math.min(Math.round(upvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;
    const filledSquaresRed = Math.min(Math.round(downvotePercentage * halfProgressBarLength), halfProgressBarLength) || 0;

    const upPercentage = upvotePercentage * 100 || 0;
    const downPercentage = downvotePercentage * 100 || 0;

    const progressBar =
        color === 'red'
            ? pb.lfRed + pb.mfRed.repeat(halfProgressBarLength) + pb.rfRed
            : color === 'green'
                ? pb.lfGreen + pb.mfGreen.repeat(halfProgressBarLength) + pb.rfGreen
                : (filledSquaresGreen ? pb.lfGreen : pb.leGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresGreen ? pb.mfGreen : pb.meGreen) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.mfRed : pb.meRed) +
                (filledSquaresRed ? pb.rfRed : pb.reRed);

    const results = [];
    results.push(
        `:thumbsup: ${upvotes.length} Votos a favor (${upPercentage.toFixed(1)}%) • :thumbsdown: ${downvotes.length
        } Votos negativos (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
}

module.exports = formatResults;