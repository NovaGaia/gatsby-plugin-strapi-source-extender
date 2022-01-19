# gatsby-plugin-strapi-source-extender

A plugin to extend Strapi Source plugin.

- You can have Dynamic Zone usable, not a JSON object ;
- Images in Dynamic Zone can be used with gatsby-image.

> Tested with:
>
> - `"gatsby-source-strapi": "^1.0.1"`
> - `"strapi": "3.6.8"`
> - `"gatsby": "^4.4.0"`

## Installlation

```bash
npm i gatsby-plugin-strapi-source-extender
or
yarn install gatsby-plugin-strapi-source-extender
```

## Configuration

```javascript
// ./gatsby-config.js
module.exports = {
    {
        resolve: 'gatsby-plugin-strapi-extended',
        options: {
        postfix: 'Ext',
        strapiTypes: [
            { type: 'StrapiPage', dynamicZones: ['contentSections'] },
            { type: 'StrapiGlobal' },
        ],
        },
    },
}
```

### Explanations

| Property                 | Usage                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------ |
| postfix                  | The postfix of name of the new type, default : `Ext`. Eg. `<StrapiSouceType>Postfix` |
| strapiTypes              | All the Strapi types to manage.                                                      |
| strapiTypes.type         | Name of the Strapi type to manage.                                                   |
| strapiTypes.dynamicZones | All the Dynamic Zones (root only) to manage.                                         |

## Usage

### GraphQL exemple.

`contentSections` is a Dynamic zone

For each elements in the Dynamic zone, you **must** request two properties :

- `__typename` to assign a behavior to the component ;
- `order` to keep the order of components as they are in Strapi admin.

```graphql
query DynamicPageQuery($id: String!, $locale: String!) {
    ...
    strapiPage: strapiPageExt(id: { eq: $id }) {
      ...
      contentSections {
        sectionsHeroImage {
          __typename
          order
      ...
```

### Gatsby exemple.

The Dynamic Zone content with this plugin is not a JSON, it's an Object, but not an Array. Instead of, you'll have null components repeated.

Because is an object, you can't iterate into, so add this :

```javascript
// sections is an object, our Dynamic zone
// dzSanitized is an Array, our Dynamic zone sorted

const dzSanitized = [];
Object.keys(sections).forEach((key) => dzSanitized.push(sections[key]));

// Order array like in Strapi Admin
dzSanitized.sort(function (a, b) {
  return a.order - b.order;
});
```

Or you can use the helper :

```javascript
{
  StrapiExtentedUtils.objectToArray(sections).map((section, i) => {
    return (
      <Section
        sectionData={section}
        key={`${section.__typename}${(section.id, i)}`}
      />
    );
  });
}
```
