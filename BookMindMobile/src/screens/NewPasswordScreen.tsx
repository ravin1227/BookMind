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
} from 'react-native';
import { BookOpen, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

interface NewPasswordScreenProps {
  navigation: any;
  route: any;
}

export default function NewPasswordScreen({ navigation, route }: NewPasswordScreenProps) {
  const { colors } = useTheme();
  const { email, resetToken } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
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

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        reset_token: resetToken,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.success) {
        Alert.alert(
          'Success!',
          'Your password has been reset successfully. You can now sign in with your new password.',
          [
            {
              text: 'Sign In',
              onPress: () => {
                navigation.navigate('Login');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToResetCode = () => {
    navigation.goBack();
  };

  const isFormValid = password && confirmPassword && password === confirmPassword && password.length >= 6;
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
          <TouchableOpacity onPress={handleBackToResetCode} style={dynamicStyles.backButton}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={dynamicStyles.logoContainer}>
            <View style={dynamicStyles.logo}>
              <BookOpen size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>
          
          <Text style={dynamicStyles.title}>Create New Password</Text>
          <Text style={dynamicStyles.subtitle}>
            Enter a new password for your account
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View 
          style={[
            dynamicStyles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Password Input */}
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>New Password</Text>
            <View style={[
              dynamicStyles.inputWrapper,
              passwordFocused && dynamicStyles.inputWrapperFocused
            ]}>
              <Lock size={20} color={passwordFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={dynamicStyles.textInput}
                placeholder="Enter new password"
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
            <Text style={dynamicStyles.inputLabel}>Confirm New Password</Text>
            <View style={[
              dynamicStyles.inputWrapper,
              confirmPasswordFocused && dynamicStyles.inputWrapperFocused
            ]}>
              <Lock size={20} color={confirmPasswordFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={dynamicStyles.textInput}
                placeholder="Confirm new password"
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
            {password && confirmPassword && password === confirmPassword && password.length >= 6 && (
              <Text style={dynamicStyles.successText}>Passwords match ✓</Text>
            )}
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity 
            style={[
              dynamicStyles.resetButton,
              isLoading && dynamicStyles.resetButtonDisabled,
              !isFormValid && dynamicStyles.resetButtonDisabled
            ]} 
            onPress={handleResetPassword}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <View style={dynamicStyles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.onPrimary} />
                <Text style={[dynamicStyles.resetButtonText, { marginLeft: 8 }]}>
                  Resetting Password...
                </Text>
              </View>
            ) : (
              <View style={dynamicStyles.buttonContent}>
                <CheckCircle size={20} color={colors.onPrimary} strokeWidth={2} />
                <Text style={dynamicStyles.resetButtonText}>Reset Password</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Password Requirements */}
        <Animated.View 
          style={[
            dynamicStyles.requirementsSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={dynamicStyles.requirementsCard}>
            <Text style={dynamicStyles.requirementsTitle}>Password Requirements</Text>
            <View style={dynamicStyles.requirementsList}>
              <View style={dynamicStyles.requirementItem}>
                <Text style={[
                  dynamicStyles.requirementText,
                  password.length >= 6 && dynamicStyles.requirementMet
                ]}>
                  {password.length >= 6 ? '✓' : '○'} At least 6 characters
                </Text>
              </View>
              <View style={dynamicStyles.requirementItem}>
                <Text style={[
                  dynamicStyles.requirementText,
                  password === confirmPassword && password.length > 0 && dynamicStyles.requirementMet
                ]}>
                  {password === confirmPassword && password.length > 0 ? '✓' : '○'} Passwords match
                </Text>
              </View>
            </View>
          </View>
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
  successText: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '500',
  },

  // Reset Button
  resetButton: {
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
  resetButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Requirements Section
  requirementsSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  requirementsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  requirementMet: {
    color: '#10B981',
    fontWeight: '500',
  },
});
