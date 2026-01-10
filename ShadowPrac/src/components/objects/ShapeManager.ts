import * as THREE from 'three'

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
            return mesh
        })

        this.scene.add(...this.meshes)
    }
}