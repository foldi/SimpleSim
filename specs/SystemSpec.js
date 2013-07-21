'use strict';

describe("System", function() {

  var system;

  beforeEach(function() {
    system = System;
  });

  it("should have its required properties.", function() {
    expect(system.name).toEqual('System');
  });

});