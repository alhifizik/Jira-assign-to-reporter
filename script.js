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
      href: "/secure/AssignIssue.jspa?atl_token=" + token + '&id=' + id +
      '&assignee=' + reporter
    }).appendTo(span)

  }
}

function obtainInfo(issueKey, type) {
  restUrl = $(location).attr('href').substring(0,
    $(location).attr('href').indexOf('browse'))
  restUrl += 'rest/api/latest/issue/' + issueKey + '?fields=reporter,assignee'
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onload = function() {
    response = xmlHttp.responseText
    obj = JSON.parse(response)
    childReporter = obj.fields.reporter.name
    childAssignee = obj.fields.assignee.name
  }
  xmlHttp.open( "GET", restUrl, true)
  xmlHttp.send()
  return [childReporter, childAssignee]
}

function contextmenu(assignItemLink){
  issueKey = assignItemLink.attr('data-issuekey')
  issueId = assignItemLink.attr('data-issueid')
  reporter = obtainInfo(issueKey)[0]
  assignee = obtainInfo(issueKey)[1]
  console.log(reporter)
  console.log(assignee)

  if (reporter != assignee && reporter != currentUser) {

    li = $('<li>', {
      class: 'aui-list-item'
    }).insertAfter($('.aui-list-item-link.issueaction-assign-issue').parent())

    link = $('<a>', {
      href: "/secure/AssignIssue.jspa?atl_token=" + token + '&id=' + issueId +
      '&assignee=' + reporter + '&returnUrl=' + $(location).attr('href') +
      '&atl_token=' + token,
      class: 'aui-list-item-link issueaction-assign-to-reporter',
      text: linkText
    }).appendTo(li)


    li.hover(function() {
      $(this).prop('class', 'aui-list-item active')
      $(this).prev().prop('class', 'aui-list-item')
      $(this).next().prop('class', 'aui-list-item')
    }, function() {
      $(this).prop('class', 'aui-list-item')
    })
  }
}


if (browse > 0 || issues > 0 || selectedIssue > 0) {
  $(document).keypress(function(){
    if(event.which == 114) {
      if($(event.target).prop("tagName") ==  'BODY'){
        assignShortcut()}
    }

  var callback = function(mutations){
    link = $('*[data-mydata="assign-to-reporter"]')
    if (link.length == 0 && !!$('[id^="issue_summary_reporter_"]')) {
      addElement()
    }

    popup = $('.ajs-layer.box-shadow.active')
    assignItemLink = popup.find('.aui-list-item-link.issueaction-assign-issue')
    reporterItemLink = popup.find('.aui-list-item-link.issueaction-assign-to-reporter')
    if (popup.length > 0 && assignItemLink.length > 0 && reporterItemLink.length == 0) {
      contextmenu(assignItemLink)
    }
  }

  mo = new MutationObserver(callback)
  options = {
    'subtree': true,
    'attributes': true
  }
  mo.observe($('body')[0], options)
}
