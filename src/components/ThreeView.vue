<template>
  <div class="main" ref="canvasRef"></div>
</template>

<script setup>
import * as THREE from "three"
import { onMounted, ref } from "vue"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BufferAttribute, MeshBasicMaterial } from "three"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min"
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer"

import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer"

const canvasRef = ref()
// 场景
const scene = new THREE.Scene()
// 透视相机
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// 渲染器
const render = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
})
render.setSize(window.innerWidth, window.innerHeight)
render.render(scene, camera)

const axesHelper = new THREE.AxesHelper(20)
scene.add(axesHelper)

const orbitControls = new OrbitControls(camera, render.domElement)
orbitControls.enableDamping = true
orbitControls.dampingFactor = 0.5
orbitControls.autoRotate = false

const gridHelper = new THREE.GridHelper(20, 10)
scene.add(gridHelper)

// 创建立方体
const box = new THREE.BoxGeometry(5, 5, 5)
// 漫反射材料
const meterial = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: false,
})
const mesh = new THREE.Mesh(box, meterial)
scene.add(mesh)

// 面
const geometry = new THREE.BufferGeometry()
const vector = new Float32Array([0, 6, 1, 6, 6, 1, 6, 0, 1])
const attribute = new THREE.BufferAttribute(vector, 3)
geometry.setAttribute("position", attribute)
const triangleMaterial = new THREE.PointsMaterial({
  color: 0x00ff66,
  size: 2,
  side: THREE.DoubleSide,
})
const triangle = new THREE.Mesh(geometry, triangleMaterial)
scene.add(triangle)

// 线
const lineGeometry = new THREE.BufferGeometry()
const lineVector = new Float32Array([0, 2, 2, 2, 2, 3, 4, 2, 3])
const lineAttr = new THREE.BufferAttribute(lineVector, 3)
lineGeometry.attributes.position = lineAttr
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xff6600,
  linewidth: 1,
  linecap: "round",
  linejoin: "round",
})

const line = new THREE.Line(lineGeometry, lineMaterial)
scene.add(line)

// 点
const pointGeometry = new THREE.BufferGeometry()
const pointVector = new Float32Array([5, 4, 3, 3, 2, 1])
const pointAttr = new BufferAttribute(pointVector, 3)
pointGeometry.attributes.position = pointAttr
const pointMaterial = new THREE.PointsMaterial({
  color: 0xff00ff,
  size: 0.1,
})
const point = new THREE.Points(pointGeometry, pointMaterial)
scene.add(point)

// 纹理贴图
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("/test.jpg")
// 贴图阵列
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(5, 5)

const textureMaterail = new MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
  transparent: true,
})
const box1 = new THREE.BoxGeometry(4, 4, 4)
const mesh1 = new THREE.Mesh(box1, textureMaterail)
scene.add(mesh1)

// 点光源

const pointLight = new THREE.PointLight(0xffffff, 1.0)
pointLight.position.set(0, 10, 10)
scene.add(pointLight)
// 点光源辅助
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)
camera.position.set(20, 20, 20)
camera.lookAt(0, 0, 0)

// GUI调试
const gui = new GUI()
gui.add(mesh.position, "x", -10, 10).name("x轴平移")
gui.add(mesh.position, "y", -10, 10).name("y轴平移")
gui.add(mesh.position, "z", -10, 10).name("z轴平移")

let colorFolder = gui.addFolder("设置颜色")
colorFolder
  .addColor({ cssColor: "#ff00ff" }, "cssColor")
  .name("颜色")
  .onChange((val) => {
    mesh.material.color.set(val)
  })

// 场景雾化效果
scene.fog = new THREE.Fog(0x000000, 1, 100)

const labelRender = createCSS2DRender(window.innerWidth, window.innerHeight)

const label3DRender = createCSS3DRender(window.innerWidth, window.innerHeight)

let label = tag3D("admin")
label.position.set(10, 10, 8)
scene.add(label)

// 监听窗口缩放事件
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateMatrix()
  render.setSize(window.innerWidth, window.innerHeight)
  label3DRender.setSize(window.innerWidth, window.innerHeight)
})

onMounted(() => {
  canvasRef.value.appendChild(render.domElement)
  //canvasRef.value.appendChild(labelRender.domElement)
  canvasRef.value.appendChild(label3DRender.domElement)
  animiate()
})

const animiate = () => {
  render.render(scene, camera)
  //labelRender.render(scene, camera)
  label3DRender.render(scene, camera)
  orbitControls.update()
  requestAnimationFrame(animiate)
}

// 创建二维渲染器
function createCSS2DRender(width, height) {
  let render = new CSS2DRenderer()
  render.setSize(width, height)
  render.domElement.style.position = "absolute"
  render.domElement.style.top = "0px"
  render.domElement.style.pointerEvents = "none"
  return render
}

// 3D渲染器
function createCSS3DRender(width, height) {
  let render = new CSS3DRenderer()
  render.setSize(width, height)
  render.domElement.style.position = "absolute"
  render.domElement.style.top = "0px"
  render.domElement.style.pointerEvents = "none"
  return render
}

// 标签
function tag(name) {
  let div = document.createElement("div")
  div.textContent = name
  div.className = "tag"
  let label = new CSS2DObject(div)
  return label
}

function tag3D(name) {
  let div = document.createElement("div")
  div.textContent = name
  div.className = "tag"
  div.style.display = "none"
  let label = new CSS3DObject(div)
  label.scale.set(0.1, 0.1, 2)
  return label
}
</script>

<style scoped>
.main {
  margin: 0;
  padding: 0;
}
</style>
<style>
.tag {
  background: blue;
  color: red;
}
</style>