import * as React from "react";
import { WebGLRenderer } from "node_modules/three/src/renderers/WebGLRenderer";
import { PerspectiveCamera } from "node_modules/three/src/cameras/PerspectiveCamera";
import { Scene } from "node_modules/three/src/scenes/Scene";
import { PointLight } from "node_modules/three/src/lights/PointLight";
import { MeshLambertMaterial } from "node_modules/three/src/materials/MeshLambertMaterial";
import { Mesh } from "node_modules/three/src/objects/Mesh";
import { Group } from "node_modules/three/src/objects/Group";

import { TextureLoader } from "node_modules/three/src/loaders/TextureLoader";

import { MeshPhongMaterial } from "node_modules/three/src/materials/MeshPhongMaterial";
import { CircleGeometry } from "node_modules/three/src/geometries/CircleGeometry";
import { CylinderGeometry } from "node_modules/three/src/geometries/CylinderGeometry";
import { Vector2 } from "node_modules/three/src/math/Vector2";
import { Vector3 } from "node_modules/three/src/math/Vector3";
import { Raycaster } from "node_modules/three/src/core/Raycaster";

import styles from "../styles/board.module.scss";
import SidePanel from "./sidePanel";

import bomb from "constants/esper/bomb.json";
import cactuar from "constants/esper/cactuar.json";
import golem from "constants/esper/golem.json";
import ifrit from "constants/esper/ifrit.json";
import malboro from "constants/esper/malboro.json";
import siren from "constants/esper/siren.json";
import zuu from "constants/esper/zuu.json";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.esperData = {};
    this.isGetEsperData = false;
    this.touchstartArea = 0;
    this.state = {
      activeMeshList: [],
      stockSp: 0,
      availableSp: 0,
      abilityMaxValues: [],
      mouseDown: false,
      touchMoving: false,
      mousedownPosition: {
        x: 0,
        y: 0,
      },
    };
    this.tick = this.tick.bind(this);
    this.moveTop = this.moveTop.bind(this);
    this.moveBottom = this.moveBottom.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.cameraPositionReset = this.cameraPositionReset.bind(this);
    this.activeAbilityReset = this.activeAbilityReset.bind(this);
    this.onMousedown = this.onMousedown.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.onMousemove = this.onMousemove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onTouchstart = this.onTouchstart.bind(this);
    this.onTouchend = this.onTouchend.bind(this);
    this.onTouchmove = this.onTouchmove.bind(this);
  }

  componentDidMount() {
    if (!this.isGetEsperData) {
      this.setEsperData();
      this.threeSetting();
    }

    window.addEventListener("mousedown", this.onMousedown, false);
    window.addEventListener("mouseup", this.onMouseup, false);
    window.addEventListener("mousemove", this.onMousemove, false);
    window.addEventListener("resize", this.onResize, false);
    window.addEventListener("wheel", this.onWheel, false);
    window.addEventListener("touchstart", this.onTouchstart, false);
    window.addEventListener("touchend", this.onTouchend, false);
    window.addEventListener("touchmove", this.onTouchmove, false);
  }

  componentDidUpdate() {
    if (!this.isGetEsperData) {
      this.setEsperData();
      this.threeSetting();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.onMousedown, false);
    window.removeEventListener("mouseup", this.onMouseup, false);
    window.removeEventListener("mousemove", this.onMousemove, false);
    window.removeEventListener("resize", this.onResize, false);
    window.removeEventListener("wheel", this.onWheel, false);
    window.removeEventListener("touchstart", this.onTouchstart, false);
    window.removeEventListener("touchend", this.onTouchend, false);
    window.removeEventListener("touchmove", this.onTouchmove, false);
  }

  setEsperData() {
    switch (this.props.esperId) {
      case "e1":
        this.esperData = siren;
        this.isGetEsperData = true;
        this.setState({
          stockSp: siren.availableSp,
          availableSp: siren.availableSp,
          abilityMaxValues: siren.abilityMaxValues,
        });
        return;
      case "e2":
        this.esperData = ifrit;
        this.isGetEsperData = true;
        this.setState({
          stockSp: ifrit.availableSp,
          availableSp: ifrit.availableSp,
          abilityMaxValues: ifrit.abilityMaxValues,
        });
        return;
      case "e3":
        this.esperData = golem;
        this.isGetEsperData = true;
        this.setState({
          stockSp: golem.availableSp,
          availableSp: golem.availableSp,
          abilityMaxValues: golem.abilityMaxValues,
        });
        return;
      case "e4":
        this.esperData = zuu;
        this.isGetEsperData = true;
        this.setState({
          stockSp: zuu.availableSp,
          availableSp: zuu.availableSp,
          abilityMaxValues: zuu.abilityMaxValues,
        });
        return;
      case "e5":
        this.esperData = bomb;
        this.isGetEsperData = true;
        this.setState({
          stockSp: bomb.availableSp,
          availableSp: bomb.availableSp,
          abilityMaxValues: bomb.abilityMaxValues,
        });
        return;
      case "e6":
        this.esperData = cactuar;
        this.isGetEsperData = true;
        this.setState({
          stockSp: cactuar.availableSp,
          availableSp: cactuar.availableSp,
          abilityMaxValues: cactuar.abilityMaxValues,
        });
        return;
      case "e7":
        this.esperData = malboro;
        this.isGetEsperData = true;
        this.setState({
          stockSp: malboro.availableSp,
          availableSp: malboro.availableSp,
          abilityMaxValues: malboro.abilityMaxValues,
        });
        return;
      default:
        this.esperData = siren;
        this.isGetEsperData = true;
        this.setState({
          stockSp: siren.availableSp,
          availableSp: siren.availableSp,
          abilityMaxValues: siren.abilityMaxValues,
        });
        return;
    }
  }

  threeSetting() {
    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    this.camera = new PerspectiveCamera(60, this.w / this.h, 1, 5000);
    this.camera.position.z = 2000; // カメラを遠ざける
    // レンダラーを作成
    this.renderer = new WebGLRenderer({
      canvas: document.querySelector("#myCanvas"),
      alpha: true,
    });

    const lablesWrap = document.querySelector("#lables");
    lablesWrap.style.width = `${this.w}px`;
    lablesWrap.style.height = `${this.h}px`;
    this.renderer.setSize(this.w, this.h); // 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio); // ピクセル比
    // シーンを作成
    this.scene = new Scene();

    this.mouse = new Vector2();

    // ライトを作成
    this.light = new PointLight(0xffffff);
    this.light.position.set(0, 0, 2000); // ライトの位置を設定

    // ライトをシーンに追加
    this.scene.add(this.light);

    // レイキャスト(クリック時のあたり判定用の光線)
    this.raycaster = new Raycaster();

    this.meshList = [];

    const geometry = new CircleGeometry(120, 6);
    const geometryFrame = new CircleGeometry(125, 6);
    const geometryBase = new CircleGeometry(130, 6);
    const lables = document.getElementById("lables");

    // 中心のhex作成 start
    this["hexGroup0"] = new Group();
    const loader = new TextureLoader();
    const material = new MeshPhongMaterial({ color: 0x962966 });
    const materialFrame = new MeshPhongMaterial({ color: 0xffffb5 });
    const materialBase = new MeshLambertMaterial({ color: 0xaa9258 });
    this["meshBase0"] = new Mesh(geometryBase, materialBase);
    this["meshBase0"].position.set(0, 0, 0);
    this["meshFrame0"] = new Mesh(geometryFrame, materialFrame);
    this["meshFrame0"].position.set(0, 0, 1);
    this["mesh0"] = new Mesh(geometry, material);
    this["mesh0"].meshId = "mesh0";
    this["mesh0"].position.set(0, 0, 2);
    this["hexGroup0"].add(this["mesh0"], this["meshFrame0"], this["meshBase0"]);
    this.scene.add(this["hexGroup0"]);

    const div = document.createElement("div");
    div.id = "mesh0";
    div.className = "hex";
    lables.appendChild(div);

    this.meshList.push(this["mesh0"]);
    // 中心のhex作成 end

    this.esperData.board.map((hexGroup) =>
      this.createHexs(hexGroup.row, hexGroup.direction, hexGroup.abilitys)
    );

    this.tick();
    this.resetDomPosition();
  }

  createHexs(row, direction, abilitys) {
    const geometry = new CircleGeometry(120, 6);
    const geometryFrame = new CircleGeometry(125, 6);
    const geometryBase = new CircleGeometry(130, 6);
    const lables = document.getElementById("lables");
    abilitys.forEach((ability, i) => {
      if (row === 0 && i === 0) return;
      if (row % 2 === 0 && !direction && i === 0) return;
      this[`hexGroup${ability.id}`] = new Group();
      const material = new MeshPhongMaterial({ color: 0x962966 });
      const materialFrame = new MeshPhongMaterial({ color: 0xffffb5 });
      const materialBase = new MeshLambertMaterial({ color: 0xaa9258 });

      const positionX = direction
        ? 325 * i + (row % 2 === 0 ? 0 : 162.5)
        : -(325 * i + (row % 2 === 0 ? 0 : 162.5));
      const positionY = 281.5 * row;

      this[`meshBase${ability.id}`] = new Mesh(geometryBase, materialBase);
      this[`meshBase${ability.id}`].position.set(positionX, positionY, 0);
      this[`meshFrame${ability.id}`] = new Mesh(geometryFrame, materialFrame);
      this[`meshFrame${ability.id}`].position.set(positionX, positionY, 1);
      this[`mesh${ability.id}`] = new Mesh(geometry, material);
      this[`mesh${ability.id}`].meshId = `mesh${ability.id}`;
      this[`mesh${ability.id}`].sp = ability.sp;
      this[`mesh${ability.id}`].abilityType = ability.abilityType;
      this[`mesh${ability.id}`].abilityTypeLabel = ability.abilityTypeLabel;
      this[`mesh${ability.id}`].value = ability.value;
      this[`mesh${ability.id}`].level = ability?.level;
      this[`mesh${ability.id}`].childrenHexs = ability.childrenHexs;
      this[`mesh${ability.id}`].parentHexs = ability.parentHexs;
      this[`mesh${ability.id}`].disabled = false;
      this[`mesh${ability.id}`].active = false;
      this[`mesh${ability.id}`].position.set(positionX, positionY, 2);
      this[`hexGroup${ability.id}`].add(
        this[`mesh${ability.id}`],
        this[`meshFrame${ability.id}`],
        this[`meshBase${ability.id}`]
      );
      this.scene.add(this[`hexGroup${ability.id}`]);

      const div =
        document.getElementById(`mesh${ability.id}`) ||
        document.createElement("div");
      div.innerHTML = `<div class="hexTexts">
        <span class="sp">${ability.sp} SP</span>
        <span class="abilityName">${ability.lable}</span>
      </div>`;
      div.id = `mesh${ability.id}`;
      div.className = "hex";
      lables.appendChild(div);

      this.createBranch(positionX, positionY, ability.corner);

      this.meshList.push(this[`mesh${ability.id}`]);
    });
  }

  createBranch(x, y, corner) {
    let positionX = 0;
    let positionY = 0;
    let rotationZ = 0;
    switch (corner) {
      case 1:
        positionX = 80 + x;
        positionY = 140 + y;
        rotationZ = -Math.PI / 6;
        break;
      case 2:
        positionX = 160 + x;
        positionY = y;
        rotationZ = Math.PI / 2;
        break;
      case 3:
        positionX = 80 + x;
        positionY = -140 + y;
        rotationZ = Math.PI / 6;
        break;
      case 4:
        positionX = -80 + x;
        positionY = -140 + y;
        rotationZ = -Math.PI / 6;
        break;
      case 5:
        positionX = -160 + x;
        positionY = y;
        rotationZ = -Math.PI / 2;
        break;
      case 6:
        positionX = -80 + x;
        positionY = 140 + y;
        rotationZ = Math.PI / 6;
        break;
      default:
        positionX = x;
        positionY = y;
        rotationZ = 0;
    }

    this[`cylinder${x}_${y}_${corner}`] = new Mesh(
      new CylinderGeometry(5, 5, 70, 50),
      new MeshLambertMaterial({ color: 0xffffff })
    );
    this[`cylinder${x}_${y}_${corner}`].position.set(positionX, positionY, -2);
    this[`cylinder${x}_${y}_${corner}`].rotation.set(0, 0, rotationZ);
    this.scene.add(this[`cylinder${x}_${y}_${corner}`]);
  }

  tick() {
    requestAnimationFrame(this.tick);
    // レンダリング
    this.renderer.render(this.scene, this.camera);
  }

  disabledCheck() {
    const { stockSp } = this.state;
    this.meshList.map((mesh) => {
      if (mesh.id !== "mesh0" && !mesh.active && mesh.sp > stockSp) {
        mesh.material.color.setHex(0x555555);
        mesh.disabled = true;
      } else if (mesh.disabled && mesh.sp <= stockSp) {
        mesh.material.color.setHex(0x962966);
        mesh.disabled = false;
      }
    });
  }

  transitionColorChange(targetMesh, beforeColor, afterColor) {
    const step = 20;
    let count = 1;
    let beforeRed = parseInt(beforeColor.slice(0, 2), 16);
    let beforeGreen = parseInt(beforeColor.slice(2, 4), 16);
    let beforeBlue = parseInt(beforeColor.slice(4, 6), 16);

    const afterRed = parseInt(afterColor.slice(0, 2), 16);
    const afterGreen = parseInt(afterColor.slice(2, 4), 16);
    const afterBlue = parseInt(afterColor.slice(4, 6), 16);

    const diffRed = Math.abs(beforeRed - afterRed);
    const diffGreen = Math.abs(beforeGreen - afterGreen);
    const diffBlue = Math.abs(beforeBlue - afterBlue);

    const setIntervalId = setInterval(() => {
      if (step === count) clearInterval(setIntervalId);
      if (beforeRed > afterRed) {
        beforeRed = beforeRed - diffRed / step;
      } else {
        beforeRed = beforeRed + diffRed / step;
      }

      if (beforeGreen > afterGreen) {
        beforeGreen = beforeGreen - diffGreen / step;
      } else {
        beforeGreen = beforeGreen + diffGreen / step;
      }

      if (beforeBlue > afterBlue) {
        beforeBlue = beforeBlue - diffBlue / step;
      } else {
        beforeBlue = beforeBlue + diffBlue / step;
      }
      const roundRed = Math.round(beforeRed);
      const roundGreen = Math.round(beforeGreen);
      const roundBlue = Math.round(beforeBlue);
      const colorCode = `0x${roundRed.toString(16)}${roundGreen.toString(
        16
      )}${roundBlue.toString(16)}`;
      targetMesh.material.color.setHex(colorCode);
      count++;
    }, 20);
  }

  setActiveMesh(targetMesh) {
    const { activeMeshList } = this.state;
    return new Promise((resolve) => {
      if (!targetMesh.active && targetMesh.sp < this.state.stockSp) {
        targetMesh.active = true;
        const newMeshList = [...activeMeshList, targetMesh];
        this.setState({
          activeMeshList: newMeshList,
          stockSp: this.state.stockSp - targetMesh.sp,
        });
        this.transitionColorChange(targetMesh, "962966", "B0A341");
        this.disabledCheck();
        resolve("accept");
      } else if (targetMesh.active) {
        resolve("accept");
      } else {
        resolve("reject");
      }
    });
  }

  removeActiveMesh(targetMesh) {
    const { activeMeshList, stockSp } = this.state;
    if (targetMesh.active) {
      targetMesh.active = false;
      const newMeshList = activeMeshList.filter(
        (mesh) => mesh.meshId !== targetMesh.meshId
      );
      this.setState({
        activeMeshList: newMeshList,
        stockSp: stockSp + targetMesh.sp,
      });
      targetMesh.material.color.setHex(0x962966);
      this.disabledCheck();
    }
  }

  onMousedown(e) {
    if (!this.isGetEsperData) return;

    this.setState({
      mouseDown: true,
      mousedownPosition: {
        x: e.pageX,
        y: e.pageY,
      },
    });

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
    this.mouse.x = (x / window.innerWidth) * 2 - 1;
    this.mouse.y = -(y / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // 光線と交わるオブジェクトを収集
    const intersects = this.raycaster.intersectObjects(this.meshList);
    // 交わるオブジェクトが１個以上の場合
    if (intersects.length > 0) {
      const targetMesh = intersects[0].object;
      let isContinued = true;
      if (!targetMesh.disabled && !targetMesh.active) {
        // 条件により選択状態にする
        targetMesh.childrenHexs.forEach((childId, index) => {
          const targetChild = this.meshList.find(
            (mesh) => mesh.meshId === `mesh${childId}`
          );
          setTimeout(async () => {
            const result = isContinued
              ? await this.setActiveMesh(targetChild)
              : "reject";
            if (result === "reject") isContinued = false;
          }, 100 * index);
        });
        if (isContinued) {
          setTimeout(async () => {
            isContinued ? await this.setActiveMesh(targetMesh) : null;
          }, 100 * targetMesh.childrenHexs.length);
        }
      } else if (!targetMesh.disabled && targetMesh.active) {
        // 条件により未選択状態にする
        if (targetMesh.parentHexs.length > 0) {
          for (const childId of targetMesh.parentHexs) {
            this.removeActiveMesh(
              this.meshList.find((mesh) => mesh.meshId === `mesh${childId}`)
            );
          }
        }
        this.removeActiveMesh(targetMesh);
      }
    }
  }

  onMouseup() {
    if (!this.isGetEsperData) return;
    this.setState({
      mouseDown: false,
      mousedownPosition: {
        x: 0,
        y: 0,
      },
    });
  }

  movePosition(x, y) {
    const { mousedownPosition } = this.state;
    this.moveCamera2D(
      -((x - mousedownPosition.x) / 2),
      (y - mousedownPosition.y) / 2
    );
    // 基準点の更新
    setTimeout(() => {
      this.setState({
        mousedownPosition: {
          x: x,
          y: y,
        },
      });
    }, 500);
    this.resetDomPosition();
  }

  onMousemove(e) {
    if (e.target.id !== "lables" || !this.isGetEsperData) return;
    const { mouseDown } = this.state;
    if (mouseDown) {
      this.movePosition(e.pageX, e.pageY);
    } else {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      //マウス座標3D変換 width（横）やheight（縦）は画面サイズ
      this.mouse.x = (x / window.innerWidth) * 2 - 1;
      this.mouse.y = -(y / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      // // 光線と交わるオブジェクトを収集
      const intersects = this.raycaster.intersectObjects(this.meshList);

      this.meshList.map((mesh) => {
        if (mesh.meshId === "mesh0") return;
        // 交差しているオブジェクトが1つ以上存在し、
        // 交差しているオブジェクトの1番目(最前面)のものだったら
        // 選択不可のものではないなら
        if (
          intersects.length > 0 &&
          mesh === intersects[0].object &&
          !mesh.disabled
        ) {
          // マウスオーバー時の色
          mesh.material.color.setHex(0xf48bc7);
          const meshDom = document.getElementById(mesh.meshId);
          meshDom.firstChild.style.transform = "scale(1.4)";
        } else if (mesh.active) {
          mesh.material.color.setHex(0xb0a341);
          const meshDom = document.getElementById(mesh.meshId);
          meshDom.firstChild.style.transform = "scale(1)";
        } else if (mesh.disabled) {
          mesh.material.color.setHex(0x555555);
        } else {
          // それ以外は元の色にする
          mesh.material.color.setHex(0x962966);
          const meshDom = document.getElementById(mesh.meshId);
          meshDom.firstChild.style.transform = "scale(1)";
        }
      });
    }
  }

  onResize() {
    this.threeSetting();
  }

  onWheel(e) {
    this.moveCamera("z", -e.wheelDelta);
    this.resetDomPosition();
  }

  onTouchstart(e) {
    e.preventDefault();
    const touchObject = e.changedTouches[0];
    const { touchMoving } = this.state;

    if (!this.isGetEsperData || !touchMoving) return;
    this.setState({
      mouseDown: true,
      mousedownPosition: {
        x: touchObject.pageX,
        y: touchObject.pageY,
      },
    });
    // 2本指(ピンチイン/ピンチアウト)の時
    if (e.touches.length > 1) {
      e.preventDefault();
      //絶対値を取得
      const touchstartWidth = Math.abs(e.touches[1].pageX - e.touches[0].pageX);
      const touchstartHeight = Math.abs(
        e.touches[1].pageY - e.touches[0].pageY
      );
      //はじめに2本指タッチした時の面積
      this.touchstartArea = touchstartWidth * touchstartHeight;
    }
  }

  onTouchend() {
    e.preventDefault();
    if (!this.isGetEsperData) return;
    this.setState({
      mouseDown: false,
      mousedownPosition: {
        x: 0,
        y: 0,
      },
      touchMoving: false,
    });
  }

  onTouchmove(e) {
    e.preventDefault();
    const { mouseDown } = this.state;
    const touchObject = e.changedTouches[0];
    this.setState({ touchMoving: true });
    if (e.target.id !== "lables" || !this.isGetEsperData) return;
    if (mouseDown) this.movePosition(touchObject.pageX, touchObject.pageY);

    // 2本指(ピンチイン/ピンチアウト)の時
    if (e.touches.length > 1) {
      e.preventDefault();
      //絶対値を取得
      const touchmoveWidth = Math.abs(e.touches[1].pageX - e.touches[0].pageX);
      const touchmoveHeight = Math.abs(e.touches[1].pageY - e.touches[0].pageY);
      //ムーブした時の面積
      const touchmoveArea = touchmoveWidth * touchmoveHeight;
      //はじめに2タッチ面積からムーブした時の面積を引く
      const areaAbsoluteValue = this.touchstartArea - touchmoveArea;
      if (areaAbsoluteValue < 0) {
        //拡大する
        this.moveCamera("z", 100);
        this.resetDomPosition();
      } else if (areaAbsoluteValue > 0) {
        //縮小する
        this.moveCamera("z", -100);
        this.resetDomPosition();
      }
    }
  }

  resetDomPosition() {
    const tempV = new Vector3();
    const canvas = document.querySelector("#myCanvas");
    return new Promise((resolve) => {
      this.meshList.map((mesh) => {
        const meshDom = document.getElementById(mesh.meshId);
        const worldPosition = mesh.getWorldPosition(tempV);
        const projection = worldPosition.project(this.camera);
        const sx = (canvas.clientWidth / 2) * (+projection.x + 1.0);
        const sy = (canvas.clientHeight / 2) * (-projection.y + 1.0);
        meshDom.style.top = `${sy - 12}px`;
        meshDom.style.left = `${sx - meshDom.clientWidth / 2}px`;
      });
      resolve("resolved");
    });
  }

  moveCamera2D(x, y) {
    return new Promise((resolve) => {
      this.camera.position.x += x;
      this.camera.position.y += y;
      this.renderer.render(this.scene, this.camera);
      resolve("resolved");
    });
  }

  moveCamera(vector, number) {
    return new Promise((resolve) => {
      this.camera.position[vector] += number;
      this.renderer.render(this.scene, this.camera);
      resolve("resolved");
    });
  }

  zoomIn() {
    this.moveCamera("z", -1000);
    this.resetDomPosition();
  }

  zoomOut() {
    this.moveCamera("z", +1000);
    this.resetDomPosition();
  }

  moveRight() {
    this.moveCamera("x", 1000);
    this.resetDomPosition();
  }

  moveLeft() {
    this.moveCamera("x", -1000);
    this.resetDomPosition();
  }

  moveTop() {
    this.moveCamera("y", 1000);
    this.resetDomPosition();
  }

  moveBottom() {
    this.moveCamera("y", -1000);
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
    this.meshList.map((mesh) => {
      mesh.active = false;
      mesh.disabled = false;
      mesh.material.color.setHex(0x962966);
    });
    this.setState({
      activeMeshList: [],
      stockSp: 652,
    });
  }

  sumActiveAbilityArray() {
    const { activeMeshList, abilityMaxValues } = this.state;
    const result = [];
    if (activeMeshList.length === 0) {
      result.push({
        abilityType: "",
        abilityTypeLabel: "",
        value: 0,
        level: 0,
        maxValue: 0,
      });
    } else {
      activeMeshList.forEach((activeMesh) => {
        const index = result.findIndex(
          (r) => r.abilityType === activeMesh.abilityType
        );
        const maxValue = abilityMaxValues.find(
          (ability) => ability.type === activeMesh.abilityType
        ).value;
        if (index > -1) {
          if (
            activeMesh.abilityType === "boostEvocationDamage" &&
            result[index].level < activeMesh.level
          ) {
            result[index].level = activeMesh.level;
            result[index].value += activeMesh.value;
          } else {
            result[index].value += activeMesh.value;
          }
        } else {
          result.push({
            abilityType: activeMesh.abilityType,
            abilityTypeLabel: activeMesh.abilityTypeLabel,
            value: activeMesh.value,
            level: activeMesh.level,
            maxValue,
          });
        }
      });
    }
    return result;
  }

  render() {
    const { stockSp, availableSp } = this.state;

    return (
      <div id="board" className={styles.board}>
        <div className={styles.panel}>
          <SidePanel
            stockSp={stockSp}
            availableSp={availableSp}
            sumActiveAbilityArray={this.sumActiveAbilityArray()}
            activeAbilityReset={this.activeAbilityReset}
            cameraPositionReset={this.cameraPositionReset}
            zoomIn={this.zoomIn}
            zoomOut={this.zoomOut}
            moveTop={this.moveTop}
            moveBottom={this.moveBottom}
            moveLeft={this.moveLeft}
            moveRight={this.moveRight}
          />
        </div>
        <div>
          <canvas id="myCanvas" className={styles.myCanvas}></canvas>
          <div id="lables" className={styles.lables}></div>
        </div>
      </div>
    );
  }
}
export default Board;
