import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load("/textures/particles/2.png")

/**
 * PARTICLES
 */
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
// const particleMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true, // enables big/small particles based on distance
// })
// const particles = new THREE.Points(particlesGeometry, particleMaterial)
// scene.add(particles)

const customGeometry = new THREE.BufferGeometry()
const count = 5000
const spreadScale = 10
const vertices = new Float32Array(count * 3).map(
  () => (Math.random() - 0.5) * spreadScale
)
const rgbColors = new Float32Array(count * 3).map(() => Math.random())
customGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
customGeometry.setAttribute("color", new THREE.BufferAttribute(rgbColors, 3))
const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // enables big/small particles based on distance
  //   color: "skyblue",
  transparent: true,
  alphaMap: starTexture,
  //   alphaTest: 0.001,
  //   depthTest: false,
  depthWrite: false, // ✅
  //   blending: THREE.AdditiveBlending, // can cost perfomance
  vertexColors: true, // use when we apply custom color property to geometry
})
const particles = new THREE.Points(customGeometry, particleMaterial)
scene.add(particles)

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // animate particles
  particles.rotation.y = elapsedTime * 0.2

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
