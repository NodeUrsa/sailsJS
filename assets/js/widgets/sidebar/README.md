# Sidebar Widget

## Usage

### Creation

To create the widget use this command:

```js
new SidebarWidget(options);
```

### Options

#### collection
Backbone.Collection instance with items for sidebar.
Each item should have these required fields:

* ```name``` (String) - title of the item
* ```link``` (Object) - information about link of the item
* ```link.type``` (String) - type of the link, can be either ```hash``` or ```url```
* ```link.ref``` (String) - reference of the link (note: without ```#```)

#### style
Object that describes some style rules:

* ```theme``` (String) - can be ```dark``` or ```light```

#### dropDown
object that set wish menu item need to bi open

example:    dropDown: {
                "1": true,
                "2": false,
                "4": true
            }