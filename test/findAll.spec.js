var Promise = require('bluebird');
describe('DSNedbAdapter#findAll', function() {
  it('should filter users', function() {
    var id;

    return adapter.findAll(User, {
      age: 30
    }).then(function(users) {
      assert.equal(users.length, 0);
      return adapter.create(User, {
        name: 'John'
      });
    }).then(function(user) {
      id = user.id;
      return adapter.findAll(User, {
        name: 'John'
      });
    }).then(function(users) {
      assert.equal(users.length, 1);
      assert.deepEqual(users[0], {
        id: id,
        _id: id,
        name: 'John'
      });
      return adapter.destroy(User, id);
    }).then(function(destroyedUser) {
      assert.isFalse(!!destroyedUser);
    });
  });
  it('should load relations', function() {
    return store.utils.Promise.all([
      adapter.create(User, {
        name: 'foo'
      }).then(function(user) {
        return store.utils.Promise.all([
          adapter.create(Post, {
            name: 'foo2',
            userId: user.id
          }).then(function(post) {
            return store.utils.Promise.all([
              adapter.create(Comment, {
                name: 'foo4',
                userId: user.id,
                postId: post.id
              }),
              adapter.create(Comment, {
                name: 'bar4',
                userId: user.id,
                postId: post.id
              })
            ])
          })
        ]);
      }),
      adapter.create(User, {
        name: 'bar'
      }).then(function(user) {
        return store.utils.Promise.all([
          adapter.create(Post, {
            name: 'foo3',
            userId: user.id
          }).then(function(post) {
            return store.utils.Promise.all([
              adapter.create(Comment, {
                name: 'foo5',
                userId: user.id,
                postId: post.id
              }),
              adapter.create(Comment, {
                name: 'bar5',
                userId: user.id,
                postId: post.id
              })
            ])
          })
        ]);
      })
    ]).then(function() {
      return adapter.findAll(Post, null, {
        with: ['user', 'comment']
      });
    }).then(function(posts) {
      assert.equal(posts.length, 2);
      assert.equal(posts[0].comments.length, 2);
      assert.equal(posts[1].comments.length, 2);
      assert.equal(posts[0].user.id, posts[0].userId);
      assert.equal(posts[1].user.id, posts[1].userId);
      return adapter.destroyAll(Post);
    });
  });
  it('should load belongsTo relations', function() {
    return adapter.create(Profile, {
        email: 'foo@test.com'
      }).then(function(profile) {
        return Promise.all([
          adapter.create(User, {
            name: 'John',
            profileId: profile.id
          }).then(function(user) {
            return adapter.create(Post, {
              content: 'foo',
              userId: user.id
            });
          }),
          adapter.create(User, {
            name: 'Sally'
          }).then(function(user) {
            return adapter.create(Post, {
              content: 'bar',
              userId: user.id
            });
          })
        ])
      })
      .spread(function(post1, post2) {
        return Promise.all([
          adapter.create(Comment, {
            content: 'test2',
            postId: post1.id,
            userId: post1.userId
          }),
          adapter.create(Comment, {
            content: 'test3',
            postId: post2.id,
            userId: post2.userId
          })
        ]);
      })
      .then(function() {
        return adapter.findAll(Comment, {}, {
          'with': ['user', 'user.profile', 'post', 'post.user']
        });
      })
      .then(function(comments) {
        assert.isDefined(comments[0].post);
        assert.isDefined(comments[0].post.user);
        assert.isDefined(comments[0].user);
        assert.isDefined(comments[0].user.profile || comments[1].user.profile);
        assert.isDefined(comments[1].post);
        assert.isDefined(comments[1].post.user);
        assert.isDefined(comments[1].user);
      });
  });
  it('should load hasMany and belongsTo relations', function() {
    return adapter.create(Profile, {
        email: 'foo@test.com'
      }).then(function(profile) {
        return Promise.all([
          adapter.create(User, {
            name: 'John',
            profileId: profile.id
          }).then(function(user) {
            return adapter.create(Post, {
              content: 'foo',
              userId: user.id
            });
          }),
          adapter.create(User, {
            name: 'Sally'
          }).then(function(user) {
            return adapter.create(Post, {
              content: 'bar',
              userId: user.id
            });
          })
        ]);
      })
      .spread(function(post1, post2) {
        return Promise.all([
          adapter.create(Comment, {
            content: 'test2',
            postId: post1.id,
            userId: post1.userId
          }),
          adapter.create(Comment, {
            content: 'test3',
            postId: post2.id,
            userId: post2.userId
          })
        ]);
      })
      .then(function() {
        return adapter.findAll(Post, {}, {
          'with': ['user', 'comment', 'comment.user', 'comment.user.profile']
        });
      })
      .then(function(posts) {
        assert.isDefined(posts[0].comments);
        assert.isDefined(posts[0].comments[0].user);
        assert.isDefined(posts[0].comments[0].user.profile || posts[1].comments[0].user.profile);
        assert.isDefined(posts[0].user);
        assert.isDefined(posts[1].comments);
        assert.isDefined(posts[1].comments[0].user);
        assert.isDefined(posts[1].user);
      });
  });
  it('should sort, skip, and limit', function () {
    return adapter.create(User, {
      age: 10,
        height: 65
    }).then(function () {
      return adapter.create(User, {
        age: 20,
        height: 64
      })
    }).then(function () {
      return adapter.create(User, {
        age: 30,
        height: 65
      })
    }).then(function () {
      return adapter.create(User, {
        age: 30,
        height: 61
      })
    }).then(function () {
      return adapter.create(User, {
        age: 30,
        height: 69
      })
    }).then(function () {
      return adapter.create(User, {
        age: 40,
        height: 99
      })
    }).then(function () {
      return adapter.create(User, {
        age: 50,
        height: 88
      })
    }).then(function () {
      return adapter.findAll(User, {
        orderBy: [
          ['age', 'asc'],
          ['height', 'desc']
        ],
        skip: 1,
        limit: 4
      })
    }).then(function (users) {
      assert.equalObjects(users.map(function (user) {
        return user.age;
      }), [20, 30, 30, 30])
      assert.equalObjects(users.map(function (user) {
        return user.height;
      }), [64, 69, 65, 61])
      
      return adapter.findAll(User, {
        age: 30,
        orderBy: 'height'
      })
    }).then(function (users) {
      assert.equalObjects(users.map(function (user) {
        return user.age;
      }), [30, 30, 30])
      assert.equalObjects(users.map(function (user) {
        return user.height;
      }), [61, 65, 69])
      
      return adapter.findAll(User, {
        orderBy: [['age', 'desc']],
        limit: 1,
        offset: 1
      })
    }).then(function (users) {
      assert.equalObjects(users.map(function (user) {
        return user.age;
      }), [40])
      assert.equalObjects(users.map(function (user) {
        return user.height;
      }), [99])
    });
  })
});
