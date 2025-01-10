import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Simplemente esperamos 3 segundos y terminamos
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>DespuésLoHago</Text>
          <Text style={styles.subtitle}>Organizá tu tiempo, a tu manera</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desarrollado por Franco Armani</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2e8be0',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4a9ced',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4a9ced',
    textAlign: 'center',
  },
});

export default SplashScreen; 