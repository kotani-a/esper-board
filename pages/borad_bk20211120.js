import * as React from 'react'
import { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer';
import { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera';
import { Scene } from '../node_modules/three/src/scenes/Scene';
import { PointLight } from '../node_modules/three/src/lights/PointLight';
// import { BoxGeometry } from '../node_modules/three/src/geometries/BoxGeometry';
import { MeshLambertMaterial } from '../node_modules/three/src/materials/MeshLambertMaterial';
import { Mesh } from '../node_modules/three/src/objects/Mesh';
import { Group } from '../node_modules/three/src/objects/Group';
import { MeshBasicMaterial } from '../node_modules/three/src/materials/MeshBasicMaterial';
import { MeshToonMaterial } from '../node_modules/three/src/materials/MeshToonMaterial';

import { MeshPhongMaterial } from '../node_modules/three/src/materials/MeshPhongMaterial';
import { CircleGeometry } from '../node_modules/three/src/geometries/CircleGeometry';
import { Vector2 } from '../node_modules/three/src/math/Vector2';
import { Raycaster } from '../node_modules/three/src/core/Raycaster';

import styles from '../styles/borad.module.scss'

class Borad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meshList: []
    };
    this.tick = this.tick.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
  }

  componentDidMount () {
    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    this.camera = new PerspectiveCamera(60, this.w / this.h, 1, 5000);
    this.camera.position.z = 1000;// カメラを遠ざける
    // レンダラーを作成
    this.renderer = new WebGLRenderer({
      canvas: document.querySelector('#myCanvas'),
      alpha: true
    });
    this.renderer.setSize(this.w, this.h);// 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio);// ピクセル比
    // シーンを作成
    this.scene = new Scene();

    this.mouse = new Vector2();

    // ライトを作成
    this.light = new PointLight(0xffffff);
    this.light.position.set(0, 0, 2000);// ライトの位置を設定

    // ライトをシーンに追加
    this.scene.add(this.light);

    // レイキャスト(クリック時のあたり判定用の光線)
    this.raycaster = new Raycaster();

    this.meshList = [];

    const geometry = new CircleGeometry( 120, 6 );
    const geometryFrame = new CircleGeometry( 125, 6 );
    const geometryBase = new CircleGeometry( 130, 6 );
    const parrent = document.getElementById('borad')

    for (let i = 0;i < 5;i++) {
      // const material = new MeshBasicMaterial( { color: 0x962966 } );
      // const material = new MeshToonMaterial( { color: 0x962966 } );
      
      this[`hexGroup${i}`] = new Group();
      const material = new MeshPhongMaterial( { color: 0x962966 } );
      const materialFrame = new MeshPhongMaterial( { color: 0xffffb5 } );
      const materialBase = new MeshLambertMaterial( { color: 0xaa9258 } );
      this[`meshBase${i}`] = new Mesh( geometryBase, materialBase );
      this[`meshBase${i}`].position.set(135 * i, 240 * i, 0);
      this[`meshFrame${i}`] = new Mesh( geometryFrame, materialFrame );
      this[`meshFrame${i}`].position.set(135 * i, 240 * i, 1);
      this[`mesh${i}`] = new Mesh( geometry, material );
      this[`mesh${i}`].meshId = `mesh${i}`;
      this[`mesh${i}`].position.set(135 * i, 240 * i, 2);
      this[`hexGroup${i}`].add(this[`mesh${i}`], this[`meshFrame${i}`], this[`meshBase${i}`])
      this.scene.add(this[`hexGroup${i}`]);

      const div = document.createElement('div')
      div.textContent = `hex ${i}`;
      // div.textContent = '火属性アビリティ攻撃アップ';
      div.id = `mesh${i}`;
      div.className = 'hex';
      div.style.top = `${(window.innerHeight/2) - 180*i}px`;
      div.style.left = `${(window.innerWidth/2) + 115*i}px`;
      parrent.appendChild(div);



      this.meshList.push(this[`mesh${i}`])
      // this.setState({meshList: this.state.meshList.push(this[`mesh${i}`])})
    }

    this.tick()
    window.addEventListener('mousedown', this.onMousedown, false);
    window.addEventListener('mousemove', this.onMousemove, false);
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.onMousedown, false);
    window.removeEventListener('mousemove', this.onMousemove, false);
  }

  tick() {
    requestAnimationFrame(this.tick);

    // anime add
    // 箱を回転させる
    // this.hexGroup0.rotation.x += 0.01
    
    // this.mesh0.rotation.x += 0.001;
    // this.mesh0.rotation.y += 0.001;
    // this.mesh0.rotation.z += 0.001;

    // this.mesh1.rotation.x += 0.01;

    // this.mesh2.rotation.y += 0.1;

    // this.mesh3.rotation.x -= 0.01;
    // this.mesh3.rotation.y -= 0.01;

    // this.mesh4.rotation.x += 0.04;
    // this.mesh4.rotation.y -= 0.04;
    
    // レンダリング
    this.renderer.render(this.scene, this.camera);
  }

  onMousedown (e) {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = - (y / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // // 光線と交わるオブジェクトを収集
    const intersects = this.raycaster.intersectObjects(this.meshList);
    // 交わるオブジェクトが１個以上の場合
    if (intersects.length > 0) {
      // 実行したい処理をかく
      intersects[0].object.active = true
      const newMeshList = [...this.state.meshList, intersects[0].object]
      this.setState({ meshList: newMeshList })
      intersects[0].object.material.color.setHex(0xF2DF5A);
    } else {
    }
  }

  onMousemove (e) {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = - (y / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // // 光線と交わるオブジェクトを収集
    const intersects = this.raycaster.intersectObjects(this.meshList);

    this.meshList.map((mesh) => {
      // 交差しているオブジェクトが1つ以上存在し、
      // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
        // 色を赤くする
        mesh.material.color.setHex(0xF48BC7);
      } else if (mesh.active) {
        mesh.material.color.setHex(0xF2DF5A);
      } else {
        // それ以外は元の色にする
        mesh.material.color.setHex(0x962966);
      }
    });
  }

  resetDomPosition(position) {
    return new Promise(resolve => {
      // 初めのカメラ位置は(x: 0,y: 0,z: 1000)
      this.meshList.map((mesh, index) => {
        const meshDom = document.getElementById(mesh.meshId)
        meshDom.style.transform =
        `matrix3d(${1000/position.z},0,0.00,0,0.00,${1000/position.z},0.00,0,0,0,1,0,-${750*(position.x/1000)},${750*(position.y/1000)},0,1)`
        // z軸がむずい。zはtranslateにする？？
        // `matrix3d(${1000/position.z},0,0.00,0,0.00,${1000/position.z},0.00,0,0,0,1,0,-${750*(position.x/1000) + ((position.z/1000)*32*index)},${750*(position.y/1000) + ((position.z/1000)*42*index)},0,1)`
        // transform: translate(-50%, -50%) matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 70, 90, 0, 1);
      });
      resolve('resolved');
    })
  }

  async zoomIn () {
    const { position } = this.camera
    await this.resetDomPosition({
      x: position.x,
      y: position.y,
      z: position.z - 1000
    });
    this.camera.position.z -= 1000;
  }

  async zoomOut () {
    const { position } = this.camera
    await this.resetDomPosition({
      x: position.x,
      y: position.y,
      z: position.z + 1000
    });
    this.camera.position.z += 1000;
  }

  async moveRight () {
    const { position } = this.camera
    await this.resetDomPosition({
      x: position.x - 1000,
      y: position.y,
      z: position.z
    });
    this.camera.position.x -= 1000;
  }

  async moveLeft () {
    const { position } = this.camera
    await this.resetDomPosition({
      x: position.x + 1000,
      y: position.y,
      z: position.z
    });
    this.camera.position.x += 1000;
  }

  async moveTop () {
    const { position } = this.camera
    await this.resetDomPosition({
      x: position.x,
      y: position.y - 1000,
      z: position.z
    });
    this.camera.position.y -= 1000;
  }

  async moveBottom () {
    const { position } = this.camera
    await this.resetDomPosition({
      x: position.x,
      y: position.y + 1000,
      z: position.z
    });
    this.camera.position.y += 1000;
  }

  render() {
    return (
      <div id="borad" className={styles.borad}>
        <div className={styles.activeMesh}>
          <h3>active mesh:</h3>
          {this.state.meshList.filter(mesh => mesh.active).map((activeMech, i) =>
            <span key={i}>{activeMech.meshId}</span>
          )}
        </div>
        zoomIn(z軸-)
        <button onClick={() => this.zoomIn()}>+</button>
        zoomOut(z軸+)
        <button onClick={() => this.zoomOut()}>-</button>
        moveRight(x軸-)
        <button onClick={() => this.moveRight()}>→</button>
        moveLeft(x軸+)
        <button onClick={() => this.moveLeft()}>←</button>
        moveTop(y軸-)
        <button onClick={() => this.moveTop()}>↑</button>
        moveBottom(y軸+)
        <button onClick={() => this.moveBottom()}>↓</button>
        <canvas id="myCanvas" className={styles.myCanvas}>
        </canvas>
      </div>
    );
  }
}
export default Borad
