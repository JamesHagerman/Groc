# Groc Your Grocery List

When food items are being yelled out of the kitchen, you just want to capture them...

When you can't remember what you purchased in the past...

When you can't think of anything good to eat...

When you're mad at hiking back and forth through the grocery store...

You could probably use `Groc`

## The Purpose

Groc lets you make a grocery list *sorted by where things are in your local store*.

Huck all your items into the list, sort it by where things are in the store following your favorite path through the isles, and check the the stuff you need.

It'll remember everything you've put in (asuming you'r using the same device as last time) and the order of items in the list.

*Note: Reloading the page currently loses your checkboxes. It's a known bug.*

## Building Groc

Right now, all of the relavant bits are in `app/`. It's just a React app built on top of `create-react-app`. I use `yarn` but `npm` should work.

Running this build will compile the front end code to `docs/` so it can be hosted on GitHub Pages.

```
yarn run build
```

Some day, maybe it'll get some more features that depend on a backend and that's what's kicking around in `api/` right now.