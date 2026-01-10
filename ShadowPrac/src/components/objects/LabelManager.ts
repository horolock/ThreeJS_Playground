import * as THREE from 'three'

export class LabelManager {
    private labels: NodeListOf<HTMLDivElement>
    private tempV = new THREE.Vector3()

    constructor(selector: string) {
        this.labels = document.querySelectorAll<HTMLDivElement>(selector)
    }

    public update(meshes: THREE.Mesh[], camera: THREE.Camera) {
        if (this.labels.length < meshes.length) { return }

        meshes.forEach((mesh, i) => {
            const label = this.labels[i]

            this.tempV.copy(mesh.position)

            this.tempV.project(camera)

            const x = ((1 + this.tempV.x) / 2) * window.innerWidth - 37.5
            const y = ((1 - this.tempV.y) / 2) * window.innerHeight

            // DOM Style update
            label.style.left = `${x}px`
            label.style.top = `${y}px`

            label.style.display = this.tempV.z > 1 ? 'none' : 'block'
        })
    }
}