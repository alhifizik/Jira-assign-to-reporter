if (!!$("[content = 'JIRA']")) {
  var browse = $(location).attr('href').indexOf('browse')
  var issues = $(location).attr('href').indexOf('issues')
  var selectedIssue = $(location).attr('href').indexOf('selectedIssue')
  var currentUser = $("[name = 'ajs-remote-user']").attr('content')
  var token = $("#atlassian-token").attr('content')
}

linkText = "Assign to reporter"
titleText = "Assign this issue to the reporter ( Type 'r' )"

function addElement() {
  reporter = $('[id^="issue_summary_reporter_"]').attr('rel')
  assignee = $('[id^=issue_summary_assignee_]')
  if (assignee) {
    assignee = assignee.attr('rel')
  }
  if (reporter != assignee && reporter != currentUser) {
    if (selectedIssue > 0) {
        id = $('#ghx-detail-issue').attr('data-issueid')
    } else {
        id = $('#key-val').attr('rel')
    }

    span = $('<span>', {
      class: 'assign-to-me-link',
      "data-mydata": 'assign-to-reporter'
    }).insertAfter("#assignee-val")

    link = $('<a>', {
      class: 'issueaction-assign-to-me',
      text: linkText,
      title: titleText,
      href: "/secure/AssignIssue.jspa?atl_token=" + token + '&id=' + id + '&assignee=' + reporter
    }).appendTo(span)

  }
}

// function addElementOnDialog(){
//   issueKey = document.querySelector('[title = "assigneeEditIssueKey"]').value
//   reporter = obtainReporter(issueKey)
//   link = document.createElement("a")
//   link.id = 'assign-to-me-trigger'
//   link.dataset.mydata = 'assign-to-reporter-trigger'
//   link.textContent = linkText + ' ()'
//   document.getElementById('assignee-container').insertBefore(link, document.getElementById('assignee-container').querySelector('[class="hidden parameters"]'))
//   link.addEventListener('click',function(){
//     document.getElementById('assignee-field').value = reporter
//   })
// }

function obtainReporter(issueKey) {
  restUrl = $(location).attr('href').substring(0, $(location).attr('href').indexOf('browse'))
  restUrl += 'rest/api/latest/issue/' + issueKey + '?fields=reporter'

  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onload = function() {
    response = xmlHttp.responseText
    obj = JSON.parse(response)
    reporter = obj.fields.reporter.name
    id = obj.id
  }
  xmlHttp.open( "GET", restUrl, true)
  xmlHttp.send()

  return reporter
}

function assignShortcut(){
  link = $('*[data-mydata="assign-to-reporter"]')
  if (link.length > 0) {
    $('*[data-mydata="assign-to-reporter"]').children("a")[0].click()
  }
}

function contextMenu(issueKey, id){
  console.log(id)
  reporter = obtainReporter(issueKey)

  li = $('<li>', {
    class: 'aui-list-item'
  }).insertAfter($('.aui-list-item-link.issueaction-assign-issue').parent())
  link = $('<a>', {
    class: 'aui-list-item-link issueaction-assign-to-reporter',
    href: "/secure/AssignIssue.jspa?atl_token=" + token + '&id=' + id +
    '&assignee=' + reporter + '&returnUrl=' + $(location).attr('href') +
    '&atl_token=' + token,

    text: linkText
  }).appendTo(li)

  li.hover(
    function() {
      $(this).prop('class', 'aui-list-item active')
      $(this).prev().prop('class', 'aui-list-item')
      $(this).next().prop('class', 'aui-list-item')
    }, function() {
      $(this).prop('class', 'aui-list-item')
    })
}


if (browse > 0 || issues > 0 || selectedIssue > 0) {
  $(document).keypress(function(){
    if(event.which == 114) {
      assignShortcut()}
  })

  var callback = function(mutations){
    // assignDialog = document.getElementById('assign-dialog')
    // linkOnDialog = document.querySelector('[data-mydata = "assign-to-reporter-trigger"]')
    // if (!!assignDialog && !linkOnDialog) {
    //   addElementOnDialog()
    // }
    link = $('*[data-mydata="assign-to-reporter"]')
    if (link.length == 0 && !!$('[id^="issue_summary_reporter_"]')) {
      addElement()
    }
    assignPopup = $('.aui-list-item-link.issueaction-assign-issue')
    issueKey = assignPopup.attr('data-issuekey')
    id = assignPopup.attr('data-issueid')
    reporterPopup = $('.aui-list-item-link.issueaction-assign-to-reporter')
    if (assignPopup.length == 1 && reporterPopup.length < 1) {
      contextMenu(issueKey, id)
    }
  }

  mo = new MutationObserver(callback)
  options = {
    'subtree': true,
    'attributes': true
  }
  mo.observe($('body')[0], options)
}