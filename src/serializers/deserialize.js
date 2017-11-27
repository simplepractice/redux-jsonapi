import { camelize } from 'humps';

function deserializeRelationships(resources = [], store) {
  return resources.map((resource) => deserializeRelationship(resource, store));
}

function deserializeRelationship(resource = {}, store) {
  if (resource) {
    const resourceType = camelize(resource.type)
    if (store[resourceType] && store[resourceType][resource.id]) {
      return deserialize({ ...store[resourceType][resource.id], meta: { loaded: true } }, store);
    }
  }

  return deserialize({ ...resource, meta: { loaded: false } }, store);
}

function deserialize({ id, type, attributes, relationships, meta }, store) {
  let resource = { _type: type, _meta: meta };

  if (id) resource['id'] = id;

  if (attributes) {
    resource = Object.keys(attributes).reduce((resource, key) => {
      resource[camelize(key)] = attributes[key];
      return resource;
    }, resource);
  }

  if (relationships) {
    resource = Object.keys(relationships).reduce((resource, key) => {
      const relatedResource = relationships[key].data;
      resource[camelize(key)] = () => {
        if (Array.isArray(relatedResource)) {
          return deserializeRelationships(relatedResource, store);
        } else {
          return deserializeRelationship(relatedResource, store)
        }
      };
      return resource;
    }, resource);
  }

  return resource;
}

export default deserialize;
