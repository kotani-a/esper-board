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

// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls';

import { MeshPhongMaterial } from '../node_modules/three/src/materials/MeshPhongMaterial';
import { CircleGeometry } from '../node_modules/three/src/geometries/CircleGeometry';
import { Vector2 } from '../node_modules/three/src/math/Vector2';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { Raycaster } from '../node_modules/three/src/core/Raycaster';
import styles from '../styles/borad.module.scss'

class Borad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMeshList: []
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

    const lablesWrap = document.querySelector('#lables')
    lablesWrap.style.width = `${this.w}px`
    lablesWrap.style.height = `${this.h}px`
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

    const geometry = new CircleGeometry(120, 6);
    const geometryFrame = new CircleGeometry(125, 6);
    const geometryBase = new CircleGeometry(130, 6);
    const lables = document.getElementById('lables');

    // 中心のhex作成 start
    this['hexGroup0'] = new Group();
    const material = new MeshPhongMaterial( { color: 0x962966 } );
    const materialFrame = new MeshPhongMaterial( { color: 0xffffb5 } );
    const materialBase = new MeshLambertMaterial( { color: 0xaa9258 } );
    this['meshBase0'] = new Mesh( geometryBase, materialBase );
    this['meshBase0'].position.set(0, 0, 0);
    this['meshFrame0'] = new Mesh( geometryFrame, materialFrame );
    this['meshFrame0'].position.set(0, 0, 1);
    this['mesh0'] = new Mesh( geometry, material );
    this['mesh0'].meshId = 'mesh0';
    this['mesh0'].position.set(0, 0, 2);
    this['hexGroup0'].add(this['mesh0'], this['meshFrame0'], this['meshBase0']);
    this.scene.add(this['hexGroup0']);

    const div = document.createElement('div')
    div.textContent = 'hex 0';
    div.id = 'mesh0';
    div.className = 'hex';
    lables.appendChild(div);

    this.meshList.push(this['mesh0']);
    // 中心のhex作成 end

    for (let i = 1;i < 5;i++) {
      // const material = new MeshBasicMaterial( { color: 0x962966 } );
      // const material = new MeshToonMaterial( { color: 0x962966 } );
      
      this[`hexGroup1-${i}`] = new Group();
      const material = new MeshPhongMaterial( { color: 0x962966 } );
      const materialFrame = new MeshPhongMaterial( { color: 0xffffb5 } );
      const materialBase = new MeshLambertMaterial( { color: 0xaa9258 } );
      this[`meshBase1-${i}`] = new Mesh( geometryBase, materialBase );
      this[`meshBase1-${i}`].position.set(162.5 * i, 281.5 * i, 0);
      this[`meshFrame1-${i}`] = new Mesh( geometryFrame, materialFrame );
      this[`meshFrame1-${i}`].position.set(162.5 * i, 281.5 * i, 1);
      this[`mesh1-${i}`] = new Mesh( geometry, material );
      this[`mesh1-${i}`].meshId = `mesh1-${i}`;
      this[`mesh1-${i}`].position.set(162.5 * i, 281.5 * i, 2);
      this[`hexGroup1-${i}`].add(this[`mesh1-${i}`], this[`meshFrame1-${i}`], this[`meshBase1-${i}`]);
      this.scene.add(this[`hexGroup1-${i}`]);

      const div = document.createElement('div')
      div.textContent = `hex 1-${i}`;
      div.id = `mesh1-${i}`;
      div.className = 'hex';
      lables.appendChild(div);

      this.meshList.push(this[`mesh1-${i}`]);
    }

    for (let i = 1;i < 5;i++) {
      this[`hexGroup2-${i}`] = new Group();
      const material = new MeshPhongMaterial( { color: 0x962966 } );
      const materialFrame = new MeshPhongMaterial( { color: 0xffffb5 } );
      const materialBase = new MeshLambertMaterial( { color: 0xaa9258 } );
      this[`meshBase2-${i}`] = new Mesh( geometryBase, materialBase );
      this[`meshBase2-${i}`].position.set(-162.5 * i, -281.5 * i, 0);
      this[`meshFrame2-${i}`] = new Mesh( geometryFrame, materialFrame );
      this[`meshFrame2-${i}`].position.set(-162.5 * i, -281.5 * i, 1);
      this[`mesh2-${i}`] = new Mesh( geometry, material );
      this[`mesh2-${i}`].meshId = `mesh2-${i}`;
      this[`mesh2-${i}`].position.set(-162.5 * i, -281.5 * i, 2);
      this[`hexGroup2-${i}`].add(this[`mesh2-${i}`], this[`meshFrame2-${i}`], this[`meshBase2-${i}`]);
      this.scene.add(this[`hexGroup2-${i}`]);

      const div = document.createElement('div')
      div.textContent = `hex 2-${i}`;
      div.id = `mesh2-${i}`;
      div.className = 'hex';
      lables.appendChild(div);

      this.meshList.push(this[`mesh2-${i}`]);
    }

    this.tick();
    this.resetDomPosition();
    window.addEventListener('mousedown', this.onMousedown, false);
    window.addEventListener('mousemove', this.onMousemove, false);
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.onMousedown, false);
    window.removeEventListener('mousemove', this.onMousemove, false);
  }

  tick () {
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
      const newMeshList = [...this.state.activeMeshList, intersects[0].object]
      this.setState({ activeMeshList: newMeshList })
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

  resetDomPosition() {
    const tempV = new Vector3();
    const canvas = document.querySelector('#myCanvas');
    return new Promise(resolve => {
      this.meshList.map((mesh, index) => {
        const meshDom = document.getElementById(mesh.meshId)
        const worldPosition = mesh.getWorldPosition(tempV)
        const projection = worldPosition.project(this.camera)
        const sx = (canvas.clientWidth / 2) * (+projection.x + 1.0);
        const sy = (canvas.clientHeight / 2) * (-projection.y + 1.0);
        meshDom.style.top = `${sy}px`;
        meshDom.style.left = `${sx}px`;
      });
      resolve('resolved');
    })
  }

  moveCamera(vector, number) {
    return new Promise(resolve => {
      this.camera.position[vector] = this.camera.position[vector] + number;
      this.renderer.render(this.scene, this.camera);
      resolve('resolved');
    })
  }

  zoomIn () {
    this.moveCamera('z', -1000);
    this.resetDomPosition();
  }

  zoomOut () {
    this.moveCamera('z', +1000);
    this.resetDomPosition();
  }

  moveRight () {
    this.moveCamera('x', -1000);
    this.resetDomPosition();
  }

  moveLeft () {
    this.moveCamera('x', +1000);
    this.resetDomPosition();
  }

  moveTop () {
    this.moveCamera('y', -1000);
    this.resetDomPosition();
  }

  moveBottom () {
    this.moveCamera('y', +1000);
    this.resetDomPosition();
  }

  render() {
    return (
      <div id="borad" className={styles.borad}>
        <div className={styles.activeMesh}>
          <h3>active mesh:</h3>
          {this.state.activeMeshList.filter(mesh => mesh.active).map((activeMech, i) =>
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
        <div>
          <canvas id="myCanvas" className={styles.myCanvas}>
          </canvas>
          <div id="lables" className={styles.lables}>
          </div>
        </div>
      </div>
    );
  }
}
export default Borad
