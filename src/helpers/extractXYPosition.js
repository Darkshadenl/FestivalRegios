export default function extractXYPosition(id) {
    let col = id.search('col') + 2;
    let rowFirstPos = id.search('row');
    let rowLastPos = id.search('row') + 2;
    let actualCol = parseInt(id.slice(col + 1, rowFirstPos));
    let actualRow = parseInt(id.slice(rowLastPos + 1, id.length));

    return { col: actualCol, row: actualRow};
}