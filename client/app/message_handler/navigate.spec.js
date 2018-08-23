'use strict';

const FakeWindow = require('../mocks/fake_window');
const MessageHandler = require('./navigate');

describe('Navigate Handler', function() {

  let fakeWindow;
  let transmitter;
  let messageHandler;

  beforeEach(function() {
    fakeWindow = FakeWindow.create(this.sandbox);

    transmitter = {
      messageToService: this.sandbox.spy()
    };

    messageHandler = new MessageHandler(fakeWindow, transmitter);
  });

  it('should listen to messages with event "navigate"', function() {
    expect(messageHandler.MESSAGE_EVENT).to.be.eql('navigate');
  });

  it('should set proper location when calling handleMessage with params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'email_analysis/details',
        params: {
          campaign_id: 666,
          launch_id: 999
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'repmanager.php?session_id=SESSIONID',
      'changed=0',
      'action=analysis',
      'camp_id=666',
      'launch_id=999',
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
    ].join('&'));
  });

  it('should set proper location when calling handleMessage without params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'email_campaigns/list'
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql('campaignmanager.php?session_id=SESSIONID&action=list');
  });

  it('navigates to admin list', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'administrators/list'
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=service',
      'service=user-management',
      'service_path=/admin/list'
    ].join('&'));
  });

  describe('when unload confirm is initialized', function() {
    beforeEach(function() {
      fakeWindow.Emarsys.integration.unload.initialized = true;
      fakeWindow.Emarsys.integration.dialog.confirmNavigation = this.sandbox.stub().returns(fakeWindow.resolved());
    });

    it('should pop a confirm dialog when we have the unload confirm initialized', function() {
      messageHandler.handleMessage({
        event: 'navigate',
        data: {
          target: 'email_campaigns/list'
        },
        source: {
          integration_instance_id: 1
        }
      });

      expect(fakeWindow.Emarsys.integration.dialog.confirmNavigation).to.be.called;
    });

    it('should send response back to the service with success true', function(done) {
      messageHandler.handleMessage({
        event: 'navigate',
        data: {
          eventId: 1,
          target: 'email_campaigns/list'
        },
        source: {
          integration_instance_id: 1
        }
      })
        .then(() => {
          expect(transmitter.messageToService).to.have.been.calledWithMatch(
            'navigate:response',
            { id: 1, success: true }
          );

          done();
        });
    });
  });

  describe('when unload confirm is not initialized', function() {
    beforeEach(function() {
      fakeWindow.Emarsys.integration.unload.initialized = false;
    });

    it('should send response back to the service with success true', function() {
      messageHandler.handleMessage({
        event: 'navigate',
        data: {
          eventId: 1,
          target: 'email_campaigns/list'
        },
        source: {
          integration_instance_id: 1
        }
      });

      expect(transmitter.messageToService).to.have.been.calledWithMatch(
        'navigate:response',
        { id: 1, success: true }
      );

    });
  });

  it('should throw 404 when calling getUrlByTarget with invalid pathname', function() {
    let exceptionThrown;

    try {
      messageHandler.getUrlByTarget('invalid/pathname');
    } catch (e) {
      exceptionThrown = e;
    }

    expect(exceptionThrown.message).to.eql('Error 404: Unknown pathname');
  });

  it('should return valid campaign copy url when calling getUrlByTarget', function() {
    let copyUrl = messageHandler.getUrlByTarget('email_campaigns/copy');

    expect(copyUrl).to.eql('campaignmanager.php?session_id={session_id}&action=copy&copy={campaign_id}');
  });

  it('navigates to create campaign with proper params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'email_campaigns/create',
        params: {
          use_template: 'n',
          mailstream: 1
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'campaignmanager.php?session_id=SESSIONID',
      'action=new',
      'use_template=n',
      'mailstream=1'
    ].join('&'));
  });

  it('navigates to create content blocks based campaign with proper params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'email_campaigns/blocks/create',
        params: {
          mailstream: 1
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?r=contentBlocks/selector&session_id=SESSIONID',
      'mailstream=1'
    ].join('&'));
  });

  it('navigates to bounce management page with proper params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'bounce_management/list',
        params: {
          only_mailstreams: 1
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'adminmanager.php?session_id=SESSIONID&action=invmails',
      'only_mailstreams=1'
    ].join('&'));
  });

  it('navigates to program edit page with proper params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'program/edit',
        params: {
          program_id: 318
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=program/edit',
      'programId=318'
    ].join('&'));
  });

  it('navigates to program report page with proper params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'program/report',
        params: {
          program_id: 318
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=program/report',
      'programId=318'
    ].join('&'));
  });

  it('navigates to contact edit page with proper params', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'contact/edit',
        params: {
          uid: 318,
          return_url: 'triggeredEmail'
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'userprofiles.php?session_id=SESSIONID&action=show',
      'uid=318',
      'sback=triggeredEmail'
    ].join('&'));
  });

  it('navigates to trend reporting page for specific campaign', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'trendsreporting/trends/campaign',
        params: {
          campaign_id: 42
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'repmanager.php?action=analysis&page=1&step=11&session_id=SESSIONID',
      'camp_id=42'
    ].join('&'));
  });

  it('navigates to permission settings policies page', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'permission_settings/policies'
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=permissionSettings'
    ].join('&'));
  });

  it('navigates to permission settings roles page', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'permission_settings/roles'
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=permissionSettings#/roles'
    ].join('&'));
  });

  it('navigates to Tactics list page', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'tactics/list',
        params: {
          kpi: 'foo'
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=tactics',
      'kpi=foo'
    ].join('&'));
  });

  it('navigates to Tactics details page', function() {
    messageHandler.handleMessage({
      event: 'navigate',
      data: {
        target: 'tactics/details',
        params: {
          id: 'foo'
        }
      },
      source: {
        integration_instance_id: 1
      }
    });

    expect(fakeWindow.location.href).to.eql([
      'bootstrap.php?session_id=SESSIONID',
      'r=tactics',
      'id=foo'
    ].join('&'));
  });
});
