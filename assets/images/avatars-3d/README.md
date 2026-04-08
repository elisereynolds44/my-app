# 3D Avatar Drop Zone

This folder is reserved for the rendered avatar pack that will replace the current SVG placeholders.

Use transparent-background `PNG` or `WebP` files at roughly `512x512` or larger, exported one file per animal using these exact filenames:

- `bear.png`
- `bee.png`
- `bunny.png`
- `cat.png`
- `dog.png`
- `fish.png`
- `fox.png`
- `frog.png`
- `giraffe.png`
- `koala.png`
- `octopus.png`
- `panda.png`
- `snail.png`
- `tiger.png`
- `turtle.png`
- `unicorn.png`

Recommended style:

- soft 3D/kawaii toy render
- rounded proportions
- glossy highlights
- subtle bottom shadow
- transparent background
- centered composition with consistent padding

When the pack is ready, update [character-options.ts](/Users/elisereynolds/my-app/lib/character-options.ts) to point each `imageSource` at this folder instead of `assets/images/avatars`.
