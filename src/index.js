import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import _ from 'lodash';

let mainComponents = {};

const createElementRecursive = (json) => {
  const createElementProxy = (component, index) => {
    let props = component.props;

    if (index !== undefined) {
      props = component.props ?  Object.assign( {key: index}, component.props) : {key: index};
    }

    if (component.type.match(/^[A-Z]/)) {
      if (component.children) {
        return React.cloneElement(mainComponents[component.type], props, findOwnChildren(component.children));
      }

      return React.cloneElement(mainComponents[component.type], props);
    }

    return React.createElement(component.type, props, findOwnChildren(component.children))
  }

  function findOwnChildren(component) {
    if (!component) { return null; }

    if (_.isArray(component)) {
      return component.map((item, index) => createElementProxy(item, index))
    }

    if (component.type) {
      if (_.isPlainObject(component)) {
        return createElementProxy(component);
      }
    } else {
      return component;
    }
  }

  return findOwnChildren(json);
}

const componentDeclaration = (customComponents) => {
  customComponents.forEach((item) => {
    mainComponents[item.name] = React.createElement(item.type, item.props, createElementRecursive(item.children));
  });
}

$.getJSON('/config-file')
  .done((json) => {
    const { components } = json;

    componentDeclaration(components.customComponents);

    ReactDOM.render(createElementRecursive(components._tree), document.getElementById('root'));
  });
