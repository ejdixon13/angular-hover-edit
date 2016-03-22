
Apply inline edit capability to element. On hover over the element, the pencil lights up, and a gray box shows up. On click, input elements become editable.

## Requirements

- AngularJS
- Spin.js
- angular-spinner
- Underscore.js

## Usage


You can get it from [Bower](http://bower.io/)

```sh
bower install angular-hover-edit
```

Load the script files in your application:

```html
<link rel="stylesheet" href="bower_components/angular-hover-edit/dist/angular-hover-edit.css">

<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/spin.js/spin.js"></script>
<script src="bower_components/angular-spinner/angular-spinner.js"></script>
<script src="bower_components/angular-hover-edit/dist/angular-hover-edit-dx.min.js"></script>
```
include the GideonldsIcn-Regular.otf in a /fonts folder on the base directory

Add the specific module to your dependencies:

```javascript
angular.module('myApp', ['angularSpinner', 'angularHoverEdit', ...])
```

Now surround any element you want to have inline editing

```html
<hover-edit>
    <div>
        <input type="text"></input>
    </div>
</hover-edit>
```

Pass in save functions or cancel functions
```html
<hover-edit save-fn="saveFn" cancel-fn="cancelfn">
    <div>
        <input type="text"></input>
    </div>
</hover-edit>
```

If you would like to have links within the hover-edit element, so that clicking on the link will not activate edit mode, use the included hover-edit-link directive
```html
<hover-edit>
    <hover-edit-link link="/examplePath"></hover-edit-link>
</hover-edit>
```

Attributes available:
* `save-fn` - Pass in a function that will be called upon click of the save button.
* `add-fn` - Pass in a function that will be called upon click of the add button. (Add button only shows up if add-fn is present with a valid function)
* `unit-to-save` - This is a parameter that can be passed to your save function.
* `edit-mode` - External two-way bound trigger for edit mode.
* `form-name` - If you pass in a form, the save will not be performed if the form is invalid.
* `read-only` - External two-way bound trigger to determine if edit mode is possible