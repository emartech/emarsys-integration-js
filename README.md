# Build status

|Branch|Status|
|------|------|
|master|[![Codeship Status for emartech/emarsys-integration-js](https://codeship.com/projects/c32db210-4f1d-0133-4363-02c24d531ca5/status?branch=master)](https://codeship.com/projects/107145)|
|production|[![Codeship Status for emartech/emarsys-integration-js](https://codeship.com/projects/c32db210-4f1d-0133-4363-02c24d531ca5/status?branch=production)](https://codeship.com/projects/107145)|

# emarsys-integration-js

Emarsys Integration JS (SIJS) is an API providing methods of communication between Emarsys and integrated services running in an iframe. One can send post messages out of the iframe and SIJS will handle those requests if there is a handler for.

__General message format__

```
{
  "event": "handler",
  "data": {
    "some_key": "data"
   },
  "source": {
    "integration_id": "some_integration",
    "integration_instance_id": "iframe's random id"
  }
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|event|Name of the handler to pass the message to.|YES|
|some_key|Arbitrary data the handler needs to work properly.|
|source|This is a signature marking where the message came from. Every integration has an ID (eg. content-editor) and every integration iframe instance has an instance ID (a sufficiently large random number, actually).     Though not all message handlers do rely on _source_, it is best to always include it in your message.|MIXED|

# Message handlers available

## Alert

This handler will render a sticky e-alert box on top of the page and remove it after a timeout has elapsed.

__Message format__

```
{
  "event": "alert",
  "data": {
    "text": "Error saving content",
    "icon": "circle-exclamation",
    "className": "e-alert-danger",
    "timeout": 3000
  }
}
```

__Fields__

|Field|Role|Mandatory|Default|
|-----|----|---------|-------|
|text|Alert message.|YES|
|icon|Icon class of the icon to be rendered on the left side of the alert. Eg. 'check' for a check mark or 'exclamation-circle' for an exclamation mark in a circle.|NO|
|className|Alert sub-class to use when rendering the alert. Eg. 'e-alert-success' for a green bar, 'e-alert-danger' for a red one.|NO|
|timeout|Amount of time after the alert will fade out and get removed from the DOM, in milliseconds.|NO|5000|

## Confirm

This handler will open a confirm dialog with the content given.

__Message format__

```
{
  "event": "enable_button",
  "data": {
    "title": "Are you sure you want to navigate away?",
    "body": "You have unsaved changes you will lose if navigating away.",
    "ok": "Yes I am",
    "cancel": "No, I'm not"
  }
}
```

__Options__

|Field|Role|Mandatory|Default|
|-----|----|---------|-------|
|title: String|Title of the confirm dialog.|YES||
|body: String|Body text of the confirm dialog.|NO||
|cancel: String|Text of Cancel button.|YES||
|ok: String|Text of OK button.|YES||


## EnableButton

This handler will remove the class _e-btn-disabled_ from a selection of DOM elements.

__Message format__

```
{
  "event": "enable_button",
  "data": {
    "selector": "#foo-id"
  }
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|selector|jQuery selector.|YES|


## GetUrl

This handler will respond with a prespecified URL. Target URLs are built using data passed in the message. Session ID is provided by the handler if needed.
See [Navigate](#navigate) for the targets that can be used.

__Message format__

```
{
  "event": "get_url",
  "data": {
    "eventId": 111,
    "target": "some/prespecified/path",
    "params": {
      "foo": "foo_indeed"
    }
  }
}
```

__Response format__

```
{
  "id": 111,
  "success": true,
  "url": "path.php?session_id=SESSIONID&action=foo_indeed"
}
```

__Response format in case of error__

```
{
  "id": 111,
  "success": false,
  "error": "something went terribly wrong"
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|target|The prespecified target you would like to have a link to.|YES|
|params.foo|The general param the actual target needs.|MIXED|
|eventId|The unique identifier of the message, it will be returned in the response.|YES|

## Modal

This handler will open a modal dialog with content provided by either Emarsys or your service rendered in an iframe inside the modal. It will generate a new integration instance ID for the iframe and glue integration_id, integration_instance_id and opener_integration_instance_id to the iframe URL.

__Message format__

```
{
  "event": "modal",
  "data": {
    "src": "some-url-in-your-service",
    "width": 500,
    "height": 200,
  },
  "source": {
    "integration_id": "some_integration",
    "integration_instance_id": "12345"
  }
}
```

__Fields__

|Field|Role|Mandatory|Default|
|-----|----|---------|-------|
|src|An URL where the markup of the modal content can be found.|YES||
|width|Width of the iframe we'll include in the modal.|NO|650|
|height|Height of the iframe we'll include in the modal.|NO|500|
|source.integration_id|ID of the integration the message is coming from.|NO|
|source.integration_instance_id|Random instance ID of the integration the message is coming from.|YES|


__Iframe URL query params auto-added__

|Param name|Role|
|----------|----|
|integration_id|Integration ID.|
|integration_instance_id|The new auto-generated instance ID.|
|opener_integration_instance_id|Instance ID of the integration the modal was opened by.|

## Modal:close

This handler will remove any _e-modal_ elements from the DOM.

__Message format__

```
{
  "event": "modal:close"
}
```

## Navigate

This handler will navigate the browser's main window to a prespecified URL. Target URLs are built using data passed in the message. Session ID is provided by the handler if needed.

__Message format__

```
{
  "event": "navigate",
  "data": {
    "target": "some/prespecified/path",
    "params": {
      "foo": "foo_indeed"
    }
  }
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|target|The prespecified target you would like to head to.|YES|
|params.foo|The general param the actual target needs.|MIXED|

__Targets available__

|Target|Action|Params|
|------|------|------|
|email_campaigns/list|Will head to the campaign list.||
|email_campaigns/create|Will open the editor with a new campaign.|use_template, mailstream|
|email_campaigns/edit|Will open the editor with the campaign set.|campaign_id|
|email_campaigns/copy|Will open the editor with a new copied campaign.|campaign_id|
|email_campaigns/blocks/create|Will open the content blocks template selector.|mailstream|
|email_analysis/list|Will head to reporting.||
|email_analysis/details|Will head to reporting details of a campaign.|campaign_id, launch_id|
|bounce_management/list|Will head to Bounce management page|only_mailstreams
|administrators/profile|Administrator profile page|admin_id|
|administrators/list|Administrator list page||
|administrators/security-settings|Security settings page||
|administrators/locked_out|Login page with locked out error message||
|segments/combine|Combine a segment|segment_id|
|segments/edit|Edit a segment|segment_id|
|combined_segments/list|List combined segments||
|program/create|AC program creation||
|program/list|AC program overview||
|trendsreporting/trends|Trend reporting page||
|trendsreporting/trends/campaign|Trend reporting page for specific campaign|campaign_id|
|me_push/edit|Mobile Engage push campaign editor|id|
|me_push/report|Mobile Engage push campaign report|push internal campaign id|
|me_push/campaigns|Mobile Engage push campaigns list
|me_push/inapp-campaigns|Mobile Engage inapp campaigns list
|me_push/inapp-campaigns/report|Mobile Engage inapp campaign report|id|
|me_push/inapp-campaigns/edit|Mobile Engage inapp campaign edit|id|
|rti/edit|RTI program editor|id|
|rti/report|RTI program report|id|
|revenue_attribution/settings|Revenue Attribution settings||
|revenue_attributor/settings|New Revenue Attribution settings||
|homepage|Homepage||
|forms/edit|Will open the form editor page|form_id|

## Proxy

This handler will forward a message to another integration iframe.

__Message format__

```
{
  "event": "proxy",
  "data": {
    "event": "service-event",
    "envelope": {
      "some_key": "data"
    },
    "integrationInstanceId": "9876"
  }
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|envelope|The message passed to the recipient iframe.|NO|
|integrationInstanceId|The random ID of the integration you would like to send the message to.|YES|

## Refresh

This handler will reload the actual browser window.

__Message format__

```
{
  "event": "refresh"
}
```

## Resize

This handler will resize the iframe the message came from.

__Message format__

```
{
  "event": "resize",
  "data": {
    "height": 100,
  },
  "source": {
    "integration_id": "some_integration",
    "integration_instance_id": "12345"
  }
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|height|The iframe's desired height.|YES|
|source.integration_id|ID of the integration the message is coming from.|NO|
|source.integration_instance_id|Random instance ID of the integration the message is coming from.|YES|

## Track

This handler will call Google Analytics API if available with the given options.

__Message format__

```
{
  "event": "track",
  "data": {
    "eventCategory": "some_category",
    "eventAction": "some_action",
    "eventLabel": "some_label",
    "hitType": "event"
  }
}
```

## Unload:init

This handler will set up click handler for `<a>` elements, popping a navigation confirm dialog when clicked. It makes sense to call send this event right after your content gets dirty.

__Message format__

```
{
  "event": "unload:init",
  "data": {
    "selector": "#menu",
    "confirm": {
      "title": "Are you sure you want to navigate away?",
      "body": "You have unsaved changes you will lose if navigating away.",
      "ok": "Yes I am",
      "cancel": "No, I'm not"
    }
  }
}
```

__Fields__

|Field|Role|Mandatory|Default|
|-----|----|---------|-------|
|selector: String|Selector for ancestor elements of `<a>` elements.|YES||
|confirm: Object|Options for confirm dialog. See `dialog.confirm()`.|NO|Options for a general unload confirm dialog.|

## Unload:reset

Stopping to watch click events of elements selected by `selector`.  It makes sense to call this method right after your content gets clean (ie. saved).

__Message format__

```
{
  "event": "unload:reset",
  "data": {
    "selector": "#menu"
  }
}
```

__Fields__

|Field|Role|Mandatory|
|-----|----|---------|
|selector: String|Selector for ancestor elements of `<a>` elements.|YES|

# Functions available

## getFullUrlByTarget

Get URL by target (same targets available as in navigate message handler), useful for links.

```javascript
window.Emarsys.integration.getFullUrlByTarget({
  target: 'me_push/edit',
  params: {
    id: 318
  }
})
```

## navigate

Redirect to target (same targets available as in navigate message handler).

```javascript
window.Emarsys.integration.navigate({
  target: 'me_push/edit',
  params: {
    id: 318
  }
})
```

# Development

If you would like to make local changes, you need to run `gulp start`. You can reach the resulting code [on this local URL then](http://localhost:1235/integration.js).

## Running tests

If you want to run the tests on your machine you can do by executing one of the following commands:
```bash
gulp test
npm test
```

If you don't have gulp on your machine you can install by executing the following command:
```bash
npm i -g gulp
```

# Deployment

Code is automatically built and deployed whenever there is a new changeset in following branches:

|Changes to branch|Go live on environment|
|-----------------|----------------------|
|master|staging|
|production|production|

So you can push your changes into the master branch, and Codeship will deploy it to the staging environment. Also you can merge your changes to the master branch, and it will be deployed to production by Codeship:

```bash
git checkout production
git pull --rebase
git merge origin master
git push
```
