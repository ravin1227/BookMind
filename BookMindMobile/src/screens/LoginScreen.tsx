import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { colors } = useTheme();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Clear any previous errors
    // clearError(); // Removed - AuthContext doesn't have clearError

    try {
      await login(email, password);
      // Navigation will be handled automatically by AppNavigator
      // when isAuthenticated becomes true
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const dynamicStyles = createStyles(colors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Animated.View
            style={[
              dynamicStyles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={dynamicStyles.logoContainer}>
              <View style={dynamicStyles.logo}>
                <BookOpen size={32} color="#FFFFFF" strokeWidth={2} />
              </View>
            </View>

            <Text style={dynamicStyles.welcomeTitle}>Welcome Back</Text>
            <Text style={dynamicStyles.welcomeSubtitle}>
              Continue your AI-powered reading journey
            </Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              dynamicStyles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
          {/* Email Input */}
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Email</Text>
            <View style={[
              dynamicStyles.inputWrapper,
              emailFocused && dynamicStyles.inputWrapperFocused
            ]}>
              <Mail size={20} color={emailFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={dynamicStyles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Password</Text>
            <View style={[
              dynamicStyles.inputWrapper,
              passwordFocused && dynamicStyles.inputWrapperFocused
            ]}>
              <Lock size={20} color={passwordFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={dynamicStyles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={dynamicStyles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} strokeWidth={2} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPassword} style={dynamicStyles.forgotPasswordButton}>
            <Text style={dynamicStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity 
            style={[
              dynamicStyles.loginButton,
              isLoading && dynamicStyles.loginButtonDisabled,
              (!email || !password) && dynamicStyles.loginButtonDisabled
            ]} 
            onPress={handleLogin}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <View style={dynamicStyles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.onPrimary} />
                <Text style={[dynamicStyles.loginButtonText, { marginLeft: 8 }]}>
                  Signing In...
                </Text>
              </View>
            ) : (
              <Text style={dynamicStyles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={dynamicStyles.signUpContainer}>
            <Text style={dynamicStyles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={dynamicStyles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              dynamicStyles.footer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={dynamicStyles.footerText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#6366F1', // BookMind primary color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Form Section
  formSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    marginRight: 8,
  },
  eyeButton: {
    padding: 4,
  },

  // Forgot Password
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  // Login Button
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sign Up
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  signUpText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },

  // Footer
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
