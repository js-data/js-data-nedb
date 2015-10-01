let map = require('mout/array/map')
let JSData = require('js-data')
let unique = require('mout/array/unique')
let Datastore = require('nedb')
let { DSUtils } = JSData

let reserved = [
  'orderBy',
  'sort',
  'limit',
  'offset',
  'skip',
  'where'
]

class DSNedbAdapter {
  constructor () {
  }

  getQuery (resourceConfig, params) {
    params = params || {}
    params.where = params.where || {}

    DSUtils.forEach(DSUtils.keys(params), k => {
      let v = params[k]
      if (!DSUtils.contains(reserved, k)) {
        if (DSUtils.isObject(v)) {
          params.where[k] = v
        } else {
          params.where[k] = {
            '==': v
          }
        }
        delete params[k]
      }
    })

    let query = {}

    if (!DSUtils.isEmpty(params.where)) {
      DSUtils.forOwn(params.where, (criteria, field) => {
        if (!DSUtils.isObject(criteria)) {
          params.where[field] = {
            '==': criteria
          }
        }
        DSUtils.forOwn(criteria, (v, op) => {
          if (op === '==' || op === '===') {
            query[field] = v
          } else if (op === '!=' || op === '!==') {
            query[field] = query[field] || {}
            query[field].$ne = v
          } else if (op === '>') {
            query[field] = query[field] || {}
            query[field].$gt = v
          } else if (op === '>=') {
            query[field] = query[field] || {}
            query[field].$gte = v
          } else if (op === '<') {
            query[field] = query[field] || {}
            query[field].$lt = v
          } else if (op === '<=') {
            query[field] = query[field] || {}
            query[field].$lte = v
          } else if (op === 'in') {
            query[field] = query[field] || {}
            query[field].$in = v
          } else if (op === 'notIn') {
            query[field] = query[field] || {}
            query[field].$nin = v
          } else if (op === '|==' || op === '|===') {
            query.$or = query.$or || []
            let orEqQuery = {}
            orEqQuery[field] = v
            query.$or.push(orEqQuery)
          } else if (op === '|!=' || op === '|!==') {
            query.$or = query.$or || []
            let orNeQuery = {}
            orNeQuery[field] = {
              '$ne': v
            }
            query.$or.push(orNeQuery)
          } else if (op === '|>') {
            query.$or = query.$or || []
            let orGtQuery = {}
            orGtQuery[field] = {
              '$gt': v
            }
            query.$or.push(orGtQuery)
          } else if (op === '|>=') {
            query.$or = query.$or || []
            let orGteQuery = {}
            orGteQuery[field] = {
              '$gte': v
            }
            query.$or.push(orGteQuery)
          } else if (op === '|<') {
            query.$or = query.$or || []
            let orLtQuery = {}
            orLtQuery[field] = {
              '$lt': v
            }
            query.$or.push(orLtQuery)
          } else if (op === '|<=') {
            query.$or = query.$or || []
            let orLteQuery = {}
            orLteQuery[field] = {
              '$lte': v
            }
            query.$or.push(orLteQuery)
          } else if (op === '|in') {
            query.$or = query.$or || []
            let orInQuery = {}
            orInQuery[field] = {
              '$in': v
            }
            query.$or.push(orInQuery)
          } else if (op === '|notIn') {
            query.$or = query.$or || []
            let orNinQuery = {}
            orNinQuery[field] = {
              '$nin': v
            }
            query.$or.push(orNinQuery)
          }
        })
      })
    }

    return query
  }

  getQueryOptions (resourceConfig, params, query) {
    params = params || {}
    params.orderBy = params.orderBy || params.sort
    params.skip = params.skip || params.offset

    if (params.orderBy) {
      if (DSUtils.isString(params.orderBy)) {
        params.orderBy = [
          [params.orderBy, 'asc']
        ]
      }
      for (var i = 0; i < params.orderBy.length; i++) {
        if (DSUtils.isString(params.orderBy[i])) {
          params.orderBy[i] = [params.orderBy[i], 'asc']
        }
      }
      let orderByOptions = {}
      DSUtils.forEach(params.orderBy, function (order) {
        orderByOptions[order[0]] = order[1].toUpperCase() === 'ASC' ? 1 : -1
      })
      query = query.sort(orderByOptions)
    }

    if (params.skip) {
      query = query.skip(params.skip)
    }

    if (params.limit) {
      query = query.limit(params.limit)
    }

    return query
  }

  getDb (resourceConfig) {
    if (resourceConfig.db) {
      return resourceConfig.db
    } else {
      resourceConfig.db = new Datastore({
        filename: resourceConfig.filepath || ('./' + resourceConfig.name + '.db'),
        autoload: true,
        error: function (err) {
          console.error(err)
        }
      })
      return resourceConfig.db
    }
  }

  FINDONE (resourceConfig, query) {
    return new DSUtils.Promise((resolve, reject) => {
      this.getDb(resourceConfig).findOne(query, function (err, doc) {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
    })
  }

  FIND (resourceConfig, params) {
    params = params || {}
    return new DSUtils.Promise((resolve, reject) => {
      let query = this.getDb(resourceConfig).find(this.getQuery(resourceConfig, params))
      query = this.getQueryOptions(resourceConfig, params, query)
      query.exec(function (err, doc) {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
    })
  }

  INSERT (resourceConfig, attrs) {
    return new DSUtils.Promise((resolve, reject) => {
      this.getDb(resourceConfig).insert(attrs, function (err, doc) {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
    })
  }

  UPDATE (resourceConfig, query, attrs, options) {
    options = options || {}
    return new DSUtils.Promise((resolve, reject) => {
      this.getDb(resourceConfig).update(query, attrs, options, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  REMOVE (resourceConfig, query, options) {
    options = options || {}
    return new DSUtils.Promise((resolve, reject) => {
      this.getDb(resourceConfig).remove(query, options, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  origify (options) {
    options = options || {}
    if (typeof options.orig === 'function') {
      return options.orig()
    }
    return options
  }

  find (resourceConfig, id, options) {
    let instance
    options = this.origify(options)
    options.with = options.with || []
    return this.FINDONE(resourceConfig, {
      [resourceConfig.idAttribute || '_id']: id
    }).then(_instance => {
      if (!_instance) {
        throw new Error('Not Found!')
      }
      instance = _instance
      let tasks = []

      DSUtils.forEach(resourceConfig.relationList, def => {
        let relationName = def.relation
        let relationDef = resourceConfig.getResource(relationName)
        let containedName = null
        if (DSUtils.contains(options.with, relationName)) {
          containedName = relationName
        } else if (DSUtils.contains(options.with, def.localField)) {
          containedName = def.localField
        }
        if (containedName) {
          let __options = DSUtils.deepMixIn({}, options.orig ? options.orig() : options)
          __options.with = options.with.slice()
          __options = DSUtils._(relationDef, __options)
          DSUtils.remove(__options.with, containedName)
          DSUtils.forEach(__options.with, (relation, i) => {
            if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
              __options.with[i] = relation.substr(containedName.length + 1)
            } else {
              __options.with[i] = ''
            }
          })

          let task

          if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [def.foreignKey]: {
                  '==': instance[resourceConfig.idAttribute]
                }
              }
            }, __options).then(relatedItems => {
              if (def.type === 'hasOne' && relatedItems.length) {
                DSUtils.set(instance, def.localField, relatedItems[0])
              } else {
                DSUtils.set(instance, def.localField, relatedItems)
              }
              return relatedItems
            })
          } else if (def.type === 'hasMany' && def.localKeys) {
            let localKeys = []
            let itemKeys = instance[def.localKeys] || []
            itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys)
            localKeys = localKeys.concat(itemKeys || [])
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [relationDef.idAttribute]: {
                  'in': DSUtils.filter(unique(localKeys), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.set(instance, def.localField, relatedItems)
              return relatedItems
            })
          } else if (def.type === 'belongsTo' || (def.type === 'hasOne' && def.localKey)) {
            task = this.find(resourceConfig.getResource(relationName), DSUtils.get(instance, def.localKey), __options).then(relatedItem => {
              DSUtils.set(instance, def.localField, relatedItem)
              return relatedItem
            })
          }

          if (task) {
            tasks.push(task)
          }
        }
      })

      return DSUtils.Promise.all(tasks)
    }).then(() => instance)
  }

  findAll (resourceConfig, params, options) {
    let items = null
    options = this.origify(options ? DSUtils.copy(options) : {})
    options.with = options.with || []
    return this.FIND(resourceConfig, params).then(_items => {
      items = _items
      let tasks = []
      DSUtils.forEach(resourceConfig.relationList, def => {
        let relationName = def.relation
        let relationDef = resourceConfig.getResource(relationName)
        let containedName = null
        if (DSUtils.contains(options.with, relationName)) {
          containedName = relationName
        } else if (DSUtils.contains(options.with, def.localField)) {
          containedName = def.localField
        }
        if (containedName) {
          let __options = DSUtils.deepMixIn({}, options.orig ? options.orig() : options)
          __options.with = options.with.slice()
          __options = DSUtils._(relationDef, __options)
          DSUtils.remove(__options.with, containedName)
          DSUtils.forEach(__options.with, (relation, i) => {
            if (relation && relation.indexOf(containedName) === 0 && relation.length >= containedName.length && relation[containedName.length] === '.') {
              __options.with[i] = relation.substr(containedName.length + 1)
            } else {
              __options.with[i] = ''
            }
          })

          let task

          if ((def.type === 'hasOne' || def.type === 'hasMany') && def.foreignKey) {
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [def.foreignKey]: {
                  'in': DSUtils.filter(map(items, item => DSUtils.get(item, resourceConfig.idAttribute)), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.forEach(items, item => {
                let attached = []
                DSUtils.forEach(relatedItems, relatedItem => {
                  if (DSUtils.get(relatedItem, def.foreignKey) === item[resourceConfig.idAttribute]) {
                    attached.push(relatedItem)
                  }
                })
                if (def.type === 'hasOne' && attached.length) {
                  DSUtils.set(item, def.localField, attached[0])
                } else {
                  DSUtils.set(item, def.localField, attached)
                }
              })
              return relatedItems
            })
          } else if (def.type === 'hasMany' && def.localKeys) {
            let localKeys = []
            DSUtils.forEach(items, item => {
              let itemKeys = item[def.localKeys] || []
              itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys)
              localKeys = localKeys.concat(itemKeys || [])
            })
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [relationDef.idAttribute]: {
                  'in': DSUtils.filter(unique(localKeys), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.forEach(items, item => {
                let attached = []
                let itemKeys = item[def.localKeys] || []
                itemKeys = Array.isArray(itemKeys) ? itemKeys : DSUtils.keys(itemKeys)
                DSUtils.forEach(relatedItems, relatedItem => {
                  if (itemKeys && DSUtils.contains(itemKeys, relatedItem[relationDef.idAttribute])) {
                    attached.push(relatedItem)
                  }
                })
                DSUtils.set(item, def.localField, attached)
              })
              return relatedItems
            })
          } else if (def.type === 'belongsTo' || (def.type === 'hasOne' && def.localKey)) {
            task = this.findAll(resourceConfig.getResource(relationName), {
              where: {
                [relationDef.idAttribute]: {
                  'in': DSUtils.filter(map(items, item => DSUtils.get(item, def.localKey)), x => x)
                }
              }
            }, __options).then(relatedItems => {
              DSUtils.forEach(items, item => {
                DSUtils.forEach(relatedItems, relatedItem => {
                  if (relatedItem[relationDef.idAttribute] === item[def.localKey]) {
                    DSUtils.set(item, def.localField, relatedItem)
                  }
                })
              })
              return relatedItems
            })
          }

          if (task) {
            tasks.push(task)
          }
        }
      })
      return DSUtils.Promise.all(tasks)
    }).then(() => items)
  }

  create (resourceConfig, attrs) {
    if (resourceConfig && resourceConfig.idAttribute in attrs) {
      attrs._id = attrs[resourceConfig.idAttribute]
    }
    attrs = DSUtils.removeCircular(DSUtils.omit(attrs, resourceConfig.relationFields || []))
    return this.INSERT(resourceConfig, attrs).then(doc => {
      if (!(resourceConfig.idAttribute in doc)) {
        doc[resourceConfig.idAttribute] = doc._id
        return this.UPDATE(resourceConfig, { _id: doc._id }, {
          $set: {
            [resourceConfig.idAttribute]: doc._id
          }
        }).then(function () {
          return doc
        }).catch(err => {
          return this.REMOVE(resourceConfig, { _id: doc._id }).then(function () {
            return DSUtils.Promise.reject(err)
          })
        })
      } else {
        return doc
      }
    })
  }

  update (resourceConfig, id, attrs) {
    attrs = DSUtils.removeCircular(DSUtils.omit(attrs, resourceConfig.relationFields || []))
    delete attrs[resourceConfig.idAttribute]
    delete attrs._id
    return this.UPDATE(resourceConfig, {
      _id: id
    }, { $set: attrs }).then(() => this.find(resourceConfig, id))
  }

  updateAll (resourceConfig, attrs, params) {
    let ids = []
    attrs = DSUtils.removeCircular(DSUtils.omit(attrs, resourceConfig.relationFields || []))
    let query = this.getQuery(resourceConfig, params)
    return this.findAll(resourceConfig, params).then(items => {
      ids = unique(map(items, item => item[resourceConfig.idAttribute]))
      return this.UPDATE(resourceConfig, query, { $set: attrs }, { multi: true })
    }).then(() => this.findAll(resourceConfig, {
      where: {
        [resourceConfig.idAttribute]: {
          'in': ids
        }
      }
    }))
  }

  destroy (resourceConfig, id) {
    return this.REMOVE(resourceConfig, {
      _id: id
    })
  }

  destroyAll (resourceConfig, params) {
    let query = this.getQuery(resourceConfig, params)
    return this.REMOVE(resourceConfig, query, { multi: true })
  }
}

export default DSNedbAdapter
