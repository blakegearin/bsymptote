// Credit: https://codepen.io/trajektorijus/pen/mdeBYrX

import alea from 'alea';
import { createNoise3D } from 'simplex-noise';
import chroma from 'chroma-js';

import './Background.css';

export default function Background() {
  class Utils {
    static randomRange(min, max) {
      return Math.random() * (max - min) + min
    }

    static mapRange (value, inputMin, inputMax, outputMin, outputMax, clamp) {
      if (Math.abs(inputMin - inputMax) < Number.EPSILON) {
        return outputMin;
      } else {
        var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
        if (clamp) {
          if (outputMax < outputMin) {
            if (outVal < outputMax) outVal = outputMax;
            else if (outVal > outputMin) outVal = outputMin;
          } else {
            if (outVal > outputMax) outVal = outputMax;
            else if (outVal < outputMin) outVal = outputMin;
          }
        }
        return outVal;
      }
    }
  }

  Utils.noise3D = createNoise3D(alea('seed'));

  var config = {
    bgColor: chroma({ h: 230, s: 0.5, l: 0.92}).hex(),
    // https://www.colourlovers.com/palette/577622/One_Sixty-Eight
    colorSchema: [
      '#666',
      '#777',
      '#999',
      '#bbb',
      '#ccc',
    ],
    numOfLayers: 9
  }

  var wHypot, wCenterX, wCenterY, angle, wWidth, wHeight, layers;

  var canvas = document.getElementById('backgroundCanvas');
  var ctx = canvas.getContext('2d');

  var shadowCanvas = document.createElement('canvas');
  var shadowCtx = shadowCanvas.getContext('2d');

  var timestamp = 0
  var fpsHistory = []

  setUpVars()
  setUpListeners()
  update()

  function setUpVars() {
    wWidth = window.innerWidth
    shadowCanvas.width = wWidth
    canvas.width = shadowCanvas.width

    wHeight = window.innerHeight
    shadowCanvas.height = wHeight
    canvas.height = shadowCanvas.height

    wCenterX = wWidth / 2
    wCenterY = wHeight / 2
    wHypot = Math.hypot(wWidth, wHeight)

    angle = Math.PI * 0.25
    layers = getLayers()
  }

  function getLayers() {
    const layers = []
    let currColorId = 0

    for (let lid = 0; lid <= config.numOfLayers; lid++) {
      // const colorAngle = Math.PI * 2 * (lid / config.numOfLayers)

      layers.push({
        id: lid, // used for noise offset
        progress: 1 - (lid / config.numOfLayers),
        color: config.colorSchema[currColorId]
      })

      currColorId++

      if (currColorId >= config.colorSchema.length) {
        currColorId = 0
      }
    }

    return layers
  }

  function setUpListeners() {
    window.addEventListener('resize', setUpVars.bind(this))
  }

  function drawLayer(ctx, layer) {
    const segmentBaseSize = 10
    const segmentCount = Math.round(wHypot / segmentBaseSize)
    const segmentSize = wHypot / segmentCount
    const waveAmplitude = segmentSize * 4
    const noiseZoom = 0.03

    ctx.save()
    ctx.translate(wCenterX, wCenterY)
    ctx.rotate(Math.sin(angle))

    ctx.beginPath()
    ctx.moveTo(-wHypot / 2, wHypot / 2 - (wHypot * layer.progress))
    ctx.lineTo(-wHypot / 2, wHypot / 2)
    ctx.lineTo(wHypot / 2, wHypot / 2)
    ctx.lineTo(wHypot / 2, wHypot / 2 - (wHypot * layer.progress))

    for (let sid = 1; sid <= segmentCount; sid++) {
      const n = Utils.noise3D(sid * noiseZoom, sid * noiseZoom, layer.id + timestamp)
      const heightOffset = n * waveAmplitude

      ctx.lineTo((wHypot / 2) - (sid * segmentSize), wHypot / 2 - (wHypot * layer.progress) + heightOffset)
    }

    ctx.closePath()
    ctx.fillStyle = layer.color
    ctx.fill()
    ctx.restore()
  }

  function draw(ctx) {
    ctx.save()
    ctx.fillStyle = config.bgColor
    ctx.fillRect(0, 0, wWidth, wHeight)
    ctx.restore()

    layers.forEach(layer => drawLayer(ctx, layer))
  }

  function update(t) {
    const prevTimestamp = timestamp * 5000

    if (t) {
      let shiftNeeded = false
      timestamp = t / 5000
      angle += 0.001

      layers.forEach(layer => {
        layer.progress += 0.001

        if (layer.progress > 1 + (1 / (layers.length - 1))) {
          layer.progress = 0
          shiftNeeded = true
        }
      })

      if (shiftNeeded) {
        layers.push(layers.shift())
      }

      draw(shadowCtx)
    }

    ctx.clearRect(0, 0, wWidth, wHeight)
    ctx.drawImage(shadowCanvas, 0, 0)

    const fps = Math.round(1 / (t - prevTimestamp) * 1000)
    fpsHistory.unshift(fps)
    fpsHistory.length = 5

    // Show fps
    // ctx.font = '16px sans-serif'
    // ctx.fillText(fpsHistory.reduce((a,b) => a+b) / 5, 50, 50)

    window.requestAnimationFrame(update.bind(this))
  }
}
