const { camelize, pascalize } = require('humps')
const _pluginOptions = {}

exports.onPreInit = ({ reporter }, pluginOptions) => {
  reporter.info('Loaded gatsby-plugin-strapi-override')
  _pluginOptions.strapiTypes = pluginOptions.strapiTypes
  _pluginOptions.seekedTypes = []
  _pluginOptions.seekedTypesExt = []
  _pluginOptions.postfix = pluginOptions.postfix
  _pluginOptions.showLog = pluginOptions.showLog
  if (pluginOptions.postfix === undefined || pluginOptions.postfix === '') {
    _pluginOptions.postfix = 'Ext'
    reporter.warn(
      `postfix can't be unset, fallback to ${_pluginOptions.postfix}`
    )
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
  reporter.info(`strapiTypes to manage ${_pluginOptions.seekedTypes}`)
  reporter.info(`use these types instead ${_pluginOptions.seekedTypesExt}`)
}

async function onCreateNode({
  node,
  reporter,
  actions: { createNode },
  createNodeId,
  createContentDigest,
}) {
  if (node?.internal === undefined) {
    return
  }
  if (
    node.internal.type !== null &&
    _pluginOptions.seekedTypes.indexOf(node.internal.type) > -1
  ) {
    let POST_NODE_TYPE = `${node.internal.type}${_pluginOptions.postfix}`
    if (_pluginOptions.showLog) {
      reporter.info(`Processing ${POST_NODE_TYPE}`)
      reporter.info(`NodeId ${POST_NODE_TYPE}-${node.id}`)
    }
    // reporter.info(`>>>node.internal.type ${node.internal.type`})
    // reporter.info(`>>>POST_NODE_TYPE ${POST_NODE_TYPE}`)
    // working on a copy of object
    const _node = JSON.parse(JSON.stringify(node))
    // reporter.info(`>>>_node ${_node}`)

    // unshuffle all mixed components properties.
    // taking care only for selected types in _pluginOptions.strapiTypes
    for (const _strapiType of _pluginOptions.strapiTypes) {
      // taking care only if as dynamicZones
      if (_strapiType.type === node.internal.type && _strapiType.dynamicZones) {
        // taking car of the dynamic zone
        for (const _dz of _strapiType.dynamicZones) {
          if (_node[_dz] && _node[_dz].length > 0) {
            const dynamicZone = {}
            const dynamicZoneArray = []
            const dynamicZoneJSON = []
            let position = 0
            for (const component of _node[_dz]) {
              if (component) {
                const name = camelize(
                  component.strapi_component.replace('.', '_')
                )
                component['_xtypename'] = pascalize(name)
                component['order'] = position
                dynamicZone[`${name}`] = component
                dynamicZoneJSON.push(component)
                dynamicZoneArray.push({ [name]: component })
                position++
              }
            }
            _node[_dz] = dynamicZoneArray
            // Keep data as JSON for fallBack
            _node[`${_dz}JSON`] = JSON.parse(
              JSON.stringify(Object.assign({}, dynamicZoneJSON))
            )
          }
        }
      }
      // reporter.info(`${POST_NODE_TYPE} done!`)
      createNode({
        ..._node,
        id: createNodeId(`${POST_NODE_TYPE}-${node.id}`),
        parent: null,
        children: [],
        internal: {
          type: POST_NODE_TYPE,
          content: JSON.stringify(_node),
          contentDigest: createContentDigest(_node),
          description: `Extended version of ${node.internal.type}`,
        },
      })
    }
  }
  return
}

exports.onCreateNode = onCreateNode

exports.sourceNodes = async ({ getNodes, actions }) => {
  const { touchNode } = actions
  // Fetch existing strapi nodes
  const existingNodes = getNodes().filter(
    n => n.internal.owner === `gatsby-plugin-strapi-source-extender`
  )

  // Touch each one of them
  existingNodes.forEach(node => touchNode(node))
}
