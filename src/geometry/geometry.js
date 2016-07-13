/**
 * @file Geometry
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 * @private
 */


import { defaults } from "../utils.js";
import MeshBuffer from "../buffer/mesh-buffer.js";
import SphereBuffer from "../buffer/sphere-buffer.js";
import CylinderBuffer from "../buffer/cylinder-buffer.js";
import ConeBuffer from "../buffer/cone-buffer.js";
import ArrowBuffer from "../buffer/arrow-buffer.js";


/**
 * Class for building custom geometries.
 * @class
 * @example
 * var geometry = new NGL.Geometry( "geo", { disableImpostor: true } );
 * geometry.addSphere( [ 0, 0, 9 ], [ 1, 0, 0 ], 1.5 );
 * geometry.addEllipsoid( [ 6, 0, 0 ], [ 1, 0, 0 ], 1.5, [ 3, 0, 0 ], [ 0, 2, 0 ] );
 * geometry.addCylinder( [ 0, 2, 7 ], [ 0, 0, 9 ], [ 1, 1, 0 ], 0.5 );
 * geometry.addCone( [ 0, 2, 7 ], [ 0, 3, 3 ], [ 1, 1, 0 ], 1.5 );
 * geometry.addArrow( [ 1, 2, 7 ], [ 30, 3, 3 ], [ 1, 0, 1 ], 1.0 );
 * var geoComp = stage.addComponentFromObject( geometry );
 * geoComp.addRepresentation( "buffer" );
 *
 * @param {String} name - name
 * @param {Object} params - parameter object
 * @param {Integer} params.aspectRatio - arrow aspect ratio, used for cylinder radius and cone length
 * @param {Integer} params.sphereDetail - sphere quality (icosahedron subdivisions)
 * @param {Integer} params.radialSegments - cylinder quality (number of segments)
 * @param {Boolean} params.disableImpostor - disable use of raycasted impostors for rendering
 * @param {Boolean} params.openEnded - capped or not
 */
function Geometry( name, params ){

    this.name = defaults( name, "geometry" );

    var p = params || {};

    var aspectRatio = defaults( p.aspectRatio, 1.5 );
    var sphereDetail = defaults( p.sphereDetail, 2 );
    var radialSegments = defaults( p.radialSegments, 50 );
    var disableImpostor = defaults( p.disableImpostor, false );
    var openEnded = defaults( p.openEnded, false );

    var bufferList = [];

    var spherePosition = [];
    var sphereColor = [];
    var sphereRadius = [];

    var ellipsoidPosition = [];
    var ellipsoidColor = [];
    var ellipsoidRadius = [];
    var ellipsoidMajorAxis = [];
    var ellipsoidMinorAxis = [];

    var cylinderFrom = [];
    var cylinderTo = [];
    var cylinderColor = [];
    var cylinderRadius = [];

    var coneFrom = [];
    var coneTo = [];
    var coneColor = [];
    var coneRadius = [];

    var arrowFrom = [];
    var arrowTo = [];
    var arrowColor = [];
    var arrowRadius = [];

    function addElement( elm, array ){

        if( elm.toArray !== undefined ){
            elm = elm.toArray();
        }
        array.push.apply( array, elm );

    }

    /**
     * Add a buffer
     * @instance
     * @memberof Geometry
     * @param {Buffer} buffer - buffer object
     */
    function addBuffer( buffer ){

        bufferList.push( buffer );

    }

    /**
     * Add a mesh
     * @instance
     * @memberof Geometry
     * @param {Float32Array|Array} position - positions
     * @param {Float32Array|Array} color - colors
     * @param {Uint32Array|Uint16Array|Array} index - indices
     * @param {Float32Array|Array} normal - normals
     */
    function addMesh( position, color, index, normal ){

        var meshBuffer = new MeshBuffer( position, color, index, normal );
        bufferList.push( meshBuffer );

    }

    /**
     * Add a sphere
     * @instance
     * @memberof Geometry
     * @example
     * geometry.addSphere( [ 0, 0, 9 ], [ 1, 0, 0 ], 1.5 );
     *
     * @param {Vector3|Array} position - position vector or array
     * @param {Color|Array} color - color object or array
     * @param {Float} radius - radius value
     */
    function addSphere( position, color, radius ){

        addElement( position, spherePosition );
        addElement( color, sphereColor );
        sphereRadius.push( radius );

    }

    /**
     * Add an ellipsoid
     * @instance
     * @memberof Geometry
     * @example
     * geometry.addEllipsoid( [ 6, 0, 0 ], [ 1, 0, 0 ], 1.5, [ 3, 0, 0 ], [ 0, 2, 0 ] );
     *
     * @param {Vector3|Array} position - position vector or array
     * @param {Color|Array} color - color object or array
     * @param {Float} radius - radius value
     * @param {Vector3|Array} majorAxis - major axis vector or array
     * @param {Vector3|Array} minorAxis - minor axis vector or array
     */
    function addEllipsoid( position, color, radius, majorAxis, minorAxis ){

        addElement( position, ellipsoidPosition );
        addElement( color, ellipsoidColor );
        ellipsoidRadius.push( radius );
        addElement( majorAxis, ellipsoidMajorAxis );
        addElement( minorAxis, ellipsoidMinorAxis );

    }

    /**
     * Add a cylinder
     * @instance
     * @memberof Geometry
     * @example
     * geometry.addCylinder( [ 0, 2, 7 ], [ 0, 0, 9 ], [ 1, 1, 0 ], 0.5 );
     *
     * @param {Vector3|Array} from - from position vector or array
     * @param {Vector3|Array} to - to position vector or array
     * @param {Color|Array} color - color object or array
     * @param {Float} radius - radius value
     */
    function addCylinder( from, to, color, radius ){

        addElement( from, cylinderFrom );
        addElement( to, cylinderTo );
        addElement( color, cylinderColor );
        cylinderRadius.push( radius );

    }

    /**
     * Add a cone
     * @instance
     * @memberof Geometry
     * @example
     * geometry.addCone( [ 0, 2, 7 ], [ 0, 3, 3 ], [ 1, 1, 0 ], 1.5 );
     *
     * @param {Vector3|Array} from - from position vector or array
     * @param {Vector3|Array} to - to position vector or array
     * @param {Color|Array} color - color object or array
     * @param {Float} radius - radius value
     */
    function addCone( from, to, color, radius ){

        addElement( from, coneFrom );
        addElement( to, coneTo );
        addElement( color, coneColor );
        coneRadius.push( radius );

    }

    /**
     * Add an arrow
     * @instance
     * @memberof Geometry
     * @example
     * geometry.addArrow( [ 0, 2, 7 ], [ 0, 0, 9 ], [ 1, 1, 0 ], 0.5 );
     *
     * @param {Vector3|Array} from - from position vector or array
     * @param {Vector3|Array} to - to position vector or array
     * @param {Color|Array} color - color object or array
     * @param {Float} radius - radius value
     */
    function addArrow( from, to, color, radius ){

        addElement( from, arrowFrom );
        addElement( to, arrowTo );
        addElement( color, arrowColor );
        arrowRadius.push( radius );

    }

    function getBufferList(){

        var buffers = [];

        if( spherePosition.length ){
            var sphereBuffer = new NGL.SphereBuffer(
                new Float32Array( spherePosition ),
                new Float32Array( sphereColor ),
                new Float32Array( sphereRadius ),
                undefined,  // pickingColor
                {
                    sphereDetail: sphereDetail,
                    disableImpostor: disableImpostor
                }
            );
            buffers.push( sphereBuffer );
        }

        if( ellipsoidPosition.length ){
            var ellipsoidBuffer = new NGL.EllipsoidBuffer(
                new Float32Array( ellipsoidPosition ),
                new Float32Array( ellipsoidColor ),
                new Float32Array( ellipsoidRadius ),
                new Float32Array( ellipsoidMajorAxis ),
                new Float32Array( ellipsoidMinorAxis ),
                undefined,  // pickingColor
                {
                    sphereDetail: sphereDetail,
                    disableImpostor: disableImpostor
                }
            );
            buffers.push( ellipsoidBuffer );
        }

        if( cylinderFrom.length ){
            var cylinderBuffer = new NGL.CylinderBuffer(
                new Float32Array( cylinderFrom ),
                new Float32Array( cylinderTo ),
                new Float32Array( cylinderColor ),
                new Float32Array( cylinderColor ),
                new Float32Array( cylinderRadius ),
                undefined,  // pickingColor
                undefined,  // pickingColor2
                {
                    radialSegments: radialSegments,
                    disableImpostor: disableImpostor,
                    openEnded: openEnded,
                }
            );
            buffers.push( cylinderBuffer );
        }

        if( coneFrom.length ){
            var coneBuffer = new NGL.ConeBuffer(
                new Float32Array( coneFrom ),
                new Float32Array( coneTo ),
                new Float32Array( coneColor ),
                new Float32Array( coneRadius ),
                undefined,  // pickingColor
                {
                    radialSegments: radialSegments,
                    disableImpostor: disableImpostor,
                    openEnded: openEnded,
                }
            );
            buffers.push( coneBuffer );
        }

        if( arrowFrom.length ){
            var arrowBuffer = new NGL.ArrowBuffer(
                new Float32Array( arrowFrom ),
                new Float32Array( arrowTo ),
                new Float32Array( arrowColor ),
                new Float32Array( arrowRadius ),
                undefined,  // pickingColor
                {
                    aspectRatio: aspectRatio,
                    radialSegments: radialSegments,
                    disableImpostor: disableImpostor,
                    openEnded: openEnded,
                }
            );
            buffers.push( arrowBuffer );
        }

        return bufferList.concat( buffers );

    }

    function dispose(){

        bufferList.forEach( function( buffer ){
            buffer.dispose();
        } );
        bufferList.length = 0;

        spherePosition.length = 0;
        sphereColor.length = 0;
        sphereRadius.length = 0;

        ellipsoidPosition.length = 0;
        ellipsoidColor.length = 0;
        ellipsoidRadius.length = 0;
        ellipsoidMajorAxis.length = 0;
        ellipsoidMinorAxis.length = 0;

        cylinderFrom.length = 0;
        cylinderTo.length = 0;
        cylinderColor.length = 0;
        cylinderRadius.length = 0;

        coneFrom.length = 0;
        coneTo.length = 0;
        coneColor.length = 0;
        coneRadius.length = 0;

        arrowFrom.length = 0;
        arrowTo.length = 0;
        arrowColor.length = 0;
        arrowRadius.length = 0;

    }

    // API

    this.addBuffer = addBuffer;
    this.addMesh = addMesh;
    this.addSphere = addSphere;
    this.addEllipsoid = addEllipsoid;
    this.addCylinder = addCylinder;
    this.addCone = addCone;
    this.addArrow = addArrow;
    this.getBufferList = getBufferList;
    this.dispose = dispose;

}

Geometry.prototype.constructor = Geometry;
Geometry.prototype.type = "Geometry";


export default Geometry;
