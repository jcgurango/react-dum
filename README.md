# react-dum
This package does not serve as the entry point to the DOM or server renderers in React. It is intended to be paired with the generic React package, which is shipped as react to npm. This package will render your React applications to a generic component.

## Usage
```js
import React from 'react';
import ReactDum from 'react-dum';

class MyComponent extends React.Component {
  render() {
    return <div id="foo">Hello World</div>;
  }
}

ReactDum.render(<MyComponent />, {
  onMarkupChange: (tree) => {
    console.log(JSON.stringify(tree, null, '  '));
  },
});
```

This will print:

```json
[
  {
    "type": "div",
    "props": {
      "id": "foo"
    },
    "children": [
      {
        "type": "plaintext",
        "props": {
          "content": "Hello World"
        },
        "children": []
      }
    ]
  }
]
```

The `onMarkupChange` callback will be called whenever the tree changes, and you can access any props within the tree, allowing you to do something like this:

```js
import React, { useState } from 'react';
import ReactDum from 'react-dum';

const MyComponent = () => {
  const [changed, setChanged] = useState();

  if (changed) {
    return (
      <div>
        Hello React!
      </div>
    );
  }

  return (
    <div callback={() => setChanged(true)}>
      Hello World!
    </div>
  );
};

ReactDum.render(<MyComponent />, {
  onMarkupChange: (tree) => {
    console.log(JSON.stringify(tree, null, '  '));

    if (tree[0].props.callback) {
      tree[0].props.callback();
    }
  },
});
```

Which will print:

```json
[
  {
    "type": "div",
    "props": {},
    "children": [
      {
        "type": "plaintext",
        "props": {
          "content": "Hello World!"
        },
        "children": []
      }
    ]
  }
]
[
  {
    "type": "div",
    "props": {},
    "children": [
      {
        "type": "plaintext",
        "props": {
          "content": "Hello React!"
        },
        "children": []
      }
    ]
  }
]
```
