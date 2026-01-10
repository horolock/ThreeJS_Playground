import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'

export class WebGLEngine {
    public scene: THREE.Scene
    public camera: THREE.PerspectiveCamera
    public renderer: THREE.WebGLRenderer
    public controls: OrbitControls
    private stats: Stats
    private onUpdateCallbacks: Array<(delta: number) => void> = []
    private clock: THREE.Clock = new THREE.Clock()

    constructor() {
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(
            75, window.innerWidth / window.innerHeight, 0.1, 100
        )

        this.camera.position.set(-1, 4, 2.5)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFShadowMap
        document.body.appendChild(this.renderer.domElement)

        // Controls & Stats
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true

        this.stats = new Stats()
        document.body.appendChild(this.stats.dom)

        // Event Listener
        window.addEventListener('resize', () => this.onWindowResize())
        
        // Start Loop
        this.render()
    }

    public addUpdateCallback(callback: (delta: number) => void) {
        this.onUpdateCallbacks.push(callback)
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private render() {
        requestAnimationFrame(() => this.render())

        this.controls.update()
        this.stats.update()

        const delta = this.clock.getDelta()
        this.onUpdateCallbacks.forEach(cb => cb(delta))

        this.renderer.render(this.scene, this.camera)
    }

    public add(...objects: THREE.Object3D[]) {
        this.scene.add(...objects)
    }
}