// ==UserScript==
// @name        weicano
// @namespace   javran.github.io
// @description Weibo.cn cleaner
// @include     https://weibo.cn/*
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js
// ==/UserScript==
const getKeywords = () =>
  JSON.parse(GM_getValue('keywords','[]'))

const setKeywords = keywords =>
  GM_setValue('keywords',JSON.stringify(keywords))

const setKeyword = (keyword, value=true) => {
  const keywords = getKeywords()
  const kwInd = keywords.findIndex(([kw]) => kw === keyword)
  let newKeywords
  if (kwInd === -1) {
    keywords.push([keyword,value])
  } else {
    keywords[kwInd][1] = value
  }
  setKeywords(keywords)
}

const applyFilters = () => {
  const activeKeywords = _.flatMap(
    getKeywords(),
    ([kw,active]) => active ? [kw] : []
  )
  const shouldBlock = node => {
    const jqNode = $(node)
    return activeKeywords.some(keyword =>
      jqNode.find(`div:contains('${keyword}')`).length
    )
  }

  $("html body div[id*='M_'].c").each((_ind,x) => {
    const jq = $(x)
    if (shouldBlock(x)) {
      jq.hide().next('.s').hide()
    } else {
      jq.show().next('.s').show()
    }
  })
}

const mkDialogContent = () => {
  const dlg = $('#weicano-dialog').dialog(
    {
      autoOpen: false,
      position: {my: 'top', at: 'bottom', of: '#weicano-entry'},
    }
  )

  const keywords = getKeywords()
  $('#weicano-dialog').html(
    [
      ..._.flatMap(
        keywords,
        ([keyword,active], ind) => {
          const kwId = `weicano-kw-toggle-${ind}`
          return [
            '<div style="width: 100%; display: flex">',
            `<label style="flex: 1" for="${kwId}">${keyword}</label>`,
            `<input type="checkbox" name="${kwId}" id="${kwId}" ${active ? "checked" : ""}>`,
            `<button style="padding: 0; font-size: 10px" id="${kwId}-btn">X</button>`,
            '</div>',
          ]
        }),
      ...[
        `<div style="width: 100%; display: flex">`,
        `<input style="flex: 1" type="text" name="weicano-new-kw" id="weicano-new-kw" class="text ui-widget-content ui-corner-all">`,
        `<button style="padding: 0; font-size: 10px" id="weicano-add-kw">+</button>`,
        '</div>',
      ],
    ].join('')
  )

  $('#weicano-dialog button#weicano-add-kw').click(() => {
    const newKeyword = $('#weicano-dialog input#weicano-new-kw').val().trim()
    if (newKeyword) {
      $('#weicano-dialog input#weicano-new-kw').val('')
      setKeyword(newKeyword)
      applyFilters()
      mkDialogContent()
    }
  })

  keywords.map((kwInfo, ind) => {
    const [keyword,active] = kwInfo
    const kwId = `weicano-kw-toggle-${ind}`
    $(`#weicano-dialog button#${kwId}-btn`).click(() => {
      const newKeywords = []
      keywords.map((x, xInd) => ind !== xInd && newKeywords.push(x))
      setKeywords(newKeywords)
      applyFilters()
      mkDialogContent()
    })

    $(`#weicano-dialog input#${kwId}`).change(e => {
      const newVal = e.target.checked
      keywords[ind][1] = !keywords[ind][1]
      setKeywords(keywords)
      applyFilters()
      mkDialogContent()
    })
  })

  $('#weicano-entry').text(
    'Weicano'
  ).click(() =>
    dlg.dialog('open')
  )
}

document.documentElement.setAttribute('lang', 'zh-CN')
$(document).ready(() => {
  $('head').append(
    $('<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">')
  )
  $("a#top:contains('广场')").parent().hide()

  {
    const jq = $("a.nl:contains('话题')")
    jq.hide()
    jq[0].nextSibling.textContent = ''

    jq.parent(
    ).append(
      '|'
    ).append(
      $('<button id="weicano-entry" />')
    ).append(
      $('<div id="weicano-dialog" title="Weicano" />').hide()
    )
  }

  $("a#top[href='http://m.weibo.cn']").parent().hide()
  $('div.pm > form span.pmf').hide()

  applyFilters()
  mkDialogContent()
})
