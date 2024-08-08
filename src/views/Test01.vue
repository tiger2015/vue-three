<template>
  <div id="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from "three"
import { nextTick, onMounted, ref } from "vue"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const render = new THREE.WebGLRenderer({
  alpha: true,
})
const clock = new THREE.Clock()
const canvas = ref()
let earth = createSphere(5)
let moon = createSphere(1)
const radius = 5
const c = 0.551915024494 * radius
onMounted(() => {
  nextTick(() => {
    init()
    animate()
  })
  createHeartShape(5, 0, radius, c)
})

function init() {
  console.log(canvas.value.clientHeight)
  render.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight
  camera.fov = 50
  camera.near = 0.1
  camera.far = 1000
  camera.position.set(20, 20, 20)
  camera.lookAt(0, 0, 0)
  canvas.value.appendChild(render.domElement)
  new OrbitControls(camera, render.domElement)
  const axesHelper = new THREE.AxesHelper(40)
  scene.add(axesHelper)
  render.render(scene, camera)
  scene.add(earth)
  scene.add(moon)
  window.addEventListener("resize", () => {
    render.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
    camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight
    camera.updateProjectionMatrix()
  })
}

function animate() {
  render.render(scene, camera)
  camera.updateProjectionMatrix()
  let elaped = clock.getElapsedTime()
  moon.position.set(5 * Math.sin(elaped), 0, 5 * Math.cos(elaped))
  requestAnimationFrame(animate)
}

function createSphere(radius) {
  let meterial = new THREE.MeshBasicMaterial({
    color: 0x00bff,
    wireframe: true,
  })
  let ball = new THREE.SphereGeometry(radius, 32, 32)
  let mesh = new THREE.Mesh(ball, meterial)
  mesh.geometry.computeBoundingBox()
  return mesh
}

function createHeartShape(x, y, radius, c) {
  let shape = new THREE.Shape()
  shape
    .moveTo(x, y + radius / 3)
    .bezierCurveTo(x + c, y + radius, x + radius, y + c, x + radius, y)
    .bezierCurveTo(x + radius, y - c, x + c, y - radius / 2, x, y - radius)
    .bezierCurveTo(x - c, y - radius / 2, x - radius, y - c, x - radius, y)
    .bezierCurveTo(x - radius, y + c, x - c, y + radius, x, y + radius / 3)
  shape.autoClose = true
  const extrudeSettings = {
    depth: 1,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 1,
    bevelThickness: 1,
  }
  let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  let mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  mesh.position.x = x
  mesh.position.y = y
  scene.add(mesh)
}
</script>

<style scoped>
#canvas {
  width: calc(100vw - 20px);
  height: calc(100vh - 20px);
}
</style>
