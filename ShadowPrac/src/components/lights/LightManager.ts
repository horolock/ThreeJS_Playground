import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

type LightWithShadow = THREE.DirectionalLight | THREE.PointLight | THREE.SpotLight
type ShadowCamera = THREE.PerspectiveCamera | THREE.OrthographicCamera

export interface LightConfig {
    color: number
    shadowMapSize: number
}

export class LightManager {
    private scene: THREE.Scene
    private gui: GUI
    private config: LightConfig

    constructor(scene: THREE.Scene, gui: GUI, config: LightConfig) {
        this.scene = scene
        this.gui = gui
        this.config = config
    }

    private setupShadow(light: LightWithShadow, folder: any, helper: THREE.Object3D) {
        if (light.shadow ) {
            light.castShadow = true
            light.shadow.mapSize.width = this.config.shadowMapSize
            light.shadow.mapSize.height = this.config.shadowMapSize

            const shadowCam = light.shadow.camera as ShadowCamera

            folder.add(this.config, 'shadowMapSize', [256, 512, 1024, 2048, 4096])
                .name('Shadow Res')
                .onChange((val: number) => {
                    light.shadow.mapSize.width = val
                    light.shadow.mapSize.height = val

                    if (light.shadow.map) {
                        light.shadow.map.dispose()
                        // @ts-ignore
                        light.shadow.map = null
                    }
                })
            
            folder.add(helper, 'visible').name('Show Helper')

            const onCamChange = () => {
                shadowCam.updateProjectionMatrix()

                if ('update' in helper) (helper as any).update()
            }

            folder.add(shadowCam, 'near', 0.01, 10).onChange(onCamChange)
            folder.add(shadowCam, 'far', 0.1, 100).onChange(onCamChange)
        }
    }

    createDirectionalLight(name: string, position: THREE.Vector3) {
        const light = new THREE.DirectionalLight(this.config.color, Math.PI)
        light.position.copy(position)
        this.scene.add(light)

        const helper = new THREE.CameraHelper(light.shadow.camera)
        this.scene.add(helper)
        helper.visible = false

        const folder = this.gui.addFolder(name)
        folder.add(light, 'intensity', 0, Math.PI * 10)

        const cam = light.shadow.camera as THREE.OrthographicCamera
        const update = () => { 
            cam.updateProjectionMatrix()
            helper.update()
        }

        folder.add(cam, 'left', -10, -1).onChange(update)
        folder.add(cam, 'right', 1, 10).onChange(update)
        folder.add(cam, 'top', 1, 10).onChange(update)
        folder.add(cam, 'bottom', -10, -1).onChange(update)

        this.setupShadow(light, folder, helper)

        return light
    }

    createPointLight(name: string, position: THREE.Vector3) {
        const light = new THREE.PointLight(this.config.color, Math.PI)
        light.position.copy(position)
        this.scene.add(light)

        const helper = new THREE.PointLightHelper(light)
        this.scene.add(helper)
        helper.visible = false

        const folder = this.gui.addFolder(name)
        folder.add(light, 'intensity', 0, Math.PI * 10)
        folder.add(light, 'distance', 0, 50)
        folder.add(light, 'decay', 0, 5)

        this.setupShadow(light, folder, helper)

        return light
    }

    createSpotLight(name: string, position: THREE.Vector3) {
        const light = new THREE.SpotLight(this.config.color, Math.PI)
        light.position.copy(position)
        this.scene.add(light)

        const helper = new THREE.CameraHelper(light.shadow.camera)
        this.scene.add(helper)
        helper.visible = false

        const folder = this.gui.addFolder(name)
        folder.add(light, 'intensity', 0, Math.PI * 10)
        folder.add(light, 'angle', 0, Math.PI / 3)
        folder.add(light, 'penumbra', 0, 1)
        folder.add(light, 'decay', 0, 5)

        this.setupShadow(light, folder, helper)

        return light
    }
}

