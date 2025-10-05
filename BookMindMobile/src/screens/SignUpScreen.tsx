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
import { BookOpen, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface SignUpScreenProps {
  navigation: any;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { colors } = useTheme();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

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

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Clear any previous errors
    // clearError(); // Removed - AuthContext doesn't have clearError

    try {
      await register(name, email, password);
      // Navigation will be handled automatically by AppNavigator
      // when isAuthenticated becomes true
    } catch (error) {
      // Show specific error message from API or fallback to generic message
      let errorMessage = 'Unable to create account. Please try again.';

      // Handle common error scenarios with user-friendly messages
      if (errorMessage.toLowerCase().includes('email') && (errorMessage.toLowerCase().includes('taken') || errorMessage.toLowerCase().includes('exist'))) {
        errorMessage = 'This email address is already registered. Please use a different email or try logging in.';
      } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('invalid')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (errorMessage.toLowerCase().includes('password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (errorMessage === 'Registration failed. Please try again.') {
        // If we get the generic message, it might be a duplicate email
        errorMessage = 'Registration failed. This email may already be registered. Please try a different email or sign in.';
      }

      Alert.alert('Sign Up Failed', errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const isFormValid = name && email && password && confirmPassword && password === confirmPassword;

  const dynamicStyles = createStyles(colors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View 
          style={[
            dynamicStyles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity onPress={handleBackToLogin} style={dynamicStyles.backButton}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={dynamicStyles.logoContainer}>
            <View style={dynamicStyles.logo}>
              <BookOpen size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>
          
          <Text style={dynamicStyles.title}>Create Account</Text>
          <Text style={dynamicStyles.subtitle}>
            Join BookMind and start your AI-powered reading journey
          </Text>
        </Animated.View>

        {/* Form */}
        <ScrollView 
          style={dynamicStyles.formContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              dynamicStyles.formContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Name Input */}
            <View style={dynamicStyles.inputContainer}>
              <Text style={dynamicStyles.inputLabel}>Full Name</Text>
              <View style={[
                dynamicStyles.inputWrapper,
                nameFocused && dynamicStyles.inputWrapperFocused
              ]}>
                <User size={20} color={nameFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
                <TextInput
                  style={dynamicStyles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textTertiary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

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
                  placeholder="Create a password"
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
              <Text style={dynamicStyles.passwordHint}>Must be at least 6 characters</Text>
            </View>

            {/* Confirm Password Input */}
            <View style={dynamicStyles.inputContainer}>
              <Text style={dynamicStyles.inputLabel}>Confirm Password</Text>
              <View style={[
                dynamicStyles.inputWrapper,
                confirmPasswordFocused && dynamicStyles.inputWrapperFocused
              ]}>
                <Lock size={20} color={confirmPasswordFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
                <TextInput
                  style={dynamicStyles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={dynamicStyles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.textSecondary} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={colors.textSecondary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {password && confirmPassword && password !== confirmPassword && (
                <Text style={dynamicStyles.errorText}>Passwords do not match</Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[
                dynamicStyles.signUpButton,
                isLoading && dynamicStyles.signUpButtonDisabled,
                !isFormValid && dynamicStyles.signUpButtonDisabled
              ]} 
              onPress={handleSignUp}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <View style={dynamicStyles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                  <Text style={[dynamicStyles.signUpButtonText, { marginLeft: 8 }]}>
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <Text style={dynamicStyles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={dynamicStyles.loginContainer}>
              <Text style={dynamicStyles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={dynamicStyles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

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
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
});

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 32,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },
  formContent: {
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordHint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },

  // Sign Up Button
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
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
