const getKeywords = () =>
  JSON.parse(GM_getValue('keywords','[]'))

const setKeywords = keywords =>
  GM_setValue('keywords',JSON.stringify(keywords))

const setKeyword = (keyword, value=true) => {
  const keywords = getKeywords()
  const kwInd = keywords.findIndex(([kw]) => kw === keyword)
  if (kwInd === -1) {
    keywords.push([keyword,value])
  } else {
    keywords[kwInd][1] = value
  }
  setKeywords(keywords)
}

export {
  getKeywords,
  setKeyword,
  setKeywords,
}
