"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture, type OGLRenderingContext } from 'ogl';

type GL = OGLRenderingContext;
type OGLProgram = Program;
type OGLMesh = Mesh;
type OGLTransform = Transform;
type OGLPlane = Plane;

interface ScreenSize {
  width: number;
  height: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

interface ScrollState {
  position?: number;
  ease: number;
  current: number;
  target: number;
  last: number;
}

interface AutoBindOptions {
  include?: Array<string | RegExp>;
  exclude?: Array<string | RegExp>;
}

interface MediaParams {
  gl: GL;
  geometry: OGLPlane;
  scene: OGLTransform;
  screen: ScreenSize;
  viewport: ViewportSize;
  image: string;
  length: number;
  index: number;
  distortion: number;
}

interface CanvasParams {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  items: string[];
  distortion: number;
  scrollEase: number;
  cameraFov: number;
  cameraZ: number;
  onIndexChange: (idx: number) => void;
}

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;
  
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  
  float absProgress = abs(uPosition);
  float signProgress = uPosition < 0.0 ? -1.0 : (uPosition > 0.0 ? 1.0 : 0.0);
  
  // Calculate localprogress with distortion offset
  float localprogress = clamp(
    (absProgress - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    1.
  );
  
  // Ensure that when absProgress is exactly 0.0, localprogress is exactly 0.0
  // to make the card perfectly flat when active.
  localprogress = localprogress * smoothstep(0.0, 0.15, absProgress);
  
  // Apply sign and ease
  localprogress = qinticInOut(localprogress) * signProgress * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

function AutoBind(self: any, { include, exclude }: AutoBindOptions = {}) {
  const getAllProperties = (object: any): Set<[any, string | symbol]> => {
    const properties = new Set<[any, string | symbol]>();
    do {
      for (const key of Reflect.ownKeys(object)) {
        properties.add([object, key]);
      }
    } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);
    return properties;
  };

  const filter = (key: string | symbol) => {
    const match = (pattern: string | RegExp) =>
      typeof pattern === 'string' ? key === pattern : (pattern as RegExp).test(key.toString());

    if (include) return include.some(match);
    if (exclude) return !exclude.some(match);
    return true;
  };

  for (const [object, key] of Array.from(getAllProperties(self.constructor.prototype))) {
    if (key === 'constructor' || !filter(key)) continue;
    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    if (descriptor && typeof descriptor.value === 'function') {
      self[key] = self[key].bind(self);
    }
  }
  return self;
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function map(num: number, min1: number, max1: number, min2: number, max2: number, round = false): number {
  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;
  return round ? Math.round(num2) : num2;
}

class Media {
  gl: GL;
  geometry: OGLPlane;
  scene: OGLTransform;
  screen: ScreenSize;
  viewport: ViewportSize;
  image: string;
  length: number;
  index: number;
  distortion: number;

  planeWidth = 0;
  planeHeight = 0;
  program!: OGLProgram;
  plane!: OGLMesh;
  extra = 0;
  padding = 0;
  height = 0;
  heightTotal = 0;
  y = 0;

  constructor({
    gl,
    geometry,
    scene,
    screen,
    viewport,
    image,
    length,
    index,
    distortion
  }: MediaParams) {
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.image = image;
    this.length = length;
    this.index = index;
    this.distortion = distortion;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 0 }
      },
      cullFace: false
    });

    const img = new Image();
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  setScale() {
    this.plane.scale.x = (this.viewport.width * this.planeWidth) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * this.planeHeight) / this.screen.height;
    this.plane.position.x = 0;
    this.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  onResize({ screen, viewport }: { screen?: ScreenSize; viewport?: ViewportSize } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      this.program.uniforms.uViewportSize.value = [viewport.width, viewport.height];
    }
    
    // Make the plane fill 85% of screen height and width (with nice margin)
    this.planeWidth = this.screen.width * 0.85;
    this.planeHeight = this.screen.height * 0.85;
    this.setScale();

    this.padding = 20;
    this.height = this.plane.scale.y + (this.viewport.height * this.padding) / this.screen.height;
    this.heightTotal = this.height * this.length;
    this.y = this.index * this.height;
  }

  update(scroll: ScrollState) {
    this.plane.position.y = this.y - scroll.current;
    const position = this.plane.position.y / this.height;

    this.program.uniforms.uPosition.value = position;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current;
  }
}

class Canvas {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  items: string[];
  distortion: number;
  scroll: ScrollState;
  cameraFov: number;
  cameraZ: number;
  onIndexChange: (idx: number) => void;

  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: OGLTransform;
  planeGeometry!: OGLPlane;
  medias!: Media[];
  screen!: ScreenSize;
  viewport!: ViewportSize;
  isDown = false;
  start = 0;
  loaded = 0;
  animationFrameId = 0;
  wheelTimeout: any = null;
  lastActiveIndex = 0;

  constructor({
    container,
    canvas,
    items,
    distortion,
    scrollEase,
    cameraFov,
    cameraZ,
    onIndexChange
  }: CanvasParams) {
    this.container = container;
    this.canvas = canvas;
    this.items = items;
    this.distortion = distortion;
    this.scroll = {
      ease: scrollEase,
      current: 0,
      target: 0,
      last: 0
    };
    this.cameraFov = cameraFov;
    this.cameraZ = cameraZ;
    this.onIndexChange = onIndexChange;

    AutoBind(this);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2)
    });
    this.gl = this.renderer.gl;
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = this.cameraFov;
    this.camera.position.z = this.cameraZ;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 1,
      widthSegments: 100
    });
  }

  createMedias() {
    this.medias = this.items.map(
      (image, index) =>
        new Media({
          gl: this.gl,
          geometry: this.planeGeometry,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport,
          image,
          length: this.items.length,
          index,
          distortion: this.distortion
        })
    );
  }

  onResize() {
    const rect = this.container.getBoundingClientRect();
    this.screen = { width: rect.width, height: rect.height };
    this.renderer.setSize(this.screen.width, this.screen.height);

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    this.medias?.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown || this.scroll.position === undefined) return;
    const y = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    const distance = (this.start - y) * 0.05;
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
    if (this.medias && this.medias.length > 0) {
      const itemHeight = this.medias[0].height;
      const closestSlide = Math.round(this.scroll.target / itemHeight);
      this.scroll.target = closestSlide * itemHeight;
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);
    
    this.scroll.target += e.deltaY * 0.003;
    
    this.wheelTimeout = setTimeout(() => {
      if (this.medias && this.medias.length > 0) {
        const itemHeight = this.medias[0].height;
        const closestSlide = Math.round(this.scroll.target / itemHeight);
        this.scroll.target = closestSlide * itemHeight;
      }
    }, 150);
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    this.medias?.forEach(media => media.update(this.scroll));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;

    // Synchronize current slide index back to React
    if (this.medias && this.medias.length > 0) {
      const itemHeight = this.medias[0].height;
      const rawIndex = this.scroll.current / itemHeight;
      const total = this.items.length;
      const roundedIndex = ((Math.round(rawIndex) % total) + total) % total;
      if (roundedIndex !== this.lastActiveIndex) {
        this.lastActiveIndex = roundedIndex;
        this.onIndexChange(roundedIndex);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.update);
  }

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('wheel', this.onWheel);
    window.addEventListener('mousedown', this.onTouchDown);
    window.addEventListener('mousemove', this.onTouchMove);
    window.addEventListener('mouseup', this.onTouchUp);
    window.addEventListener('touchstart', this.onTouchDown as EventListener);
    window.addEventListener('touchmove', this.onTouchMove as EventListener);
    window.addEventListener('touchend', this.onTouchUp as EventListener);
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.wheelTimeout) clearTimeout(this.wheelTimeout);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mousedown', this.onTouchDown);
    window.removeEventListener('mousemove', this.onTouchMove);
    window.removeEventListener('mouseup', this.onTouchUp);
    window.removeEventListener('touchstart', this.onTouchDown as EventListener);
    window.removeEventListener('touchmove', this.onTouchMove as EventListener);
    window.removeEventListener('touchend', this.onTouchUp as EventListener);
  }
}

const ArrowButton = ({ isLeft, hovered, onClick }: { isLeft: boolean; hovered: boolean; onClick: () => void }) => {
  const [btnHovered, setBtnHovered] = React.useState(false);
  return (
    <motion.button
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      initial={{ opacity: 0, x: isLeft ? -8 : 8, y: "-50%" }}
      animate={{ 
        opacity: hovered ? 1 : 0, 
        x: hovered ? 0 : (isLeft ? -8 : 8),
        y: "-50%",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ scale: 1.12, backgroundColor: "#232F3E", borderColor: "#232F3E" }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(35,47,62,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        zIndex: 10,
        ...(isLeft ? { left: "-22px" } : { right: "-22px" })
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={btnHovered ? "#FFFFFF" : "#232F3E"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
        {isLeft ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </motion.button>
  );
};

const STORIES = [
  {
    id: "s1",
    title: "Who We Are",
    desc: "A student-led cloud community at Rajalakshmi Engineering College focused on learning, building, and growing with AWS technologies."
  },
  {
    id: "s2",
    title: "What We Do",
    desc: "We organize workshops, technical sessions, hackathons, and collaborative projects that help students gain practical cloud experience."
  },
  {
    id: "s3",
    title: "Why Join Us",
    desc: "Gain hands-on skills, build your network, explore emerging technologies, and become part of a supportive learning ecosystem."
  },
  {
    id: "s4",
    title: "Our Mission",
    desc: "To empower students with industry-relevant cloud knowledge and prepare them for future careers in technology."
  },
  {
    id: "s5",
    title: "Our Community",
    desc: "A diverse group of learners, developers, innovators, and aspiring cloud professionals who grow together through collaboration."
  },
  {
    id: "s6",
    title: "Your Journey Starts Here",
    desc: "Whether you're a beginner or an experienced builder, AWS SBG REC provides opportunities to learn, create, and lead."
  },
  {
    id: "s7",
    title: "What We Offer",
    desc: "Hands-on AWS workshops, certification prep, hackathons, mentorship sessions, and real project experience that transforms students into cloud professionals."
  },
  {
    id: "s9",
    title: "Join the Movement",
    desc: "Whether you are a complete beginner or an experienced developer, AWS SBG REC welcomes you. Start your cloud journey with a community that builds together."
  },
  {
    id: "s10",
    title: "Our Values",
    desc: "Learn by doing. Share what you know. Build what matters. We believe in open collaboration, peer mentorship, and the power of community-driven cloud innovation."
  }
];

const generateSlideImage = (title: string, desc: string): string => {
  if (typeof window === "undefined") return "";
  const width = 1040;
  const height = 640;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Card background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#FFFFFF");
  bgGrad.addColorStop(0.25, "#E8F4FD");
  bgGrad.addColorStop(0.6, "#FFF3E0");
  bgGrad.addColorStop(1, "#FFFFFF");
  ctx.fillStyle = bgGrad;
  
  const radius = 64;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, radius);
  ctx.fill();

  // 2. Spotlight Glows
  // Blue glow top-left
  const blueGlow = ctx.createRadialGradient(280, 140, 0, 280, 140, 360);
  blueGlow.addColorStop(0, "rgba(0, 115, 187, 0.14)");
  blueGlow.addColorStop(1, "rgba(0, 115, 187, 0)");
  ctx.fillStyle = blueGlow;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, radius);
  ctx.fill();

  // Orange glow bottom-right
  const orangeGlow = ctx.createRadialGradient(760, 500, 0, 760, 500, 360);
  orangeGlow.addColorStop(0, "rgba(255, 153, 0, 0.18)");
  orangeGlow.addColorStop(1, "rgba(255, 153, 0, 0)");
  ctx.fillStyle = orangeGlow;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, radius);
  ctx.fill();

  // 3. Gradient border stroke
  const strokeGrad = ctx.createLinearGradient(0, 0, width, height);
  strokeGrad.addColorStop(0, "#FFFFFF");
  strokeGrad.addColorStop(0.4, "#0073BB");
  strokeGrad.addColorStop(0.7, "#FF9900");
  strokeGrad.addColorStop(1, "#FFFFFF");
  ctx.strokeStyle = strokeGrad;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(2.5, 2.5, width - 5, height - 5, radius - 2.5);
  ctx.stroke();

  // 4. Wrap description text and measure to compute dynamic Y centering
  ctx.font = "500 36px system-ui, -apple-system, sans-serif";
  const words = desc.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  const maxDescWidth = 840;

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxDescWidth && i > 0) {
      lines.push(currentLine.trim());
      currentLine = words[i] + " ";
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  const descLineHeight = 52;
  const descHeight = lines.length * descLineHeight;

  // Title and Accent configurations
  const titleHeight = 60;
  const accentHeight = 4;
  const badgeH = 46;

  // Spacing offsets
  const accentToTitleGap = 16;
  const titleToDescGap = 36;
  const descToBadgeGap = 48;

  // Calculate total content height
  const totalContentHeight = 
    accentHeight + 
    accentToTitleGap + 
    titleHeight + 
    titleToDescGap + 
    descHeight + 
    descToBadgeGap + 
    badgeH;

  // Center vertically
  const startY = (height - totalContentHeight) / 2;

  // 5. Render Orange Accent Line
  ctx.fillStyle = "#FF9900";
  ctx.beginPath();
  ctx.roundRect(width / 2 - 32, startY, 64, accentHeight, 2);
  ctx.fill();

  // 6. Render Title
  ctx.fillStyle = "#232F3E";
  ctx.font = "800 56px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const titleY = startY + accentHeight + accentToTitleGap;
  ctx.fillText(title, width / 2, titleY);

  // 7. Render Description
  ctx.fillStyle = "#4b5563";
  ctx.font = "500 36px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const descStartY = titleY + titleHeight + titleToDescGap;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], width / 2, descStartY + i * descLineHeight);
  }

  // 8. Render Badge
  const badgeText = "AWS SBG REC";
  ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeW = badgeMetrics.width + 48;
  const badgeStartY = descStartY + descHeight + descToBadgeGap;
  const badgeX = width / 2 - badgeW / 2;

  ctx.fillStyle = "rgba(35, 47, 62, 0.06)";
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeStartY, badgeW, badgeH, 23);
  ctx.fill();

  ctx.strokeStyle = "rgba(35, 47, 62, 0.1)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#232F3E";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, width / 2, badgeStartY + badgeH / 2);

  return canvas.toDataURL("image/png");
};

export default function CloudStory() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [slideImages, setSlideImages] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<Canvas | null>(null);
  const totalSlides = STORIES.length;

  // Generate canvas slides on mount
  useEffect(() => {
    const images = STORIES.map(s => generateSlideImage(s.title, s.desc));
    setSlideImages(images);
  }, []);

  // Set up Canvas instance
  useEffect(() => {
    if (slideImages.length === 0 || !canvasRef.current) return;

    const parentContainer = canvasRef.current.parentElement;
    if (!parentContainer) return;

    let canvasInstance: Canvas | null = null;

    try {
      canvasInstance = new Canvas({
        container: parentContainer,
        canvas: canvasRef.current,
        items: slideImages,
        distortion: 3,
        scrollEase: 0.05,
        cameraFov: 45,
        cameraZ: 20,
        onIndexChange: (idx) => {
          setIndex(idx);
        }
      });
    } catch (err) {
      console.warn("CloudStory: WebGL init failed, skipping.", err);
      return;
    }

    instanceRef.current = canvasInstance;

    // Set initial position
    const itemHeight = canvasInstance.medias[0].height;
    canvasInstance.scroll.target = index * itemHeight;
    canvasInstance.scroll.current = index * itemHeight;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      canvasInstance!.onWheel(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Stop animation loop immediately when WebGL context is lost (e.g. during Fast Refresh)
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      canvasInstance!.destroy();
      instanceRef.current = null;
    };

    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasEl.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      canvasInstance!.destroy();
      canvasEl.removeEventListener('wheel', handleWheel);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      instanceRef.current = null;
    };
  }, [slideImages]);

  const nextSlide = () => {
    const nextIdx = index === totalSlides - 1 ? 0 : index + 1;
    setIndex(nextIdx);
    if (instanceRef.current && instanceRef.current.medias) {
      const itemHeight = instanceRef.current.medias[0].height;
      instanceRef.current.scroll.target = nextIdx * itemHeight;
    }
  };

  const prevSlide = () => {
    const prevIdx = index === 0 ? totalSlides - 1 : index - 1;
    setIndex(prevIdx);
    if (instanceRef.current && instanceRef.current.medias) {
      const itemHeight = instanceRef.current.medias[0].height;
      instanceRef.current.scroll.target = prevIdx * itemHeight;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, slideImages]);

  // Auto advance
  useEffect(() => {
    if (isHovered || slideImages.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, index, slideImages]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
      }}
    >
      {/* Container for the canvas card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "650px",
          aspectRatio: "520 / 320",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ArrowButton isLeft={true} hovered={isHovered} onClick={prevSlide} />

        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {slideImages.length > 0 ? (
            <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
          ) : (
            <div style={{ color: "#4b5563", fontSize: "14px", fontWeight: 500 }}>Loading story...</div>
          )}
        </div>

        <ArrowButton isLeft={false} hovered={isHovered} onClick={nextSlide} />
      </div>

      {/* Navigation Dots */}
      <div style={{ display: "flex", gap: "8px", marginTop: "32px", zIndex: 10 }}>
        {(() => {
          const MAX_DOTS = 8;
          let start = 0;
          let end = totalSlides;
          if (totalSlides > MAX_DOTS) {
            start = Math.max(0, Math.min(index - Math.floor(MAX_DOTS / 2), totalSlides - MAX_DOTS));
            end = start + MAX_DOTS;
          }
          const visibleDots = Array.from({ length: totalSlides }).map((_, i) => i).slice(start, end);

          return visibleDots.map((idx) => (
            <button
              key={idx}
              onClick={() => {
                setIndex(idx);
                if (instanceRef.current && instanceRef.current.medias) {
                  const itemHeight = instanceRef.current.medias[0].height;
                  instanceRef.current.scroll.target = idx * itemHeight;
                }
              }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: index === idx ? "#FF9900" : "rgba(35, 47, 62, 0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
                transform: index === idx ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Go to story ${idx + 1}`}
            />
          ));
        })()}
      </div>
    </div>
  );
}
