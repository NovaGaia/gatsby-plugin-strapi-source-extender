import PropTypes from 'prop-types'

/**
 * Methode who create Array and sort it by order.
 * @param {*} dz Object corresponding to the Dynamic Zone
 * @returns Array of data, ordered by `order`
 */
StrapiExtentedUtils.objectToArray = dz => {
  const dzSanitized = []
  Object.keys(dz).forEach(key => dzSanitized.push(dz[key]))
  dzSanitized.sort(function (a, b) {
    return a.order - b.order
  })
  return dzSanitized
}

function StrapiExtentedUtils() {
  throw 'Do not use directly, use helper methods.'
}

StrapiExtentedUtils.objectToArray.propTypes = {
  dz: PropTypes.object.isRequired,
  dz: PropTypes.shape({
    order: PropTypes.number.isRequired,
    __typename: PropTypes.string.isRequired,
  }),
}

export default StrapiExtentedUtils
