/**
 * @file Picking Proxy
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */

import { Vector3, Matrix4 } from 'three'

import Stage from '../stage/stage'
import MouseObserver from '../stage/mouse-observer'
import { Picker } from '../utils/picker'
import ViewerControls from './viewer-controls'
import Shape from '../geometry/shape'
import Structure from '../structure/structure'
import BondProxy from '../proxy/bond-proxy'
import AtomProxy from '../proxy/atom-proxy'
import Surface from '../surface/surface'
import Volume from '../surface/volume'
import Unitcell from '../symmetry/unitcell'

interface ShapePrimitive {
  name: string
  shape: Shape
}

function closer (x: Vector3, a: Vector3, b: Vector3) {
  return x.distanceTo(a) < x.distanceTo(b)
}

/**
 * Picking data object.
 * @typedef {Object} PickingData - picking data
 * @property {Number} [pid] - picking id
 * @property {Object} [instance] - instance data
 * @property {Integer} instance.id - instance id
 * @property {String|Integer} instance.name - instance name
 * @property {Matrix4} instance.matrix - transformation matrix of the instance
 * @property {Picker} [picker] - picker object
 */

interface InstanceData {
  id: number
  name: number|string
  matrix: Matrix4
}

interface PickingData {
  pid: number
  instance: InstanceData
  picker: Picker
}

/**
 * Picking proxy class.
 */
class PickingProxy {
  pid: number
  picker: Picker
  instance: InstanceData
  controls: ViewerControls
  mouse: MouseObserver

  /**
   * Create picking proxy object
   * @param  {PickingData} pickingData - picking data
   * @param  {Stage} stage - stage object
   */
  constructor (pickingData: PickingData, readonly stage: Stage) {
    this.pid = pickingData.pid
    this.picker = pickingData.picker

    /**
     * @type {Object}
     */
    this.instance = pickingData.instance

    /**
     * @type {Stage}
     */
    this.stage = stage
    /**
     * @type {ViewerControls}
     */
    this.controls = stage.viewerControls
    /**
     * @type {MouseObserver}
     */
    this.mouse = stage.mouseObserver
  }

  /**
   * Kind of the picked data
   * @type {String}
   */
  get type () { return this.picker.type }

  /**
   * If the `alt` key was pressed
   * @type {Boolean}
   */
  get altKey () { return this.mouse.altKey }
  /**
   * If the `ctrl` key was pressed
   * @type {Boolean}
   */
  get ctrlKey () { return this.mouse.ctrlKey }
  /**
   * If the `meta` key was pressed
   * @type {Boolean}
   */
  get metaKey () { return this.mouse.metaKey }
  /**
   * If the `shift` key was pressed
   * @type {Boolean}
   */
  get shiftKey () { return this.mouse.shiftKey }

  /**
   * Position of the mouse on the canvas
   * @type {Vector2}
   */
  get canvasPosition () { return this.mouse.canvasPosition }

  /**
   * The component the picked data is part of
   * @type {Component}
   */
  get component () {
    return this.stage.getComponentsByObject(this.picker.data as any).list[ 0 ]  // TODO
  }

  /**
   * The picked object data
   * @type {Object}
   */
  get object () {
    return this.picker.getObject(this.pid)
  }

  /**
   * The 3d position in the scene of the picked object
   * @type {Vector3}
   */
  get position () {
    return this.picker.getPosition(this.pid, this.instance, this.component)
  }

  /**
   * The atom of a picked bond that is closest to the mouse
   * @type {AtomProxy}
   */
  get closestBondAtom () {
    if (this.type !== 'bond' || !this.bond) return undefined

    const bond = this.bond
    const controls = this.controls
    const cp = this.canvasPosition

    const acp1 = controls.getPositionOnCanvas(bond.atom1 as any)  // TODO
    const acp2 = controls.getPositionOnCanvas(bond.atom2 as any)  // TODO

    return closer(cp as any, acp1, acp2) ? bond.atom1 : bond.atom2
  }

  /**
   * @type {Object}
   */
  get arrow () { return this._objectIfType('arrow') as ShapePrimitive }
  /**
   * @type {AtomProxy}
   */
  get atom () { return this._objectIfType('atom') as AtomProxy }
  /**
   * @type {Object}
   */
  get axes () { return this._objectIfType('axes') }
  /**
   * @type {BondProxy}
   */
  get bond () { return this._objectIfType('bond') as BondProxy }
  /**
   * @type {Object}
   */
  get box () { return this._objectIfType('box') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get cone () { return this._objectIfType('cone') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get clash () { return this._objectIfType('clash') as { clash: { sele1: string, sele2: string } } }
  /**
   * @type {BondProxy}
   */
  get contact () { return this._objectIfType('contact') as BondProxy }
  /**
   * @type {Object}
   */
  get cylinder () { return this._objectIfType('cylinder') as ShapePrimitive }
  /**
   * @type {BondProxy}
   */
  get distance () { return this._objectIfType('distance') as BondProxy }
  /**
   * @type {Object}
   */
  get ellipsoid () { return this._objectIfType('ellipsoid') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get octahedron () { return this._objectIfType('octahedron') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get mesh () { return this._objectIfType('mesh') as { name: string, shape: Shape, serial: number } }
  /**
   * @type {Object}
   */
  get slice () { return this._objectIfType('slice') as { volume: Volume, value: number } }
  /**
   * @type {Object}
   */
  get sphere () { return this._objectIfType('sphere') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get tetrahedron () { return this._objectIfType('tetrahedron') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get torus () { return this._objectIfType('torus') as ShapePrimitive }
  /**
   * @type {Object}
   */
  get surface () { return this._objectIfType('surface') as { surface: Surface, index: number } }
  /**
   * @type {Object}
   */
  get unitcell () { return this._objectIfType('unitcell') as { unitcell: Unitcell, structure: Structure } }
  /**
   * @type {Object}
   */
  get unknown () { return this._objectIfType('unknown') }
  /**
   * @type {Object}
   */
  get volume () { return this._objectIfType('volume') as { volume: Volume, value: number } }

  _objectIfType (type: string) {
    return this.type === type ? this.object : undefined
  }

  getLabel () {
    let msg = 'nothing'
    if (this.arrow) {
      msg = 'arrow: ' + (this.arrow.name || this.pid) + ' (' + this.arrow.shape.name + ')'
    } else if (this.atom) {
      msg = 'atom: ' +
              this.atom.qualifiedName() +
              ' (' + this.atom.structure.name + ')'
    } else if (this.axes) {
      msg = 'axes'
    } else if (this.bond) {
      msg = 'bond: ' +
              this.bond.atom1.qualifiedName() + ' - ' + this.bond.atom2.qualifiedName() +
              ' (' + this.bond.structure.name + ')'
    } else if (this.box) {
      msg = 'box: ' + (this.box.name || this.pid) + ' (' + this.box.shape.name + ')'
    } else if (this.cone) {
      msg = 'cone: ' + (this.cone.name || this.pid) + ' (' + this.cone.shape.name + ')'
    } else if (this.clash) {
      msg = 'clash: ' + this.clash.clash.sele1 + ' - ' + this.clash.clash.sele2
    } else if (this.contact) {
      msg = 'contact: ' +
              this.contact.atom1.qualifiedName() + ' - ' + this.contact.atom2.qualifiedName() +
              ' (' + this.contact.structure.name + ')'
    } else if (this.cylinder) {
      msg = 'cylinder: ' + (this.cylinder.name || this.pid) + ' (' + this.cylinder.shape.name + ')'
    } else if (this.distance) {
      msg = 'distance: ' +
              this.distance.atom1.qualifiedName() + ' - ' + this.distance.atom2.qualifiedName() +
              ' (' + this.distance.structure.name + ')'
    } else if (this.ellipsoid) {
      msg = 'ellipsoid: ' + (this.ellipsoid.name || this.pid) + ' (' + this.ellipsoid.shape.name + ')'
    } else if (this.octahedron) {
      msg = 'octahedron: ' + (this.octahedron.name || this.pid) + ' (' + this.octahedron.shape.name + ')'
    } else if (this.mesh) {
      msg = 'mesh: ' + (this.mesh.name || this.mesh.serial) + ' (' + this.mesh.shape.name + ')'
    } else if (this.slice) {
      msg = 'slice: ' +
              this.slice.value.toPrecision(3) +
              ' (' + this.slice.volume.name + ')'
    } else if (this.sphere) {
      msg = 'sphere: ' + (this.sphere.name || this.pid) + ' (' + this.sphere.shape.name + ')'
    } else if (this.surface) {
      msg = 'surface: ' + this.surface.surface.name
    } else if (this.tetrahedron) {
      msg = 'tetrahedron: ' + (this.tetrahedron.name || this.pid) + ' (' + this.tetrahedron.shape.name + ')'
    } else if (this.torus) {
      msg = 'torus: ' + (this.torus.name || this.pid) + ' (' + this.torus.shape.name + ')'
    } else if (this.unitcell) {
      msg = 'unitcell: ' +
              this.unitcell.unitcell.spacegroup +
              ' (' + this.unitcell.structure.name + ')'
    } else if (this.unknown) {
      msg = 'unknown'
    } else if (this.volume) {
      msg = 'volume: ' +
              this.volume.value.toPrecision(3) +
              ' (' + this.volume.volume.name + ')'
    }
    return msg
  }
}

export default PickingProxy