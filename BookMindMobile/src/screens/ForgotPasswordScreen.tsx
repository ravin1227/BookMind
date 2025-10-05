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
import { BookOpen, Mail, ArrowLeft, Send } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

interface ForgotPasswordScreenProps {
  navigation: any;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
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

  const handleSendResetCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email });

      if (response.success) {
        Alert.alert(
          'Reset Code Sent',
          'We\'ve sent a reset code to your email address. Please check your inbox.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ResetCode', { email })
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to send reset code. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

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
          
          <Text style={dynamicStyles.title}>Forgot Password?</Text>
          <Text style={dynamicStyles.subtitle}>
            No worries! Enter your email address and we'll send you a reset code.
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
          {/* Email Input */}
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Email Address</Text>
            <View style={[
              dynamicStyles.inputWrapper,
              emailFocused && dynamicStyles.inputWrapperFocused
            ]}>
              <Mail size={20} color={emailFocused ? colors.primary : colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={dynamicStyles.textInput}
                placeholder="Enter your email address"
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

          {/* Send Reset Code Button */}
          <TouchableOpacity 
            style={[
              dynamicStyles.sendButton,
              isLoading && dynamicStyles.sendButtonDisabled,
              !email && dynamicStyles.sendButtonDisabled
            ]} 
            onPress={handleSendResetCode}
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <View style={dynamicStyles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.onPrimary} />
                <Text style={[dynamicStyles.sendButtonText, { marginLeft: 8 }]}>
                  Sending Code...
                </Text>
              </View>
            ) : (
              <View style={dynamicStyles.buttonContent}>
                <Send size={20} color={colors.onPrimary} strokeWidth={2} />
                <Text style={dynamicStyles.sendButtonText}>Send Reset Code</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <View style={dynamicStyles.loginContainer}>
            <Text style={dynamicStyles.loginText}>Remember your password? </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={dynamicStyles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Info Section */}
        <Animated.View 
          style={[
            dynamicStyles.infoSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={dynamicStyles.infoCard}>
            <Text style={dynamicStyles.infoTitle}>What happens next?</Text>
            <Text style={dynamicStyles.infoText}>
              • We'll send a 6-digit reset code to your email{'\n'}
              • Enter the code on the next screen{'\n'}
              • Create a new password{'\n'}
              • Sign in with your new password
            </Text>
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
    marginBottom: 32,
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

  // Send Button
  sendButton: {
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
  sendButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
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

  // Info Section
  infoSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
