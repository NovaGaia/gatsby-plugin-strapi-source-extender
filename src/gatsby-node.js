const { camelize, pascalize } = require('humps')
const _pluginOptions = {}

exports.onPreInit = (_, pluginOptions) => {
  console.log('Loaded gatsby-plugin-strapi-override')
  _pluginOptions.strapiTypes = pluginOptions.strapiTypes
  _pluginOptions.seekedTypes = []
  _pluginOptions.seekedTypesExt = []
  _pluginOptions.postfix = pluginOptions.postfix
  _pluginOptions.showLog = pluginOptions.showLog
  if (pluginOptions.postfix === undefined || pluginOptions.postfix === '') {
    _pluginOptions.postfix = 'Ext'
    console.log("postfix can't be unset, fallback to", _pluginOptions.postfix)
  }
  if (pluginOptions.showLog === undefined || pluginOptions.showLog === '') {
    _pluginOptions.showLog = false
  }
  for (const strapiTypes of pluginOptions.strapiTypes) {
    _pluginOptions.seekedTypes.push(strapiTypes.type)
    _pluginOptions.seekedTypesExt.push(
      `${strapiTypes.type}${_pluginOptions.postfix}`
    )
  }
  console.log('strapiTypes to manage', _pluginOptions.seekedTypes)
  console.log('use these types instead', _pluginOptions.seekedTypesExt)
}

async function onCreateNode({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) {
  if (
    node.internal.type !== null &&
    _pluginOptions.seekedTypes.indexOf(node.internal.type) > -1
  ) {
    let POST_NODE_TYPE = `${node.internal.type}${_pluginOptions.postfix}`
    if (_pluginOptions.showLog) {
      console.log('Processing', POST_NODE_TYPE)
      console.log('NodeId', `${POST_NODE_TYPE}-${node.id}`)
    }
    // unshuffle all mixed components properties.
    for (const _strapiType of _pluginOptions.strapiTypes) {
      if (_strapiType.type === node.internal.type && _strapiType.dynamicZones) {
        for (const _dz of _strapiType.dynamicZones) {
          if (node[_dz] && node[_dz].length > 0) {
            const dynamicZone = {}
            const dynamicZoneArray = []
            const dynamicZoneJSON = []
            let position = 0
            for (const component of node[_dz]) {
              if (component) {
                // console.log('>>>component', component)
                const name = camelize(
                  component.strapi_component.replace('.', '_')
                )
                // component['__typename'] = pascalize(name)
                component['_xtypename'] = pascalize(name)
                component['order'] = position
                dynamicZone[`${name}`] = component
                dynamicZoneJSON.push(component)
                dynamicZoneArray.push({ [name]: component })
                position++
              }
            }
            // node[_dz] = dynamicZone
            node[_dz] = dynamicZoneArray
            // Keep data as JSON for fallBack
            node[`${_dz}JSON`] = JSON.parse(
              JSON.stringify(Object.assign({}, dynamicZoneJSON))
            )
          }
        }
      }
    }

    createNode({
      ...node,
      id: createNodeId(`${POST_NODE_TYPE}-${node.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: JSON.stringify(node),
        contentDigest: createContentDigest(node),
      },
    })
  }
  return
}

exports.onCreateNode = onCreateNode

// exports.onCreateNode = async ({
//   node,
//   actions: { createNode },
//   createNodeId,
//   createContentDigest,
// }) => {

// }
