
Apply inline edit capability to element. On hover over the element, the pencil lights up, and a gray box shows up. On click, input elements become editable.

## Requirements

- AngularJS

## Usage


You can get it from [Bower](http://bower.io/)

```sh
bower install angular-hover-edit
```

Load the script files in your application:

```html
 <link rel="stylesheet" href="bower_components/angular-hover-edit/src/hover-edit.css">

<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-hover-edit/src/angular-hover-edit-dx.min.js"></script>
```
include the GideonldsIcn-Regular.otf in a /fonts folder on the base directory

Add the specific module to your dependencies:

```javascript
angular.module('myApp', ['angularHoverEdit', ...])
```

Now surround any element you want to have inline editing

```
<hover-edit>
    <div>
        <input type="text"></input>
    </div>
</hover-edit>
```

Pass in save functions or cancel functions
```
<hover-edit save-fn="saveFn" cancel-fn="cancelfn">
    <div>
        <input type="text"></input>
    </div>
</hover-edit>
```