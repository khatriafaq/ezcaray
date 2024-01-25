exports.id = 7069;
exports.ids = [7069];
exports.modules = {

/***/ 50535:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertSecretKeyToX25519 = exports.convertPublicKeyToX25519 = exports.verify = exports.sign = exports.extractPublicKeyFromSecretKey = exports.generateKeyPair = exports.generateKeyPairFromSeed = exports.SEED_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.SIGNATURE_LENGTH = void 0;
/**
 * Package ed25519 implements Ed25519 public-key signature algorithm.
 */
const random_1 = __webpack_require__(53412);
const sha512_1 = __webpack_require__(99912);
const wipe_1 = __webpack_require__(60318);
exports.SIGNATURE_LENGTH = 64;
exports.PUBLIC_KEY_LENGTH = 32;
exports.SECRET_KEY_LENGTH = 64;
exports.SEED_LENGTH = 32;
// Returns new zero-filled 16-element GF (Float64Array).
// If passed an array of numbers, prefills the returned
// array with them.
//
// We use Float64Array, because we need 48-bit numbers
// for this implementation.
function gf(init) {
    const r = new Float64Array(16);
    if (init) {
        for (let i = 0; i < init.length; i++) {
            r[i] = init[i];
        }
    }
    return r;
}
// Base point.
const _9 = new Uint8Array(32);
_9[0] = 9;
const gf0 = gf();
const gf1 = gf([1]);
const D = gf([
    0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070,
    0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203
]);
const D2 = gf([
    0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0,
    0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406
]);
const X = gf([
    0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c,
    0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169
]);
const Y = gf([
    0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666,
    0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666
]);
const I = gf([
    0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43,
    0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83
]);
function set25519(r, a) {
    for (let i = 0; i < 16; i++) {
        r[i] = a[i] | 0;
    }
}
function car25519(o) {
    let c = 1;
    for (let i = 0; i < 16; i++) {
        let v = o[i] + c + 65535;
        c = Math.floor(v / 65536);
        o[i] = v - c * 65536;
    }
    o[0] += c - 1 + 37 * (c - 1);
}
function sel25519(p, q, b) {
    const c = ~(b - 1);
    for (let i = 0; i < 16; i++) {
        const t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
    }
}
function pack25519(o, n) {
    const m = gf();
    const t = gf();
    for (let i = 0; i < 16; i++) {
        t[i] = n[i];
    }
    car25519(t);
    car25519(t);
    car25519(t);
    for (let j = 0; j < 2; j++) {
        m[0] = t[0] - 0xffed;
        for (let i = 1; i < 15; i++) {
            m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
            m[i - 1] &= 0xffff;
        }
        m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
        const b = (m[15] >> 16) & 1;
        m[14] &= 0xffff;
        sel25519(t, m, 1 - b);
    }
    for (let i = 0; i < 16; i++) {
        o[2 * i] = t[i] & 0xff;
        o[2 * i + 1] = t[i] >> 8;
    }
}
function verify32(x, y) {
    let d = 0;
    for (let i = 0; i < 32; i++) {
        d |= x[i] ^ y[i];
    }
    return (1 & ((d - 1) >>> 8)) - 1;
}
function neq25519(a, b) {
    const c = new Uint8Array(32);
    const d = new Uint8Array(32);
    pack25519(c, a);
    pack25519(d, b);
    return verify32(c, d);
}
function par25519(a) {
    const d = new Uint8Array(32);
    pack25519(d, a);
    return d[0] & 1;
}
function unpack25519(o, n) {
    for (let i = 0; i < 16; i++) {
        o[i] = n[2 * i] + (n[2 * i + 1] << 8);
    }
    o[15] &= 0x7fff;
}
function add(o, a, b) {
    for (let i = 0; i < 16; i++) {
        o[i] = a[i] + b[i];
    }
}
function sub(o, a, b) {
    for (let i = 0; i < 16; i++) {
        o[i] = a[i] - b[i];
    }
}
function mul(o, a, b) {
    let v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
    v = a[0];
    t0 += v * b0;
    t1 += v * b1;
    t2 += v * b2;
    t3 += v * b3;
    t4 += v * b4;
    t5 += v * b5;
    t6 += v * b6;
    t7 += v * b7;
    t8 += v * b8;
    t9 += v * b9;
    t10 += v * b10;
    t11 += v * b11;
    t12 += v * b12;
    t13 += v * b13;
    t14 += v * b14;
    t15 += v * b15;
    v = a[1];
    t1 += v * b0;
    t2 += v * b1;
    t3 += v * b2;
    t4 += v * b3;
    t5 += v * b4;
    t6 += v * b5;
    t7 += v * b6;
    t8 += v * b7;
    t9 += v * b8;
    t10 += v * b9;
    t11 += v * b10;
    t12 += v * b11;
    t13 += v * b12;
    t14 += v * b13;
    t15 += v * b14;
    t16 += v * b15;
    v = a[2];
    t2 += v * b0;
    t3 += v * b1;
    t4 += v * b2;
    t5 += v * b3;
    t6 += v * b4;
    t7 += v * b5;
    t8 += v * b6;
    t9 += v * b7;
    t10 += v * b8;
    t11 += v * b9;
    t12 += v * b10;
    t13 += v * b11;
    t14 += v * b12;
    t15 += v * b13;
    t16 += v * b14;
    t17 += v * b15;
    v = a[3];
    t3 += v * b0;
    t4 += v * b1;
    t5 += v * b2;
    t6 += v * b3;
    t7 += v * b4;
    t8 += v * b5;
    t9 += v * b6;
    t10 += v * b7;
    t11 += v * b8;
    t12 += v * b9;
    t13 += v * b10;
    t14 += v * b11;
    t15 += v * b12;
    t16 += v * b13;
    t17 += v * b14;
    t18 += v * b15;
    v = a[4];
    t4 += v * b0;
    t5 += v * b1;
    t6 += v * b2;
    t7 += v * b3;
    t8 += v * b4;
    t9 += v * b5;
    t10 += v * b6;
    t11 += v * b7;
    t12 += v * b8;
    t13 += v * b9;
    t14 += v * b10;
    t15 += v * b11;
    t16 += v * b12;
    t17 += v * b13;
    t18 += v * b14;
    t19 += v * b15;
    v = a[5];
    t5 += v * b0;
    t6 += v * b1;
    t7 += v * b2;
    t8 += v * b3;
    t9 += v * b4;
    t10 += v * b5;
    t11 += v * b6;
    t12 += v * b7;
    t13 += v * b8;
    t14 += v * b9;
    t15 += v * b10;
    t16 += v * b11;
    t17 += v * b12;
    t18 += v * b13;
    t19 += v * b14;
    t20 += v * b15;
    v = a[6];
    t6 += v * b0;
    t7 += v * b1;
    t8 += v * b2;
    t9 += v * b3;
    t10 += v * b4;
    t11 += v * b5;
    t12 += v * b6;
    t13 += v * b7;
    t14 += v * b8;
    t15 += v * b9;
    t16 += v * b10;
    t17 += v * b11;
    t18 += v * b12;
    t19 += v * b13;
    t20 += v * b14;
    t21 += v * b15;
    v = a[7];
    t7 += v * b0;
    t8 += v * b1;
    t9 += v * b2;
    t10 += v * b3;
    t11 += v * b4;
    t12 += v * b5;
    t13 += v * b6;
    t14 += v * b7;
    t15 += v * b8;
    t16 += v * b9;
    t17 += v * b10;
    t18 += v * b11;
    t19 += v * b12;
    t20 += v * b13;
    t21 += v * b14;
    t22 += v * b15;
    v = a[8];
    t8 += v * b0;
    t9 += v * b1;
    t10 += v * b2;
    t11 += v * b3;
    t12 += v * b4;
    t13 += v * b5;
    t14 += v * b6;
    t15 += v * b7;
    t16 += v * b8;
    t17 += v * b9;
    t18 += v * b10;
    t19 += v * b11;
    t20 += v * b12;
    t21 += v * b13;
    t22 += v * b14;
    t23 += v * b15;
    v = a[9];
    t9 += v * b0;
    t10 += v * b1;
    t11 += v * b2;
    t12 += v * b3;
    t13 += v * b4;
    t14 += v * b5;
    t15 += v * b6;
    t16 += v * b7;
    t17 += v * b8;
    t18 += v * b9;
    t19 += v * b10;
    t20 += v * b11;
    t21 += v * b12;
    t22 += v * b13;
    t23 += v * b14;
    t24 += v * b15;
    v = a[10];
    t10 += v * b0;
    t11 += v * b1;
    t12 += v * b2;
    t13 += v * b3;
    t14 += v * b4;
    t15 += v * b5;
    t16 += v * b6;
    t17 += v * b7;
    t18 += v * b8;
    t19 += v * b9;
    t20 += v * b10;
    t21 += v * b11;
    t22 += v * b12;
    t23 += v * b13;
    t24 += v * b14;
    t25 += v * b15;
    v = a[11];
    t11 += v * b0;
    t12 += v * b1;
    t13 += v * b2;
    t14 += v * b3;
    t15 += v * b4;
    t16 += v * b5;
    t17 += v * b6;
    t18 += v * b7;
    t19 += v * b8;
    t20 += v * b9;
    t21 += v * b10;
    t22 += v * b11;
    t23 += v * b12;
    t24 += v * b13;
    t25 += v * b14;
    t26 += v * b15;
    v = a[12];
    t12 += v * b0;
    t13 += v * b1;
    t14 += v * b2;
    t15 += v * b3;
    t16 += v * b4;
    t17 += v * b5;
    t18 += v * b6;
    t19 += v * b7;
    t20 += v * b8;
    t21 += v * b9;
    t22 += v * b10;
    t23 += v * b11;
    t24 += v * b12;
    t25 += v * b13;
    t26 += v * b14;
    t27 += v * b15;
    v = a[13];
    t13 += v * b0;
    t14 += v * b1;
    t15 += v * b2;
    t16 += v * b3;
    t17 += v * b4;
    t18 += v * b5;
    t19 += v * b6;
    t20 += v * b7;
    t21 += v * b8;
    t22 += v * b9;
    t23 += v * b10;
    t24 += v * b11;
    t25 += v * b12;
    t26 += v * b13;
    t27 += v * b14;
    t28 += v * b15;
    v = a[14];
    t14 += v * b0;
    t15 += v * b1;
    t16 += v * b2;
    t17 += v * b3;
    t18 += v * b4;
    t19 += v * b5;
    t20 += v * b6;
    t21 += v * b7;
    t22 += v * b8;
    t23 += v * b9;
    t24 += v * b10;
    t25 += v * b11;
    t26 += v * b12;
    t27 += v * b13;
    t28 += v * b14;
    t29 += v * b15;
    v = a[15];
    t15 += v * b0;
    t16 += v * b1;
    t17 += v * b2;
    t18 += v * b3;
    t19 += v * b4;
    t20 += v * b5;
    t21 += v * b6;
    t22 += v * b7;
    t23 += v * b8;
    t24 += v * b9;
    t25 += v * b10;
    t26 += v * b11;
    t27 += v * b12;
    t28 += v * b13;
    t29 += v * b14;
    t30 += v * b15;
    t0 += 38 * t16;
    t1 += 38 * t17;
    t2 += 38 * t18;
    t3 += 38 * t19;
    t4 += 38 * t20;
    t5 += 38 * t21;
    t6 += 38 * t22;
    t7 += 38 * t23;
    t8 += 38 * t24;
    t9 += 38 * t25;
    t10 += 38 * t26;
    t11 += 38 * t27;
    t12 += 38 * t28;
    t13 += 38 * t29;
    t14 += 38 * t30;
    // t15 left as is
    // first car
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    // second car
    c = 1;
    v = t0 + c + 65535;
    c = Math.floor(v / 65536);
    t0 = v - c * 65536;
    v = t1 + c + 65535;
    c = Math.floor(v / 65536);
    t1 = v - c * 65536;
    v = t2 + c + 65535;
    c = Math.floor(v / 65536);
    t2 = v - c * 65536;
    v = t3 + c + 65535;
    c = Math.floor(v / 65536);
    t3 = v - c * 65536;
    v = t4 + c + 65535;
    c = Math.floor(v / 65536);
    t4 = v - c * 65536;
    v = t5 + c + 65535;
    c = Math.floor(v / 65536);
    t5 = v - c * 65536;
    v = t6 + c + 65535;
    c = Math.floor(v / 65536);
    t6 = v - c * 65536;
    v = t7 + c + 65535;
    c = Math.floor(v / 65536);
    t7 = v - c * 65536;
    v = t8 + c + 65535;
    c = Math.floor(v / 65536);
    t8 = v - c * 65536;
    v = t9 + c + 65535;
    c = Math.floor(v / 65536);
    t9 = v - c * 65536;
    v = t10 + c + 65535;
    c = Math.floor(v / 65536);
    t10 = v - c * 65536;
    v = t11 + c + 65535;
    c = Math.floor(v / 65536);
    t11 = v - c * 65536;
    v = t12 + c + 65535;
    c = Math.floor(v / 65536);
    t12 = v - c * 65536;
    v = t13 + c + 65535;
    c = Math.floor(v / 65536);
    t13 = v - c * 65536;
    v = t14 + c + 65535;
    c = Math.floor(v / 65536);
    t14 = v - c * 65536;
    v = t15 + c + 65535;
    c = Math.floor(v / 65536);
    t15 = v - c * 65536;
    t0 += c - 1 + 37 * (c - 1);
    o[0] = t0;
    o[1] = t1;
    o[2] = t2;
    o[3] = t3;
    o[4] = t4;
    o[5] = t5;
    o[6] = t6;
    o[7] = t7;
    o[8] = t8;
    o[9] = t9;
    o[10] = t10;
    o[11] = t11;
    o[12] = t12;
    o[13] = t13;
    o[14] = t14;
    o[15] = t15;
}
function square(o, a) {
    mul(o, a, a);
}
function inv25519(o, i) {
    const c = gf();
    let a;
    for (a = 0; a < 16; a++) {
        c[a] = i[a];
    }
    for (a = 253; a >= 0; a--) {
        square(c, c);
        if (a !== 2 && a !== 4) {
            mul(c, c, i);
        }
    }
    for (a = 0; a < 16; a++) {
        o[a] = c[a];
    }
}
function pow2523(o, i) {
    const c = gf();
    let a;
    for (a = 0; a < 16; a++) {
        c[a] = i[a];
    }
    for (a = 250; a >= 0; a--) {
        square(c, c);
        if (a !== 1) {
            mul(c, c, i);
        }
    }
    for (a = 0; a < 16; a++) {
        o[a] = c[a];
    }
}
function edadd(p, q) {
    const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
    sub(a, p[1], p[0]);
    sub(t, q[1], q[0]);
    mul(a, a, t);
    add(b, p[0], p[1]);
    add(t, q[0], q[1]);
    mul(b, b, t);
    mul(c, p[3], q[3]);
    mul(c, c, D2);
    mul(d, p[2], q[2]);
    add(d, d, d);
    sub(e, b, a);
    sub(f, d, c);
    add(g, d, c);
    add(h, b, a);
    mul(p[0], e, f);
    mul(p[1], h, g);
    mul(p[2], g, f);
    mul(p[3], e, h);
}
function cswap(p, q, b) {
    for (let i = 0; i < 4; i++) {
        sel25519(p[i], q[i], b);
    }
}
function pack(r, p) {
    const tx = gf(), ty = gf(), zi = gf();
    inv25519(zi, p[2]);
    mul(tx, p[0], zi);
    mul(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
}
function scalarmult(p, q, s) {
    set25519(p[0], gf0);
    set25519(p[1], gf1);
    set25519(p[2], gf1);
    set25519(p[3], gf0);
    for (let i = 255; i >= 0; --i) {
        const b = (s[(i / 8) | 0] >> (i & 7)) & 1;
        cswap(p, q, b);
        edadd(q, p);
        edadd(p, p);
        cswap(p, q, b);
    }
}
function scalarbase(p, s) {
    const q = [gf(), gf(), gf(), gf()];
    set25519(q[0], X);
    set25519(q[1], Y);
    set25519(q[2], gf1);
    mul(q[3], X, Y);
    scalarmult(p, q, s);
}
// Generates key pair from secret 32-byte seed.
function generateKeyPairFromSeed(seed) {
    if (seed.length !== exports.SEED_LENGTH) {
        throw new Error(`ed25519: seed must be ${exports.SEED_LENGTH} bytes`);
    }
    const d = (0, sha512_1.hash)(seed);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    const publicKey = new Uint8Array(32);
    const p = [gf(), gf(), gf(), gf()];
    scalarbase(p, d);
    pack(publicKey, p);
    const secretKey = new Uint8Array(64);
    secretKey.set(seed);
    secretKey.set(publicKey, 32);
    return {
        publicKey,
        secretKey
    };
}
exports.generateKeyPairFromSeed = generateKeyPairFromSeed;
function generateKeyPair(prng) {
    const seed = (0, random_1.randomBytes)(32, prng);
    const result = generateKeyPairFromSeed(seed);
    (0, wipe_1.wipe)(seed);
    return result;
}
exports.generateKeyPair = generateKeyPair;
function extractPublicKeyFromSecretKey(secretKey) {
    if (secretKey.length !== exports.SECRET_KEY_LENGTH) {
        throw new Error(`ed25519: secret key must be ${exports.SECRET_KEY_LENGTH} bytes`);
    }
    return new Uint8Array(secretKey.subarray(32));
}
exports.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
const L = new Float64Array([
    0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2,
    0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10
]);
function modL(r, x) {
    let carry;
    let i;
    let j;
    let k;
    for (i = 63; i >= 32; --i) {
        carry = 0;
        for (j = i - 32, k = i - 12; j < k; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = Math.floor((x[j] + 128) / 256);
            x[j] -= carry * 256;
        }
        x[j] += carry;
        x[i] = 0;
    }
    carry = 0;
    for (j = 0; j < 32; j++) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
    }
    for (j = 0; j < 32; j++) {
        x[j] -= carry * L[j];
    }
    for (i = 0; i < 32; i++) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
    }
}
function reduce(r) {
    const x = new Float64Array(64);
    for (let i = 0; i < 64; i++) {
        x[i] = r[i];
    }
    for (let i = 0; i < 64; i++) {
        r[i] = 0;
    }
    modL(r, x);
}
// Returns 64-byte signature of the message under the 64-byte secret key.
function sign(secretKey, message) {
    const x = new Float64Array(64);
    const p = [gf(), gf(), gf(), gf()];
    const d = (0, sha512_1.hash)(secretKey.subarray(0, 32));
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    const signature = new Uint8Array(64);
    signature.set(d.subarray(32), 32);
    const hs = new sha512_1.SHA512();
    hs.update(signature.subarray(32));
    hs.update(message);
    const r = hs.digest();
    hs.clean();
    reduce(r);
    scalarbase(p, r);
    pack(signature, p);
    hs.reset();
    hs.update(signature.subarray(0, 32));
    hs.update(secretKey.subarray(32));
    hs.update(message);
    const h = hs.digest();
    reduce(h);
    for (let i = 0; i < 32; i++) {
        x[i] = r[i];
    }
    for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 32; j++) {
            x[i + j] += h[i] * d[j];
        }
    }
    modL(signature.subarray(32), x);
    return signature;
}
exports.sign = sign;
function unpackneg(r, p) {
    const t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    set25519(r[2], gf1);
    unpack25519(r[1], p);
    square(num, r[1]);
    mul(den, num, D);
    sub(num, num, r[2]);
    add(den, r[2], den);
    square(den2, den);
    square(den4, den2);
    mul(den6, den4, den2);
    mul(t, den6, num);
    mul(t, t, den);
    pow2523(t, t);
    mul(t, t, num);
    mul(t, t, den);
    mul(t, t, den);
    mul(r[0], t, den);
    square(chk, r[0]);
    mul(chk, chk, den);
    if (neq25519(chk, num)) {
        mul(r[0], r[0], I);
    }
    square(chk, r[0]);
    mul(chk, chk, den);
    if (neq25519(chk, num)) {
        return -1;
    }
    if (par25519(r[0]) === (p[31] >> 7)) {
        sub(r[0], gf0, r[0]);
    }
    mul(r[3], r[0], r[1]);
    return 0;
}
function verify(publicKey, message, signature) {
    const t = new Uint8Array(32);
    const p = [gf(), gf(), gf(), gf()];
    const q = [gf(), gf(), gf(), gf()];
    if (signature.length !== exports.SIGNATURE_LENGTH) {
        throw new Error(`ed25519: signature must be ${exports.SIGNATURE_LENGTH} bytes`);
    }
    if (unpackneg(q, publicKey)) {
        return false;
    }
    const hs = new sha512_1.SHA512();
    hs.update(signature.subarray(0, 32));
    hs.update(publicKey);
    hs.update(message);
    const h = hs.digest();
    reduce(h);
    scalarmult(p, q, h);
    scalarbase(q, signature.subarray(32));
    edadd(p, q);
    pack(t, p);
    if (verify32(signature, t)) {
        return false;
    }
    return true;
}
exports.verify = verify;
/**
 * Convert Ed25519 public key to X25519 public key.
 *
 * Throws if given an invalid public key.
 */
function convertPublicKeyToX25519(publicKey) {
    let q = [gf(), gf(), gf(), gf()];
    if (unpackneg(q, publicKey)) {
        throw new Error("Ed25519: invalid public key");
    }
    // Formula: montgomeryX = (edwardsY + 1)*inverse(1 - edwardsY) mod p
    let a = gf();
    let b = gf();
    let y = q[1];
    add(a, gf1, y);
    sub(b, gf1, y);
    inv25519(b, b);
    mul(a, a, b);
    let z = new Uint8Array(32);
    pack25519(z, a);
    return z;
}
exports.convertPublicKeyToX25519 = convertPublicKeyToX25519;
/**
 *  Convert Ed25519 secret (private) key to X25519 secret key.
 */
function convertSecretKeyToX25519(secretKey) {
    const d = (0, sha512_1.hash)(secretKey.subarray(0, 32));
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    const o = new Uint8Array(d.subarray(0, 32));
    (0, wipe_1.wipe)(d);
    return o;
}
exports.convertSecretKeyToX25519 = convertSecretKeyToX25519;
//# sourceMappingURL=ed25519.js.map

/***/ }),

/***/ 99912:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2016 Dmitry Chestnykh
// MIT License. See LICENSE file for details.
Object.defineProperty(exports, "__esModule", ({ value: true }));
var binary_1 = __webpack_require__(87492);
var wipe_1 = __webpack_require__(60318);
exports.DIGEST_LENGTH = 64;
exports.BLOCK_SIZE = 128;
/**
 * SHA-2-512 cryptographic hash algorithm.
 */
var SHA512 = /** @class */ (function () {
    function SHA512() {
        /** Length of hash output */
        this.digestLength = exports.DIGEST_LENGTH;
        /** Block size */
        this.blockSize = exports.BLOCK_SIZE;
        // Note: Int32Array is used instead of Uint32Array for performance reasons.
        this._stateHi = new Int32Array(8); // hash state, high bytes
        this._stateLo = new Int32Array(8); // hash state, low bytes
        this._tempHi = new Int32Array(16); // temporary state, high bytes
        this._tempLo = new Int32Array(16); // temporary state, low bytes
        this._buffer = new Uint8Array(256); // buffer for data to hash
        this._bufferLength = 0; // number of bytes in buffer
        this._bytesHashed = 0; // number of total bytes hashed
        this._finished = false; // indicates whether the hash was finalized
        this.reset();
    }
    SHA512.prototype._initState = function () {
        this._stateHi[0] = 0x6a09e667;
        this._stateHi[1] = 0xbb67ae85;
        this._stateHi[2] = 0x3c6ef372;
        this._stateHi[3] = 0xa54ff53a;
        this._stateHi[4] = 0x510e527f;
        this._stateHi[5] = 0x9b05688c;
        this._stateHi[6] = 0x1f83d9ab;
        this._stateHi[7] = 0x5be0cd19;
        this._stateLo[0] = 0xf3bcc908;
        this._stateLo[1] = 0x84caa73b;
        this._stateLo[2] = 0xfe94f82b;
        this._stateLo[3] = 0x5f1d36f1;
        this._stateLo[4] = 0xade682d1;
        this._stateLo[5] = 0x2b3e6c1f;
        this._stateLo[6] = 0xfb41bd6b;
        this._stateLo[7] = 0x137e2179;
    };
    /**
     * Resets hash state making it possible
     * to re-use this instance to hash other data.
     */
    SHA512.prototype.reset = function () {
        this._initState();
        this._bufferLength = 0;
        this._bytesHashed = 0;
        this._finished = false;
        return this;
    };
    /**
     * Cleans internal buffers and resets hash state.
     */
    SHA512.prototype.clean = function () {
        wipe_1.wipe(this._buffer);
        wipe_1.wipe(this._tempHi);
        wipe_1.wipe(this._tempLo);
        this.reset();
    };
    /**
     * Updates hash state with the given data.
     *
     * Throws error when trying to update already finalized hash:
     * instance must be reset to update it again.
     */
    SHA512.prototype.update = function (data, dataLength) {
        if (dataLength === void 0) { dataLength = data.length; }
        if (this._finished) {
            throw new Error("SHA512: can't update because hash was finished.");
        }
        var dataPos = 0;
        this._bytesHashed += dataLength;
        if (this._bufferLength > 0) {
            while (this._bufferLength < exports.BLOCK_SIZE && dataLength > 0) {
                this._buffer[this._bufferLength++] = data[dataPos++];
                dataLength--;
            }
            if (this._bufferLength === this.blockSize) {
                hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
                this._bufferLength = 0;
            }
        }
        if (dataLength >= this.blockSize) {
            dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
            dataLength %= this.blockSize;
        }
        while (dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
        }
        return this;
    };
    /**
     * Finalizes hash state and puts hash into out.
     * If hash was already finalized, puts the same value.
     */
    SHA512.prototype.finish = function (out) {
        if (!this._finished) {
            var bytesHashed = this._bytesHashed;
            var left = this._bufferLength;
            var bitLenHi = (bytesHashed / 0x20000000) | 0;
            var bitLenLo = bytesHashed << 3;
            var padLength = (bytesHashed % 128 < 112) ? 128 : 256;
            this._buffer[left] = 0x80;
            for (var i = left + 1; i < padLength - 8; i++) {
                this._buffer[i] = 0;
            }
            binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
            binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
            hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
            this._finished = true;
        }
        for (var i = 0; i < this.digestLength / 8; i++) {
            binary_1.writeUint32BE(this._stateHi[i], out, i * 8);
            binary_1.writeUint32BE(this._stateLo[i], out, i * 8 + 4);
        }
        return this;
    };
    /**
     * Returns the final hash digest.
     */
    SHA512.prototype.digest = function () {
        var out = new Uint8Array(this.digestLength);
        this.finish(out);
        return out;
    };
    /**
     * Function useful for HMAC/PBKDF2 optimization. Returns hash state to be
     * used with restoreState(). Only chain value is saved, not buffers or
     * other state variables.
     */
    SHA512.prototype.saveState = function () {
        if (this._finished) {
            throw new Error("SHA256: cannot save finished state");
        }
        return {
            stateHi: new Int32Array(this._stateHi),
            stateLo: new Int32Array(this._stateLo),
            buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : undefined,
            bufferLength: this._bufferLength,
            bytesHashed: this._bytesHashed
        };
    };
    /**
     * Function useful for HMAC/PBKDF2 optimization. Restores state saved by
     * saveState() and sets bytesHashed to the given value.
     */
    SHA512.prototype.restoreState = function (savedState) {
        this._stateHi.set(savedState.stateHi);
        this._stateLo.set(savedState.stateLo);
        this._bufferLength = savedState.bufferLength;
        if (savedState.buffer) {
            this._buffer.set(savedState.buffer);
        }
        this._bytesHashed = savedState.bytesHashed;
        this._finished = false;
        return this;
    };
    /**
     * Cleans state returned by saveState().
     */
    SHA512.prototype.cleanSavedState = function (savedState) {
        wipe_1.wipe(savedState.stateHi);
        wipe_1.wipe(savedState.stateLo);
        if (savedState.buffer) {
            wipe_1.wipe(savedState.buffer);
        }
        savedState.bufferLength = 0;
        savedState.bytesHashed = 0;
    };
    return SHA512;
}());
exports.SHA512 = SHA512;
// Constants
var K = new Int32Array([
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
    0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
    0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
    0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
    0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
    0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
    0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
    0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
    0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
    0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
    0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
    0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
    0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
    0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
    0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
    0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
    0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
    0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
    0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
    0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
    0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]);
function hashBlocks(wh, wl, hh, hl, m, pos, len) {
    var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
    var h, l;
    var th, tl;
    var a, b, c, d;
    while (len >= 128) {
        for (var i = 0; i < 16; i++) {
            var j = 8 * i + pos;
            wh[i] = binary_1.readUint32BE(m, j);
            wl[i] = binary_1.readUint32BE(m, j + 4);
        }
        for (var i = 0; i < 80; i++) {
            var bh0 = ah0;
            var bh1 = ah1;
            var bh2 = ah2;
            var bh3 = ah3;
            var bh4 = ah4;
            var bh5 = ah5;
            var bh6 = ah6;
            var bh7 = ah7;
            var bl0 = al0;
            var bl1 = al1;
            var bl2 = al2;
            var bl3 = al3;
            var bl4 = al4;
            var bl5 = al5;
            var bl6 = al6;
            var bl7 = al7;
            // add
            h = ah7;
            l = al7;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            // Sigma1
            h = ((ah4 >>> 14) | (al4 << (32 - 14))) ^ ((ah4 >>> 18) |
                (al4 << (32 - 18))) ^ ((al4 >>> (41 - 32)) | (ah4 << (32 - (41 - 32))));
            l = ((al4 >>> 14) | (ah4 << (32 - 14))) ^ ((al4 >>> 18) |
                (ah4 << (32 - 18))) ^ ((ah4 >>> (41 - 32)) | (al4 << (32 - (41 - 32))));
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // Ch
            h = (ah4 & ah5) ^ (~ah4 & ah6);
            l = (al4 & al5) ^ (~al4 & al6);
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // K
            h = K[i * 2];
            l = K[i * 2 + 1];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // w
            h = wh[i % 16];
            l = wl[i % 16];
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 0xffff | d << 16;
            tl = a & 0xffff | b << 16;
            // add
            h = th;
            l = tl;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            // Sigma0
            h = ((ah0 >>> 28) | (al0 << (32 - 28))) ^ ((al0 >>> (34 - 32)) |
                (ah0 << (32 - (34 - 32)))) ^ ((al0 >>> (39 - 32)) | (ah0 << (32 - (39 - 32))));
            l = ((al0 >>> 28) | (ah0 << (32 - 28))) ^ ((ah0 >>> (34 - 32)) |
                (al0 << (32 - (34 - 32)))) ^ ((ah0 >>> (39 - 32)) | (al0 << (32 - (39 - 32))));
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            // Maj
            h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
            l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = (c & 0xffff) | (d << 16);
            bl7 = (a & 0xffff) | (b << 16);
            // add
            h = bh3;
            l = bl3;
            a = l & 0xffff;
            b = l >>> 16;
            c = h & 0xffff;
            d = h >>> 16;
            h = th;
            l = tl;
            a += l & 0xffff;
            b += l >>> 16;
            c += h & 0xffff;
            d += h >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = (c & 0xffff) | (d << 16);
            bl3 = (a & 0xffff) | (b << 16);
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i % 16 === 15) {
                for (var j = 0; j < 16; j++) {
                    // add
                    h = wh[j];
                    l = wl[j];
                    a = l & 0xffff;
                    b = l >>> 16;
                    c = h & 0xffff;
                    d = h >>> 16;
                    h = wh[(j + 9) % 16];
                    l = wl[(j + 9) % 16];
                    a += l & 0xffff;
                    b += l >>> 16;
                    c += h & 0xffff;
                    d += h >>> 16;
                    // sigma0
                    th = wh[(j + 1) % 16];
                    tl = wl[(j + 1) % 16];
                    h = ((th >>> 1) | (tl << (32 - 1))) ^ ((th >>> 8) |
                        (tl << (32 - 8))) ^ (th >>> 7);
                    l = ((tl >>> 1) | (th << (32 - 1))) ^ ((tl >>> 8) |
                        (th << (32 - 8))) ^ ((tl >>> 7) | (th << (32 - 7)));
                    a += l & 0xffff;
                    b += l >>> 16;
                    c += h & 0xffff;
                    d += h >>> 16;
                    // sigma1
                    th = wh[(j + 14) % 16];
                    tl = wl[(j + 14) % 16];
                    h = ((th >>> 19) | (tl << (32 - 19))) ^ ((tl >>> (61 - 32)) |
                        (th << (32 - (61 - 32)))) ^ (th >>> 6);
                    l = ((tl >>> 19) | (th << (32 - 19))) ^ ((th >>> (61 - 32)) |
                        (tl << (32 - (61 - 32)))) ^ ((tl >>> 6) | (th << (32 - 6)));
                    a += l & 0xffff;
                    b += l >>> 16;
                    c += h & 0xffff;
                    d += h >>> 16;
                    b += a >>> 16;
                    c += b >>> 16;
                    d += c >>> 16;
                    wh[j] = (c & 0xffff) | (d << 16);
                    wl[j] = (a & 0xffff) | (b << 16);
                }
            }
        }
        // add
        h = ah0;
        l = al0;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[0];
        l = hl[0];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[0] = ah0 = (c & 0xffff) | (d << 16);
        hl[0] = al0 = (a & 0xffff) | (b << 16);
        h = ah1;
        l = al1;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[1];
        l = hl[1];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[1] = ah1 = (c & 0xffff) | (d << 16);
        hl[1] = al1 = (a & 0xffff) | (b << 16);
        h = ah2;
        l = al2;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[2];
        l = hl[2];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[2] = ah2 = (c & 0xffff) | (d << 16);
        hl[2] = al2 = (a & 0xffff) | (b << 16);
        h = ah3;
        l = al3;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[3];
        l = hl[3];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[3] = ah3 = (c & 0xffff) | (d << 16);
        hl[3] = al3 = (a & 0xffff) | (b << 16);
        h = ah4;
        l = al4;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[4];
        l = hl[4];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[4] = ah4 = (c & 0xffff) | (d << 16);
        hl[4] = al4 = (a & 0xffff) | (b << 16);
        h = ah5;
        l = al5;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[5];
        l = hl[5];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[5] = ah5 = (c & 0xffff) | (d << 16);
        hl[5] = al5 = (a & 0xffff) | (b << 16);
        h = ah6;
        l = al6;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[6];
        l = hl[6];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[6] = ah6 = (c & 0xffff) | (d << 16);
        hl[6] = al6 = (a & 0xffff) | (b << 16);
        h = ah7;
        l = al7;
        a = l & 0xffff;
        b = l >>> 16;
        c = h & 0xffff;
        d = h >>> 16;
        h = hh[7];
        l = hl[7];
        a += l & 0xffff;
        b += l >>> 16;
        c += h & 0xffff;
        d += h >>> 16;
        b += a >>> 16;
        c += b >>> 16;
        d += c >>> 16;
        hh[7] = ah7 = (c & 0xffff) | (d << 16);
        hl[7] = al7 = (a & 0xffff) | (b << 16);
        pos += 128;
        len -= 128;
    }
    return pos;
}
function hash(data) {
    var h = new SHA512();
    h.update(data);
    var digest = h.digest();
    h.clean();
    return digest;
}
exports.hash = hash;
//# sourceMappingURL=sha512.js.map

/***/ }),

/***/ 78771:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:!0}));var U=__webpack_require__(82361),mt=__webpack_require__(61256),$=__webpack_require__(906),l=__webpack_require__(3491),x=__webpack_require__(49454),ae=__webpack_require__(51738),ft=__webpack_require__(55336),o=__webpack_require__(40491),vt=__webpack_require__(12447),g=__webpack_require__(26438),wt=__webpack_require__(32207),f=__webpack_require__(25815),It=__webpack_require__(37777),Rt=__webpack_require__(510);function Y(r){return r&&typeof r=="object"&&"default"in r?r:{default:r}}function _t(r){if(r&&r.__esModule)return r;var e=Object.create(null);return r&&Object.keys(r).forEach(function(t){if(t!=="default"){var i=Object.getOwnPropertyDescriptor(r,t);Object.defineProperty(e,t,i.get?i:{enumerable:!0,get:function(){return r[t]}})}}),e.default=r,Object.freeze(e)}var Ct=Y(U),Tt=Y(mt),q=_t(ft),St=Y(It),Ot=Y(Rt);function Pt(r,e){if(r.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),i=0;i<t.length;i++)t[i]=255;for(var s=0;s<r.length;s++){var n=r.charAt(s),a=n.charCodeAt(0);if(t[a]!==255)throw new TypeError(n+" is ambiguous");t[a]=s}var h=r.length,c=r.charAt(0),d=Math.log(h)/Math.log(256),p=Math.log(256)/Math.log(h);function y(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var m=0,z=0,I=0,T=u.length;I!==T&&u[I]===0;)I++,m++;for(var S=(T-I)*p+1>>>0,v=new Uint8Array(S);I!==T;){for(var O=u[I],L=0,R=S-1;(O!==0||L<z)&&R!==-1;R--,L++)O+=256*v[R]>>>0,v[R]=O%h>>>0,O=O/h>>>0;if(O!==0)throw new Error("Non-zero carry");z=L,I++}for(var A=S-z;A!==S&&v[A]===0;)A++;for(var K=c.repeat(m);A<S;++A)K+=r.charAt(v[A]);return K}function b(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var m=0;if(u[m]!==" "){for(var z=0,I=0;u[m]===c;)z++,m++;for(var T=(u.length-m)*d+1>>>0,S=new Uint8Array(T);u[m];){var v=t[u.charCodeAt(m)];if(v===255)return;for(var O=0,L=T-1;(v!==0||O<I)&&L!==-1;L--,O++)v+=h*S[L]>>>0,S[L]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");I=O,m++}if(u[m]!==" "){for(var R=T-I;R!==T&&S[R]===0;)R++;for(var A=new Uint8Array(z+(T-R)),K=z;R!==T;)A[K++]=S[R++];return A}}}function M(u){var m=b(u);if(m)return m;throw new Error(`Non-${e} character`)}return{encode:y,decodeUnsafe:b,decode:M}}var At=Pt,xt=At;const oe=r=>{if(r instanceof Uint8Array&&r.constructor.name==="Uint8Array")return r;if(r instanceof ArrayBuffer)return new Uint8Array(r);if(ArrayBuffer.isView(r))return new Uint8Array(r.buffer,r.byteOffset,r.byteLength);throw new Error("Unknown type, must be binary type")},Nt=r=>new TextEncoder().encode(r),Lt=r=>new TextDecoder().decode(r);class zt{constructor(e,t,i){this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class Ut{constructor(e,t,i){if(this.name=e,this.prefix=t,t.codePointAt(0)===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=t.codePointAt(0),this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return he(this,e)}}class Ft{constructor(e){this.decoders=e}or(e){return he(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}const he=(r,e)=>new Ft({...r.decoders||{[r.prefix]:r},...e.decoders||{[e.prefix]:e}});class Mt{constructor(e,t,i,s){this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=s,this.encoder=new zt(e,t,i),this.decoder=new Ut(e,t,s)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}const j=({name:r,prefix:e,encode:t,decode:i})=>new Mt(r,e,t,i),B=({prefix:r,name:e,alphabet:t})=>{const{encode:i,decode:s}=xt(t,e);return j({prefix:r,name:e,encode:i,decode:n=>oe(s(n))})},$t=(r,e,t,i)=>{const s={};for(let p=0;p<e.length;++p)s[e[p]]=p;let n=r.length;for(;r[n-1]==="=";)--n;const a=new Uint8Array(n*t/8|0);let h=0,c=0,d=0;for(let p=0;p<n;++p){const y=s[r[p]];if(y===void 0)throw new SyntaxError(`Non-${i} character`);c=c<<t|y,h+=t,h>=8&&(h-=8,a[d++]=255&c>>h)}if(h>=t||255&c<<8-h)throw new SyntaxError("Unexpected end of data");return a},Bt=(r,e,t)=>{const i=e[e.length-1]==="=",s=(1<<t)-1;let n="",a=0,h=0;for(let c=0;c<r.length;++c)for(h=h<<8|r[c],a+=8;a>t;)a-=t,n+=e[s&h>>a];if(a&&(n+=e[s&h<<t-a]),i)for(;n.length*t&7;)n+="=";return n},D=({name:r,prefix:e,bitsPerChar:t,alphabet:i})=>j({prefix:e,name:r,encode(s){return Bt(s,i,t)},decode(s){return $t(s,i,t,r)}}),Vt=j({prefix:"\0",name:"identity",encode:r=>Lt(r),decode:r=>Nt(r)});var kt=Object.freeze({__proto__:null,identity:Vt});const Kt=D({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});var Yt=Object.freeze({__proto__:null,base2:Kt});const qt=D({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3});var jt=Object.freeze({__proto__:null,base8:qt});const Gt=B({prefix:"9",name:"base10",alphabet:"0123456789"});var Ht=Object.freeze({__proto__:null,base10:Gt});const Xt=D({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),Jt=D({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4});var Wt=Object.freeze({__proto__:null,base16:Xt,base16upper:Jt});const Qt=D({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),Zt=D({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),ei=D({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),ti=D({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),ii=D({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),si=D({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),ri=D({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),ni=D({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),ai=D({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});var oi=Object.freeze({__proto__:null,base32:Qt,base32upper:Zt,base32pad:ei,base32padupper:ti,base32hex:ii,base32hexupper:si,base32hexpad:ri,base32hexpadupper:ni,base32z:ai});const hi=B({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),ci=B({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"});var li=Object.freeze({__proto__:null,base36:hi,base36upper:ci});const ui=B({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),gi=B({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var di=Object.freeze({__proto__:null,base58btc:ui,base58flickr:gi});const pi=D({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Di=D({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),yi=D({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Ei=D({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});var bi=Object.freeze({__proto__:null,base64:pi,base64pad:Di,base64url:yi,base64urlpad:Ei});const ce=Array.from("\u{1F680}\u{1FA90}\u2604\u{1F6F0}\u{1F30C}\u{1F311}\u{1F312}\u{1F313}\u{1F314}\u{1F315}\u{1F316}\u{1F317}\u{1F318}\u{1F30D}\u{1F30F}\u{1F30E}\u{1F409}\u2600\u{1F4BB}\u{1F5A5}\u{1F4BE}\u{1F4BF}\u{1F602}\u2764\u{1F60D}\u{1F923}\u{1F60A}\u{1F64F}\u{1F495}\u{1F62D}\u{1F618}\u{1F44D}\u{1F605}\u{1F44F}\u{1F601}\u{1F525}\u{1F970}\u{1F494}\u{1F496}\u{1F499}\u{1F622}\u{1F914}\u{1F606}\u{1F644}\u{1F4AA}\u{1F609}\u263A\u{1F44C}\u{1F917}\u{1F49C}\u{1F614}\u{1F60E}\u{1F607}\u{1F339}\u{1F926}\u{1F389}\u{1F49E}\u270C\u2728\u{1F937}\u{1F631}\u{1F60C}\u{1F338}\u{1F64C}\u{1F60B}\u{1F497}\u{1F49A}\u{1F60F}\u{1F49B}\u{1F642}\u{1F493}\u{1F929}\u{1F604}\u{1F600}\u{1F5A4}\u{1F603}\u{1F4AF}\u{1F648}\u{1F447}\u{1F3B6}\u{1F612}\u{1F92D}\u2763\u{1F61C}\u{1F48B}\u{1F440}\u{1F62A}\u{1F611}\u{1F4A5}\u{1F64B}\u{1F61E}\u{1F629}\u{1F621}\u{1F92A}\u{1F44A}\u{1F973}\u{1F625}\u{1F924}\u{1F449}\u{1F483}\u{1F633}\u270B\u{1F61A}\u{1F61D}\u{1F634}\u{1F31F}\u{1F62C}\u{1F643}\u{1F340}\u{1F337}\u{1F63B}\u{1F613}\u2B50\u2705\u{1F97A}\u{1F308}\u{1F608}\u{1F918}\u{1F4A6}\u2714\u{1F623}\u{1F3C3}\u{1F490}\u2639\u{1F38A}\u{1F498}\u{1F620}\u261D\u{1F615}\u{1F33A}\u{1F382}\u{1F33B}\u{1F610}\u{1F595}\u{1F49D}\u{1F64A}\u{1F639}\u{1F5E3}\u{1F4AB}\u{1F480}\u{1F451}\u{1F3B5}\u{1F91E}\u{1F61B}\u{1F534}\u{1F624}\u{1F33C}\u{1F62B}\u26BD\u{1F919}\u2615\u{1F3C6}\u{1F92B}\u{1F448}\u{1F62E}\u{1F646}\u{1F37B}\u{1F343}\u{1F436}\u{1F481}\u{1F632}\u{1F33F}\u{1F9E1}\u{1F381}\u26A1\u{1F31E}\u{1F388}\u274C\u270A\u{1F44B}\u{1F630}\u{1F928}\u{1F636}\u{1F91D}\u{1F6B6}\u{1F4B0}\u{1F353}\u{1F4A2}\u{1F91F}\u{1F641}\u{1F6A8}\u{1F4A8}\u{1F92C}\u2708\u{1F380}\u{1F37A}\u{1F913}\u{1F619}\u{1F49F}\u{1F331}\u{1F616}\u{1F476}\u{1F974}\u25B6\u27A1\u2753\u{1F48E}\u{1F4B8}\u2B07\u{1F628}\u{1F31A}\u{1F98B}\u{1F637}\u{1F57A}\u26A0\u{1F645}\u{1F61F}\u{1F635}\u{1F44E}\u{1F932}\u{1F920}\u{1F927}\u{1F4CC}\u{1F535}\u{1F485}\u{1F9D0}\u{1F43E}\u{1F352}\u{1F617}\u{1F911}\u{1F30A}\u{1F92F}\u{1F437}\u260E\u{1F4A7}\u{1F62F}\u{1F486}\u{1F446}\u{1F3A4}\u{1F647}\u{1F351}\u2744\u{1F334}\u{1F4A3}\u{1F438}\u{1F48C}\u{1F4CD}\u{1F940}\u{1F922}\u{1F445}\u{1F4A1}\u{1F4A9}\u{1F450}\u{1F4F8}\u{1F47B}\u{1F910}\u{1F92E}\u{1F3BC}\u{1F975}\u{1F6A9}\u{1F34E}\u{1F34A}\u{1F47C}\u{1F48D}\u{1F4E3}\u{1F942}"),mi=ce.reduce((r,e,t)=>(r[t]=e,r),[]),fi=ce.reduce((r,e,t)=>(r[e.codePointAt(0)]=t,r),[]);function vi(r){return r.reduce((e,t)=>(e+=mi[t],e),"")}function wi(r){const e=[];for(const t of r){const i=fi[t.codePointAt(0)];if(i===void 0)throw new Error(`Non-base256emoji character: ${t}`);e.push(i)}return new Uint8Array(e)}const Ii=j({prefix:"\u{1F680}",name:"base256emoji",encode:vi,decode:wi});var Ri=Object.freeze({__proto__:null,base256emoji:Ii}),_i=ue,le=128,Ci=127,Ti=~Ci,Si=Math.pow(2,31);function ue(r,e,t){e=e||[],t=t||0;for(var i=t;r>=Si;)e[t++]=r&255|le,r/=128;for(;r&Ti;)e[t++]=r&255|le,r>>>=7;return e[t]=r|0,ue.bytes=t-i+1,e}var Oi=W,Pi=128,ge=127;function W(r,i){var t=0,i=i||0,s=0,n=i,a,h=r.length;do{if(n>=h)throw W.bytes=0,new RangeError("Could not decode varint");a=r[n++],t+=s<28?(a&ge)<<s:(a&ge)*Math.pow(2,s),s+=7}while(a>=Pi);return W.bytes=n-i,t}var Ai=Math.pow(2,7),xi=Math.pow(2,14),Ni=Math.pow(2,21),Li=Math.pow(2,28),zi=Math.pow(2,35),Ui=Math.pow(2,42),Fi=Math.pow(2,49),Mi=Math.pow(2,56),$i=Math.pow(2,63),Bi=function(r){return r<Ai?1:r<xi?2:r<Ni?3:r<Li?4:r<zi?5:r<Ui?6:r<Fi?7:r<Mi?8:r<$i?9:10},Vi={encode:_i,decode:Oi,encodingLength:Bi},de=Vi;const pe=(r,e,t=0)=>(de.encode(r,e,t),e),De=r=>de.encodingLength(r),Q=(r,e)=>{const t=e.byteLength,i=De(r),s=i+De(t),n=new Uint8Array(s+t);return pe(r,n,0),pe(t,n,i),n.set(e,s),new ki(r,t,e,n)};class ki{constructor(e,t,i,s){this.code=e,this.size=t,this.digest=i,this.bytes=s}}const ye=({name:r,code:e,encode:t})=>new Ki(r,e,t);class Ki{constructor(e,t,i){this.name=e,this.code=t,this.encode=i}digest(e){if(e instanceof Uint8Array){const t=this.encode(e);return t instanceof Uint8Array?Q(this.code,t):t.then(i=>Q(this.code,i))}else throw Error("Unknown type, must be binary type")}}const Ee=r=>async e=>new Uint8Array(await crypto.subtle.digest(r,e)),Yi=ye({name:"sha2-256",code:18,encode:Ee("SHA-256")}),qi=ye({name:"sha2-512",code:19,encode:Ee("SHA-512")});var ji=Object.freeze({__proto__:null,sha256:Yi,sha512:qi});const be=0,Gi="identity",me=oe,Hi=r=>Q(be,me(r)),Xi={code:be,name:Gi,encode:me,digest:Hi};var Ji=Object.freeze({__proto__:null,identity:Xi});new TextEncoder,new TextDecoder;const fe={...kt,...Yt,...jt,...Ht,...Wt,...oi,...li,...di,...bi,...Ri};({...ji,...Ji});function ve(r){return globalThis.Buffer!=null?new Uint8Array(r.buffer,r.byteOffset,r.byteLength):r}function Wi(r=0){return globalThis.Buffer!=null&&globalThis.Buffer.allocUnsafe!=null?ve(globalThis.Buffer.allocUnsafe(r)):new Uint8Array(r)}function we(r,e,t,i){return{name:r,prefix:e,encoder:{name:r,prefix:e,encode:t},decoder:{decode:i}}}const Ie=we("utf8","u",r=>"u"+new TextDecoder("utf8").decode(r),r=>new TextEncoder().encode(r.substring(1))),Z=we("ascii","a",r=>{let e="a";for(let t=0;t<r.length;t++)e+=String.fromCharCode(r[t]);return e},r=>{r=r.substring(1);const e=Wi(r.length);for(let t=0;t<r.length;t++)e[t]=r.charCodeAt(t);return e}),Qi={utf8:Ie,"utf-8":Ie,hex:fe.base16,latin1:Z,ascii:Z,binary:Z,...fe};function Zi(r,e="utf8"){const t=Qi[e];if(!t)throw new Error(`Unsupported encoding "${e}"`);return(e==="utf8"||e==="utf-8")&&globalThis.Buffer!=null&&globalThis.Buffer.from!=null?ve(globalThis.Buffer.from(r,"utf-8")):t.decoder.decode(`${t.prefix}${r}`)}const ee="wc",Re=2,G="core",N=`${ee}@2:${G}:`,_e={name:G,logger:"error"},Ce={database:":memory:"},Te="crypto",te="client_ed25519_seed",Se=g.ONE_DAY,Oe="keychain",Pe="0.3",Ae="messages",xe="0.3",Ne=g.SIX_HOURS,Le="publisher",ze="irn",Ue="error",ie="wss://relay.walletconnect.com",se="wss://relay.walletconnect.org",Fe="relayer",E={message:"relayer_message",message_ack:"relayer_message_ack",connect:"relayer_connect",disconnect:"relayer_disconnect",error:"relayer_error",connection_stalled:"relayer_connection_stalled",transport_closed:"relayer_transport_closed",publish:"relayer_publish"},Me="_subscription",P={payload:"payload",connect:"connect",disconnect:"disconnect",error:"error"},$e=g.ONE_SECOND,es={database:":memory:"},Be="2.10.1",Ve=1e4,ke="0.3",Ke="WALLETCONNECT_CLIENT_ID",_={created:"subscription_created",deleted:"subscription_deleted",expired:"subscription_expired",disabled:"subscription_disabled",sync:"subscription_sync",resubscribed:"subscription_resubscribed"},ts=g.THIRTY_DAYS,Ye="subscription",qe="0.3",je=g.FIVE_SECONDS*1e3,Ge="pairing",He="0.3",is=g.THIRTY_DAYS,F={wc_pairingDelete:{req:{ttl:g.ONE_DAY,prompt:!1,tag:1e3},res:{ttl:g.ONE_DAY,prompt:!1,tag:1001}},wc_pairingPing:{req:{ttl:g.THIRTY_SECONDS,prompt:!1,tag:1002},res:{ttl:g.THIRTY_SECONDS,prompt:!1,tag:1003}},unregistered_method:{req:{ttl:g.ONE_DAY,prompt:!1,tag:0},res:{ttl:g.ONE_DAY,prompt:!1,tag:0}}},V={create:"pairing_create",expire:"pairing_expire",delete:"pairing_delete",ping:"pairing_ping"},C={created:"history_created",updated:"history_updated",deleted:"history_deleted",sync:"history_sync"},Xe="history",Je="0.3",We="expirer",w={created:"expirer_created",deleted:"expirer_deleted",expired:"expirer_expired",sync:"expirer_sync"},Qe="0.3",ss=g.ONE_DAY,H="verify-api",X="https://verify.walletconnect.com",re="https://verify.walletconnect.org";class Ze{constructor(e,t){this.core=e,this.logger=t,this.keychain=new Map,this.name=Oe,this.version=Pe,this.initialized=!1,this.storagePrefix=N,this.init=async()=>{if(!this.initialized){const i=await this.getKeyChain();typeof i<"u"&&(this.keychain=i),this.initialized=!0}},this.has=i=>(this.isInitialized(),this.keychain.has(i)),this.set=async(i,s)=>{this.isInitialized(),this.keychain.set(i,s),await this.persist()},this.get=i=>{this.isInitialized();const s=this.keychain.get(i);if(typeof s>"u"){const{message:n}=o.getInternalError("NO_MATCHING_KEY",`${this.name}: ${i}`);throw new Error(n)}return s},this.del=async i=>{this.isInitialized(),this.keychain.delete(i),await this.persist()},this.core=e,this.logger=l.generateChildLogger(t,this.name)}get context(){return l.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}async setKeyChain(e){await this.core.storage.setItem(this.storageKey,o.mapToObj(e))}async getKeyChain(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?o.objToMap(e):void 0}async persist(){await this.setKeyChain(this.keychain)}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}}class et{constructor(e,t,i){this.core=e,this.logger=t,this.name=Te,this.initialized=!1,this.init=async()=>{this.initialized||(await this.keychain.init(),this.initialized=!0)},this.hasKeys=s=>(this.isInitialized(),this.keychain.has(s)),this.getClientId=async()=>{this.isInitialized();const s=await this.getClientSeed(),n=q.generateKeyPair(s);return q.encodeIss(n.publicKey)},this.generateKeyPair=()=>{this.isInitialized();const s=o.generateKeyPair();return this.setPrivateKey(s.publicKey,s.privateKey)},this.signJWT=async s=>{this.isInitialized();const n=await this.getClientSeed(),a=q.generateKeyPair(n),h=o.generateRandomBytes32(),c=Se;return await q.signJWT(h,s,c,a)},this.generateSharedKey=(s,n,a)=>{this.isInitialized();const h=this.getPrivateKey(s),c=o.deriveSymKey(h,n);return this.setSymKey(c,a)},this.setSymKey=async(s,n)=>{this.isInitialized();const a=n||o.hashKey(s);return await this.keychain.set(a,s),a},this.deleteKeyPair=async s=>{this.isInitialized(),await this.keychain.del(s)},this.deleteSymKey=async s=>{this.isInitialized(),await this.keychain.del(s)},this.encode=async(s,n,a)=>{this.isInitialized();const h=o.validateEncoding(a),c=ae.safeJsonStringify(n);if(o.isTypeOneEnvelope(h)){const b=h.senderPublicKey,M=h.receiverPublicKey;s=await this.generateSharedKey(b,M)}const d=this.getSymKey(s),{type:p,senderPublicKey:y}=h;return o.encrypt({type:p,symKey:d,message:c,senderPublicKey:y})},this.decode=async(s,n,a)=>{this.isInitialized();const h=o.validateDecoding(n,a);if(o.isTypeOneEnvelope(h)){const c=h.receiverPublicKey,d=h.senderPublicKey;s=await this.generateSharedKey(c,d)}try{const c=this.getSymKey(s),d=o.decrypt({symKey:c,encoded:n});return ae.safeJsonParse(d)}catch(c){this.logger.error(`Failed to decode message from topic: '${s}', clientId: '${await this.getClientId()}'`),this.logger.error(c)}},this.getPayloadType=s=>{const n=o.deserialize(s);return o.decodeTypeByte(n.type)},this.getPayloadSenderPublicKey=s=>{const n=o.deserialize(s);return n.senderPublicKey?vt.toString(n.senderPublicKey,o.BASE16):void 0},this.core=e,this.logger=l.generateChildLogger(t,this.name),this.keychain=i||new Ze(this.core,this.logger)}get context(){return l.getLoggerContext(this.logger)}async setPrivateKey(e,t){return await this.keychain.set(e,t),e}getPrivateKey(e){return this.keychain.get(e)}async getClientSeed(){let e="";try{e=this.keychain.get(te)}catch{e=o.generateRandomBytes32(),await this.keychain.set(te,e)}return Zi(e,"base16")}getSymKey(e){return this.keychain.get(e)}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}}class tt extends x.IMessageTracker{constructor(e,t){super(e,t),this.logger=e,this.core=t,this.messages=new Map,this.name=Ae,this.version=xe,this.initialized=!1,this.storagePrefix=N,this.init=async()=>{if(!this.initialized){this.logger.trace("Initialized");try{const i=await this.getRelayerMessages();typeof i<"u"&&(this.messages=i),this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",size:this.messages.size})}catch(i){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(i)}finally{this.initialized=!0}}},this.set=async(i,s)=>{this.isInitialized();const n=o.hashMessage(s);let a=this.messages.get(i);return typeof a>"u"&&(a={}),typeof a[n]<"u"||(a[n]=s,this.messages.set(i,a),await this.persist()),n},this.get=i=>{this.isInitialized();let s=this.messages.get(i);return typeof s>"u"&&(s={}),s},this.has=(i,s)=>{this.isInitialized();const n=this.get(i),a=o.hashMessage(s);return typeof n[a]<"u"},this.del=async i=>{this.isInitialized(),this.messages.delete(i),await this.persist()},this.logger=l.generateChildLogger(e,this.name),this.core=t}get context(){return l.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}async setRelayerMessages(e){await this.core.storage.setItem(this.storageKey,o.mapToObj(e))}async getRelayerMessages(){const e=await this.core.storage.getItem(this.storageKey);return typeof e<"u"?o.objToMap(e):void 0}async persist(){await this.setRelayerMessages(this.messages)}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}}class rs extends x.IPublisher{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,this.events=new U.EventEmitter,this.name=Le,this.queue=new Map,this.publishTimeout=g.toMiliseconds(g.TEN_SECONDS),this.needsTransportRestart=!1,this.publish=async(i,s,n)=>{var a;this.logger.debug("Publishing Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:i,message:s,opts:n}});try{const h=n?.ttl||Ne,c=o.getRelayProtocolName(n),d=n?.prompt||!1,p=n?.tag||0,y=n?.id||f.getBigIntRpcId().toString(),b={topic:i,message:s,opts:{ttl:h,relay:c,prompt:d,tag:p,id:y}},M=setTimeout(()=>this.queue.set(y,b),this.publishTimeout);try{await await o.createExpiringPromise(this.rpcPublish(i,s,h,c,d,p,y),this.publishTimeout,"Failed to publish payload, please try again."),this.removeRequestFromQueue(y),this.relayer.events.emit(E.publish,b)}catch(u){if(this.logger.debug("Publishing Payload stalled"),this.needsTransportRestart=!0,(a=n?.internal)!=null&&a.throwOnFailedPublish)throw this.removeRequestFromQueue(y),u;return}finally{clearTimeout(M)}this.logger.debug("Successfully Published Payload"),this.logger.trace({type:"method",method:"publish",params:{topic:i,message:s,opts:n}})}catch(h){throw this.logger.debug("Failed to Publish Payload"),this.logger.error(h),h}},this.on=(i,s)=>{this.events.on(i,s)},this.once=(i,s)=>{this.events.once(i,s)},this.off=(i,s)=>{this.events.off(i,s)},this.removeListener=(i,s)=>{this.events.removeListener(i,s)},this.relayer=e,this.logger=l.generateChildLogger(t,this.name),this.registerEventListeners()}get context(){return l.getLoggerContext(this.logger)}rpcPublish(e,t,i,s,n,a,h){var c,d,p,y;const b={method:o.getRelayProtocolApi(s.protocol).publish,params:{topic:e,message:t,ttl:i,prompt:n,tag:a},id:h};return o.isUndefined((c=b.params)==null?void 0:c.prompt)&&((d=b.params)==null||delete d.prompt),o.isUndefined((p=b.params)==null?void 0:p.tag)&&((y=b.params)==null||delete y.tag),this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"message",direction:"outgoing",request:b}),this.relayer.request(b)}removeRequestFromQueue(e){this.queue.delete(e)}checkQueue(){this.queue.forEach(async e=>{const{topic:t,message:i,opts:s}=e;await this.publish(t,i,s)})}registerEventListeners(){this.relayer.core.heartbeat.on($.HEARTBEAT_EVENTS.pulse,()=>{if(this.needsTransportRestart){this.needsTransportRestart=!1,this.relayer.events.emit(E.connection_stalled);return}this.checkQueue()}),this.relayer.on(E.message_ack,e=>{this.removeRequestFromQueue(e.id.toString())})}}class ns{constructor(){this.map=new Map,this.set=(e,t)=>{const i=this.get(e);this.exists(e,t)||this.map.set(e,[...i,t])},this.get=e=>this.map.get(e)||[],this.exists=(e,t)=>this.get(e).includes(t),this.delete=(e,t)=>{if(typeof t>"u"){this.map.delete(e);return}if(!this.map.has(e))return;const i=this.get(e);if(!this.exists(e,t))return;const s=i.filter(n=>n!==t);if(!s.length){this.map.delete(e);return}this.map.set(e,s)},this.clear=()=>{this.map.clear()}}get topics(){return Array.from(this.map.keys())}}var as=Object.defineProperty,os=Object.defineProperties,hs=Object.getOwnPropertyDescriptors,it=Object.getOwnPropertySymbols,cs=Object.prototype.hasOwnProperty,ls=Object.prototype.propertyIsEnumerable,st=(r,e,t)=>e in r?as(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,k=(r,e)=>{for(var t in e||(e={}))cs.call(e,t)&&st(r,t,e[t]);if(it)for(var t of it(e))ls.call(e,t)&&st(r,t,e[t]);return r},ne=(r,e)=>os(r,hs(e));class rt extends x.ISubscriber{constructor(e,t){super(e,t),this.relayer=e,this.logger=t,this.subscriptions=new Map,this.topicMap=new ns,this.events=new U.EventEmitter,this.name=Ye,this.version=qe,this.pending=new Map,this.cached=[],this.initialized=!1,this.pendingSubscriptionWatchLabel="pending_sub_watch_label",this.pollingInterval=20,this.storagePrefix=N,this.subscribeTimeout=1e4,this.restartInProgress=!1,this.batchSubscribeTopicsLimit=500,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),this.registerEventListeners(),this.clientId=await this.relayer.core.crypto.getClientId())},this.subscribe=async(i,s)=>{await this.restartToComplete(),this.isInitialized(),this.logger.debug("Subscribing Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:i,opts:s}});try{const n=o.getRelayProtocolName(s),a={topic:i,relay:n};this.pending.set(i,a);const h=await this.rpcSubscribe(i,n);return this.onSubscribe(h,a),this.logger.debug("Successfully Subscribed Topic"),this.logger.trace({type:"method",method:"subscribe",params:{topic:i,opts:s}}),h}catch(n){throw this.logger.debug("Failed to Subscribe Topic"),this.logger.error(n),n}},this.unsubscribe=async(i,s)=>{await this.restartToComplete(),this.isInitialized(),typeof s?.id<"u"?await this.unsubscribeById(i,s.id,s):await this.unsubscribeByTopic(i,s)},this.isSubscribed=async i=>this.topics.includes(i)?!0:await new Promise((s,n)=>{const a=new g.Watch;a.start(this.pendingSubscriptionWatchLabel);const h=setInterval(()=>{!this.pending.has(i)&&this.topics.includes(i)&&(clearInterval(h),a.stop(this.pendingSubscriptionWatchLabel),s(!0)),a.elapsed(this.pendingSubscriptionWatchLabel)>=je&&(clearInterval(h),a.stop(this.pendingSubscriptionWatchLabel),n(new Error("Subscription resolution timeout")))},this.pollingInterval)}).catch(()=>!1),this.on=(i,s)=>{this.events.on(i,s)},this.once=(i,s)=>{this.events.once(i,s)},this.off=(i,s)=>{this.events.off(i,s)},this.removeListener=(i,s)=>{this.events.removeListener(i,s)},this.restart=async()=>{this.restartInProgress=!0,await this.restore(),await this.reset(),this.restartInProgress=!1},this.relayer=e,this.logger=l.generateChildLogger(t,this.name),this.clientId=""}get context(){return l.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.subscriptions.size}get ids(){return Array.from(this.subscriptions.keys())}get values(){return Array.from(this.subscriptions.values())}get topics(){return this.topicMap.topics}hasSubscription(e,t){let i=!1;try{i=this.getSubscription(e).topic===t}catch{}return i}onEnable(){this.cached=[],this.initialized=!0}onDisable(){this.cached=this.values,this.subscriptions.clear(),this.topicMap.clear()}async unsubscribeByTopic(e,t){const i=this.topicMap.get(e);await Promise.all(i.map(async s=>await this.unsubscribeById(e,s,t)))}async unsubscribeById(e,t,i){this.logger.debug("Unsubscribing Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:i}});try{const s=o.getRelayProtocolName(i);await this.rpcUnsubscribe(e,t,s);const n=o.getSdkError("USER_DISCONNECTED",`${this.name}, ${e}`);await this.onUnsubscribe(e,t,n),this.logger.debug("Successfully Unsubscribed Topic"),this.logger.trace({type:"method",method:"unsubscribe",params:{topic:e,id:t,opts:i}})}catch(s){throw this.logger.debug("Failed to Unsubscribe Topic"),this.logger.error(s),s}}async rpcSubscribe(e,t){const i={method:o.getRelayProtocolApi(t.protocol).subscribe,params:{topic:e}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:i});try{await await o.createExpiringPromise(this.relayer.request(i),this.subscribeTimeout)}catch{this.logger.debug("Outgoing Relay Subscribe Payload stalled"),this.relayer.events.emit(E.connection_stalled)}return o.hashMessage(e+this.clientId)}async rpcBatchSubscribe(e){if(!e.length)return;const t=e[0].relay,i={method:o.getRelayProtocolApi(t.protocol).batchSubscribe,params:{topics:e.map(s=>s.topic)}};this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:i});try{return await await o.createExpiringPromise(this.relayer.request(i),this.subscribeTimeout)}catch{this.logger.debug("Outgoing Relay Payload stalled"),this.relayer.events.emit(E.connection_stalled)}}rpcUnsubscribe(e,t,i){const s={method:o.getRelayProtocolApi(i.protocol).unsubscribe,params:{topic:e,id:t}};return this.logger.debug("Outgoing Relay Payload"),this.logger.trace({type:"payload",direction:"outgoing",request:s}),this.relayer.request(s)}onSubscribe(e,t){this.setSubscription(e,ne(k({},t),{id:e})),this.pending.delete(t.topic)}onBatchSubscribe(e){e.length&&e.forEach(t=>{this.setSubscription(t.id,k({},t)),this.pending.delete(t.topic)})}async onUnsubscribe(e,t,i){this.events.removeAllListeners(t),this.hasSubscription(t,e)&&this.deleteSubscription(t,i),await this.relayer.messages.del(e)}async setRelayerSubscriptions(e){await this.relayer.core.storage.setItem(this.storageKey,e)}async getRelayerSubscriptions(){return await this.relayer.core.storage.getItem(this.storageKey)}setSubscription(e,t){this.subscriptions.has(e)||(this.logger.debug("Setting subscription"),this.logger.trace({type:"method",method:"setSubscription",id:e,subscription:t}),this.addSubscription(e,t))}addSubscription(e,t){this.subscriptions.set(e,k({},t)),this.topicMap.set(t.topic,e),this.events.emit(_.created,t)}getSubscription(e){this.logger.debug("Getting subscription"),this.logger.trace({type:"method",method:"getSubscription",id:e});const t=this.subscriptions.get(e);if(!t){const{message:i}=o.getInternalError("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(i)}return t}deleteSubscription(e,t){this.logger.debug("Deleting subscription"),this.logger.trace({type:"method",method:"deleteSubscription",id:e,reason:t});const i=this.getSubscription(e);this.subscriptions.delete(e),this.topicMap.delete(i.topic,e),this.events.emit(_.deleted,ne(k({},i),{reason:t}))}async persist(){await this.setRelayerSubscriptions(this.values),this.events.emit(_.sync)}async reset(){if(this.cached.length){const e=Math.ceil(this.cached.length/this.batchSubscribeTopicsLimit);for(let t=0;t<e;t++){const i=this.cached.splice(0,this.batchSubscribeTopicsLimit);await this.batchSubscribe(i)}}this.events.emit(_.resubscribed)}async restore(){try{const e=await this.getRelayerSubscriptions();if(typeof e>"u"||!e.length)return;if(this.subscriptions.size){const{message:t}=o.getInternalError("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored subscriptions for ${this.name}`),this.logger.trace({type:"method",method:"restore",subscriptions:this.values})}catch(e){this.logger.debug(`Failed to Restore subscriptions for ${this.name}`),this.logger.error(e)}}async batchSubscribe(e){if(!e.length)return;const t=await this.rpcBatchSubscribe(e);o.isValidArray(t)&&this.onBatchSubscribe(t.map((i,s)=>ne(k({},e[s]),{id:i})))}async onConnect(){this.restartInProgress||(await this.restart(),this.onEnable())}onDisconnect(){this.onDisable()}async checkPending(){if(!this.initialized||this.relayer.transportExplicitlyClosed)return;const e=[];this.pending.forEach(t=>{e.push(t)}),await this.batchSubscribe(e)}registerEventListeners(){this.relayer.core.heartbeat.on($.HEARTBEAT_EVENTS.pulse,async()=>{await this.checkPending()}),this.relayer.on(E.connect,async()=>{await this.onConnect()}),this.relayer.on(E.disconnect,()=>{this.onDisconnect()}),this.events.on(_.created,async e=>{const t=_.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),await this.persist()}),this.events.on(_.deleted,async e=>{const t=_.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),await this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}async restartToComplete(){this.restartInProgress&&await new Promise(e=>{const t=setInterval(()=>{this.restartInProgress||(clearInterval(t),e())},this.pollingInterval)})}}var us=Object.defineProperty,nt=Object.getOwnPropertySymbols,gs=Object.prototype.hasOwnProperty,ds=Object.prototype.propertyIsEnumerable,at=(r,e,t)=>e in r?us(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,ps=(r,e)=>{for(var t in e||(e={}))gs.call(e,t)&&at(r,t,e[t]);if(nt)for(var t of nt(e))ds.call(e,t)&&at(r,t,e[t]);return r};class ot extends x.IRelayer{constructor(e){super(e),this.protocol="wc",this.version=2,this.events=new U.EventEmitter,this.name=Fe,this.transportExplicitlyClosed=!1,this.initialized=!1,this.connectionAttemptInProgress=!1,this.connectionStatusPollingInterval=20,this.staleConnectionErrors=["socket hang up","socket stalled"],this.hasExperiencedNetworkDisruption=!1,this.request=async t=>{this.logger.debug("Publishing Request Payload");try{return await this.toEstablishConnection(),await this.provider.request(t)}catch(i){throw this.logger.debug("Failed to Publish Request"),this.logger.error(i),i}},this.onPayloadHandler=t=>{this.onProviderPayload(t)},this.onConnectHandler=()=>{this.events.emit(E.connect)},this.onDisconnectHandler=()=>{this.onProviderDisconnect()},this.onProviderErrorHandler=t=>{this.logger.error(t),this.events.emit(E.error,t),this.logger.info("Fatal socket error received, closing transport"),this.transportClose()},this.registerProviderListeners=()=>{this.provider.on(P.payload,this.onPayloadHandler),this.provider.on(P.connect,this.onConnectHandler),this.provider.on(P.disconnect,this.onDisconnectHandler),this.provider.on(P.error,this.onProviderErrorHandler)},this.core=e.core,this.logger=typeof e.logger<"u"&&typeof e.logger!="string"?l.generateChildLogger(e.logger,this.name):l.pino(l.getDefaultLoggerOptions({level:e.logger||Ue})),this.messages=new tt(this.logger,e.core),this.subscriber=new rt(this,this.logger),this.publisher=new rs(this,this.logger),this.relayUrl=e?.relayUrl||ie,this.projectId=e.projectId,this.provider={}}async init(){this.logger.trace("Initialized"),this.registerEventListeners(),await this.createProvider(),await Promise.all([this.messages.init(),this.subscriber.init()]);try{await this.transportOpen()}catch{this.logger.warn(`Connection via ${this.relayUrl} failed, attempting to connect via failover domain ${se}...`),await this.restartTransport(se)}this.initialized=!0,setTimeout(async()=>{this.subscriber.topics.length===0&&(this.logger.info("No topics subscribed to after init, closing transport"),await this.transportClose(),this.transportExplicitlyClosed=!1)},Ve)}get context(){return l.getLoggerContext(this.logger)}get connected(){return this.provider.connection.connected}get connecting(){return this.provider.connection.connecting}async publish(e,t,i){this.isInitialized(),await this.publisher.publish(e,t,i),await this.recordMessageEvent({topic:e,message:t,publishedAt:Date.now()})}async subscribe(e,t){var i;this.isInitialized();let s=((i=this.subscriber.topicMap.get(e))==null?void 0:i[0])||"";return s||(await Promise.all([new Promise(n=>{this.subscriber.once(_.created,a=>{a.topic===e&&n()})}),new Promise(async n=>{s=await this.subscriber.subscribe(e,t),n()})]),s)}async unsubscribe(e,t){this.isInitialized(),await this.subscriber.unsubscribe(e,t)}on(e,t){this.events.on(e,t)}once(e,t){this.events.once(e,t)}off(e,t){this.events.off(e,t)}removeListener(e,t){this.events.removeListener(e,t)}async transportClose(){this.transportExplicitlyClosed=!0,this.hasExperiencedNetworkDisruption&&this.connected?await o.createExpiringPromise(this.provider.disconnect(),1e3,"provider.disconnect()").catch(()=>this.onProviderDisconnect()):this.connected&&await this.provider.disconnect()}async transportOpen(e){if(this.transportExplicitlyClosed=!1,await this.confirmOnlineStateOrThrow(),!this.connectionAttemptInProgress){e&&e!==this.relayUrl&&(this.relayUrl=e,await this.transportClose(),await this.createProvider()),this.connectionAttemptInProgress=!0;try{await Promise.all([new Promise(t=>{if(!this.initialized)return t();this.subscriber.once(_.resubscribed,()=>{t()})}),new Promise(async(t,i)=>{try{await o.createExpiringPromise(this.provider.connect(),1e4,`Socket stalled when trying to connect to ${this.relayUrl}`)}catch(s){i(s);return}t()})])}catch(t){this.logger.error(t);const i=t;if(!this.isConnectionStalled(i.message))throw t;this.provider.events.emit(P.disconnect)}finally{this.connectionAttemptInProgress=!1,this.hasExperiencedNetworkDisruption=!1}}}async restartTransport(e){await this.confirmOnlineStateOrThrow(),!this.connectionAttemptInProgress&&(this.relayUrl=e||this.relayUrl,await this.transportClose(),await this.createProvider(),await this.transportOpen())}async confirmOnlineStateOrThrow(){if(!await o.isOnline())throw new Error("No internet connection detected. Please restart your network and try again.")}isConnectionStalled(e){return this.staleConnectionErrors.some(t=>e.includes(t))}async createProvider(){this.provider.connection&&this.unregisterProviderListeners();const e=await this.core.crypto.signJWT(this.relayUrl);this.provider=new wt.JsonRpcProvider(new St.default(o.formatRelayRpcUrl({sdkVersion:Be,protocol:this.protocol,version:this.version,relayUrl:this.relayUrl,projectId:this.projectId,auth:e,useOnCloseEvent:!0}))),this.registerProviderListeners()}async recordMessageEvent(e){const{topic:t,message:i}=e;await this.messages.set(t,i)}async shouldIgnoreMessageEvent(e){const{topic:t,message:i}=e;if(!i||i.length===0)return this.logger.debug(`Ignoring invalid/empty message: ${i}`),!0;if(!await this.subscriber.isSubscribed(t))return this.logger.debug(`Ignoring message for non-subscribed topic ${t}`),!0;const s=this.messages.has(t,i);return s&&this.logger.debug(`Ignoring duplicate message: ${i}`),s}async onProviderPayload(e){if(this.logger.debug("Incoming Relay Payload"),this.logger.trace({type:"payload",direction:"incoming",payload:e}),f.isJsonRpcRequest(e)){if(!e.method.endsWith(Me))return;const t=e.params,{topic:i,message:s,publishedAt:n}=t.data,a={topic:i,message:s,publishedAt:n};this.logger.debug("Emitting Relayer Payload"),this.logger.trace(ps({type:"event",event:t.id},a)),this.events.emit(t.id,a),await this.acknowledgePayload(e),await this.onMessageEvent(a)}else f.isJsonRpcResponse(e)&&this.events.emit(E.message_ack,e)}async onMessageEvent(e){await this.shouldIgnoreMessageEvent(e)||(this.events.emit(E.message,e),await this.recordMessageEvent(e))}async acknowledgePayload(e){const t=f.formatJsonRpcResult(e.id,!0);await this.provider.connection.send(t)}unregisterProviderListeners(){this.provider.off(P.payload,this.onPayloadHandler),this.provider.off(P.connect,this.onConnectHandler),this.provider.off(P.disconnect,this.onDisconnectHandler),this.provider.off(P.error,this.onProviderErrorHandler)}async registerEventListeners(){this.events.on(E.connection_stalled,()=>{this.restartTransport().catch(t=>this.logger.error(t))});let e=await o.isOnline();o.subscribeToNetworkChange(async t=>{this.initialized&&e!==t&&(e=t,t?await this.restartTransport().catch(i=>this.logger.error(i)):(this.hasExperiencedNetworkDisruption=!0,await this.transportClose().catch(i=>this.logger.error(i))))})}onProviderDisconnect(){this.events.emit(E.disconnect),this.attemptToReconnect()}attemptToReconnect(){this.transportExplicitlyClosed||(this.logger.info("attemptToReconnect called. Connecting..."),setTimeout(async()=>{await this.restartTransport().catch(e=>this.logger.error(e))},g.toMiliseconds($e)))}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}async toEstablishConnection(){if(await this.confirmOnlineStateOrThrow(),!this.connected){if(this.connectionAttemptInProgress)return await new Promise(e=>{const t=setInterval(()=>{this.connected&&(clearInterval(t),e())},this.connectionStatusPollingInterval)});await this.restartTransport()}}}var Ds=Object.defineProperty,ht=Object.getOwnPropertySymbols,ys=Object.prototype.hasOwnProperty,Es=Object.prototype.propertyIsEnumerable,ct=(r,e,t)=>e in r?Ds(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,lt=(r,e)=>{for(var t in e||(e={}))ys.call(e,t)&&ct(r,t,e[t]);if(ht)for(var t of ht(e))Es.call(e,t)&&ct(r,t,e[t]);return r};class ut extends x.IStore{constructor(e,t,i,s=N,n=void 0){super(e,t,i,s),this.core=e,this.logger=t,this.name=i,this.map=new Map,this.version=ke,this.cached=[],this.initialized=!1,this.storagePrefix=N,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(a=>{this.getKey&&a!==null&&!o.isUndefined(a)?this.map.set(this.getKey(a),a):o.isProposalStruct(a)?this.map.set(a.id,a):o.isSessionStruct(a)&&this.map.set(a.topic,a)}),this.cached=[],this.initialized=!0)},this.set=async(a,h)=>{this.isInitialized(),this.map.has(a)?await this.update(a,h):(this.logger.debug("Setting value"),this.logger.trace({type:"method",method:"set",key:a,value:h}),this.map.set(a,h),await this.persist())},this.get=a=>(this.isInitialized(),this.logger.debug("Getting value"),this.logger.trace({type:"method",method:"get",key:a}),this.getData(a)),this.getAll=a=>(this.isInitialized(),a?this.values.filter(h=>Object.keys(a).every(c=>Ot.default(h[c],a[c]))):this.values),this.update=async(a,h)=>{this.isInitialized(),this.logger.debug("Updating value"),this.logger.trace({type:"method",method:"update",key:a,update:h});const c=lt(lt({},this.getData(a)),h);this.map.set(a,c),await this.persist()},this.delete=async(a,h)=>{this.isInitialized(),this.map.has(a)&&(this.logger.debug("Deleting value"),this.logger.trace({type:"method",method:"delete",key:a,reason:h}),this.map.delete(a),await this.persist())},this.logger=l.generateChildLogger(t,this.name),this.storagePrefix=s,this.getKey=n}get context(){return l.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.map.size}get keys(){return Array.from(this.map.keys())}get values(){return Array.from(this.map.values())}async setDataStore(e){await this.core.storage.setItem(this.storageKey,e)}async getDataStore(){return await this.core.storage.getItem(this.storageKey)}getData(e){const t=this.map.get(e);if(!t){const{message:i}=o.getInternalError("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(i),new Error(i)}return t}async persist(){await this.setDataStore(this.values)}async restore(){try{const e=await this.getDataStore();if(typeof e>"u"||!e.length)return;if(this.map.size){const{message:t}=o.getInternalError("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored value for ${this.name}`),this.logger.trace({type:"method",method:"restore",value:this.values})}catch(e){this.logger.debug(`Failed to Restore value for ${this.name}`),this.logger.error(e)}}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}}class gt{constructor(e,t){this.core=e,this.logger=t,this.name=Ge,this.version=He,this.events=new Ct.default,this.initialized=!1,this.storagePrefix=N,this.ignoredPayloadTypes=[o.TYPE_1],this.registeredMethods=[],this.init=async()=>{this.initialized||(await this.pairings.init(),await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.initialized=!0,this.logger.trace("Initialized"))},this.register=({methods:i})=>{this.isInitialized(),this.registeredMethods=[...new Set([...this.registeredMethods,...i])]},this.create=async()=>{this.isInitialized();const i=o.generateRandomBytes32(),s=await this.core.crypto.setSymKey(i),n=o.calcExpiry(g.FIVE_MINUTES),a={protocol:ze},h={topic:s,expiry:n,relay:a,active:!1},c=o.formatUri({protocol:this.core.protocol,version:this.core.version,topic:s,symKey:i,relay:a});return await this.pairings.set(s,h),await this.core.relayer.subscribe(s),this.core.expirer.set(s,n),{topic:s,uri:c}},this.pair=async i=>{this.isInitialized(),this.isValidPair(i);const{topic:s,symKey:n,relay:a}=o.parseUri(i.uri);let h;if(this.pairings.keys.includes(s)&&(h=this.pairings.get(s),h.active))throw new Error(`Pairing already exists: ${s}. Please try again with a new connection URI.`);this.core.crypto.keychain.has(s)||(await this.core.crypto.setSymKey(n,s),await this.core.relayer.subscribe(s,{relay:a}));const c=o.calcExpiry(g.FIVE_MINUTES),d={topic:s,relay:a,expiry:c,active:!1};return await this.pairings.set(s,d),this.core.expirer.set(s,c),i.activatePairing&&await this.activate({topic:s}),this.events.emit(V.create,d),d},this.activate=async({topic:i})=>{this.isInitialized();const s=o.calcExpiry(g.THIRTY_DAYS);await this.pairings.update(i,{active:!0,expiry:s}),this.core.expirer.set(i,s)},this.ping=async i=>{this.isInitialized(),await this.isValidPing(i);const{topic:s}=i;if(this.pairings.keys.includes(s)){const n=await this.sendRequest(s,"wc_pairingPing",{}),{done:a,resolve:h,reject:c}=o.createDelayedPromise();this.events.once(o.engineEvent("pairing_ping",n),({error:d})=>{d?c(d):h()}),await a()}},this.updateExpiry=async({topic:i,expiry:s})=>{this.isInitialized(),await this.pairings.update(i,{expiry:s})},this.updateMetadata=async({topic:i,metadata:s})=>{this.isInitialized(),await this.pairings.update(i,{peerMetadata:s})},this.getPairings=()=>(this.isInitialized(),this.pairings.values),this.disconnect=async i=>{this.isInitialized(),await this.isValidDisconnect(i);const{topic:s}=i;this.pairings.keys.includes(s)&&(await this.sendRequest(s,"wc_pairingDelete",o.getSdkError("USER_DISCONNECTED")),await this.deletePairing(s))},this.sendRequest=async(i,s,n)=>{const a=f.formatJsonRpcRequest(s,n),h=await this.core.crypto.encode(i,a),c=F[s].req;return this.core.history.set(i,a),this.core.relayer.publish(i,h,c),a.id},this.sendResult=async(i,s,n)=>{const a=f.formatJsonRpcResult(i,n),h=await this.core.crypto.encode(s,a),c=await this.core.history.get(s,i),d=F[c.request.method].res;await this.core.relayer.publish(s,h,d),await this.core.history.resolve(a)},this.sendError=async(i,s,n)=>{const a=f.formatJsonRpcError(i,n),h=await this.core.crypto.encode(s,a),c=await this.core.history.get(s,i),d=F[c.request.method]?F[c.request.method].res:F.unregistered_method.res;await this.core.relayer.publish(s,h,d),await this.core.history.resolve(a)},this.deletePairing=async(i,s)=>{await this.core.relayer.unsubscribe(i),await Promise.all([this.pairings.delete(i,o.getSdkError("USER_DISCONNECTED")),this.core.crypto.deleteSymKey(i),s?Promise.resolve():this.core.expirer.del(i)])},this.cleanup=async()=>{const i=this.pairings.getAll().filter(s=>o.isExpired(s.expiry));await Promise.all(i.map(s=>this.deletePairing(s.topic)))},this.onRelayEventRequest=i=>{const{topic:s,payload:n}=i;switch(n.method){case"wc_pairingPing":return this.onPairingPingRequest(s,n);case"wc_pairingDelete":return this.onPairingDeleteRequest(s,n);default:return this.onUnknownRpcMethodRequest(s,n)}},this.onRelayEventResponse=async i=>{const{topic:s,payload:n}=i,a=(await this.core.history.get(s,n.id)).request.method;switch(a){case"wc_pairingPing":return this.onPairingPingResponse(s,n);default:return this.onUnknownRpcMethodResponse(a)}},this.onPairingPingRequest=async(i,s)=>{const{id:n}=s;try{this.isValidPing({topic:i}),await this.sendResult(n,i,!0),this.events.emit(V.ping,{id:n,topic:i})}catch(a){await this.sendError(n,i,a),this.logger.error(a)}},this.onPairingPingResponse=(i,s)=>{const{id:n}=s;setTimeout(()=>{f.isJsonRpcResult(s)?this.events.emit(o.engineEvent("pairing_ping",n),{}):f.isJsonRpcError(s)&&this.events.emit(o.engineEvent("pairing_ping",n),{error:s.error})},500)},this.onPairingDeleteRequest=async(i,s)=>{const{id:n}=s;try{this.isValidDisconnect({topic:i}),await this.deletePairing(i),this.events.emit(V.delete,{id:n,topic:i})}catch(a){await this.sendError(n,i,a),this.logger.error(a)}},this.onUnknownRpcMethodRequest=async(i,s)=>{const{id:n,method:a}=s;try{if(this.registeredMethods.includes(a))return;const h=o.getSdkError("WC_METHOD_UNSUPPORTED",a);await this.sendError(n,i,h),this.logger.error(h)}catch(h){await this.sendError(n,i,h),this.logger.error(h)}},this.onUnknownRpcMethodResponse=i=>{this.registeredMethods.includes(i)||this.logger.error(o.getSdkError("WC_METHOD_UNSUPPORTED",i))},this.isValidPair=i=>{if(!o.isValidParams(i)){const{message:s}=o.getInternalError("MISSING_OR_INVALID",`pair() params: ${i}`);throw new Error(s)}if(!o.isValidUrl(i.uri)){const{message:s}=o.getInternalError("MISSING_OR_INVALID",`pair() uri: ${i.uri}`);throw new Error(s)}},this.isValidPing=async i=>{if(!o.isValidParams(i)){const{message:n}=o.getInternalError("MISSING_OR_INVALID",`ping() params: ${i}`);throw new Error(n)}const{topic:s}=i;await this.isValidPairingTopic(s)},this.isValidDisconnect=async i=>{if(!o.isValidParams(i)){const{message:n}=o.getInternalError("MISSING_OR_INVALID",`disconnect() params: ${i}`);throw new Error(n)}const{topic:s}=i;await this.isValidPairingTopic(s)},this.isValidPairingTopic=async i=>{if(!o.isValidString(i,!1)){const{message:s}=o.getInternalError("MISSING_OR_INVALID",`pairing topic should be a string: ${i}`);throw new Error(s)}if(!this.pairings.keys.includes(i)){const{message:s}=o.getInternalError("NO_MATCHING_KEY",`pairing topic doesn't exist: ${i}`);throw new Error(s)}if(o.isExpired(this.pairings.get(i).expiry)){await this.deletePairing(i);const{message:s}=o.getInternalError("EXPIRED",`pairing topic: ${i}`);throw new Error(s)}},this.core=e,this.logger=l.generateChildLogger(t,this.name),this.pairings=new ut(this.core,this.logger,this.name,this.storagePrefix)}get context(){return l.getLoggerContext(this.logger)}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}registerRelayerEvents(){this.core.relayer.on(E.message,async e=>{const{topic:t,message:i}=e;if(!this.pairings.keys.includes(t)||this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i)))return;const s=await this.core.crypto.decode(t,i);try{f.isJsonRpcRequest(s)?(this.core.history.set(t,s),this.onRelayEventRequest({topic:t,payload:s})):f.isJsonRpcResponse(s)&&(await this.core.history.resolve(s),await this.onRelayEventResponse({topic:t,payload:s}),this.core.history.delete(t,s.id))}catch(n){this.logger.error(n)}})}registerExpirerEvents(){this.core.expirer.on(w.expired,async e=>{const{topic:t}=o.parseExpirerTarget(e.target);t&&this.pairings.keys.includes(t)&&(await this.deletePairing(t,!0),this.events.emit(V.expire,{topic:t}))})}}class dt extends x.IJsonRpcHistory{constructor(e,t){super(e,t),this.core=e,this.logger=t,this.records=new Map,this.events=new U.EventEmitter,this.name=Xe,this.version=Je,this.cached=[],this.initialized=!1,this.storagePrefix=N,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(i=>this.records.set(i.id,i)),this.cached=[],this.registerEventListeners(),this.initialized=!0)},this.set=(i,s,n)=>{if(this.isInitialized(),this.logger.debug("Setting JSON-RPC request history record"),this.logger.trace({type:"method",method:"set",topic:i,request:s,chainId:n}),this.records.has(s.id))return;const a={id:s.id,topic:i,request:{method:s.method,params:s.params||null},chainId:n,expiry:o.calcExpiry(g.THIRTY_DAYS)};this.records.set(a.id,a),this.events.emit(C.created,a)},this.resolve=async i=>{if(this.isInitialized(),this.logger.debug("Updating JSON-RPC response history record"),this.logger.trace({type:"method",method:"update",response:i}),!this.records.has(i.id))return;const s=await this.getRecord(i.id);typeof s.response>"u"&&(s.response=f.isJsonRpcError(i)?{error:i.error}:{result:i.result},this.records.set(s.id,s),this.events.emit(C.updated,s))},this.get=async(i,s)=>(this.isInitialized(),this.logger.debug("Getting record"),this.logger.trace({type:"method",method:"get",topic:i,id:s}),await this.getRecord(s)),this.delete=(i,s)=>{this.isInitialized(),this.logger.debug("Deleting record"),this.logger.trace({type:"method",method:"delete",id:s}),this.values.forEach(n=>{if(n.topic===i){if(typeof s<"u"&&n.id!==s)return;this.records.delete(n.id),this.events.emit(C.deleted,n)}})},this.exists=async(i,s)=>(this.isInitialized(),this.records.has(s)?(await this.getRecord(s)).topic===i:!1),this.on=(i,s)=>{this.events.on(i,s)},this.once=(i,s)=>{this.events.once(i,s)},this.off=(i,s)=>{this.events.off(i,s)},this.removeListener=(i,s)=>{this.events.removeListener(i,s)},this.logger=l.generateChildLogger(t,this.name)}get context(){return l.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get size(){return this.records.size}get keys(){return Array.from(this.records.keys())}get values(){return Array.from(this.records.values())}get pending(){const e=[];return this.values.forEach(t=>{if(typeof t.response<"u")return;const i={topic:t.topic,request:f.formatJsonRpcRequest(t.request.method,t.request.params,t.id),chainId:t.chainId};return e.push(i)}),e}async setJsonRpcRecords(e){await this.core.storage.setItem(this.storageKey,e)}async getJsonRpcRecords(){return await this.core.storage.getItem(this.storageKey)}getRecord(e){this.isInitialized();const t=this.records.get(e);if(!t){const{message:i}=o.getInternalError("NO_MATCHING_KEY",`${this.name}: ${e}`);throw new Error(i)}return t}async persist(){await this.setJsonRpcRecords(this.values),this.events.emit(C.sync)}async restore(){try{const e=await this.getJsonRpcRecords();if(typeof e>"u"||!e.length)return;if(this.records.size){const{message:t}=o.getInternalError("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored records for ${this.name}`),this.logger.trace({type:"method",method:"restore",records:this.values})}catch(e){this.logger.debug(`Failed to Restore records for ${this.name}`),this.logger.error(e)}}registerEventListeners(){this.events.on(C.created,e=>{const t=C.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.events.on(C.updated,e=>{const t=C.updated;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.events.on(C.deleted,e=>{const t=C.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,record:e}),this.persist()}),this.core.heartbeat.on($.HEARTBEAT_EVENTS.pulse,()=>{this.cleanup()})}cleanup(){try{this.records.forEach(e=>{g.toMiliseconds(e.expiry||0)-Date.now()<=0&&(this.logger.info(`Deleting expired history log: ${e.id}`),this.delete(e.topic,e.id))})}catch(e){this.logger.warn(e)}}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}}class pt extends x.IExpirer{constructor(e,t){super(e,t),this.core=e,this.logger=t,this.expirations=new Map,this.events=new U.EventEmitter,this.name=We,this.version=Qe,this.cached=[],this.initialized=!1,this.storagePrefix=N,this.init=async()=>{this.initialized||(this.logger.trace("Initialized"),await this.restore(),this.cached.forEach(i=>this.expirations.set(i.target,i)),this.cached=[],this.registerEventListeners(),this.initialized=!0)},this.has=i=>{try{const s=this.formatTarget(i);return typeof this.getExpiration(s)<"u"}catch{return!1}},this.set=(i,s)=>{this.isInitialized();const n=this.formatTarget(i),a={target:n,expiry:s};this.expirations.set(n,a),this.checkExpiry(n,a),this.events.emit(w.created,{target:n,expiration:a})},this.get=i=>{this.isInitialized();const s=this.formatTarget(i);return this.getExpiration(s)},this.del=i=>{if(this.isInitialized(),this.has(i)){const s=this.formatTarget(i),n=this.getExpiration(s);this.expirations.delete(s),this.events.emit(w.deleted,{target:s,expiration:n})}},this.on=(i,s)=>{this.events.on(i,s)},this.once=(i,s)=>{this.events.once(i,s)},this.off=(i,s)=>{this.events.off(i,s)},this.removeListener=(i,s)=>{this.events.removeListener(i,s)},this.logger=l.generateChildLogger(t,this.name)}get context(){return l.getLoggerContext(this.logger)}get storageKey(){return this.storagePrefix+this.version+"//"+this.name}get length(){return this.expirations.size}get keys(){return Array.from(this.expirations.keys())}get values(){return Array.from(this.expirations.values())}formatTarget(e){if(typeof e=="string")return o.formatTopicTarget(e);if(typeof e=="number")return o.formatIdTarget(e);const{message:t}=o.getInternalError("UNKNOWN_TYPE",`Target type: ${typeof e}`);throw new Error(t)}async setExpirations(e){await this.core.storage.setItem(this.storageKey,e)}async getExpirations(){return await this.core.storage.getItem(this.storageKey)}async persist(){await this.setExpirations(this.values),this.events.emit(w.sync)}async restore(){try{const e=await this.getExpirations();if(typeof e>"u"||!e.length)return;if(this.expirations.size){const{message:t}=o.getInternalError("RESTORE_WILL_OVERRIDE",this.name);throw this.logger.error(t),new Error(t)}this.cached=e,this.logger.debug(`Successfully Restored expirations for ${this.name}`),this.logger.trace({type:"method",method:"restore",expirations:this.values})}catch(e){this.logger.debug(`Failed to Restore expirations for ${this.name}`),this.logger.error(e)}}getExpiration(e){const t=this.expirations.get(e);if(!t){const{message:i}=o.getInternalError("NO_MATCHING_KEY",`${this.name}: ${e}`);throw this.logger.error(i),new Error(i)}return t}checkExpiry(e,t){const{expiry:i}=t;g.toMiliseconds(i)-Date.now()<=0&&this.expire(e,t)}expire(e,t){this.expirations.delete(e),this.events.emit(w.expired,{target:e,expiration:t})}checkExpirations(){this.core.relayer.connected&&this.expirations.forEach((e,t)=>this.checkExpiry(t,e))}registerEventListeners(){this.core.heartbeat.on($.HEARTBEAT_EVENTS.pulse,()=>this.checkExpirations()),this.events.on(w.created,e=>{const t=w.created;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()}),this.events.on(w.expired,e=>{const t=w.expired;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()}),this.events.on(w.deleted,e=>{const t=w.deleted;this.logger.info(`Emitting ${t}`),this.logger.debug({type:"event",event:t,data:e}),this.persist()})}isInitialized(){if(!this.initialized){const{message:e}=o.getInternalError("NOT_INITIALIZED",this.name);throw new Error(e)}}}class Dt extends x.IVerify{constructor(e,t){super(e,t),this.projectId=e,this.logger=t,this.name=H,this.initialized=!1,this.queue=[],this.verifyDisabled=!1,this.init=async i=>{if(this.verifyDisabled||o.isReactNative()||!o.isBrowser())return;const s=i?.verifyUrl||X;this.verifyUrl!==s&&this.removeIframe(),this.verifyUrl=s;try{await this.createIframe()}catch(n){this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`),this.logger.info(n)}if(!this.initialized){this.removeIframe(),this.verifyUrl=re;try{await this.createIframe()}catch(n){this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`),this.logger.info(n),this.verifyDisabled=!0}}},this.register=async i=>{this.initialized?this.sendPost(i.attestationId):(this.addToQueue(i.attestationId),await this.init())},this.resolve=async i=>{if(this.isDevEnv)return"";const s=i?.verifyUrl||X;let n;try{n=await this.fetchAttestation(i.attestationId,s)}catch(a){this.logger.info(`failed to resolve attestation: ${i.attestationId} from url: ${s}`),this.logger.info(a),n=await this.fetchAttestation(i.attestationId,re)}return n},this.fetchAttestation=async(i,s)=>{this.logger.info(`resolving attestation: ${i} from url: ${s}`);const n=this.startAbortTimer(g.ONE_SECOND*2),a=await fetch(`${s}/attestation/${i}`,{signal:this.abortController.signal});return clearTimeout(n),a.status===200?await a.json():void 0},this.addToQueue=i=>{this.queue.push(i)},this.processQueue=()=>{this.queue.length!==0&&(this.queue.forEach(i=>this.sendPost(i)),this.queue=[])},this.sendPost=i=>{var s;try{if(!this.iframe)return;(s=this.iframe.contentWindow)==null||s.postMessage(i,"*"),this.logger.info(`postMessage sent: ${i} ${this.verifyUrl}`)}catch{}},this.createIframe=async()=>{let i;const s=n=>{n.data==="verify_ready"&&(this.initialized=!0,this.processQueue(),window.removeEventListener("message",s),i())};await Promise.race([new Promise(n=>{if(document.getElementById(H))return n();window.addEventListener("message",s);const a=document.createElement("iframe");a.id=H,a.src=`${this.verifyUrl}/${this.projectId}`,a.style.display="none",document.body.append(a),this.iframe=a,i=n}),new Promise((n,a)=>setTimeout(()=>{window.removeEventListener("message",s),a("verify iframe load timeout")},g.toMiliseconds(g.FIVE_SECONDS)))])},this.removeIframe=()=>{this.iframe&&(this.iframe.remove(),this.iframe=void 0,this.initialized=!1)},this.logger=l.generateChildLogger(t,this.name),this.verifyUrl=X,this.abortController=new AbortController,this.isDevEnv=o.isNode()&&process.env.IS_VITEST}get context(){return l.getLoggerContext(this.logger)}startAbortTimer(e){return this.abortController=new AbortController,setTimeout(()=>this.abortController.abort(),g.toMiliseconds(e))}}var bs=Object.defineProperty,yt=Object.getOwnPropertySymbols,ms=Object.prototype.hasOwnProperty,fs=Object.prototype.propertyIsEnumerable,Et=(r,e,t)=>e in r?bs(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,bt=(r,e)=>{for(var t in e||(e={}))ms.call(e,t)&&Et(r,t,e[t]);if(yt)for(var t of yt(e))fs.call(e,t)&&Et(r,t,e[t]);return r};class J extends x.ICore{constructor(e){super(e),this.protocol=ee,this.version=Re,this.name=G,this.events=new U.EventEmitter,this.initialized=!1,this.on=(i,s)=>this.events.on(i,s),this.once=(i,s)=>this.events.once(i,s),this.off=(i,s)=>this.events.off(i,s),this.removeListener=(i,s)=>this.events.removeListener(i,s),this.projectId=e?.projectId,this.relayUrl=e?.relayUrl||ie;const t=typeof e?.logger<"u"&&typeof e?.logger!="string"?e.logger:l.pino(l.getDefaultLoggerOptions({level:e?.logger||_e.logger}));this.logger=l.generateChildLogger(t,this.name),this.heartbeat=new $.HeartBeat,this.crypto=new et(this,this.logger,e?.keychain),this.history=new dt(this,this.logger),this.expirer=new pt(this,this.logger),this.storage=e!=null&&e.storage?e.storage:new Tt.default(bt(bt({},Ce),e?.storageOptions)),this.relayer=new ot({core:this,logger:this.logger,relayUrl:this.relayUrl,projectId:this.projectId}),this.pairing=new gt(this,this.logger),this.verify=new Dt(this.projectId||"",this.logger)}static async init(e){const t=new J(e);await t.initialize();const i=await t.crypto.getClientId();return await t.storage.setItem(Ke,i),t}get context(){return l.getLoggerContext(this.logger)}async start(){this.initialized||await this.initialize()}async initialize(){this.logger.trace("Initialized");try{await this.crypto.init(),await this.history.init(),await this.expirer.init(),await this.relayer.init(),await this.heartbeat.init(),await this.pairing.init(),this.initialized=!0,this.logger.info("Core Initialization Success")}catch(e){throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`,e),this.logger.error(e.message),e}}}const vs=J;exports.CORE_CONTEXT=G,exports.CORE_DEFAULT=_e,exports.CORE_PROTOCOL=ee,exports.CORE_STORAGE_OPTIONS=Ce,exports.CORE_STORAGE_PREFIX=N,exports.CORE_VERSION=Re,exports.CRYPTO_CLIENT_SEED=te,exports.CRYPTO_CONTEXT=Te,exports.CRYPTO_JWT_TTL=Se,exports.Core=vs,exports.Crypto=et,exports.EXPIRER_CONTEXT=We,exports.EXPIRER_DEFAULT_TTL=ss,exports.EXPIRER_EVENTS=w,exports.EXPIRER_STORAGE_VERSION=Qe,exports.Expirer=pt,exports.HISTORY_CONTEXT=Xe,exports.HISTORY_EVENTS=C,exports.HISTORY_STORAGE_VERSION=Je,exports.JsonRpcHistory=dt,exports.KEYCHAIN_CONTEXT=Oe,exports.KEYCHAIN_STORAGE_VERSION=Pe,exports.KeyChain=Ze,exports.MESSAGES_CONTEXT=Ae,exports.MESSAGES_STORAGE_VERSION=xe,exports.MessageTracker=tt,exports.PAIRING_CONTEXT=Ge,exports.PAIRING_DEFAULT_TTL=is,exports.PAIRING_EVENTS=V,exports.PAIRING_RPC_OPTS=F,exports.PAIRING_STORAGE_VERSION=He,exports.PENDING_SUB_RESOLUTION_TIMEOUT=je,exports.PUBLISHER_CONTEXT=Le,exports.PUBLISHER_DEFAULT_TTL=Ne,exports.Pairing=gt,exports.RELAYER_CONTEXT=Fe,exports.RELAYER_DEFAULT_LOGGER=Ue,exports.RELAYER_DEFAULT_PROTOCOL=ze,exports.RELAYER_DEFAULT_RELAY_URL=ie,exports.RELAYER_EVENTS=E,exports.RELAYER_FAILOVER_RELAY_URL=se,exports.RELAYER_PROVIDER_EVENTS=P,exports.RELAYER_RECONNECT_TIMEOUT=$e,exports.RELAYER_SDK_VERSION=Be,exports.RELAYER_STORAGE_OPTIONS=es,exports.RELAYER_SUBSCRIBER_SUFFIX=Me,exports.RELAYER_TRANSPORT_CUTOFF=Ve,exports.Relayer=ot,exports.STORE_STORAGE_VERSION=ke,exports.SUBSCRIBER_CONTEXT=Ye,exports.SUBSCRIBER_DEFAULT_TTL=ts,exports.SUBSCRIBER_EVENTS=_,exports.SUBSCRIBER_STORAGE_VERSION=qe,exports.Store=ut,exports.Subscriber=rt,exports.VERIFY_CONTEXT=H,exports.VERIFY_FALLBACK_SERVER=re,exports.VERIFY_SERVER=X,exports.Verify=Dt,exports.WALLETCONNECT_CLIENT_ID=Ke,exports["default"]=J;
//# sourceMappingURL=index.cjs.js.map


/***/ }),

/***/ 57069:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  EthereumProvider: () => (/* binding */ G),
  OPTIONAL_EVENTS: () => (/* binding */ _),
  OPTIONAL_METHODS: () => (/* binding */ E)
});

// UNUSED EXPORTS: REQUIRED_EVENTS, REQUIRED_METHODS, default

// EXTERNAL MODULE: external "events"
var external_events_ = __webpack_require__(82361);
var external_events_default = /*#__PURE__*/__webpack_require__.n(external_events_);
// EXTERNAL MODULE: ./node_modules/@walletconnect/utils/dist/index.cjs.js
var index_cjs = __webpack_require__(40491);
// EXTERNAL MODULE: ./node_modules/@walletconnect/sign-client/dist/index.cjs.js
var dist_index_cjs = __webpack_require__(66226);
// EXTERNAL MODULE: ./node_modules/@walletconnect/logger/dist/cjs/index.js
var cjs = __webpack_require__(3491);
// EXTERNAL MODULE: ./node_modules/@walletconnect/jsonrpc-http-connection/dist/cjs/index.js
var dist_cjs = __webpack_require__(65286);
var dist_cjs_default = /*#__PURE__*/__webpack_require__.n(dist_cjs);
// EXTERNAL MODULE: ./node_modules/@walletconnect/jsonrpc-provider/dist/cjs/index.js
var jsonrpc_provider_dist_cjs = __webpack_require__(32207);
;// CONCATENATED MODULE: ./node_modules/@walletconnect/universal-provider/dist/index.es.js
const Ia="error",Ug="wss://relay.walletconnect.com",Wg="wc",Fg="universal_provider",xa=`${Wg}@2:${Fg}:`,Mg="https://rpc.walletconnect.com/v1/",at={DEFAULT_CHAIN_CHANGED:"default_chain_changed"};var ge=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Ui={exports:{}};/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */(function(C,u){(function(){var i,d="4.17.21",w=200,T="Unsupported core-js use. Try https://npms.io/search?q=ponyfill.",U="Expected a function",En="Invalid `variable` option passed into `_.template`",zt="__lodash_hash_undefined__",pr=500,At="__lodash_placeholder__",Ln=1,Fn=2,Ct=4,It=1,ve=2,vn=1,ot=2,qi=4,Dn=8,xt=16,Nn=32,Et=64,Mn=128,Kt=256,dr=512,La=30,Da="...",Na=800,Ha=16,Bi=1,$a=2,Ua=3,ft=1/0,Vn=9007199254740991,Wa=17976931348623157e292,_e=0/0,Hn=4294967295,Fa=Hn-1,Ma=Hn>>>1,qa=[["ary",Mn],["bind",vn],["bindKey",ot],["curry",Dn],["curryRight",xt],["flip",dr],["partial",Nn],["partialRight",Et],["rearg",Kt]],yt="[object Arguments]",me="[object Array]",Ba="[object AsyncFunction]",Yt="[object Boolean]",Zt="[object Date]",Ga="[object DOMException]",we="[object Error]",Pe="[object Function]",Gi="[object GeneratorFunction]",yn="[object Map]",Jt="[object Number]",za="[object Null]",qn="[object Object]",zi="[object Promise]",Ka="[object Proxy]",Xt="[object RegExp]",Sn="[object Set]",Qt="[object String]",Ae="[object Symbol]",Ya="[object Undefined]",Vt="[object WeakMap]",Za="[object WeakSet]",kt="[object ArrayBuffer]",St="[object DataView]",gr="[object Float32Array]",vr="[object Float64Array]",_r="[object Int8Array]",mr="[object Int16Array]",wr="[object Int32Array]",Pr="[object Uint8Array]",Ar="[object Uint8ClampedArray]",Cr="[object Uint16Array]",Ir="[object Uint32Array]",Ja=/\b__p \+= '';/g,Xa=/\b(__p \+=) '' \+/g,Qa=/(__e\(.*?\)|\b__t\)) \+\n'';/g,Ki=/&(?:amp|lt|gt|quot|#39);/g,Yi=/[&<>"']/g,Va=RegExp(Ki.source),ka=RegExp(Yi.source),ja=/<%-([\s\S]+?)%>/g,no=/<%([\s\S]+?)%>/g,Zi=/<%=([\s\S]+?)%>/g,to=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,eo=/^\w*$/,ro=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,xr=/[\\^$.*+?()[\]{}|]/g,io=RegExp(xr.source),Er=/^\s+/,so=/\s/,uo=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ao=/\{\n\/\* \[wrapped with (.+)\] \*/,oo=/,? & /,fo=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,co=/[()=,{}\[\]\/\s]/,ho=/\\(\\)?/g,lo=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Ji=/\w*$/,po=/^[-+]0x[0-9a-f]+$/i,go=/^0b[01]+$/i,vo=/^\[object .+?Constructor\]$/,_o=/^0o[0-7]+$/i,mo=/^(?:0|[1-9]\d*)$/,wo=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Ce=/($^)/,Po=/['\n\r\u2028\u2029\\]/g,Ie="\\ud800-\\udfff",Ao="\\u0300-\\u036f",Co="\\ufe20-\\ufe2f",Io="\\u20d0-\\u20ff",Xi=Ao+Co+Io,Qi="\\u2700-\\u27bf",Vi="a-z\\xdf-\\xf6\\xf8-\\xff",xo="\\xac\\xb1\\xd7\\xf7",Eo="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",yo="\\u2000-\\u206f",So=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",ki="A-Z\\xc0-\\xd6\\xd8-\\xde",ji="\\ufe0e\\ufe0f",ns=xo+Eo+yo+So,yr="['\u2019]",Oo="["+Ie+"]",ts="["+ns+"]",xe="["+Xi+"]",es="\\d+",Ro="["+Qi+"]",rs="["+Vi+"]",is="[^"+Ie+ns+es+Qi+Vi+ki+"]",Sr="\\ud83c[\\udffb-\\udfff]",bo="(?:"+xe+"|"+Sr+")",ss="[^"+Ie+"]",Or="(?:\\ud83c[\\udde6-\\uddff]){2}",Rr="[\\ud800-\\udbff][\\udc00-\\udfff]",Ot="["+ki+"]",us="\\u200d",as="(?:"+rs+"|"+is+")",To="(?:"+Ot+"|"+is+")",os="(?:"+yr+"(?:d|ll|m|re|s|t|ve))?",fs="(?:"+yr+"(?:D|LL|M|RE|S|T|VE))?",cs=bo+"?",hs="["+ji+"]?",Lo="(?:"+us+"(?:"+[ss,Or,Rr].join("|")+")"+hs+cs+")*",Do="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",No="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",ls=hs+cs+Lo,Ho="(?:"+[Ro,Or,Rr].join("|")+")"+ls,$o="(?:"+[ss+xe+"?",xe,Or,Rr,Oo].join("|")+")",Uo=RegExp(yr,"g"),Wo=RegExp(xe,"g"),br=RegExp(Sr+"(?="+Sr+")|"+$o+ls,"g"),Fo=RegExp([Ot+"?"+rs+"+"+os+"(?="+[ts,Ot,"$"].join("|")+")",To+"+"+fs+"(?="+[ts,Ot+as,"$"].join("|")+")",Ot+"?"+as+"+"+os,Ot+"+"+fs,No,Do,es,Ho].join("|"),"g"),Mo=RegExp("["+us+Ie+Xi+ji+"]"),qo=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Bo=["Array","Buffer","DataView","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Map","Math","Object","Promise","RegExp","Set","String","Symbol","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","_","clearTimeout","isFinite","parseInt","setTimeout"],Go=-1,B={};B[gr]=B[vr]=B[_r]=B[mr]=B[wr]=B[Pr]=B[Ar]=B[Cr]=B[Ir]=!0,B[yt]=B[me]=B[kt]=B[Yt]=B[St]=B[Zt]=B[we]=B[Pe]=B[yn]=B[Jt]=B[qn]=B[Xt]=B[Sn]=B[Qt]=B[Vt]=!1;var q={};q[yt]=q[me]=q[kt]=q[St]=q[Yt]=q[Zt]=q[gr]=q[vr]=q[_r]=q[mr]=q[wr]=q[yn]=q[Jt]=q[qn]=q[Xt]=q[Sn]=q[Qt]=q[Ae]=q[Pr]=q[Ar]=q[Cr]=q[Ir]=!0,q[we]=q[Pe]=q[Vt]=!1;var zo={\u00C0:"A",\u00C1:"A",\u00C2:"A",\u00C3:"A",\u00C4:"A",\u00C5:"A",\u00E0:"a",\u00E1:"a",\u00E2:"a",\u00E3:"a",\u00E4:"a",\u00E5:"a",\u00C7:"C",\u00E7:"c",\u00D0:"D",\u00F0:"d",\u00C8:"E",\u00C9:"E",\u00CA:"E",\u00CB:"E",\u00E8:"e",\u00E9:"e",\u00EA:"e",\u00EB:"e",\u00CC:"I",\u00CD:"I",\u00CE:"I",\u00CF:"I",\u00EC:"i",\u00ED:"i",\u00EE:"i",\u00EF:"i",\u00D1:"N",\u00F1:"n",\u00D2:"O",\u00D3:"O",\u00D4:"O",\u00D5:"O",\u00D6:"O",\u00D8:"O",\u00F2:"o",\u00F3:"o",\u00F4:"o",\u00F5:"o",\u00F6:"o",\u00F8:"o",\u00D9:"U",\u00DA:"U",\u00DB:"U",\u00DC:"U",\u00F9:"u",\u00FA:"u",\u00FB:"u",\u00FC:"u",\u00DD:"Y",\u00FD:"y",\u00FF:"y",\u00C6:"Ae",\u00E6:"ae",\u00DE:"Th",\u00FE:"th",\u00DF:"ss",\u0100:"A",\u0102:"A",\u0104:"A",\u0101:"a",\u0103:"a",\u0105:"a",\u0106:"C",\u0108:"C",\u010A:"C",\u010C:"C",\u0107:"c",\u0109:"c",\u010B:"c",\u010D:"c",\u010E:"D",\u0110:"D",\u010F:"d",\u0111:"d",\u0112:"E",\u0114:"E",\u0116:"E",\u0118:"E",\u011A:"E",\u0113:"e",\u0115:"e",\u0117:"e",\u0119:"e",\u011B:"e",\u011C:"G",\u011E:"G",\u0120:"G",\u0122:"G",\u011D:"g",\u011F:"g",\u0121:"g",\u0123:"g",\u0124:"H",\u0126:"H",\u0125:"h",\u0127:"h",\u0128:"I",\u012A:"I",\u012C:"I",\u012E:"I",\u0130:"I",\u0129:"i",\u012B:"i",\u012D:"i",\u012F:"i",\u0131:"i",\u0134:"J",\u0135:"j",\u0136:"K",\u0137:"k",\u0138:"k",\u0139:"L",\u013B:"L",\u013D:"L",\u013F:"L",\u0141:"L",\u013A:"l",\u013C:"l",\u013E:"l",\u0140:"l",\u0142:"l",\u0143:"N",\u0145:"N",\u0147:"N",\u014A:"N",\u0144:"n",\u0146:"n",\u0148:"n",\u014B:"n",\u014C:"O",\u014E:"O",\u0150:"O",\u014D:"o",\u014F:"o",\u0151:"o",\u0154:"R",\u0156:"R",\u0158:"R",\u0155:"r",\u0157:"r",\u0159:"r",\u015A:"S",\u015C:"S",\u015E:"S",\u0160:"S",\u015B:"s",\u015D:"s",\u015F:"s",\u0161:"s",\u0162:"T",\u0164:"T",\u0166:"T",\u0163:"t",\u0165:"t",\u0167:"t",\u0168:"U",\u016A:"U",\u016C:"U",\u016E:"U",\u0170:"U",\u0172:"U",\u0169:"u",\u016B:"u",\u016D:"u",\u016F:"u",\u0171:"u",\u0173:"u",\u0174:"W",\u0175:"w",\u0176:"Y",\u0177:"y",\u0178:"Y",\u0179:"Z",\u017B:"Z",\u017D:"Z",\u017A:"z",\u017C:"z",\u017E:"z",\u0132:"IJ",\u0133:"ij",\u0152:"Oe",\u0153:"oe",\u0149:"'n",\u017F:"s"},Ko={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Yo={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"},Zo={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Jo=parseFloat,Xo=parseInt,ps=typeof ge=="object"&&ge&&ge.Object===Object&&ge,Qo=typeof self=="object"&&self&&self.Object===Object&&self,k=ps||Qo||Function("return this")(),Tr=u&&!u.nodeType&&u,ct=Tr&&!0&&C&&!C.nodeType&&C,ds=ct&&ct.exports===Tr,Lr=ds&&ps.process,_n=function(){try{var h=ct&&ct.require&&ct.require("util").types;return h||Lr&&Lr.binding&&Lr.binding("util")}catch{}}(),gs=_n&&_n.isArrayBuffer,vs=_n&&_n.isDate,_s=_n&&_n.isMap,ms=_n&&_n.isRegExp,ws=_n&&_n.isSet,Ps=_n&&_n.isTypedArray;function cn(h,g,p){switch(p.length){case 0:return h.call(g);case 1:return h.call(g,p[0]);case 2:return h.call(g,p[0],p[1]);case 3:return h.call(g,p[0],p[1],p[2])}return h.apply(g,p)}function Vo(h,g,p,A){for(var S=-1,$=h==null?0:h.length;++S<$;){var X=h[S];g(A,X,p(X),h)}return A}function mn(h,g){for(var p=-1,A=h==null?0:h.length;++p<A&&g(h[p],p,h)!==!1;);return h}function ko(h,g){for(var p=h==null?0:h.length;p--&&g(h[p],p,h)!==!1;);return h}function As(h,g){for(var p=-1,A=h==null?0:h.length;++p<A;)if(!g(h[p],p,h))return!1;return!0}function kn(h,g){for(var p=-1,A=h==null?0:h.length,S=0,$=[];++p<A;){var X=h[p];g(X,p,h)&&($[S++]=X)}return $}function Ee(h,g){var p=h==null?0:h.length;return!!p&&Rt(h,g,0)>-1}function Dr(h,g,p){for(var A=-1,S=h==null?0:h.length;++A<S;)if(p(g,h[A]))return!0;return!1}function G(h,g){for(var p=-1,A=h==null?0:h.length,S=Array(A);++p<A;)S[p]=g(h[p],p,h);return S}function jn(h,g){for(var p=-1,A=g.length,S=h.length;++p<A;)h[S+p]=g[p];return h}function Nr(h,g,p,A){var S=-1,$=h==null?0:h.length;for(A&&$&&(p=h[++S]);++S<$;)p=g(p,h[S],S,h);return p}function jo(h,g,p,A){var S=h==null?0:h.length;for(A&&S&&(p=h[--S]);S--;)p=g(p,h[S],S,h);return p}function Hr(h,g){for(var p=-1,A=h==null?0:h.length;++p<A;)if(g(h[p],p,h))return!0;return!1}var nf=$r("length");function tf(h){return h.split("")}function ef(h){return h.match(fo)||[]}function Cs(h,g,p){var A;return p(h,function(S,$,X){if(g(S,$,X))return A=$,!1}),A}function ye(h,g,p,A){for(var S=h.length,$=p+(A?1:-1);A?$--:++$<S;)if(g(h[$],$,h))return $;return-1}function Rt(h,g,p){return g===g?gf(h,g,p):ye(h,Is,p)}function rf(h,g,p,A){for(var S=p-1,$=h.length;++S<$;)if(A(h[S],g))return S;return-1}function Is(h){return h!==h}function xs(h,g){var p=h==null?0:h.length;return p?Wr(h,g)/p:_e}function $r(h){return function(g){return g==null?i:g[h]}}function Ur(h){return function(g){return h==null?i:h[g]}}function Es(h,g,p,A,S){return S(h,function($,X,M){p=A?(A=!1,$):g(p,$,X,M)}),p}function sf(h,g){var p=h.length;for(h.sort(g);p--;)h[p]=h[p].value;return h}function Wr(h,g){for(var p,A=-1,S=h.length;++A<S;){var $=g(h[A]);$!==i&&(p=p===i?$:p+$)}return p}function Fr(h,g){for(var p=-1,A=Array(h);++p<h;)A[p]=g(p);return A}function uf(h,g){return G(g,function(p){return[p,h[p]]})}function ys(h){return h&&h.slice(0,bs(h)+1).replace(Er,"")}function hn(h){return function(g){return h(g)}}function Mr(h,g){return G(g,function(p){return h[p]})}function jt(h,g){return h.has(g)}function Ss(h,g){for(var p=-1,A=h.length;++p<A&&Rt(g,h[p],0)>-1;);return p}function Os(h,g){for(var p=h.length;p--&&Rt(g,h[p],0)>-1;);return p}function af(h,g){for(var p=h.length,A=0;p--;)h[p]===g&&++A;return A}var of=Ur(zo),ff=Ur(Ko);function cf(h){return"\\"+Zo[h]}function hf(h,g){return h==null?i:h[g]}function bt(h){return Mo.test(h)}function lf(h){return qo.test(h)}function pf(h){for(var g,p=[];!(g=h.next()).done;)p.push(g.value);return p}function qr(h){var g=-1,p=Array(h.size);return h.forEach(function(A,S){p[++g]=[S,A]}),p}function Rs(h,g){return function(p){return h(g(p))}}function nt(h,g){for(var p=-1,A=h.length,S=0,$=[];++p<A;){var X=h[p];(X===g||X===At)&&(h[p]=At,$[S++]=p)}return $}function Se(h){var g=-1,p=Array(h.size);return h.forEach(function(A){p[++g]=A}),p}function df(h){var g=-1,p=Array(h.size);return h.forEach(function(A){p[++g]=[A,A]}),p}function gf(h,g,p){for(var A=p-1,S=h.length;++A<S;)if(h[A]===g)return A;return-1}function vf(h,g,p){for(var A=p+1;A--;)if(h[A]===g)return A;return A}function Tt(h){return bt(h)?mf(h):nf(h)}function On(h){return bt(h)?wf(h):tf(h)}function bs(h){for(var g=h.length;g--&&so.test(h.charAt(g)););return g}var _f=Ur(Yo);function mf(h){for(var g=br.lastIndex=0;br.test(h);)++g;return g}function wf(h){return h.match(br)||[]}function Pf(h){return h.match(Fo)||[]}var Af=function h(g){g=g==null?k:Lt.defaults(k.Object(),g,Lt.pick(k,Bo));var p=g.Array,A=g.Date,S=g.Error,$=g.Function,X=g.Math,M=g.Object,Br=g.RegExp,Cf=g.String,wn=g.TypeError,Oe=p.prototype,If=$.prototype,Dt=M.prototype,Re=g["__core-js_shared__"],be=If.toString,F=Dt.hasOwnProperty,xf=0,Ts=function(){var n=/[^.]+$/.exec(Re&&Re.keys&&Re.keys.IE_PROTO||"");return n?"Symbol(src)_1."+n:""}(),Te=Dt.toString,Ef=be.call(M),yf=k._,Sf=Br("^"+be.call(F).replace(xr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Le=ds?g.Buffer:i,tt=g.Symbol,De=g.Uint8Array,Ls=Le?Le.allocUnsafe:i,Ne=Rs(M.getPrototypeOf,M),Ds=M.create,Ns=Dt.propertyIsEnumerable,He=Oe.splice,Hs=tt?tt.isConcatSpreadable:i,ne=tt?tt.iterator:i,ht=tt?tt.toStringTag:i,$e=function(){try{var n=vt(M,"defineProperty");return n({},"",{}),n}catch{}}(),Of=g.clearTimeout!==k.clearTimeout&&g.clearTimeout,Rf=A&&A.now!==k.Date.now&&A.now,bf=g.setTimeout!==k.setTimeout&&g.setTimeout,Ue=X.ceil,We=X.floor,Gr=M.getOwnPropertySymbols,Tf=Le?Le.isBuffer:i,$s=g.isFinite,Lf=Oe.join,Df=Rs(M.keys,M),Q=X.max,nn=X.min,Nf=A.now,Hf=g.parseInt,Us=X.random,$f=Oe.reverse,zr=vt(g,"DataView"),te=vt(g,"Map"),Kr=vt(g,"Promise"),Nt=vt(g,"Set"),ee=vt(g,"WeakMap"),re=vt(M,"create"),Fe=ee&&new ee,Ht={},Uf=_t(zr),Wf=_t(te),Ff=_t(Kr),Mf=_t(Nt),qf=_t(ee),Me=tt?tt.prototype:i,ie=Me?Me.valueOf:i,Ws=Me?Me.toString:i;function a(n){if(K(n)&&!O(n)&&!(n instanceof N)){if(n instanceof Pn)return n;if(F.call(n,"__wrapped__"))return Fu(n)}return new Pn(n)}var $t=function(){function n(){}return function(t){if(!z(t))return{};if(Ds)return Ds(t);n.prototype=t;var e=new n;return n.prototype=i,e}}();function qe(){}function Pn(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=i}a.templateSettings={escape:ja,evaluate:no,interpolate:Zi,variable:"",imports:{_:a}},a.prototype=qe.prototype,a.prototype.constructor=a,Pn.prototype=$t(qe.prototype),Pn.prototype.constructor=Pn;function N(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=!1,this.__iteratees__=[],this.__takeCount__=Hn,this.__views__=[]}function Bf(){var n=new N(this.__wrapped__);return n.__actions__=un(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=un(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=un(this.__views__),n}function Gf(){if(this.__filtered__){var n=new N(this);n.__dir__=-1,n.__filtered__=!0}else n=this.clone(),n.__dir__*=-1;return n}function zf(){var n=this.__wrapped__.value(),t=this.__dir__,e=O(n),r=t<0,s=e?n.length:0,o=eh(0,s,this.__views__),f=o.start,c=o.end,l=c-f,v=r?c:f-1,_=this.__iteratees__,m=_.length,P=0,I=nn(l,this.__takeCount__);if(!e||!r&&s==l&&I==l)return ou(n,this.__actions__);var E=[];n:for(;l--&&P<I;){v+=t;for(var b=-1,y=n[v];++b<m;){var D=_[b],H=D.iteratee,dn=D.type,sn=H(y);if(dn==$a)y=sn;else if(!sn){if(dn==Bi)continue n;break n}}E[P++]=y}return E}N.prototype=$t(qe.prototype),N.prototype.constructor=N;function lt(n){var t=-1,e=n==null?0:n.length;for(this.clear();++t<e;){var r=n[t];this.set(r[0],r[1])}}function Kf(){this.__data__=re?re(null):{},this.size=0}function Yf(n){var t=this.has(n)&&delete this.__data__[n];return this.size-=t?1:0,t}function Zf(n){var t=this.__data__;if(re){var e=t[n];return e===zt?i:e}return F.call(t,n)?t[n]:i}function Jf(n){var t=this.__data__;return re?t[n]!==i:F.call(t,n)}function Xf(n,t){var e=this.__data__;return this.size+=this.has(n)?0:1,e[n]=re&&t===i?zt:t,this}lt.prototype.clear=Kf,lt.prototype.delete=Yf,lt.prototype.get=Zf,lt.prototype.has=Jf,lt.prototype.set=Xf;function Bn(n){var t=-1,e=n==null?0:n.length;for(this.clear();++t<e;){var r=n[t];this.set(r[0],r[1])}}function Qf(){this.__data__=[],this.size=0}function Vf(n){var t=this.__data__,e=Be(t,n);if(e<0)return!1;var r=t.length-1;return e==r?t.pop():He.call(t,e,1),--this.size,!0}function kf(n){var t=this.__data__,e=Be(t,n);return e<0?i:t[e][1]}function jf(n){return Be(this.__data__,n)>-1}function nc(n,t){var e=this.__data__,r=Be(e,n);return r<0?(++this.size,e.push([n,t])):e[r][1]=t,this}Bn.prototype.clear=Qf,Bn.prototype.delete=Vf,Bn.prototype.get=kf,Bn.prototype.has=jf,Bn.prototype.set=nc;function Gn(n){var t=-1,e=n==null?0:n.length;for(this.clear();++t<e;){var r=n[t];this.set(r[0],r[1])}}function tc(){this.size=0,this.__data__={hash:new lt,map:new(te||Bn),string:new lt}}function ec(n){var t=nr(this,n).delete(n);return this.size-=t?1:0,t}function rc(n){return nr(this,n).get(n)}function ic(n){return nr(this,n).has(n)}function sc(n,t){var e=nr(this,n),r=e.size;return e.set(n,t),this.size+=e.size==r?0:1,this}Gn.prototype.clear=tc,Gn.prototype.delete=ec,Gn.prototype.get=rc,Gn.prototype.has=ic,Gn.prototype.set=sc;function pt(n){var t=-1,e=n==null?0:n.length;for(this.__data__=new Gn;++t<e;)this.add(n[t])}function uc(n){return this.__data__.set(n,zt),this}function ac(n){return this.__data__.has(n)}pt.prototype.add=pt.prototype.push=uc,pt.prototype.has=ac;function Rn(n){var t=this.__data__=new Bn(n);this.size=t.size}function oc(){this.__data__=new Bn,this.size=0}function fc(n){var t=this.__data__,e=t.delete(n);return this.size=t.size,e}function cc(n){return this.__data__.get(n)}function hc(n){return this.__data__.has(n)}function lc(n,t){var e=this.__data__;if(e instanceof Bn){var r=e.__data__;if(!te||r.length<w-1)return r.push([n,t]),this.size=++e.size,this;e=this.__data__=new Gn(r)}return e.set(n,t),this.size=e.size,this}Rn.prototype.clear=oc,Rn.prototype.delete=fc,Rn.prototype.get=cc,Rn.prototype.has=hc,Rn.prototype.set=lc;function Fs(n,t){var e=O(n),r=!e&&mt(n),s=!e&&!r&&ut(n),o=!e&&!r&&!s&&Mt(n),f=e||r||s||o,c=f?Fr(n.length,Cf):[],l=c.length;for(var v in n)(t||F.call(n,v))&&!(f&&(v=="length"||s&&(v=="offset"||v=="parent")||o&&(v=="buffer"||v=="byteLength"||v=="byteOffset")||Zn(v,l)))&&c.push(v);return c}function Ms(n){var t=n.length;return t?n[ei(0,t-1)]:i}function pc(n,t){return tr(un(n),dt(t,0,n.length))}function dc(n){return tr(un(n))}function Yr(n,t,e){(e!==i&&!bn(n[t],e)||e===i&&!(t in n))&&zn(n,t,e)}function se(n,t,e){var r=n[t];(!(F.call(n,t)&&bn(r,e))||e===i&&!(t in n))&&zn(n,t,e)}function Be(n,t){for(var e=n.length;e--;)if(bn(n[e][0],t))return e;return-1}function gc(n,t,e,r){return et(n,function(s,o,f){t(r,s,e(s),f)}),r}function qs(n,t){return n&&Un(t,V(t),n)}function vc(n,t){return n&&Un(t,on(t),n)}function zn(n,t,e){t=="__proto__"&&$e?$e(n,t,{configurable:!0,enumerable:!0,value:e,writable:!0}):n[t]=e}function Zr(n,t){for(var e=-1,r=t.length,s=p(r),o=n==null;++e<r;)s[e]=o?i:Si(n,t[e]);return s}function dt(n,t,e){return n===n&&(e!==i&&(n=n<=e?n:e),t!==i&&(n=n>=t?n:t)),n}function An(n,t,e,r,s,o){var f,c=t&Ln,l=t&Fn,v=t&Ct;if(e&&(f=s?e(n,r,s,o):e(n)),f!==i)return f;if(!z(n))return n;var _=O(n);if(_){if(f=ih(n),!c)return un(n,f)}else{var m=tn(n),P=m==Pe||m==Gi;if(ut(n))return hu(n,c);if(m==qn||m==yt||P&&!s){if(f=l||P?{}:bu(n),!c)return l?Zc(n,vc(f,n)):Yc(n,qs(f,n))}else{if(!q[m])return s?n:{};f=sh(n,m,c)}}o||(o=new Rn);var I=o.get(n);if(I)return I;o.set(n,f),sa(n)?n.forEach(function(y){f.add(An(y,t,e,y,n,o))}):ra(n)&&n.forEach(function(y,D){f.set(D,An(y,t,e,D,n,o))});var E=v?l?pi:li:l?on:V,b=_?i:E(n);return mn(b||n,function(y,D){b&&(D=y,y=n[D]),se(f,D,An(y,t,e,D,n,o))}),f}function _c(n){var t=V(n);return function(e){return Bs(e,n,t)}}function Bs(n,t,e){var r=e.length;if(n==null)return!r;for(n=M(n);r--;){var s=e[r],o=t[s],f=n[s];if(f===i&&!(s in n)||!o(f))return!1}return!0}function Gs(n,t,e){if(typeof n!="function")throw new wn(U);return le(function(){n.apply(i,e)},t)}function ue(n,t,e,r){var s=-1,o=Ee,f=!0,c=n.length,l=[],v=t.length;if(!c)return l;e&&(t=G(t,hn(e))),r?(o=Dr,f=!1):t.length>=w&&(o=jt,f=!1,t=new pt(t));n:for(;++s<c;){var _=n[s],m=e==null?_:e(_);if(_=r||_!==0?_:0,f&&m===m){for(var P=v;P--;)if(t[P]===m)continue n;l.push(_)}else o(t,m,r)||l.push(_)}return l}var et=vu($n),zs=vu(Xr,!0);function mc(n,t){var e=!0;return et(n,function(r,s,o){return e=!!t(r,s,o),e}),e}function Ge(n,t,e){for(var r=-1,s=n.length;++r<s;){var o=n[r],f=t(o);if(f!=null&&(c===i?f===f&&!pn(f):e(f,c)))var c=f,l=o}return l}function wc(n,t,e,r){var s=n.length;for(e=R(e),e<0&&(e=-e>s?0:s+e),r=r===i||r>s?s:R(r),r<0&&(r+=s),r=e>r?0:aa(r);e<r;)n[e++]=t;return n}function Ks(n,t){var e=[];return et(n,function(r,s,o){t(r,s,o)&&e.push(r)}),e}function j(n,t,e,r,s){var o=-1,f=n.length;for(e||(e=ah),s||(s=[]);++o<f;){var c=n[o];t>0&&e(c)?t>1?j(c,t-1,e,r,s):jn(s,c):r||(s[s.length]=c)}return s}var Jr=_u(),Ys=_u(!0);function $n(n,t){return n&&Jr(n,t,V)}function Xr(n,t){return n&&Ys(n,t,V)}function ze(n,t){return kn(t,function(e){return Jn(n[e])})}function gt(n,t){t=it(t,n);for(var e=0,r=t.length;n!=null&&e<r;)n=n[Wn(t[e++])];return e&&e==r?n:i}function Zs(n,t,e){var r=t(n);return O(n)?r:jn(r,e(n))}function en(n){return n==null?n===i?Ya:za:ht&&ht in M(n)?th(n):dh(n)}function Qr(n,t){return n>t}function Pc(n,t){return n!=null&&F.call(n,t)}function Ac(n,t){return n!=null&&t in M(n)}function Cc(n,t,e){return n>=nn(t,e)&&n<Q(t,e)}function Vr(n,t,e){for(var r=e?Dr:Ee,s=n[0].length,o=n.length,f=o,c=p(o),l=1/0,v=[];f--;){var _=n[f];f&&t&&(_=G(_,hn(t))),l=nn(_.length,l),c[f]=!e&&(t||s>=120&&_.length>=120)?new pt(f&&_):i}_=n[0];var m=-1,P=c[0];n:for(;++m<s&&v.length<l;){var I=_[m],E=t?t(I):I;if(I=e||I!==0?I:0,!(P?jt(P,E):r(v,E,e))){for(f=o;--f;){var b=c[f];if(!(b?jt(b,E):r(n[f],E,e)))continue n}P&&P.push(E),v.push(I)}}return v}function Ic(n,t,e,r){return $n(n,function(s,o,f){t(r,e(s),o,f)}),r}function ae(n,t,e){t=it(t,n),n=Nu(n,t);var r=n==null?n:n[Wn(In(t))];return r==null?i:cn(r,n,e)}function Js(n){return K(n)&&en(n)==yt}function xc(n){return K(n)&&en(n)==kt}function Ec(n){return K(n)&&en(n)==Zt}function oe(n,t,e,r,s){return n===t?!0:n==null||t==null||!K(n)&&!K(t)?n!==n&&t!==t:yc(n,t,e,r,oe,s)}function yc(n,t,e,r,s,o){var f=O(n),c=O(t),l=f?me:tn(n),v=c?me:tn(t);l=l==yt?qn:l,v=v==yt?qn:v;var _=l==qn,m=v==qn,P=l==v;if(P&&ut(n)){if(!ut(t))return!1;f=!0,_=!1}if(P&&!_)return o||(o=new Rn),f||Mt(n)?Su(n,t,e,r,s,o):jc(n,t,l,e,r,s,o);if(!(e&It)){var I=_&&F.call(n,"__wrapped__"),E=m&&F.call(t,"__wrapped__");if(I||E){var b=I?n.value():n,y=E?t.value():t;return o||(o=new Rn),s(b,y,e,r,o)}}return P?(o||(o=new Rn),nh(n,t,e,r,s,o)):!1}function Sc(n){return K(n)&&tn(n)==yn}function kr(n,t,e,r){var s=e.length,o=s,f=!r;if(n==null)return!o;for(n=M(n);s--;){var c=e[s];if(f&&c[2]?c[1]!==n[c[0]]:!(c[0]in n))return!1}for(;++s<o;){c=e[s];var l=c[0],v=n[l],_=c[1];if(f&&c[2]){if(v===i&&!(l in n))return!1}else{var m=new Rn;if(r)var P=r(v,_,l,n,t,m);if(!(P===i?oe(_,v,It|ve,r,m):P))return!1}}return!0}function Xs(n){if(!z(n)||fh(n))return!1;var t=Jn(n)?Sf:vo;return t.test(_t(n))}function Oc(n){return K(n)&&en(n)==Xt}function Rc(n){return K(n)&&tn(n)==Sn}function bc(n){return K(n)&&ar(n.length)&&!!B[en(n)]}function Qs(n){return typeof n=="function"?n:n==null?fn:typeof n=="object"?O(n)?js(n[0],n[1]):ks(n):ma(n)}function jr(n){if(!he(n))return Df(n);var t=[];for(var e in M(n))F.call(n,e)&&e!="constructor"&&t.push(e);return t}function Tc(n){if(!z(n))return ph(n);var t=he(n),e=[];for(var r in n)r=="constructor"&&(t||!F.call(n,r))||e.push(r);return e}function ni(n,t){return n<t}function Vs(n,t){var e=-1,r=an(n)?p(n.length):[];return et(n,function(s,o,f){r[++e]=t(s,o,f)}),r}function ks(n){var t=gi(n);return t.length==1&&t[0][2]?Lu(t[0][0],t[0][1]):function(e){return e===n||kr(e,n,t)}}function js(n,t){return _i(n)&&Tu(t)?Lu(Wn(n),t):function(e){var r=Si(e,n);return r===i&&r===t?Oi(e,n):oe(t,r,It|ve)}}function Ke(n,t,e,r,s){n!==t&&Jr(t,function(o,f){if(s||(s=new Rn),z(o))Lc(n,t,f,e,Ke,r,s);else{var c=r?r(wi(n,f),o,f+"",n,t,s):i;c===i&&(c=o),Yr(n,f,c)}},on)}function Lc(n,t,e,r,s,o,f){var c=wi(n,e),l=wi(t,e),v=f.get(l);if(v){Yr(n,e,v);return}var _=o?o(c,l,e+"",n,t,f):i,m=_===i;if(m){var P=O(l),I=!P&&ut(l),E=!P&&!I&&Mt(l);_=l,P||I||E?O(c)?_=c:Y(c)?_=un(c):I?(m=!1,_=hu(l,!0)):E?(m=!1,_=lu(l,!0)):_=[]:pe(l)||mt(l)?(_=c,mt(c)?_=oa(c):(!z(c)||Jn(c))&&(_=bu(l))):m=!1}m&&(f.set(l,_),s(_,l,r,o,f),f.delete(l)),Yr(n,e,_)}function nu(n,t){var e=n.length;if(e)return t+=t<0?e:0,Zn(t,e)?n[t]:i}function tu(n,t,e){t.length?t=G(t,function(o){return O(o)?function(f){return gt(f,o.length===1?o[0]:o)}:o}):t=[fn];var r=-1;t=G(t,hn(x()));var s=Vs(n,function(o,f,c){var l=G(t,function(v){return v(o)});return{criteria:l,index:++r,value:o}});return sf(s,function(o,f){return Kc(o,f,e)})}function Dc(n,t){return eu(n,t,function(e,r){return Oi(n,r)})}function eu(n,t,e){for(var r=-1,s=t.length,o={};++r<s;){var f=t[r],c=gt(n,f);e(c,f)&&fe(o,it(f,n),c)}return o}function Nc(n){return function(t){return gt(t,n)}}function ti(n,t,e,r){var s=r?rf:Rt,o=-1,f=t.length,c=n;for(n===t&&(t=un(t)),e&&(c=G(n,hn(e)));++o<f;)for(var l=0,v=t[o],_=e?e(v):v;(l=s(c,_,l,r))>-1;)c!==n&&He.call(c,l,1),He.call(n,l,1);return n}function ru(n,t){for(var e=n?t.length:0,r=e-1;e--;){var s=t[e];if(e==r||s!==o){var o=s;Zn(s)?He.call(n,s,1):si(n,s)}}return n}function ei(n,t){return n+We(Us()*(t-n+1))}function Hc(n,t,e,r){for(var s=-1,o=Q(Ue((t-n)/(e||1)),0),f=p(o);o--;)f[r?o:++s]=n,n+=e;return f}function ri(n,t){var e="";if(!n||t<1||t>Vn)return e;do t%2&&(e+=n),t=We(t/2),t&&(n+=n);while(t);return e}function L(n,t){return Pi(Du(n,t,fn),n+"")}function $c(n){return Ms(qt(n))}function Uc(n,t){var e=qt(n);return tr(e,dt(t,0,e.length))}function fe(n,t,e,r){if(!z(n))return n;t=it(t,n);for(var s=-1,o=t.length,f=o-1,c=n;c!=null&&++s<o;){var l=Wn(t[s]),v=e;if(l==="__proto__"||l==="constructor"||l==="prototype")return n;if(s!=f){var _=c[l];v=r?r(_,l,c):i,v===i&&(v=z(_)?_:Zn(t[s+1])?[]:{})}se(c,l,v),c=c[l]}return n}var iu=Fe?function(n,t){return Fe.set(n,t),n}:fn,Wc=$e?function(n,t){return $e(n,"toString",{configurable:!0,enumerable:!1,value:bi(t),writable:!0})}:fn;function Fc(n){return tr(qt(n))}function Cn(n,t,e){var r=-1,s=n.length;t<0&&(t=-t>s?0:s+t),e=e>s?s:e,e<0&&(e+=s),s=t>e?0:e-t>>>0,t>>>=0;for(var o=p(s);++r<s;)o[r]=n[r+t];return o}function Mc(n,t){var e;return et(n,function(r,s,o){return e=t(r,s,o),!e}),!!e}function Ye(n,t,e){var r=0,s=n==null?r:n.length;if(typeof t=="number"&&t===t&&s<=Ma){for(;r<s;){var o=r+s>>>1,f=n[o];f!==null&&!pn(f)&&(e?f<=t:f<t)?r=o+1:s=o}return s}return ii(n,t,fn,e)}function ii(n,t,e,r){var s=0,o=n==null?0:n.length;if(o===0)return 0;t=e(t);for(var f=t!==t,c=t===null,l=pn(t),v=t===i;s<o;){var _=We((s+o)/2),m=e(n[_]),P=m!==i,I=m===null,E=m===m,b=pn(m);if(f)var y=r||E;else v?y=E&&(r||P):c?y=E&&P&&(r||!I):l?y=E&&P&&!I&&(r||!b):I||b?y=!1:y=r?m<=t:m<t;y?s=_+1:o=_}return nn(o,Fa)}function su(n,t){for(var e=-1,r=n.length,s=0,o=[];++e<r;){var f=n[e],c=t?t(f):f;if(!e||!bn(c,l)){var l=c;o[s++]=f===0?0:f}}return o}function uu(n){return typeof n=="number"?n:pn(n)?_e:+n}function ln(n){if(typeof n=="string")return n;if(O(n))return G(n,ln)+"";if(pn(n))return Ws?Ws.call(n):"";var t=n+"";return t=="0"&&1/n==-ft?"-0":t}function rt(n,t,e){var r=-1,s=Ee,o=n.length,f=!0,c=[],l=c;if(e)f=!1,s=Dr;else if(o>=w){var v=t?null:Vc(n);if(v)return Se(v);f=!1,s=jt,l=new pt}else l=t?[]:c;n:for(;++r<o;){var _=n[r],m=t?t(_):_;if(_=e||_!==0?_:0,f&&m===m){for(var P=l.length;P--;)if(l[P]===m)continue n;t&&l.push(m),c.push(_)}else s(l,m,e)||(l!==c&&l.push(m),c.push(_))}return c}function si(n,t){return t=it(t,n),n=Nu(n,t),n==null||delete n[Wn(In(t))]}function au(n,t,e,r){return fe(n,t,e(gt(n,t)),r)}function Ze(n,t,e,r){for(var s=n.length,o=r?s:-1;(r?o--:++o<s)&&t(n[o],o,n););return e?Cn(n,r?0:o,r?o+1:s):Cn(n,r?o+1:0,r?s:o)}function ou(n,t){var e=n;return e instanceof N&&(e=e.value()),Nr(t,function(r,s){return s.func.apply(s.thisArg,jn([r],s.args))},e)}function ui(n,t,e){var r=n.length;if(r<2)return r?rt(n[0]):[];for(var s=-1,o=p(r);++s<r;)for(var f=n[s],c=-1;++c<r;)c!=s&&(o[s]=ue(o[s]||f,n[c],t,e));return rt(j(o,1),t,e)}function fu(n,t,e){for(var r=-1,s=n.length,o=t.length,f={};++r<s;){var c=r<o?t[r]:i;e(f,n[r],c)}return f}function ai(n){return Y(n)?n:[]}function oi(n){return typeof n=="function"?n:fn}function it(n,t){return O(n)?n:_i(n,t)?[n]:Wu(W(n))}var qc=L;function st(n,t,e){var r=n.length;return e=e===i?r:e,!t&&e>=r?n:Cn(n,t,e)}var cu=Of||function(n){return k.clearTimeout(n)};function hu(n,t){if(t)return n.slice();var e=n.length,r=Ls?Ls(e):new n.constructor(e);return n.copy(r),r}function fi(n){var t=new n.constructor(n.byteLength);return new De(t).set(new De(n)),t}function Bc(n,t){var e=t?fi(n.buffer):n.buffer;return new n.constructor(e,n.byteOffset,n.byteLength)}function Gc(n){var t=new n.constructor(n.source,Ji.exec(n));return t.lastIndex=n.lastIndex,t}function zc(n){return ie?M(ie.call(n)):{}}function lu(n,t){var e=t?fi(n.buffer):n.buffer;return new n.constructor(e,n.byteOffset,n.length)}function pu(n,t){if(n!==t){var e=n!==i,r=n===null,s=n===n,o=pn(n),f=t!==i,c=t===null,l=t===t,v=pn(t);if(!c&&!v&&!o&&n>t||o&&f&&l&&!c&&!v||r&&f&&l||!e&&l||!s)return 1;if(!r&&!o&&!v&&n<t||v&&e&&s&&!r&&!o||c&&e&&s||!f&&s||!l)return-1}return 0}function Kc(n,t,e){for(var r=-1,s=n.criteria,o=t.criteria,f=s.length,c=e.length;++r<f;){var l=pu(s[r],o[r]);if(l){if(r>=c)return l;var v=e[r];return l*(v=="desc"?-1:1)}}return n.index-t.index}function du(n,t,e,r){for(var s=-1,o=n.length,f=e.length,c=-1,l=t.length,v=Q(o-f,0),_=p(l+v),m=!r;++c<l;)_[c]=t[c];for(;++s<f;)(m||s<o)&&(_[e[s]]=n[s]);for(;v--;)_[c++]=n[s++];return _}function gu(n,t,e,r){for(var s=-1,o=n.length,f=-1,c=e.length,l=-1,v=t.length,_=Q(o-c,0),m=p(_+v),P=!r;++s<_;)m[s]=n[s];for(var I=s;++l<v;)m[I+l]=t[l];for(;++f<c;)(P||s<o)&&(m[I+e[f]]=n[s++]);return m}function un(n,t){var e=-1,r=n.length;for(t||(t=p(r));++e<r;)t[e]=n[e];return t}function Un(n,t,e,r){var s=!e;e||(e={});for(var o=-1,f=t.length;++o<f;){var c=t[o],l=r?r(e[c],n[c],c,e,n):i;l===i&&(l=n[c]),s?zn(e,c,l):se(e,c,l)}return e}function Yc(n,t){return Un(n,vi(n),t)}function Zc(n,t){return Un(n,Ou(n),t)}function Je(n,t){return function(e,r){var s=O(e)?Vo:gc,o=t?t():{};return s(e,n,x(r,2),o)}}function Ut(n){return L(function(t,e){var r=-1,s=e.length,o=s>1?e[s-1]:i,f=s>2?e[2]:i;for(o=n.length>3&&typeof o=="function"?(s--,o):i,f&&rn(e[0],e[1],f)&&(o=s<3?i:o,s=1),t=M(t);++r<s;){var c=e[r];c&&n(t,c,r,o)}return t})}function vu(n,t){return function(e,r){if(e==null)return e;if(!an(e))return n(e,r);for(var s=e.length,o=t?s:-1,f=M(e);(t?o--:++o<s)&&r(f[o],o,f)!==!1;);return e}}function _u(n){return function(t,e,r){for(var s=-1,o=M(t),f=r(t),c=f.length;c--;){var l=f[n?c:++s];if(e(o[l],l,o)===!1)break}return t}}function Jc(n,t,e){var r=t&vn,s=ce(n);function o(){var f=this&&this!==k&&this instanceof o?s:n;return f.apply(r?e:this,arguments)}return o}function mu(n){return function(t){t=W(t);var e=bt(t)?On(t):i,r=e?e[0]:t.charAt(0),s=e?st(e,1).join(""):t.slice(1);return r[n]()+s}}function Wt(n){return function(t){return Nr(va(ga(t).replace(Uo,"")),n,"")}}function ce(n){return function(){var t=arguments;switch(t.length){case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var e=$t(n.prototype),r=n.apply(e,t);return z(r)?r:e}}function Xc(n,t,e){var r=ce(n);function s(){for(var o=arguments.length,f=p(o),c=o,l=Ft(s);c--;)f[c]=arguments[c];var v=o<3&&f[0]!==l&&f[o-1]!==l?[]:nt(f,l);if(o-=v.length,o<e)return Iu(n,t,Xe,s.placeholder,i,f,v,i,i,e-o);var _=this&&this!==k&&this instanceof s?r:n;return cn(_,this,f)}return s}function wu(n){return function(t,e,r){var s=M(t);if(!an(t)){var o=x(e,3);t=V(t),e=function(c){return o(s[c],c,s)}}var f=n(t,e,r);return f>-1?s[o?t[f]:f]:i}}function Pu(n){return Yn(function(t){var e=t.length,r=e,s=Pn.prototype.thru;for(n&&t.reverse();r--;){var o=t[r];if(typeof o!="function")throw new wn(U);if(s&&!f&&je(o)=="wrapper")var f=new Pn([],!0)}for(r=f?r:e;++r<e;){o=t[r];var c=je(o),l=c=="wrapper"?di(o):i;l&&mi(l[0])&&l[1]==(Mn|Dn|Nn|Kt)&&!l[4].length&&l[9]==1?f=f[je(l[0])].apply(f,l[3]):f=o.length==1&&mi(o)?f[c]():f.thru(o)}return function(){var v=arguments,_=v[0];if(f&&v.length==1&&O(_))return f.plant(_).value();for(var m=0,P=e?t[m].apply(this,v):_;++m<e;)P=t[m].call(this,P);return P}})}function Xe(n,t,e,r,s,o,f,c,l,v){var _=t&Mn,m=t&vn,P=t&ot,I=t&(Dn|xt),E=t&dr,b=P?i:ce(n);function y(){for(var D=arguments.length,H=p(D),dn=D;dn--;)H[dn]=arguments[dn];if(I)var sn=Ft(y),gn=af(H,sn);if(r&&(H=du(H,r,s,I)),o&&(H=gu(H,o,f,I)),D-=gn,I&&D<v){var Z=nt(H,sn);return Iu(n,t,Xe,y.placeholder,e,H,Z,c,l,v-D)}var Tn=m?e:this,Qn=P?Tn[n]:n;return D=H.length,c?H=gh(H,c):E&&D>1&&H.reverse(),_&&l<D&&(H.length=l),this&&this!==k&&this instanceof y&&(Qn=b||ce(Qn)),Qn.apply(Tn,H)}return y}function Au(n,t){return function(e,r){return Ic(e,n,t(r),{})}}function Qe(n,t){return function(e,r){var s;if(e===i&&r===i)return t;if(e!==i&&(s=e),r!==i){if(s===i)return r;typeof e=="string"||typeof r=="string"?(e=ln(e),r=ln(r)):(e=uu(e),r=uu(r)),s=n(e,r)}return s}}function ci(n){return Yn(function(t){return t=G(t,hn(x())),L(function(e){var r=this;return n(t,function(s){return cn(s,r,e)})})})}function Ve(n,t){t=t===i?" ":ln(t);var e=t.length;if(e<2)return e?ri(t,n):t;var r=ri(t,Ue(n/Tt(t)));return bt(t)?st(On(r),0,n).join(""):r.slice(0,n)}function Qc(n,t,e,r){var s=t&vn,o=ce(n);function f(){for(var c=-1,l=arguments.length,v=-1,_=r.length,m=p(_+l),P=this&&this!==k&&this instanceof f?o:n;++v<_;)m[v]=r[v];for(;l--;)m[v++]=arguments[++c];return cn(P,s?e:this,m)}return f}function Cu(n){return function(t,e,r){return r&&typeof r!="number"&&rn(t,e,r)&&(e=r=i),t=Xn(t),e===i?(e=t,t=0):e=Xn(e),r=r===i?t<e?1:-1:Xn(r),Hc(t,e,r,n)}}function ke(n){return function(t,e){return typeof t=="string"&&typeof e=="string"||(t=xn(t),e=xn(e)),n(t,e)}}function Iu(n,t,e,r,s,o,f,c,l,v){var _=t&Dn,m=_?f:i,P=_?i:f,I=_?o:i,E=_?i:o;t|=_?Nn:Et,t&=~(_?Et:Nn),t&qi||(t&=~(vn|ot));var b=[n,t,s,I,m,E,P,c,l,v],y=e.apply(i,b);return mi(n)&&Hu(y,b),y.placeholder=r,$u(y,n,t)}function hi(n){var t=X[n];return function(e,r){if(e=xn(e),r=r==null?0:nn(R(r),292),r&&$s(e)){var s=(W(e)+"e").split("e"),o=t(s[0]+"e"+(+s[1]+r));return s=(W(o)+"e").split("e"),+(s[0]+"e"+(+s[1]-r))}return t(e)}}var Vc=Nt&&1/Se(new Nt([,-0]))[1]==ft?function(n){return new Nt(n)}:Di;function xu(n){return function(t){var e=tn(t);return e==yn?qr(t):e==Sn?df(t):uf(t,n(t))}}function Kn(n,t,e,r,s,o,f,c){var l=t&ot;if(!l&&typeof n!="function")throw new wn(U);var v=r?r.length:0;if(v||(t&=~(Nn|Et),r=s=i),f=f===i?f:Q(R(f),0),c=c===i?c:R(c),v-=s?s.length:0,t&Et){var _=r,m=s;r=s=i}var P=l?i:di(n),I=[n,t,e,r,s,_,m,o,f,c];if(P&&lh(I,P),n=I[0],t=I[1],e=I[2],r=I[3],s=I[4],c=I[9]=I[9]===i?l?0:n.length:Q(I[9]-v,0),!c&&t&(Dn|xt)&&(t&=~(Dn|xt)),!t||t==vn)var E=Jc(n,t,e);else t==Dn||t==xt?E=Xc(n,t,c):(t==Nn||t==(vn|Nn))&&!s.length?E=Qc(n,t,e,r):E=Xe.apply(i,I);var b=P?iu:Hu;return $u(b(E,I),n,t)}function Eu(n,t,e,r){return n===i||bn(n,Dt[e])&&!F.call(r,e)?t:n}function yu(n,t,e,r,s,o){return z(n)&&z(t)&&(o.set(t,n),Ke(n,t,i,yu,o),o.delete(t)),n}function kc(n){return pe(n)?i:n}function Su(n,t,e,r,s,o){var f=e&It,c=n.length,l=t.length;if(c!=l&&!(f&&l>c))return!1;var v=o.get(n),_=o.get(t);if(v&&_)return v==t&&_==n;var m=-1,P=!0,I=e&ve?new pt:i;for(o.set(n,t),o.set(t,n);++m<c;){var E=n[m],b=t[m];if(r)var y=f?r(b,E,m,t,n,o):r(E,b,m,n,t,o);if(y!==i){if(y)continue;P=!1;break}if(I){if(!Hr(t,function(D,H){if(!jt(I,H)&&(E===D||s(E,D,e,r,o)))return I.push(H)})){P=!1;break}}else if(!(E===b||s(E,b,e,r,o))){P=!1;break}}return o.delete(n),o.delete(t),P}function jc(n,t,e,r,s,o,f){switch(e){case St:if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)return!1;n=n.buffer,t=t.buffer;case kt:return!(n.byteLength!=t.byteLength||!o(new De(n),new De(t)));case Yt:case Zt:case Jt:return bn(+n,+t);case we:return n.name==t.name&&n.message==t.message;case Xt:case Qt:return n==t+"";case yn:var c=qr;case Sn:var l=r&It;if(c||(c=Se),n.size!=t.size&&!l)return!1;var v=f.get(n);if(v)return v==t;r|=ve,f.set(n,t);var _=Su(c(n),c(t),r,s,o,f);return f.delete(n),_;case Ae:if(ie)return ie.call(n)==ie.call(t)}return!1}function nh(n,t,e,r,s,o){var f=e&It,c=li(n),l=c.length,v=li(t),_=v.length;if(l!=_&&!f)return!1;for(var m=l;m--;){var P=c[m];if(!(f?P in t:F.call(t,P)))return!1}var I=o.get(n),E=o.get(t);if(I&&E)return I==t&&E==n;var b=!0;o.set(n,t),o.set(t,n);for(var y=f;++m<l;){P=c[m];var D=n[P],H=t[P];if(r)var dn=f?r(H,D,P,t,n,o):r(D,H,P,n,t,o);if(!(dn===i?D===H||s(D,H,e,r,o):dn)){b=!1;break}y||(y=P=="constructor")}if(b&&!y){var sn=n.constructor,gn=t.constructor;sn!=gn&&"constructor"in n&&"constructor"in t&&!(typeof sn=="function"&&sn instanceof sn&&typeof gn=="function"&&gn instanceof gn)&&(b=!1)}return o.delete(n),o.delete(t),b}function Yn(n){return Pi(Du(n,i,Bu),n+"")}function li(n){return Zs(n,V,vi)}function pi(n){return Zs(n,on,Ou)}var di=Fe?function(n){return Fe.get(n)}:Di;function je(n){for(var t=n.name+"",e=Ht[t],r=F.call(Ht,t)?e.length:0;r--;){var s=e[r],o=s.func;if(o==null||o==n)return s.name}return t}function Ft(n){var t=F.call(a,"placeholder")?a:n;return t.placeholder}function x(){var n=a.iteratee||Ti;return n=n===Ti?Qs:n,arguments.length?n(arguments[0],arguments[1]):n}function nr(n,t){var e=n.__data__;return oh(t)?e[typeof t=="string"?"string":"hash"]:e.map}function gi(n){for(var t=V(n),e=t.length;e--;){var r=t[e],s=n[r];t[e]=[r,s,Tu(s)]}return t}function vt(n,t){var e=hf(n,t);return Xs(e)?e:i}function th(n){var t=F.call(n,ht),e=n[ht];try{n[ht]=i;var r=!0}catch{}var s=Te.call(n);return r&&(t?n[ht]=e:delete n[ht]),s}var vi=Gr?function(n){return n==null?[]:(n=M(n),kn(Gr(n),function(t){return Ns.call(n,t)}))}:Ni,Ou=Gr?function(n){for(var t=[];n;)jn(t,vi(n)),n=Ne(n);return t}:Ni,tn=en;(zr&&tn(new zr(new ArrayBuffer(1)))!=St||te&&tn(new te)!=yn||Kr&&tn(Kr.resolve())!=zi||Nt&&tn(new Nt)!=Sn||ee&&tn(new ee)!=Vt)&&(tn=function(n){var t=en(n),e=t==qn?n.constructor:i,r=e?_t(e):"";if(r)switch(r){case Uf:return St;case Wf:return yn;case Ff:return zi;case Mf:return Sn;case qf:return Vt}return t});function eh(n,t,e){for(var r=-1,s=e.length;++r<s;){var o=e[r],f=o.size;switch(o.type){case"drop":n+=f;break;case"dropRight":t-=f;break;case"take":t=nn(t,n+f);break;case"takeRight":n=Q(n,t-f);break}}return{start:n,end:t}}function rh(n){var t=n.match(ao);return t?t[1].split(oo):[]}function Ru(n,t,e){t=it(t,n);for(var r=-1,s=t.length,o=!1;++r<s;){var f=Wn(t[r]);if(!(o=n!=null&&e(n,f)))break;n=n[f]}return o||++r!=s?o:(s=n==null?0:n.length,!!s&&ar(s)&&Zn(f,s)&&(O(n)||mt(n)))}function ih(n){var t=n.length,e=new n.constructor(t);return t&&typeof n[0]=="string"&&F.call(n,"index")&&(e.index=n.index,e.input=n.input),e}function bu(n){return typeof n.constructor=="function"&&!he(n)?$t(Ne(n)):{}}function sh(n,t,e){var r=n.constructor;switch(t){case kt:return fi(n);case Yt:case Zt:return new r(+n);case St:return Bc(n,e);case gr:case vr:case _r:case mr:case wr:case Pr:case Ar:case Cr:case Ir:return lu(n,e);case yn:return new r;case Jt:case Qt:return new r(n);case Xt:return Gc(n);case Sn:return new r;case Ae:return zc(n)}}function uh(n,t){var e=t.length;if(!e)return n;var r=e-1;return t[r]=(e>1?"& ":"")+t[r],t=t.join(e>2?", ":" "),n.replace(uo,`{
/* [wrapped with `+t+`] */
`)}function ah(n){return O(n)||mt(n)||!!(Hs&&n&&n[Hs])}function Zn(n,t){var e=typeof n;return t=t??Vn,!!t&&(e=="number"||e!="symbol"&&mo.test(n))&&n>-1&&n%1==0&&n<t}function rn(n,t,e){if(!z(e))return!1;var r=typeof t;return(r=="number"?an(e)&&Zn(t,e.length):r=="string"&&t in e)?bn(e[t],n):!1}function _i(n,t){if(O(n))return!1;var e=typeof n;return e=="number"||e=="symbol"||e=="boolean"||n==null||pn(n)?!0:eo.test(n)||!to.test(n)||t!=null&&n in M(t)}function oh(n){var t=typeof n;return t=="string"||t=="number"||t=="symbol"||t=="boolean"?n!=="__proto__":n===null}function mi(n){var t=je(n),e=a[t];if(typeof e!="function"||!(t in N.prototype))return!1;if(n===e)return!0;var r=di(e);return!!r&&n===r[0]}function fh(n){return!!Ts&&Ts in n}var ch=Re?Jn:Hi;function he(n){var t=n&&n.constructor,e=typeof t=="function"&&t.prototype||Dt;return n===e}function Tu(n){return n===n&&!z(n)}function Lu(n,t){return function(e){return e==null?!1:e[n]===t&&(t!==i||n in M(e))}}function hh(n){var t=sr(n,function(r){return e.size===pr&&e.clear(),r}),e=t.cache;return t}function lh(n,t){var e=n[1],r=t[1],s=e|r,o=s<(vn|ot|Mn),f=r==Mn&&e==Dn||r==Mn&&e==Kt&&n[7].length<=t[8]||r==(Mn|Kt)&&t[7].length<=t[8]&&e==Dn;if(!(o||f))return n;r&vn&&(n[2]=t[2],s|=e&vn?0:qi);var c=t[3];if(c){var l=n[3];n[3]=l?du(l,c,t[4]):c,n[4]=l?nt(n[3],At):t[4]}return c=t[5],c&&(l=n[5],n[5]=l?gu(l,c,t[6]):c,n[6]=l?nt(n[5],At):t[6]),c=t[7],c&&(n[7]=c),r&Mn&&(n[8]=n[8]==null?t[8]:nn(n[8],t[8])),n[9]==null&&(n[9]=t[9]),n[0]=t[0],n[1]=s,n}function ph(n){var t=[];if(n!=null)for(var e in M(n))t.push(e);return t}function dh(n){return Te.call(n)}function Du(n,t,e){return t=Q(t===i?n.length-1:t,0),function(){for(var r=arguments,s=-1,o=Q(r.length-t,0),f=p(o);++s<o;)f[s]=r[t+s];s=-1;for(var c=p(t+1);++s<t;)c[s]=r[s];return c[t]=e(f),cn(n,this,c)}}function Nu(n,t){return t.length<2?n:gt(n,Cn(t,0,-1))}function gh(n,t){for(var e=n.length,r=nn(t.length,e),s=un(n);r--;){var o=t[r];n[r]=Zn(o,e)?s[o]:i}return n}function wi(n,t){if(!(t==="constructor"&&typeof n[t]=="function")&&t!="__proto__")return n[t]}var Hu=Uu(iu),le=bf||function(n,t){return k.setTimeout(n,t)},Pi=Uu(Wc);function $u(n,t,e){var r=t+"";return Pi(n,uh(r,vh(rh(r),e)))}function Uu(n){var t=0,e=0;return function(){var r=Nf(),s=Ha-(r-e);if(e=r,s>0){if(++t>=Na)return arguments[0]}else t=0;return n.apply(i,arguments)}}function tr(n,t){var e=-1,r=n.length,s=r-1;for(t=t===i?r:t;++e<t;){var o=ei(e,s),f=n[o];n[o]=n[e],n[e]=f}return n.length=t,n}var Wu=hh(function(n){var t=[];return n.charCodeAt(0)===46&&t.push(""),n.replace(ro,function(e,r,s,o){t.push(s?o.replace(ho,"$1"):r||e)}),t});function Wn(n){if(typeof n=="string"||pn(n))return n;var t=n+"";return t=="0"&&1/n==-ft?"-0":t}function _t(n){if(n!=null){try{return be.call(n)}catch{}try{return n+""}catch{}}return""}function vh(n,t){return mn(qa,function(e){var r="_."+e[0];t&e[1]&&!Ee(n,r)&&n.push(r)}),n.sort()}function Fu(n){if(n instanceof N)return n.clone();var t=new Pn(n.__wrapped__,n.__chain__);return t.__actions__=un(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}function _h(n,t,e){(e?rn(n,t,e):t===i)?t=1:t=Q(R(t),0);var r=n==null?0:n.length;if(!r||t<1)return[];for(var s=0,o=0,f=p(Ue(r/t));s<r;)f[o++]=Cn(n,s,s+=t);return f}function mh(n){for(var t=-1,e=n==null?0:n.length,r=0,s=[];++t<e;){var o=n[t];o&&(s[r++]=o)}return s}function wh(){var n=arguments.length;if(!n)return[];for(var t=p(n-1),e=arguments[0],r=n;r--;)t[r-1]=arguments[r];return jn(O(e)?un(e):[e],j(t,1))}var Ph=L(function(n,t){return Y(n)?ue(n,j(t,1,Y,!0)):[]}),Ah=L(function(n,t){var e=In(t);return Y(e)&&(e=i),Y(n)?ue(n,j(t,1,Y,!0),x(e,2)):[]}),Ch=L(function(n,t){var e=In(t);return Y(e)&&(e=i),Y(n)?ue(n,j(t,1,Y,!0),i,e):[]});function Ih(n,t,e){var r=n==null?0:n.length;return r?(t=e||t===i?1:R(t),Cn(n,t<0?0:t,r)):[]}function xh(n,t,e){var r=n==null?0:n.length;return r?(t=e||t===i?1:R(t),t=r-t,Cn(n,0,t<0?0:t)):[]}function Eh(n,t){return n&&n.length?Ze(n,x(t,3),!0,!0):[]}function yh(n,t){return n&&n.length?Ze(n,x(t,3),!0):[]}function Sh(n,t,e,r){var s=n==null?0:n.length;return s?(e&&typeof e!="number"&&rn(n,t,e)&&(e=0,r=s),wc(n,t,e,r)):[]}function Mu(n,t,e){var r=n==null?0:n.length;if(!r)return-1;var s=e==null?0:R(e);return s<0&&(s=Q(r+s,0)),ye(n,x(t,3),s)}function qu(n,t,e){var r=n==null?0:n.length;if(!r)return-1;var s=r-1;return e!==i&&(s=R(e),s=e<0?Q(r+s,0):nn(s,r-1)),ye(n,x(t,3),s,!0)}function Bu(n){var t=n==null?0:n.length;return t?j(n,1):[]}function Oh(n){var t=n==null?0:n.length;return t?j(n,ft):[]}function Rh(n,t){var e=n==null?0:n.length;return e?(t=t===i?1:R(t),j(n,t)):[]}function bh(n){for(var t=-1,e=n==null?0:n.length,r={};++t<e;){var s=n[t];r[s[0]]=s[1]}return r}function Gu(n){return n&&n.length?n[0]:i}function Th(n,t,e){var r=n==null?0:n.length;if(!r)return-1;var s=e==null?0:R(e);return s<0&&(s=Q(r+s,0)),Rt(n,t,s)}function Lh(n){var t=n==null?0:n.length;return t?Cn(n,0,-1):[]}var Dh=L(function(n){var t=G(n,ai);return t.length&&t[0]===n[0]?Vr(t):[]}),Nh=L(function(n){var t=In(n),e=G(n,ai);return t===In(e)?t=i:e.pop(),e.length&&e[0]===n[0]?Vr(e,x(t,2)):[]}),Hh=L(function(n){var t=In(n),e=G(n,ai);return t=typeof t=="function"?t:i,t&&e.pop(),e.length&&e[0]===n[0]?Vr(e,i,t):[]});function $h(n,t){return n==null?"":Lf.call(n,t)}function In(n){var t=n==null?0:n.length;return t?n[t-1]:i}function Uh(n,t,e){var r=n==null?0:n.length;if(!r)return-1;var s=r;return e!==i&&(s=R(e),s=s<0?Q(r+s,0):nn(s,r-1)),t===t?vf(n,t,s):ye(n,Is,s,!0)}function Wh(n,t){return n&&n.length?nu(n,R(t)):i}var Fh=L(zu);function zu(n,t){return n&&n.length&&t&&t.length?ti(n,t):n}function Mh(n,t,e){return n&&n.length&&t&&t.length?ti(n,t,x(e,2)):n}function qh(n,t,e){return n&&n.length&&t&&t.length?ti(n,t,i,e):n}var Bh=Yn(function(n,t){var e=n==null?0:n.length,r=Zr(n,t);return ru(n,G(t,function(s){return Zn(s,e)?+s:s}).sort(pu)),r});function Gh(n,t){var e=[];if(!(n&&n.length))return e;var r=-1,s=[],o=n.length;for(t=x(t,3);++r<o;){var f=n[r];t(f,r,n)&&(e.push(f),s.push(r))}return ru(n,s),e}function Ai(n){return n==null?n:$f.call(n)}function zh(n,t,e){var r=n==null?0:n.length;return r?(e&&typeof e!="number"&&rn(n,t,e)?(t=0,e=r):(t=t==null?0:R(t),e=e===i?r:R(e)),Cn(n,t,e)):[]}function Kh(n,t){return Ye(n,t)}function Yh(n,t,e){return ii(n,t,x(e,2))}function Zh(n,t){var e=n==null?0:n.length;if(e){var r=Ye(n,t);if(r<e&&bn(n[r],t))return r}return-1}function Jh(n,t){return Ye(n,t,!0)}function Xh(n,t,e){return ii(n,t,x(e,2),!0)}function Qh(n,t){var e=n==null?0:n.length;if(e){var r=Ye(n,t,!0)-1;if(bn(n[r],t))return r}return-1}function Vh(n){return n&&n.length?su(n):[]}function kh(n,t){return n&&n.length?su(n,x(t,2)):[]}function jh(n){var t=n==null?0:n.length;return t?Cn(n,1,t):[]}function nl(n,t,e){return n&&n.length?(t=e||t===i?1:R(t),Cn(n,0,t<0?0:t)):[]}function tl(n,t,e){var r=n==null?0:n.length;return r?(t=e||t===i?1:R(t),t=r-t,Cn(n,t<0?0:t,r)):[]}function el(n,t){return n&&n.length?Ze(n,x(t,3),!1,!0):[]}function rl(n,t){return n&&n.length?Ze(n,x(t,3)):[]}var il=L(function(n){return rt(j(n,1,Y,!0))}),sl=L(function(n){var t=In(n);return Y(t)&&(t=i),rt(j(n,1,Y,!0),x(t,2))}),ul=L(function(n){var t=In(n);return t=typeof t=="function"?t:i,rt(j(n,1,Y,!0),i,t)});function al(n){return n&&n.length?rt(n):[]}function ol(n,t){return n&&n.length?rt(n,x(t,2)):[]}function fl(n,t){return t=typeof t=="function"?t:i,n&&n.length?rt(n,i,t):[]}function Ci(n){if(!(n&&n.length))return[];var t=0;return n=kn(n,function(e){if(Y(e))return t=Q(e.length,t),!0}),Fr(t,function(e){return G(n,$r(e))})}function Ku(n,t){if(!(n&&n.length))return[];var e=Ci(n);return t==null?e:G(e,function(r){return cn(t,i,r)})}var cl=L(function(n,t){return Y(n)?ue(n,t):[]}),hl=L(function(n){return ui(kn(n,Y))}),ll=L(function(n){var t=In(n);return Y(t)&&(t=i),ui(kn(n,Y),x(t,2))}),pl=L(function(n){var t=In(n);return t=typeof t=="function"?t:i,ui(kn(n,Y),i,t)}),dl=L(Ci);function gl(n,t){return fu(n||[],t||[],se)}function vl(n,t){return fu(n||[],t||[],fe)}var _l=L(function(n){var t=n.length,e=t>1?n[t-1]:i;return e=typeof e=="function"?(n.pop(),e):i,Ku(n,e)});function Yu(n){var t=a(n);return t.__chain__=!0,t}function ml(n,t){return t(n),n}function er(n,t){return t(n)}var wl=Yn(function(n){var t=n.length,e=t?n[0]:0,r=this.__wrapped__,s=function(o){return Zr(o,n)};return t>1||this.__actions__.length||!(r instanceof N)||!Zn(e)?this.thru(s):(r=r.slice(e,+e+(t?1:0)),r.__actions__.push({func:er,args:[s],thisArg:i}),new Pn(r,this.__chain__).thru(function(o){return t&&!o.length&&o.push(i),o}))});function Pl(){return Yu(this)}function Al(){return new Pn(this.value(),this.__chain__)}function Cl(){this.__values__===i&&(this.__values__=ua(this.value()));var n=this.__index__>=this.__values__.length,t=n?i:this.__values__[this.__index__++];return{done:n,value:t}}function Il(){return this}function xl(n){for(var t,e=this;e instanceof qe;){var r=Fu(e);r.__index__=0,r.__values__=i,t?s.__wrapped__=r:t=r;var s=r;e=e.__wrapped__}return s.__wrapped__=n,t}function El(){var n=this.__wrapped__;if(n instanceof N){var t=n;return this.__actions__.length&&(t=new N(this)),t=t.reverse(),t.__actions__.push({func:er,args:[Ai],thisArg:i}),new Pn(t,this.__chain__)}return this.thru(Ai)}function yl(){return ou(this.__wrapped__,this.__actions__)}var Sl=Je(function(n,t,e){F.call(n,e)?++n[e]:zn(n,e,1)});function Ol(n,t,e){var r=O(n)?As:mc;return e&&rn(n,t,e)&&(t=i),r(n,x(t,3))}function Rl(n,t){var e=O(n)?kn:Ks;return e(n,x(t,3))}var bl=wu(Mu),Tl=wu(qu);function Ll(n,t){return j(rr(n,t),1)}function Dl(n,t){return j(rr(n,t),ft)}function Nl(n,t,e){return e=e===i?1:R(e),j(rr(n,t),e)}function Zu(n,t){var e=O(n)?mn:et;return e(n,x(t,3))}function Ju(n,t){var e=O(n)?ko:zs;return e(n,x(t,3))}var Hl=Je(function(n,t,e){F.call(n,e)?n[e].push(t):zn(n,e,[t])});function $l(n,t,e,r){n=an(n)?n:qt(n),e=e&&!r?R(e):0;var s=n.length;return e<0&&(e=Q(s+e,0)),or(n)?e<=s&&n.indexOf(t,e)>-1:!!s&&Rt(n,t,e)>-1}var Ul=L(function(n,t,e){var r=-1,s=typeof t=="function",o=an(n)?p(n.length):[];return et(n,function(f){o[++r]=s?cn(t,f,e):ae(f,t,e)}),o}),Wl=Je(function(n,t,e){zn(n,e,t)});function rr(n,t){var e=O(n)?G:Vs;return e(n,x(t,3))}function Fl(n,t,e,r){return n==null?[]:(O(t)||(t=t==null?[]:[t]),e=r?i:e,O(e)||(e=e==null?[]:[e]),tu(n,t,e))}var Ml=Je(function(n,t,e){n[e?0:1].push(t)},function(){return[[],[]]});function ql(n,t,e){var r=O(n)?Nr:Es,s=arguments.length<3;return r(n,x(t,4),e,s,et)}function Bl(n,t,e){var r=O(n)?jo:Es,s=arguments.length<3;return r(n,x(t,4),e,s,zs)}function Gl(n,t){var e=O(n)?kn:Ks;return e(n,ur(x(t,3)))}function zl(n){var t=O(n)?Ms:$c;return t(n)}function Kl(n,t,e){(e?rn(n,t,e):t===i)?t=1:t=R(t);var r=O(n)?pc:Uc;return r(n,t)}function Yl(n){var t=O(n)?dc:Fc;return t(n)}function Zl(n){if(n==null)return 0;if(an(n))return or(n)?Tt(n):n.length;var t=tn(n);return t==yn||t==Sn?n.size:jr(n).length}function Jl(n,t,e){var r=O(n)?Hr:Mc;return e&&rn(n,t,e)&&(t=i),r(n,x(t,3))}var Xl=L(function(n,t){if(n==null)return[];var e=t.length;return e>1&&rn(n,t[0],t[1])?t=[]:e>2&&rn(t[0],t[1],t[2])&&(t=[t[0]]),tu(n,j(t,1),[])}),ir=Rf||function(){return k.Date.now()};function Ql(n,t){if(typeof t!="function")throw new wn(U);return n=R(n),function(){if(--n<1)return t.apply(this,arguments)}}function Xu(n,t,e){return t=e?i:t,t=n&&t==null?n.length:t,Kn(n,Mn,i,i,i,i,t)}function Qu(n,t){var e;if(typeof t!="function")throw new wn(U);return n=R(n),function(){return--n>0&&(e=t.apply(this,arguments)),n<=1&&(t=i),e}}var Ii=L(function(n,t,e){var r=vn;if(e.length){var s=nt(e,Ft(Ii));r|=Nn}return Kn(n,r,t,e,s)}),Vu=L(function(n,t,e){var r=vn|ot;if(e.length){var s=nt(e,Ft(Vu));r|=Nn}return Kn(t,r,n,e,s)});function ku(n,t,e){t=e?i:t;var r=Kn(n,Dn,i,i,i,i,i,t);return r.placeholder=ku.placeholder,r}function ju(n,t,e){t=e?i:t;var r=Kn(n,xt,i,i,i,i,i,t);return r.placeholder=ju.placeholder,r}function na(n,t,e){var r,s,o,f,c,l,v=0,_=!1,m=!1,P=!0;if(typeof n!="function")throw new wn(U);t=xn(t)||0,z(e)&&(_=!!e.leading,m="maxWait"in e,o=m?Q(xn(e.maxWait)||0,t):o,P="trailing"in e?!!e.trailing:P);function I(Z){var Tn=r,Qn=s;return r=s=i,v=Z,f=n.apply(Qn,Tn),f}function E(Z){return v=Z,c=le(D,t),_?I(Z):f}function b(Z){var Tn=Z-l,Qn=Z-v,wa=t-Tn;return m?nn(wa,o-Qn):wa}function y(Z){var Tn=Z-l,Qn=Z-v;return l===i||Tn>=t||Tn<0||m&&Qn>=o}function D(){var Z=ir();if(y(Z))return H(Z);c=le(D,b(Z))}function H(Z){return c=i,P&&r?I(Z):(r=s=i,f)}function dn(){c!==i&&cu(c),v=0,r=l=s=c=i}function sn(){return c===i?f:H(ir())}function gn(){var Z=ir(),Tn=y(Z);if(r=arguments,s=this,l=Z,Tn){if(c===i)return E(l);if(m)return cu(c),c=le(D,t),I(l)}return c===i&&(c=le(D,t)),f}return gn.cancel=dn,gn.flush=sn,gn}var Vl=L(function(n,t){return Gs(n,1,t)}),kl=L(function(n,t,e){return Gs(n,xn(t)||0,e)});function jl(n){return Kn(n,dr)}function sr(n,t){if(typeof n!="function"||t!=null&&typeof t!="function")throw new wn(U);var e=function(){var r=arguments,s=t?t.apply(this,r):r[0],o=e.cache;if(o.has(s))return o.get(s);var f=n.apply(this,r);return e.cache=o.set(s,f)||o,f};return e.cache=new(sr.Cache||Gn),e}sr.Cache=Gn;function ur(n){if(typeof n!="function")throw new wn(U);return function(){var t=arguments;switch(t.length){case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2])}return!n.apply(this,t)}}function np(n){return Qu(2,n)}var tp=qc(function(n,t){t=t.length==1&&O(t[0])?G(t[0],hn(x())):G(j(t,1),hn(x()));var e=t.length;return L(function(r){for(var s=-1,o=nn(r.length,e);++s<o;)r[s]=t[s].call(this,r[s]);return cn(n,this,r)})}),xi=L(function(n,t){var e=nt(t,Ft(xi));return Kn(n,Nn,i,t,e)}),ta=L(function(n,t){var e=nt(t,Ft(ta));return Kn(n,Et,i,t,e)}),ep=Yn(function(n,t){return Kn(n,Kt,i,i,i,t)});function rp(n,t){if(typeof n!="function")throw new wn(U);return t=t===i?t:R(t),L(n,t)}function ip(n,t){if(typeof n!="function")throw new wn(U);return t=t==null?0:Q(R(t),0),L(function(e){var r=e[t],s=st(e,0,t);return r&&jn(s,r),cn(n,this,s)})}function sp(n,t,e){var r=!0,s=!0;if(typeof n!="function")throw new wn(U);return z(e)&&(r="leading"in e?!!e.leading:r,s="trailing"in e?!!e.trailing:s),na(n,t,{leading:r,maxWait:t,trailing:s})}function up(n){return Xu(n,1)}function ap(n,t){return xi(oi(t),n)}function op(){if(!arguments.length)return[];var n=arguments[0];return O(n)?n:[n]}function fp(n){return An(n,Ct)}function cp(n,t){return t=typeof t=="function"?t:i,An(n,Ct,t)}function hp(n){return An(n,Ln|Ct)}function lp(n,t){return t=typeof t=="function"?t:i,An(n,Ln|Ct,t)}function pp(n,t){return t==null||Bs(n,t,V(t))}function bn(n,t){return n===t||n!==n&&t!==t}var dp=ke(Qr),gp=ke(function(n,t){return n>=t}),mt=Js(function(){return arguments}())?Js:function(n){return K(n)&&F.call(n,"callee")&&!Ns.call(n,"callee")},O=p.isArray,vp=gs?hn(gs):xc;function an(n){return n!=null&&ar(n.length)&&!Jn(n)}function Y(n){return K(n)&&an(n)}function _p(n){return n===!0||n===!1||K(n)&&en(n)==Yt}var ut=Tf||Hi,mp=vs?hn(vs):Ec;function wp(n){return K(n)&&n.nodeType===1&&!pe(n)}function Pp(n){if(n==null)return!0;if(an(n)&&(O(n)||typeof n=="string"||typeof n.splice=="function"||ut(n)||Mt(n)||mt(n)))return!n.length;var t=tn(n);if(t==yn||t==Sn)return!n.size;if(he(n))return!jr(n).length;for(var e in n)if(F.call(n,e))return!1;return!0}function Ap(n,t){return oe(n,t)}function Cp(n,t,e){e=typeof e=="function"?e:i;var r=e?e(n,t):i;return r===i?oe(n,t,i,e):!!r}function Ei(n){if(!K(n))return!1;var t=en(n);return t==we||t==Ga||typeof n.message=="string"&&typeof n.name=="string"&&!pe(n)}function Ip(n){return typeof n=="number"&&$s(n)}function Jn(n){if(!z(n))return!1;var t=en(n);return t==Pe||t==Gi||t==Ba||t==Ka}function ea(n){return typeof n=="number"&&n==R(n)}function ar(n){return typeof n=="number"&&n>-1&&n%1==0&&n<=Vn}function z(n){var t=typeof n;return n!=null&&(t=="object"||t=="function")}function K(n){return n!=null&&typeof n=="object"}var ra=_s?hn(_s):Sc;function xp(n,t){return n===t||kr(n,t,gi(t))}function Ep(n,t,e){return e=typeof e=="function"?e:i,kr(n,t,gi(t),e)}function yp(n){return ia(n)&&n!=+n}function Sp(n){if(ch(n))throw new S(T);return Xs(n)}function Op(n){return n===null}function Rp(n){return n==null}function ia(n){return typeof n=="number"||K(n)&&en(n)==Jt}function pe(n){if(!K(n)||en(n)!=qn)return!1;var t=Ne(n);if(t===null)return!0;var e=F.call(t,"constructor")&&t.constructor;return typeof e=="function"&&e instanceof e&&be.call(e)==Ef}var yi=ms?hn(ms):Oc;function bp(n){return ea(n)&&n>=-Vn&&n<=Vn}var sa=ws?hn(ws):Rc;function or(n){return typeof n=="string"||!O(n)&&K(n)&&en(n)==Qt}function pn(n){return typeof n=="symbol"||K(n)&&en(n)==Ae}var Mt=Ps?hn(Ps):bc;function Tp(n){return n===i}function Lp(n){return K(n)&&tn(n)==Vt}function Dp(n){return K(n)&&en(n)==Za}var Np=ke(ni),Hp=ke(function(n,t){return n<=t});function ua(n){if(!n)return[];if(an(n))return or(n)?On(n):un(n);if(ne&&n[ne])return pf(n[ne]());var t=tn(n),e=t==yn?qr:t==Sn?Se:qt;return e(n)}function Xn(n){if(!n)return n===0?n:0;if(n=xn(n),n===ft||n===-ft){var t=n<0?-1:1;return t*Wa}return n===n?n:0}function R(n){var t=Xn(n),e=t%1;return t===t?e?t-e:t:0}function aa(n){return n?dt(R(n),0,Hn):0}function xn(n){if(typeof n=="number")return n;if(pn(n))return _e;if(z(n)){var t=typeof n.valueOf=="function"?n.valueOf():n;n=z(t)?t+"":t}if(typeof n!="string")return n===0?n:+n;n=ys(n);var e=go.test(n);return e||_o.test(n)?Xo(n.slice(2),e?2:8):po.test(n)?_e:+n}function oa(n){return Un(n,on(n))}function $p(n){return n?dt(R(n),-Vn,Vn):n===0?n:0}function W(n){return n==null?"":ln(n)}var Up=Ut(function(n,t){if(he(t)||an(t)){Un(t,V(t),n);return}for(var e in t)F.call(t,e)&&se(n,e,t[e])}),fa=Ut(function(n,t){Un(t,on(t),n)}),fr=Ut(function(n,t,e,r){Un(t,on(t),n,r)}),Wp=Ut(function(n,t,e,r){Un(t,V(t),n,r)}),Fp=Yn(Zr);function Mp(n,t){var e=$t(n);return t==null?e:qs(e,t)}var qp=L(function(n,t){n=M(n);var e=-1,r=t.length,s=r>2?t[2]:i;for(s&&rn(t[0],t[1],s)&&(r=1);++e<r;)for(var o=t[e],f=on(o),c=-1,l=f.length;++c<l;){var v=f[c],_=n[v];(_===i||bn(_,Dt[v])&&!F.call(n,v))&&(n[v]=o[v])}return n}),Bp=L(function(n){return n.push(i,yu),cn(ca,i,n)});function Gp(n,t){return Cs(n,x(t,3),$n)}function zp(n,t){return Cs(n,x(t,3),Xr)}function Kp(n,t){return n==null?n:Jr(n,x(t,3),on)}function Yp(n,t){return n==null?n:Ys(n,x(t,3),on)}function Zp(n,t){return n&&$n(n,x(t,3))}function Jp(n,t){return n&&Xr(n,x(t,3))}function Xp(n){return n==null?[]:ze(n,V(n))}function Qp(n){return n==null?[]:ze(n,on(n))}function Si(n,t,e){var r=n==null?i:gt(n,t);return r===i?e:r}function Vp(n,t){return n!=null&&Ru(n,t,Pc)}function Oi(n,t){return n!=null&&Ru(n,t,Ac)}var kp=Au(function(n,t,e){t!=null&&typeof t.toString!="function"&&(t=Te.call(t)),n[t]=e},bi(fn)),jp=Au(function(n,t,e){t!=null&&typeof t.toString!="function"&&(t=Te.call(t)),F.call(n,t)?n[t].push(e):n[t]=[e]},x),nd=L(ae);function V(n){return an(n)?Fs(n):jr(n)}function on(n){return an(n)?Fs(n,!0):Tc(n)}function td(n,t){var e={};return t=x(t,3),$n(n,function(r,s,o){zn(e,t(r,s,o),r)}),e}function ed(n,t){var e={};return t=x(t,3),$n(n,function(r,s,o){zn(e,s,t(r,s,o))}),e}var rd=Ut(function(n,t,e){Ke(n,t,e)}),ca=Ut(function(n,t,e,r){Ke(n,t,e,r)}),id=Yn(function(n,t){var e={};if(n==null)return e;var r=!1;t=G(t,function(o){return o=it(o,n),r||(r=o.length>1),o}),Un(n,pi(n),e),r&&(e=An(e,Ln|Fn|Ct,kc));for(var s=t.length;s--;)si(e,t[s]);return e});function sd(n,t){return ha(n,ur(x(t)))}var ud=Yn(function(n,t){return n==null?{}:Dc(n,t)});function ha(n,t){if(n==null)return{};var e=G(pi(n),function(r){return[r]});return t=x(t),eu(n,e,function(r,s){return t(r,s[0])})}function ad(n,t,e){t=it(t,n);var r=-1,s=t.length;for(s||(s=1,n=i);++r<s;){var o=n==null?i:n[Wn(t[r])];o===i&&(r=s,o=e),n=Jn(o)?o.call(n):o}return n}function od(n,t,e){return n==null?n:fe(n,t,e)}function fd(n,t,e,r){return r=typeof r=="function"?r:i,n==null?n:fe(n,t,e,r)}var la=xu(V),pa=xu(on);function cd(n,t,e){var r=O(n),s=r||ut(n)||Mt(n);if(t=x(t,4),e==null){var o=n&&n.constructor;s?e=r?new o:[]:z(n)?e=Jn(o)?$t(Ne(n)):{}:e={}}return(s?mn:$n)(n,function(f,c,l){return t(e,f,c,l)}),e}function hd(n,t){return n==null?!0:si(n,t)}function ld(n,t,e){return n==null?n:au(n,t,oi(e))}function pd(n,t,e,r){return r=typeof r=="function"?r:i,n==null?n:au(n,t,oi(e),r)}function qt(n){return n==null?[]:Mr(n,V(n))}function dd(n){return n==null?[]:Mr(n,on(n))}function gd(n,t,e){return e===i&&(e=t,t=i),e!==i&&(e=xn(e),e=e===e?e:0),t!==i&&(t=xn(t),t=t===t?t:0),dt(xn(n),t,e)}function vd(n,t,e){return t=Xn(t),e===i?(e=t,t=0):e=Xn(e),n=xn(n),Cc(n,t,e)}function _d(n,t,e){if(e&&typeof e!="boolean"&&rn(n,t,e)&&(t=e=i),e===i&&(typeof t=="boolean"?(e=t,t=i):typeof n=="boolean"&&(e=n,n=i)),n===i&&t===i?(n=0,t=1):(n=Xn(n),t===i?(t=n,n=0):t=Xn(t)),n>t){var r=n;n=t,t=r}if(e||n%1||t%1){var s=Us();return nn(n+s*(t-n+Jo("1e-"+((s+"").length-1))),t)}return ei(n,t)}var md=Wt(function(n,t,e){return t=t.toLowerCase(),n+(e?da(t):t)});function da(n){return Ri(W(n).toLowerCase())}function ga(n){return n=W(n),n&&n.replace(wo,of).replace(Wo,"")}function wd(n,t,e){n=W(n),t=ln(t);var r=n.length;e=e===i?r:dt(R(e),0,r);var s=e;return e-=t.length,e>=0&&n.slice(e,s)==t}function Pd(n){return n=W(n),n&&ka.test(n)?n.replace(Yi,ff):n}function Ad(n){return n=W(n),n&&io.test(n)?n.replace(xr,"\\$&"):n}var Cd=Wt(function(n,t,e){return n+(e?"-":"")+t.toLowerCase()}),Id=Wt(function(n,t,e){return n+(e?" ":"")+t.toLowerCase()}),xd=mu("toLowerCase");function Ed(n,t,e){n=W(n),t=R(t);var r=t?Tt(n):0;if(!t||r>=t)return n;var s=(t-r)/2;return Ve(We(s),e)+n+Ve(Ue(s),e)}function yd(n,t,e){n=W(n),t=R(t);var r=t?Tt(n):0;return t&&r<t?n+Ve(t-r,e):n}function Sd(n,t,e){n=W(n),t=R(t);var r=t?Tt(n):0;return t&&r<t?Ve(t-r,e)+n:n}function Od(n,t,e){return e||t==null?t=0:t&&(t=+t),Hf(W(n).replace(Er,""),t||0)}function Rd(n,t,e){return(e?rn(n,t,e):t===i)?t=1:t=R(t),ri(W(n),t)}function bd(){var n=arguments,t=W(n[0]);return n.length<3?t:t.replace(n[1],n[2])}var Td=Wt(function(n,t,e){return n+(e?"_":"")+t.toLowerCase()});function Ld(n,t,e){return e&&typeof e!="number"&&rn(n,t,e)&&(t=e=i),e=e===i?Hn:e>>>0,e?(n=W(n),n&&(typeof t=="string"||t!=null&&!yi(t))&&(t=ln(t),!t&&bt(n))?st(On(n),0,e):n.split(t,e)):[]}var Dd=Wt(function(n,t,e){return n+(e?" ":"")+Ri(t)});function Nd(n,t,e){return n=W(n),e=e==null?0:dt(R(e),0,n.length),t=ln(t),n.slice(e,e+t.length)==t}function Hd(n,t,e){var r=a.templateSettings;e&&rn(n,t,e)&&(t=i),n=W(n),t=fr({},t,r,Eu);var s=fr({},t.imports,r.imports,Eu),o=V(s),f=Mr(s,o),c,l,v=0,_=t.interpolate||Ce,m="__p += '",P=Br((t.escape||Ce).source+"|"+_.source+"|"+(_===Zi?lo:Ce).source+"|"+(t.evaluate||Ce).source+"|$","g"),I="//# sourceURL="+(F.call(t,"sourceURL")?(t.sourceURL+"").replace(/\s/g," "):"lodash.templateSources["+ ++Go+"]")+`
`;n.replace(P,function(y,D,H,dn,sn,gn){return H||(H=dn),m+=n.slice(v,gn).replace(Po,cf),D&&(c=!0,m+=`' +
__e(`+D+`) +
'`),sn&&(l=!0,m+=`';
`+sn+`;
__p += '`),H&&(m+=`' +
((__t = (`+H+`)) == null ? '' : __t) +
'`),v=gn+y.length,y}),m+=`';
`;var E=F.call(t,"variable")&&t.variable;if(!E)m=`with (obj) {
`+m+`
}
`;else if(co.test(E))throw new S(En);m=(l?m.replace(Ja,""):m).replace(Xa,"$1").replace(Qa,"$1;"),m="function("+(E||"obj")+`) {
`+(E?"":`obj || (obj = {});
`)+"var __t, __p = ''"+(c?", __e = _.escape":"")+(l?`, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
`:`;
`)+m+`return __p
}`;var b=_a(function(){return $(o,I+"return "+m).apply(i,f)});if(b.source=m,Ei(b))throw b;return b}function $d(n){return W(n).toLowerCase()}function Ud(n){return W(n).toUpperCase()}function Wd(n,t,e){if(n=W(n),n&&(e||t===i))return ys(n);if(!n||!(t=ln(t)))return n;var r=On(n),s=On(t),o=Ss(r,s),f=Os(r,s)+1;return st(r,o,f).join("")}function Fd(n,t,e){if(n=W(n),n&&(e||t===i))return n.slice(0,bs(n)+1);if(!n||!(t=ln(t)))return n;var r=On(n),s=Os(r,On(t))+1;return st(r,0,s).join("")}function Md(n,t,e){if(n=W(n),n&&(e||t===i))return n.replace(Er,"");if(!n||!(t=ln(t)))return n;var r=On(n),s=Ss(r,On(t));return st(r,s).join("")}function qd(n,t){var e=La,r=Da;if(z(t)){var s="separator"in t?t.separator:s;e="length"in t?R(t.length):e,r="omission"in t?ln(t.omission):r}n=W(n);var o=n.length;if(bt(n)){var f=On(n);o=f.length}if(e>=o)return n;var c=e-Tt(r);if(c<1)return r;var l=f?st(f,0,c).join(""):n.slice(0,c);if(s===i)return l+r;if(f&&(c+=l.length-c),yi(s)){if(n.slice(c).search(s)){var v,_=l;for(s.global||(s=Br(s.source,W(Ji.exec(s))+"g")),s.lastIndex=0;v=s.exec(_);)var m=v.index;l=l.slice(0,m===i?c:m)}}else if(n.indexOf(ln(s),c)!=c){var P=l.lastIndexOf(s);P>-1&&(l=l.slice(0,P))}return l+r}function Bd(n){return n=W(n),n&&Va.test(n)?n.replace(Ki,_f):n}var Gd=Wt(function(n,t,e){return n+(e?" ":"")+t.toUpperCase()}),Ri=mu("toUpperCase");function va(n,t,e){return n=W(n),t=e?i:t,t===i?lf(n)?Pf(n):ef(n):n.match(t)||[]}var _a=L(function(n,t){try{return cn(n,i,t)}catch(e){return Ei(e)?e:new S(e)}}),zd=Yn(function(n,t){return mn(t,function(e){e=Wn(e),zn(n,e,Ii(n[e],n))}),n});function Kd(n){var t=n==null?0:n.length,e=x();return n=t?G(n,function(r){if(typeof r[1]!="function")throw new wn(U);return[e(r[0]),r[1]]}):[],L(function(r){for(var s=-1;++s<t;){var o=n[s];if(cn(o[0],this,r))return cn(o[1],this,r)}})}function Yd(n){return _c(An(n,Ln))}function bi(n){return function(){return n}}function Zd(n,t){return n==null||n!==n?t:n}var Jd=Pu(),Xd=Pu(!0);function fn(n){return n}function Ti(n){return Qs(typeof n=="function"?n:An(n,Ln))}function Qd(n){return ks(An(n,Ln))}function Vd(n,t){return js(n,An(t,Ln))}var kd=L(function(n,t){return function(e){return ae(e,n,t)}}),jd=L(function(n,t){return function(e){return ae(n,e,t)}});function Li(n,t,e){var r=V(t),s=ze(t,r);e==null&&!(z(t)&&(s.length||!r.length))&&(e=t,t=n,n=this,s=ze(t,V(t)));var o=!(z(e)&&"chain"in e)||!!e.chain,f=Jn(n);return mn(s,function(c){var l=t[c];n[c]=l,f&&(n.prototype[c]=function(){var v=this.__chain__;if(o||v){var _=n(this.__wrapped__),m=_.__actions__=un(this.__actions__);return m.push({func:l,args:arguments,thisArg:n}),_.__chain__=v,_}return l.apply(n,jn([this.value()],arguments))})}),n}function ng(){return k._===this&&(k._=yf),this}function Di(){}function tg(n){return n=R(n),L(function(t){return nu(t,n)})}var eg=ci(G),rg=ci(As),ig=ci(Hr);function ma(n){return _i(n)?$r(Wn(n)):Nc(n)}function sg(n){return function(t){return n==null?i:gt(n,t)}}var ug=Cu(),ag=Cu(!0);function Ni(){return[]}function Hi(){return!1}function og(){return{}}function fg(){return""}function cg(){return!0}function hg(n,t){if(n=R(n),n<1||n>Vn)return[];var e=Hn,r=nn(n,Hn);t=x(t),n-=Hn;for(var s=Fr(r,t);++e<n;)t(e);return s}function lg(n){return O(n)?G(n,Wn):pn(n)?[n]:un(Wu(W(n)))}function pg(n){var t=++xf;return W(n)+t}var dg=Qe(function(n,t){return n+t},0),gg=hi("ceil"),vg=Qe(function(n,t){return n/t},1),_g=hi("floor");function mg(n){return n&&n.length?Ge(n,fn,Qr):i}function wg(n,t){return n&&n.length?Ge(n,x(t,2),Qr):i}function Pg(n){return xs(n,fn)}function Ag(n,t){return xs(n,x(t,2))}function Cg(n){return n&&n.length?Ge(n,fn,ni):i}function Ig(n,t){return n&&n.length?Ge(n,x(t,2),ni):i}var xg=Qe(function(n,t){return n*t},1),Eg=hi("round"),yg=Qe(function(n,t){return n-t},0);function Sg(n){return n&&n.length?Wr(n,fn):0}function Og(n,t){return n&&n.length?Wr(n,x(t,2)):0}return a.after=Ql,a.ary=Xu,a.assign=Up,a.assignIn=fa,a.assignInWith=fr,a.assignWith=Wp,a.at=Fp,a.before=Qu,a.bind=Ii,a.bindAll=zd,a.bindKey=Vu,a.castArray=op,a.chain=Yu,a.chunk=_h,a.compact=mh,a.concat=wh,a.cond=Kd,a.conforms=Yd,a.constant=bi,a.countBy=Sl,a.create=Mp,a.curry=ku,a.curryRight=ju,a.debounce=na,a.defaults=qp,a.defaultsDeep=Bp,a.defer=Vl,a.delay=kl,a.difference=Ph,a.differenceBy=Ah,a.differenceWith=Ch,a.drop=Ih,a.dropRight=xh,a.dropRightWhile=Eh,a.dropWhile=yh,a.fill=Sh,a.filter=Rl,a.flatMap=Ll,a.flatMapDeep=Dl,a.flatMapDepth=Nl,a.flatten=Bu,a.flattenDeep=Oh,a.flattenDepth=Rh,a.flip=jl,a.flow=Jd,a.flowRight=Xd,a.fromPairs=bh,a.functions=Xp,a.functionsIn=Qp,a.groupBy=Hl,a.initial=Lh,a.intersection=Dh,a.intersectionBy=Nh,a.intersectionWith=Hh,a.invert=kp,a.invertBy=jp,a.invokeMap=Ul,a.iteratee=Ti,a.keyBy=Wl,a.keys=V,a.keysIn=on,a.map=rr,a.mapKeys=td,a.mapValues=ed,a.matches=Qd,a.matchesProperty=Vd,a.memoize=sr,a.merge=rd,a.mergeWith=ca,a.method=kd,a.methodOf=jd,a.mixin=Li,a.negate=ur,a.nthArg=tg,a.omit=id,a.omitBy=sd,a.once=np,a.orderBy=Fl,a.over=eg,a.overArgs=tp,a.overEvery=rg,a.overSome=ig,a.partial=xi,a.partialRight=ta,a.partition=Ml,a.pick=ud,a.pickBy=ha,a.property=ma,a.propertyOf=sg,a.pull=Fh,a.pullAll=zu,a.pullAllBy=Mh,a.pullAllWith=qh,a.pullAt=Bh,a.range=ug,a.rangeRight=ag,a.rearg=ep,a.reject=Gl,a.remove=Gh,a.rest=rp,a.reverse=Ai,a.sampleSize=Kl,a.set=od,a.setWith=fd,a.shuffle=Yl,a.slice=zh,a.sortBy=Xl,a.sortedUniq=Vh,a.sortedUniqBy=kh,a.split=Ld,a.spread=ip,a.tail=jh,a.take=nl,a.takeRight=tl,a.takeRightWhile=el,a.takeWhile=rl,a.tap=ml,a.throttle=sp,a.thru=er,a.toArray=ua,a.toPairs=la,a.toPairsIn=pa,a.toPath=lg,a.toPlainObject=oa,a.transform=cd,a.unary=up,a.union=il,a.unionBy=sl,a.unionWith=ul,a.uniq=al,a.uniqBy=ol,a.uniqWith=fl,a.unset=hd,a.unzip=Ci,a.unzipWith=Ku,a.update=ld,a.updateWith=pd,a.values=qt,a.valuesIn=dd,a.without=cl,a.words=va,a.wrap=ap,a.xor=hl,a.xorBy=ll,a.xorWith=pl,a.zip=dl,a.zipObject=gl,a.zipObjectDeep=vl,a.zipWith=_l,a.entries=la,a.entriesIn=pa,a.extend=fa,a.extendWith=fr,Li(a,a),a.add=dg,a.attempt=_a,a.camelCase=md,a.capitalize=da,a.ceil=gg,a.clamp=gd,a.clone=fp,a.cloneDeep=hp,a.cloneDeepWith=lp,a.cloneWith=cp,a.conformsTo=pp,a.deburr=ga,a.defaultTo=Zd,a.divide=vg,a.endsWith=wd,a.eq=bn,a.escape=Pd,a.escapeRegExp=Ad,a.every=Ol,a.find=bl,a.findIndex=Mu,a.findKey=Gp,a.findLast=Tl,a.findLastIndex=qu,a.findLastKey=zp,a.floor=_g,a.forEach=Zu,a.forEachRight=Ju,a.forIn=Kp,a.forInRight=Yp,a.forOwn=Zp,a.forOwnRight=Jp,a.get=Si,a.gt=dp,a.gte=gp,a.has=Vp,a.hasIn=Oi,a.head=Gu,a.identity=fn,a.includes=$l,a.indexOf=Th,a.inRange=vd,a.invoke=nd,a.isArguments=mt,a.isArray=O,a.isArrayBuffer=vp,a.isArrayLike=an,a.isArrayLikeObject=Y,a.isBoolean=_p,a.isBuffer=ut,a.isDate=mp,a.isElement=wp,a.isEmpty=Pp,a.isEqual=Ap,a.isEqualWith=Cp,a.isError=Ei,a.isFinite=Ip,a.isFunction=Jn,a.isInteger=ea,a.isLength=ar,a.isMap=ra,a.isMatch=xp,a.isMatchWith=Ep,a.isNaN=yp,a.isNative=Sp,a.isNil=Rp,a.isNull=Op,a.isNumber=ia,a.isObject=z,a.isObjectLike=K,a.isPlainObject=pe,a.isRegExp=yi,a.isSafeInteger=bp,a.isSet=sa,a.isString=or,a.isSymbol=pn,a.isTypedArray=Mt,a.isUndefined=Tp,a.isWeakMap=Lp,a.isWeakSet=Dp,a.join=$h,a.kebabCase=Cd,a.last=In,a.lastIndexOf=Uh,a.lowerCase=Id,a.lowerFirst=xd,a.lt=Np,a.lte=Hp,a.max=mg,a.maxBy=wg,a.mean=Pg,a.meanBy=Ag,a.min=Cg,a.minBy=Ig,a.stubArray=Ni,a.stubFalse=Hi,a.stubObject=og,a.stubString=fg,a.stubTrue=cg,a.multiply=xg,a.nth=Wh,a.noConflict=ng,a.noop=Di,a.now=ir,a.pad=Ed,a.padEnd=yd,a.padStart=Sd,a.parseInt=Od,a.random=_d,a.reduce=ql,a.reduceRight=Bl,a.repeat=Rd,a.replace=bd,a.result=ad,a.round=Eg,a.runInContext=h,a.sample=zl,a.size=Zl,a.snakeCase=Td,a.some=Jl,a.sortedIndex=Kh,a.sortedIndexBy=Yh,a.sortedIndexOf=Zh,a.sortedLastIndex=Jh,a.sortedLastIndexBy=Xh,a.sortedLastIndexOf=Qh,a.startCase=Dd,a.startsWith=Nd,a.subtract=yg,a.sum=Sg,a.sumBy=Og,a.template=Hd,a.times=hg,a.toFinite=Xn,a.toInteger=R,a.toLength=aa,a.toLower=$d,a.toNumber=xn,a.toSafeInteger=$p,a.toString=W,a.toUpper=Ud,a.trim=Wd,a.trimEnd=Fd,a.trimStart=Md,a.truncate=qd,a.unescape=Bd,a.uniqueId=pg,a.upperCase=Gd,a.upperFirst=Ri,a.each=Zu,a.eachRight=Ju,a.first=Gu,Li(a,function(){var n={};return $n(a,function(t,e){F.call(a.prototype,e)||(n[e]=t)}),n}(),{chain:!1}),a.VERSION=d,mn(["bind","bindKey","curry","curryRight","partial","partialRight"],function(n){a[n].placeholder=a}),mn(["drop","take"],function(n,t){N.prototype[n]=function(e){e=e===i?1:Q(R(e),0);var r=this.__filtered__&&!t?new N(this):this.clone();return r.__filtered__?r.__takeCount__=nn(e,r.__takeCount__):r.__views__.push({size:nn(e,Hn),type:n+(r.__dir__<0?"Right":"")}),r},N.prototype[n+"Right"]=function(e){return this.reverse()[n](e).reverse()}}),mn(["filter","map","takeWhile"],function(n,t){var e=t+1,r=e==Bi||e==Ua;N.prototype[n]=function(s){var o=this.clone();return o.__iteratees__.push({iteratee:x(s,3),type:e}),o.__filtered__=o.__filtered__||r,o}}),mn(["head","last"],function(n,t){var e="take"+(t?"Right":"");N.prototype[n]=function(){return this[e](1).value()[0]}}),mn(["initial","tail"],function(n,t){var e="drop"+(t?"":"Right");N.prototype[n]=function(){return this.__filtered__?new N(this):this[e](1)}}),N.prototype.compact=function(){return this.filter(fn)},N.prototype.find=function(n){return this.filter(n).head()},N.prototype.findLast=function(n){return this.reverse().find(n)},N.prototype.invokeMap=L(function(n,t){return typeof n=="function"?new N(this):this.map(function(e){return ae(e,n,t)})}),N.prototype.reject=function(n){return this.filter(ur(x(n)))},N.prototype.slice=function(n,t){n=R(n);var e=this;return e.__filtered__&&(n>0||t<0)?new N(e):(n<0?e=e.takeRight(-n):n&&(e=e.drop(n)),t!==i&&(t=R(t),e=t<0?e.dropRight(-t):e.take(t-n)),e)},N.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},N.prototype.toArray=function(){return this.take(Hn)},$n(N.prototype,function(n,t){var e=/^(?:filter|find|map|reject)|While$/.test(t),r=/^(?:head|last)$/.test(t),s=a[r?"take"+(t=="last"?"Right":""):t],o=r||/^find/.test(t);s&&(a.prototype[t]=function(){var f=this.__wrapped__,c=r?[1]:arguments,l=f instanceof N,v=c[0],_=l||O(f),m=function(D){var H=s.apply(a,jn([D],c));return r&&P?H[0]:H};_&&e&&typeof v=="function"&&v.length!=1&&(l=_=!1);var P=this.__chain__,I=!!this.__actions__.length,E=o&&!P,b=l&&!I;if(!o&&_){f=b?f:new N(this);var y=n.apply(f,c);return y.__actions__.push({func:er,args:[m],thisArg:i}),new Pn(y,P)}return E&&b?n.apply(this,c):(y=this.thru(m),E?r?y.value()[0]:y.value():y)})}),mn(["pop","push","shift","sort","splice","unshift"],function(n){var t=Oe[n],e=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",r=/^(?:pop|shift)$/.test(n);a.prototype[n]=function(){var s=arguments;if(r&&!this.__chain__){var o=this.value();return t.apply(O(o)?o:[],s)}return this[e](function(f){return t.apply(O(f)?f:[],s)})}}),$n(N.prototype,function(n,t){var e=a[t];if(e){var r=e.name+"";F.call(Ht,r)||(Ht[r]=[]),Ht[r].push({name:t,func:e})}}),Ht[Xe(i,ot).name]=[{name:"wrapper",func:i}],N.prototype.clone=Bf,N.prototype.reverse=Gf,N.prototype.value=zf,a.prototype.at=wl,a.prototype.chain=Pl,a.prototype.commit=Al,a.prototype.next=Cl,a.prototype.plant=xl,a.prototype.reverse=El,a.prototype.toJSON=a.prototype.valueOf=a.prototype.value=yl,a.prototype.first=a.prototype.head,ne&&(a.prototype[ne]=Il),a},Lt=Af();ct?((ct.exports=Lt)._=Lt,Tr._=Lt):k._=Lt}).call(ge)})(Ui,Ui.exports);var qg=Object.defineProperty,Bg=Object.defineProperties,Gg=Object.getOwnPropertyDescriptors,Ea=Object.getOwnPropertySymbols,zg=Object.prototype.hasOwnProperty,Kg=Object.prototype.propertyIsEnumerable,ya=(C,u,i)=>u in C?qg(C,u,{enumerable:!0,configurable:!0,writable:!0,value:i}):C[u]=i,cr=(C,u)=>{for(var i in u||(u={}))zg.call(u,i)&&ya(C,i,u[i]);if(Ea)for(var i of Ea(u))Kg.call(u,i)&&ya(C,i,u[i]);return C},Yg=(C,u)=>Bg(C,Gg(u));function Gt(C,u,i){var d;const w=(0,index_cjs.parseChainId)(C);return((d=u.rpcMap)==null?void 0:d[w.reference])||`${Mg}?chainId=${w.namespace}:${w.reference}&projectId=${i}`}function Pt(C){return C.includes(":")?C.split(":")[1]:C}function Sa(C){return C.map(u=>`${u.split(":")[0]}:${u.split(":")[1]}`)}function Zg(C,u){const i=Object.keys(u.namespaces).filter(w=>w.includes(C));if(!i.length)return[];const d=[];return i.forEach(w=>{const T=u.namespaces[w].accounts;d.push(...T)}),d}function Jg(C={},u={}){const i=Oa(C),d=Oa(u);return Ui.exports.merge(i,d)}function Oa(C){var u,i,d,w;const T={};if(!(0,index_cjs.isValidObject)(C))return T;for(const[U,En]of Object.entries(C)){const zt=(0,index_cjs.isCaipNamespace)(U)?[U]:En.chains,pr=En.methods||[],At=En.events||[],Ln=En.rpcMap||{},Fn=(0,index_cjs.parseNamespaceKey)(U);T[Fn]=Yg(cr(cr({},T[Fn]),En),{chains:(0,index_cjs.mergeArrays)(zt,(u=T[Fn])==null?void 0:u.chains),methods:(0,index_cjs.mergeArrays)(pr,(i=T[Fn])==null?void 0:i.methods),events:(0,index_cjs.mergeArrays)(At,(d=T[Fn])==null?void 0:d.events),rpcMap:cr(cr({},Ln),(w=T[Fn])==null?void 0:w.rpcMap)})}return T}function Xg(C){return C.includes(":")?C.split(":")[2]:C}function Qg(C){const u={};for(const[i,d]of Object.entries(C)){const w=d.methods||[],T=d.events||[],U=d.accounts||[],En=(0,index_cjs.isCaipNamespace)(i)?[i]:d.chains?d.chains:Sa(d.accounts);u[i]={chains:En,methods:w,events:T,accounts:U}}return u}function Wi(C){return typeof C=="number"?C:C.includes("0x")?parseInt(C,16):C.includes(":")?Number(C.split(":")[1]):Number(C)}const Ra={},J=C=>Ra[C],Fi=(C,u)=>{Ra[C]=u};class Vg{constructor(u){this.name="polkadot",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders()}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}request(u){return this.namespace.methods.includes(u.request.method)?this.client.request(u):this.getHttpProvider().request(u.request)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(u,i),this.chainId=u,this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${u}`)}getAccounts(){const u=this.namespace.accounts;return u?u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2])||[]:[]}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{var d;const w=Pt(i);u[w]=this.createHttpProvider(w,(d=this.namespace.rpcMap)==null?void 0:d[i])}),u}getHttpProvider(){const u=`${this.name}:${this.chainId}`,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProvider(u,i){const d=i||Gt(u,this.namespace,this.client.core.projectId);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new (dist_cjs_default())(d,J("disableProviderPing")))}}class kg{constructor(u){this.name="eip155",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.httpProviders=this.createHttpProviders(),this.chainId=parseInt(this.getDefaultChain())}async request(u){switch(u.request.method){case"eth_requestAccounts":return this.getAccounts();case"eth_accounts":return this.getAccounts();case"wallet_switchEthereumChain":return await this.handleSwitchChain(u);case"eth_chainId":return parseInt(this.getDefaultChain())}return this.namespace.methods.includes(u.request.method)?await this.client.request(u):this.getHttpProvider().request(u.request)}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(parseInt(u),i),this.chainId=parseInt(u),this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${u}`)}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId.toString();if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}createHttpProvider(u,i){const d=i||Gt(`${this.name}:${u}`,this.namespace,this.client.core.projectId);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new dist_cjs.HttpConnection(d,J("disableProviderPing")))}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{var d;const w=parseInt(Pt(i));u[w]=this.createHttpProvider(w,(d=this.namespace.rpcMap)==null?void 0:d[i])}),u}getAccounts(){const u=this.namespace.accounts;return u?[...new Set(u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2]))]:[]}getHttpProvider(){const u=this.chainId,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}async handleSwitchChain(u){var i,d;let w=u.request.params?(i=u.request.params[0])==null?void 0:i.chainId:"0x0";w=w.startsWith("0x")?w:`0x${w}`;const T=parseInt(w,16);if(this.isChainApproved(T))this.setDefaultChain(`${T}`);else if(this.namespace.methods.includes("wallet_switchEthereumChain"))await this.client.request({topic:u.topic,request:{method:u.request.method,params:[{chainId:w}]},chainId:(d=this.namespace.chains)==null?void 0:d[0]}),this.setDefaultChain(`${T}`);else throw new Error(`Failed to switch to chain 'eip155:${T}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);return null}isChainApproved(u){return this.namespace.chains.includes(`${this.name}:${u}`)}}class jg{constructor(u){this.name="solana",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders()}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}requestAccounts(){return this.getAccounts()}request(u){return this.namespace.methods.includes(u.request.method)?this.client.request(u):this.getHttpProvider().request(u.request)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(u,i),this.chainId=u,this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${u}`)}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}getAccounts(){const u=this.namespace.accounts;return u?[...new Set(u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2]))]:[]}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{var d;const w=Pt(i);u[w]=this.createHttpProvider(w,(d=this.namespace.rpcMap)==null?void 0:d[i])}),u}getHttpProvider(){const u=`${this.name}:${this.chainId}`,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProvider(u,i){const d=i||Gt(u,this.namespace,this.client.core.projectId);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new (dist_cjs_default())(d,J("disableProviderPing")))}}class nv{constructor(u){this.name="cosmos",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders()}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}request(u){return this.namespace.methods.includes(u.request.method)?this.client.request(u):this.getHttpProvider().request(u.request)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(u,i),this.chainId=u,this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`)}getAccounts(){const u=this.namespace.accounts;return u?[...new Set(u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2]))]:[]}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{var d;const w=Pt(i);u[w]=this.createHttpProvider(w,(d=this.namespace.rpcMap)==null?void 0:d[i])}),u}getHttpProvider(){const u=`${this.name}:${this.chainId}`,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProvider(u,i){const d=i||Gt(u,this.namespace,this.client.core.projectId);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new (dist_cjs_default())(d,J("disableProviderPing")))}}class tv{constructor(u){this.name="cip34",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders()}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}requestAccounts(){return this.getAccounts()}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}request(u){return this.namespace.methods.includes(u.request.method)?this.client.request(u):this.getHttpProvider().request(u.request)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(u,i),this.chainId=u,this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${this.chainId}`)}getAccounts(){const u=this.namespace.accounts;return u?[...new Set(u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2]))]:[]}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{const d=this.getCardanoRPCUrl(i),w=Pt(i);u[w]=this.createHttpProvider(w,d)}),u}getHttpProvider(){const u=`${this.name}:${this.chainId}`,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}getCardanoRPCUrl(u){const i=this.namespace.rpcMap;if(i)return i[u]}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProvider(u,i){const d=i||this.getCardanoRPCUrl(u);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new (dist_cjs_default())(d,J("disableProviderPing")))}}class ev{constructor(u){this.name="elrond",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders()}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}requestAccounts(){return this.getAccounts()}request(u){return this.namespace.methods.includes(u.request.method)?this.client.request(u):this.getHttpProvider().request(u.request)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(u,i),this.chainId=u,this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${u}`)}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}getAccounts(){const u=this.namespace.accounts;return u?[...new Set(u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2]))]:[]}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{var d;const w=Pt(i);u[w]=this.createHttpProvider(w,(d=this.namespace.rpcMap)==null?void 0:d[i])}),u}getHttpProvider(){const u=`${this.name}:${this.chainId}`,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProvider(u,i){const d=i||Gt(u,this.namespace,this.client.core.projectId);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new (dist_cjs_default())(d,J("disableProviderPing")))}}class rv{constructor(u){this.name="multiversx",this.namespace=u.namespace,this.events=J("events"),this.client=J("client"),this.chainId=this.getDefaultChain(),this.httpProviders=this.createHttpProviders()}updateNamespace(u){this.namespace=Object.assign(this.namespace,u)}requestAccounts(){return this.getAccounts()}request(u){return this.namespace.methods.includes(u.request.method)?this.client.request(u):this.getHttpProvider().request(u.request)}setDefaultChain(u,i){this.httpProviders[u]||this.setHttpProvider(u,i),this.chainId=u,this.events.emit(at.DEFAULT_CHAIN_CHANGED,`${this.name}:${u}`)}getDefaultChain(){if(this.chainId)return this.chainId;if(this.namespace.defaultChain)return this.namespace.defaultChain;const u=this.namespace.chains[0];if(!u)throw new Error("ChainId not found");return u.split(":")[1]}getAccounts(){const u=this.namespace.accounts;return u?[...new Set(u.filter(i=>i.split(":")[1]===this.chainId.toString()).map(i=>i.split(":")[2]))]:[]}createHttpProviders(){const u={};return this.namespace.chains.forEach(i=>{var d;const w=Pt(i);u[w]=this.createHttpProvider(w,(d=this.namespace.rpcMap)==null?void 0:d[i])}),u}getHttpProvider(){const u=`${this.name}:${this.chainId}`,i=this.httpProviders[u];if(typeof i>"u")throw new Error(`JSON-RPC provider for ${u} not found`);return i}setHttpProvider(u,i){const d=this.createHttpProvider(u,i);d&&(this.httpProviders[u]=d)}createHttpProvider(u,i){const d=i||Gt(u,this.namespace,this.client.core.projectId);if(!d)throw new Error(`No RPC url provided for chainId: ${u}`);return new jsonrpc_provider_dist_cjs.JsonRpcProvider(new (dist_cjs_default())(d,J("disableProviderPing")))}}var iv=Object.defineProperty,sv=Object.defineProperties,uv=Object.getOwnPropertyDescriptors,ba=Object.getOwnPropertySymbols,av=Object.prototype.hasOwnProperty,ov=Object.prototype.propertyIsEnumerable,Ta=(C,u,i)=>u in C?iv(C,u,{enumerable:!0,configurable:!0,writable:!0,value:i}):C[u]=i,hr=(C,u)=>{for(var i in u||(u={}))av.call(u,i)&&Ta(C,i,u[i]);if(ba)for(var i of ba(u))ov.call(u,i)&&Ta(C,i,u[i]);return C},Mi=(C,u)=>sv(C,uv(u));class lr{constructor(u){this.events=new (external_events_default()),this.rpcProviders={},this.shouldAbortPairingAttempt=!1,this.maxPairingAttempts=10,this.disableProviderPing=!1,this.providerOpts=u,this.logger=typeof u?.logger<"u"&&typeof u?.logger!="string"?u.logger:(0,cjs.pino)((0,cjs.getDefaultLoggerOptions)({level:u?.logger||Ia})),this.disableProviderPing=u?.disableProviderPing||!1}static async init(u){const i=new lr(u);return await i.initialize(),i}async request(u,i){const[d,w]=this.validateChain(i);if(!this.session)throw new Error("Please call connect() before request()");return await this.getProvider(d).request({request:hr({},u),chainId:`${d}:${w}`,topic:this.session.topic})}sendAsync(u,i,d){this.request(u,d).then(w=>i(null,w)).catch(w=>i(w,void 0))}async enable(){if(!this.client)throw new Error("Sign Client not initialized");return this.session||await this.connect({namespaces:this.namespaces,optionalNamespaces:this.optionalNamespaces,sessionProperties:this.sessionProperties}),await this.requestAccounts()}async disconnect(){var u;if(!this.session)throw new Error("Please call connect() before enable()");await this.client.disconnect({topic:(u=this.session)==null?void 0:u.topic,reason:(0,index_cjs.getSdkError)("USER_DISCONNECTED")}),await this.cleanup()}async connect(u){if(!this.client)throw new Error("Sign Client not initialized");if(this.setNamespaces(u),await this.cleanupPendingPairings(),!u.skipPairing)return await this.pair(u.pairingTopic)}on(u,i){this.events.on(u,i)}once(u,i){this.events.once(u,i)}removeListener(u,i){this.events.removeListener(u,i)}off(u,i){this.events.off(u,i)}get isWalletConnect(){return!0}async pair(u){this.shouldAbortPairingAttempt=!1;let i=0;do{if(this.shouldAbortPairingAttempt)throw new Error("Pairing aborted");if(i>=this.maxPairingAttempts)throw new Error("Max auto pairing attempts reached");const{uri:d,approval:w}=await this.client.connect({pairingTopic:u,requiredNamespaces:this.namespaces,optionalNamespaces:this.optionalNamespaces,sessionProperties:this.sessionProperties});d&&(this.uri=d,this.events.emit("display_uri",d)),await w().then(T=>{this.session=T,this.namespaces||(this.namespaces=Qg(T.namespaces),this.persist("namespaces",this.namespaces))}).catch(T=>{if(T.message!==dist_index_cjs/* PROPOSAL_EXPIRY_MESSAGE */.lO)throw T;i++})}while(!this.session);return this.onConnect(),this.session}setDefaultChain(u,i){try{if(!this.session)return;const[d,w]=this.validateChain(u);this.getProvider(d).setDefaultChain(w,i)}catch(d){if(!/Please call connect/.test(d.message))throw d}}async cleanupPendingPairings(u={}){this.logger.info("Cleaning up inactive pairings...");const i=this.client.pairing.getAll();if((0,index_cjs.isValidArray)(i)){for(const d of i)u.deletePairings?this.client.core.expirer.set(d.topic,0):await this.client.core.relayer.subscriber.unsubscribe(d.topic);this.logger.info(`Inactive pairings cleared: ${i.length}`)}}abortPairingAttempt(){this.shouldAbortPairingAttempt=!0}async checkStorage(){if(this.namespaces=await this.getFromStore("namespaces"),this.optionalNamespaces=await this.getFromStore("optionalNamespaces")||{},this.client.session.length){const u=this.client.session.keys.length-1;this.session=this.client.session.get(this.client.session.keys[u]),this.createProviders()}}async initialize(){this.logger.trace("Initialized"),await this.createClient(),await this.checkStorage(),this.registerEventListeners()}async createClient(){this.client=this.providerOpts.client||await dist_index_cjs/* default */.ZP.init({logger:this.providerOpts.logger||Ia,relayUrl:this.providerOpts.relayUrl||Ug,projectId:this.providerOpts.projectId,metadata:this.providerOpts.metadata,storageOptions:this.providerOpts.storageOptions,storage:this.providerOpts.storage,name:this.providerOpts.name}),this.logger.trace("SignClient Initialized")}createProviders(){if(!this.client)throw new Error("Sign Client not initialized");if(!this.session)throw new Error("Session not initialized. Please call connect() before enable()");const u=[...new Set(Object.keys(this.session.namespaces).map(i=>(0,index_cjs.parseNamespaceKey)(i)))];Fi("client",this.client),Fi("events",this.events),Fi("disableProviderPing",this.disableProviderPing),u.forEach(i=>{if(!this.session)return;const d=Zg(i,this.session),w=Sa(d),T=Jg(this.namespaces,this.optionalNamespaces),U=Mi(hr({},T[i]),{accounts:d,chains:w});switch(i){case"eip155":this.rpcProviders[i]=new kg({namespace:U});break;case"solana":this.rpcProviders[i]=new jg({namespace:U});break;case"cosmos":this.rpcProviders[i]=new nv({namespace:U});break;case"polkadot":this.rpcProviders[i]=new Vg({namespace:U});break;case"cip34":this.rpcProviders[i]=new tv({namespace:U});break;case"elrond":this.rpcProviders[i]=new ev({namespace:U});break;case"multiversx":this.rpcProviders[i]=new rv({namespace:U});break}})}registerEventListeners(){if(typeof this.client>"u")throw new Error("Sign Client is not initialized");this.client.on("session_ping",u=>{this.events.emit("session_ping",u)}),this.client.on("session_event",u=>{const{params:i}=u,{event:d}=i;if(d.name==="accountsChanged"){const w=d.data;w&&(0,index_cjs.isValidArray)(w)&&this.events.emit("accountsChanged",w.map(Xg))}else if(d.name==="chainChanged"){const w=i.chainId,T=i.event.data,U=(0,index_cjs.parseNamespaceKey)(w),En=Wi(w)!==Wi(T)?`${U}:${Wi(T)}`:w;this.onChainChanged(En)}else this.events.emit(d.name,d.data);this.events.emit("session_event",u)}),this.client.on("session_update",({topic:u,params:i})=>{var d;const{namespaces:w}=i,T=(d=this.client)==null?void 0:d.session.get(u);this.session=Mi(hr({},T),{namespaces:w}),this.onSessionUpdate(),this.events.emit("session_update",{topic:u,params:i})}),this.client.on("session_delete",async u=>{await this.cleanup(),this.events.emit("session_delete",u),this.events.emit("disconnect",Mi(hr({},(0,index_cjs.getSdkError)("USER_DISCONNECTED")),{data:u.topic}))}),this.on(at.DEFAULT_CHAIN_CHANGED,u=>{this.onChainChanged(u,!0)})}getProvider(u){if(!this.rpcProviders[u])throw new Error(`Provider not found: ${u}`);return this.rpcProviders[u]}onSessionUpdate(){Object.keys(this.rpcProviders).forEach(u=>{var i;this.getProvider(u).updateNamespace((i=this.session)==null?void 0:i.namespaces[u])})}setNamespaces(u){const{namespaces:i,optionalNamespaces:d,sessionProperties:w}=u;i&&Object.keys(i).length&&(this.namespaces=i),d&&Object.keys(d).length&&(this.optionalNamespaces=d),this.sessionProperties=w,this.persist("namespaces",i),this.persist("optionalNamespaces",d)}validateChain(u){const[i,d]=u?.split(":")||["",""];if(!this.namespaces||!Object.keys(this.namespaces).length)return[i,d];if(i&&!Object.keys(this.namespaces||{}).map(U=>(0,index_cjs.parseNamespaceKey)(U)).includes(i))throw new Error(`Namespace '${i}' is not configured. Please call connect() first with namespace config.`);if(i&&d)return[i,d];const w=(0,index_cjs.parseNamespaceKey)(Object.keys(this.namespaces)[0]),T=this.rpcProviders[w].getDefaultChain();return[w,T]}async requestAccounts(){const[u]=this.validateChain();return await this.getProvider(u).requestAccounts()}onChainChanged(u,i=!1){var d;if(!this.namespaces)return;const[w,T]=this.validateChain(u);i||this.getProvider(w).setDefaultChain(T),((d=this.namespaces[w])!=null?d:this.namespaces[`${w}:${T}`]).defaultChain=T,this.persist("namespaces",this.namespaces),this.events.emit("chainChanged",T)}onConnect(){this.createProviders(),this.events.emit("connect",{session:this.session})}async cleanup(){this.session=void 0,this.namespaces=void 0,this.optionalNamespaces=void 0,this.sessionProperties=void 0,this.persist("namespaces",void 0),this.persist("optionalNamespaces",void 0),this.persist("sessionProperties",void 0),await this.cleanupPendingPairings({deletePairings:!0})}persist(u,i){this.client.core.storage.setItem(`${xa}/${u}`,i)}async getFromStore(u){return await this.client.core.storage.getItem(`${xa}/${u}`)}}const fv=lr;
//# sourceMappingURL=index.es.js.map

;// CONCATENATED MODULE: ./node_modules/@walletconnect/ethereum-provider/dist/index.es.js
const P="wc",S="ethereum_provider",$=`${P}@2:${S}:`,j="https://rpc.walletconnect.com/v1/",u=["eth_sendTransaction","personal_sign"],E=["eth_accounts","eth_requestAccounts","eth_sendRawTransaction","eth_sign","eth_signTransaction","eth_signTypedData","eth_signTypedData_v3","eth_signTypedData_v4","eth_sendTransaction","personal_sign","wallet_switchEthereumChain","wallet_addEthereumChain","wallet_getPermissions","wallet_requestPermissions","wallet_registerOnboarding","wallet_watchAsset","wallet_scanQRCode"],m=["chainChanged","accountsChanged"],_=["chainChanged","accountsChanged","message","disconnect","connect"];var N=Object.defineProperty,q=Object.defineProperties,D=Object.getOwnPropertyDescriptors,y=Object.getOwnPropertySymbols,U=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable,O=(a,t,s)=>t in a?N(a,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[t]=s,p=(a,t)=>{for(var s in t||(t={}))U.call(t,s)&&O(a,s,t[s]);if(y)for(var s of y(t))Q.call(t,s)&&O(a,s,t[s]);return a},M=(a,t)=>q(a,D(t));function g(a){return Number(a[0].split(":")[1])}function f(a){return`0x${a.toString(16)}`}function L(a){const{chains:t,optionalChains:s,methods:i,optionalMethods:n,events:e,optionalEvents:h,rpcMap:c}=a;if(!(0,index_cjs.isValidArray)(t))throw new Error("Invalid chains");const o={chains:t,methods:i||u,events:e||m,rpcMap:p({},t.length?{[g(t)]:c[g(t)]}:{})},r=e?.filter(l=>!m.includes(l)),d=i?.filter(l=>!u.includes(l));if(!s&&!h&&!n&&!(r!=null&&r.length)&&!(d!=null&&d.length))return{required:t.length?o:void 0};const C=r?.length&&d?.length||!s,I={chains:[...new Set(C?o.chains.concat(s||[]):s)],methods:[...new Set(o.methods.concat(n!=null&&n.length?n:E))],events:[...new Set(o.events.concat(h!=null&&h.length?h:_))],rpcMap:c};return{required:t.length?o:void 0,optional:s.length?I:void 0}}class v{constructor(){this.events=new external_events_.EventEmitter,this.namespace="eip155",this.accounts=[],this.chainId=1,this.STORAGE_KEY=$,this.on=(t,s)=>(this.events.on(t,s),this),this.once=(t,s)=>(this.events.once(t,s),this),this.removeListener=(t,s)=>(this.events.removeListener(t,s),this),this.off=(t,s)=>(this.events.off(t,s),this),this.parseAccount=t=>this.isCompatibleChainId(t)?this.parseAccountId(t).address:t,this.signer={},this.rpc={}}static async init(t){const s=new v;return await s.initialize(t),s}async request(t){return await this.signer.request(t,this.formatChainId(this.chainId))}sendAsync(t,s){this.signer.sendAsync(t,s,this.formatChainId(this.chainId))}get connected(){return this.signer.client?this.signer.client.core.relayer.connected:!1}get connecting(){return this.signer.client?this.signer.client.core.relayer.connecting:!1}async enable(){return this.session||await this.connect(),await this.request({method:"eth_requestAccounts"})}async connect(t){if(!this.signer.client)throw new Error("Provider not initialized. Call init() first");this.loadConnectOpts(t);const{required:s,optional:i}=L(this.rpc);try{const n=await new Promise(async(h,c)=>{var o;this.rpc.showQrModal&&((o=this.modal)==null||o.subscribeModal(r=>{!r.open&&!this.signer.session&&(this.signer.abortPairingAttempt(),c(new Error("Connection request reset. Please try again.")))})),await this.signer.connect(M(p({namespaces:p({},s&&{[this.namespace]:s})},i&&{optionalNamespaces:{[this.namespace]:i}}),{pairingTopic:t?.pairingTopic})).then(r=>{h(r)}).catch(r=>{c(new Error(r.message))})});if(!n)return;const e=(0,index_cjs.getAccountsFromNamespaces)(n.namespaces,[this.namespace]);this.setChainIds(this.rpc.chains.length?this.rpc.chains:e),this.setAccounts(e),this.events.emit("connect",{chainId:f(this.chainId)})}catch(n){throw this.signer.logger.error(n),n}finally{this.modal&&this.modal.closeModal()}}async disconnect(){this.session&&await this.signer.disconnect(),this.reset()}get isWalletConnect(){return!0}get session(){return this.signer.session}registerEventListeners(){this.signer.on("session_event",t=>{const{params:s}=t,{event:i}=s;i.name==="accountsChanged"?(this.accounts=this.parseAccounts(i.data),this.events.emit("accountsChanged",this.accounts)):i.name==="chainChanged"?this.setChainId(this.formatChainId(i.data)):this.events.emit(i.name,i.data),this.events.emit("session_event",t)}),this.signer.on("chainChanged",t=>{const s=parseInt(t);this.chainId=s,this.events.emit("chainChanged",f(this.chainId)),this.persist()}),this.signer.on("session_update",t=>{this.events.emit("session_update",t)}),this.signer.on("session_delete",t=>{this.reset(),this.events.emit("session_delete",t),this.events.emit("disconnect",M(p({},(0,index_cjs.getSdkError)("USER_DISCONNECTED")),{data:t.topic,name:"USER_DISCONNECTED"}))}),this.signer.on("display_uri",t=>{var s,i;this.rpc.showQrModal&&((s=this.modal)==null||s.closeModal(),(i=this.modal)==null||i.openModal({uri:t})),this.events.emit("display_uri",t)})}switchEthereumChain(t){this.request({method:"wallet_switchEthereumChain",params:[{chainId:t.toString(16)}]})}isCompatibleChainId(t){return typeof t=="string"?t.startsWith(`${this.namespace}:`):!1}formatChainId(t){return`${this.namespace}:${t}`}parseChainId(t){return Number(t.split(":")[1])}setChainIds(t){const s=t.filter(i=>this.isCompatibleChainId(i)).map(i=>this.parseChainId(i));s.length&&(this.chainId=s[0],this.events.emit("chainChanged",f(this.chainId)),this.persist())}setChainId(t){if(this.isCompatibleChainId(t)){const s=this.parseChainId(t);this.chainId=s,this.switchEthereumChain(s)}}parseAccountId(t){const[s,i,n]=t.split(":");return{chainId:`${s}:${i}`,address:n}}setAccounts(t){this.accounts=t.filter(s=>this.parseChainId(this.parseAccountId(s).chainId)===this.chainId).map(s=>this.parseAccountId(s).address),this.events.emit("accountsChanged",this.accounts)}getRpcConfig(t){var s,i;const n=(s=t?.chains)!=null?s:[],e=(i=t?.optionalChains)!=null?i:[],h=n.concat(e);if(!h.length)throw new Error("No chains specified in either `chains` or `optionalChains`");const c=n.length?t?.methods||u:[],o=n.length?t?.events||m:[],r=t?.optionalMethods||[],d=t?.optionalEvents||[],C=t?.rpcMap||this.buildRpcMap(h,t.projectId),I=t?.qrModalOptions||void 0;return{chains:n?.map(l=>this.formatChainId(l)),optionalChains:e.map(l=>this.formatChainId(l)),methods:c,events:o,optionalMethods:r,optionalEvents:d,rpcMap:C,showQrModal:!!(t!=null&&t.showQrModal),qrModalOptions:I,projectId:t.projectId,metadata:t.metadata}}buildRpcMap(t,s){const i={};return t.forEach(n=>{i[n]=this.getRpcUrl(n,s)}),i}async initialize(t){if(this.rpc=this.getRpcConfig(t),this.chainId=this.rpc.chains.length?g(this.rpc.chains):g(this.rpc.optionalChains),this.signer=await fv.init({projectId:this.rpc.projectId,metadata:this.rpc.metadata,disableProviderPing:t.disableProviderPing,relayUrl:t.relayUrl,storageOptions:t.storageOptions}),this.registerEventListeners(),await this.loadPersistedSession(),this.rpc.showQrModal){let s;try{const{WalletConnectModal:i}=await __webpack_require__.e(/* import() */ 7438).then(__webpack_require__.bind(__webpack_require__, 67438));s=i}catch{throw new Error("To use QR modal, please install @walletconnect/modal package")}if(s)try{this.modal=new s(p({walletConnectVersion:2,projectId:this.rpc.projectId,standaloneChains:this.rpc.chains},this.rpc.qrModalOptions))}catch(i){throw this.signer.logger.error(i),new Error("Could not generate WalletConnectModal Instance")}}}loadConnectOpts(t){if(!t)return;const{chains:s,optionalChains:i,rpcMap:n}=t;s&&(0,index_cjs.isValidArray)(s)&&(this.rpc.chains=s.map(e=>this.formatChainId(e)),s.forEach(e=>{this.rpc.rpcMap[e]=n?.[e]||this.getRpcUrl(e)})),i&&(0,index_cjs.isValidArray)(i)&&(this.rpc.optionalChains=[],this.rpc.optionalChains=i?.map(e=>this.formatChainId(e)),i.forEach(e=>{this.rpc.rpcMap[e]=n?.[e]||this.getRpcUrl(e)}))}getRpcUrl(t,s){var i;return((i=this.rpc.rpcMap)==null?void 0:i[t])||`${j}?chainId=eip155:${t}&projectId=${s||this.rpc.projectId}`}async loadPersistedSession(){if(!this.session)return;const t=await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`),s=this.session.namespaces[`${this.namespace}:${t}`]?this.session.namespaces[`${this.namespace}:${t}`]:this.session.namespaces[this.namespace];this.setChainIds(t?[this.formatChainId(t)]:s?.accounts),this.setAccounts(s?.accounts)}reset(){this.chainId=1,this.accounts=[]}persist(){this.session&&this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`,this.chainId)}parseAccounts(t){return typeof t=="string"||t instanceof String?[this.parseAccount(t)]:t.map(s=>this.parseAccount(s))}}const G=v;
//# sourceMappingURL=index.es.js.map


/***/ }),

/***/ 44106:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IEvents = void 0;
class IEvents {
}
exports.IEvents = IEvents;
//# sourceMappingURL=events.js.map

/***/ }),

/***/ 57035:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(53652);
tslib_1.__exportStar(__webpack_require__(44106), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 53652:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 46267:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HEARTBEAT_EVENTS = exports.HEARTBEAT_INTERVAL = void 0;
const time_1 = __webpack_require__(26438);
exports.HEARTBEAT_INTERVAL = time_1.FIVE_SECONDS;
exports.HEARTBEAT_EVENTS = {
    pulse: "heartbeat_pulse",
};
//# sourceMappingURL=heartbeat.js.map

/***/ }),

/***/ 68010:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(60427);
tslib_1.__exportStar(__webpack_require__(46267), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 13762:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HeartBeat = void 0;
const tslib_1 = __webpack_require__(60427);
const events_1 = __webpack_require__(82361);
const time_1 = __webpack_require__(26438);
const types_1 = __webpack_require__(55898);
const constants_1 = __webpack_require__(68010);
class HeartBeat extends types_1.IHeartBeat {
    constructor(opts) {
        super(opts);
        this.events = new events_1.EventEmitter();
        this.interval = constants_1.HEARTBEAT_INTERVAL;
        this.interval = (opts === null || opts === void 0 ? void 0 : opts.interval) || constants_1.HEARTBEAT_INTERVAL;
    }
    static init(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const heartbeat = new HeartBeat(opts);
            yield heartbeat.init();
            return heartbeat;
        });
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.initialize();
        });
    }
    stop() {
        clearInterval(this.intervalRef);
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.intervalRef = setInterval(() => this.pulse(), time_1.toMiliseconds(this.interval));
        });
    }
    pulse() {
        this.events.emit(constants_1.HEARTBEAT_EVENTS.pulse);
    }
}
exports.HeartBeat = HeartBeat;
//# sourceMappingURL=heartbeat.js.map

/***/ }),

/***/ 906:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(60427);
tslib_1.__exportStar(__webpack_require__(13762), exports);
tslib_1.__exportStar(__webpack_require__(55898), exports);
tslib_1.__exportStar(__webpack_require__(68010), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 24717:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IHeartBeat = void 0;
const events_1 = __webpack_require__(57035);
class IHeartBeat extends events_1.IEvents {
    constructor(opts) {
        super();
    }
}
exports.IHeartBeat = IHeartBeat;
//# sourceMappingURL=heartbeat.js.map

/***/ }),

/***/ 55898:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(60427);
tslib_1.__exportStar(__webpack_require__(24717), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 60427:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 37777:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(44084);
const ws_1 = tslib_1.__importDefault(__webpack_require__(96492));
tslib_1.__exportStar(__webpack_require__(96492), exports);
exports["default"] = ws_1.default;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 52083:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.truncateQuery = exports.isBrowser = exports.hasBuiltInWebSocket = exports.resolveWebSocketImplementation = void 0;
const resolveWebSocketImplementation = () => {
    if (typeof WebSocket !== "undefined") {
        return WebSocket;
    }
    else if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
        return global.WebSocket;
    }
    else if (typeof window !== "undefined" && typeof window.WebSocket !== "undefined") {
        return window.WebSocket;
    }
    else if (typeof self !== "undefined" && typeof self.WebSocket !== "undefined") {
        return self.WebSocket;
    }
    return __webpack_require__(64776);
};
exports.resolveWebSocketImplementation = resolveWebSocketImplementation;
const hasBuiltInWebSocket = () => typeof WebSocket !== "undefined" ||
    (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") ||
    (typeof window !== "undefined" && typeof window.WebSocket !== "undefined") ||
    (typeof self !== "undefined" && typeof self.WebSocket !== "undefined");
exports.hasBuiltInWebSocket = hasBuiltInWebSocket;
const isBrowser = () => typeof window !== "undefined";
exports.isBrowser = isBrowser;
const truncateQuery = (wssUrl) => wssUrl.split("?")[0];
exports.truncateQuery = truncateQuery;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 96492:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WsConnection = void 0;
const tslib_1 = __webpack_require__(44084);
const events_1 = __webpack_require__(82361);
const safe_json_1 = __webpack_require__(51738);
const jsonrpc_utils_1 = __webpack_require__(25815);
const utils_1 = __webpack_require__(52083);
const EVENT_EMITTER_MAX_LISTENERS_DEFAULT = 10;
const WS = (0, utils_1.resolveWebSocketImplementation)();
class WsConnection {
    constructor(url) {
        this.url = url;
        this.events = new events_1.EventEmitter();
        this.registering = false;
        if (!(0, jsonrpc_utils_1.isWsUrl)(url)) {
            throw new Error(`Provided URL is not compatible with WebSocket connection: ${url}`);
        }
        this.url = url;
    }
    get connected() {
        return typeof this.socket !== "undefined";
    }
    get connecting() {
        return this.registering;
    }
    on(event, listener) {
        this.events.on(event, listener);
    }
    once(event, listener) {
        this.events.once(event, listener);
    }
    off(event, listener) {
        this.events.off(event, listener);
    }
    removeListener(event, listener) {
        this.events.removeListener(event, listener);
    }
    open(url = this.url) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.register(url);
        });
    }
    close() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (typeof this.socket === "undefined") {
                    reject(new Error("Connection already closed"));
                    return;
                }
                this.socket.onclose = event => {
                    this.onClose(event);
                    resolve();
                };
                this.socket.close();
            });
        });
    }
    send(payload, context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof this.socket === "undefined") {
                this.socket = yield this.register();
            }
            try {
                this.socket.send((0, safe_json_1.safeJsonStringify)(payload));
            }
            catch (e) {
                this.onError(payload.id, e);
            }
        });
    }
    register(url = this.url) {
        if (!(0, jsonrpc_utils_1.isWsUrl)(url)) {
            throw new Error(`Provided URL is not compatible with WebSocket connection: ${url}`);
        }
        if (this.registering) {
            const currentMaxListeners = this.events.getMaxListeners();
            if (this.events.listenerCount("register_error") >= currentMaxListeners ||
                this.events.listenerCount("open") >= currentMaxListeners) {
                this.events.setMaxListeners(currentMaxListeners + 1);
            }
            return new Promise((resolve, reject) => {
                this.events.once("register_error", error => {
                    this.resetMaxListeners();
                    reject(error);
                });
                this.events.once("open", () => {
                    this.resetMaxListeners();
                    if (typeof this.socket === "undefined") {
                        return reject(new Error("WebSocket connection is missing or invalid"));
                    }
                    resolve(this.socket);
                });
            });
        }
        this.url = url;
        this.registering = true;
        return new Promise((resolve, reject) => {
            const opts = !(0, jsonrpc_utils_1.isReactNative)() ? { rejectUnauthorized: !(0, jsonrpc_utils_1.isLocalhostUrl)(url) } : undefined;
            const socket = new WS(url, [], opts);
            if ((0, utils_1.hasBuiltInWebSocket)()) {
                socket.onerror = (event) => {
                    const errorEvent = event;
                    reject(this.emitError(errorEvent.error));
                };
            }
            else {
                socket.on("error", (errorEvent) => {
                    reject(this.emitError(errorEvent));
                });
            }
            socket.onopen = () => {
                this.onOpen(socket);
                resolve(socket);
            };
        });
    }
    onOpen(socket) {
        socket.onmessage = (event) => this.onPayload(event);
        socket.onclose = event => this.onClose(event);
        this.socket = socket;
        this.registering = false;
        this.events.emit("open");
    }
    onClose(event) {
        this.socket = undefined;
        this.registering = false;
        this.events.emit("close", event);
    }
    onPayload(e) {
        if (typeof e.data === "undefined")
            return;
        const payload = typeof e.data === "string" ? (0, safe_json_1.safeJsonParse)(e.data) : e.data;
        this.events.emit("payload", payload);
    }
    onError(id, e) {
        const error = this.parseError(e);
        const message = error.message || error.toString();
        const payload = (0, jsonrpc_utils_1.formatJsonRpcError)(id, message);
        this.events.emit("payload", payload);
    }
    parseError(e, url = this.url) {
        return (0, jsonrpc_utils_1.parseConnectionError)(e, (0, utils_1.truncateQuery)(url), "WS");
    }
    resetMaxListeners() {
        if (this.events.getMaxListeners() > EVENT_EMITTER_MAX_LISTENERS_DEFAULT) {
            this.events.setMaxListeners(EVENT_EMITTER_MAX_LISTENERS_DEFAULT);
        }
    }
    emitError(errorEvent) {
        const error = this.parseError(new Error((errorEvent === null || errorEvent === void 0 ? void 0 : errorEvent.message) || `WebSocket connection failed for host: ${(0, utils_1.truncateQuery)(this.url)}`));
        this.events.emit("register_error", error);
        return error;
    }
}
exports.WsConnection = WsConnection;
exports["default"] = WsConnection;
//# sourceMappingURL=ws.js.map

/***/ }),

/***/ 44084:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 64776:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const WebSocket = __webpack_require__(88301);

WebSocket.createWebSocketStream = __webpack_require__(40044);
WebSocket.Server = __webpack_require__(79376);
WebSocket.Receiver = __webpack_require__(3705);
WebSocket.Sender = __webpack_require__(96427);

module.exports = WebSocket;


/***/ }),

/***/ 70968:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { EMPTY_BUFFER } = __webpack_require__(9011);

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
function concat(list, totalLength) {
  if (list.length === 0) return EMPTY_BUFFER;
  if (list.length === 1) return list[0];

  const target = Buffer.allocUnsafe(totalLength);
  let offset = 0;

  for (let i = 0; i < list.length; i++) {
    const buf = list[i];
    target.set(buf, offset);
    offset += buf.length;
  }

  if (offset < totalLength) return target.slice(0, offset);

  return target;
}

/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
function _mask(source, mask, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
}

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
function _unmask(buffer, mask) {
  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
  const length = buffer.length;
  for (let i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} buf The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 * @public
 */
function toArrayBuffer(buf) {
  if (buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

/**
 * Converts `data` to a `Buffer`.
 *
 * @param {*} data The data to convert
 * @return {Buffer} The buffer
 * @throws {TypeError}
 * @public
 */
function toBuffer(data) {
  toBuffer.readOnly = true;

  if (Buffer.isBuffer(data)) return data;

  let buf;

  if (data instanceof ArrayBuffer) {
    buf = Buffer.from(data);
  } else if (ArrayBuffer.isView(data)) {
    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  } else {
    buf = Buffer.from(data);
    toBuffer.readOnly = false;
  }

  return buf;
}

try {
  const bufferUtil = __webpack_require__(22123);
  const bu = bufferUtil.BufferUtil || bufferUtil;

  module.exports = {
    concat,
    mask(source, mask, output, offset, length) {
      if (length < 48) _mask(source, mask, output, offset, length);
      else bu.mask(source, mask, output, offset, length);
    },
    toArrayBuffer,
    toBuffer,
    unmask(buffer, mask) {
      if (buffer.length < 32) _unmask(buffer, mask);
      else bu.unmask(buffer, mask);
    }
  };
} catch (e) /* istanbul ignore next */ {
  module.exports = {
    concat,
    mask: _mask,
    toArrayBuffer,
    toBuffer,
    unmask: _unmask
  };
}


/***/ }),

/***/ 9011:
/***/ ((module) => {

"use strict";


module.exports = {
  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
  kStatusCode: Symbol('status-code'),
  kWebSocket: Symbol('websocket'),
  EMPTY_BUFFER: Buffer.alloc(0),
  NOOP: () => {}
};


/***/ }),

/***/ 77288:
/***/ ((module) => {

"use strict";


/**
 * Class representing an event.
 *
 * @private
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was
   *     dispatched
   */
  constructor(type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was
   *     dispatched
   */
  constructor(data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being
   *     closed
   * @param {String} reason A human-readable string explaining why the
   *     connection is closing
   * @param {WebSocket} target A reference to the target to which the event was
   *     dispatched
   */
  constructor(code, reason, target) {
    super('close', target);

    this.wasClean = target._closeFrameReceived && target._closeFrameSent;
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was
   *     dispatched
   */
  constructor(target) {
    super('open', target);
  }
}

/**
 * Class representing an error event.
 *
 * @extends Event
 * @private
 */
class ErrorEvent extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {Object} error The error that generated this event
   * @param {WebSocket} target A reference to the target to which the event was
   *     dispatched
   */
  constructor(error, target) {
    super('error', target);

    this.message = error.message;
    this.error = error;
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} type A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @param {Object} [options] An options object specifies characteristics about
   *     the event listener
   * @param {Boolean} [options.once=false] A `Boolean`` indicating that the
   *     listener should be invoked at most once after being added. If `true`,
   *     the listener would be automatically removed when invoked.
   * @public
   */
  addEventListener(type, listener, options) {
    if (typeof listener !== 'function') return;

    function onMessage(data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose(code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError(error) {
      listener.call(this, new ErrorEvent(error, this));
    }

    function onOpen() {
      listener.call(this, new OpenEvent(this));
    }

    const method = options && options.once ? 'once' : 'on';

    if (type === 'message') {
      onMessage._listener = listener;
      this[method](type, onMessage);
    } else if (type === 'close') {
      onClose._listener = listener;
      this[method](type, onClose);
    } else if (type === 'error') {
      onError._listener = listener;
      this[method](type, onError);
    } else if (type === 'open') {
      onOpen._listener = listener;
      this[method](type, onOpen);
    } else {
      this[method](type, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} type A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener(type, listener) {
    const listeners = this.listeners(type);

    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(type, listeners[i]);
      }
    }
  }
};

module.exports = EventTarget;


/***/ }),

/***/ 37460:
/***/ ((module) => {

"use strict";


//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
// prettier-ignore
const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push(dest, name, elem) {
  if (dest[name] === undefined) dest[name] = [elem];
  else dest[name].push(elem);
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse(header) {
  const offers = Object.create(null);

  if (header === undefined || header === '') return offers;

  let params = Object.create(null);
  let mustUnescape = false;
  let isEscaping = false;
  let inQuotes = false;
  let extensionName;
  let paramName;
  let start = -1;
  let end = -1;
  let i = 0;

  for (; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 /* ' ' */ || code === 0x09 /* '\t' */) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = Object.create(null);
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars[code] !== 1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22 /* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c /* '\' */) {
          isEscaping = true;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }

        if (end === -1) end = i;
        let value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = Object.create(null);
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new SyntaxError(`Unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes) {
    throw new SyntaxError('Unexpected end of input');
  }

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, params);
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Builds the `Sec-WebSocket-Extensions` header field value.
 *
 * @param {Object} extensions The map of extensions and parameters to format
 * @return {String} A string representing the given object
 * @public
 */
function format(extensions) {
  return Object.keys(extensions)
    .map((extension) => {
      let configurations = extensions[extension];
      if (!Array.isArray(configurations)) configurations = [configurations];
      return configurations
        .map((params) => {
          return [extension]
            .concat(
              Object.keys(params).map((k) => {
                let values = params[k];
                if (!Array.isArray(values)) values = [values];
                return values
                  .map((v) => (v === true ? k : `${k}=${v}`))
                  .join('; ');
              })
            )
            .join('; ');
        })
        .join(', ');
    })
    .join(', ');
}

module.exports = { format, parse };


/***/ }),

/***/ 51455:
/***/ ((module) => {

"use strict";


const kDone = Symbol('kDone');
const kRun = Symbol('kRun');

/**
 * A very simple job queue with adjustable concurrency. Adapted from
 * https://github.com/STRML/async-limiter
 */
class Limiter {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
   *     to run concurrently
   */
  constructor(concurrency) {
    this[kDone] = () => {
      this.pending--;
      this[kRun]();
    };
    this.concurrency = concurrency || Infinity;
    this.jobs = [];
    this.pending = 0;
  }

  /**
   * Adds a job to the queue.
   *
   * @param {Function} job The job to run
   * @public
   */
  add(job) {
    this.jobs.push(job);
    this[kRun]();
  }

  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [kRun]() {
    if (this.pending === this.concurrency) return;

    if (this.jobs.length) {
      const job = this.jobs.shift();

      this.pending++;
      job(this[kDone]);
    }
  }
}

module.exports = Limiter;


/***/ }),

/***/ 5076:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const zlib = __webpack_require__(59796);

const bufferUtil = __webpack_require__(70968);
const Limiter = __webpack_require__(51455);
const { kStatusCode, NOOP } = __webpack_require__(9011);

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const kPerMessageDeflate = Symbol('permessage-deflate');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} [options] Configuration options
   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
   *     disabling of server context takeover
   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
   *     acknowledge disabling of client context takeover
   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
   *     use of a custom server window size
   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
   *     for, or request, a custom client window size
   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
   *     deflate
   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
   *     inflate
   * @param {Number} [options.threshold=1024] Size (in bytes) below which
   *     messages should not be compressed
   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
   *     calls to zlib
   * @param {Boolean} [isServer=false] Create the instance in either server or
   *     client mode
   * @param {Number} [maxPayload=0] The maximum allowed message length
   */
  constructor(options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold =
      this._options.threshold !== undefined ? this._options.threshold : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency =
        this._options.concurrencyLimit !== undefined
          ? this._options.concurrencyLimit
          : 10;
      zlibLimiter = new Limiter(concurrency);
    }
  }

  /**
   * @type {String}
   */
  static get extensionName() {
    return 'permessage-deflate';
  }

  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(configurations) {
    configurations = this.normalizeParams(configurations);

    this.params = this._isServer
      ? this.acceptAsServer(configurations)
      : this.acceptAsClient(configurations);

    return this.params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate) {
      this._inflate.close();
      this._inflate = null;
    }

    if (this._deflate) {
      const callback = this._deflate[kCallback];

      this._deflate.close();
      this._deflate = null;

      if (callback) {
        callback(
          new Error(
            'The deflate stream was closed while data was being processed'
          )
        );
      }
    }
  }

  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(offers) {
    const opts = this._options;
    const accepted = offers.find((params) => {
      if (
        (opts.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (params.server_max_window_bits &&
          (opts.serverMaxWindowBits === false ||
            (typeof opts.serverMaxWindowBits === 'number' &&
              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
        (typeof opts.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return false;
      }

      return true;
    });

    if (!accepted) {
      throw new Error('None of the extension offers can be accepted');
    }

    if (opts.serverNoContextTakeover) {
      accepted.server_no_context_takeover = true;
    }
    if (opts.clientNoContextTakeover) {
      accepted.client_no_context_takeover = true;
    }
    if (typeof opts.serverMaxWindowBits === 'number') {
      accepted.server_max_window_bits = opts.serverMaxWindowBits;
    }
    if (typeof opts.clientMaxWindowBits === 'number') {
      accepted.client_max_window_bits = opts.clientMaxWindowBits;
    } else if (
      accepted.client_max_window_bits === true ||
      opts.clientMaxWindowBits === false
    ) {
      delete accepted.client_max_window_bits;
    }

    return accepted;
  }

  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(response) {
    const params = response[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    }

    if (!params.client_max_window_bits) {
      if (typeof this._options.clientMaxWindowBits === 'number') {
        params.client_max_window_bits = this._options.clientMaxWindowBits;
      }
    } else if (
      this._options.clientMaxWindowBits === false ||
      (typeof this._options.clientMaxWindowBits === 'number' &&
        params.client_max_window_bits > this._options.clientMaxWindowBits)
    ) {
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    }

    return params;
  }

  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(configurations) {
    configurations.forEach((params) => {
      Object.keys(params).forEach((key) => {
        let value = params[key];

        if (value.length > 1) {
          throw new Error(`Parameter "${key}" must have only a single value`);
        }

        value = value[0];

        if (key === 'client_max_window_bits') {
          if (value !== true) {
            const num = +value;
            if (!Number.isInteger(num) || num < 8 || num > 15) {
              throw new TypeError(
                `Invalid value for parameter "${key}": ${value}`
              );
            }
            value = num;
          } else if (!this._isServer) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else if (key === 'server_max_window_bits') {
          const num = +value;
          if (!Number.isInteger(num) || num < 8 || num > 15) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
          value = num;
        } else if (
          key === 'client_no_context_takeover' ||
          key === 'server_no_context_takeover'
        ) {
          if (value !== true) {
            throw new TypeError(
              `Invalid value for parameter "${key}": ${value}`
            );
          }
        } else {
          throw new Error(`Unknown parameter "${key}"`);
        }

        params[key] = value;
      });
    });

    return configurations;
  }

  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(data, fin, callback) {
    zlibLimiter.add((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._inflate = zlib.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits
      });
      this._inflate[kPerMessageDeflate] = this;
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (this._inflate._readableState.endEmitted) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];

        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
          this._inflate.reset();
        }
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(data, fin, callback) {
    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits =
        typeof this.params[key] !== 'number'
          ? zlib.Z_DEFAULT_WINDOWBITS
          : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      //
      // An `'error'` event is emitted, only on Node.js < 10.0.0, if the
      // `zlib.DeflateRaw` instance is closed while data is being processed.
      // This can happen if `PerMessageDeflate#cleanup()` is called at the wrong
      // time due to an abnormal WebSocket closure.
      //
      this._deflate.on('error', NOOP);
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kCallback] = callback;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      if (!this._deflate) {
        //
        // The deflate stream was closed while data was being processed.
        //
        return;
      }

      let data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      //
      // Ensure that the callback will not be called again in
      // `PerMessageDeflate#cleanup()`.
      //
      this._deflate[kCallback] = null;

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
        this._deflate.reset();
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData(chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData(chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kPerMessageDeflate]._maxPayload < 1 ||
    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new RangeError('Max payload size exceeded');
  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
  this[kError][kStatusCode] = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError(err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kPerMessageDeflate]._inflate = null;
  err[kStatusCode] = 1007;
  this[kCallback](err);
}


/***/ }),

/***/ 3705:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { Writable } = __webpack_require__(12781);

const PerMessageDeflate = __webpack_require__(5076);
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  kStatusCode,
  kWebSocket
} = __webpack_require__(9011);
const { concat, toArrayBuffer, unmask } = __webpack_require__(70968);
const { isValidStatusCode, isValidUTF8 } = __webpack_require__(96060);

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 *
 * @extends Writable
 */
class Receiver extends Writable {
  /**
   * Creates a Receiver instance.
   *
   * @param {String} [binaryType=nodebuffer] The type for binary data
   * @param {Object} [extensions] An object containing the negotiated extensions
   * @param {Boolean} [isServer=false] Specifies whether to operate in client or
   *     server mode
   * @param {Number} [maxPayload=0] The maximum allowed message length
   */
  constructor(binaryType, extensions, isServer, maxPayload) {
    super();

    this._binaryType = binaryType || BINARY_TYPES[0];
    this[kWebSocket] = undefined;
    this._extensions = extensions || {};
    this._isServer = !!isServer;
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._mask = undefined;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._state = GET_INFO;
    this._loop = false;
  }

  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   * @private
   */
  _write(chunk, encoding, cb) {
    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

    this._bufferedBytes += chunk.length;
    this._buffers.push(chunk);
    this.startLoop(cb);
  }

  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(n) {
    this._bufferedBytes -= n;

    if (n === this._buffers[0].length) return this._buffers.shift();

    if (n < this._buffers[0].length) {
      const buf = this._buffers[0];
      this._buffers[0] = buf.slice(n);
      return buf.slice(0, n);
    }

    const dst = Buffer.allocUnsafe(n);

    do {
      const buf = this._buffers[0];
      const offset = dst.length - n;

      if (n >= buf.length) {
        dst.set(this._buffers.shift(), offset);
      } else {
        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
        this._buffers[0] = buf.slice(n);
      }

      n -= buf.length;
    } while (n > 0);

    return dst;
  }

  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(cb) {
    let err;
    this._loop = true;

    do {
      switch (this._state) {
        case GET_INFO:
          err = this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          err = this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          err = this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          err = this.getData(cb);
          break;
        default:
          // `INFLATING`
          this._loop = false;
          return;
      }
    } while (this._loop);

    cb(err);
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getInfo() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    const buf = this.consume(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this._loop = false;
      return error(
        RangeError,
        'RSV2 and RSV3 must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_RSV_2_3'
      );
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      this._loop = false;
      return error(
        RangeError,
        'RSV1 must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_RSV_1'
      );
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this._loop = false;
        return error(
          RangeError,
          'RSV1 must be clear',
          true,
          1002,
          'WS_ERR_UNEXPECTED_RSV_1'
        );
      }

      if (!this._fragmented) {
        this._loop = false;
        return error(
          RangeError,
          'invalid opcode 0',
          true,
          1002,
          'WS_ERR_INVALID_OPCODE'
        );
      }

      this._opcode = this._fragmented;
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this._loop = false;
        return error(
          RangeError,
          `invalid opcode ${this._opcode}`,
          true,
          1002,
          'WS_ERR_INVALID_OPCODE'
        );
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this._loop = false;
        return error(
          RangeError,
          'FIN must be set',
          true,
          1002,
          'WS_ERR_EXPECTED_FIN'
        );
      }

      if (compressed) {
        this._loop = false;
        return error(
          RangeError,
          'RSV1 must be clear',
          true,
          1002,
          'WS_ERR_UNEXPECTED_RSV_1'
        );
      }

      if (this._payloadLength > 0x7d) {
        this._loop = false;
        return error(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          true,
          1002,
          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
        );
      }
    } else {
      this._loop = false;
      return error(
        RangeError,
        `invalid opcode ${this._opcode}`,
        true,
        1002,
        'WS_ERR_INVALID_OPCODE'
      );
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._isServer) {
      if (!this._masked) {
        this._loop = false;
        return error(
          RangeError,
          'MASK must be set',
          true,
          1002,
          'WS_ERR_EXPECTED_MASK'
        );
      }
    } else if (this._masked) {
      this._loop = false;
      return error(
        RangeError,
        'MASK must be clear',
        true,
        1002,
        'WS_ERR_UNEXPECTED_MASK'
      );
    }

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else return this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength16() {
    if (this._bufferedBytes < 2) {
      this._loop = false;
      return;
    }

    this._payloadLength = this.consume(2).readUInt16BE(0);
    return this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  getPayloadLength64() {
    if (this._bufferedBytes < 8) {
      this._loop = false;
      return;
    }

    const buf = this.consume(8);
    const num = buf.readUInt32BE(0);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this._loop = false;
      return error(
        RangeError,
        'Unsupported WebSocket frame: payload length > 2^53 - 1',
        false,
        1009,
        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
      );
    }

    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
    return this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @return {(RangeError|undefined)} A possible error
   * @private
   */
  haveLength() {
    if (this._payloadLength && this._opcode < 0x08) {
      this._totalPayloadLength += this._payloadLength;
      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
        this._loop = false;
        return error(
          RangeError,
          'Max payload size exceeded',
          false,
          1009,
          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
        );
      }
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = false;
      return;
    }

    this._mask = this.consume(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  getData(cb) {
    let data = EMPTY_BUFFER;

    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = false;
        return;
      }

      data = this.consume(this._payloadLength);
      if (this._masked) unmask(data, this._mask);
    }

    if (this._opcode > 0x07) return this.controlMessage(data);

    if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data, cb);
      return;
    }

    if (data.length) {
      //
      // This message is not compressed so its lenght is the sum of the payload
      // length of all fragments.
      //
      this._messageLength = this._totalPayloadLength;
      this._fragments.push(data);
    }

    return this.dataMessage();
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(data, cb) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) return cb(err);

      if (buf.length) {
        this._messageLength += buf.length;
        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
          return cb(
            error(
              RangeError,
              'Max payload size exceeded',
              false,
              1009,
              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
            )
          );
        }

        this._fragments.push(buf);
      }

      const er = this.dataMessage();
      if (er) return cb(er);

      this.startLoop(cb);
    });
  }

  /**
   * Handles a data message.
   *
   * @return {(Error|undefined)} A possible error
   * @private
   */
  dataMessage() {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        let data;

        if (this._binaryType === 'nodebuffer') {
          data = concat(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(concat(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.emit('message', data);
      } else {
        const buf = concat(fragments, messageLength);

        if (!isValidUTF8(buf)) {
          this._loop = false;
          return error(
            Error,
            'invalid UTF-8 sequence',
            true,
            1007,
            'WS_ERR_INVALID_UTF8'
          );
        }

        this.emit('message', buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(data) {
    if (this._opcode === 0x08) {
      this._loop = false;

      if (data.length === 0) {
        this.emit('conclude', 1005, '');
        this.end();
      } else if (data.length === 1) {
        return error(
          RangeError,
          'invalid payload length 1',
          true,
          1002,
          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
        );
      } else {
        const code = data.readUInt16BE(0);

        if (!isValidStatusCode(code)) {
          return error(
            RangeError,
            `invalid status code ${code}`,
            true,
            1002,
            'WS_ERR_INVALID_CLOSE_CODE'
          );
        }

        const buf = data.slice(2);

        if (!isValidUTF8(buf)) {
          return error(
            Error,
            'invalid UTF-8 sequence',
            true,
            1007,
            'WS_ERR_INVALID_UTF8'
          );
        }

        this.emit('conclude', code, buf.toString());
        this.end();
      }
    } else if (this._opcode === 0x09) {
      this.emit('ping', data);
    } else {
      this.emit('pong', data);
    }

    this._state = GET_INFO;
  }
}

module.exports = Receiver;

/**
 * Builds an error object.
 *
 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
 * @param {String} message The error message
 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
 *     `message`
 * @param {Number} statusCode The status code
 * @param {String} errorCode The exposed error code
 * @return {(Error|RangeError)} The error
 * @private
 */
function error(ErrorCtor, message, prefix, statusCode, errorCode) {
  const err = new ErrorCtor(
    prefix ? `Invalid WebSocket frame: ${message}` : message
  );

  Error.captureStackTrace(err, error);
  err.code = errorCode;
  err[kStatusCode] = statusCode;
  return err;
}


/***/ }),

/***/ 96427:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls$" }] */



const net = __webpack_require__(41808);
const tls = __webpack_require__(24404);
const { randomFillSync } = __webpack_require__(6113);

const PerMessageDeflate = __webpack_require__(5076);
const { EMPTY_BUFFER } = __webpack_require__(9011);
const { isValidStatusCode } = __webpack_require__(96060);
const { mask: applyMask, toBuffer } = __webpack_require__(70968);

const mask = Buffer.alloc(4);

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {(net.Socket|tls.Socket)} socket The connection socket
   * @param {Object} [extensions] An object containing the negotiated extensions
   */
  constructor(socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame(data, options) {
    const merge = options.mask && options.readOnly;
    let offset = options.mask ? 6 : 2;
    let payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    target[1] = payloadLength;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2);
      target.writeUInt32BE(data.length, 6);
    }

    if (!options.mask) return [target, data];

    randomFillSync(mask, 0, 4);

    target[1] |= 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      applyMask(data, mask, target, offset, data.length);
      return [target];
    }

    applyMask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {Number} [code] The status code component of the body
   * @param {String} [data] The message component of the body
   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
   * @param {Function} [cb] Callback
   * @public
   */
  close(code, data, mask, cb) {
    let buf;

    if (code === undefined) {
      buf = EMPTY_BUFFER;
    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
      throw new TypeError('First argument must be a valid error code number');
    } else if (data === undefined || data === '') {
      buf = Buffer.allocUnsafe(2);
      buf.writeUInt16BE(code, 0);
    } else {
      const length = Buffer.byteLength(data);

      if (length > 123) {
        throw new RangeError('The message must not be greater than 123 bytes');
      }

      buf = Buffer.allocUnsafe(2 + length);
      buf.writeUInt16BE(code, 0);
      buf.write(data, 2);
    }

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @private
   */
  doClose(data, mask, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x08,
        mask,
        readOnly: false
      }),
      cb
    );
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  ping(data, mask, cb) {
    const buf = toBuffer(data);

    if (buf.length > 125) {
      throw new RangeError('The data size must not be greater than 125 bytes');
    }

    if (this._deflating) {
      this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
    } else {
      this.doPing(buf, mask, toBuffer.readOnly, cb);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
   * @param {Function} [cb] Callback
   * @private
   */
  doPing(data, mask, readOnly, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x09,
        mask,
        readOnly
      }),
      cb
    );
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  pong(data, mask, cb) {
    const buf = toBuffer(data);

    if (buf.length > 125) {
      throw new RangeError('The data size must not be greater than 125 bytes');
    }

    if (this._deflating) {
      this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
    } else {
      this.doPong(buf, mask, toBuffer.readOnly, cb);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
   * @param {Function} [cb] Callback
   * @private
   */
  doPong(data, mask, readOnly, cb) {
    this.sendFrame(
      Sender.frame(data, {
        fin: true,
        rsv1: false,
        opcode: 0x0a,
        mask,
        readOnly
      }),
      cb
    );
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} [options.compress=false] Specifies whether or not to
   *     compress `data`
   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
   *     or text
   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Function} [cb] Callback
   * @public
   */
  send(data, options, cb) {
    const buf = toBuffer(data);
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
    let opcode = options.binary ? 2 : 1;
    let rsv1 = options.compress;

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = buf.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly: toBuffer.readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
      } else {
        this.dispatch(buf, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(
        Sender.frame(buf, {
          fin: options.fin,
          rsv1: false,
          opcode,
          mask: options.mask,
          readOnly: toBuffer.readOnly
        }),
        cb
      );
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  dispatch(data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._bufferedBytes += data.length;
    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      if (this._socket.destroyed) {
        const err = new Error(
          'The socket was closed while data was being compressed'
        );

        if (typeof cb === 'function') cb(err);

        for (let i = 0; i < this._queue.length; i++) {
          const callback = this._queue[i][4];

          if (typeof callback === 'function') callback(err);
        }

        return;
      }

      this._bufferedBytes -= data.length;
      this._deflating = false;
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      Reflect.apply(params[0], this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} [cb] Callback
   * @private
   */
  sendFrame(list, cb) {
    if (list.length === 2) {
      this._socket.cork();
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
      this._socket.uncork();
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;


/***/ }),

/***/ 40044:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { Duplex } = __webpack_require__(12781);

/**
 * Emits the `'close'` event on a stream.
 *
 * @param {Duplex} stream The stream.
 * @private
 */
function emitClose(stream) {
  stream.emit('close');
}

/**
 * The listener of the `'end'` event.
 *
 * @private
 */
function duplexOnEnd() {
  if (!this.destroyed && this._writableState.finished) {
    this.destroy();
  }
}

/**
 * The listener of the `'error'` event.
 *
 * @param {Error} err The error
 * @private
 */
function duplexOnError(err) {
  this.removeListener('error', duplexOnError);
  this.destroy();
  if (this.listenerCount('error') === 0) {
    // Do not suppress the throwing behavior.
    this.emit('error', err);
  }
}

/**
 * Wraps a `WebSocket` in a duplex stream.
 *
 * @param {WebSocket} ws The `WebSocket` to wrap
 * @param {Object} [options] The options for the `Duplex` constructor
 * @return {Duplex} The duplex stream
 * @public
 */
function createWebSocketStream(ws, options) {
  let resumeOnReceiverDrain = true;
  let terminateOnDestroy = true;

  function receiverOnDrain() {
    if (resumeOnReceiverDrain) ws._socket.resume();
  }

  if (ws.readyState === ws.CONNECTING) {
    ws.once('open', function open() {
      ws._receiver.removeAllListeners('drain');
      ws._receiver.on('drain', receiverOnDrain);
    });
  } else {
    ws._receiver.removeAllListeners('drain');
    ws._receiver.on('drain', receiverOnDrain);
  }

  const duplex = new Duplex({
    ...options,
    autoDestroy: false,
    emitClose: false,
    objectMode: false,
    writableObjectMode: false
  });

  ws.on('message', function message(msg) {
    if (!duplex.push(msg)) {
      resumeOnReceiverDrain = false;
      ws._socket.pause();
    }
  });

  ws.once('error', function error(err) {
    if (duplex.destroyed) return;

    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
    //
    // - If the `'error'` event is emitted before the `'open'` event, then
    //   `ws.terminate()` is a noop as no socket is assigned.
    // - Otherwise, the error is re-emitted by the listener of the `'error'`
    //   event of the `Receiver` object. The listener already closes the
    //   connection by calling `ws.close()`. This allows a close frame to be
    //   sent to the other peer. If `ws.terminate()` is called right after this,
    //   then the close frame might not be sent.
    terminateOnDestroy = false;
    duplex.destroy(err);
  });

  ws.once('close', function close() {
    if (duplex.destroyed) return;

    duplex.push(null);
  });

  duplex._destroy = function (err, callback) {
    if (ws.readyState === ws.CLOSED) {
      callback(err);
      process.nextTick(emitClose, duplex);
      return;
    }

    let called = false;

    ws.once('error', function error(err) {
      called = true;
      callback(err);
    });

    ws.once('close', function close() {
      if (!called) callback(err);
      process.nextTick(emitClose, duplex);
    });

    if (terminateOnDestroy) ws.terminate();
  };

  duplex._final = function (callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._final(callback);
      });
      return;
    }

    // If the value of the `_socket` property is `null` it means that `ws` is a
    // client websocket and the handshake failed. In fact, when this happens, a
    // socket is never assigned to the websocket. Wait for the `'error'` event
    // that will be emitted by the websocket.
    if (ws._socket === null) return;

    if (ws._socket._writableState.finished) {
      callback();
      if (duplex._readableState.endEmitted) duplex.destroy();
    } else {
      ws._socket.once('finish', function finish() {
        // `duplex` is not destroyed here because the `'end'` event will be
        // emitted on `duplex` after this `'finish'` event. The EOF signaling
        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
        callback();
      });
      ws.close();
    }
  };

  duplex._read = function () {
    if (
      (ws.readyState === ws.OPEN || ws.readyState === ws.CLOSING) &&
      !resumeOnReceiverDrain
    ) {
      resumeOnReceiverDrain = true;
      if (!ws._receiver._writableState.needDrain) ws._socket.resume();
    }
  };

  duplex._write = function (chunk, encoding, callback) {
    if (ws.readyState === ws.CONNECTING) {
      ws.once('open', function open() {
        duplex._write(chunk, encoding, callback);
      });
      return;
    }

    ws.send(chunk, callback);
  };

  duplex.on('end', duplexOnEnd);
  duplex.on('error', duplexOnError);
  return duplex;
}

module.exports = createWebSocketStream;


/***/ }),

/***/ 96060:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Checks if a status code is allowed in a close frame.
 *
 * @param {Number} code The status code
 * @return {Boolean} `true` if the status code is valid, else `false`
 * @public
 */
function isValidStatusCode(code) {
  return (
    (code >= 1000 &&
      code <= 1014 &&
      code !== 1004 &&
      code !== 1005 &&
      code !== 1006) ||
    (code >= 3000 && code <= 4999)
  );
}

/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
function _isValidUTF8(buf) {
  const len = buf.length;
  let i = 0;

  while (i < len) {
    if ((buf[i] & 0x80) === 0) {
      // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {
      // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0 // Overlong
      ) {
        return false;
      }

      i += 2;
    } else if ((buf[i] & 0xf0) === 0xe0) {
      // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      }

      i += 3;
    } else if ((buf[i] & 0xf8) === 0xf0) {
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
        buf[i] > 0xf4 // > U+10FFFF
      ) {
        return false;
      }

      i += 4;
    } else {
      return false;
    }
  }

  return true;
}

try {
  let isValidUTF8 = __webpack_require__(19297);

  /* istanbul ignore if */
  if (typeof isValidUTF8 === 'object') {
    isValidUTF8 = isValidUTF8.Validation.isValidUTF8; // utf-8-validate@<3.0.0
  }

  module.exports = {
    isValidStatusCode,
    isValidUTF8(buf) {
      return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
    }
  };
} catch (e) /* istanbul ignore next */ {
  module.exports = {
    isValidStatusCode,
    isValidUTF8: _isValidUTF8
  };
}


/***/ }),

/***/ 79376:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls|https$" }] */



const EventEmitter = __webpack_require__(82361);
const http = __webpack_require__(13685);
const https = __webpack_require__(95687);
const net = __webpack_require__(41808);
const tls = __webpack_require__(24404);
const { createHash } = __webpack_require__(6113);

const PerMessageDeflate = __webpack_require__(5076);
const WebSocket = __webpack_require__(88301);
const { format, parse } = __webpack_require__(37460);
const { GUID, kWebSocket } = __webpack_require__(9011);

const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

const RUNNING = 0;
const CLOSING = 1;
const CLOSED = 2;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {Number} [options.backlog=511] The maximum length of the queue of
   *     pending connections
   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
   *     track clients
   * @param {Function} [options.handleProtocols] A hook to handle protocols
   * @param {String} [options.host] The hostname where to bind the server
   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
   *     size
   * @param {Boolean} [options.noServer=false] Enable no server mode
   * @param {String} [options.path] Accept only connections matching this path
   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
   *     permessage-deflate
   * @param {Number} [options.port] The port where to bind the server
   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
   *     server to use
   * @param {Function} [options.verifyClient] A hook to reject connections
   * @param {Function} [callback] A listener for the `listening` event
   */
  constructor(options, callback) {
    super();

    options = {
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null,
      ...options
    };

    if (
      (options.port == null && !options.server && !options.noServer) ||
      (options.port != null && (options.server || options.noServer)) ||
      (options.server && options.noServer)
    ) {
      throw new TypeError(
        'One and only one of the "port", "server", or "noServer" options ' +
          'must be specified'
      );
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      const emitConnection = this.emit.bind(this, 'connection');

      this._removeListeners = addListeners(this._server, {
        listening: this.emit.bind(this, 'listening'),
        error: this.emit.bind(this, 'error'),
        upgrade: (req, socket, head) => {
          this.handleUpgrade(req, socket, head, emitConnection);
        }
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) this.clients = new Set();
    this.options = options;
    this._state = RUNNING;
  }

  /**
   * Returns the bound address, the address family name, and port of the server
   * as reported by the operating system if listening on an IP socket.
   * If the server is listening on a pipe or UNIX domain socket, the name is
   * returned as a string.
   *
   * @return {(Object|String|null)} The address of the server
   * @public
   */
  address() {
    if (this.options.noServer) {
      throw new Error('The server is operating in "noServer" mode');
    }

    if (!this._server) return null;
    return this._server.address();
  }

  /**
   * Close the server.
   *
   * @param {Function} [cb] Callback
   * @public
   */
  close(cb) {
    if (cb) this.once('close', cb);

    if (this._state === CLOSED) {
      process.nextTick(emitClose, this);
      return;
    }

    if (this._state === CLOSING) return;
    this._state = CLOSING;

    //
    // Terminate all associated clients.
    //
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._removeListeners();
      this._removeListeners = this._server = null;

      //
      // Close the http server if it was internally created.
      //
      if (this.options.port != null) {
        server.close(emitClose.bind(undefined, this));
        return;
      }
    }

    process.nextTick(emitClose, this);
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle(req) {
    if (this.options.path) {
      const index = req.url.indexOf('?');
      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

      if (pathname !== this.options.path) return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade(req, socket, head, cb) {
    socket.on('error', socketOnError);

    const key =
      req.headers['sec-websocket-key'] !== undefined
        ? req.headers['sec-websocket-key'].trim()
        : false;
    const version = +req.headers['sec-websocket-version'];
    const extensions = {};

    if (
      req.method !== 'GET' ||
      req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !key ||
      !keyRegex.test(key) ||
      (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortHandshake(socket, 400);
    }

    if (this.options.perMessageDeflate) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = parse(req.headers['sec-websocket-extensions']);

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        return abortHandshake(socket, 400);
      }
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin:
          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.socket.authorized || req.socket.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message, headers) => {
          if (!verified) {
            return abortHandshake(socket, code || 401, message, headers);
          }

          this.completeUpgrade(key, extensions, req, socket, head, cb);
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
    }

    this.completeUpgrade(key, extensions, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} key The value of the `Sec-WebSocket-Key` header
   * @param {Object} extensions The accepted extensions
   * @param {http.IncomingMessage} req The request object
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @throws {Error} If called more than once with the same socket
   * @private
   */
  completeUpgrade(key, extensions, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    if (socket[kWebSocket]) {
      throw new Error(
        'server.handleUpgrade() was called more than once with the same ' +
          'socket, possibly due to a misconfiguration'
      );
    }

    if (this._state > RUNNING) return abortHandshake(socket, 503);

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${digest}`
    ];

    const ws = new WebSocket(null);
    let protocol = req.headers['sec-websocket-protocol'];

    if (protocol) {
      protocol = protocol.split(',').map(trim);

      //
      // Optionally call external protocol selection handler.
      //
      if (this.options.handleProtocols) {
        protocol = this.options.handleProtocols(protocol, req);
      } else {
        protocol = protocol[0];
      }

      if (protocol) {
        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
        ws._protocol = protocol;
      }
    }

    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
      ws._extensions = extensions;
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));
    socket.removeListener('error', socketOnError);

    ws.setSocket(socket, head, this.options.maxPayload);

    if (this.clients) {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    }

    cb(ws, req);
  }
}

module.exports = WebSocketServer;

/**
 * Add event listeners on an `EventEmitter` using a map of <event, listener>
 * pairs.
 *
 * @param {EventEmitter} server The event emitter
 * @param {Object.<String, Function>} map The listeners to add
 * @return {Function} A function that will remove the added listeners when
 *     called
 * @private
 */
function addListeners(server, map) {
  for (const event of Object.keys(map)) server.on(event, map[event]);

  return function removeListeners() {
    for (const event of Object.keys(map)) {
      server.removeListener(event, map[event]);
    }
  };
}

/**
 * Emit a `'close'` event on an `EventEmitter`.
 *
 * @param {EventEmitter} server The event emitter
 * @private
 */
function emitClose(server) {
  server._state = CLOSED;
  server.emit('close');
}

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketOnError() {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @param {Object} [headers] Additional HTTP response headers
 * @private
 */
function abortHandshake(socket, code, message, headers) {
  if (socket.writable) {
    message = message || http.STATUS_CODES[code];
    headers = {
      Connection: 'close',
      'Content-Type': 'text/html',
      'Content-Length': Buffer.byteLength(message),
      ...headers
    };

    socket.write(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
        Object.keys(headers)
          .map((h) => `${h}: ${headers[h]}`)
          .join('\r\n') +
        '\r\n\r\n' +
        message
    );
  }

  socket.removeListener('error', socketOnError);
  socket.destroy();
}

/**
 * Remove whitespace characters from both ends of a string.
 *
 * @param {String} str The string
 * @return {String} A new string representing `str` stripped of whitespace
 *     characters from both its beginning and end
 * @private
 */
function trim(str) {
  return str.trim();
}


/***/ }),

/***/ 88301:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Readable$" }] */



const EventEmitter = __webpack_require__(82361);
const https = __webpack_require__(95687);
const http = __webpack_require__(13685);
const net = __webpack_require__(41808);
const tls = __webpack_require__(24404);
const { randomBytes, createHash } = __webpack_require__(6113);
const { Readable } = __webpack_require__(12781);
const { URL } = __webpack_require__(57310);

const PerMessageDeflate = __webpack_require__(5076);
const Receiver = __webpack_require__(3705);
const Sender = __webpack_require__(96427);
const {
  BINARY_TYPES,
  EMPTY_BUFFER,
  GUID,
  kStatusCode,
  kWebSocket,
  NOOP
} = __webpack_require__(9011);
const { addEventListener, removeEventListener } = __webpack_require__(77288);
const { format, parse } = __webpack_require__(37460);
const { toBuffer } = __webpack_require__(70968);

const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000;

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|URL)} address The URL to which to connect
   * @param {(String|String[])} [protocols] The subprotocols
   * @param {Object} [options] Connection options
   */
  constructor(address, protocols, options) {
    super();

    this._binaryType = BINARY_TYPES[0];
    this._closeCode = 1006;
    this._closeFrameReceived = false;
    this._closeFrameSent = false;
    this._closeMessage = '';
    this._closeTimer = null;
    this._extensions = {};
    this._protocol = '';
    this._readyState = WebSocket.CONNECTING;
    this._receiver = null;
    this._sender = null;
    this._socket = null;

    if (address !== null) {
      this._bufferedAmount = 0;
      this._isServer = false;
      this._redirects = 0;

      if (Array.isArray(protocols)) {
        protocols = protocols.join(', ');
      } else if (typeof protocols === 'object' && protocols !== null) {
        options = protocols;
        protocols = undefined;
      }

      initAsClient(this, address, protocols, options);
    } else {
      this._isServer = true;
    }
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the
   * required default "blob" type (instead we define a custom "nodebuffer"
   * type).
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }

  set binaryType(type) {
    if (!BINARY_TYPES.includes(type)) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * @type {Number}
   */
  get bufferedAmount() {
    if (!this._socket) return this._bufferedAmount;

    return this._socket._writableState.length + this._sender._bufferedBytes;
  }

  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onclose() {
    return undefined;
  }

  /* istanbul ignore next */
  set onclose(listener) {}

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onerror() {
    return undefined;
  }

  /* istanbul ignore next */
  set onerror(listener) {}

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onopen() {
    return undefined;
  }

  /* istanbul ignore next */
  set onopen(listener) {}

  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onmessage() {
    return undefined;
  }

  /* istanbul ignore next */
  set onmessage(listener) {}

  /**
   * @type {String}
   */
  get protocol() {
    return this._protocol;
  }

  /**
   * @type {Number}
   */
  get readyState() {
    return this._readyState;
  }

  /**
   * @type {String}
   */
  get url() {
    return this._url;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {(net.Socket|tls.Socket)} socket The network socket between the
   *     server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Number} [maxPayload=0] The maximum allowed message size
   * @private
   */
  setSocket(socket, head, maxPayload) {
    const receiver = new Receiver(
      this.binaryType,
      this._extensions,
      this._isServer,
      maxPayload
    );

    this._sender = new Sender(socket, this._extensions);
    this._receiver = receiver;
    this._socket = socket;

    receiver[kWebSocket] = this;
    socket[kWebSocket] = this;

    receiver.on('conclude', receiverOnConclude);
    receiver.on('drain', receiverOnDrain);
    receiver.on('error', receiverOnError);
    receiver.on('message', receiverOnMessage);
    receiver.on('ping', receiverOnPing);
    receiver.on('pong', receiverOnPong);

    socket.setTimeout(0);
    socket.setNoDelay();

    if (head.length > 0) socket.unshift(head);

    socket.on('close', socketOnClose);
    socket.on('data', socketOnData);
    socket.on('end', socketOnEnd);
    socket.on('error', socketOnError);

    this._readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    if (!this._socket) {
      this._readyState = WebSocket.CLOSED;
      this.emit('close', this._closeCode, this._closeMessage);
      return;
    }

    if (this._extensions[PerMessageDeflate.extensionName]) {
      this._extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this._receiver.removeAllListeners();
    this._readyState = WebSocket.CLOSED;
    this.emit('close', this._closeCode, this._closeMessage);
  }

  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} [code] Status code explaining why the connection is closing
   * @param {String} [data] A string explaining why the connection is closing
   * @public
   */
  close(code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake(this, this._req, msg);
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (
        this._closeFrameSent &&
        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
      ) {
        this._socket.end();
      }

      return;
    }

    this._readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      //
      // This error is handled by the `'error'` listener on the socket. We only
      // want to know if the close frame has been sent here.
      //
      if (err) return;

      this._closeFrameSent = true;

      if (
        this._closeFrameReceived ||
        this._receiver._writableState.errorEmitted
      ) {
        this._socket.end();
      }
    });

    //
    // Specify a timeout for the closing handshake to complete.
    //
    this._closeTimer = setTimeout(
      this._socket.destroy.bind(this._socket),
      closeTimeout
    );
  }

  /**
   * Send a ping.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the ping is sent
   * @public
   */
  ping(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a pong.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the pong is sent
   * @public
   */
  pong(data, mask, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof data === 'function') {
      cb = data;
      data = mask = undefined;
    } else if (typeof mask === 'function') {
      cb = mask;
      mask = undefined;
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} [options] Options object
   * @param {Boolean} [options.compress] Specifies whether or not to compress
   *     `data`
   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
   *     text
   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when data is written out
   * @public
   */
  send(data, options, cb) {
    if (this.readyState === WebSocket.CONNECTING) {
      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
    }

    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (typeof data === 'number') data = data.toString();

    if (this.readyState !== WebSocket.OPEN) {
      sendAfterClose(this, data, cb);
      return;
    }

    const opts = {
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true,
      ...options
    };

    if (!this._extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      const msg = 'WebSocket was closed before the connection was established';
      return abortHandshake(this, this._req, msg);
    }

    if (this._socket) {
      this._readyState = WebSocket.CLOSING;
      this._socket.destroy();
    }
  }
}

/**
 * @constant {Number} CONNECTING
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'CONNECTING', {
  enumerable: true,
  value: readyStates.indexOf('CONNECTING')
});

/**
 * @constant {Number} CONNECTING
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
  enumerable: true,
  value: readyStates.indexOf('CONNECTING')
});

/**
 * @constant {Number} OPEN
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'OPEN', {
  enumerable: true,
  value: readyStates.indexOf('OPEN')
});

/**
 * @constant {Number} OPEN
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'OPEN', {
  enumerable: true,
  value: readyStates.indexOf('OPEN')
});

/**
 * @constant {Number} CLOSING
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'CLOSING', {
  enumerable: true,
  value: readyStates.indexOf('CLOSING')
});

/**
 * @constant {Number} CLOSING
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'CLOSING', {
  enumerable: true,
  value: readyStates.indexOf('CLOSING')
});

/**
 * @constant {Number} CLOSED
 * @memberof WebSocket
 */
Object.defineProperty(WebSocket, 'CLOSED', {
  enumerable: true,
  value: readyStates.indexOf('CLOSED')
});

/**
 * @constant {Number} CLOSED
 * @memberof WebSocket.prototype
 */
Object.defineProperty(WebSocket.prototype, 'CLOSED', {
  enumerable: true,
  value: readyStates.indexOf('CLOSED')
});

[
  'binaryType',
  'bufferedAmount',
  'extensions',
  'protocol',
  'readyState',
  'url'
].forEach((property) => {
  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
});

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    enumerable: true,
    get() {
      const listeners = this.listeners(method);
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }

      return undefined;
    },
    set(listener) {
      const listeners = this.listeners(method);
      for (let i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = addEventListener;
WebSocket.prototype.removeEventListener = removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket client.
 *
 * @param {WebSocket} websocket The client to initialize
 * @param {(String|URL)} address The URL to which to connect
 * @param {String} [protocols] The subprotocols
 * @param {Object} [options] Connection options
 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
 *     permessage-deflate
 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
 *     handshake request
 * @param {Number} [options.protocolVersion=13] Value of the
 *     `Sec-WebSocket-Version` header
 * @param {String} [options.origin] Value of the `Origin` or
 *     `Sec-WebSocket-Origin` header
 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
 *     size
 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
 *     redirects
 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
 *     allowed
 * @private
 */
function initAsClient(websocket, address, protocols, options) {
  const opts = {
    protocolVersion: protocolVersions[1],
    maxPayload: 100 * 1024 * 1024,
    perMessageDeflate: true,
    followRedirects: false,
    maxRedirects: 10,
    ...options,
    createConnection: undefined,
    socketPath: undefined,
    hostname: undefined,
    protocol: undefined,
    timeout: undefined,
    method: undefined,
    host: undefined,
    path: undefined,
    port: undefined
  };

  if (!protocolVersions.includes(opts.protocolVersion)) {
    throw new RangeError(
      `Unsupported protocol version: ${opts.protocolVersion} ` +
        `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  let parsedUrl;

  if (address instanceof URL) {
    parsedUrl = address;
    websocket._url = address.href;
  } else {
    parsedUrl = new URL(address);
    websocket._url = address;
  }

  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

  if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
    const err = new Error(`Invalid URL: ${websocket.url}`);

    if (websocket._redirects === 0) {
      throw err;
    } else {
      emitErrorAndClose(websocket, err);
      return;
    }
  }

  const isSecure =
    parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'https:';
  const defaultPort = isSecure ? 443 : 80;
  const key = randomBytes(16).toString('base64');
  const get = isSecure ? https.get : http.get;
  let perMessageDeflate;

  opts.createConnection = isSecure ? tlsConnect : netConnect;
  opts.defaultPort = opts.defaultPort || defaultPort;
  opts.port = parsedUrl.port || defaultPort;
  opts.host = parsedUrl.hostname.startsWith('[')
    ? parsedUrl.hostname.slice(1, -1)
    : parsedUrl.hostname;
  opts.headers = {
    'Sec-WebSocket-Version': opts.protocolVersion,
    'Sec-WebSocket-Key': key,
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    ...opts.headers
  };
  opts.path = parsedUrl.pathname + parsedUrl.search;
  opts.timeout = opts.handshakeTimeout;

  if (opts.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
      false,
      opts.maxPayload
    );
    opts.headers['Sec-WebSocket-Extensions'] = format({
      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
    });
  }
  if (protocols) {
    opts.headers['Sec-WebSocket-Protocol'] = protocols;
  }
  if (opts.origin) {
    if (opts.protocolVersion < 13) {
      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
    } else {
      opts.headers.Origin = opts.origin;
    }
  }
  if (parsedUrl.username || parsedUrl.password) {
    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
  }

  if (isUnixSocket) {
    const parts = opts.path.split(':');

    opts.socketPath = parts[0];
    opts.path = parts[1];
  }

  if (opts.followRedirects) {
    if (websocket._redirects === 0) {
      websocket._originalUnixSocket = isUnixSocket;
      websocket._originalSecure = isSecure;
      websocket._originalHostOrSocketPath = isUnixSocket
        ? opts.socketPath
        : parsedUrl.host;

      const headers = options && options.headers;

      //
      // Shallow copy the user provided options so that headers can be changed
      // without mutating the original object.
      //
      options = { ...options, headers: {} };

      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          options.headers[key.toLowerCase()] = value;
        }
      }
    } else {
      const isSameHost = isUnixSocket
        ? websocket._originalUnixSocket
          ? opts.socketPath === websocket._originalHostOrSocketPath
          : false
        : websocket._originalUnixSocket
        ? false
        : parsedUrl.host === websocket._originalHostOrSocketPath;

      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
        //
        // Match curl 7.77.0 behavior and drop the following headers. These
        // headers are also dropped when following a redirect to a subdomain.
        //
        delete opts.headers.authorization;
        delete opts.headers.cookie;

        if (!isSameHost) delete opts.headers.host;

        opts.auth = undefined;
      }
    }

    //
    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
    // If the `Authorization` header is set, then there is nothing to do as it
    // will take precedence.
    //
    if (opts.auth && !options.headers.authorization) {
      options.headers.authorization =
        'Basic ' + Buffer.from(opts.auth).toString('base64');
    }
  }

  let req = (websocket._req = get(opts));

  if (opts.timeout) {
    req.on('timeout', () => {
      abortHandshake(websocket, req, 'Opening handshake has timed out');
    });
  }

  req.on('error', (err) => {
    if (req === null || req.aborted) return;

    req = websocket._req = null;
    emitErrorAndClose(websocket, err);
  });

  req.on('response', (res) => {
    const location = res.headers.location;
    const statusCode = res.statusCode;

    if (
      location &&
      opts.followRedirects &&
      statusCode >= 300 &&
      statusCode < 400
    ) {
      if (++websocket._redirects > opts.maxRedirects) {
        abortHandshake(websocket, req, 'Maximum redirects exceeded');
        return;
      }

      req.abort();

      let addr;

      try {
        addr = new URL(location, address);
      } catch (err) {
        emitErrorAndClose(websocket, err);
        return;
      }

      initAsClient(websocket, addr, protocols, options);
    } else if (!websocket.emit('unexpected-response', req, res)) {
      abortHandshake(
        websocket,
        req,
        `Unexpected server response: ${res.statusCode}`
      );
    }
  });

  req.on('upgrade', (res, socket, head) => {
    websocket.emit('upgrade', res);

    //
    // The user may have closed the connection from a listener of the `upgrade`
    // event.
    //
    if (websocket.readyState !== WebSocket.CONNECTING) return;

    req = websocket._req = null;

    if (res.headers.upgrade.toLowerCase() !== 'websocket') {
      abortHandshake(websocket, socket, 'Invalid Upgrade header');
      return;
    }

    const digest = createHash('sha1')
      .update(key + GUID)
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
      return;
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (protocols || '').split(/, */);
    let protError;

    if (!protocols && serverProt) {
      protError = 'Server sent a subprotocol but none was requested';
    } else if (protocols && !serverProt) {
      protError = 'Server sent no subprotocol';
    } else if (serverProt && !protList.includes(serverProt)) {
      protError = 'Server sent an invalid subprotocol';
    }

    if (protError) {
      abortHandshake(websocket, socket, protError);
      return;
    }

    if (serverProt) websocket._protocol = serverProt;

    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

    if (secWebSocketExtensions !== undefined) {
      if (!perMessageDeflate) {
        const message =
          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
          'was requested';
        abortHandshake(websocket, socket, message);
        return;
      }

      let extensions;

      try {
        extensions = parse(secWebSocketExtensions);
      } catch (err) {
        const message = 'Invalid Sec-WebSocket-Extensions header';
        abortHandshake(websocket, socket, message);
        return;
      }

      const extensionNames = Object.keys(extensions);

      if (extensionNames.length) {
        if (
          extensionNames.length !== 1 ||
          extensionNames[0] !== PerMessageDeflate.extensionName
        ) {
          const message =
            'Server indicated an extension that was not requested';
          abortHandshake(websocket, socket, message);
          return;
        }

        try {
          perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
        } catch (err) {
          const message = 'Invalid Sec-WebSocket-Extensions header';
          abortHandshake(websocket, socket, message);
          return;
        }

        websocket._extensions[PerMessageDeflate.extensionName] =
          perMessageDeflate;
      }
    }

    websocket.setSocket(socket, head, opts.maxPayload);
  });
}

/**
 * Emit the `'error'` and `'close'` event.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {Error} The error to emit
 * @private
 */
function emitErrorAndClose(websocket, err) {
  websocket._readyState = WebSocket.CLOSING;
  websocket.emit('error', err);
  websocket.emitClose();
}

/**
 * Create a `net.Socket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {net.Socket} The newly created socket used to start the connection
 * @private
 */
function netConnect(options) {
  options.path = options.socketPath;
  return net.connect(options);
}

/**
 * Create a `tls.TLSSocket` and initiate a connection.
 *
 * @param {Object} options Connection options
 * @return {tls.TLSSocket} The newly created socket used to start the connection
 * @private
 */
function tlsConnect(options) {
  options.path = undefined;

  if (!options.servername && options.servername !== '') {
    options.servername = net.isIP(options.host) ? '' : options.host;
  }

  return tls.connect(options);
}

/**
 * Abort the handshake and emit an error.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
 *     abort or the socket to destroy
 * @param {String} message The error message
 * @private
 */
function abortHandshake(websocket, stream, message) {
  websocket._readyState = WebSocket.CLOSING;

  const err = new Error(message);
  Error.captureStackTrace(err, abortHandshake);

  if (stream.setHeader) {
    stream.abort();

    if (stream.socket && !stream.socket.destroyed) {
      //
      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
      // called after the request completed. See
      // https://github.com/websockets/ws/issues/1869.
      //
      stream.socket.destroy();
    }

    stream.once('abort', websocket.emitClose.bind(websocket));
    websocket.emit('error', err);
  } else {
    stream.destroy(err);
    stream.once('error', websocket.emit.bind(websocket, 'error'));
    stream.once('close', websocket.emitClose.bind(websocket));
  }
}

/**
 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
 *
 * @param {WebSocket} websocket The WebSocket instance
 * @param {*} [data] The data to send
 * @param {Function} [cb] Callback
 * @private
 */
function sendAfterClose(websocket, data, cb) {
  if (data) {
    const length = toBuffer(data).length;

    //
    // The `_bufferedAmount` property is used only when the peer is a client and
    // the opening handshake fails. Under these circumstances, in fact, the
    // `setSocket()` method is not called, so the `_socket` and `_sender`
    // properties are set to `null`.
    //
    if (websocket._socket) websocket._sender._bufferedBytes += length;
    else websocket._bufferedAmount += length;
  }

  if (cb) {
    const err = new Error(
      `WebSocket is not open: readyState ${websocket.readyState} ` +
        `(${readyStates[websocket.readyState]})`
    );
    cb(err);
  }
}

/**
 * The listener of the `Receiver` `'conclude'` event.
 *
 * @param {Number} code The status code
 * @param {String} reason The reason for closing
 * @private
 */
function receiverOnConclude(code, reason) {
  const websocket = this[kWebSocket];

  websocket._closeFrameReceived = true;
  websocket._closeMessage = reason;
  websocket._closeCode = code;

  if (websocket._socket[kWebSocket] === undefined) return;

  websocket._socket.removeListener('data', socketOnData);
  process.nextTick(resume, websocket._socket);

  if (code === 1005) websocket.close();
  else websocket.close(code, reason);
}

/**
 * The listener of the `Receiver` `'drain'` event.
 *
 * @private
 */
function receiverOnDrain() {
  this[kWebSocket]._socket.resume();
}

/**
 * The listener of the `Receiver` `'error'` event.
 *
 * @param {(RangeError|Error)} err The emitted error
 * @private
 */
function receiverOnError(err) {
  const websocket = this[kWebSocket];

  if (websocket._socket[kWebSocket] !== undefined) {
    websocket._socket.removeListener('data', socketOnData);

    //
    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
    // https://github.com/websockets/ws/issues/1940.
    //
    process.nextTick(resume, websocket._socket);

    websocket.close(err[kStatusCode]);
  }

  websocket.emit('error', err);
}

/**
 * The listener of the `Receiver` `'finish'` event.
 *
 * @private
 */
function receiverOnFinish() {
  this[kWebSocket].emitClose();
}

/**
 * The listener of the `Receiver` `'message'` event.
 *
 * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
 * @private
 */
function receiverOnMessage(data) {
  this[kWebSocket].emit('message', data);
}

/**
 * The listener of the `Receiver` `'ping'` event.
 *
 * @param {Buffer} data The data included in the ping frame
 * @private
 */
function receiverOnPing(data) {
  const websocket = this[kWebSocket];

  websocket.pong(data, !websocket._isServer, NOOP);
  websocket.emit('ping', data);
}

/**
 * The listener of the `Receiver` `'pong'` event.
 *
 * @param {Buffer} data The data included in the pong frame
 * @private
 */
function receiverOnPong(data) {
  this[kWebSocket].emit('pong', data);
}

/**
 * Resume a readable stream
 *
 * @param {Readable} stream The readable stream
 * @private
 */
function resume(stream) {
  stream.resume();
}

/**
 * The listener of the `net.Socket` `'close'` event.
 *
 * @private
 */
function socketOnClose() {
  const websocket = this[kWebSocket];

  this.removeListener('close', socketOnClose);
  this.removeListener('data', socketOnData);
  this.removeListener('end', socketOnEnd);

  websocket._readyState = WebSocket.CLOSING;

  let chunk;

  //
  // The close frame might not have been received or the `'end'` event emitted,
  // for example, if the socket was destroyed due to an error. Ensure that the
  // `receiver` stream is closed after writing any remaining buffered data to
  // it. If the readable side of the socket is in flowing mode then there is no
  // buffered data as everything has been already written and `readable.read()`
  // will return `null`. If instead, the socket is paused, any possible buffered
  // data will be read as a single chunk.
  //
  if (
    !this._readableState.endEmitted &&
    !websocket._closeFrameReceived &&
    !websocket._receiver._writableState.errorEmitted &&
    (chunk = websocket._socket.read()) !== null
  ) {
    websocket._receiver.write(chunk);
  }

  websocket._receiver.end();

  this[kWebSocket] = undefined;

  clearTimeout(websocket._closeTimer);

  if (
    websocket._receiver._writableState.finished ||
    websocket._receiver._writableState.errorEmitted
  ) {
    websocket.emitClose();
  } else {
    websocket._receiver.on('error', receiverOnFinish);
    websocket._receiver.on('finish', receiverOnFinish);
  }
}

/**
 * The listener of the `net.Socket` `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function socketOnData(chunk) {
  if (!this[kWebSocket]._receiver.write(chunk)) {
    this.pause();
  }
}

/**
 * The listener of the `net.Socket` `'end'` event.
 *
 * @private
 */
function socketOnEnd() {
  const websocket = this[kWebSocket];

  websocket._readyState = WebSocket.CLOSING;
  websocket._receiver.end();
  this.end();
}

/**
 * The listener of the `net.Socket` `'error'` event.
 *
 * @private
 */
function socketOnError() {
  const websocket = this[kWebSocket];

  this.removeListener('error', socketOnError);
  this.on('error', NOOP);

  if (websocket) {
    websocket._readyState = WebSocket.CLOSING;
    this.destroy();
  }
}


/***/ }),

/***/ 61256:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(44298);
const node_js_1 = tslib_1.__importDefault(__webpack_require__(65742));
tslib_1.__exportStar(__webpack_require__(65742), exports);
tslib_1.__exportStar(__webpack_require__(437), exports);
exports["default"] = node_js_1.default;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 43856:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function importLokijs() {
    try {
        return __webpack_require__(66022);
    }
    catch (e) {
        throw new Error(`To use WalletConnect server side, you'll need to install the "lokijs" dependency. If you are seeing this error during a build / in an SSR environment, you can add "lokijs" as a devDependency to make this error go away.`);
    }
}
let Lokijs;
class Db {
    constructor(opts) {
        if (!Lokijs) {
            Lokijs = importLokijs();
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.db) === ":memory:") {
            this.database = new Lokijs(opts === null || opts === void 0 ? void 0 : opts.db, {});
        }
        else {
            this.database = new Lokijs(opts === null || opts === void 0 ? void 0 : opts.db, {
                autoload: true,
                autoloadCallback: opts.callback,
            });
        }
    }
    static create(opts) {
        const db = opts.db;
        if (db === ":memory:") {
            return new Db(opts);
        }
        if (!Db.instances[db]) {
            Db.instances[db] = new Db(opts);
        }
        return Db.instances[db];
    }
}
exports["default"] = Db;
Db.instances = {};
//# sourceMappingURL=db.js.map

/***/ }),

/***/ 65742:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyValueStorage = void 0;
const tslib_1 = __webpack_require__(44298);
const safe_json_utils_1 = __webpack_require__(38317);
const db_1 = tslib_1.__importDefault(__webpack_require__(43856));
const DB_NAME = "walletconnect.db";
class KeyValueStorage {
    constructor(opts) {
        this.initialized = false;
        this.inMemory = false;
        this.databaseInitialize = (db) => {
            if (db) {
                this.db = db;
            }
            this.database = this.db.getCollection("entries");
            if (this.database === null) {
                this.database = this.db.addCollection("entries", { unique: ["id"] });
            }
            this.initialized = true;
        };
        if ((opts === null || opts === void 0 ? void 0 : opts.database) === ":memory:") {
            this.inMemory = true;
        }
        const instance = db_1.default.create({
            db: (opts === null || opts === void 0 ? void 0 : opts.database) || (opts === null || opts === void 0 ? void 0 : opts.table) || DB_NAME,
            callback: this.databaseInitialize,
        });
        this.db = instance.database;
        this.databaseInitialize(this.db);
    }
    getKeys() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.initilization();
            const keys = (yield this.database.find()).map((item) => item.id);
            return keys;
        });
    }
    getEntries() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.initilization();
            const entries = (yield this.database.find()).map((item) => [item.id, safe_json_utils_1.safeJsonParse(item.value)]);
            return entries;
        });
    }
    getItem(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.initilization();
            const item = this.database.findOne({ id: { $eq: key } });
            if (item === null) {
                return undefined;
            }
            return safe_json_utils_1.safeJsonParse(item.value);
        });
    }
    setItem(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.initilization();
            const item = this.database.findOne({ id: { $eq: key } });
            if (item) {
                item.value = safe_json_utils_1.safeJsonStringify(value);
                this.database.update(item);
            }
            else {
                this.database.insert({ id: key, value: safe_json_utils_1.safeJsonStringify(value) });
            }
            yield this.persist();
        });
    }
    removeItem(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.initilization();
            const item = this.database.findOne({ id: { $eq: key } });
            yield this.database.remove(item);
            yield this.persist();
        });
    }
    initilization() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.initialized) {
                return;
            }
            yield new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (this.initialized) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 20);
            });
        });
    }
    persist() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.inMemory)
                return;
            this.db.saveDatabase();
        });
    }
}
exports.KeyValueStorage = KeyValueStorage;
exports["default"] = KeyValueStorage;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 437:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(44298);
tslib_1.__exportStar(__webpack_require__(82294), exports);
tslib_1.__exportStar(__webpack_require__(11988), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 82294:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IKeyValueStorage = void 0;
class IKeyValueStorage {
}
exports.IKeyValueStorage = IKeyValueStorage;
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 11988:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseEntry = void 0;
const safe_json_utils_1 = __webpack_require__(38317);
function parseEntry(entry) {
    var _a;
    return [entry[0], safe_json_utils_1.safeJsonParse((_a = entry[1]) !== null && _a !== void 0 ? _a : "")];
}
exports.parseEntry = parseEntry;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 44298:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 28021:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PINO_CUSTOM_CONTEXT_KEY = exports.PINO_LOGGER_DEFAULTS = void 0;
exports.PINO_LOGGER_DEFAULTS = {
    level: "info",
};
exports.PINO_CUSTOM_CONTEXT_KEY = "custom_context";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 3491:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pino = void 0;
const tslib_1 = __webpack_require__(97795);
const pino_1 = tslib_1.__importDefault(__webpack_require__(55312));
Object.defineProperty(exports, "pino", ({ enumerable: true, get: function () { return pino_1.default; } }));
tslib_1.__exportStar(__webpack_require__(28021), exports);
tslib_1.__exportStar(__webpack_require__(16372), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 16372:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateChildLogger = exports.formatChildLoggerContext = exports.getLoggerContext = exports.setBrowserLoggerContext = exports.getBrowserLoggerContext = exports.getDefaultLoggerOptions = void 0;
const constants_1 = __webpack_require__(28021);
function getDefaultLoggerOptions(opts) {
    return Object.assign(Object.assign({}, opts), { level: (opts === null || opts === void 0 ? void 0 : opts.level) || constants_1.PINO_LOGGER_DEFAULTS.level });
}
exports.getDefaultLoggerOptions = getDefaultLoggerOptions;
function getBrowserLoggerContext(logger, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    return logger[customContextKey] || "";
}
exports.getBrowserLoggerContext = getBrowserLoggerContext;
function setBrowserLoggerContext(logger, context, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    logger[customContextKey] = context;
    return logger;
}
exports.setBrowserLoggerContext = setBrowserLoggerContext;
function getLoggerContext(logger, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    let context = "";
    if (typeof logger.bindings === "undefined") {
        context = getBrowserLoggerContext(logger, customContextKey);
    }
    else {
        context = logger.bindings().context || "";
    }
    return context;
}
exports.getLoggerContext = getLoggerContext;
function formatChildLoggerContext(logger, childContext, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    const parentContext = getLoggerContext(logger, customContextKey);
    const context = parentContext.trim()
        ? `${parentContext}/${childContext}`
        : childContext;
    return context;
}
exports.formatChildLoggerContext = formatChildLoggerContext;
function generateChildLogger(logger, childContext, customContextKey = constants_1.PINO_CUSTOM_CONTEXT_KEY) {
    const context = formatChildLoggerContext(logger, childContext, customContextKey);
    const child = logger.child({ context });
    return setBrowserLoggerContext(child, context, customContextKey);
}
exports.generateChildLogger = generateChildLogger;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 97795:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 90812:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.verifyJWT = exports.signJWT = exports.generateKeyPair = void 0;
const tslib_1 = __webpack_require__(1514);
const ed25519 = tslib_1.__importStar(__webpack_require__(50535));
const random_1 = __webpack_require__(53412);
const time_1 = __webpack_require__(26438);
const constants_1 = __webpack_require__(96356);
const utils_1 = __webpack_require__(24816);
function generateKeyPair(seed = random_1.randomBytes(constants_1.KEY_PAIR_SEED_LENGTH)) {
    return ed25519.generateKeyPairFromSeed(seed);
}
exports.generateKeyPair = generateKeyPair;
function signJWT(sub, aud, ttl, keyPair, iat = time_1.fromMiliseconds(Date.now())) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const header = { alg: constants_1.JWT_IRIDIUM_ALG, typ: constants_1.JWT_IRIDIUM_TYP };
        const iss = utils_1.encodeIss(keyPair.publicKey);
        const exp = iat + ttl;
        const payload = { iss, sub, aud, iat, exp };
        const data = utils_1.encodeData({ header, payload });
        const signature = ed25519.sign(keyPair.secretKey, data);
        return utils_1.encodeJWT({ header, payload, signature });
    });
}
exports.signJWT = signJWT;
function verifyJWT(jwt) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { header, payload, data, signature } = utils_1.decodeJWT(jwt);
        if (header.alg !== constants_1.JWT_IRIDIUM_ALG || header.typ !== constants_1.JWT_IRIDIUM_TYP) {
            throw new Error("JWT must use EdDSA algorithm");
        }
        const publicKey = utils_1.decodeIss(payload.iss);
        return ed25519.verify(publicKey, data, signature);
    });
}
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=api.js.map

/***/ }),

/***/ 96356:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KEY_PAIR_SEED_LENGTH = exports.MULTICODEC_ED25519_LENGTH = exports.MULTICODEC_ED25519_HEADER = exports.MULTICODEC_ED25519_BASE = exports.MULTICODEC_ED25519_ENCODING = exports.DID_METHOD = exports.DID_PREFIX = exports.DID_DELIMITER = exports.DATA_ENCODING = exports.JSON_ENCODING = exports.JWT_ENCODING = exports.JWT_DELIMITER = exports.JWT_IRIDIUM_TYP = exports.JWT_IRIDIUM_ALG = void 0;
exports.JWT_IRIDIUM_ALG = "EdDSA";
exports.JWT_IRIDIUM_TYP = "JWT";
exports.JWT_DELIMITER = ".";
exports.JWT_ENCODING = "base64url";
exports.JSON_ENCODING = "utf8";
exports.DATA_ENCODING = "utf8";
exports.DID_DELIMITER = ":";
exports.DID_PREFIX = "did";
exports.DID_METHOD = "key";
exports.MULTICODEC_ED25519_ENCODING = "base58btc";
exports.MULTICODEC_ED25519_BASE = "z";
exports.MULTICODEC_ED25519_HEADER = "K36";
exports.MULTICODEC_ED25519_LENGTH = 32;
exports.KEY_PAIR_SEED_LENGTH = 32;
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 55336:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1514);
tslib_1.__exportStar(__webpack_require__(90812), exports);
tslib_1.__exportStar(__webpack_require__(96356), exports);
tslib_1.__exportStar(__webpack_require__(63288), exports);
tslib_1.__exportStar(__webpack_require__(24816), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 63288:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=types.js.map

/***/ }),

/***/ 24816:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeJWT = exports.encodeJWT = exports.decodeData = exports.encodeData = exports.decodeSig = exports.encodeSig = exports.decodeIss = exports.encodeIss = exports.encodeJSON = exports.decodeJSON = void 0;
const concat_1 = __webpack_require__(33391);
const to_string_1 = __webpack_require__(45594);
const from_string_1 = __webpack_require__(5007);
const safe_json_1 = __webpack_require__(51738);
const constants_1 = __webpack_require__(96356);
function decodeJSON(str) {
    return safe_json_1.safeJsonParse(to_string_1.toString(from_string_1.fromString(str, constants_1.JWT_ENCODING), constants_1.JSON_ENCODING));
}
exports.decodeJSON = decodeJSON;
function encodeJSON(val) {
    return to_string_1.toString(from_string_1.fromString(safe_json_1.safeJsonStringify(val), constants_1.JSON_ENCODING), constants_1.JWT_ENCODING);
}
exports.encodeJSON = encodeJSON;
function encodeIss(publicKey) {
    const header = from_string_1.fromString(constants_1.MULTICODEC_ED25519_HEADER, constants_1.MULTICODEC_ED25519_ENCODING);
    const multicodec = constants_1.MULTICODEC_ED25519_BASE +
        to_string_1.toString(concat_1.concat([header, publicKey]), constants_1.MULTICODEC_ED25519_ENCODING);
    return [constants_1.DID_PREFIX, constants_1.DID_METHOD, multicodec].join(constants_1.DID_DELIMITER);
}
exports.encodeIss = encodeIss;
function decodeIss(issuer) {
    const [prefix, method, multicodec] = issuer.split(constants_1.DID_DELIMITER);
    if (prefix !== constants_1.DID_PREFIX || method !== constants_1.DID_METHOD) {
        throw new Error(`Issuer must be a DID with method "key"`);
    }
    const base = multicodec.slice(0, 1);
    if (base !== constants_1.MULTICODEC_ED25519_BASE) {
        throw new Error(`Issuer must be a key in mulicodec format`);
    }
    const bytes = from_string_1.fromString(multicodec.slice(1), constants_1.MULTICODEC_ED25519_ENCODING);
    const type = to_string_1.toString(bytes.slice(0, 2), constants_1.MULTICODEC_ED25519_ENCODING);
    if (type !== constants_1.MULTICODEC_ED25519_HEADER) {
        throw new Error(`Issuer must be a public key with type "Ed25519"`);
    }
    const publicKey = bytes.slice(2);
    if (publicKey.length !== constants_1.MULTICODEC_ED25519_LENGTH) {
        throw new Error(`Issuer must be a public key with length 32 bytes`);
    }
    return publicKey;
}
exports.decodeIss = decodeIss;
function encodeSig(bytes) {
    return to_string_1.toString(bytes, constants_1.JWT_ENCODING);
}
exports.encodeSig = encodeSig;
function decodeSig(encoded) {
    return from_string_1.fromString(encoded, constants_1.JWT_ENCODING);
}
exports.decodeSig = decodeSig;
function encodeData(params) {
    return from_string_1.fromString([encodeJSON(params.header), encodeJSON(params.payload)].join(constants_1.JWT_DELIMITER), constants_1.DATA_ENCODING);
}
exports.encodeData = encodeData;
function decodeData(data) {
    const params = to_string_1.toString(data, constants_1.DATA_ENCODING).split(constants_1.JWT_DELIMITER);
    const header = decodeJSON(params[0]);
    const payload = decodeJSON(params[1]);
    return { header, payload };
}
exports.decodeData = decodeData;
function encodeJWT(params) {
    return [
        encodeJSON(params.header),
        encodeJSON(params.payload),
        encodeSig(params.signature),
    ].join(constants_1.JWT_DELIMITER);
}
exports.encodeJWT = encodeJWT;
function decodeJWT(jwt) {
    const params = jwt.split(constants_1.JWT_DELIMITER);
    const header = decodeJSON(params[0]);
    const payload = decodeJSON(params[1]);
    const signature = decodeSig(params[2]);
    const data = from_string_1.fromString(params.slice(0, 2).join(constants_1.JWT_DELIMITER), constants_1.DATA_ENCODING);
    return { header, payload, signature, data };
}
exports.decodeJWT = decodeJWT;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 1514:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 66226:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;
__webpack_unused_export__ = ({value:!0});var y=__webpack_require__(78771),O=__webpack_require__(3491),U=__webpack_require__(49454),i=__webpack_require__(40491),$=__webpack_require__(82361),p=__webpack_require__(26438),g=__webpack_require__(25815);function H(E){return E&&typeof E=="object"&&"default"in E?E:{default:E}}var W=H($);const A="wc",L=2,b="client",T=`${A}@${L}:${b}:`,V={name:b,logger:"error",controller:!1,relayUrl:"wss://relay.walletconnect.com"},B={session_proposal:"session_proposal",session_update:"session_update",session_extend:"session_extend",session_ping:"session_ping",session_delete:"session_delete",session_expire:"session_expire",session_request:"session_request",session_request_sent:"session_request_sent",session_event:"session_event",proposal_expire:"proposal_expire"},Z={database:":memory:"},M="WALLETCONNECT_DEEPLINK_CHOICE",ee={created:"history_created",updated:"history_updated",deleted:"history_deleted",sync:"history_sync"},se="history",te="0.3",Y="proposal",ie=p.THIRTY_DAYS,Q="Proposal expired",J="session",v=p.SEVEN_DAYS,k="engine",N={wc_sessionPropose:{req:{ttl:p.FIVE_MINUTES,prompt:!0,tag:1100},res:{ttl:p.FIVE_MINUTES,prompt:!1,tag:1101}},wc_sessionSettle:{req:{ttl:p.FIVE_MINUTES,prompt:!1,tag:1102},res:{ttl:p.FIVE_MINUTES,prompt:!1,tag:1103}},wc_sessionUpdate:{req:{ttl:p.ONE_DAY,prompt:!1,tag:1104},res:{ttl:p.ONE_DAY,prompt:!1,tag:1105}},wc_sessionExtend:{req:{ttl:p.ONE_DAY,prompt:!1,tag:1106},res:{ttl:p.ONE_DAY,prompt:!1,tag:1107}},wc_sessionRequest:{req:{ttl:p.FIVE_MINUTES,prompt:!0,tag:1108},res:{ttl:p.FIVE_MINUTES,prompt:!1,tag:1109}},wc_sessionEvent:{req:{ttl:p.FIVE_MINUTES,prompt:!0,tag:1110},res:{ttl:p.FIVE_MINUTES,prompt:!1,tag:1111}},wc_sessionDelete:{req:{ttl:p.ONE_DAY,prompt:!1,tag:1112},res:{ttl:p.ONE_DAY,prompt:!1,tag:1113}},wc_sessionPing:{req:{ttl:p.THIRTY_SECONDS,prompt:!1,tag:1114},res:{ttl:p.THIRTY_SECONDS,prompt:!1,tag:1115}}},D={min:p.FIVE_MINUTES,max:p.SEVEN_DAYS},_={idle:"IDLE",active:"ACTIVE"},K="request",F=["wc_sessionPropose","wc_sessionRequest","wc_authRequest"];var re=Object.defineProperty,ne=Object.defineProperties,oe=Object.getOwnPropertyDescriptors,X=Object.getOwnPropertySymbols,ae=Object.prototype.hasOwnProperty,ce=Object.prototype.propertyIsEnumerable,j=(E,n,e)=>n in E?re(E,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):E[n]=e,m=(E,n)=>{for(var e in n||(n={}))ae.call(n,e)&&j(E,e,n[e]);if(X)for(var e of X(n))ce.call(n,e)&&j(E,e,n[e]);return E},f=(E,n)=>ne(E,oe(n));class le extends U.IEngine{constructor(n){super(n),this.name=k,this.events=new W.default,this.initialized=!1,this.ignoredPayloadTypes=[i.TYPE_1],this.requestQueue={state:_.idle,queue:[]},this.sessionRequestQueue={state:_.idle,queue:[]},this.requestQueueDelay=p.ONE_SECOND,this.init=async()=>{this.initialized||(await this.cleanup(),this.registerRelayerEvents(),this.registerExpirerEvents(),this.registerPairingEvents(),this.client.core.pairing.register({methods:Object.keys(N)}),this.initialized=!0,setTimeout(()=>{this.sessionRequestQueue.queue=this.getPendingSessionRequests(),this.processSessionRequestQueue()},p.toMiliseconds(this.requestQueueDelay)))},this.connect=async e=>{await this.isInitialized();const s=f(m({},e),{requiredNamespaces:e.requiredNamespaces||{},optionalNamespaces:e.optionalNamespaces||{}});await this.isValidConnect(s);const{pairingTopic:t,requiredNamespaces:r,optionalNamespaces:o,sessionProperties:a,relays:c}=s;let l=t,h,u=!1;if(l&&(u=this.client.core.pairing.pairings.get(l).active),!l||!u){const{topic:R,uri:w}=await this.client.core.pairing.create();l=R,h=w}const d=await this.client.core.crypto.generateKeyPair(),S=m({requiredNamespaces:r,optionalNamespaces:o,relays:c??[{protocol:y.RELAYER_DEFAULT_PROTOCOL}],proposer:{publicKey:d,metadata:this.client.metadata}},a&&{sessionProperties:a}),{reject:I,resolve:q,done:C}=i.createDelayedPromise(p.FIVE_MINUTES,Q);if(this.events.once(i.engineEvent("session_connect"),async({error:R,session:w})=>{if(R)I(R);else if(w){w.self.publicKey=d;const G=f(m({},w),{requiredNamespaces:w.requiredNamespaces,optionalNamespaces:w.optionalNamespaces});await this.client.session.set(w.topic,G),await this.setExpiry(w.topic,w.expiry),l&&await this.client.core.pairing.updateMetadata({topic:l,metadata:w.peer.metadata}),q(G)}}),!l){const{message:R}=i.getInternalError("NO_MATCHING_KEY",`connect() pairing topic: ${l}`);throw new Error(R)}const P=await this.sendRequest({topic:l,method:"wc_sessionPropose",params:S}),z=i.calcExpiry(p.FIVE_MINUTES);return await this.setProposal(P,m({id:P,expiry:z},S)),{uri:h,approval:C}},this.pair=async e=>(await this.isInitialized(),await this.client.core.pairing.pair(e)),this.approve=async e=>{await this.isInitialized(),await this.isValidApprove(e);const{id:s,relayProtocol:t,namespaces:r,sessionProperties:o}=e,a=this.client.proposal.get(s);let{pairingTopic:c,proposer:l,requiredNamespaces:h,optionalNamespaces:u}=a;c=c||"",i.isValidObject(h)||(h=i.getRequiredNamespacesFromNamespaces(r,"approve()"));const d=await this.client.core.crypto.generateKeyPair(),S=l.publicKey,I=await this.client.core.crypto.generateSharedKey(d,S);c&&s&&(await this.client.core.pairing.updateMetadata({topic:c,metadata:l.metadata}),await this.sendResult({id:s,topic:c,result:{relay:{protocol:t??"irn"},responderPublicKey:d}}),await this.client.proposal.delete(s,i.getSdkError("USER_DISCONNECTED")),await this.client.core.pairing.activate({topic:c}));const q=m({relay:{protocol:t??"irn"},namespaces:r,requiredNamespaces:h,optionalNamespaces:u,pairingTopic:c,controller:{publicKey:d,metadata:this.client.metadata},expiry:i.calcExpiry(v)},o&&{sessionProperties:o});await this.client.core.relayer.subscribe(I),await this.sendRequest({topic:I,method:"wc_sessionSettle",params:q,throwOnFailedPublish:!0});const C=f(m({},q),{topic:I,pairingTopic:c,acknowledged:!1,self:q.controller,peer:{publicKey:l.publicKey,metadata:l.metadata},controller:d});return await this.client.session.set(I,C),await this.setExpiry(I,i.calcExpiry(v)),{topic:I,acknowledged:()=>new Promise(P=>setTimeout(()=>P(this.client.session.get(I)),500))}},this.reject=async e=>{await this.isInitialized(),await this.isValidReject(e);const{id:s,reason:t}=e,{pairingTopic:r}=this.client.proposal.get(s);r&&(await this.sendError(s,r,t),await this.client.proposal.delete(s,i.getSdkError("USER_DISCONNECTED")))},this.update=async e=>{await this.isInitialized(),await this.isValidUpdate(e);const{topic:s,namespaces:t}=e,r=await this.sendRequest({topic:s,method:"wc_sessionUpdate",params:{namespaces:t}}),{done:o,resolve:a,reject:c}=i.createDelayedPromise();return this.events.once(i.engineEvent("session_update",r),({error:l})=>{l?c(l):a()}),await this.client.session.update(s,{namespaces:t}),{acknowledged:o}},this.extend=async e=>{await this.isInitialized(),await this.isValidExtend(e);const{topic:s}=e,t=await this.sendRequest({topic:s,method:"wc_sessionExtend",params:{}}),{done:r,resolve:o,reject:a}=i.createDelayedPromise();return this.events.once(i.engineEvent("session_extend",t),({error:c})=>{c?a(c):o()}),await this.setExpiry(s,i.calcExpiry(v)),{acknowledged:r}},this.request=async e=>{await this.isInitialized(),await this.isValidRequest(e);const{chainId:s,request:t,topic:r,expiry:o}=e,a=g.payloadId(),{done:c,resolve:l,reject:h}=i.createDelayedPromise(o);return this.events.once(i.engineEvent("session_request",a),({error:u,result:d})=>{u?h(u):l(d)}),await Promise.all([new Promise(async u=>{await this.sendRequest({clientRpcId:a,topic:r,method:"wc_sessionRequest",params:{request:t,chainId:s},expiry:o,throwOnFailedPublish:!0}).catch(d=>h(d)),this.client.events.emit("session_request_sent",{topic:r,request:t,chainId:s,id:a}),u()}),new Promise(async u=>{const d=await this.client.core.storage.getItem(M);i.handleDeeplinkRedirect({id:a,topic:r,wcDeepLink:d}),u()}),c()]).then(u=>u[2])},this.respond=async e=>{await this.isInitialized(),await this.isValidRespond(e);const{topic:s,response:t}=e,{id:r}=t;g.isJsonRpcResult(t)?await this.sendResult({id:r,topic:s,result:t.result,throwOnFailedPublish:!0}):g.isJsonRpcError(t)&&await this.sendError(r,s,t.error),this.cleanupAfterResponse(e)},this.ping=async e=>{await this.isInitialized(),await this.isValidPing(e);const{topic:s}=e;if(this.client.session.keys.includes(s)){const t=await this.sendRequest({topic:s,method:"wc_sessionPing",params:{}}),{done:r,resolve:o,reject:a}=i.createDelayedPromise();this.events.once(i.engineEvent("session_ping",t),({error:c})=>{c?a(c):o()}),await r()}else this.client.core.pairing.pairings.keys.includes(s)&&await this.client.core.pairing.ping({topic:s})},this.emit=async e=>{await this.isInitialized(),await this.isValidEmit(e);const{topic:s,event:t,chainId:r}=e;await this.sendRequest({topic:s,method:"wc_sessionEvent",params:{event:t,chainId:r}})},this.disconnect=async e=>{await this.isInitialized(),await this.isValidDisconnect(e);const{topic:s}=e;this.client.session.keys.includes(s)?(await this.sendRequest({topic:s,method:"wc_sessionDelete",params:i.getSdkError("USER_DISCONNECTED"),throwOnFailedPublish:!0}),await this.deleteSession(s)):await this.client.core.pairing.disconnect({topic:s})},this.find=e=>(this.isInitialized(),this.client.session.getAll().filter(s=>i.isSessionCompatible(s,e))),this.getPendingSessionRequests=()=>(this.isInitialized(),this.client.pendingRequest.getAll()),this.cleanupDuplicatePairings=async e=>{if(e.pairingTopic)try{const s=this.client.core.pairing.pairings.get(e.pairingTopic),t=this.client.core.pairing.pairings.getAll().filter(r=>{var o,a;return((o=r.peerMetadata)==null?void 0:o.url)&&((a=r.peerMetadata)==null?void 0:a.url)===e.peer.metadata.url&&r.topic&&r.topic!==s.topic});if(t.length===0)return;this.client.logger.info(`Cleaning up ${t.length} duplicate pairing(s)`),await Promise.all(t.map(r=>this.client.core.pairing.disconnect({topic:r.topic}))),this.client.logger.info("Duplicate pairings clean up finished")}catch(s){this.client.logger.error(s)}},this.deleteSession=async(e,s)=>{const{self:t}=this.client.session.get(e);await this.client.core.relayer.unsubscribe(e),this.client.session.delete(e,i.getSdkError("USER_DISCONNECTED")),this.client.core.crypto.keychain.has(t.publicKey)&&await this.client.core.crypto.deleteKeyPair(t.publicKey),this.client.core.crypto.keychain.has(e)&&await this.client.core.crypto.deleteSymKey(e),s||this.client.core.expirer.del(e),this.client.core.storage.removeItem(M).catch(r=>this.client.logger.warn(r))},this.deleteProposal=async(e,s)=>{await Promise.all([this.client.proposal.delete(e,i.getSdkError("USER_DISCONNECTED")),s?Promise.resolve():this.client.core.expirer.del(e)])},this.deletePendingSessionRequest=async(e,s,t=!1)=>{await Promise.all([this.client.pendingRequest.delete(e,s),t?Promise.resolve():this.client.core.expirer.del(e)]),this.sessionRequestQueue.queue=this.sessionRequestQueue.queue.filter(r=>r.id!==e),t&&(this.sessionRequestQueue.state=_.idle)},this.setExpiry=async(e,s)=>{this.client.session.keys.includes(e)&&await this.client.session.update(e,{expiry:s}),this.client.core.expirer.set(e,s)},this.setProposal=async(e,s)=>{await this.client.proposal.set(e,s),this.client.core.expirer.set(e,s.expiry)},this.setPendingSessionRequest=async e=>{const s=N.wc_sessionRequest.req.ttl,{id:t,topic:r,params:o,verifyContext:a}=e;await this.client.pendingRequest.set(t,{id:t,topic:r,params:o,verifyContext:a}),s&&this.client.core.expirer.set(t,i.calcExpiry(s))},this.sendRequest=async e=>{const{topic:s,method:t,params:r,expiry:o,relayRpcId:a,clientRpcId:c,throwOnFailedPublish:l}=e,h=g.formatJsonRpcRequest(t,r,c);if(i.isBrowser()&&F.includes(t)){const S=i.hashMessage(JSON.stringify(h));this.client.core.verify.register({attestationId:S})}const u=await this.client.core.crypto.encode(s,h),d=N[t].req;return o&&(d.ttl=o),a&&(d.id=a),this.client.core.history.set(s,h),l?(d.internal=f(m({},d.internal),{throwOnFailedPublish:!0}),await this.client.core.relayer.publish(s,u,d)):this.client.core.relayer.publish(s,u,d).catch(S=>this.client.logger.error(S)),h.id},this.sendResult=async e=>{const{id:s,topic:t,result:r,throwOnFailedPublish:o}=e,a=g.formatJsonRpcResult(s,r),c=await this.client.core.crypto.encode(t,a),l=await this.client.core.history.get(t,s),h=N[l.request.method].res;o?(h.internal=f(m({},h.internal),{throwOnFailedPublish:!0}),await this.client.core.relayer.publish(t,c,h)):this.client.core.relayer.publish(t,c,h).catch(u=>this.client.logger.error(u)),await this.client.core.history.resolve(a)},this.sendError=async(e,s,t)=>{const r=g.formatJsonRpcError(e,t),o=await this.client.core.crypto.encode(s,r),a=await this.client.core.history.get(s,e),c=N[a.request.method].res;this.client.core.relayer.publish(s,o,c),await this.client.core.history.resolve(r)},this.cleanup=async()=>{const e=[],s=[];this.client.session.getAll().forEach(t=>{i.isExpired(t.expiry)&&e.push(t.topic)}),this.client.proposal.getAll().forEach(t=>{i.isExpired(t.expiry)&&s.push(t.id)}),await Promise.all([...e.map(t=>this.deleteSession(t)),...s.map(t=>this.deleteProposal(t))])},this.onRelayEventRequest=async e=>{this.requestQueue.queue.push(e),await this.processRequestsQueue()},this.processRequestsQueue=async()=>{if(this.requestQueue.state===_.active){this.client.logger.info("Request queue already active, skipping...");return}for(this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`);this.requestQueue.queue.length>0;){this.requestQueue.state=_.active;const e=this.requestQueue.queue.shift();if(e)try{this.processRequest(e),await new Promise(s=>setTimeout(s,300))}catch(s){this.client.logger.warn(s)}}this.requestQueue.state=_.idle},this.processRequest=e=>{const{topic:s,payload:t}=e,r=t.method;switch(r){case"wc_sessionPropose":return this.onSessionProposeRequest(s,t);case"wc_sessionSettle":return this.onSessionSettleRequest(s,t);case"wc_sessionUpdate":return this.onSessionUpdateRequest(s,t);case"wc_sessionExtend":return this.onSessionExtendRequest(s,t);case"wc_sessionPing":return this.onSessionPingRequest(s,t);case"wc_sessionDelete":return this.onSessionDeleteRequest(s,t);case"wc_sessionRequest":return this.onSessionRequest(s,t);case"wc_sessionEvent":return this.onSessionEventRequest(s,t);default:return this.client.logger.info(`Unsupported request method ${r}`)}},this.onRelayEventResponse=async e=>{const{topic:s,payload:t}=e,r=(await this.client.core.history.get(s,t.id)).request.method;switch(r){case"wc_sessionPropose":return this.onSessionProposeResponse(s,t);case"wc_sessionSettle":return this.onSessionSettleResponse(s,t);case"wc_sessionUpdate":return this.onSessionUpdateResponse(s,t);case"wc_sessionExtend":return this.onSessionExtendResponse(s,t);case"wc_sessionPing":return this.onSessionPingResponse(s,t);case"wc_sessionRequest":return this.onSessionRequestResponse(s,t);default:return this.client.logger.info(`Unsupported response method ${r}`)}},this.onRelayEventUnknownPayload=e=>{const{topic:s}=e,{message:t}=i.getInternalError("MISSING_OR_INVALID",`Decoded payload on topic ${s} is not identifiable as a JSON-RPC request or a response.`);throw new Error(t)},this.onSessionProposeRequest=async(e,s)=>{const{params:t,id:r}=s;try{this.isValidConnect(m({},s.params));const o=i.calcExpiry(p.FIVE_MINUTES),a=m({id:r,pairingTopic:e,expiry:o},t);await this.setProposal(r,a);const c=i.hashMessage(JSON.stringify(s)),l=await this.getVerifyContext(c,a.proposer.metadata);this.client.events.emit("session_proposal",{id:r,params:a,verifyContext:l})}catch(o){await this.sendError(r,e,o),this.client.logger.error(o)}},this.onSessionProposeResponse=async(e,s)=>{const{id:t}=s;if(g.isJsonRpcResult(s)){const{result:r}=s;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",result:r});const o=this.client.proposal.get(t);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",proposal:o});const a=o.proposer.publicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",selfPublicKey:a});const c=r.responderPublicKey;this.client.logger.trace({type:"method",method:"onSessionProposeResponse",peerPublicKey:c});const l=await this.client.core.crypto.generateSharedKey(a,c);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",sessionTopic:l});const h=await this.client.core.relayer.subscribe(l);this.client.logger.trace({type:"method",method:"onSessionProposeResponse",subscriptionId:h}),await this.client.core.pairing.activate({topic:e})}else g.isJsonRpcError(s)&&(await this.client.proposal.delete(t,i.getSdkError("USER_DISCONNECTED")),this.events.emit(i.engineEvent("session_connect"),{error:s.error}))},this.onSessionSettleRequest=async(e,s)=>{const{id:t,params:r}=s;try{this.isValidSessionSettleRequest(r);const{relay:o,controller:a,expiry:c,namespaces:l,requiredNamespaces:h,optionalNamespaces:u,sessionProperties:d,pairingTopic:S}=s.params,I=m({topic:e,relay:o,expiry:c,namespaces:l,acknowledged:!0,pairingTopic:S,requiredNamespaces:h,optionalNamespaces:u,controller:a.publicKey,self:{publicKey:"",metadata:this.client.metadata},peer:{publicKey:a.publicKey,metadata:a.metadata}},d&&{sessionProperties:d});await this.sendResult({id:s.id,topic:e,result:!0}),this.events.emit(i.engineEvent("session_connect"),{session:I}),this.cleanupDuplicatePairings(I)}catch(o){await this.sendError(t,e,o),this.client.logger.error(o)}},this.onSessionSettleResponse=async(e,s)=>{const{id:t}=s;g.isJsonRpcResult(s)?(await this.client.session.update(e,{acknowledged:!0}),this.events.emit(i.engineEvent("session_approve",t),{})):g.isJsonRpcError(s)&&(await this.client.session.delete(e,i.getSdkError("USER_DISCONNECTED")),this.events.emit(i.engineEvent("session_approve",t),{error:s.error}))},this.onSessionUpdateRequest=async(e,s)=>{const{params:t,id:r}=s;try{const o=`${e}_session_update`,a=i.MemoryStore.get(o);if(a&&this.isRequestOutOfSync(a,r)){this.client.logger.info(`Discarding out of sync request - ${r}`);return}this.isValidUpdate(m({topic:e},t)),await this.client.session.update(e,{namespaces:t.namespaces}),await this.sendResult({id:r,topic:e,result:!0}),this.client.events.emit("session_update",{id:r,topic:e,params:t}),i.MemoryStore.set(o,r)}catch(o){await this.sendError(r,e,o),this.client.logger.error(o)}},this.isRequestOutOfSync=(e,s)=>parseInt(s.toString().slice(0,-3))<=parseInt(e.toString().slice(0,-3)),this.onSessionUpdateResponse=(e,s)=>{const{id:t}=s;g.isJsonRpcResult(s)?this.events.emit(i.engineEvent("session_update",t),{}):g.isJsonRpcError(s)&&this.events.emit(i.engineEvent("session_update",t),{error:s.error})},this.onSessionExtendRequest=async(e,s)=>{const{id:t}=s;try{this.isValidExtend({topic:e}),await this.setExpiry(e,i.calcExpiry(v)),await this.sendResult({id:t,topic:e,result:!0}),this.client.events.emit("session_extend",{id:t,topic:e})}catch(r){await this.sendError(t,e,r),this.client.logger.error(r)}},this.onSessionExtendResponse=(e,s)=>{const{id:t}=s;g.isJsonRpcResult(s)?this.events.emit(i.engineEvent("session_extend",t),{}):g.isJsonRpcError(s)&&this.events.emit(i.engineEvent("session_extend",t),{error:s.error})},this.onSessionPingRequest=async(e,s)=>{const{id:t}=s;try{this.isValidPing({topic:e}),await this.sendResult({id:t,topic:e,result:!0}),this.client.events.emit("session_ping",{id:t,topic:e})}catch(r){await this.sendError(t,e,r),this.client.logger.error(r)}},this.onSessionPingResponse=(e,s)=>{const{id:t}=s;setTimeout(()=>{g.isJsonRpcResult(s)?this.events.emit(i.engineEvent("session_ping",t),{}):g.isJsonRpcError(s)&&this.events.emit(i.engineEvent("session_ping",t),{error:s.error})},500)},this.onSessionDeleteRequest=async(e,s)=>{const{id:t}=s;try{this.isValidDisconnect({topic:e,reason:s.params}),await Promise.all([new Promise(r=>{this.client.core.relayer.once(y.RELAYER_EVENTS.publish,async()=>{r(await this.deleteSession(e))})}),this.sendResult({id:t,topic:e,result:!0})]),this.client.events.emit("session_delete",{id:t,topic:e})}catch(r){this.client.logger.error(r)}},this.onSessionRequest=async(e,s)=>{const{id:t,params:r}=s;try{this.isValidRequest(m({topic:e},r));const o=i.hashMessage(JSON.stringify(g.formatJsonRpcRequest("wc_sessionRequest",r,t))),a=this.client.session.get(e),c=await this.getVerifyContext(o,a.peer.metadata),l={id:t,topic:e,params:r,verifyContext:c};await this.setPendingSessionRequest(l),this.addSessionRequestToSessionRequestQueue(l),this.processSessionRequestQueue()}catch(o){await this.sendError(t,e,o),this.client.logger.error(o)}},this.onSessionRequestResponse=(e,s)=>{const{id:t}=s;g.isJsonRpcResult(s)?this.events.emit(i.engineEvent("session_request",t),{result:s.result}):g.isJsonRpcError(s)&&this.events.emit(i.engineEvent("session_request",t),{error:s.error})},this.onSessionEventRequest=async(e,s)=>{const{id:t,params:r}=s;try{const o=`${e}_session_event_${r.event.name}`,a=i.MemoryStore.get(o);if(a&&this.isRequestOutOfSync(a,t)){this.client.logger.info(`Discarding out of sync request - ${t}`);return}this.isValidEmit(m({topic:e},r)),this.client.events.emit("session_event",{id:t,topic:e,params:r}),i.MemoryStore.set(o,t)}catch(o){await this.sendError(t,e,o),this.client.logger.error(o)}},this.addSessionRequestToSessionRequestQueue=e=>{this.sessionRequestQueue.queue.push(e)},this.cleanupAfterResponse=e=>{this.deletePendingSessionRequest(e.response.id,{message:"fulfilled",code:0}),setTimeout(()=>{this.sessionRequestQueue.state=_.idle,this.processSessionRequestQueue()},p.toMiliseconds(this.requestQueueDelay))},this.processSessionRequestQueue=()=>{if(this.sessionRequestQueue.state===_.active){this.client.logger.info("session request queue is already active.");return}const e=this.sessionRequestQueue.queue[0];if(!e){this.client.logger.info("session request queue is empty.");return}try{this.sessionRequestQueue.state=_.active,this.client.events.emit("session_request",e)}catch(s){this.client.logger.error(s)}},this.onPairingCreated=e=>{if(e.active)return;const s=this.client.proposal.getAll().find(t=>t.pairingTopic===e.topic);s&&this.onSessionProposeRequest(e.topic,g.formatJsonRpcRequest("wc_sessionPropose",{requiredNamespaces:s.requiredNamespaces,optionalNamespaces:s.optionalNamespaces,relays:s.relays,proposer:s.proposer},s.id))},this.isValidConnect=async e=>{if(!i.isValidParams(e)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`connect() params: ${JSON.stringify(e)}`);throw new Error(c)}const{pairingTopic:s,requiredNamespaces:t,optionalNamespaces:r,sessionProperties:o,relays:a}=e;if(i.isUndefined(s)||await this.isValidPairingTopic(s),!i.isValidRelays(a,!0)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`connect() relays: ${a}`);throw new Error(c)}!i.isUndefined(t)&&i.isValidObject(t)!==0&&this.validateNamespaces(t,"requiredNamespaces"),!i.isUndefined(r)&&i.isValidObject(r)!==0&&this.validateNamespaces(r,"optionalNamespaces"),i.isUndefined(o)||this.validateSessionProps(o,"sessionProperties")},this.validateNamespaces=(e,s)=>{const t=i.isValidRequiredNamespaces(e,"connect()",s);if(t)throw new Error(t.message)},this.isValidApprove=async e=>{if(!i.isValidParams(e))throw new Error(i.getInternalError("MISSING_OR_INVALID",`approve() params: ${e}`).message);const{id:s,namespaces:t,relayProtocol:r,sessionProperties:o}=e;await this.isValidProposalId(s);const a=this.client.proposal.get(s),c=i.isValidNamespaces(t,"approve()");if(c)throw new Error(c.message);const l=i.isConformingNamespaces(a.requiredNamespaces,t,"approve()");if(l)throw new Error(l.message);if(!i.isValidString(r,!0)){const{message:h}=i.getInternalError("MISSING_OR_INVALID",`approve() relayProtocol: ${r}`);throw new Error(h)}i.isUndefined(o)||this.validateSessionProps(o,"sessionProperties")},this.isValidReject=async e=>{if(!i.isValidParams(e)){const{message:r}=i.getInternalError("MISSING_OR_INVALID",`reject() params: ${e}`);throw new Error(r)}const{id:s,reason:t}=e;if(await this.isValidProposalId(s),!i.isValidErrorReason(t)){const{message:r}=i.getInternalError("MISSING_OR_INVALID",`reject() reason: ${JSON.stringify(t)}`);throw new Error(r)}},this.isValidSessionSettleRequest=e=>{if(!i.isValidParams(e)){const{message:l}=i.getInternalError("MISSING_OR_INVALID",`onSessionSettleRequest() params: ${e}`);throw new Error(l)}const{relay:s,controller:t,namespaces:r,expiry:o}=e;if(!i.isValidRelay(s)){const{message:l}=i.getInternalError("MISSING_OR_INVALID","onSessionSettleRequest() relay protocol should be a string");throw new Error(l)}const a=i.isValidController(t,"onSessionSettleRequest()");if(a)throw new Error(a.message);const c=i.isValidNamespaces(r,"onSessionSettleRequest()");if(c)throw new Error(c.message);if(i.isExpired(o)){const{message:l}=i.getInternalError("EXPIRED","onSessionSettleRequest()");throw new Error(l)}},this.isValidUpdate=async e=>{if(!i.isValidParams(e)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`update() params: ${e}`);throw new Error(c)}const{topic:s,namespaces:t}=e;await this.isValidSessionTopic(s);const r=this.client.session.get(s),o=i.isValidNamespaces(t,"update()");if(o)throw new Error(o.message);const a=i.isConformingNamespaces(r.requiredNamespaces,t,"update()");if(a)throw new Error(a.message)},this.isValidExtend=async e=>{if(!i.isValidParams(e)){const{message:t}=i.getInternalError("MISSING_OR_INVALID",`extend() params: ${e}`);throw new Error(t)}const{topic:s}=e;await this.isValidSessionTopic(s)},this.isValidRequest=async e=>{if(!i.isValidParams(e)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`request() params: ${e}`);throw new Error(c)}const{topic:s,request:t,chainId:r,expiry:o}=e;await this.isValidSessionTopic(s);const{namespaces:a}=this.client.session.get(s);if(!i.isValidNamespacesChainId(a,r)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`request() chainId: ${r}`);throw new Error(c)}if(!i.isValidRequest(t)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`request() ${JSON.stringify(t)}`);throw new Error(c)}if(!i.isValidNamespacesRequest(a,r,t.method)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`request() method: ${t.method}`);throw new Error(c)}if(o&&!i.isValidRequestExpiry(o,D)){const{message:c}=i.getInternalError("MISSING_OR_INVALID",`request() expiry: ${o}. Expiry must be a number (in seconds) between ${D.min} and ${D.max}`);throw new Error(c)}},this.isValidRespond=async e=>{if(!i.isValidParams(e)){const{message:r}=i.getInternalError("MISSING_OR_INVALID",`respond() params: ${e}`);throw new Error(r)}const{topic:s,response:t}=e;if(await this.isValidSessionTopic(s),!i.isValidResponse(t)){const{message:r}=i.getInternalError("MISSING_OR_INVALID",`respond() response: ${JSON.stringify(t)}`);throw new Error(r)}},this.isValidPing=async e=>{if(!i.isValidParams(e)){const{message:t}=i.getInternalError("MISSING_OR_INVALID",`ping() params: ${e}`);throw new Error(t)}const{topic:s}=e;await this.isValidSessionOrPairingTopic(s)},this.isValidEmit=async e=>{if(!i.isValidParams(e)){const{message:a}=i.getInternalError("MISSING_OR_INVALID",`emit() params: ${e}`);throw new Error(a)}const{topic:s,event:t,chainId:r}=e;await this.isValidSessionTopic(s);const{namespaces:o}=this.client.session.get(s);if(!i.isValidNamespacesChainId(o,r)){const{message:a}=i.getInternalError("MISSING_OR_INVALID",`emit() chainId: ${r}`);throw new Error(a)}if(!i.isValidEvent(t)){const{message:a}=i.getInternalError("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(t)}`);throw new Error(a)}if(!i.isValidNamespacesEvent(o,r,t.name)){const{message:a}=i.getInternalError("MISSING_OR_INVALID",`emit() event: ${JSON.stringify(t)}`);throw new Error(a)}},this.isValidDisconnect=async e=>{if(!i.isValidParams(e)){const{message:t}=i.getInternalError("MISSING_OR_INVALID",`disconnect() params: ${e}`);throw new Error(t)}const{topic:s}=e;await this.isValidSessionOrPairingTopic(s)},this.getVerifyContext=async(e,s)=>{const t={verified:{verifyUrl:s.verifyUrl||y.VERIFY_SERVER,validation:"UNKNOWN",origin:s.url||""}};try{const r=await this.client.core.verify.resolve({attestationId:e,verifyUrl:s.verifyUrl});r&&(t.verified.origin=r.origin,t.verified.isScam=r.isScam,t.verified.validation=r.origin===new URL(s.url).origin?"VALID":"INVALID")}catch(r){this.client.logger.info(r)}return this.client.logger.info(`Verify context: ${JSON.stringify(t)}`),t},this.validateSessionProps=(e,s)=>{Object.values(e).forEach(t=>{if(!i.isValidString(t,!1)){const{message:r}=i.getInternalError("MISSING_OR_INVALID",`${s} must be in Record<string, string> format. Received: ${JSON.stringify(t)}`);throw new Error(r)}})}}async isInitialized(){if(!this.initialized){const{message:n}=i.getInternalError("NOT_INITIALIZED",this.name);throw new Error(n)}await this.client.core.relayer.confirmOnlineStateOrThrow()}registerRelayerEvents(){this.client.core.relayer.on(y.RELAYER_EVENTS.message,async n=>{const{topic:e,message:s}=n;if(this.ignoredPayloadTypes.includes(this.client.core.crypto.getPayloadType(s)))return;const t=await this.client.core.crypto.decode(e,s);try{g.isJsonRpcRequest(t)?(this.client.core.history.set(e,t),this.onRelayEventRequest({topic:e,payload:t})):g.isJsonRpcResponse(t)?(await this.client.core.history.resolve(t),await this.onRelayEventResponse({topic:e,payload:t}),this.client.core.history.delete(e,t.id)):this.onRelayEventUnknownPayload({topic:e,payload:t})}catch(r){this.client.logger.error(r)}})}registerExpirerEvents(){this.client.core.expirer.on(y.EXPIRER_EVENTS.expired,async n=>{const{topic:e,id:s}=i.parseExpirerTarget(n.target);if(s&&this.client.pendingRequest.keys.includes(s))return await this.deletePendingSessionRequest(s,i.getInternalError("EXPIRED"),!0);e?this.client.session.keys.includes(e)&&(await this.deleteSession(e,!0),this.client.events.emit("session_expire",{topic:e})):s&&(await this.deleteProposal(s,!0),this.client.events.emit("proposal_expire",{id:s}))})}registerPairingEvents(){this.client.core.pairing.events.on(y.PAIRING_EVENTS.create,n=>this.onPairingCreated(n))}isValidPairingTopic(n){if(!i.isValidString(n,!1)){const{message:e}=i.getInternalError("MISSING_OR_INVALID",`pairing topic should be a string: ${n}`);throw new Error(e)}if(!this.client.core.pairing.pairings.keys.includes(n)){const{message:e}=i.getInternalError("NO_MATCHING_KEY",`pairing topic doesn't exist: ${n}`);throw new Error(e)}if(i.isExpired(this.client.core.pairing.pairings.get(n).expiry)){const{message:e}=i.getInternalError("EXPIRED",`pairing topic: ${n}`);throw new Error(e)}}async isValidSessionTopic(n){if(!i.isValidString(n,!1)){const{message:e}=i.getInternalError("MISSING_OR_INVALID",`session topic should be a string: ${n}`);throw new Error(e)}if(!this.client.session.keys.includes(n)){const{message:e}=i.getInternalError("NO_MATCHING_KEY",`session topic doesn't exist: ${n}`);throw new Error(e)}if(i.isExpired(this.client.session.get(n).expiry)){await this.deleteSession(n);const{message:e}=i.getInternalError("EXPIRED",`session topic: ${n}`);throw new Error(e)}}async isValidSessionOrPairingTopic(n){if(this.client.session.keys.includes(n))await this.isValidSessionTopic(n);else if(this.client.core.pairing.pairings.keys.includes(n))this.isValidPairingTopic(n);else if(i.isValidString(n,!1)){const{message:e}=i.getInternalError("NO_MATCHING_KEY",`session or pairing topic doesn't exist: ${n}`);throw new Error(e)}else{const{message:e}=i.getInternalError("MISSING_OR_INVALID",`session or pairing topic should be a string: ${n}`);throw new Error(e)}}async isValidProposalId(n){if(!i.isValidId(n)){const{message:e}=i.getInternalError("MISSING_OR_INVALID",`proposal id should be a number: ${n}`);throw new Error(e)}if(!this.client.proposal.keys.includes(n)){const{message:e}=i.getInternalError("NO_MATCHING_KEY",`proposal id doesn't exist: ${n}`);throw new Error(e)}if(i.isExpired(this.client.proposal.get(n).expiry)){await this.deleteProposal(n);const{message:e}=i.getInternalError("EXPIRED",`proposal id: ${n}`);throw new Error(e)}}}class pe extends y.Store{constructor(n,e){super(n,e,Y,T),this.core=n,this.logger=e}}class he extends y.Store{constructor(n,e){super(n,e,J,T),this.core=n,this.logger=e}}class de extends y.Store{constructor(n,e){super(n,e,K,T,s=>s.id),this.core=n,this.logger=e}}class x extends U.ISignClient{constructor(n){super(n),this.protocol=A,this.version=L,this.name=V.name,this.events=new $.EventEmitter,this.on=(s,t)=>this.events.on(s,t),this.once=(s,t)=>this.events.once(s,t),this.off=(s,t)=>this.events.off(s,t),this.removeListener=(s,t)=>this.events.removeListener(s,t),this.removeAllListeners=s=>this.events.removeAllListeners(s),this.connect=async s=>{try{return await this.engine.connect(s)}catch(t){throw this.logger.error(t.message),t}},this.pair=async s=>{try{return await this.engine.pair(s)}catch(t){throw this.logger.error(t.message),t}},this.approve=async s=>{try{return await this.engine.approve(s)}catch(t){throw this.logger.error(t.message),t}},this.reject=async s=>{try{return await this.engine.reject(s)}catch(t){throw this.logger.error(t.message),t}},this.update=async s=>{try{return await this.engine.update(s)}catch(t){throw this.logger.error(t.message),t}},this.extend=async s=>{try{return await this.engine.extend(s)}catch(t){throw this.logger.error(t.message),t}},this.request=async s=>{try{return await this.engine.request(s)}catch(t){throw this.logger.error(t.message),t}},this.respond=async s=>{try{return await this.engine.respond(s)}catch(t){throw this.logger.error(t.message),t}},this.ping=async s=>{try{return await this.engine.ping(s)}catch(t){throw this.logger.error(t.message),t}},this.emit=async s=>{try{return await this.engine.emit(s)}catch(t){throw this.logger.error(t.message),t}},this.disconnect=async s=>{try{return await this.engine.disconnect(s)}catch(t){throw this.logger.error(t.message),t}},this.find=s=>{try{return this.engine.find(s)}catch(t){throw this.logger.error(t.message),t}},this.getPendingSessionRequests=()=>{try{return this.engine.getPendingSessionRequests()}catch(s){throw this.logger.error(s.message),s}},this.name=n?.name||V.name,this.metadata=n?.metadata||i.getAppMetadata();const e=typeof n?.logger<"u"&&typeof n?.logger!="string"?n.logger:O.pino(O.getDefaultLoggerOptions({level:n?.logger||V.logger}));this.core=n?.core||new y.Core(n),this.logger=O.generateChildLogger(e,this.name),this.session=new he(this.core,this.logger),this.proposal=new pe(this.core,this.logger),this.pendingRequest=new de(this.core,this.logger),this.engine=new le(this)}static async init(n){const e=new x(n);return await e.initialize(),e}get context(){return O.getLoggerContext(this.logger)}get pairing(){return this.core.pairing.pairings}async initialize(){this.logger.trace("Initialized");try{await this.core.start(),await this.session.init(),await this.proposal.init(),await this.pendingRequest.init(),await this.engine.init(),this.core.verify.init({verifyUrl:this.metadata.verifyUrl}),this.logger.info("SignClient Initialization Success")}catch(n){throw this.logger.info("SignClient Initialization Failure"),this.logger.error(n.message),n}}}const ge=x;__webpack_unused_export__=k,__webpack_unused_export__=_,__webpack_unused_export__=N,__webpack_unused_export__=se,__webpack_unused_export__=ee,__webpack_unused_export__=te,__webpack_unused_export__=F,__webpack_unused_export__=Y,__webpack_unused_export__=ie,exports.lO=Q,__webpack_unused_export__=K,__webpack_unused_export__=J,__webpack_unused_export__=v,__webpack_unused_export__=D,__webpack_unused_export__=b,__webpack_unused_export__=V,__webpack_unused_export__=B,__webpack_unused_export__=A,__webpack_unused_export__=Z,__webpack_unused_export__=T,__webpack_unused_export__=L,__webpack_unused_export__=ge,__webpack_unused_export__=M,exports.ZP=x;
//# sourceMappingURL=index.cjs.js.map


/***/ }),

/***/ 49454:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:!0}));var r=__webpack_require__(57035),c=__webpack_require__(82361);function i(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var n=i(c);class l extends r.IEvents{constructor(s){super(),this.opts=s,this.protocol="wc",this.version=2}}class a{constructor(s,t,o){this.core=s,this.logger=t}}class u extends r.IEvents{constructor(s,t){super(),this.core=s,this.logger=t,this.records=new Map}}class I{constructor(s,t){this.logger=s,this.core=t}}class h extends r.IEvents{constructor(s,t){super(),this.relayer=s,this.logger=t}}class g extends r.IEvents{constructor(s){super()}}class p{constructor(s,t,o,P){this.core=s,this.logger=t,this.name=o}}class v{constructor(){this.map=new Map}}class E extends r.IEvents{constructor(s,t){super(),this.relayer=s,this.logger=t}}class d{constructor(s,t){this.core=s,this.logger=t}}class y extends r.IEvents{constructor(s,t){super(),this.core=s,this.logger=t}}class b{constructor(s,t){this.logger=s,this.core=t}}class f{constructor(s,t){this.projectId=s,this.logger=t}}class x extends n.default{constructor(){super()}}class C{constructor(s){this.opts=s,this.protocol="wc",this.version=2}}class S extends c.EventEmitter{constructor(){super()}}class M{constructor(s){this.client=s}}exports.ICore=l,exports.ICrypto=a,exports.IEngine=M,exports.IEngineEvents=S,exports.IExpirer=y,exports.IJsonRpcHistory=u,exports.IKeyChain=d,exports.IMessageTracker=I,exports.IPairing=b,exports.IPublisher=h,exports.IRelayer=g,exports.ISignClient=C,exports.ISignClientEvents=x,exports.IStore=p,exports.ISubscriber=E,exports.ISubscriberTopicMap=v,exports.IVerify=f;
//# sourceMappingURL=index.cjs.js.map


/***/ }),

/***/ 34338:
/***/ ((module) => {

"use strict";


/* global SharedArrayBuffer, Atomics */

if (typeof SharedArrayBuffer !== 'undefined' && typeof Atomics !== 'undefined') {
  const nil = new Int32Array(new SharedArrayBuffer(4))

  function sleep (ms) {
    // also filters out NaN, non-number types, including empty strings, but allows bigints
    const valid = ms > 0 && ms < Infinity 
    if (valid === false) {
      if (typeof ms !== 'number' && typeof ms !== 'bigint') {
        throw TypeError('sleep: ms must be a number')
      }
      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')
    }

    Atomics.wait(nil, 0, 0, Number(ms))
  }
  module.exports = sleep
} else {

  function sleep (ms) {
    // also filters out NaN, non-number types, including empty strings, but allows bigints
    const valid = ms > 0 && ms < Infinity 
    if (valid === false) {
      if (typeof ms !== 'number' && typeof ms !== 'bigint') {
        throw TypeError('sleep: ms must be a number')
      }
      throw RangeError('sleep: ms must be a number that is greater than 0 but less than Infinity')
    }
    const target = Date.now() + Number(ms)
    while (target > Date.now()){}
  }

  module.exports = sleep

}


/***/ }),

/***/ 37994:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const validator = __webpack_require__(92854)
const parse = __webpack_require__(60429)
const redactor = __webpack_require__(67456)
const restorer = __webpack_require__(33612)
const { groupRedact, nestedRedact } = __webpack_require__(95964)
const state = __webpack_require__(10316)
const rx = __webpack_require__(55619)
const validate = validator()
const noop = (o) => o
noop.restore = noop

const DEFAULT_CENSOR = '[REDACTED]'
fastRedact.rx = rx
fastRedact.validator = validator

module.exports = fastRedact

function fastRedact (opts = {}) {
  const paths = Array.from(new Set(opts.paths || []))
  const serialize = 'serialize' in opts ? (
    opts.serialize === false ? opts.serialize
      : (typeof opts.serialize === 'function' ? opts.serialize : JSON.stringify)
  ) : JSON.stringify
  const remove = opts.remove
  if (remove === true && serialize !== JSON.stringify) {
    throw Error('fast-redact – remove option may only be set when serializer is JSON.stringify')
  }
  const censor = remove === true
    ? undefined
    : 'censor' in opts ? opts.censor : DEFAULT_CENSOR

  const isCensorFct = typeof censor === 'function'
  const censorFctTakesPath = isCensorFct && censor.length > 1

  if (paths.length === 0) return serialize || noop

  validate({ paths, serialize, censor })

  const { wildcards, wcLen, secret } = parse({ paths, censor })

  const compileRestore = restorer({ secret, wcLen })
  const strict = 'strict' in opts ? opts.strict : true

  return redactor({ secret, wcLen, serialize, strict, isCensorFct, censorFctTakesPath }, state({
    secret,
    censor,
    compileRestore,
    serialize,
    groupRedact,
    nestedRedact,
    wildcards,
    wcLen
  }))
}


/***/ }),

/***/ 95964:
/***/ ((module) => {

"use strict";


module.exports = {
  groupRedact,
  groupRestore,
  nestedRedact,
  nestedRestore
}

function groupRestore ({ keys, values, target }) {
  if (target == null) return
  const length = keys.length
  for (var i = 0; i < length; i++) {
    const k = keys[i]
    target[k] = values[i]
  }
}

function groupRedact (o, path, censor, isCensorFct, censorFctTakesPath) {
  const target = get(o, path)
  if (target == null) return { keys: null, values: null, target: null, flat: true }
  const keys = Object.keys(target)
  const keysLength = keys.length
  const pathLength = path.length
  const pathWithKey = censorFctTakesPath ? [...path] : undefined
  const values = new Array(keysLength)

  for (var i = 0; i < keysLength; i++) {
    const key = keys[i]
    values[i] = target[key]

    if (censorFctTakesPath) {
      pathWithKey[pathLength] = key
      target[key] = censor(target[key], pathWithKey)
    } else if (isCensorFct) {
      target[key] = censor(target[key])
    } else {
      target[key] = censor
    }
  }
  return { keys, values, target, flat: true }
}

/**
 * @param {RestoreInstruction[]} instructions a set of instructions for restoring values to objects
 */
function nestedRestore (instructions) {
  for (let i = 0; i < instructions.length; i++) {
    const { target, path, value } = instructions[i]
    let current = target
    for (let i = path.length - 1; i > 0; i--) {
      current = current[path[i]]
    }
    current[path[0]] = value
  }
}

function nestedRedact (store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
  const target = get(o, path)
  if (target == null) return
  const keys = Object.keys(target)
  const keysLength = keys.length
  for (var i = 0; i < keysLength; i++) {
    const key = keys[i]
    specialSet(store, target, key, path, ns, censor, isCensorFct, censorFctTakesPath)
  }
  return store
}

function has (obj, prop) {
  return obj !== undefined && obj !== null
    ? ('hasOwn' in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop))
    : false
}

function specialSet (store, o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
  const afterPathLen = afterPath.length
  const lastPathIndex = afterPathLen - 1
  const originalKey = k
  var i = -1
  var n
  var nv
  var ov
  var oov = null
  var wc = null
  var kIsWc
  var wcov
  var consecutive = false
  var level = 0
  // need to track depth of the `redactPath` tree
  var depth = 0
  var redactPathCurrent = tree()
  ov = n = o[k]
  if (typeof n !== 'object') return
  while (n != null && ++i < afterPathLen) {
    depth += 1
    k = afterPath[i]
    oov = ov
    if (k !== '*' && !wc && !(typeof n === 'object' && k in n)) {
      break
    }
    if (k === '*') {
      if (wc === '*') {
        consecutive = true
      }
      wc = k
      if (i !== lastPathIndex) {
        continue
      }
    }
    if (wc) {
      const wcKeys = Object.keys(n)
      for (var j = 0; j < wcKeys.length; j++) {
        const wck = wcKeys[j]
        wcov = n[wck]
        kIsWc = k === '*'
        if (consecutive) {
          redactPathCurrent = node(redactPathCurrent, wck, depth)
          level = i
          ov = iterateNthLevel(wcov, level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1)
        } else {
          if (kIsWc || (typeof wcov === 'object' && wcov !== null && k in wcov)) {
            if (kIsWc) {
              ov = wcov
            } else {
              ov = wcov[k]
            }
            nv = (i !== lastPathIndex)
              ? ov
              : (isCensorFct
                ? (censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov))
                : censor)
            if (kIsWc) {
              const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey])
              store.push(rv)
              n[wck] = nv
            } else {
              if (wcov[k] === nv) {
                // pass
              } else if ((nv === undefined && censor !== undefined) || (has(wcov, k) && nv === ov)) {
                redactPathCurrent = node(redactPathCurrent, wck, depth)
              } else {
                redactPathCurrent = node(redactPathCurrent, wck, depth)
                const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey])
                store.push(rv)
                wcov[k] = nv
              }
            }
          }
        }
      }
      wc = null
    } else {
      ov = n[k]
      redactPathCurrent = node(redactPathCurrent, k, depth)
      nv = (i !== lastPathIndex)
        ? ov
        : (isCensorFct
          ? (censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov))
          : censor)
      if ((has(n, k) && nv === ov) || (nv === undefined && censor !== undefined)) {
        // pass
      } else {
        const rv = restoreInstr(redactPathCurrent, ov, o[originalKey])
        store.push(rv)
        n[k] = nv
      }
      n = n[k]
    }
    if (typeof n !== 'object') break
    // prevent circular structure, see https://github.com/pinojs/pino/issues/1513
    if (ov === oov || typeof ov === 'undefined') {
      // pass
    }
  }
}

function get (o, p) {
  var i = -1
  var l = p.length
  var n = o
  while (n != null && ++i < l) {
    n = n[p[i]]
  }
  return n
}

function iterateNthLevel (wcov, level, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
  if (level === 0) {
    if (kIsWc || (typeof wcov === 'object' && wcov !== null && k in wcov)) {
      if (kIsWc) {
        ov = wcov
      } else {
        ov = wcov[k]
      }
      nv = (i !== lastPathIndex)
        ? ov
        : (isCensorFct
          ? (censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov))
          : censor)
      if (kIsWc) {
        const rv = restoreInstr(redactPathCurrent, ov, parent)
        store.push(rv)
        n[wck] = nv
      } else {
        if (wcov[k] === nv) {
          // pass
        } else if ((nv === undefined && censor !== undefined) || (has(wcov, k) && nv === ov)) {
          // pass
        } else {
          const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent)
          store.push(rv)
          wcov[k] = nv
        }
      }
    }
  }
  for (const key in wcov) {
    if (typeof wcov[key] === 'object') {
      redactPathCurrent = node(redactPathCurrent, key, depth)
      iterateNthLevel(wcov[key], level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1)
    }
  }
}

/**
 * @typedef {object} TreeNode
 * @prop {TreeNode} [parent] reference to the parent of this node in the tree, or `null` if there is no parent
 * @prop {string} key the key that this node represents (key here being part of the path being redacted
 * @prop {TreeNode[]} children the child nodes of this node
 * @prop {number} depth the depth of this node in the tree
 */

/**
 * instantiate a new, empty tree
 * @returns {TreeNode}
 */
function tree () {
  return { parent: null, key: null, children: [], depth: 0 }
}

/**
 * creates a new node in the tree, attaching it as a child of the provided parent node
 * if the specified depth matches the parent depth, adds the new node as a _sibling_ of the parent instead
  * @param {TreeNode} parent the parent node to add a new node to (if the parent depth matches the provided `depth` value, will instead add as a sibling of this
  * @param {string} key the key that the new node represents (key here being part of the path being redacted)
  * @param {number} depth the depth of the new node in the tree - used to determing whether to add the new node as a child or sibling of the provided `parent` node
  * @returns {TreeNode} a reference to the newly created node in the tree
 */
function node (parent, key, depth) {
  if (parent.depth === depth) {
    return node(parent.parent, key, depth)
  }

  var child = {
    parent,
    key,
    depth,
    children: []
  }

  parent.children.push(child)

  return child
}

/**
 * @typedef {object} RestoreInstruction
 * @prop {string[]} path a reverse-order path that can be used to find the correct insertion point to restore a `value` for the given `parent` object
 * @prop {*} value the value to restore
 * @prop {object} target the object to restore the `value` in
 */

/**
 * create a restore instruction for the given redactPath node
 * generates a path in reverse order by walking up the redactPath tree
 * @param {TreeNode} node a tree node that should be at the bottom of the redact path (i.e. have no children) - this will be used to walk up the redact path tree to construct the path needed to restore
 * @param {*} value the value to restore
 * @param {object} target a reference to the parent object to apply the restore instruction to
 * @returns {RestoreInstruction} an instruction used to restore a nested value for a specific object
 */
function restoreInstr (node, value, target) {
  let current = node
  const path = []
  do {
    path.push(current.key)
    current = current.parent
  } while (current.parent != null)

  return { path, value, target }
}


/***/ }),

/***/ 60429:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const rx = __webpack_require__(55619)

module.exports = parse

function parse ({ paths }) {
  const wildcards = []
  var wcLen = 0
  const secret = paths.reduce(function (o, strPath, ix) {
    var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ''))
    const leadingBracket = strPath[0] === '['
    path = path.map((p) => {
      if (p[0] === '[') return p.substr(1, p.length - 2)
      else return p
    })
    const star = path.indexOf('*')
    if (star > -1) {
      const before = path.slice(0, star)
      const beforeStr = before.join('.')
      const after = path.slice(star + 1, path.length)
      const nested = after.length > 0
      wcLen++
      wildcards.push({
        before,
        beforeStr,
        after,
        nested
      })
    } else {
      o[strPath] = {
        path: path,
        val: undefined,
        precensored: false,
        circle: '',
        escPath: JSON.stringify(strPath),
        leadingBracket: leadingBracket
      }
    }
    return o
  }, {})

  return { wildcards, wcLen, secret }
}


/***/ }),

/***/ 67456:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const rx = __webpack_require__(55619)

module.exports = redactor

function redactor ({ secret, serialize, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
  /* eslint-disable-next-line */
  const redact = Function('o', `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize)}
    }
    const { censor, secret } = this
    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    ${resultTmpl(serialize)}
  `).bind(state)

  if (serialize === false) {
    redact.restore = (o) => state.restore(o)
  }

  return redact
}

function redactTmpl (secret, isCensorFct, censorFctTakesPath) {
  return Object.keys(secret).map((path) => {
    const { escPath, leadingBracket, path: arrPath } = secret[path]
    const skip = leadingBracket ? 1 : 0
    const delim = leadingBracket ? '' : '.'
    const hops = []
    var match
    while ((match = rx.exec(path)) !== null) {
      const [ , ix ] = match
      const { index, input } = match
      if (index > skip) hops.push(input.substring(0, index - (ix ? 0 : 1)))
    }
    var existence = hops.map((p) => `o${delim}${p}`).join(' && ')
    if (existence.length === 0) existence += `o${delim}${path} != null`
    else existence += ` && o${delim}${path} != null`

    const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join('\n')}
      }
    `

    const censorArgs = censorFctTakesPath
      ? `val, ${JSON.stringify(arrPath)}`
      : `val`

    return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : 'censor'}
          ${circularDetection}
        }
      }
    `
  }).join('\n')
}

function dynamicRedactTmpl (hasWildcards, isCensorFct, censorFctTakesPath) {
  return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : ''
}

function resultTmpl (serialize) {
  return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `
}

function strictImpl (strict, serialize) {
  return strict === true
    ? `throw Error('fast-redact: primitives cannot be redacted')`
    : serialize === false ? `return o` : `return this.serialize(o)`
}


/***/ }),

/***/ 33612:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { groupRestore, nestedRestore } = __webpack_require__(95964)

module.exports = restorer

function restorer ({ secret, wcLen }) {
  return function compileRestore () {
    if (this.restore) return
    const paths = Object.keys(secret)
    const resetters = resetTmpl(secret, paths)
    const hasWildcards = wcLen > 0
    const state = hasWildcards ? { secret, groupRestore, nestedRestore } : { secret }
    /* eslint-disable-next-line */
    this.restore = Function(
      'o',
      restoreTmpl(resetters, paths, hasWildcards)
    ).bind(state)
  }
}

/**
 * Mutates the original object to be censored by restoring its original values
 * prior to censoring.
 *
 * @param {object} secret Compiled object describing which target fields should
 * be censored and the field states.
 * @param {string[]} paths The list of paths to censor as provided at
 * initialization time.
 *
 * @returns {string} String of JavaScript to be used by `Function()`. The
 * string compiles to the function that does the work in the description.
 */
function resetTmpl (secret, paths) {
  return paths.map((path) => {
    const { circle, escPath, leadingBracket } = secret[path]
    const delim = leadingBracket ? '' : '.'
    const reset = circle
      ? `o.${circle} = secret[${escPath}].val`
      : `o${delim}${path} = secret[${escPath}].val`
    const clear = `secret[${escPath}].val = undefined`
    return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear}
      }
    `
  }).join('')
}

/**
 * Creates the body of the restore function
 *
 * Restoration of the redacted object happens
 * backwards, in reverse order of redactions,
 * so that repeated redactions on the same object
 * property can be eventually rolled back to the
 * original value.
 *
 * This way dynamic redactions are restored first,
 * starting from the last one working backwards and
 * followed by the static ones.
 *
 * @returns {string} the body of the restore function
 */
function restoreTmpl (resetters, paths, hasWildcards) {
  const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o.flat === true) this.groupRestore(o)
      else this.nestedRestore(o)
      secret[k] = null
    }
  ` : ''

  return `
    const secret = this.secret
    ${dynamicReset}
    ${resetters}
    return o
  `
}


/***/ }),

/***/ 55619:
/***/ ((module) => {

"use strict";


module.exports = /[^.[\]]+|\[((?:.)*?)\]/g

/*
Regular expression explanation:

Alt 1: /[^.[\]]+/ - Match one or more characters that are *not* a dot (.)
                    opening square bracket ([) or closing square bracket (])

Alt 2: /\[((?:.)*?)\]/ - If the char IS dot or square bracket, then create a capture
                         group (which will be capture group $1) that matches anything
                         within square brackets. Expansion is lazy so it will
                         stop matching as soon as the first closing bracket is met `]`
                         (rather than continuing to match until the final closing bracket).
*/


/***/ }),

/***/ 10316:
/***/ ((module) => {

"use strict";


module.exports = state

function state (o) {
  const {
    secret,
    censor,
    compileRestore,
    serialize,
    groupRedact,
    nestedRedact,
    wildcards,
    wcLen
  } = o
  const builder = [{ secret, censor, compileRestore }]
  if (serialize !== false) builder.push({ serialize })
  if (wcLen > 0) builder.push({ groupRedact, nestedRedact, wildcards, wcLen })
  return Object.assign(...builder)
}


/***/ }),

/***/ 92854:
/***/ ((module) => {

"use strict";


module.exports = validator

function validator (opts = {}) {
  const {
    ERR_PATHS_MUST_BE_STRINGS = () => 'fast-redact - Paths must be (non-empty) strings',
    ERR_INVALID_PATH = (s) => `fast-redact – Invalid path (${s})`
  } = opts

  return function validate ({ paths }) {
    paths.forEach((s) => {
      if (typeof s !== 'string') {
        throw Error(ERR_PATHS_MUST_BE_STRINGS())
      }
      try {
        if (/〇/.test(s)) throw Error()
        const expr = (s[0] === '[' ? '' : '.') + s.replace(/^\*/, '〇').replace(/\.\*/g, '.〇').replace(/\[\*\]/g, '[〇]')
        if (/\n|\r|;/.test(expr)) throw Error()
        if (/\/\*/.test(expr)) throw Error()
        /* eslint-disable-next-line */
        Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const 〇 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)()
      } catch (e) {
        throw Error(ERR_INVALID_PATH(s))
      }
    })
  }
}


/***/ }),

/***/ 510:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;


/***/ }),

/***/ 22858:
/***/ ((module) => {

"use strict";


function genWrap (wraps, ref, fn, event) {
  function wrap () {
    const obj = ref.deref()
    // This should alway happen, however GC is
    // undeterministic so it might happen.
    /* istanbul ignore else */
    if (obj !== undefined) {
      fn(obj, event)
    }
  }

  wraps[event] = wrap
  process.once(event, wrap)
}

const registry = new FinalizationRegistry(clear)
const map = new WeakMap()

function clear (wraps) {
  process.removeListener('exit', wraps.exit)
  process.removeListener('beforeExit', wraps.beforeExit)
}

function register (obj, fn) {
  if (obj === undefined) {
    throw new Error('the object can\'t be undefined')
  }
  const ref = new WeakRef(obj)

  const wraps = {}
  map.set(obj, wraps)
  registry.register(obj, wraps)

  genWrap(wraps, ref, fn, 'exit')
  genWrap(wraps, ref, fn, 'beforeExit')
}

function unregister (obj) {
  const wraps = map.get(obj)
  map.delete(obj)
  if (wraps) {
    clear(wraps)
  }
  registry.unregister(obj)
}

module.exports = {
  register,
  unregister
}


/***/ }),

/***/ 95495:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { format } = __webpack_require__(73837)

function build () {
  const codes = {}
  const emitted = new Map()

  function create (name, code, message) {
    if (!name) throw new Error('Warning name must not be empty')
    if (!code) throw new Error('Warning code must not be empty')
    if (!message) throw new Error('Warning message must not be empty')

    code = code.toUpperCase()

    if (codes[code] !== undefined) {
      throw new Error(`The code '${code}' already exist`)
    }

    function buildWarnOpts (a, b, c) {
      // more performant than spread (...) operator
      let formatted
      if (a && b && c) {
        formatted = format(message, a, b, c)
      } else if (a && b) {
        formatted = format(message, a, b)
      } else if (a) {
        formatted = format(message, a)
      } else {
        formatted = message
      }

      return {
        code,
        name,
        message: formatted
      }
    }

    emitted.set(code, false)
    codes[code] = buildWarnOpts

    return codes[code]
  }

  function emit (code, a, b, c) {
    if (codes[code] === undefined) throw new Error(`The code '${code}' does not exist`)
    if (emitted.get(code) === true) return
    emitted.set(code, true)

    const warning = codes[code](a, b, c)
    process.emitWarning(warning.message, warning.name, warning.code)
  }

  return {
    create,
    emit,
    emitted
  }
}

module.exports = build


/***/ }),

/***/ 24773:
/***/ ((module) => {

"use strict";

function tryStringify (o) {
  try { return JSON.stringify(o) } catch(e) { return '"[Circular]"' }
}

module.exports = format

function format(f, args, opts) {
  var ss = (opts && opts.stringify) || tryStringify
  var offset = 1
  if (typeof f === 'object' && f !== null) {
    var len = args.length + offset
    if (len === 1) return f
    var objects = new Array(len)
    objects[0] = ss(f)
    for (var index = 1; index < len; index++) {
      objects[index] = ss(args[index])
    }
    return objects.join(' ')
  }
  if (typeof f !== 'string') {
    return f
  }
  var argLen = args.length
  if (argLen === 0) return f
  var str = ''
  var a = 1 - offset
  var lastPos = -1
  var flen = (f && f.length) || 0
  for (var i = 0; i < flen;) {
    if (f.charCodeAt(i) === 37 && i + 1 < flen) {
      lastPos = lastPos > -1 ? lastPos : 0
      switch (f.charCodeAt(i + 1)) {
        case 100: // 'd'
        case 102: // 'f'
          if (a >= argLen)
            break
          if (args[a] == null)  break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Number(args[a])
          lastPos = i + 2
          i++
          break
        case 105: // 'i'
          if (a >= argLen)
            break
          if (args[a] == null)  break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += Math.floor(Number(args[a]))
          lastPos = i + 2
          i++
          break
        case 79: // 'O'
        case 111: // 'o'
        case 106: // 'j'
          if (a >= argLen)
            break
          if (args[a] === undefined) break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          var type = typeof args[a]
          if (type === 'string') {
            str += '\'' + args[a] + '\''
            lastPos = i + 2
            i++
            break
          }
          if (type === 'function') {
            str += args[a].name || '<anonymous>'
            lastPos = i + 2
            i++
            break
          }
          str += ss(args[a])
          lastPos = i + 2
          i++
          break
        case 115: // 's'
          if (a >= argLen)
            break
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += String(args[a])
          lastPos = i + 2
          i++
          break
        case 37: // '%'
          if (lastPos < i)
            str += f.slice(lastPos, i)
          str += '%'
          lastPos = i + 2
          i++
          a--
          break
      }
      ++a
    }
    ++i
  }
  if (lastPos === -1)
    return f
  else if (lastPos < flen) {
    str += f.slice(lastPos)
  }

  return str
}


/***/ }),

/***/ 38317:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function safeJsonParse(value) {
    if (typeof value !== 'string') {
        throw new Error(`Cannot safe json parse value of type ${typeof value}`);
    }
    try {
        return JSON.parse(value);
    }
    catch (_a) {
        return value;
    }
}
exports.safeJsonParse = safeJsonParse;
function safeJsonStringify(value) {
    return typeof value === 'string'
        ? value
        : JSON.stringify(value, (key, value) => typeof value === 'undefined' ? null : value);
}
exports.safeJsonStringify = safeJsonStringify;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 66354:
/***/ ((module, exports) => {

"use strict";


const { hasOwnProperty } = Object.prototype

const stringify = configure()

// @ts-expect-error
stringify.configure = configure
// @ts-expect-error
stringify.stringify = stringify

// @ts-expect-error
stringify.default = stringify

// @ts-expect-error used for named export
exports.stringify = stringify
// @ts-expect-error used for named export
exports.configure = configure

module.exports = stringify

// eslint-disable-next-line no-control-regex
const strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]|[\ud800-\udbff](?![\udc00-\udfff])|(?:[^\ud800-\udbff]|^)[\udc00-\udfff]/

// Escape C0 control characters, double quotes, the backslash and every code
// unit with a numeric value in the inclusive range 0xD800 to 0xDFFF.
function strEscape (str) {
  // Some magic numbers that worked out fine while benchmarking with v8 8.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
    return `"${str}"`
  }
  return JSON.stringify(str)
}

function insertSort (array) {
  // Insertion sort is very efficient for small input sizes but it has a bad
  // worst case complexity. Thus, use native array sort for bigger values.
  if (array.length > 2e2) {
    return array.sort()
  }
  for (let i = 1; i < array.length; i++) {
    const currentValue = array[i]
    let position = i
    while (position !== 0 && array[position - 1] > currentValue) {
      array[position] = array[position - 1]
      position--
    }
    array[position] = currentValue
  }
  return array
}

const typedArrayPrototypeGetSymbolToStringTag =
  Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(
      Object.getPrototypeOf(
        new Int8Array()
      )
    ),
    Symbol.toStringTag
  ).get

function isTypedArrayWithEntries (value) {
  return typedArrayPrototypeGetSymbolToStringTag.call(value) !== undefined && value.length !== 0
}

function stringifyTypedArray (array, separator, maximumBreadth) {
  if (array.length < maximumBreadth) {
    maximumBreadth = array.length
  }
  const whitespace = separator === ',' ? '' : ' '
  let res = `"0":${whitespace}${array[0]}`
  for (let i = 1; i < maximumBreadth; i++) {
    res += `${separator}"${i}":${whitespace}${array[i]}`
  }
  return res
}

function getCircularValueOption (options) {
  if (hasOwnProperty.call(options, 'circularValue')) {
    const circularValue = options.circularValue
    if (typeof circularValue === 'string') {
      return `"${circularValue}"`
    }
    if (circularValue == null) {
      return circularValue
    }
    if (circularValue === Error || circularValue === TypeError) {
      return {
        toString () {
          throw new TypeError('Converting circular structure to JSON')
        }
      }
    }
    throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined')
  }
  return '"[Circular]"'
}

function getBooleanOption (options, key) {
  let value
  if (hasOwnProperty.call(options, key)) {
    value = options[key]
    if (typeof value !== 'boolean') {
      throw new TypeError(`The "${key}" argument must be of type boolean`)
    }
  }
  return value === undefined ? true : value
}

function getPositiveIntegerOption (options, key) {
  let value
  if (hasOwnProperty.call(options, key)) {
    value = options[key]
    if (typeof value !== 'number') {
      throw new TypeError(`The "${key}" argument must be of type number`)
    }
    if (!Number.isInteger(value)) {
      throw new TypeError(`The "${key}" argument must be an integer`)
    }
    if (value < 1) {
      throw new RangeError(`The "${key}" argument must be >= 1`)
    }
  }
  return value === undefined ? Infinity : value
}

function getItemCount (number) {
  if (number === 1) {
    return '1 item'
  }
  return `${number} items`
}

function getUniqueReplacerSet (replacerArray) {
  const replacerSet = new Set()
  for (const value of replacerArray) {
    if (typeof value === 'string' || typeof value === 'number') {
      replacerSet.add(String(value))
    }
  }
  return replacerSet
}

function getStrictOption (options) {
  if (hasOwnProperty.call(options, 'strict')) {
    const value = options.strict
    if (typeof value !== 'boolean') {
      throw new TypeError('The "strict" argument must be of type boolean')
    }
    if (value) {
      return (value) => {
        let message = `Object can not safely be stringified. Received type ${typeof value}`
        if (typeof value !== 'function') message += ` (${value.toString()})`
        throw new Error(message)
      }
    }
  }
}

function configure (options) {
  options = { ...options }
  const fail = getStrictOption(options)
  if (fail) {
    if (options.bigint === undefined) {
      options.bigint = false
    }
    if (!('circularValue' in options)) {
      options.circularValue = Error
    }
  }
  const circularValue = getCircularValueOption(options)
  const bigint = getBooleanOption(options, 'bigint')
  const deterministic = getBooleanOption(options, 'deterministic')
  const maximumDepth = getPositiveIntegerOption(options, 'maximumDepth')
  const maximumBreadth = getPositiveIntegerOption(options, 'maximumBreadth')

  function stringifyFnReplacer (key, parent, stack, replacer, spacer, indentation) {
    let value = parent[key]

    if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }
    value = replacer.call(parent, key, value)

    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        let res = ''
        let join = ','
        const originalIndentation = indentation

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          if (spacer !== '') {
            indentation += spacer
            res += `\n${indentation}`
            join = `,\n${indentation}`
          }
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          if (spacer !== '') {
            res += `\n${originalIndentation}`
          }
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        let whitespace = ''
        let separator = ''
        if (spacer !== '') {
          indentation += spacer
          join = `,\n${indentation}`
          whitespace = ' '
        }
        const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (deterministic && !isTypedArrayWithEntries(value)) {
          keys = insertSort(keys)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifyFnReplacer(key, value, stack, replacer, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}:${whitespace}${tmp}`
            separator = join
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`
          separator = join
        }
        if (spacer !== '' && separator.length > 1) {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifyArrayReplacer (key, value, stack, replacer, spacer, indentation) {
    if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
      value = value.toJSON(key)
    }

    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        const originalIndentation = indentation
        let res = ''
        let join = ','

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          if (spacer !== '') {
            indentation += spacer
            res += `\n${indentation}`
            join = `,\n${indentation}`
          }
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          if (spacer !== '') {
            res += `\n${originalIndentation}`
          }
          stack.pop()
          return `[${res}]`
        }
        stack.push(value)
        let whitespace = ''
        if (spacer !== '') {
          indentation += spacer
          join = `,\n${indentation}`
          whitespace = ' '
        }
        let separator = ''
        for (const key of replacer) {
          const tmp = stringifyArrayReplacer(key, value[key], stack, replacer, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}:${whitespace}${tmp}`
            separator = join
          }
        }
        if (spacer !== '' && separator.length > 1) {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifyIndent (key, value, stack, spacer, indentation) {
    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (typeof value.toJSON === 'function') {
          value = value.toJSON(key)
          // Prevent calling `toJSON` again.
          if (typeof value !== 'object') {
            return stringifyIndent(key, value, stack, spacer, indentation)
          }
          if (value === null) {
            return 'null'
          }
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }
        const originalIndentation = indentation

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          indentation += spacer
          let res = `\n${indentation}`
          const join = `,\n${indentation}`
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation)
            res += tmp !== undefined ? tmp : 'null'
            res += join
          }
          const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
          }
          res += `\n${originalIndentation}`
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        indentation += spacer
        const join = `,\n${indentation}`
        let res = ''
        let separator = ''
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, join, maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = join
        }
        if (deterministic) {
          keys = insertSort(keys)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifyIndent(key, value[key], stack, spacer, indentation)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}: ${tmp}`
            separator = join
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`
          separator = join
        }
        if (separator !== '') {
          res = `\n${indentation}${res}\n${originalIndentation}`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringifySimple (key, value, stack) {
    switch (typeof value) {
      case 'string':
        return strEscape(value)
      case 'object': {
        if (value === null) {
          return 'null'
        }
        if (typeof value.toJSON === 'function') {
          value = value.toJSON(key)
          // Prevent calling `toJSON` again
          if (typeof value !== 'object') {
            return stringifySimple(key, value, stack)
          }
          if (value === null) {
            return 'null'
          }
        }
        if (stack.indexOf(value) !== -1) {
          return circularValue
        }

        let res = ''

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return '[]'
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Array]"'
          }
          stack.push(value)
          const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
          let i = 0
          for (; i < maximumValuesToStringify - 1; i++) {
            const tmp = stringifySimple(String(i), value[i], stack)
            res += tmp !== undefined ? tmp : 'null'
            res += ','
          }
          const tmp = stringifySimple(String(i), value[i], stack)
          res += tmp !== undefined ? tmp : 'null'
          if (value.length - 1 > maximumBreadth) {
            const removedKeys = value.length - maximumBreadth - 1
            res += `,"... ${getItemCount(removedKeys)} not stringified"`
          }
          stack.pop()
          return `[${res}]`
        }

        let keys = Object.keys(value)
        const keyLength = keys.length
        if (keyLength === 0) {
          return '{}'
        }
        if (maximumDepth < stack.length + 1) {
          return '"[Object]"'
        }
        let separator = ''
        let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
        if (isTypedArrayWithEntries(value)) {
          res += stringifyTypedArray(value, ',', maximumBreadth)
          keys = keys.slice(value.length)
          maximumPropertiesToStringify -= value.length
          separator = ','
        }
        if (deterministic) {
          keys = insertSort(keys)
        }
        stack.push(value)
        for (let i = 0; i < maximumPropertiesToStringify; i++) {
          const key = keys[i]
          const tmp = stringifySimple(key, value[key], stack)
          if (tmp !== undefined) {
            res += `${separator}${strEscape(key)}:${tmp}`
            separator = ','
          }
        }
        if (keyLength > maximumBreadth) {
          const removedKeys = keyLength - maximumBreadth
          res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`
        }
        stack.pop()
        return `{${res}}`
      }
      case 'number':
        return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
      case 'boolean':
        return value === true ? 'true' : 'false'
      case 'undefined':
        return undefined
      case 'bigint':
        if (bigint) {
          return String(value)
        }
        // fallthrough
      default:
        return fail ? fail(value) : undefined
    }
  }

  function stringify (value, replacer, space) {
    if (arguments.length > 1) {
      let spacer = ''
      if (typeof space === 'number') {
        spacer = ' '.repeat(Math.min(space, 10))
      } else if (typeof space === 'string') {
        spacer = space.slice(0, 10)
      }
      if (replacer != null) {
        if (typeof replacer === 'function') {
          return stringifyFnReplacer('', { '': value }, [], replacer, spacer, '')
        }
        if (Array.isArray(replacer)) {
          return stringifyArrayReplacer('', value, [], getUniqueReplacerSet(replacer), spacer, '')
        }
      }
      if (spacer.length !== 0) {
        return stringifyIndent('', value, [], spacer, '')
      }
    }
    return stringifySimple('', value, [])
  }

  return stringify
}


/***/ }),

/***/ 71944:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { EventEmitter } = __webpack_require__(82361)
const { Worker } = __webpack_require__(71267)
const { join } = __webpack_require__(71017)
const { pathToFileURL } = __webpack_require__(57310)
const { wait } = __webpack_require__(10177)
const {
  WRITE_INDEX,
  READ_INDEX
} = __webpack_require__(74429)
const buffer = __webpack_require__(14300)
const assert = __webpack_require__(39491)

const kImpl = Symbol('kImpl')

// V8 limit for string size
const MAX_STRING = buffer.constants.MAX_STRING_LENGTH

class FakeWeakRef {
  constructor (value) {
    this._value = value
  }

  deref () {
    return this._value
  }
}

const FinalizationRegistry = global.FinalizationRegistry || class FakeFinalizationRegistry {
  register () {}
  unregister () {}
}

const WeakRef = global.WeakRef || FakeWeakRef

const registry = new FinalizationRegistry((worker) => {
  if (worker.exited) {
    return
  }
  worker.terminate()
})

function createWorker (stream, opts) {
  const { filename, workerData } = opts

  const bundlerOverrides = '__bundlerPathsOverrides' in globalThis ? globalThis.__bundlerPathsOverrides : {}
  const toExecute = bundlerOverrides['thread-stream-worker'] || join(__dirname, 'lib', 'worker.js')

  const worker = new Worker(toExecute, {
    ...opts.workerOpts,
    workerData: {
      filename: filename.indexOf('file://') === 0
        ? filename
        : pathToFileURL(filename).href,
      dataBuf: stream[kImpl].dataBuf,
      stateBuf: stream[kImpl].stateBuf,
      workerData
    }
  })

  // We keep a strong reference for now,
  // we need to start writing first
  worker.stream = new FakeWeakRef(stream)

  worker.on('message', onWorkerMessage)
  worker.on('exit', onWorkerExit)
  registry.register(stream, worker)

  return worker
}

function drain (stream) {
  assert(!stream[kImpl].sync)
  if (stream[kImpl].needDrain) {
    stream[kImpl].needDrain = false
    stream.emit('drain')
  }
}

function nextFlush (stream) {
  const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX)
  let leftover = stream[kImpl].data.length - writeIndex

  if (leftover > 0) {
    if (stream[kImpl].buf.length === 0) {
      stream[kImpl].flushing = false

      if (stream[kImpl].ending) {
        end(stream)
      } else if (stream[kImpl].needDrain) {
        process.nextTick(drain, stream)
      }

      return
    }

    let toWrite = stream[kImpl].buf.slice(0, leftover)
    let toWriteBytes = Buffer.byteLength(toWrite)
    if (toWriteBytes <= leftover) {
      stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
      // process._rawDebug('writing ' + toWrite.length)
      write(stream, toWrite, nextFlush.bind(null, stream))
    } else {
      // multi-byte utf-8
      stream.flush(() => {
        // err is already handled in flush()
        if (stream.destroyed) {
          return
        }

        Atomics.store(stream[kImpl].state, READ_INDEX, 0)
        Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)

        // Find a toWrite length that fits the buffer
        // it must exists as the buffer is at least 4 bytes length
        // and the max utf-8 length for a char is 4 bytes.
        while (toWriteBytes > stream[kImpl].data.length) {
          leftover = leftover / 2
          toWrite = stream[kImpl].buf.slice(0, leftover)
          toWriteBytes = Buffer.byteLength(toWrite)
        }
        stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
        write(stream, toWrite, nextFlush.bind(null, stream))
      })
    }
  } else if (leftover === 0) {
    if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
      // we had a flushSync in the meanwhile
      return
    }
    stream.flush(() => {
      Atomics.store(stream[kImpl].state, READ_INDEX, 0)
      Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)
      nextFlush(stream)
    })
  } else {
    // This should never happen
    throw new Error('overwritten')
  }
}

function onWorkerMessage (msg) {
  const stream = this.stream.deref()
  if (stream === undefined) {
    this.exited = true
    // Terminate the worker.
    this.terminate()
    return
  }

  switch (msg.code) {
    case 'READY':
      // Replace the FakeWeakRef with a
      // proper one.
      this.stream = new WeakRef(stream)

      stream.flush(() => {
        stream[kImpl].ready = true
        stream.emit('ready')
      })
      break
    case 'ERROR':
      destroy(stream, msg.err)
      break
    default:
      throw new Error('this should not happen: ' + msg.code)
  }
}

function onWorkerExit (code) {
  const stream = this.stream.deref()
  if (stream === undefined) {
    // Nothing to do, the worker already exit
    return
  }
  registry.unregister(stream)
  stream.worker.exited = true
  stream.worker.off('exit', onWorkerExit)
  destroy(stream, code !== 0 ? new Error('The worker thread exited') : null)
}

class ThreadStream extends EventEmitter {
  constructor (opts = {}) {
    super()

    if (opts.bufferSize < 4) {
      throw new Error('bufferSize must at least fit a 4-byte utf-8 char')
    }

    this[kImpl] = {}
    this[kImpl].stateBuf = new SharedArrayBuffer(128)
    this[kImpl].state = new Int32Array(this[kImpl].stateBuf)
    this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024)
    this[kImpl].data = Buffer.from(this[kImpl].dataBuf)
    this[kImpl].sync = opts.sync || false
    this[kImpl].ending = false
    this[kImpl].ended = false
    this[kImpl].needDrain = false
    this[kImpl].destroyed = false
    this[kImpl].flushing = false
    this[kImpl].ready = false
    this[kImpl].finished = false
    this[kImpl].errored = null
    this[kImpl].closed = false
    this[kImpl].buf = ''

    // TODO (fix): Make private?
    this.worker = createWorker(this, opts) // TODO (fix): make private
  }

  write (data) {
    if (this[kImpl].destroyed) {
      throw new Error('the worker has exited')
    }

    if (this[kImpl].ending) {
      throw new Error('the worker is ending')
    }

    if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
      try {
        writeSync(this)
        this[kImpl].flushing = true
      } catch (err) {
        destroy(this, err)
        return false
      }
    }

    this[kImpl].buf += data

    if (this[kImpl].sync) {
      try {
        writeSync(this)
        return true
      } catch (err) {
        destroy(this, err)
        return false
      }
    }

    if (!this[kImpl].flushing) {
      this[kImpl].flushing = true
      setImmediate(nextFlush, this)
    }

    this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0
    return !this[kImpl].needDrain
  }

  end () {
    if (this[kImpl].destroyed) {
      return
    }

    this[kImpl].ending = true
    end(this)
  }

  flush (cb) {
    if (this[kImpl].destroyed) {
      if (typeof cb === 'function') {
        process.nextTick(cb, new Error('the worker has exited'))
      }
      return
    }

    // TODO write all .buf
    const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX)
    // process._rawDebug(`(flush) readIndex (${Atomics.load(this.state, READ_INDEX)}) writeIndex (${Atomics.load(this.state, WRITE_INDEX)})`)
    wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
      if (err) {
        destroy(this, err)
        process.nextTick(cb, err)
        return
      }
      if (res === 'not-equal') {
        // TODO handle deadlock
        this.flush(cb)
        return
      }
      process.nextTick(cb)
    })
  }

  flushSync () {
    if (this[kImpl].destroyed) {
      return
    }

    writeSync(this)
    flushSync(this)
  }

  unref () {
    this.worker.unref()
  }

  ref () {
    this.worker.ref()
  }

  get ready () {
    return this[kImpl].ready
  }

  get destroyed () {
    return this[kImpl].destroyed
  }

  get closed () {
    return this[kImpl].closed
  }

  get writable () {
    return !this[kImpl].destroyed && !this[kImpl].ending
  }

  get writableEnded () {
    return this[kImpl].ending
  }

  get writableFinished () {
    return this[kImpl].finished
  }

  get writableNeedDrain () {
    return this[kImpl].needDrain
  }

  get writableObjectMode () {
    return false
  }

  get writableErrored () {
    return this[kImpl].errored
  }
}

function destroy (stream, err) {
  if (stream[kImpl].destroyed) {
    return
  }
  stream[kImpl].destroyed = true

  if (err) {
    stream[kImpl].errored = err
    stream.emit('error', err)
  }

  if (!stream.worker.exited) {
    stream.worker.terminate()
      .catch(() => {})
      .then(() => {
        stream[kImpl].closed = true
        stream.emit('close')
      })
  } else {
    setImmediate(() => {
      stream[kImpl].closed = true
      stream.emit('close')
    })
  }
}

function write (stream, data, cb) {
  // data is smaller than the shared buffer length
  const current = Atomics.load(stream[kImpl].state, WRITE_INDEX)
  const length = Buffer.byteLength(data)
  stream[kImpl].data.write(data, current)
  Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length)
  Atomics.notify(stream[kImpl].state, WRITE_INDEX)
  cb()
  return true
}

function end (stream) {
  if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
    return
  }
  stream[kImpl].ended = true

  try {
    stream.flushSync()

    let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX)

    // process._rawDebug('writing index')
    Atomics.store(stream[kImpl].state, WRITE_INDEX, -1)
    // process._rawDebug(`(end) readIndex (${Atomics.load(stream.state, READ_INDEX)}) writeIndex (${Atomics.load(stream.state, WRITE_INDEX)})`)
    Atomics.notify(stream[kImpl].state, WRITE_INDEX)

    // Wait for the process to complete
    let spins = 0
    while (readIndex !== -1) {
      // process._rawDebug(`read = ${read}`)
      Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1000)
      readIndex = Atomics.load(stream[kImpl].state, READ_INDEX)

      if (readIndex === -2) {
        throw new Error('end() failed')
      }

      if (++spins === 10) {
        throw new Error('end() took too long (10s)')
      }
    }

    process.nextTick(() => {
      stream[kImpl].finished = true
      stream.emit('finish')
    })
  } catch (err) {
    destroy(stream, err)
  }
  // process._rawDebug('end finished...')
}

function writeSync (stream) {
  const cb = () => {
    if (stream[kImpl].ending) {
      end(stream)
    } else if (stream[kImpl].needDrain) {
      process.nextTick(drain, stream)
    }
  }
  stream[kImpl].flushing = false

  while (stream[kImpl].buf.length !== 0) {
    const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX)
    let leftover = stream[kImpl].data.length - writeIndex
    if (leftover === 0) {
      flushSync(stream)
      Atomics.store(stream[kImpl].state, READ_INDEX, 0)
      Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)
      continue
    } else if (leftover < 0) {
      // stream should never happen
      throw new Error('overwritten')
    }

    let toWrite = stream[kImpl].buf.slice(0, leftover)
    let toWriteBytes = Buffer.byteLength(toWrite)
    if (toWriteBytes <= leftover) {
      stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
      // process._rawDebug('writing ' + toWrite.length)
      write(stream, toWrite, cb)
    } else {
      // multi-byte utf-8
      flushSync(stream)
      Atomics.store(stream[kImpl].state, READ_INDEX, 0)
      Atomics.store(stream[kImpl].state, WRITE_INDEX, 0)

      // Find a toWrite length that fits the buffer
      // it must exists as the buffer is at least 4 bytes length
      // and the max utf-8 length for a char is 4 bytes.
      while (toWriteBytes > stream[kImpl].buf.length) {
        leftover = leftover / 2
        toWrite = stream[kImpl].buf.slice(0, leftover)
        toWriteBytes = Buffer.byteLength(toWrite)
      }
      stream[kImpl].buf = stream[kImpl].buf.slice(leftover)
      write(stream, toWrite, cb)
    }
  }
}

function flushSync (stream) {
  if (stream[kImpl].flushing) {
    throw new Error('unable to flush while flushing')
  }

  // process._rawDebug('flushSync started')

  const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX)

  let spins = 0

  // TODO handle deadlock
  while (true) {
    const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX)

    if (readIndex === -2) {
      throw new Error('_flushSync failed')
    }

    // process._rawDebug(`(flushSync) readIndex (${readIndex}) writeIndex (${writeIndex})`)
    if (readIndex !== writeIndex) {
      // TODO stream timeouts for some reason.
      Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1000)
    } else {
      break
    }

    if (++spins === 10) {
      throw new Error('_flushSync took too long (10s)')
    }
  }
  // process._rawDebug('flushSync finished')
}

module.exports = ThreadStream


/***/ }),

/***/ 74429:
/***/ ((module) => {

"use strict";


const WRITE_INDEX = 4
const READ_INDEX = 8

module.exports = {
  WRITE_INDEX,
  READ_INDEX
}


/***/ }),

/***/ 10177:
/***/ ((module) => {

"use strict";


const MAX_TIMEOUT = 1000

function wait (state, index, expected, timeout, done) {
  const max = Date.now() + timeout
  let current = Atomics.load(state, index)
  if (current === expected) {
    done(null, 'ok')
    return
  }
  let prior = current
  const check = (backoff) => {
    if (Date.now() > max) {
      done(null, 'timed-out')
    } else {
      setTimeout(() => {
        prior = current
        current = Atomics.load(state, index)
        if (current === prior) {
          check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2)
        } else {
          if (current === expected) done(null, 'ok')
          else done(null, 'not-equal')
        }
      }, backoff)
    }
  }
  check(1)
}

// let waitDiffCount = 0
function waitDiff (state, index, expected, timeout, done) {
  // const id = waitDiffCount++
  // process._rawDebug(`>>> waitDiff ${id}`)
  const max = Date.now() + timeout
  let current = Atomics.load(state, index)
  if (current !== expected) {
    done(null, 'ok')
    return
  }
  const check = (backoff) => {
    // process._rawDebug(`${id} ${index} current ${current} expected ${expected}`)
    // process._rawDebug('' + backoff)
    if (Date.now() > max) {
      done(null, 'timed-out')
    } else {
      setTimeout(() => {
        current = Atomics.load(state, index)
        if (current !== expected) {
          done(null, 'ok')
        } else {
          check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2)
        }
      }, backoff)
    }
  }
  check(1)
}

module.exports = { wait, waitDiff }


/***/ }),

/***/ 70480:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const errSerializer = __webpack_require__(87675)
const reqSerializers = __webpack_require__(1666)
const resSerializers = __webpack_require__(54908)

module.exports = {
  err: errSerializer,
  mapHttpRequest: reqSerializers.mapHttpRequest,
  mapHttpResponse: resSerializers.mapHttpResponse,
  req: reqSerializers.reqSerializer,
  res: resSerializers.resSerializer,

  wrapErrorSerializer: function wrapErrorSerializer (customSerializer) {
    if (customSerializer === errSerializer) return customSerializer
    return function wrapErrSerializer (err) {
      return customSerializer(errSerializer(err))
    }
  },

  wrapRequestSerializer: function wrapRequestSerializer (customSerializer) {
    if (customSerializer === reqSerializers.reqSerializer) return customSerializer
    return function wrappedReqSerializer (req) {
      return customSerializer(reqSerializers.reqSerializer(req))
    }
  },

  wrapResponseSerializer: function wrapResponseSerializer (customSerializer) {
    if (customSerializer === resSerializers.resSerializer) return customSerializer
    return function wrappedResSerializer (res) {
      return customSerializer(resSerializers.resSerializer(res))
    }
  }
}


/***/ }),

/***/ 87675:
/***/ ((module) => {

"use strict";


module.exports = errSerializer

const { toString } = Object.prototype
const seen = Symbol('circular-ref-tag')
const rawSymbol = Symbol('pino-raw-err-ref')
const pinoErrProto = Object.create({}, {
  type: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  message: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  stack: {
    enumerable: true,
    writable: true,
    value: undefined
  },
  raw: {
    enumerable: false,
    get: function () {
      return this[rawSymbol]
    },
    set: function (val) {
      this[rawSymbol] = val
    }
  }
})
Object.defineProperty(pinoErrProto, rawSymbol, {
  writable: true,
  value: {}
})

function errSerializer (err) {
  if (!(err instanceof Error)) {
    return err
  }

  err[seen] = undefined // tag to prevent re-looking at this
  const _err = Object.create(pinoErrProto)
  _err.type = toString.call(err.constructor) === '[object Function]'
    ? err.constructor.name
    : err.name
  _err.message = err.message
  _err.stack = err.stack
  for (const key in err) {
    if (_err[key] === undefined) {
      const val = err[key]
      if (val instanceof Error) {
        /* eslint-disable no-prototype-builtins */
        if (!val.hasOwnProperty(seen)) {
          _err[key] = errSerializer(val)
        }
      } else {
        _err[key] = val
      }
    }
  }

  delete err[seen] // clean up tag in case err is serialized again later
  _err.raw = err
  return _err
}


/***/ }),

/***/ 1666:
/***/ ((module) => {

"use strict";


module.exports = {
  mapHttpRequest,
  reqSerializer
}

const rawSymbol = Symbol('pino-raw-req-ref')
const pinoReqProto = Object.create({}, {
  id: {
    enumerable: true,
    writable: true,
    value: ''
  },
  method: {
    enumerable: true,
    writable: true,
    value: ''
  },
  url: {
    enumerable: true,
    writable: true,
    value: ''
  },
  query: {
    enumerable: true,
    writable: true,
    value: ''
  },
  params: {
    enumerable: true,
    writable: true,
    value: ''
  },
  headers: {
    enumerable: true,
    writable: true,
    value: {}
  },
  remoteAddress: {
    enumerable: true,
    writable: true,
    value: ''
  },
  remotePort: {
    enumerable: true,
    writable: true,
    value: ''
  },
  raw: {
    enumerable: false,
    get: function () {
      return this[rawSymbol]
    },
    set: function (val) {
      this[rawSymbol] = val
    }
  }
})
Object.defineProperty(pinoReqProto, rawSymbol, {
  writable: true,
  value: {}
})

function reqSerializer (req) {
  // req.info is for hapi compat.
  const connection = req.info || req.socket
  const _req = Object.create(pinoReqProto)
  _req.id = (typeof req.id === 'function' ? req.id() : (req.id || (req.info ? req.info.id : undefined)))
  _req.method = req.method
  // req.originalUrl is for expressjs compat.
  if (req.originalUrl) {
    _req.url = req.originalUrl
    _req.query = req.query
    _req.params = req.params
  } else {
    // req.url.path is  for hapi compat.
    _req.url = req.path || (req.url ? (req.url.path || req.url) : undefined)
  }
  _req.headers = req.headers
  _req.remoteAddress = connection && connection.remoteAddress
  _req.remotePort = connection && connection.remotePort
  // req.raw is  for hapi compat/equivalence
  _req.raw = req.raw || req
  return _req
}

function mapHttpRequest (req) {
  return {
    req: reqSerializer(req)
  }
}


/***/ }),

/***/ 54908:
/***/ ((module) => {

"use strict";


module.exports = {
  mapHttpResponse,
  resSerializer
}

const rawSymbol = Symbol('pino-raw-res-ref')
const pinoResProto = Object.create({}, {
  statusCode: {
    enumerable: true,
    writable: true,
    value: 0
  },
  headers: {
    enumerable: true,
    writable: true,
    value: ''
  },
  raw: {
    enumerable: false,
    get: function () {
      return this[rawSymbol]
    },
    set: function (val) {
      this[rawSymbol] = val
    }
  }
})
Object.defineProperty(pinoResProto, rawSymbol, {
  writable: true,
  value: {}
})

function resSerializer (res) {
  const _res = Object.create(pinoResProto)
  _res.statusCode = res.statusCode
  _res.headers = res.getHeaders ? res.getHeaders() : res._headers
  _res.raw = res
  return _res
}

function mapHttpResponse (res) {
  return {
    res: resSerializer(res)
  }
}


/***/ }),

/***/ 17444:
/***/ ((module) => {

"use strict";


function noOpPrepareStackTrace (_, stack) {
  return stack
}

module.exports = function getCallers () {
  const originalPrepare = Error.prepareStackTrace
  Error.prepareStackTrace = noOpPrepareStackTrace
  const stack = new Error().stack
  Error.prepareStackTrace = originalPrepare

  if (!Array.isArray(stack)) {
    return undefined
  }

  const entries = stack.slice(2)

  const fileNames = []

  for (const entry of entries) {
    if (!entry) {
      continue
    }

    fileNames.push(entry.getFileName())
  }

  return fileNames
}


/***/ }),

/***/ 38398:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const warning = __webpack_require__(95495)()
module.exports = warning

const warnName = 'PinoWarning'

warning.create(warnName, 'PINODEP008', 'prettyPrint is deprecated, look at https://github.com/pinojs/pino-pretty for alternatives.')

warning.create(warnName, 'PINODEP009', 'The use of pino.final is discouraged in Node.js v14+ and not required. It will be removed in the next major version')


/***/ }),

/***/ 30888:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint no-prototype-builtins: 0 */
const {
  lsCacheSym,
  levelValSym,
  useOnlyCustomLevelsSym,
  streamSym,
  formattersSym,
  hooksSym
} = __webpack_require__(82818)
const { noop, genLog } = __webpack_require__(1223)

const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
}
const levelMethods = {
  fatal: (hook) => {
    const logFatal = genLog(levels.fatal, hook)
    return function (...args) {
      const stream = this[streamSym]
      logFatal.call(this, ...args)
      if (typeof stream.flushSync === 'function') {
        try {
          stream.flushSync()
        } catch (e) {
          // https://github.com/pinojs/pino/pull/740#discussion_r346788313
        }
      }
    }
  },
  error: (hook) => genLog(levels.error, hook),
  warn: (hook) => genLog(levels.warn, hook),
  info: (hook) => genLog(levels.info, hook),
  debug: (hook) => genLog(levels.debug, hook),
  trace: (hook) => genLog(levels.trace, hook)
}

const nums = Object.keys(levels).reduce((o, k) => {
  o[levels[k]] = k
  return o
}, {})

const initialLsCache = Object.keys(nums).reduce((o, k) => {
  o[k] = '{"level":' + Number(k)
  return o
}, {})

function genLsCache (instance) {
  const formatter = instance[formattersSym].level
  const { labels } = instance.levels
  const cache = {}
  for (const label in labels) {
    const level = formatter(labels[label], Number(label))
    cache[label] = JSON.stringify(level).slice(0, -1)
  }
  instance[lsCacheSym] = cache
  return instance
}

function isStandardLevel (level, useOnlyCustomLevels) {
  if (useOnlyCustomLevels) {
    return false
  }

  switch (level) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      return true
    default:
      return false
  }
}

function setLevel (level) {
  const { labels, values } = this.levels
  if (typeof level === 'number') {
    if (labels[level] === undefined) throw Error('unknown level value' + level)
    level = labels[level]
  }
  if (values[level] === undefined) throw Error('unknown level ' + level)
  const preLevelVal = this[levelValSym]
  const levelVal = this[levelValSym] = values[level]
  const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym]
  const hook = this[hooksSym].logMethod

  for (const key in values) {
    if (levelVal > values[key]) {
      this[key] = noop
      continue
    }
    this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook)
  }

  this.emit(
    'level-change',
    level,
    levelVal,
    labels[preLevelVal],
    preLevelVal
  )
}

function getLevel (level) {
  const { levels, levelVal } = this
  // protection against potential loss of Pino scope from serializers (edge case with circular refs - https://github.com/pinojs/pino/issues/833)
  return (levels && levels.labels) ? levels.labels[levelVal] : ''
}

function isLevelEnabled (logLevel) {
  const { values } = this.levels
  const logLevelVal = values[logLevel]
  return logLevelVal !== undefined && (logLevelVal >= this[levelValSym])
}

function mappings (customLevels = null, useOnlyCustomLevels = false) {
  const customNums = customLevels
    /* eslint-disable */
    ? Object.keys(customLevels).reduce((o, k) => {
        o[customLevels[k]] = k
        return o
      }, {})
    : null
    /* eslint-enable */

  const labels = Object.assign(
    Object.create(Object.prototype, { Infinity: { value: 'silent' } }),
    useOnlyCustomLevels ? null : nums,
    customNums
  )
  const values = Object.assign(
    Object.create(Object.prototype, { silent: { value: Infinity } }),
    useOnlyCustomLevels ? null : levels,
    customLevels
  )
  return { labels, values }
}

function assertDefaultLevelFound (defaultLevel, customLevels, useOnlyCustomLevels) {
  if (typeof defaultLevel === 'number') {
    const values = [].concat(
      Object.keys(customLevels || {}).map(key => customLevels[key]),
      useOnlyCustomLevels ? [] : Object.keys(nums).map(level => +level),
      Infinity
    )
    if (!values.includes(defaultLevel)) {
      throw Error(`default level:${defaultLevel} must be included in custom levels`)
    }
    return
  }

  const labels = Object.assign(
    Object.create(Object.prototype, { silent: { value: Infinity } }),
    useOnlyCustomLevels ? null : levels,
    customLevels
  )
  if (!(defaultLevel in labels)) {
    throw Error(`default level:${defaultLevel} must be included in custom levels`)
  }
}

function assertNoLevelCollisions (levels, customLevels) {
  const { labels, values } = levels
  for (const k in customLevels) {
    if (k in values) {
      throw Error('levels cannot be overridden')
    }
    if (customLevels[k] in labels) {
      throw Error('pre-existing level values cannot be used for new levels')
    }
  }
}

module.exports = {
  initialLsCache,
  genLsCache,
  levelMethods,
  getLevel,
  setLevel,
  isLevelEnabled,
  mappings,
  levels,
  assertNoLevelCollisions,
  assertDefaultLevelFound
}


/***/ }),

/***/ 82522:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { version } = __webpack_require__(19780)

module.exports = { version }


/***/ }),

/***/ 18382:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const metadata = Symbol.for('pino.metadata')
const { levels } = __webpack_require__(30888)

const defaultLevels = Object.create(levels)
defaultLevels.silent = Infinity

const DEFAULT_INFO_LEVEL = levels.info

function multistream (streamsArray, opts) {
  let counter = 0
  streamsArray = streamsArray || []
  opts = opts || { dedupe: false }

  let levels = defaultLevels
  if (opts.levels && typeof opts.levels === 'object') {
    levels = opts.levels
  }

  const res = {
    write,
    add,
    flushSync,
    end,
    minLevel: 0,
    streams: [],
    clone,
    [metadata]: true
  }

  if (Array.isArray(streamsArray)) {
    streamsArray.forEach(add, res)
  } else {
    add.call(res, streamsArray)
  }

  // clean this object up
  // or it will stay allocated forever
  // as it is closed on the following closures
  streamsArray = null

  return res

  // we can exit early because the streams are ordered by level
  function write (data) {
    let dest
    const level = this.lastLevel
    const { streams } = this
    let stream
    for (let i = 0; i < streams.length; i++) {
      dest = streams[i]
      if (dest.level <= level) {
        stream = dest.stream
        if (stream[metadata]) {
          const { lastTime, lastMsg, lastObj, lastLogger } = this
          stream.lastLevel = level
          stream.lastTime = lastTime
          stream.lastMsg = lastMsg
          stream.lastObj = lastObj
          stream.lastLogger = lastLogger
        }
        if (!opts.dedupe || dest.level === level) {
          stream.write(data)
        }
      } else {
        break
      }
    }
  }

  function flushSync () {
    for (const { stream } of this.streams) {
      if (typeof stream.flushSync === 'function') {
        stream.flushSync()
      }
    }
  }

  function add (dest) {
    if (!dest) {
      return res
    }

    // Check that dest implements either StreamEntry or DestinationStream
    const isStream = typeof dest.write === 'function' || dest.stream
    const stream_ = dest.write ? dest : dest.stream
    // This is necessary to provide a meaningful error message, otherwise it throws somewhere inside write()
    if (!isStream) {
      throw Error('stream object needs to implement either StreamEntry or DestinationStream interface')
    }

    const { streams } = this

    let level
    if (typeof dest.levelVal === 'number') {
      level = dest.levelVal
    } else if (typeof dest.level === 'string') {
      level = levels[dest.level]
    } else if (typeof dest.level === 'number') {
      level = dest.level
    } else {
      level = DEFAULT_INFO_LEVEL
    }

    const dest_ = {
      stream: stream_,
      level,
      levelVal: undefined,
      id: counter++
    }

    streams.unshift(dest_)
    streams.sort(compareByLevel)

    this.minLevel = streams[0].level

    return res
  }

  function end () {
    for (const { stream } of this.streams) {
      if (typeof stream.flushSync === 'function') {
        stream.flushSync()
      }
      stream.end()
    }
  }

  function clone (level) {
    const streams = new Array(this.streams.length)

    for (let i = 0; i < streams.length; i++) {
      streams[i] = {
        level: level,
        stream: this.streams[i].stream
      }
    }

    return {
      write,
      add,
      minLevel: level,
      streams,
      clone,
      flushSync,
      [metadata]: true
    }
  }
}

function compareByLevel (a, b) {
  return a.level - b.level
}

module.exports = multistream


/***/ }),

/***/ 75262:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const { EventEmitter } = __webpack_require__(82361)
const {
  lsCacheSym,
  levelValSym,
  setLevelSym,
  getLevelSym,
  chindingsSym,
  parsedChindingsSym,
  mixinSym,
  asJsonSym,
  writeSym,
  mixinMergeStrategySym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  serializersSym,
  formattersSym,
  useOnlyCustomLevelsSym,
  needsMetadataGsym,
  redactFmtSym,
  stringifySym,
  formatOptsSym,
  stringifiersSym
} = __webpack_require__(82818)
const {
  getLevel,
  setLevel,
  isLevelEnabled,
  mappings,
  initialLsCache,
  genLsCache,
  assertNoLevelCollisions
} = __webpack_require__(30888)
const {
  asChindings,
  asJson,
  buildFormatters,
  stringify
} = __webpack_require__(1223)
const {
  version
} = __webpack_require__(82522)
const redaction = __webpack_require__(90570)

// note: use of class is satirical
// https://github.com/pinojs/pino/pull/433#pullrequestreview-127703127
const constructor = class Pino {}
const prototype = {
  constructor,
  child,
  bindings,
  setBindings,
  flush,
  isLevelEnabled,
  version,
  get level () { return this[getLevelSym]() },
  set level (lvl) { this[setLevelSym](lvl) },
  get levelVal () { return this[levelValSym] },
  set levelVal (n) { throw Error('levelVal is read-only') },
  [lsCacheSym]: initialLsCache,
  [writeSym]: write,
  [asJsonSym]: asJson,
  [getLevelSym]: getLevel,
  [setLevelSym]: setLevel
}

Object.setPrototypeOf(prototype, EventEmitter.prototype)

// exporting and consuming the prototype object using factory pattern fixes scoping issues with getters when serializing
module.exports = function () {
  return Object.create(prototype)
}

const resetChildingsFormatter = bindings => bindings
function child (bindings, options) {
  if (!bindings) {
    throw Error('missing bindings for child Pino')
  }
  options = options || {} // default options to empty object
  const serializers = this[serializersSym]
  const formatters = this[formattersSym]
  const instance = Object.create(this)

  if (options.hasOwnProperty('serializers') === true) {
    instance[serializersSym] = Object.create(null)

    for (const k in serializers) {
      instance[serializersSym][k] = serializers[k]
    }
    const parentSymbols = Object.getOwnPropertySymbols(serializers)
    /* eslint no-var: off */
    for (var i = 0; i < parentSymbols.length; i++) {
      const ks = parentSymbols[i]
      instance[serializersSym][ks] = serializers[ks]
    }

    for (const bk in options.serializers) {
      instance[serializersSym][bk] = options.serializers[bk]
    }
    const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers)
    for (var bi = 0; bi < bindingsSymbols.length; bi++) {
      const bks = bindingsSymbols[bi]
      instance[serializersSym][bks] = options.serializers[bks]
    }
  } else instance[serializersSym] = serializers
  if (options.hasOwnProperty('formatters')) {
    const { level, bindings: chindings, log } = options.formatters
    instance[formattersSym] = buildFormatters(
      level || formatters.level,
      chindings || resetChildingsFormatter,
      log || formatters.log
    )
  } else {
    instance[formattersSym] = buildFormatters(
      formatters.level,
      resetChildingsFormatter,
      formatters.log
    )
  }
  if (options.hasOwnProperty('customLevels') === true) {
    assertNoLevelCollisions(this.levels, options.customLevels)
    instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym])
    genLsCache(instance)
  }

  // redact must place before asChindings and only replace if exist
  if ((typeof options.redact === 'object' && options.redact !== null) || Array.isArray(options.redact)) {
    instance.redact = options.redact // replace redact directly
    const stringifiers = redaction(instance.redact, stringify)
    const formatOpts = { stringify: stringifiers[redactFmtSym] }
    instance[stringifySym] = stringify
    instance[stringifiersSym] = stringifiers
    instance[formatOptsSym] = formatOpts
  }

  instance[chindingsSym] = asChindings(instance, bindings)
  const childLevel = options.level || this.level
  instance[setLevelSym](childLevel)

  return instance
}

function bindings () {
  const chindings = this[chindingsSym]
  const chindingsJson = `{${chindings.substr(1)}}` // at least contains ,"pid":7068,"hostname":"myMac"
  const bindingsFromJson = JSON.parse(chindingsJson)
  delete bindingsFromJson.pid
  delete bindingsFromJson.hostname
  return bindingsFromJson
}

function setBindings (newBindings) {
  const chindings = asChindings(this, newBindings)
  this[chindingsSym] = chindings
  delete this[parsedChindingsSym]
}

/**
 * Default strategy for creating `mergeObject` from arguments and the result from `mixin()`.
 * Fields from `mergeObject` have higher priority in this strategy.
 *
 * @param {Object} mergeObject The object a user has supplied to the logging function.
 * @param {Object} mixinObject The result of the `mixin` method.
 * @return {Object}
 */
function defaultMixinMergeStrategy (mergeObject, mixinObject) {
  return Object.assign(mixinObject, mergeObject)
}

function write (_obj, msg, num) {
  const t = this[timeSym]()
  const mixin = this[mixinSym]
  const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy
  let obj

  if (_obj === undefined || _obj === null) {
    obj = {}
  } else if (_obj instanceof Error) {
    obj = { err: _obj }
    if (msg === undefined) {
      msg = _obj.message
    }
  } else {
    obj = _obj
    if (msg === undefined && _obj.err) {
      msg = _obj.err.message
    }
  }

  if (mixin) {
    obj = mixinMergeStrategy(obj, mixin(obj, num))
  }

  const s = this[asJsonSym](obj, msg, num, t)

  const stream = this[streamSym]
  if (stream[needsMetadataGsym] === true) {
    stream.lastLevel = num
    stream.lastObj = obj
    stream.lastMsg = msg
    stream.lastTime = t.slice(this[timeSliceIndexSym])
    stream.lastLogger = this // for child loggers
  }
  stream.write(s)
}

function noop () {}

function flush () {
  const stream = this[streamSym]
  if ('flush' in stream) stream.flush(noop)
}


/***/ }),

/***/ 90570:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fastRedact = __webpack_require__(37994)
const { redactFmtSym, wildcardFirstSym } = __webpack_require__(82818)
const { rx, validator } = fastRedact

const validate = validator({
  ERR_PATHS_MUST_BE_STRINGS: () => 'pino – redacted paths must be strings',
  ERR_INVALID_PATH: (s) => `pino – redact paths array contains an invalid path (${s})`
})

const CENSOR = '[Redacted]'
const strict = false // TODO should this be configurable?

function redaction (opts, serialize) {
  const { paths, censor } = handle(opts)

  const shape = paths.reduce((o, str) => {
    rx.lastIndex = 0
    const first = rx.exec(str)
    const next = rx.exec(str)

    // ns is the top-level path segment, brackets + quoting removed.
    let ns = first[1] !== undefined
      ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, '$1')
      : first[0]

    if (ns === '*') {
      ns = wildcardFirstSym
    }

    // top level key:
    if (next === null) {
      o[ns] = null
      return o
    }

    // path with at least two segments:
    // if ns is already redacted at the top level, ignore lower level redactions
    if (o[ns] === null) {
      return o
    }

    const { index } = next
    const nextPath = `${str.substr(index, str.length - 1)}`

    o[ns] = o[ns] || []

    // shape is a mix of paths beginning with literal values and wildcard
    // paths [ "a.b.c", "*.b.z" ] should reduce to a shape of
    // { "a": [ "b.c", "b.z" ], *: [ "b.z" ] }
    // note: "b.z" is in both "a" and * arrays because "a" matches the wildcard.
    // (* entry has wildcardFirstSym as key)
    if (ns !== wildcardFirstSym && o[ns].length === 0) {
      // first time ns's get all '*' redactions so far
      o[ns].push(...(o[wildcardFirstSym] || []))
    }

    if (ns === wildcardFirstSym) {
      // new * path gets added to all previously registered literal ns's.
      Object.keys(o).forEach(function (k) {
        if (o[k]) {
          o[k].push(nextPath)
        }
      })
    }

    o[ns].push(nextPath)
    return o
  }, {})

  // the redactor assigned to the format symbol key
  // provides top level redaction for instances where
  // an object is interpolated into the msg string
  const result = {
    [redactFmtSym]: fastRedact({ paths, censor, serialize, strict })
  }

  const topCensor = (...args) => {
    return typeof censor === 'function' ? serialize(censor(...args)) : serialize(censor)
  }

  return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
    // top level key:
    if (shape[k] === null) {
      o[k] = (value) => topCensor(value, [k])
    } else {
      const wrappedCensor = typeof censor === 'function'
        ? (value, path) => {
            return censor(value, [k, ...path])
          }
        : censor
      o[k] = fastRedact({
        paths: shape[k],
        censor: wrappedCensor,
        serialize,
        strict
      })
    }
    return o
  }, result)
}

function handle (opts) {
  if (Array.isArray(opts)) {
    opts = { paths: opts, censor: CENSOR }
    validate(opts)
    return opts
  }
  let { paths, censor = CENSOR, remove } = opts
  if (Array.isArray(paths) === false) { throw Error('pino – redact must contain an array of strings') }
  if (remove === true) censor = undefined
  validate({ paths, censor })

  return { paths, censor }
}

module.exports = redaction


/***/ }),

/***/ 82818:
/***/ ((module) => {

"use strict";


const setLevelSym = Symbol('pino.setLevel')
const getLevelSym = Symbol('pino.getLevel')
const levelValSym = Symbol('pino.levelVal')
const useLevelLabelsSym = Symbol('pino.useLevelLabels')
const useOnlyCustomLevelsSym = Symbol('pino.useOnlyCustomLevels')
const mixinSym = Symbol('pino.mixin')

const lsCacheSym = Symbol('pino.lsCache')
const chindingsSym = Symbol('pino.chindings')
const parsedChindingsSym = Symbol('pino.parsedChindings')

const asJsonSym = Symbol('pino.asJson')
const writeSym = Symbol('pino.write')
const redactFmtSym = Symbol('pino.redactFmt')

const timeSym = Symbol('pino.time')
const timeSliceIndexSym = Symbol('pino.timeSliceIndex')
const streamSym = Symbol('pino.stream')
const stringifySym = Symbol('pino.stringify')
const stringifySafeSym = Symbol('pino.stringifySafe')
const stringifiersSym = Symbol('pino.stringifiers')
const endSym = Symbol('pino.end')
const formatOptsSym = Symbol('pino.formatOpts')
const messageKeySym = Symbol('pino.messageKey')
const nestedKeySym = Symbol('pino.nestedKey')
const nestedKeyStrSym = Symbol('pino.nestedKeyStr')
const mixinMergeStrategySym = Symbol('pino.mixinMergeStrategy')

const wildcardFirstSym = Symbol('pino.wildcardFirst')

// public symbols, no need to use the same pino
// version for these
const serializersSym = Symbol.for('pino.serializers')
const formattersSym = Symbol.for('pino.formatters')
const hooksSym = Symbol.for('pino.hooks')
const needsMetadataGsym = Symbol.for('pino.metadata')

module.exports = {
  setLevelSym,
  getLevelSym,
  levelValSym,
  useLevelLabelsSym,
  mixinSym,
  lsCacheSym,
  chindingsSym,
  parsedChindingsSym,
  asJsonSym,
  writeSym,
  serializersSym,
  redactFmtSym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  stringifySym,
  stringifySafeSym,
  stringifiersSym,
  endSym,
  formatOptsSym,
  messageKeySym,
  nestedKeySym,
  wildcardFirstSym,
  needsMetadataGsym,
  useOnlyCustomLevelsSym,
  formattersSym,
  hooksSym,
  nestedKeyStrSym,
  mixinMergeStrategySym
}


/***/ }),

/***/ 89411:
/***/ ((module) => {

"use strict";


const nullTime = () => ''

const epochTime = () => `,"time":${Date.now()}`

const unixTime = () => `,"time":${Math.round(Date.now() / 1000.0)}`

const isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"` // using Date.now() for testability

module.exports = { nullTime, epochTime, unixTime, isoTime }


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* eslint no-prototype-builtins: 0 */

const format = __webpack_require__(24773)
const { mapHttpRequest, mapHttpResponse } = __webpack_require__(70480)
const SonicBoom = __webpack_require__(99490)
const warning = __webpack_require__(38398)
const {
  lsCacheSym,
  chindingsSym,
  parsedChindingsSym,
  writeSym,
  serializersSym,
  formatOptsSym,
  endSym,
  stringifiersSym,
  stringifySym,
  stringifySafeSym,
  wildcardFirstSym,
  needsMetadataGsym,
  redactFmtSym,
  streamSym,
  nestedKeySym,
  formattersSym,
  messageKeySym,
  nestedKeyStrSym
} = __webpack_require__(82818)
const { isMainThread } = __webpack_require__(71267)
const transport = __webpack_require__(4011)

function noop () {}

function genLog (level, hook) {
  if (!hook) return LOG

  return function hookWrappedLog (...args) {
    hook.call(this, args, LOG, level)
  }

  function LOG (o, ...n) {
    if (typeof o === 'object') {
      let msg = o
      if (o !== null) {
        if (o.method && o.headers && o.socket) {
          o = mapHttpRequest(o)
        } else if (typeof o.setHeader === 'function') {
          o = mapHttpResponse(o)
        }
      }
      let formatParams
      if (msg === null && n.length === 0) {
        formatParams = [null]
      } else {
        msg = n.shift()
        formatParams = n
      }
      this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level)
    } else {
      this[writeSym](null, format(o, n, this[formatOptsSym]), level)
    }
  }
}

// magically escape strings for json
// relying on their charCodeAt
// everything below 32 needs JSON.stringify()
// 34 and 92 happens all the time, so we
// have a fast case for them
function asString (str) {
  let result = ''
  let last = 0
  let found = false
  let point = 255
  const l = str.length
  if (l > 100) {
    return JSON.stringify(str)
  }
  for (var i = 0; i < l && point >= 32; i++) {
    point = str.charCodeAt(i)
    if (point === 34 || point === 92) {
      result += str.slice(last, i) + '\\'
      last = i
      found = true
    }
  }
  if (!found) {
    result = str
  } else {
    result += str.slice(last)
  }
  return point < 32 ? JSON.stringify(str) : '"' + result + '"'
}

function asJson (obj, msg, num, time) {
  const stringify = this[stringifySym]
  const stringifySafe = this[stringifySafeSym]
  const stringifiers = this[stringifiersSym]
  const end = this[endSym]
  const chindings = this[chindingsSym]
  const serializers = this[serializersSym]
  const formatters = this[formattersSym]
  const messageKey = this[messageKeySym]
  let data = this[lsCacheSym][num] + time

  // we need the child bindings added to the output first so instance logged
  // objects can take precedence when JSON.parse-ing the resulting log line
  data = data + chindings

  let value
  if (formatters.log) {
    obj = formatters.log(obj)
  }
  const wildcardStringifier = stringifiers[wildcardFirstSym]
  let propStr = ''
  for (const key in obj) {
    value = obj[key]
    if (Object.prototype.hasOwnProperty.call(obj, key) && value !== undefined) {
      value = serializers[key] ? serializers[key](value) : value

      const stringifier = stringifiers[key] || wildcardStringifier

      switch (typeof value) {
        case 'undefined':
        case 'function':
          continue
        case 'number':
          /* eslint no-fallthrough: "off" */
          if (Number.isFinite(value) === false) {
            value = null
          }
        // this case explicitly falls through to the next one
        case 'boolean':
          if (stringifier) value = stringifier(value)
          break
        case 'string':
          value = (stringifier || asString)(value)
          break
        default:
          value = (stringifier || stringify)(value, stringifySafe)
      }
      if (value === undefined) continue
      propStr += ',"' + key + '":' + value
    }
  }

  let msgStr = ''
  if (msg !== undefined) {
    value = serializers[messageKey] ? serializers[messageKey](msg) : msg
    const stringifier = stringifiers[messageKey] || wildcardStringifier

    switch (typeof value) {
      case 'function':
        break
      case 'number':
        /* eslint no-fallthrough: "off" */
        if (Number.isFinite(value) === false) {
          value = null
        }
      // this case explicitly falls through to the next one
      case 'boolean':
        if (stringifier) value = stringifier(value)
        msgStr = ',"' + messageKey + '":' + value
        break
      case 'string':
        value = (stringifier || asString)(value)
        msgStr = ',"' + messageKey + '":' + value
        break
      default:
        value = (stringifier || stringify)(value, stringifySafe)
        msgStr = ',"' + messageKey + '":' + value
    }
  }

  if (this[nestedKeySym] && propStr) {
    // place all the obj properties under the specified key
    // the nested key is already formatted from the constructor
    return data + this[nestedKeyStrSym] + propStr.slice(1) + '}' + msgStr + end
  } else {
    return data + propStr + msgStr + end
  }
}

function asChindings (instance, bindings) {
  let value
  let data = instance[chindingsSym]
  const stringify = instance[stringifySym]
  const stringifySafe = instance[stringifySafeSym]
  const stringifiers = instance[stringifiersSym]
  const wildcardStringifier = stringifiers[wildcardFirstSym]
  const serializers = instance[serializersSym]
  const formatter = instance[formattersSym].bindings
  bindings = formatter(bindings)

  for (const key in bindings) {
    value = bindings[key]
    const valid = key !== 'level' &&
      key !== 'serializers' &&
      key !== 'formatters' &&
      key !== 'customLevels' &&
      bindings.hasOwnProperty(key) &&
      value !== undefined
    if (valid === true) {
      value = serializers[key] ? serializers[key](value) : value
      value = (stringifiers[key] || wildcardStringifier || stringify)(value, stringifySafe)
      if (value === undefined) continue
      data += ',"' + key + '":' + value
    }
  }
  return data
}

function getPrettyStream (opts, prettifier, dest, instance) {
  if (prettifier && typeof prettifier === 'function') {
    prettifier = prettifier.bind(instance)
    return prettifierMetaWrapper(prettifier(opts), dest, opts)
  }
  try {
    const prettyFactory = (__webpack_require__(14752).prettyFactory)
    prettyFactory.asMetaWrapper = prettifierMetaWrapper
    return prettifierMetaWrapper(prettyFactory(opts), dest, opts)
  } catch (e) {
    if (e.message.startsWith("Cannot find module 'pino-pretty'")) {
      throw Error('Missing `pino-pretty` module: `pino-pretty` must be installed separately')
    };
    throw e
  }
}

function prettifierMetaWrapper (pretty, dest, opts) {
  opts = Object.assign({ suppressFlushSyncWarning: false }, opts)
  let warned = false
  return {
    [needsMetadataGsym]: true,
    lastLevel: 0,
    lastMsg: null,
    lastObj: null,
    lastLogger: null,
    flushSync () {
      if (opts.suppressFlushSyncWarning || warned) {
        return
      }
      warned = true
      setMetadataProps(dest, this)
      dest.write(pretty(Object.assign({
        level: 40, // warn
        msg: 'pino.final with prettyPrint does not support flushing',
        time: Date.now()
      }, this.chindings())))
    },
    chindings () {
      const lastLogger = this.lastLogger
      let chindings = null

      // protection against flushSync being called before logging
      // anything
      if (!lastLogger) {
        return null
      }

      if (lastLogger.hasOwnProperty(parsedChindingsSym)) {
        chindings = lastLogger[parsedChindingsSym]
      } else {
        chindings = JSON.parse('{' + lastLogger[chindingsSym].substr(1) + '}')
        lastLogger[parsedChindingsSym] = chindings
      }

      return chindings
    },
    write (chunk) {
      const lastLogger = this.lastLogger
      const chindings = this.chindings()

      let time = this.lastTime

      /* istanbul ignore next */
      if (typeof time === 'number') {
        // do nothing!
      } else if (time.match(/^\d+/)) {
        time = parseInt(time)
      } else {
        time = time.slice(1, -1)
      }

      const lastObj = this.lastObj
      const lastMsg = this.lastMsg
      const errorProps = null

      const formatters = lastLogger[formattersSym]
      const formattedObj = formatters.log ? formatters.log(lastObj) : lastObj

      const messageKey = lastLogger[messageKeySym]
      if (lastMsg && formattedObj && !Object.prototype.hasOwnProperty.call(formattedObj, messageKey)) {
        formattedObj[messageKey] = lastMsg
      }

      const obj = Object.assign({
        level: this.lastLevel,
        time
      }, formattedObj, errorProps)

      const serializers = lastLogger[serializersSym]
      const keys = Object.keys(serializers)

      for (var i = 0; i < keys.length; i++) {
        const key = keys[i]
        if (obj[key] !== undefined) {
          obj[key] = serializers[key](obj[key])
        }
      }

      for (const key in chindings) {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = chindings[key]
        }
      }

      const stringifiers = lastLogger[stringifiersSym]
      const redact = stringifiers[redactFmtSym]

      const formatted = pretty(typeof redact === 'function' ? redact(obj) : obj)
      if (formatted === undefined) return

      setMetadataProps(dest, this)
      dest.write(formatted)
    }
  }
}

function hasBeenTampered (stream) {
  return stream.write !== stream.constructor.prototype.write
}

function buildSafeSonicBoom (opts) {
  const stream = new SonicBoom(opts)
  stream.on('error', filterBrokenPipe)
  // if we are sync: false, we must flush on exit
  if (!opts.sync && isMainThread) {
    setupOnExit(stream)
  }
  return stream

  function filterBrokenPipe (err) {
    // TODO verify on Windows
    if (err.code === 'EPIPE') {
      // If we get EPIPE, we should stop logging here
      // however we have no control to the consumer of
      // SonicBoom, so we just overwrite the write method
      stream.write = noop
      stream.end = noop
      stream.flushSync = noop
      stream.destroy = noop
      return
    }
    stream.removeListener('error', filterBrokenPipe)
    stream.emit('error', err)
  }
}

function setupOnExit (stream) {
  /* istanbul ignore next */
  if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) {
    // This is leak free, it does not leave event handlers
    const onExit = __webpack_require__(22858)

    onExit.register(stream, autoEnd)

    stream.on('close', function () {
      onExit.unregister(stream)
    })
  }
}

function autoEnd (stream, eventName) {
  // This check is needed only on some platforms
  /* istanbul ignore next */
  if (stream.destroyed) {
    return
  }

  if (eventName === 'beforeExit') {
    // We still have an event loop, let's use it
    stream.flush()
    stream.on('drain', function () {
      stream.end()
    })
  } else {
    // We do not have an event loop, so flush synchronously
    stream.flushSync()
  }
}

function createArgsNormalizer (defaultOptions) {
  return function normalizeArgs (instance, caller, opts = {}, stream) {
    // support stream as a string
    if (typeof opts === 'string') {
      stream = buildSafeSonicBoom({ dest: opts, sync: true })
      opts = {}
    } else if (typeof stream === 'string') {
      if (opts && opts.transport) {
        throw Error('only one of option.transport or stream can be specified')
      }
      stream = buildSafeSonicBoom({ dest: stream, sync: true })
    } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
      stream = opts
      opts = {}
    } else if (opts.transport) {
      if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
        throw Error('option.transport do not allow stream, please pass to option directly. e.g. pino(transport)')
      }
      if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === 'function') {
        throw Error('option.transport.targets do not allow custom level formatters')
      }

      let customLevels
      if (opts.customLevels) {
        customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels)
      }
      stream = transport({ caller, ...opts.transport, levels: customLevels })
    }
    opts = Object.assign({}, defaultOptions, opts)
    opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers)
    opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters)

    if ('onTerminated' in opts) {
      throw Error('The onTerminated option has been removed, use pino.final instead')
    }
    if ('changeLevelName' in opts) {
      process.emitWarning(
        'The changeLevelName option is deprecated and will be removed in v7. Use levelKey instead.',
        { code: 'changeLevelName_deprecation' }
      )
      opts.levelKey = opts.changeLevelName
      delete opts.changeLevelName
    }
    const { enabled, prettyPrint, prettifier, messageKey } = opts
    if (enabled === false) opts.level = 'silent'
    stream = stream || process.stdout
    if (stream === process.stdout && stream.fd >= 0 && !hasBeenTampered(stream)) {
      stream = buildSafeSonicBoom({ fd: stream.fd, sync: true })
    }
    if (prettyPrint) {
      warning.emit('PINODEP008')
      const prettyOpts = Object.assign({ messageKey }, prettyPrint)
      stream = getPrettyStream(prettyOpts, prettifier, stream, instance)
    }
    return { opts, stream }
  }
}

function final (logger, handler) {
  const major = Number(process.versions.node.split('.')[0])
  if (major >= 14) warning.emit('PINODEP009')

  if (typeof logger === 'undefined' || typeof logger.child !== 'function') {
    throw Error('expected a pino logger instance')
  }
  const hasHandler = (typeof handler !== 'undefined')
  if (hasHandler && typeof handler !== 'function') {
    throw Error('if supplied, the handler parameter should be a function')
  }
  const stream = logger[streamSym]
  if (typeof stream.flushSync !== 'function') {
    throw Error('final requires a stream that has a flushSync method, such as pino.destination')
  }

  const finalLogger = new Proxy(logger, {
    get: (logger, key) => {
      if (key in logger.levels.values) {
        return (...args) => {
          logger[key](...args)
          stream.flushSync()
        }
      }
      return logger[key]
    }
  })

  if (!hasHandler) {
    try {
      stream.flushSync()
    } catch {
      // it's too late to wait for the stream to be ready
      // because this is a final tick scenario.
      // in practice there shouldn't be a situation where it isn't
      // however, swallow the error just in case (and for easier testing)
    }
    return finalLogger
  }

  return (err = null, ...args) => {
    try {
      stream.flushSync()
    } catch (e) {
      // it's too late to wait for the stream to be ready
      // because this is a final tick scenario.
      // in practice there shouldn't be a situation where it isn't
      // however, swallow the error just in case (and for easier testing)
    }
    return handler(err, finalLogger, ...args)
  }
}

function stringify (obj, stringifySafeFn) {
  try {
    return JSON.stringify(obj)
  } catch (_) {
    try {
      const stringify = stringifySafeFn || this[stringifySafeSym]
      return stringify(obj)
    } catch (_) {
      return '"[unable to serialize, circular reference is too complex to analyze]"'
    }
  }
}

function buildFormatters (level, bindings, log) {
  return {
    level,
    bindings,
    log
  }
}

function setMetadataProps (dest, that) {
  if (dest[needsMetadataGsym] === true) {
    dest.lastLevel = that.lastLevel
    dest.lastMsg = that.lastMsg
    dest.lastObj = that.lastObj
    dest.lastTime = that.lastTime
    dest.lastLogger = that.lastLogger
  }
}

/**
 * Convert a string integer file descriptor to a proper native integer
 * file descriptor.
 *
 * @param {string} destination The file descriptor string to attempt to convert.
 *
 * @returns {Number}
 */
function normalizeDestFileDescriptor (destination) {
  const fd = Number(destination)
  if (typeof destination === 'string' && Number.isFinite(fd)) {
    return fd
  }
  return destination
}

module.exports = {
  noop,
  buildSafeSonicBoom,
  getPrettyStream,
  asChindings,
  asJson,
  genLog,
  createArgsNormalizer,
  final,
  stringify,
  buildFormatters,
  normalizeDestFileDescriptor
}


/***/ }),

/***/ 4011:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { createRequire } = __webpack_require__(98188)
const getCallers = __webpack_require__(17444)
const { join, isAbsolute } = __webpack_require__(71017)
const sleep = __webpack_require__(34338)

let onExit

if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) {
  // This require MUST be top level otherwise the transport would
  // not work from within Jest as it hijacks require.
  onExit = __webpack_require__(22858)
}

const ThreadStream = __webpack_require__(71944)

function setupOnExit (stream) {
  /* istanbul ignore next */
  if (onExit) {
    // This is leak free, it does not leave event handlers
    onExit.register(stream, autoEnd)

    stream.on('close', function () {
      onExit.unregister(stream)
    })
  } else {
    const fn = autoEnd.bind(null, stream)
    process.once('beforeExit', fn)
    process.once('exit', fn)

    stream.on('close', function () {
      process.removeListener('beforeExit', fn)
      process.removeListener('exit', fn)
    })
  }
}

function buildStream (filename, workerData, workerOpts) {
  const stream = new ThreadStream({
    filename,
    workerData,
    workerOpts
  })

  stream.on('ready', onReady)
  stream.on('close', function () {
    process.removeListener('exit', onExit)
  })

  process.on('exit', onExit)

  function onReady () {
    process.removeListener('exit', onExit)
    stream.unref()

    if (workerOpts.autoEnd !== false) {
      setupOnExit(stream)
    }
  }

  function onExit () {
    if (stream.closed) {
      return
    }
    stream.flushSync()
    // Apparently there is a very sporadic race condition
    // that in certain OS would prevent the messages to be flushed
    // because the thread might not have been created still.
    // Unfortunately we need to sleep(100) in this case.
    sleep(100)
    stream.end()
  }

  return stream
}

function autoEnd (stream) {
  stream.ref()
  stream.flushSync()
  stream.end()
  stream.once('close', function () {
    stream.unref()
  })
}

function transport (fullOptions) {
  const { pipeline, targets, levels, options = {}, worker = {}, caller = getCallers() } = fullOptions

  // Backwards compatibility
  const callers = typeof caller === 'string' ? [caller] : caller

  // This will be eventually modified by bundlers
  const bundlerOverrides = '__bundlerPathsOverrides' in globalThis ? globalThis.__bundlerPathsOverrides : {}

  let target = fullOptions.target

  if (target && targets) {
    throw new Error('only one of target or targets can be specified')
  }

  if (targets) {
    target = bundlerOverrides['pino-worker'] || join(__dirname, 'worker.js')
    options.targets = targets.map((dest) => {
      return {
        ...dest,
        target: fixTarget(dest.target)
      }
    })
  } else if (pipeline) {
    target = bundlerOverrides['pino-pipeline-worker'] || join(__dirname, 'worker-pipeline.js')
    options.targets = pipeline.map((dest) => {
      return {
        ...dest,
        target: fixTarget(dest.target)
      }
    })
  }

  if (levels) {
    options.levels = levels
  }

  return buildStream(fixTarget(target), options, worker)

  function fixTarget (origin) {
    origin = bundlerOverrides[origin] || origin

    if (isAbsolute(origin) || origin.indexOf('file://') === 0) {
      return origin
    }

    if (origin === 'pino/file') {
      return join(__dirname, '..', 'file.js')
    }

    let fixTarget

    for (const filePath of callers) {
      try {
        fixTarget = createRequire(filePath).resolve(origin)
        break
      } catch (err) {
        // Silent catch
        continue
      }
    }

    if (!fixTarget) {
      throw new Error(`unable to determine transport target for "${origin}"`)
    }

    return fixTarget
  }
}

module.exports = transport


/***/ }),

/***/ 55312:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint no-prototype-builtins: 0 */
const os = __webpack_require__(22037)
const stdSerializers = __webpack_require__(70480)
const caller = __webpack_require__(17444)
const redaction = __webpack_require__(90570)
const time = __webpack_require__(89411)
const proto = __webpack_require__(75262)
const symbols = __webpack_require__(82818)
const { configure } = __webpack_require__(66354)
const { assertDefaultLevelFound, mappings, genLsCache, levels } = __webpack_require__(30888)
const {
  createArgsNormalizer,
  asChindings,
  final,
  buildSafeSonicBoom,
  buildFormatters,
  stringify,
  normalizeDestFileDescriptor,
  noop
} = __webpack_require__(1223)
const { version } = __webpack_require__(82522)
const {
  chindingsSym,
  redactFmtSym,
  serializersSym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  stringifySym,
  stringifySafeSym,
  stringifiersSym,
  setLevelSym,
  endSym,
  formatOptsSym,
  messageKeySym,
  nestedKeySym,
  mixinSym,
  useOnlyCustomLevelsSym,
  formattersSym,
  hooksSym,
  nestedKeyStrSym,
  mixinMergeStrategySym
} = symbols
const { epochTime, nullTime } = time
const { pid } = process
const hostname = os.hostname()
const defaultErrorSerializer = stdSerializers.err
const defaultOptions = {
  level: 'info',
  levels,
  messageKey: 'msg',
  nestedKey: null,
  enabled: true,
  prettyPrint: false,
  base: { pid, hostname },
  serializers: Object.assign(Object.create(null), {
    err: defaultErrorSerializer
  }),
  formatters: Object.assign(Object.create(null), {
    bindings (bindings) {
      return bindings
    },
    level (label, number) {
      return { level: number }
    }
  }),
  hooks: {
    logMethod: undefined
  },
  timestamp: epochTime,
  name: undefined,
  redact: null,
  customLevels: null,
  useOnlyCustomLevels: false,
  depthLimit: 5,
  edgeLimit: 100
}

const normalize = createArgsNormalizer(defaultOptions)

const serializers = Object.assign(Object.create(null), stdSerializers)

function pino (...args) {
  const instance = {}
  const { opts, stream } = normalize(instance, caller(), ...args)
  const {
    redact,
    crlf,
    serializers,
    timestamp,
    messageKey,
    nestedKey,
    base,
    name,
    level,
    customLevels,
    mixin,
    mixinMergeStrategy,
    useOnlyCustomLevels,
    formatters,
    hooks,
    depthLimit,
    edgeLimit
  } = opts

  const stringifySafe = configure({
    maximumDepth: depthLimit,
    maximumBreadth: edgeLimit
  })

  const allFormatters = buildFormatters(
    formatters.level,
    formatters.bindings,
    formatters.log
  )

  const stringifiers = redact ? redaction(redact, stringify) : {}
  const stringifyFn = stringify.bind({
    [stringifySafeSym]: stringifySafe
  })
  const formatOpts = redact
    ? { stringify: stringifiers[redactFmtSym] }
    : { stringify: stringifyFn }
  const end = '}' + (crlf ? '\r\n' : '\n')
  const coreChindings = asChindings.bind(null, {
    [chindingsSym]: '',
    [serializersSym]: serializers,
    [stringifiersSym]: stringifiers,
    [stringifySym]: stringify,
    [stringifySafeSym]: stringifySafe,
    [formattersSym]: allFormatters
  })

  let chindings = ''
  if (base !== null) {
    if (name === undefined) {
      chindings = coreChindings(base)
    } else {
      chindings = coreChindings(Object.assign({}, base, { name }))
    }
  }

  const time = (timestamp instanceof Function)
    ? timestamp
    : (timestamp ? epochTime : nullTime)
  const timeSliceIndex = time().indexOf(':') + 1

  if (useOnlyCustomLevels && !customLevels) throw Error('customLevels is required if useOnlyCustomLevels is set true')
  if (mixin && typeof mixin !== 'function') throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`)

  assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels)
  const levels = mappings(customLevels, useOnlyCustomLevels)

  Object.assign(instance, {
    levels,
    [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
    [streamSym]: stream,
    [timeSym]: time,
    [timeSliceIndexSym]: timeSliceIndex,
    [stringifySym]: stringify,
    [stringifySafeSym]: stringifySafe,
    [stringifiersSym]: stringifiers,
    [endSym]: end,
    [formatOptsSym]: formatOpts,
    [messageKeySym]: messageKey,
    [nestedKeySym]: nestedKey,
    // protect against injection
    [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : '',
    [serializersSym]: serializers,
    [mixinSym]: mixin,
    [mixinMergeStrategySym]: mixinMergeStrategy,
    [chindingsSym]: chindings,
    [formattersSym]: allFormatters,
    [hooksSym]: hooks,
    silent: noop
  })

  Object.setPrototypeOf(instance, proto())

  genLsCache(instance)

  instance[setLevelSym](level)

  return instance
}

module.exports = pino

module.exports.destination = (dest = process.stdout.fd) => {
  if (typeof dest === 'object') {
    dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd)
    return buildSafeSonicBoom(dest)
  } else {
    return buildSafeSonicBoom({ dest: normalizeDestFileDescriptor(dest), minLength: 0, sync: true })
  }
}

module.exports.transport = __webpack_require__(4011)
module.exports.multistream = __webpack_require__(18382)

module.exports.final = final
module.exports.levels = mappings()
module.exports.stdSerializers = serializers
module.exports.stdTimeFunctions = Object.assign({}, time)
module.exports.symbols = symbols
module.exports.version = version

// Enables default and name export with TypeScript and Babel
module.exports["default"] = pino
module.exports.pino = pino


/***/ }),

/***/ 99490:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(57147)
const EventEmitter = __webpack_require__(82361)
const inherits = (__webpack_require__(73837).inherits)
const path = __webpack_require__(71017)
const sleep = __webpack_require__(34338)

const BUSY_WRITE_TIMEOUT = 100

// 16 KB. Don't write more than docker buffer size.
// https://github.com/moby/moby/blob/513ec73831269947d38a644c278ce3cac36783b2/daemon/logger/copier.go#L13
const MAX_WRITE = 16 * 1024

function openFile (file, sonic) {
  sonic._opening = true
  sonic._writing = true
  sonic._asyncDrainScheduled = false

  // NOTE: 'error' and 'ready' events emitted below only relevant when sonic.sync===false
  // for sync mode, there is no way to add a listener that will receive these

  function fileOpened (err, fd) {
    if (err) {
      sonic._reopening = false
      sonic._writing = false
      sonic._opening = false

      if (sonic.sync) {
        process.nextTick(() => {
          if (sonic.listenerCount('error') > 0) {
            sonic.emit('error', err)
          }
        })
      } else {
        sonic.emit('error', err)
      }
      return
    }

    sonic.fd = fd
    sonic.file = file
    sonic._reopening = false
    sonic._opening = false
    sonic._writing = false

    if (sonic.sync) {
      process.nextTick(() => sonic.emit('ready'))
    } else {
      sonic.emit('ready')
    }

    if (sonic._reopening) {
      return
    }

    // start
    if (!sonic._writing && sonic._len > sonic.minLength && !sonic.destroyed) {
      actualWrite(sonic)
    }
  }

  const flags = sonic.append ? 'a' : 'w'
  const mode = sonic.mode

  if (sonic.sync) {
    try {
      if (sonic.mkdir) fs.mkdirSync(path.dirname(file), { recursive: true })
      const fd = fs.openSync(file, flags, mode)
      fileOpened(null, fd)
    } catch (err) {
      fileOpened(err)
      throw err
    }
  } else if (sonic.mkdir) {
    fs.mkdir(path.dirname(file), { recursive: true }, (err) => {
      if (err) return fileOpened(err)
      fs.open(file, flags, mode, fileOpened)
    })
  } else {
    fs.open(file, flags, mode, fileOpened)
  }
}

function SonicBoom (opts) {
  if (!(this instanceof SonicBoom)) {
    return new SonicBoom(opts)
  }

  let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mode, mkdir, retryEAGAIN } = opts || {}

  fd = fd || dest

  this._bufs = []
  this._len = 0
  this.fd = -1
  this._writing = false
  this._writingBuf = ''
  this._ending = false
  this._reopening = false
  this._asyncDrainScheduled = false
  this._hwm = Math.max(minLength || 0, 16387)
  this.file = null
  this.destroyed = false
  this.minLength = minLength || 0
  this.maxLength = maxLength || 0
  this.maxWrite = maxWrite || MAX_WRITE
  this.sync = sync || false
  this.append = append || false
  this.mode = mode
  this.retryEAGAIN = retryEAGAIN || (() => true)
  this.mkdir = mkdir || false

  if (typeof fd === 'number') {
    this.fd = fd
    process.nextTick(() => this.emit('ready'))
  } else if (typeof fd === 'string') {
    openFile(fd, this)
  } else {
    throw new Error('SonicBoom supports only file descriptors and files')
  }
  if (this.minLength >= this.maxWrite) {
    throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`)
  }

  this.release = (err, n) => {
    if (err) {
      if (err.code === 'EAGAIN' && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {
        if (this.sync) {
          // This error code should not happen in sync mode, because it is
          // not using the underlining operating system asynchronous functions.
          // However it happens, and so we handle it.
          // Ref: https://github.com/pinojs/pino/issues/783
          try {
            sleep(BUSY_WRITE_TIMEOUT)
            this.release(undefined, 0)
          } catch (err) {
            this.release(err)
          }
        } else {
          // Let's give the destination some time to process the chunk.
          setTimeout(() => {
            fs.write(this.fd, this._writingBuf, 'utf8', this.release)
          }, BUSY_WRITE_TIMEOUT)
        }
      } else {
        this._writing = false

        this.emit('error', err)
      }
      return
    }
    this.emit('write', n)

    this._len -= n
    this._writingBuf = this._writingBuf.slice(n)

    if (this._writingBuf.length) {
      if (!this.sync) {
        fs.write(this.fd, this._writingBuf, 'utf8', this.release)
        return
      }

      try {
        do {
          const n = fs.writeSync(this.fd, this._writingBuf, 'utf8')
          this._len -= n
          this._writingBuf = this._writingBuf.slice(n)
        } while (this._writingBuf)
      } catch (err) {
        this.release(err)
        return
      }
    }

    const len = this._len
    if (this._reopening) {
      this._writing = false
      this._reopening = false
      this.reopen()
    } else if (len > this.minLength) {
      actualWrite(this)
    } else if (this._ending) {
      if (len > 0) {
        actualWrite(this)
      } else {
        this._writing = false
        actualClose(this)
      }
    } else {
      this._writing = false
      if (this.sync) {
        if (!this._asyncDrainScheduled) {
          this._asyncDrainScheduled = true
          process.nextTick(emitDrain, this)
        }
      } else {
        this.emit('drain')
      }
    }
  }

  this.on('newListener', function (name) {
    if (name === 'drain') {
      this._asyncDrainScheduled = false
    }
  })
}

function emitDrain (sonic) {
  const hasListeners = sonic.listenerCount('drain') > 0
  if (!hasListeners) return
  sonic._asyncDrainScheduled = false
  sonic.emit('drain')
}

inherits(SonicBoom, EventEmitter)

SonicBoom.prototype.write = function (data) {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  const len = this._len + data.length
  const bufs = this._bufs

  if (this.maxLength && len > this.maxLength) {
    this.emit('drop', data)
    return this._len < this._hwm
  }

  if (
    bufs.length === 0 ||
    bufs[bufs.length - 1].length + data.length > this.maxWrite
  ) {
    bufs.push('' + data)
  } else {
    bufs[bufs.length - 1] += data
  }

  this._len = len

  if (!this._writing && this._len >= this.minLength) {
    actualWrite(this)
  }

  return this._len < this._hwm
}

SonicBoom.prototype.flush = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._writing || this.minLength <= 0) {
    return
  }

  if (this._bufs.length === 0) {
    this._bufs.push('')
  }

  actualWrite(this)
}

SonicBoom.prototype.reopen = function (file) {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._opening) {
    this.once('ready', () => {
      this.reopen(file)
    })
    return
  }

  if (this._ending) {
    return
  }

  if (!this.file) {
    throw new Error('Unable to reopen a file descriptor, you must pass a file to SonicBoom')
  }

  this._reopening = true

  if (this._writing) {
    return
  }

  const fd = this.fd
  this.once('ready', () => {
    if (fd !== this.fd) {
      fs.close(fd, (err) => {
        if (err) {
          return this.emit('error', err)
        }
      })
    }
  })

  openFile(file || this.file, this)
}

SonicBoom.prototype.end = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._opening) {
    this.once('ready', () => {
      this.end()
    })
    return
  }

  if (this._ending) {
    return
  }

  this._ending = true

  if (this._writing) {
    return
  }

  if (this._len > 0 && this.fd >= 0) {
    actualWrite(this)
  } else {
    actualClose(this)
  }
}

SonicBoom.prototype.flushSync = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this.fd < 0) {
    throw new Error('sonic boom is not ready yet')
  }

  if (!this._writing && this._writingBuf.length > 0) {
    this._bufs.unshift(this._writingBuf)
    this._writingBuf = ''
  }

  while (this._bufs.length) {
    const buf = this._bufs[0]
    try {
      this._len -= fs.writeSync(this.fd, buf, 'utf8')
      this._bufs.shift()
    } catch (err) {
      if (err.code !== 'EAGAIN' || !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
        throw err
      }

      sleep(BUSY_WRITE_TIMEOUT)
    }
  }
}

SonicBoom.prototype.destroy = function () {
  if (this.destroyed) {
    return
  }
  actualClose(this)
}

function actualWrite (sonic) {
  const release = sonic.release
  sonic._writing = true
  sonic._writingBuf = sonic._writingBuf || sonic._bufs.shift() || ''

  if (sonic.sync) {
    try {
      const written = fs.writeSync(sonic.fd, sonic._writingBuf, 'utf8')
      release(null, written)
    } catch (err) {
      release(err)
    }
  } else {
    fs.write(sonic.fd, sonic._writingBuf, 'utf8', release)
  }
}

function actualClose (sonic) {
  if (sonic.fd === -1) {
    sonic.once('ready', actualClose.bind(null, sonic))
    return
  }

  sonic.destroyed = true
  sonic._bufs = []

  if (sonic.fd !== 1 && sonic.fd !== 2) {
    fs.close(sonic.fd, done)
  } else {
    setImmediate(done)
  }

  function done (err) {
    if (err) {
      sonic.emit('error', err)
      return
    }

    if (sonic._ending && !sonic._writing) {
      sonic.emit('finish')
    }
    sonic.emit('close')
  }
}

/**
 * These export configurations enable JS and TS developers
 * to consumer SonicBoom in whatever way best suits their needs.
 * Some examples of supported import syntax includes:
 * - `const SonicBoom = require('SonicBoom')`
 * - `const { SonicBoom } = require('SonicBoom')`
 * - `import * as SonicBoom from 'SonicBoom'`
 * - `import { SonicBoom } from 'SonicBoom'`
 * - `import SonicBoom from 'SonicBoom'`
 */
SonicBoom.SonicBoom = SonicBoom
SonicBoom.default = SonicBoom
module.exports = SonicBoom


/***/ }),

/***/ 19780:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"pino","version":"7.11.0","description":"super fast, all natural json logger","main":"pino.js","type":"commonjs","types":"pino.d.ts","browser":"./browser.js","files":["pino.js","file.js","pino.d.ts","bin.js","browser.js","pretty.js","usage.txt","test","docs","example.js","lib"],"scripts":{"docs":"docsify serve","browser-test":"airtap --local 8080 test/browser*test.js","lint":"eslint .","test":"npm run lint && npm run transpile && tap --ts && jest test/jest && npm run test-types","test-ci":"npm run lint && npm run transpile && tap --ts --no-check-coverage --coverage-report=lcovonly && npm run test-types","test-ci-pnpm":"pnpm run lint && npm run transpile && tap --ts --no-coverage --no-check-coverage && pnpm run test-types","test-ci-yarn-pnp":"yarn run lint && npm run transpile && tap --ts --no-check-coverage --coverage-report=lcovonly","test-types":"tsc && tsd && ts-node test/types/pino.ts","transpile":"node ./test/fixtures/ts/transpile.cjs","cov-ui":"tap --ts --coverage-report=html","bench":"node benchmarks/utils/runbench all","bench-basic":"node benchmarks/utils/runbench basic","bench-object":"node benchmarks/utils/runbench object","bench-deep-object":"node benchmarks/utils/runbench deep-object","bench-multi-arg":"node benchmarks/utils/runbench multi-arg","bench-longs-tring":"node benchmarks/utils/runbench long-string","bench-child":"node benchmarks/utils/runbench child","bench-child-child":"node benchmarks/utils/runbench child-child","bench-child-creation":"node benchmarks/utils/runbench child-creation","bench-formatters":"node benchmarks/utils/runbench formatters","update-bench-doc":"node benchmarks/utils/generate-benchmark-doc > docs/benchmarks.md"},"bin":{"pino":"./bin.js"},"precommit":"test","repository":{"type":"git","url":"git+https://github.com/pinojs/pino.git"},"keywords":["fast","logger","stream","json"],"author":"Matteo Collina <hello@matteocollina.com>","contributors":["David Mark Clements <huperekchuno@googlemail.com>","James Sumners <james.sumners@gmail.com>","Thomas Watson Steen <w@tson.dk> (https://twitter.com/wa7son)"],"license":"MIT","bugs":{"url":"https://github.com/pinojs/pino/issues"},"homepage":"http://getpino.io","devDependencies":{"@types/flush-write-stream":"^1.0.0","@types/node":"^17.0.0","@types/tap":"^15.0.6","airtap":"4.0.4","benchmark":"^2.1.4","bole":"^4.0.0","bunyan":"^1.8.14","docsify-cli":"^4.4.1","eslint":"^7.17.0","eslint-config-standard":"^16.0.3","eslint-plugin-import":"^2.22.1","eslint-plugin-node":"^11.1.0","eslint-plugin-promise":"^5.1.0","execa":"^5.0.0","fastbench":"^1.0.1","flush-write-stream":"^2.0.0","import-fresh":"^3.2.1","jest":"^27.3.1","log":"^6.0.0","loglevel":"^1.6.7","pino-pretty":"^v7.6.0","pre-commit":"^1.2.2","proxyquire":"^2.1.3","pump":"^3.0.0","rimraf":"^3.0.2","semver":"^7.0.0","split2":"^4.0.0","steed":"^1.1.3","strip-ansi":"^6.0.0","tap":"^16.0.0","tape":"^5.0.0","through2":"^4.0.0","ts-node":"^10.7.0","tsd":"^0.20.0","typescript":"^4.4.4","winston":"^3.3.3"},"dependencies":{"atomic-sleep":"^1.0.0","fast-redact":"^3.0.0","on-exit-leak-free":"^0.2.0","pino-abstract-transport":"v0.5.0","pino-std-serializers":"^4.0.0","process-warning":"^1.0.0","quick-format-unescaped":"^4.0.3","real-require":"^0.1.0","safe-stable-stringify":"^2.1.0","sonic-boom":"^2.2.1","thread-stream":"^0.15.1"},"tsd":{"directory":"test/types"}}');

/***/ })

};
;