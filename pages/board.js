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

import { TextureLoader } from '../node_modules/three/src/loaders/TextureLoader';

import { MeshPhongMaterial } from '../node_modules/three/src/materials/MeshPhongMaterial';
import { CircleGeometry } from '../node_modules/three/src/geometries/CircleGeometry';
import { CylinderGeometry } from '../node_modules/three/src/geometries/CylinderGeometry';
import { Vector2 } from '../node_modules/three/src/math/Vector2';
import { Vector3 } from '../node_modules/three/src/math/Vector3';
import { Raycaster } from '../node_modules/three/src/core/Raycaster';
// import { Color } from '../node_modules/three/src/math/Color';

import Fab from '@mui/material/Fab';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import styles from '../styles/board.module.scss'

import siren from '../constants/siren.json'

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMeshList: [],
      stockSps: 652,
      mouseDown :false,
      mousedownPosition: {
        x: 0,
        y: 0
      }
    };
    this.tick = this.tick.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  componentDidMount () {
    this.threeSetting();

    window.addEventListener('mousedown', this.onMousedown, false);
    window.addEventListener('mouseup', this.onMouseup, false);
    window.addEventListener('mousemove', this.onMousemove, false);
    window.addEventListener('resize', this.onResize, false);
    window.addEventListener('wheel', this.onWheel, false);
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.onMousedown, false);
    window.removeEventListener('mouseup', this.onMouseup, false);
    window.removeEventListener('mousemove', this.onMousemove, false);
    window.removeEventListener('resize', this.onResize, false);
    window.removeEventListener('wheel', this.onWheel, false);
  }

  threeSetting () {
    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    this.camera = new PerspectiveCamera(60, this.w / this.h, 1, 5000);
    this.camera.position.z = 2000;// カメラを遠ざける
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
    const loader = new TextureLoader();
    // const material = new MeshPhongMaterial( { color: 0x962966, map: texture } );
    const material = new MeshPhongMaterial({map: loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')});
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
    div.textContent = 'center';
    div.id = 'mesh0';
    div.className = 'hex';
    lables.appendChild(div);

    this.meshList.push(this['mesh0']);
    // 中心のhex作成 end

    siren.map(hexGroup => this.createHexs(hexGroup.row, hexGroup.direction, hexGroup.abilitys));

    this.tick();
    this.resetDomPosition();
  }

  createHexs (row, direction, abilitys) {
    const geometry = new CircleGeometry(120, 6);
    const geometryFrame = new CircleGeometry(125, 6);
    const geometryBase = new CircleGeometry(130, 6);
    const lables = document.getElementById('lables');
    abilitys.forEach((ability, i) => {
      if (row === 0 && i === 0) return;
      if (row % 2 === 0 && !direction && i === 0) return;
      this[`hexGroup${ability.id}`] = new Group();
      const material = new MeshPhongMaterial( { color: 0x962966 } );
      const materialFrame = new MeshPhongMaterial( { color: 0xffffb5 } );
      const materialBase = new MeshLambertMaterial( { color: 0xaa9258 } );

      const positionX = direction ? (325 * i + (row % 2 === 0 ? 0 : 162.5)) : -(325 * i + (row % 2 === 0 ? 0 : 162.5))
      const positionY = 281.5 * row

      this[`meshBase${ability.id}`] = new Mesh( geometryBase, materialBase );
      this[`meshBase${ability.id}`].position.set(positionX, positionY, 0);
      this[`meshFrame${ability.id}`] = new Mesh( geometryFrame, materialFrame );
      this[`meshFrame${ability.id}`].position.set(positionX, positionY, 1);
      this[`mesh${ability.id}`] = new Mesh( geometry, material );
      this[`mesh${ability.id}`].meshId = `mesh${ability.id}`;
      this[`mesh${ability.id}`].sp = ability.sp;
      this[`mesh${ability.id}`].abilityType = ability.abilityType;
      this[`mesh${ability.id}`].abilityTypeLabel = ability.abilityTypeLabel;
      this[`mesh${ability.id}`].value = ability.value;
      this[`mesh${ability.id}`].childrenHexs = ability.childrenHexs;
      this[`mesh${ability.id}`].parentHexs = ability.parentHexs;
      this[`mesh${ability.id}`].disabled = false;
      this[`mesh${ability.id}`].active = false;
      this[`mesh${ability.id}`].position.set(positionX, positionY, 2);
      this[`hexGroup${ability.id}`].add(this[`mesh${ability.id}`], this[`meshFrame${ability.id}`], this[`meshBase${ability.id}`]);
      this.scene.add(this[`hexGroup${ability.id}`]);

      const div = document.getElementById(`mesh${ability.id}`) || document.createElement('div')
      div.innerHTML  = `<div class="hexTexts">
        <span class="sp">${ability.sp} SP</span>
        <span class="abilityName">${ability.lable}</span>
      </div>`;
      div.id = `mesh${ability.id}`;
      div.className = 'hex';
      lables.appendChild(div);

      this.createBranch(positionX, positionY, ability.corner);

      this.meshList.push(this[`mesh${ability.id}`]);
    })
  }

  createBranch (x, y, corner) {
    let positionX = 0;
    let positionY = 0;
    let rotationZ = 0;
    switch (corner) {
      case 1:
        positionX = 80 + x;
        positionY = 140 + y;
        rotationZ = -Math.PI/6;
        break;
      case 2:
        positionX = 160 + x;
        positionY = y;
        rotationZ = Math.PI/2;
        break;
      case 3:
        positionX = 80 + x;
        positionY = -140 + y;
        rotationZ = Math.PI/6;
        break;
      case 4:
        positionX = -80 + x;
        positionY = -140 + y;
        rotationZ = -Math.PI/6;
        break;
      case 5:
        positionX = -160 + x;
        positionY = y;
        rotationZ = -Math.PI/2;
        break;
      case 6:
        positionX = -80 + x;
        positionY = 140 + y;
        rotationZ = Math.PI/6;
        break;
      default:
        positionX = x;
        positionY = y;
        rotationZ = 0;
    }

    this[`cylinder${x}_${y}_${corner}`] = new Mesh(
      new CylinderGeometry(5,5,70,50),
      new MeshLambertMaterial({color: 0xFFFFFF})
    );
    this[`cylinder${x}_${y}_${corner}`].position.set(positionX, positionY, -2);
    this[`cylinder${x}_${y}_${corner}`].rotation.set(0,0,rotationZ);
    this.scene.add(this[`cylinder${x}_${y}_${corner}`]);
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

  disabledCheck() {
    const { stockSps } = this.state;
    this.meshList.map((mesh) => {
      if (mesh.id !== 'mesh0' && !mesh.active && mesh.sp > stockSps) {
        mesh.material.color.setHex(0x555555);
        mesh.disabled = true;
      } else if (mesh.disabled && mesh.sp <= stockSps) {
        mesh.material.color.setHex(0x962966);
        mesh.disabled = false;
      }
    });
  }

  setActiveMesh(targetMesh) {
    const {
      activeMeshList,
      stockSps
    } = this.state;
    if (!targetMesh.active && targetMesh.sp < stockSps) {
      targetMesh.active = true;
      const newMeshList = [...activeMeshList, targetMesh];
      this.setState({
        activeMeshList: newMeshList,
        stockSps: stockSps - targetMesh.sp
      });
      targetMesh.material.color.setHex(0xB0A341);
      this.disabledCheck();
    }
  }

  removeActiveMesh(targetMesh) {
    const {
      activeMeshList,
      stockSps
    } = this.state;
    if (targetMesh.active) {
      targetMesh.active = false;
      const newMeshList = activeMeshList.filter(mesh => mesh.meshId !== targetMesh.meshId);
      this.setState({
        activeMeshList: newMeshList,
        stockSps: stockSps + targetMesh.sp
      });
      // this.setState(state => ({
      //   activeMeshList: state.activeMeshList.filter(mesh => mesh.meshId !== targetMesh.meshId),
      //   stockSps: state.stockSps + targetMesh.sp
      // }));
      targetMesh.material.color.setHex(0x962966);
      this.disabledCheck();
    }
  }

  onMousedown(e) {
    this.setState({
      mouseDown: true,
      mousedownPosition: {
        x: e.pageX,
        y: e.pageY
      }
    });

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
      const targetMesh = intersects[0].object
      if (!targetMesh.disabled && !targetMesh.active) {
        if (targetMesh.childrenHexs.length > 0) {
          for (const childId of targetMesh.childrenHexs) {
            this.setActiveMesh(this.meshList.find(mesh => mesh.meshId === `mesh${childId}`));
          }
        }
        this.setActiveMesh(targetMesh);
      } else if (!targetMesh.disabled && targetMesh.active) {
        if (targetMesh.parentHexs.length > 0) {
          for (const childId of targetMesh.parentHexs) {
            this.removeActiveMesh(this.meshList.find(mesh => mesh.meshId === `mesh${childId}`));
          }
        }
        this.removeActiveMesh(targetMesh);
      }
    }
  }

  onMouseup() {
    this.setState({
      mouseDown: false,
      mousedownPosition: {
        x: 0,
        y: 0
      }
    });
  }

  onMousemove(e) {
    const {
      mousedownPosition,
      mouseDown
    } = this.state
    if (mouseDown) {
      this.moveCamera2D(-((e.pageX - mousedownPosition.x) / 2), (e.pageY - mousedownPosition.y) / 2);
      this.resetDomPosition();
    } else {
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
          // マウスオーバー時の色
          mesh.material.color.setHex(0xF48BC7);
        } else if (mesh.active) {
          mesh.material.color.setHex(0xB0A341);
        } else if (mesh.disabled) {
          mesh.material.color.setHex(0x555555);
        } else {
          // それ以外は元の色にする
          mesh.material.color.setHex(0x962966);
        }
      });
    }
  }

  onResize() {
    this.threeSetting();
  }

  onWheel(e) {
    this.moveCamera('z', -e.wheelDelta);
    this.resetDomPosition();
  }

  resetDomPosition() {
    const tempV = new Vector3();
    const canvas = document.querySelector('#myCanvas');
    return new Promise(resolve => {
      this.meshList.map(mesh => {
        const meshDom = document.getElementById(mesh.meshId);
        const worldPosition = mesh.getWorldPosition(tempV);
        const projection = worldPosition.project(this.camera);
        const sx = (canvas.clientWidth / 2) * (+projection.x + 1.0);
        const sy = (canvas.clientHeight / 2) * (-projection.y + 1.0);
        meshDom.style.top = `${sy + 4}px`;
        meshDom.style.left = `${sx - (meshDom.clientWidth / 2)}px`;
      });
      resolve('resolved');
    })
  }

  moveCamera2D(x, y) {
    return new Promise(resolve => {
      this.camera.position.x += x;
      this.camera.position.y += y;
      this.renderer.render(this.scene, this.camera);
      resolve('resolved');
    })
  }

  moveCamera(vector, number) {
    return new Promise(resolve => {
      this.camera.position[vector] += number;
      this.renderer.render(this.scene, this.camera);
      resolve('resolved');
    })
  }

  zoomIn() {
    this.moveCamera('z', -1000);
    this.resetDomPosition();
  }

  zoomOut() {
    this.moveCamera('z', +1000);
    this.resetDomPosition();
  }

  moveRight() {
    this.moveCamera('x', -1000);
    this.resetDomPosition();
  }

  moveLeft() {
    this.moveCamera('x', +1000);
    this.resetDomPosition();
  }

  moveTop() {
    this.moveCamera('y', -1000);
    this.resetDomPosition();
  }

  moveBottom() {
    this.moveCamera('y', +1000);
    this.resetDomPosition();
  }

  cameraPositionReset() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 2000;
    this.renderer.render(this.scene, this.camera);
    this.resetDomPosition();
  }

  activeAbilityReset() {
    this.meshList.map(mesh => {
      // this.removeActiveMesh(mesh);
      mesh.active = false
      mesh.disabled = false
    });
    this.setState({
      activeMeshList: [],
      stockSps: 652
    });
  }

  sumActiveAbilityArray() {
    const result = [];
    this.state.activeMeshList.forEach(activeMech => {
      const index = result.findIndex(r => r.abilityType === activeMech.abilityType);
      if (index > -1) {
        result[index].value += activeMech.value 
      } else {
        result.push({
          abilityType: activeMech.abilityType,
          abilityTypeLabel: activeMech.abilityTypeLabel,
          value: activeMech.value
        });
      }
    });
    return result;
  }

  render() {
    const { stockSps } = this.state
    this.sumActiveAbilityArray();

    return (
      <div id="board" className={styles.board}>
        <div className={styles.panel}>
          <div className={styles.activeMesh}>
            <h3 className={styles.spWrap}>
              <span className={styles.sp}>SP: </span>
              <span className={styles.stockSp}>{stockSps}</span>
            </h3>
            <h3 className={styles.activeAbilityTitle}>
              <span className={styles.activeAbilityTitleText}>発動アビリティ</span>
              <Fab
                aria-label="activeAbilityReset"
                size="small"
                onClick={() => this.activeAbilityReset()}
              >
                <RestartAltIcon />
              </Fab>
            </h3>
            {this.sumActiveAbilityArray().map((activeMech, i) =>
              <h4
                className={styles.activeAbility}
                key={i}
              >
                <span>{activeMech.abilityTypeLabel}: </span>
                <span className={styles.abilityTypeValue}>{activeMech.value}</span>
              </h4>
            )}
          </div>
          <menu className={styles.controlButtons}>
            <h3 className={styles.cameraPositionTitle}>
              <span className={styles.cameraPositionTitleText}>カメラ位置</span>
              <Fab
                aria-label="cameraPositionReset"
                size="small"
                onClick={() => this.cameraPositionReset()}
              >
                <RestartAltIcon />
              </Fab>
            </h3>
            <div className={styles.zoomButtons}>
              <Fab
                aria-label="zoomIn"
                size="small"
                className={styles.zoomIn}
                onClick={() => this.zoomIn()}
              >
                <ZoomInIcon />
              </Fab>
              <Fab
              aria-label="zoomOut"
              size="small"
              className={styles.zoomOut}
              onClick={() => this.zoomOut()}
              >
                <ZoomOutIcon />
              </Fab>
            </div>
            <div>
              <div className={styles.menuRow}>
                <Fab
                aria-label="moveTop"
                size="small"
                onClick={() => this.moveTop()}
                >
                  <ArrowDropUpIcon />
                </Fab>
              </div>
              <div className={styles.menuRow}>
                <Fab
                  aria-label="moveLeft"
                  size="small"
                  onClick={() => this.moveLeft()}
                >
                  <ArrowLeftIcon />
                </Fab>
                <Fab
                aria-label="moveRight"
                size="small"
                onClick={() => this.moveRight()}
                >
                  <ArrowRightIcon />
                </Fab>
              </div>
              <div className={styles.menuRow}>
                <Fab
                  aria-label="moveBottom"
                  size="small"
                  onClick={() => this.moveBottom()}
                >
                  <ArrowDropDownIcon />
                </Fab>
              </div>
            </div>
          </menu>
        </div>
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
export default Board
