// FIX: Added a triple-slash directive to include Matter.js type definitions. This resolves TypeScript errors where the 'Matter' namespace and its types were not recognized.
/// <reference types="matter-js" />

import React, { useRef, useEffect } from 'react';
import type { AppDefinition } from '../types';
import { AppIcon } from './AppIcon';

// Augment the window object with the Matter property
declare global {
  interface Window {
    Matter: typeof Matter;
  }
}

interface DesktopProps {
  apps: AppDefinition[];
  onOpenApp: (app: AppDefinition) => void;
}

const ICON_SIZE = 80;
const ICON_RADIUS = ICON_SIZE / 2;

export const Desktop: React.FC<DesktopProps> = ({ apps, onOpenApp }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const { Engine, Runner, Bodies, Composite, Events, World, Mouse, MouseConstraint } = window.Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 1 } });
    engineRef.current = engine;
    const world = engine.world;

    const currentScene = sceneRef.current;
    if (!currentScene) return;
    
    let bodies = apps.map(app => {
      const body = Bodies.circle(
        Math.random() * currentScene.clientWidth,
        Math.random() * currentScene.clientHeight * 0.5,
        ICON_RADIUS,
        {
          restitution: 0.5,
          friction: 0.1,
          label: app.id,
        }
      );
      return body;
    });

    const createWalls = () => {
        const wallOptions = { isStatic: true, render: { visible: false } };
        return [
            Bodies.rectangle(currentScene.clientWidth / 2, -25, currentScene.clientWidth, 50, wallOptions), // top
            Bodies.rectangle(currentScene.clientWidth / 2, currentScene.clientHeight + 25, currentScene.clientWidth, 50, wallOptions), // bottom
            Bodies.rectangle(-25, currentScene.clientHeight / 2, 50, currentScene.clientHeight, wallOptions), // left
            Bodies.rectangle(currentScene.clientWidth + 25, currentScene.clientHeight / 2, 50, currentScene.clientHeight, wallOptions) // right
        ];
    };
    
    let walls = createWalls();
    Composite.add(world, [...bodies, ...walls]);
    
    // Add mouse control
    const mouse = Mouse.create(currentScene);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Composite.add(world, mouseConstraint);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const updatePositions = () => {
      bodies.forEach(body => {
        const iconElement = iconRefs.current[body.label];
        if (iconElement) {
          iconElement.style.transform = `translate(${body.position.x - ICON_RADIUS}px, ${body.position.y - ICON_RADIUS}px) rotate(${body.angle}rad)`;
        }
      });
    };

    Events.on(runner, 'afterUpdate', updatePositions);

    const handleStartDrag = () => {
      isDraggingRef.current = true;
    };

    const handleMouseUp = (event: { body?: Matter.Body }) => {
      if (!isDraggingRef.current && event.body) {
        const appToOpen = apps.find(app => app.id === event.body?.label);
        if (appToOpen) {
          onOpenApp(appToOpen);
        }
      }
      // Reset drag state after every mouse up
      isDraggingRef.current = false;
    };
    
    Events.on(mouseConstraint, 'startdrag', handleStartDrag);
    Events.on(mouseConstraint, 'mouseup', handleMouseUp);

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event; // beta: front-back tilt, gamma: left-right tilt
      if (beta !== null && gamma !== null) {
        const gravityX = Math.sin(gamma * (Math.PI / 180));
        const gravityY = Math.sin(beta * (Math.PI / 180));
        engine.gravity.x = gravityX;
        engine.gravity.y = gravityY;
      }
    };
    
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    
    const handleResize = () => {
        World.remove(world, walls);
        walls = createWalls();
        World.add(world, walls);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Events.off(mouseConstraint, 'startdrag', handleStartDrag);
      Events.off(mouseConstraint, 'mouseup', handleMouseUp);
      Events.off(runner, 'afterUpdate', updatePositions);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('resize', handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, onOpenApp]);

  return (
    <div ref={sceneRef} className="absolute inset-0 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing">
      {apps.map(app => (
        <div
          key={app.id}
          ref={el => (iconRefs.current[app.id] = el)}
          className="absolute"
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        >
          <AppIcon app={app} />
        </div>
      ))}
    </div>
  );
};