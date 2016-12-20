import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import _ from 'lodash';

let mainComponents = {};

const modifyComponentName = (obj) => {
  const newObj = Object.assign({}, obj);

  function walker(obj) {
    let k;
    const has = Object.prototype.hasOwnProperty.bind(obj);
    for (k in obj) if (has(k)) {
      switch (typeof obj[k]) {
        case 'object':
          walker(obj[k]);
          break;
        case 'string':
          if (k === 'type'){
            if (obj[k].match(/^[A-Z]/)) {
              obj[k] = mainComponents[obj[k]];
            }
          }
      }
    }
  }

  walker(newObj);

  return newObj;
}

const createElementRecursive = (json) => {
  function findOwnChildren(component) {
    debugger;
    if (!component) { return null; }

    if (_.isArray(component)) {
      return component.map((item, index) => {
        const props = item.props ?  Object.assign( {key: index}, item.props) : {key: index};

        return React.createElement(item.type, props, findOwnChildren(item.children))
      })
    }

    if (component.type) {
      if (_.isPlainObject(component)) {
        // if (component.type.match(/^[A-Z]/)) {
        //   debugger;
        //   // const customComponent = mainComponents[item.type];
        //   // return React.createElement(item.type, props, findOwnChildren(item.children))
        // }
        return React.createElement(component.type, component.props, findOwnChildren(component.children))
      }
    } else {
      return component;
    }
  }

  return findOwnChildren(json);
}

const componentDeclaration = (customComponents) => {
  customComponents.forEach((item) => {
    window[item.name.toLowerCase()] = createElementRecursive(item);
  });
}

$.getJSON('/config-file')
  .done((json) => {
    const { components } = json;
    // componentDeclaration(components.customComponents);
    // mainComponents = modifyComponentName(json.components.customComponents);

    // debugger;
    const parsedComponents = createElementRecursive(components._tree);
    // const tree = parsedComponents.components._tree;
    ReactDOM.render(parsedComponents, document.getElementById('root'));
    // ReactDOM.render({type: 'div', props: {children: React.createElement('div', null, 'Ok')}}, document.getElementById('root'));

  });
