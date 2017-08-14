# iframe-action-communicator ([demo](https://maplemap.github.io/iframe-action-communicator/example/parent.html))

[![NPM](https://nodei.co/npm/iframe-action-communicator.png)](https://nodei.co/npm/iframe-action-communicator/)

It's module for communicate parent with iframe and vice versa. So, it's very easy way to start events on the opposite side.
The only thing that will be necessary it's object or string with name of action and data (if you want)<br>

one side
---
```js
iac.send({
  action: 'somePowerfullAction',
  data: 'somedata'
});
```
or

```js
iac.send('somePowerfullAction'); // only for start action without data
```

opposite side
---
```js
iac.on('somePowerfullAction', (data) => {
  console.log(data);
});
```

That's all! It's so easy, isn't it? <br>
Below you will be able to see more details and surely look at an [Demo](https://maplemap.github.io/iframe-action-communicator/example/parent.html).
 <br>
 <br>


## Detailed Info

### Installation
npm:
```bash
$ npm install iframe-action-communicator
```
or
```html
<script src="path/to/iframe-action-communicator/dist/iframe-action-communicator.min.js"></script>
```


### Usage

### on parent
```javascript
const parent = new IframeActionCommunicator('iframe'); // set 'id' of iframe

// send message to iframe with name of action
parent.send({
  action: 'messageFromParent',
  data: 'Hello, I\'m Parent'
});

// describe on action 'messageFromIframe' from iframe
parent.on('messageFromIframe', function(data) {
  console.log('messageFromIframe:', data);
  // do something...
})
```

### on iframe
```javascript
const iframe = new IframeActionCommunicator();

// send message to parent with name of action
iframe.send({
  action: 'messageFromIframe',
  data: 'Hello, I\'m Iframe'
});

// describe on action 'messageFromParent' from parent
iframe.on('messageFromParent', function(data) {
  console.log('messageFromIframe:', data);
  // do something...
})
```

## License

MIT
