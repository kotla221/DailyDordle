import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Dimensions } from "react-native";

const COLORS = ["#538d4e", "#b59f3b", "#6aaa64", "#ffd700", "#ffffff", "#c9b458"];
const NUM = 90;

export default function Confetti({ active }) {
  const { width, height } = Dimensions.get("window");

  const particles = useRef(
    Array.from({ length: NUM }, () => ({
      x: Math.random() * width,
      y: new Animated.Value(-30),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 9 + 5,
      speed: Math.random() * 1200 + 1600,
      delay: Math.random() * 600,
      wide: Math.random() > 0.5,
    }))
  ).current;

  useEffect(() => {
    if (!active) return;

    // Reset all particles
    particles.forEach((p) => {
      p.y.setValue(-30);
      p.opacity.setValue(1);
      p.rotate.setValue(0);
    });

    const anims = particles.map((p) =>
      Animated.parallel([
        Animated.timing(p.y, {
          toValue: height + 40,
          duration: p.speed,
          delay: p.delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: 720,
          duration: p.speed,
          delay: p.delay,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: p.speed * 0.7,
          delay: p.delay + p.speed * 0.3,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(anims).start();
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const spin = p.rotate.interpolate({
          inputRange: [0, 720],
          outputRange: ["0deg", "720deg"],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              width: p.wide ? p.size * 2 : p.size,
              height: p.size,
              borderRadius: 2,
              backgroundColor: p.color,
              transform: [{ translateY: p.y }, { rotate: spin }],
              opacity: p.opacity,
            }}
          />
        );
      })}
    </View>
  );
}
