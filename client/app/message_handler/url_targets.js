'use strict';

module.exports = {
  'email_campaigns/list': [
    'campaignmanager.php?session_id={session_id}',
    'action=list'
  ].join('&'),

  'email_campaigns/create': [
    'campaignmanager.php?session_id={session_id}',
    'action=new',
    'use_template={use_template}',
    'mailstream={mailstream}'
  ].join('&'),

  'email_campaigns/blocks/create': [
    'bootstrap.php?r=contentBlocks/selector&session_id={session_id}',
    'mailstream={mailstream}'
  ].join('&'),

  'email_campaigns/edit': [
    'campaignmanager.php?session_id={session_id}',
    'action=content',
    'camp_id={campaign_id}'
  ].join('&'),

  'email_campaigns/copy': [
    'campaignmanager.php?session_id={session_id}',
    'action=copy',
    'copy={campaign_id}'
  ].join('&'),

  'email_analysis/list': [
    'repmanager.php?session_id={session_id}',
    'action=overview'
  ].join('&'),

  'email_analysis/details': [
    'repmanager.php?session_id={session_id}',
    'changed=0',
    'action=analysis',
    'camp_id={campaign_id}',
    'launch_id={launch_id}',
    'page=1',
    'search=',
    'step=1',
    'save_pref=on',
    'tabdetails_length=10',
    'tabfull_length=10',
    'campaign_category=',
    'admin=n',
    'status=current',
    'type=all'
  ].join('&'),

  'bounce_management/list': [
    'adminmanager.php?session_id={session_id}',
    'action=invmails',
    'only_mailstreams={only_mailstreams}'
  ].join('&'),

  'contact/edit': [
    'userprofiles.php?session_id={session_id}',
    'action=show',
    'uid={uid}',
    'sback={return_url}'
  ].join('&'),

  'contact_lists/details': [
    'userprofiles.php?session_id={session_id}',
    'action=searchnlist',
    'list_id={contact_list_id}'
  ].join('&'),

  'content_blocks/selector': [
    'bootstrap.php?session_id={session_id}',
    'r=contentBlocks/selector'
  ].join('&'),

  'administrators/profile': [
    'bootstrap.php?session_id={session_id}',
    'r=service',
    'service=user-management',
    'service_path=/admin/profile/{admin_id}'
  ].join('&'),

  'administrators/security-settings': [
    'bootstrap.php?session_id={session_id}',
    'r=service',
    'service=user-management',
    'service_path=/security-settings'
  ].join('&'),

  'administrators/list': [
    'bootstrap.php?session_id={session_id}',
    'r=service',
    'service=user-management',
    'service_path=/admin/list'
  ].join('&'),

  'segments/combine': [
    'bootstrap.php?session_id={session_id}',
    'r=combinedSegment/edit',
    'filter_id={segment_id}'
  ].join('&'),

  'program/create': [
    'bootstrap.php?session_id={session_id}',
    'r=program/create'
  ].join('&'),

  'program/edit': [
    'bootstrap.php?session_id={session_id}',
    'r=program/edit',
    'programId={program_id}'
  ].join('&'),

  'program/report': [
    'bootstrap.php?session_id={session_id}',
    'r=program/report',
    'programId={program_id}'
  ].join('&'),

  'trendsreporting/trends': [
    'bootstrap.php?session_id={session_id}',
    'r=trendsreporting/trends'
  ].join('&'),

  'trendsreporting/trends/campaigns': [
    'bootstrap.php?session_id={session_id}',
    'r=trendsreporting/trends',
    'campaignIds={campaign_ids}'
  ].join('&'),

  'trendsreporting/trends/campaign': [
    'repmanager.php?action=analysis&page=1&step=11&session_id={session_id}',
    'camp_id={campaign_id}'
  ].join('&'),

  'administrators/locked_out': 'custlogin.php?lockout=1',

  'admin/data_onboarding': [
    'bootstrap.php?session_id={session_id}',
    'r=service',
    'service=data_onboarding',
    'menu=12700'
  ].join('&'),

  'permission_settings/policies': [
    'bootstrap.php?session_id={session_id}',
    'r=permissionSettings'
  ].join('&'),

  'permission_settings/roles': [
    'bootstrap.php?session_id={session_id}',
    'r=permissionSettings#/roles'
  ].join('&'),

  'tactics/list': [
    'bootstrap.php?session_id={session_id}',
    'r=tactics',
    'kpi={kpi_fake}'
  ].join('&') + '#/?kpi={kpi}',

  'tactics/details': [
    'bootstrap.php?session_id={session_id}',
    'r=tactics#/?id={id}'
  ].join('&'),

  'me_push/edit': [
    'bootstrap.php?session_id={session_id}',
    'r=service/index',
    'service=push-notification',
    'iframe=show',
    '#/campaigns/{id}'
  ].join('&'),

  'me_push/report': [
    'bootstrap.php?session_id={session_id}',
    'r=service/index',
    'service=push-notification',
    'iframe=show',
    '#/reports/{id}'
  ].join('&')
};
