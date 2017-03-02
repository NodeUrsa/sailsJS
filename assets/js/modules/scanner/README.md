# Scanner Module

Allows to do manual input as well as input using handheld scanner.

## Usage

### Turn on

To start the module use this command:

```js
app.commands.execute('scanner:on');
```

It will create a hidden input and keep focus in it as long as module will be working.

### Turn off

To stop the module use this command:

```js
app.commands.execute('scanner:off');
```

### Receiving data

Each scanned item (text) will be sent using ```app.vent```.

```js
app.vent.on('scanner:data', callback, context);
```

Here is an example of callback function:

```js
function callback (data) {
    var data     = dataString.split(' '),
        item     = data[0],
        quantity = data[1];
    console.log('scanned item: ' + item, 'quantity: ' + quantity);
}
```