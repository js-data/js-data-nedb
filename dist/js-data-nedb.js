module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var map = __webpack_require__(1);
	var JSData = __webpack_require__(2);
	var unique = __webpack_require__(3);
	var Datastore = __webpack_require__(4);
	var DSUtils = JSData.DSUtils;

	var reserved = ['orderBy', 'sort', 'limit', 'offset', 'skip', 'where'];

	var DSNedbAdapter = (function () {
	  function DSNedbAdapter() {
	    _classCallCheck(this, DSNedbAdapter);
	  }

	  _createClass(DSNedbAdapter, [{
	    key: 'getQuery',
	    value: function getQuery(resourceConfig, params) {
	      params = params || {};
	      params.where = params.where || {};

	      DSUtils.forEach(DSUtils.keys(params), function (k) {
	        var v = params[k];
	        if (!DSUtils.contains(reserved, k)) {
	          if (DSUtils.isObject(v)) {
	            params.where[k] = v;
	          } else {
	            params.where[k] = {
	              '==': v
	            };
	          }
	          delete params[k];
	        }
	      });

	      var query = {};

	      if (!DSUtils.isEmpty(params.where)) {
	        DSUtils.forOwn(params.where, function (criteria, field) {
	          if (!DSUtils.isObject(criteria)) {
	            params.where[field] = {
	              '==': criteria
	            };
	          }
	          DSUtils.forOwn(criteria, function (v, op) {
	            if (op === '==' || op === '===') {
	              query[field] = v;
	            } else if (op === '!=' || op === '!==') {
	              query[field] = query[field] || {};
	              query[field].$ne = v;
	            } else if (op === '>') {
	              query[field] = query[field] || {};
	              query[field].$gt = v;
	            } else if (op === '>=') {
	              query[field] = query[field] || {};
	              query[field].$gte = v;
	            } else if (op === '<') {
	              query[field] = query[field] || {};
	              query[field].$lt = v;
	            } else if (op === '<=') {
	              query[field] = query[field] || {};
	              query[field].$lte = v;
	            } else if (op === 'in') {
	              query[field] = query[field] || {};
	              query[field].$in = v;
	            } else if (op === 'notIn') {
	              query[field] = query[field] || {};
	              query[field].$nin = v;
	            } else if (op === '|==' || op === '|===') {
	              query.$or = query.$or || [];
	              var orEqQuery = {};
	              orEqQuery[field] = v;
	              query.$or.push(orEqQuery);
	            } else if (op === '|!=' || op === '|!==') {
	              query.$or = query.$or || [];
	              var orNeQuery = {};
	              orNeQuery[field] = {
	                '$ne': v
	              };
	              query.$or.push(orNeQuery);
	            } else if (op === '|>') {
	              query.$or = query.$or || [];
	              var orGtQuery = {};
	              orGtQuery[field] = {
	                '$gt': v
	              };
	              query.$or.push(orGtQuery);
	            } else if (op === '|>=') {
	              query.$or = query.$or || [];
	              var orGteQuery = {};
	              orGteQuery[field] = {
	                '$gte': v
	              };
	              query.$or.push(orGteQuery);
	            } else if (op === '|<') {
	              query.$or = query.$or || [];
	              var orLtQuery = {};
	              orLtQuery[field] = {
	                '$lt': v
	              };
	              query.$or.push(orLtQuery);
	            } else if (op === '|<=') {
	              query.$or = query.$or || [];
	              var orLteQuery = {};
	              orLteQuery[field] = {
	                '$lte': v
	              };
	              query.$or.push(orLteQuery);
	            } else if (op === '|in') {
	              query.$or = query.$or || [];
	              var orInQuery = {};
	              orInQuery[field] = {
	                '$in': v
	              };
	              query.$or.push(orInQuery);
	            } else if (op === '|notIn') {
	              query.$or = query.$or || [];
	              var orNinQuery = {};
	              orNinQuery[field] = {
	                '$nin': v
	              };
	              query.$or.push(orNinQuery);
	            }
	          });
	        });
	      }

	      return query;
	    }
	  }, {
	    key: 'getQueryOptions',
	    value: function getQueryOptions(resourceConfig, params, query) {
	      params = params || {};
	      params.orderBy = params.orderBy || params.sort;
	      params.skip = params.skip || params.offset;

	      if (params.orderBy) {
	        var i;

	        (function () {
	          if (DSUtils.isString(params.orderBy)) {
	            params.orderBy = [[params.orderBy, 'asc']];
	          }
	          for (i = 0; i < params.orderBy.length; i++) {
	            if (DSUtils.isString(params.orderBy[i])) {
	              params.orderBy[i] = [params.orderBy[i], 'asc'];
	            }
	          }
	          var orderByOptions = {};
	          DSUtils.forEach(params.orderBy, function (order) {
	            orderByOptions[order[0]] = order[1].toUpperCase() === 'ASC' ? 1 : -1;
	          });
	          query = query.sort(orderByOptions);
	        })();
	      }

	      if (params.skip) {
	        query = query.skip(params.skip);
	      }

	      if (params.limit) {
	        query = query.limit(params.limit);
	      }

	      return query;
	    }
	  }, {
	    key: 'getDb',
	    value: function getDb(resourceConfig) {
	      if (resourceConfig.db) {
	        return resourceConfig.db;
	      } else {
	        resourceConfig.db = new Datastore({
	          filename: resourceConfig.filepath || './' + resourceConfig.name + '.db',
	          autoload: true,
	          error: function error(err) {
	            console.error(err);
	          }
	        });
	        return resourceConfig.db;
	      }
	    }
	  }, {
	    key: 'FINDONE',
	    value: function FINDONE(resourceConfig, query) {
	      var _this = this;

	      return new DSUtils.Promise(function (resolve, reject) {
	        _this.getDb(resourceConfig).findOne(query, function (err, doc) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(doc);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'FIND',
	    value: function FIND(resourceConfig, params) {
	      var _this2 = this;

	      params = params || {};
	      return new DSUtils.Promise(function (resolve, reject) {
	        var query = _this2.getDb(resourceConfig).find(_this2.getQuery(resourceConfig, params));
	        query = _this2.getQueryOptions(resourceConfig, params, query);
	        query.exec(function (err, doc) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(doc);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'INSERT',
	    value: function INSERT(resourceConfig, attrs) {
	      var _this3 = this;

	      return new DSUtils.Promise(function (resolve, reject) {
	        _this3.getDb(resourceConfig).insert(attrs, function (err, doc) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve(doc);
	          }
	        });
	      });
	    }
	  }, {
	    key: 'UPDATE',
	    value: function UPDATE(resourceConfig, query, attrs, options) {
	      var _this4 = this;

	      options = options || {};
	      return new DSUtils.Promise(function (resolve, reject) {
	        _this4.getDb(resourceConfig).update(query, attrs, options, function (err) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve();
	          }
	        });
	      });
	    }
	  }, {
	    key: 'REMOVE',
	    value: function REMOVE(resourceConfig, query, options) {
	      var _this5 = this;

	      options = options || {};
	      return new DSUtils.Promise(function (resolve, reject) {
	        _this5.getDb(resourceConfig).remove(query, options, function (err) {
	          if (err) {
	            reject(err);
	          } else {
	            resolve();
	          }
	        });
	      });
	    }
	  }, {
	    key: 'origify',
	    value: function origify(options) {
	      options = options || {};
	      if (typeof options.orig === 'function') {
	        return options.orig();
	      }
	      return options;
	    }
	  }, {
	    key: 'find',
	    value: function find(resourceConfig, id, options) {
	      var _this6 = this;

	      var instance = undefined;
	      options = this.origify(options);
	      options['with'] = options['with'] || [];
	      return this.FINDONE(resourceConfig, _defineProperty({}, resourceConfig.idAttribute || '_id', id)).then(function (_instance) {
	        if (!_instance) {
	          throw new Error('Not Found!');
	        }
	        instance = _instance;
	        var tasks = [];

	        DSUtils.forEach(resourceConfig.relationList, function (def) {
	          var relationName = def.relation;
	          var relationDef = resourceConfig.getResource(relationName);
	          var containedName = null;
	          if (DSUtils.contains(options['with'], relationName)) {
	            containedName = relationName;
	          } else if (DSUtils.contains(options['with'], def.localField)) {
	            containedName = def.localField;
	          }
	          if (containedName) {
	            (function () {
	              var __options = DSUtils.deepMixIn({}, options.orig ? options.orig() : options);
	              __options['with'] = options['with'].slice();
	              __options = DSUtils._(relationDef, __options);
	              DSUtils.remove(__options['with'], containedName);
	              DSUtils.forEach(__options['with'], function (relation, i) {
	                if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
	                  __options['with'][i] = relation.substr(containedName.length + 1);
	                } else {
	                  __options['with'][i] = '';
	                }
	              });

	              var task = undefined;

	              if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
	                task = _this6.findAll(resourceConfig.getResource(relationName), {
	                  where: _defineProperty({}, def.foreignKey, {
	                    '==': instance[resourceConfig.idAttribute]
	                  })
	                }, __options).then(function (relatedItems) {
	                  if (def.type === 'hasOne' && relatedItems.length) {
	                    DSUtils.set(instance, def.localField, relatedItems[0]);
	                  } else {
	                    DSUtils.set(instance, def.localField, relatedItems);
	                  }
	                  return relatedItems;
	                });
	              } else if (def.type === 'hasMany' && def.localKeys) {
	                var localKeys = [];
	                var itemKeys = instance[def.localKeys] || [];
	                itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys);
	                localKeys = localKeys.concat(itemKeys || []);
	                task = _this6.findAll(resourceConfig.getResource(relationName), {
	                  where: _defineProperty({}, relationDef.idAttribute, {
	                    'in': DSUtils.filter(unique(localKeys), function (x) {
	                      return x;
	                    })
	                  })
	                }, __options).then(function (relatedItems) {
	                  DSUtils.set(instance, def.localField, relatedItems);
	                  return relatedItems;
	                });
	              } else if (def.type === 'belongsTo' || def.type === 'hasOne' && def.localKey) {
	                task = _this6.find(resourceConfig.getResource(relationName), DSUtils.get(instance, def.localKey), __options).then(function (relatedItem) {
	                  DSUtils.set(instance, def.localField, relatedItem);
	                  return relatedItem;
	                });
	              }

	              if (task) {
	                tasks.push(task);
	              }
	            })();
	          }
	        });

	        return DSUtils.Promise.all(tasks);
	      }).then(function () {
	        return instance;
	      });
	    }
	  }, {
	    key: 'findAll',
	    value: function findAll(resourceConfig, params, options) {
	      var _this7 = this;

	      var items = null;
	      options = this.origify(options ? DSUtils.copy(options) : {});
	      options['with'] = options['with'] || [];
	      return this.FIND(resourceConfig, params).then(function (_items) {
	        items = _items;
	        var tasks = [];
	        DSUtils.forEach(resourceConfig.relationList, function (def) {
	          var relationName = def.relation;
	          var relationDef = resourceConfig.getResource(relationName);
	          var containedName = null;
	          if (DSUtils.contains(options['with'], relationName)) {
	            containedName = relationName;
	          } else if (DSUtils.contains(options['with'], def.localField)) {
	            containedName = def.localField;
	          }
	          if (containedName) {
	            (function () {
	              var __options = DSUtils.deepMixIn({}, options.orig ? options.orig() : options);
	              __options['with'] = options['with'].slice();
	              __options = DSUtils._(relationDef, __options);
	              DSUtils.remove(__options['with'], containedName);
	              DSUtils.forEach(__options['with'], function (relation, i) {
	                if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
	                  __options['with'][i] = relation.substr(containedName.length + 1);
	                } else {
	                  __options['with'][i] = '';
	                }
	              });

	              var task = undefined;

	              if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
	                task = _this7.findAll(resourceConfig.getResource(relationName), {
	                  where: _defineProperty({}, def.foreignKey, {
	                    'in': DSUtils.filter(map(items, function (item) {
	                      return DSUtils.get(item, resourceConfig.idAttribute);
	                    }), function (x) {
	                      return x;
	                    })
	                  })
	                }, __options).then(function (relatedItems) {
	                  DSUtils.forEach(items, function (item) {
	                    var attached = [];
	                    DSUtils.forEach(relatedItems, function (relatedItem) {
	                      if (DSUtils.get(relatedItem, def.foreignKey) === item[resourceConfig.idAttribute]) {
	                        attached.push(relatedItem);
	                      }
	                    });
	                    if (def.type === 'hasOne' && attached.length) {
	                      DSUtils.set(item, def.localField, attached[0]);
	                    } else {
	                      DSUtils.set(item, def.localField, attached);
	                    }
	                  });
	                  return relatedItems;
	                });
	              } else if (def.type === 'hasMany' && def.localKeys) {
	                (function () {
	                  var localKeys = [];
	                  DSUtils.forEach(items, function (item) {
	                    var itemKeys = item[def.localKeys] || [];
	                    itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys);
	                    localKeys = localKeys.concat(itemKeys || []);
	                  });
	                  task = _this7.findAll(resourceConfig.getResource(relationName), {
	                    where: _defineProperty({}, relationDef.idAttribute, {
	                      'in': DSUtils.filter(unique(localKeys), function (x) {
	                        return x;
	                      })
	                    })
	                  }, __options).then(function (relatedItems) {
	                    DSUtils.forEach(items, function (item) {
	                      var attached = [];
	                      var itemKeys = item[def.localKeys] || [];
	                      itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys);
	                      DSUtils.forEach(relatedItems, function (relatedItem) {
	                        if (itemKeys && DSUtils.contains(itemKeys, relatedItem[relationDef.idAttribute])) {
	                          attached.push(relatedItem);
	                        }
	                      });
	                      DSUtils.set(item, def.localField, attached);
	                    });
	                    return relatedItems;
	                  });
	                })();
	              } else if (def.type === 'belongsTo' || def.type === 'hasOne' && def.localKey) {
	                task = _this7.findAll(resourceConfig.getResource(relationName), {
	                  where: _defineProperty({}, relationDef.idAttribute, {
	                    'in': DSUtils.filter(map(items, function (item) {
	                      return DSUtils.get(item, def.localKey);
	                    }), function (x) {
	                      return x;
	                    })
	                  })
	                }, __options).then(function (relatedItems) {
	                  DSUtils.forEach(items, function (item) {
	                    DSUtils.forEach(relatedItems, function (relatedItem) {
	                      if (relatedItem[relationDef.idAttribute] === item[def.localKey]) {
	                        DSUtils.set(item, def.localField, relatedItem);
	                      }
	                    });
	                  });
	                  return relatedItems;
	                });
	              }

	              if (task) {
	                tasks.push(task);
	              }
	            })();
	          }
	        });
	        return DSUtils.Promise.all(tasks);
	      }).then(function () {
	        return items;
	      });
	    }
	  }, {
	    key: 'create',
	    value: function create(resourceConfig, attrs) {
	      var _this8 = this;

	      if (resourceConfig && resourceConfig.idAttribute in attrs) {
	        attrs._id = attrs[resourceConfig.idAttribute];
	      }
	      attrs = DSUtils.removeCircular(DSUtils.omit(attrs, resourceConfig.relationFields || []));
	      return this.INSERT(resourceConfig, attrs).then(function (doc) {
	        if (!(resourceConfig.idAttribute in doc)) {
	          doc[resourceConfig.idAttribute] = doc._id;
	          return _this8.UPDATE(resourceConfig, { _id: doc._id }, {
	            $set: _defineProperty({}, resourceConfig.idAttribute, doc._id)
	          }).then(function () {
	            return doc;
	          })['catch'](function (err) {
	            return _this8.REMOVE(resourceConfig, { _id: doc._id }).then(function () {
	              return DSUtils.Promise.reject(err);
	            });
	          });
	        } else {
	          return doc;
	        }
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update(resourceConfig, id, attrs) {
	      var _this9 = this;

	      attrs = DSUtils.removeCircular(DSUtils.omit(attrs, resourceConfig.relationFields || []));
	      delete attrs[resourceConfig.idAttribute];
	      delete attrs._id;
	      return this.UPDATE(resourceConfig, {
	        _id: id
	      }, { $set: attrs }).then(function () {
	        return _this9.find(resourceConfig, id);
	      });
	    }
	  }, {
	    key: 'updateAll',
	    value: function updateAll(resourceConfig, attrs, params) {
	      var _this10 = this;

	      var ids = [];
	      attrs = DSUtils.removeCircular(DSUtils.omit(attrs, resourceConfig.relationFields || []));
	      var query = this.getQuery(resourceConfig, params);
	      return this.findAll(resourceConfig, params).then(function (items) {
	        ids = unique(map(items, function (item) {
	          return item[resourceConfig.idAttribute];
	        }));
	        return _this10.UPDATE(resourceConfig, query, { $set: attrs }, { multi: true });
	      }).then(function () {
	        return _this10.findAll(resourceConfig, {
	          where: _defineProperty({}, resourceConfig.idAttribute, {
	            'in': ids
	          })
	        });
	      });
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy(resourceConfig, id) {
	      return this.REMOVE(resourceConfig, {
	        _id: id
	      });
	    }
	  }, {
	    key: 'destroyAll',
	    value: function destroyAll(resourceConfig, params) {
	      var query = this.getQuery(resourceConfig, params);
	      return this.REMOVE(resourceConfig, query, { multi: true });
	    }
	  }]);

	  return DSNedbAdapter;
	})();

	exports['default'] = DSNedbAdapter;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("mout/array/map");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("js-data");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("mout/array/unique");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("nedb");

/***/ }
/******/ ]);