# Material Design Paper Shadows
Preprocessor mixins for material design shadows in [Less](http://lesscss.org/), [Sass](http://sass-lang.com/) and [Stylus](http://learnboost.github.io/stylus/)

Shadows are based on Google's [Material Design document](http://www.google.com/design/spec/material-design/introduction.html).

Installation
--------------

```
bower install paper-shadows --save
```
 
Usage
--------------

Import the appropriate file into the preprocessor of your choice:

**Less:**

````Less
  @import "less/shadows";
````

**Sass:**

````Sass
  @import "sass/shadows";
````

**Stylus:**

````Sass
  @import "stylus/shadows"
````

Note - import path is relative to the current less file, your path may differ.

Once you've imported them, simply call the mixin like (LESS):
````Less
.your-class {
	.shadow-level(1);
}
````
with an appropriate level from 1 - 5.

Feedback
--------------
Have something to say? Find a bug? Please [open a new issue](https://github.com/406-digital/paper-shadows/issues) here on github.