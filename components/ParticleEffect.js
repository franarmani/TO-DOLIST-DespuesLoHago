import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

const ParticleEffect = ({ type = 'add', position = { x: SCREEN_WIDTH / 2, y: 300 }, onComplete }) => {
  const particles = useRef(
    [...Array(PARTICLE_COUNT)].map(() => ({
      animation: new Animated.ValueXY({ x: 0, y: 0 }),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      const angle = (index / PARTICLE_COUNT) * 2 * Math.PI;
      const radius = Math.random() * 100 + 50;
      const duration = Math.random() * 1000 + 1000;

      particle.animation.setValue({ x: 0, y: 0 });
      particle.scale.setValue(0);
      particle.opacity.setValue(1);

      return Animated.parallel([
        Animated.timing(particle.animation, {
          toValue: {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          },
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.scale, {
          toValue: 1,
          duration: duration * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, animations).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  }, [position]);

  const getParticleStyle = (type) => {
    switch (type) {
      case 'add':
        return { backgroundColor: '#4CAF50' };
      case 'delete':
        return { backgroundColor: '#F44336' };
      case 'edit':
        return { backgroundColor: '#2196F3' };
      case 'complete':
        return { backgroundColor: '#9C27B0' };
      default:
        return { backgroundColor: '#4CAF50' };
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            getParticleStyle(type),
            {
              left: position.x,
              top: position.y,
              transform: [
                ...particle.animation.getTranslateTransform(),
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ParticleEffect; 