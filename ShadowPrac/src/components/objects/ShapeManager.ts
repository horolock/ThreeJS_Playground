import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export class ShapeManager {
    private scene: THREE.Scene
    public meshes: THREE.Mesh[] = []

    constructor(scene: THREE.Scene) {
        this.scene = scene
        this.createShapes()
    }


    private createShapes() {
        const geometry = new THREE.IcosahedronGeometry(1, 1)
        const color = 0x00ff00

        const materials = [
            new THREE.MeshBasicMaterial({ color }),
            new THREE.MeshNormalMaterial({ flatShading: true }),
            new THREE.MeshPhongMaterial({ color, flatShading: true }),
            new THREE.MeshStandardMaterial({ color, flatShading: true }),
        ]

        this.meshes = materials.map((material, i) => {
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(-3 + i * 2, 1, 0)
            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.name = material.type
            return mesh
        })

        this.scene.add(...this.meshes)
    }

    public setupGUI(gui: GUI) {
        const folder = gui.addFolder('Materials')

        this.meshes.forEach((mesh) => {
            const mat = mesh.material as any
            const matFolder = folder.addFolder(mesh.name)

            matFolder.add(mat, 'visible')
            matFolder.add(mat, 'wireframe')

            if (mat.color) {
                matFolder.addColor(mat, 'color')
            }

            if (mat.flatShading !== undefined) {
                matFolder.add(mat, 'flatShading').onChange(() => {
                    mat.needsUpdate = true
                })
            }

            if (mat instanceof THREE.MeshPhongMaterial) {
                matFolder.add(mat, 'shininess', 0, 100)
                matFolder.addColor(mat, 'specular')
            }

            if (mat instanceof THREE.MeshStandardMaterial) {
                matFolder.add(mat, 'roughness', 0, 1)
                matFolder.add(mat, 'metalness', 0, 1)
            }
        })
    }
}