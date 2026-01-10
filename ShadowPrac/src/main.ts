import './style.css'
import { WebGLEngine } from "./core/Engine";
import { LightManager } from "./components/lights/LightManager";
import { ShapeManager } from "./components/objects/ShapeManager";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import * as THREE from 'three'
import { LabelManager } from "./components/objects/LabelManager";


const engine = new WebGLEngine()
const gui = new GUI()

engine.add(new THREE.GridHelper())

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
)

plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
engine.add(plane)

// Light
const lightManager = new LightManager(engine.scene, gui, {
  color: 0xffffff,
  shadowMapSize: 512
})

const shapeManager = new ShapeManager(engine.scene)
const labelManager = new LabelManager('.label')

lightManager.createDirectionalLight('Main Sun', new THREE.Vector3(1, 4, 2))

engine.addUpdateCallback((delta) => {
  labelManager.update(shapeManager.meshes, engine.camera)
})