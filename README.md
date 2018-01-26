# Threejs ball line animation

![Demo GIF](/static/gif.gif)

Custom component with spheres connected to each other. Can be used for background animations.

- Component takes up all the space available from parent container.
- Canvas has a transparent background

[Demo](https://aquigorka.com/threejs-ball-line-animation/)


## Custom attributes

- numSpheres: number of spheres to draw (default: 100)
- diameter: sphere diameter (default: 40)
- maxConnectDistance: if distances between spheres is less than this value a ne will get drawn (defaul: 400)
- maxConnectLines: maximum number of nes from each sphere (default: 4)
- lineWidth: width of lines connecting spheres (default: 8)
- animateColor: whether or not the colors should change (default: false)
- animateX: animate over the x-axis (default: false)
- animateY: animate over the y-axis (default: false)
- moveX: speed at which animation over x-axis changes (default: 0.5)
- moveY: speed at which animation over y-axis changes (default: 0.5)
- sphereColor: initial color for spheres (default: #800080 - purple)
- lineColor: initial color for nes between spheres (default: #800080 - purple)


## Development

```sh
npm i
npm start
```

And open up a browser to http://localhost:3000


### Build

```sh
npm run build
```
