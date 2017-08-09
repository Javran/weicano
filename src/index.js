// ==UserScript==
// @name        weicano
// @namespace   javran.github.io
// @description Weibo.cn cleaner
// @include     https://weibo.cn/*
// @version     1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js
// ==/UserScript==

import { getKeywords, setKeyword, setKeywords } from './gm'

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
  $('#weicano-dialog').empty()
  keywords.map(([keyword,active], ind) => {
    const kwId = `weicano-kw-toggle-${ind}`
    $('#weicano-dialog').append(
      $(`<div />`).css({
        width: '100%',
        display: 'flex',
      }).append(
        $('<label />').css({flex: 1}).prop({for: kwId}).text(keyword)
      ).append(
        $('<input />').prop(
          Object.assign(
            {
              type: 'checkbox',
              name: kwId,
              id: kwId,
            },
            active ? {checked: true} : {}
          )
        )
      ).append(
        $('<button />').css({
          padding: 0,
          'font-size': '10px',
        }).prop({id: `${kwId}-btn`}).text('X')
      )
    )
  })
  $('#weicano-dialog').append(
    $('<div />').css({
      width: '100%',
      display: 'flex',
    }).append(
      $('<input />').css({
        flex: 1,
      }).prop({
        type: 'text',
        name: 'weicano-new-kw',
        id: 'weicano-new-kw',
      }).addClass('text ui-widget-content ui-corner-all')
    ).append(
      $('<button />').css({
        padding: 0,
        'font-size': '10px',
      }).prop({id: 'weicano-add-kw'}).text('+')
    )
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

  keywords.map((_kwInfo, ind) => {
    const kwId = `weicano-kw-toggle-${ind}`
    $(`#weicano-dialog button#${kwId}-btn`).click(() => {
      const newKeywords = []
      keywords.map((x, xInd) => ind !== xInd && newKeywords.push(x))
      setKeywords(newKeywords)
      applyFilters()
      mkDialogContent()
    })

    $(`#weicano-dialog input#${kwId}`).change(() => {
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
    $('<link/>').prop({
      rel: 'stylesheet',
      href: 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
    })
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
