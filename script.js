if (!!$("[content = 'JIRA']")) {
  var browse = $(location).attr('href').indexOf('browse')
  var issues = $(location).attr('href').indexOf('issues')
  var selectedIssue = $(location).attr('href').indexOf('selectedIssue')
  var currentUser = $("[name = 'ajs-remote-user']").attr('content')
  var token = $("#atlassian-token").attr('content')
}

linkText = "Assign to reporter"
titleText = "Assign this issue to the reporter"

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

if (browse > 0 || issues > 0 || selectedIssue > 0) {

  var callback = function(mutations){
    link = $('*[data-mydata="assign-to-reporter"]')
    if (link.length == 0 && !!$('[id^="issue_summary_reporter_"]')) {
      addElement()
    }
  }

  mo = new MutationObserver(callback)
  options = {
    'subtree': true,
    'attributes': true
  }
  mo.observe($('body')[0], options)
}
