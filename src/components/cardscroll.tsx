"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { cn } from "@/lib/utils";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  background?: "shader" | "black";
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

// Shader components from SyntheticHero
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_resolution;

  vec2 toPolar(vec2 p) {
      float r = length(p);
      float a = atan(p.y, p.x);
      return vec2(r, a);
  }

  vec2 fromPolar(vec2 polar) {
      return vec2(cos(polar.y), sin(polar.y)) * polar.x;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 p = 6.0 * ((fragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y);

      vec2 polar = toPolar(p);
      float r = polar.x;
      float a = polar.y;

      vec2 i = p;
      float c = 0.0;
      float rot = r + u_time + p.x * 0.100;
      for (float n = 0.0; n < 4.0; n++) {
          float rr = r + 0.15 * sin(u_time*0.7 + float(n) + r*2.0);
          p *= mat2(
              cos(rot - sin(u_time / 10.0)), sin(rot),
              -sin(cos(rot) - u_time / 10.0), cos(rot)
          ) * -0.25;

          float t = r - u_time / (n + 30.0);
          i -= p + sin(t - i.y) + rr;

          c += 2.2 / length(vec2(
              (sin(i.x + t) / 0.15),
              (cos(i.y + t) / 0.15)
          ));
      }

      c /= 8.0;

      vec3 baseColor = vec3(0.15, 0.45, 0.8);
      vec3 finalColor = baseColor * smoothstep(0.0, 1.0, c * 0.7);

      fragColor = vec4(finalColor, 1.0);
  }

  void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
  }
`;

const ShaderPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const shaderUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={shaderUniforms}
        side={THREE.FrontSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current;
      const totalCards = imageElements.length;

      console.log('Total cards:', totalCards);
      console.log('Image elements:', imageElements);

      if (!imageElements[0]) return;

      // Set initial states
      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0, opacity: 1 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0, opacity: 1 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.2, // Reduced for faster response
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;
        if (!currentImage || !nextImage) continue;

        // Faster animations with less lag
        scrollTimeline.to(
          currentImage,
          {
            scale: 0.85,
            rotation: 3,
            duration: 0.8,
            ease: "power1.out", // Faster easing
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 0.8,
            ease: "power1.out", // Faster easing
          },
          position,
        );
      }

      // Debounced resize handler for better performance
      let resizeTimeout: NodeJS.Timeout;
      const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 200);
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        clearTimeout(resizeTimeout);
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div className={cn("relative h-full w-full bg-black", className)} ref={container}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-2 sm:p-4 lg:p-6">
        <div
          className={cn(
            "relative h-[80vh] w-[90vw] max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl overflow-hidden rounded-3xl bg-black mx-auto aspect-[9/16]",
            containerClassName,
          )}
        >
          {/* Shader background for first card */}
          {cards[0]?.background === "shader" && (
            <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden">
              <Canvas>
                <ShaderPlane />
              </Canvas>
            </div>
          )}
          
          {/* Black background for cards with black background */}
          <div className="absolute inset-0 z-0 bg-black rounded-3xl" />
          
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || `Card ${i + 1}`}
              className={cn(
                "rounded-3xl absolute h-full w-full object-cover",
                imageClassName,
              )}
              style={{ zIndex: 10 + i }}
              ref={(el) => {
                imageRefs.current[i] = el;
                console.log(`Image ${i} ref set:`, el);
              }}
              onLoad={() => {
                console.log(`Image ${i} loaded:`, card.image);
              }}
              onError={(e) => {
                console.error(`Failed to load image: ${card.image}`);
                // Try fallback to assets folder
                const fallbackSrc = `/assets/IMG0${i + 1}.jpg`;
                console.log(`Trying fallback: ${fallbackSrc}`);
                (e.target as HTMLImageElement).src = fallbackSrc;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component with default data
const Skiper17 = () => {
  const defaultCards = [
    {
      id: 1,
      image: "/assets/IMG01.jpg",
      background: "shader" as const,
    },
    {
      id: 2,
      image: "/assets/IMG02.jpg",
      background: "black" as const,
    },
    {
      id: 3,
      image: "/assets/IMG03.jpg",
      background: "black" as const,
    },
    {
      id: 4,
      image: "/assets/IMG04.jpg",
      background: "black" as const,
    },
    {
      id: 5,
      image: "/assets/IMG05.jpg",
      background: "black" as const,
    },
  ];

  return (
    <div className="h-full w-full bg-black">
      <StickyCard002 cards={defaultCards} />
    </div>
  );
};

export { Skiper17, StickyCard002 };
