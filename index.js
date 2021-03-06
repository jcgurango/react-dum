import Reconciler from 'react-reconciler';

const reconciler = Reconciler({
  now: Date.now,
  getRootHostContext: function(nextRootInstance) {
    return { };
  },
  getChildHostContext: function(parentContext, fiberType, rootInstance) {
    return { };
  },
  shouldSetTextContent: function(type, nextProps) {
    return false;
  },
  createTextInstance: function(newText, rootContainerInstance, currentHostContext, workInProgress) {
    return {
      type: 'plaintext',
      props: {
        content: newText,
      },
      children: [],
      root: rootContainerInstance,
    };
  },
  createInstance: function(type, newProps, rootContainerInstance, currentHostContext, workInProgress) {
    return {
      type,
      props: newProps,
      children: [],
      root: rootContainerInstance,
    };
  },
  appendInitialChild: function(parent, child) {
    parent.children.push(child);
  },
  finalizeInitialChildren: function(instance, type, newProps, rootContainerInstance, currentHostContext) {
    return false;
  },
  prepareForCommit: function(rootContainerInstance) { },
  resetAfterCommit: function(rootContainerInstance) {
    rootContainerInstance.reportDom();
  },
  prepareUpdate: function (instance, type, oldProps, newProps, rootContainerInstance, currentHostContext) {
    instance.props = newProps;
    return;
  },
  commitUpdate: function(instance, updatePayload, type, oldProps, newProps, finishedWork) {
    return;
  },
  appendChildToContainer: function(rootContainerInstance, child) {
    rootContainerInstance.dom.push(child);
  },
  commitTextUpdate: function(textInstance, oldText, newText) {
    textInstance.props.content = newText;
  },
  appendChild: function(parentInstance, child) {
    parentInstance.children.push(child);
  },
  insertBefore: function(parentInstance, child, beforeChild) {
    parentInstance.children.splice(
      parentInstance.children.indexOf(beforeChild),
      0,
      child,
    );
  },
  removeChild: function(parentInstance, child) {
    parentInstance.children.splice(parentInstance.children.indexOf(child), 1);
  },
  insertInContainerBefore: function(container, child, beforeChild) {
    container.dom.splice(container.dom.indexOf(beforeChild), 0, 1);
  },
  removeChildFromContainer: function(container, child) {
    container.dom.splice(container.dom.indexOf(child), 1);
  },
  resetTextContent: function(child) { },
  shouldDeprioritizeSubtree(type, nextProps) {
    return Boolean(nextProps.hidden);
  },
  supportsMutation: true,
});

/**
 * Strips out the "root" key and "children" props from all elements.
 */
const stripDom = (dom) => {
  const stripElement = ({ root, ...element }) => {
    const { children, ...props } = element.props;

    return {
      ...element,
      props: {
        ...props,
      },
      children: element.children.map(stripElement),
    };
  };

  return dom.map(stripElement);
};

const ReactDum = {
  render(reactElement, context, callback) {
    let dom = [];

    const container = reconciler.createContainer({
      dom,
      reportDom: () => {
        context.onMarkupChange(stripDom(dom));
      },
    });

    reconciler.updateContainer(
      reactElement,
      container,
      null,
      callback
    );
  }
};

export default ReactDum;
