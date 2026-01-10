import './style.css'
import { WebGLEngine } from "./core/Engine";
import { LightManager } from "./components/lights/LightManager";
import { ShapeManager } from "./components/objects/ShapeManager";
import { LabelManager } from "./components/objects/LabelManager";
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import * as THREE from 'three'

const engine = new WebGLEngine()
const gui = new GUI()

// #region Renderer GUI
const rendererFolder = gui.addFolder('Global Renderer')
const shadowMapTypes = {
  'Basic': THREE.BasicShadowMap,
  'PCF (Default)': THREE.PCFShadowMap,
  'PCF Soft': THREE.PCFSoftShadowMap,
  'VSM': THREE.VSMShadowMap
}

rendererFolder.add(engine.renderer.shadowMap, 'type', shadowMapTypes)
  .name('Shadow Type')
  .onChange(() => {
    engine.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.needsUpdate = true
      }
    })
  })

rendererFolder.add(engine.renderer.shadowMap, 'enabled').name('Shadow Enabled')
rendererFolder.open()
// #endregion

engine.add(new THREE.GridHelper())

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
engine.add(plane)

const lightManager = new LightManager(engine.scene, gui, {
  color: 0xffffff,
  shadowMapSize: 512
})

const lights = {
  Directional: lightManager.createDirectionalLight('Directional Light', new THREE.Vector3(1, 4, 2)),
  Point: lightManager.createPointLight('Point Light', new THREE.Vector3(0, 2, 0)),
  Spot: lightManager.createSpotLight('Spot Light', new THREE.Vector3(3, 4, 1))
}

const state = { activeLight: 'Directional' }

function updateLights() {
  Object.keys(lights).forEach((key) => {
    const isSelected = key == state.activeLight
    const { light, helper, folder } = (lights as any)[key] 
    light.visible = isSelected
    helper.visible = false
    if (isSelected) folder.show()
    else folder.hide()
  })
}

gui.add(state, 'activeLight', Object.keys(lights))
  .name('Light Type')
  .onChange(updateLights)

updateLights()

const shapeManager = new ShapeManager(engine.scene)
const labelManager = new LabelManager('.label')

lightManager.createDirectionalLight('Main Sun', new THREE.Vector3(1, 4, 2))
shapeManager.setupGUI(gui)

engine.addUpdateCallback((delta) => {
  labelManager.update(shapeManager.meshes, engine.camera)
})