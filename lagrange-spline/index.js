export default points => {
  const n = points.length - 1

  const p = (i, j, x) => {
    return i === j
      ? points[i][1]
      : ((points[j][0] - x) * p(i, j - 1, x) + (x - points[i][0]) * p(i + 1, j, x)) /
          (points[j][0] - points[i][0])
  }

  return x => (n === -1 ? 0 : p(0, n, x))
}
