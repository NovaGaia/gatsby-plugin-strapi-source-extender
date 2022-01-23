const { pascalize, camelize } = require('humps')
const _pluginOptions = {}

exports.onPreInit = (_, pluginOptions) => {
  console.log('Loaded gatsby-plugin-strapi-override')
  _pluginOptions.strapiTypes = pluginOptions.strapiTypes
  _pluginOptions.seekedTypes = []
  _pluginOptions.postfix = pluginOptions.postfix || 'Ext'
  if (pluginOptions.postfix === undefined || pluginOptions.postfix === '') {
    console.log("postfix can't be unset, fallback to", _pluginOptions.postfix)
  }
  for (const strapiTypes of pluginOptions.strapiTypes) {
    _pluginOptions.seekedTypes.push(strapiTypes.type)
  }
  console.log('strapiTypes to manage', _pluginOptions.seekedTypes)
}
exports.onCreateNode = async ({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) => {
  if (
    node.internal.type !== null &&
    _pluginOptions.seekedTypes.indexOf(node.internal.type) > -1
  ) {
    let POST_NODE_TYPE = `${node.internal.type}${_pluginOptions.postfix}`
    console.log('Processing', POST_NODE_TYPE)
    // unshuffle all mixed components properties.
    for (const _strapiType of _pluginOptions.strapiTypes) {
      if (_strapiType.type === node.internal.type && _strapiType.dynamicZones) {
        for (const _dz of _strapiType.dynamicZones) {
          if (node[_dz] && node[_dz].length > 0) {
            const dynamicZone = {}
            const dynamicZoneJSON = []
            let position = 0
            for (const component of node[_dz]) {
              if (component) {
                const name = camelize(
                  component.strapi_component.replace('.', '_')
                )
                // component['__typename'] = pascalize(name)
                component['order'] = position
                dynamicZone[name] = component
                dynamicZoneJSON.push(component)
                position++
              }
            }
            node[_dz] = dynamicZone
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
