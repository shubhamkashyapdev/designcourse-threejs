import "./style.css"
import * as THREE from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"

// Loading
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(1, 1.3)

for (let i = 1; i <= 4; i++) {
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/photographs/${i}.jpg`),
  })
  const image = new THREE.Mesh(geometry, material)
  image.position.set(i % 2 != 0 ? 1 : 0.7, i * -1.8)
  scene.add(image)
}

let objArr = []
scene.traverse((object) => {
  if (object.isMesh) {
    objArr.push(object)
  }
})

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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

gui.add(camera.position, "y").min(-5).max(10).step(0.1)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const raycaster = new THREE.Raycaster()

window.addEventListener("wheel", onMouseWheel)
let y = 0
let position = 1.75

function onMouseWheel(event) {
  y = event.deltaY * 0.0007
}

// mouse for raycaster
const mouse = new THREE.Vector2()
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1 // to get a negative value
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  position += y
  y *= 0.9 // decrease the y value gradually
  // raycaster - hover animation
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(objArr)
  for (const intersect of intersects) {
    gsap.to(intersect.object.scale, { x: 1.75, y: 1.75 })
    gsap.to(intersect.object.rotation, { y: -0.5 })
    gsap.to(intersect.object.position, { z: -0.9 })
  }
  for (const object of objArr) {
    if (!intersects.find((intersect) => intersect.object === object)) {
      gsap.to(object.scale, { x: 1, y: 1 })
      gsap.to(object.rotation, { y: 0 })
      gsap.to(object.position, { z: 0 })
    }
  }
  camera.position.y = -position
  // sphere.rotation.y = 0.5 * elapsedTime
  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
