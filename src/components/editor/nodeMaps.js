export const nodeChildrenMap = {
  'root': () => [],
  'dynamicParams': () => [[], []],
  'case': () => [[],[]],
  'fixedParams': (node) => {
    let paramAmount = node.paramAmount;
    const children = [];
    if (paramAmount === undefined) {
      children.push([]);
    } else {
      while (paramAmount) {
        children.push([]);
        paramAmount--;
      }
    }
    return children;
  }
}