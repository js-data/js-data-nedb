/*global assert:true */
'use strict';

var fs = require('fs');
var assert = require('chai').assert;
assert.equalObjects = function (a, b, m) {
  assert.deepEqual(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), m || 'Objects should be equal!');
};
function pprint (msg, obj) {
  if (typeof msg === 'string') {
    console.log(msg, JSON.stringify(obj, null, 2));
  } else {
    console.log(JSON.stringify(obj, null, 2));
  }
}
var mocha = require('mocha');
var sinon = require('sinon');
var Datastore = require('nedb');
var DSNedbAdapter = require('./');
var JSData = require('js-data');
JSData.DSUtils.Promise = require('bluebird');

var adapter, store, DSUtils, DSErrors, Profile, User, Post, Comment;

var globals = module.exports = {
  fail: function (msg) {
    assert.equal('should not reach this!: ' + msg, 'failure');
  },
  TYPES_EXCEPT_STRING: [123, 123.123, null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_ARRAY: [123, 123.123, null, undefined, {}, true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_NUMBER: [null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_OBJECT: [123, 123.123, null, undefined, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_NUMBER_OBJECT: [null, undefined, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER: [null, undefined, {}, true, false, function () {
  }],
  TYPES_EXCEPT_NUMBER: ['string', null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_OBJECT: ['string', 123, 123.123, null, undefined, true, false, function () {
  }],
  TYPES_EXCEPT_BOOLEAN: ['string', 123, 123.123, null, undefined, {}, [], function () {
  }],
  TYPES_EXCEPT_FUNCTION: ['string', 123, 123.123, null, undefined, {}, [], true, false],
  assert: assert,
  sinon: sinon,
  adapter: undefined,
  store: undefined,
  pprint: pprint
};

var test = new mocha();

var testGlobals = [];

for (var key in globals) {
  global[key] = globals[key];
  testGlobals.push(globals[key]);
}
test.globals(testGlobals);

beforeEach(function () {
  store = new JSData.DS({
    log: false
  });
  try {
    fs.unlinkSync('./profile.db');  
  } catch (e) {}
  try {
    fs.unlinkSync('./user.db');  
  } catch (e) {}
  try {
    fs.unlinkSync('./post.db');  
  } catch (e) {}
  try {
    fs.unlinkSync('./comment.db');  
  } catch (e) {}
  
  adapter = new DSNedbAdapter();
  DSUtils = JSData.DSUtils;
  DSErrors = JSData.DSErrors;
  globals.Profile = global.Profile = Profile = store.defineResource({
    name: 'profile'
  });
  globals.User = global.User = User = store.defineResource({
    name: 'user',
    relations: {
      hasMany: {
        post: {
          localField: 'posts',
          foreignKey: 'post'
        }
      },
      hasOne: {
        profile: {
          localField: 'profile',
          localKey: 'profileId'
        }
      }
    }
  });
  globals.Post = global.Post = Post = store.defineResource({
    name: 'post',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'userId'
        }
      },
      hasMany: {
        comment: {
          localField: 'comments',
          foreignKey: 'postId'
        }
      }
    }
  });
  globals.Comment = global.Comment = Comment = store.defineResource({
    name: 'comment',
    relations: {
      belongsTo: {
        post: {
          localField: 'post',
          localKey: 'postId'
        },
        user: {
          localField: 'user',
          localKey: 'userId'
        }
      }
    }
  });

  globals.store = store;
  global.store = globals.store;

  globals.adapter = adapter;
  global.adapter = globals.adapter;

  globals.DSUtils = DSUtils;
  global.DSUtils = globals.DSUtils;

  globals.DSErrors = DSErrors;
  global.DSErrors = globals.DSErrors;
});

afterEach(function () {
  globals.adapter = null;
  global.adapter = null;
});
