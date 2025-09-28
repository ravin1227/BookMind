import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { BookOpen } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  // Loading dots animation
  const dot1 = React.useRef(new Animated.Value(0.3)).current;
  const dot2 = React.useRef(new Animated.Value(0.3)).current;
  const dot3 = React.useRef(new Animated.Value(0.3)).current;
  const dot4 = React.useRef(new Animated.Value(0.3)).current;
  const dot5 = React.useRef(new Animated.Value(0.3)).current;
  const dot6 = React.useRef(new Animated.Value(0.3)).current;
  const dot7 = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    // Main logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots animation
    const animateDots = () => {
      const dots = [dot1, dot2, dot3, dot4, dot5, dot6, dot7];

      const createDotAnimation = (dot: Animated.Value, delay: number) => {
        return Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);
      };

      const dotAnimations = dots.map((dot, index) =>
        createDotAnimation(dot, index * 100)
      );

      Animated.parallel(dotAnimations).start(() => {
        // Reset and repeat
        setTimeout(animateDots, 200);
      });
    };

    // Start dots animation after a short delay
    setTimeout(animateDots, 1000);

    // Navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      // This will be handled by AppNavigator's loading state
      // The splash screen will automatically disappear when isLoading becomes false
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, dot1, dot2, dot3, dot4, dot5, dot6, dot7]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logo}>
          <BookOpen size={48} color="#FFFFFF" strokeWidth={2} />
        </View>
        <Text style={styles.appName}>BookMind</Text>
        <Text style={styles.tagline}>AI-Powered Reading</Text>
      </Animated.View>

      {/* Loading Section */}
      <View style={styles.loadingSection}>
        {/* Loading Dots */}
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
          <Animated.View style={[styles.dot, { opacity: dot4 }]} />
          <Animated.View style={[styles.dot, { opacity: dot5 }]} />
          <Animated.View style={[styles.dot, { opacity: dot6 }]} />
          <Animated.View style={[styles.dot, { opacity: dot7 }]} />
        </View>

        <Text style={styles.loadingText}>Loading your{'\n'}reading journey...</Text>
      </View>

      {/* Version Footer */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>Version 1.2.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A4A', // Dark navy blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 120,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#6B46C1', // Purple background for icon
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#9CA3AF', // Gray text color
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#9CA3AF', // Gray text color
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingSection: {
    position: 'absolute',
    bottom: 160,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  versionText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '400',
  },
});