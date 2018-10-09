'use strict';

const getFullUrlByTarget = require('./get_full_url_by_target');

const targets = {
  'test/first': 'bootstrap.php?session_id={session_id}#/campaigns/{id}',
  'test/second': 'bootstrap.php?session_id={session_id}#/campaigns/{id}/campaigns/{id}'
};

describe('getFullUrlByTarget', function() {
  it('should return the right url for the target filled with params', () => {
    const url = getFullUrlByTarget(targets)({ sessionId: 'the_session', target: 'test/first', params: { id: 1 } });
    expect(url).to.eql(
      'bootstrap.php?session_id=the_session#/campaigns/1'
    );
  });

  describe('when the same parameter appears more than once', function() {
    it('should replace all occurrences', function() {
      const url = getFullUrlByTarget(targets)({ sessionId: 'the_session', target: 'test/second', params: { id: 1 } });
      expect(url).to.eql(
        'bootstrap.php?session_id=the_session#/campaigns/1/campaigns/1'
      );
    });
  });

  it('throws exception when called with undefined target', function() {
    expect(function() {
      getFullUrlByTarget(targets)({ target: 'undefined' });
    }).to.throw('Error 404: Unknown pathname');
  });
});
