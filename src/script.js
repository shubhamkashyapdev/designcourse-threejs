import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"

// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load("/textures/normal.png")

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64)

// Materials

// const material = new THREE.MeshBasicMaterial()
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLightRed = new THREE.PointLight(0xff0000, 2)
pointLightRed.position.set(-1.85, 1, -1.65)
pointLightRed.intensity = 10
scene.add(pointLightRed)

const pointLightBlue = new THREE.PointLight(0x0000ff, 2)
pointLightBlue.position.set(2.15, -3, -2)
pointLightBlue.intensity = 10
scene.add(pointLightBlue)
// Dat GUI & Helper
// const LightRed = gui.addFolder("Light Red")
// DatGUIPointligt(pointLightRed, LightRed, 0xff0000)
// PointLightHelper(pointLightRed, 0xff0000)
// const LightBlue = gui.addFolder("Light Blue")
// DatGUIPointligt(pointLightBlue, LightBlue, 0x0000ff)
// PointLightHelper(pointLightBlue, 0x0000ff)

// Point Light Helper
function DatGUIPointligt(pointLight, folder, color) {
  folder.add(pointLight.position, "y").min(-3).max(3).step(0.01)
  folder.add(pointLight.position, "x").min(-6).max(6).step(0.01)
  folder.add(pointLight.position, "z").min(-6).max(6).step(0.01)
  folder.add(pointLight, "intensity").min(0).max(10).step(0.1)
  folder.addColor(pointLight, "color")
}

function PointLightHelper(pointLight, color) {
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
  pointLightHelper.color = color
  scene.add(pointLightHelper)
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener("mousemove", onDocMouseMove)
let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2

function onDocMouseMove(event) {
  mouseX = event.clientX - windowHalfX
  mouseY = event.clientY - windowHalfY
}

window.addEventListener("scroll", updateSphere)
function updateSphere(event) {
  sphere.position.y = window.scrollY / 1000
}

const clock = new THREE.Clock()

const tick = () => {
  targetX = mouseX / 1000
  targetY = mouseY / 1000
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime
  sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y)
  sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x)
  sphere.position.z -= 0.05 * (targetY - sphere.rotation.x)
  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
