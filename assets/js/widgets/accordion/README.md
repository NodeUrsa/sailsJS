# Accordion Widget

## Usage

### Creation

To create the widget use this command:

```js
new AccordionWidget(options);
```

### Options

#### collection
Backbone.Collection instance with items for accordion.
Each item should have these required fields:

* ```name``` (String) - title of the item
* ```content``` (Object) - information about content of the item
* ```content.type``` (String) - type of the content, can be either ```text``` or ```view```
* ```content.data``` (String|Object) - data to be displayed as content of the item, can be either text (html) string or Backbone.View instance

#### style
Object that describes some style rules:

* ```marker``` (Boolean) - displayes a marker near each accordion item (wheter it is opened or not)
* ```place``` (String) - can be ```left```, ```right``` or empty (by default)
* ```closeany``` (Boolean) - if ```true``` - allows to collapse any item