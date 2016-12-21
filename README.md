Our temp component's config is config-file.json.

Every node we have to put in \_tree.
Every custom component we have to put in customComponents array.

Nodes's properties: {
  type: String //component dom element,
  props: Object //react props
  children: Array | Object | String //children of current node
}

Complexity of tree nesting is unlimited.

TODO:
  - implement custom components
