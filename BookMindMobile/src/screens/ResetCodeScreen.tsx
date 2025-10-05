import React, { useState, useRef } from 'react';
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
import { BookOpen, ArrowLeft, CheckCircle, RotateCcw } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface ResetCodeScreenProps {
  navigation: any;
  route: any;
}

export default function ResetCodeScreen({ navigation, route }: ResetCodeScreenProps) {
  const { colors } = useTheme();
  const { email } = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const inputRefs = useRef<TextInput[]>([]);

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

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    
    try {
      // DEVELOPMENT BYPASS: Accept any 6-digit code
      console.log('🔓 Development Mode: Accepting any reset code:', codeToVerify);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to new password screen
      // In a real implementation, the API would validate the code and return a reset token
      // For now, we'll pass the code as the reset token
      navigation.navigate('NewPassword', { email, resetToken: codeToVerify });
    } catch (error) {
      Alert.alert('Error', 'Invalid reset code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      // DEVELOPMENT BYPASS: Always succeed
      console.log('🔓 Development Mode: Resending reset code for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      Alert.alert('Success', 'Reset code has been resent to your email');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToForgotPassword = () => {
    navigation.goBack();
  };

  const isCodeComplete = code.every(digit => digit !== '');
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
          <TouchableOpacity onPress={handleBackToForgotPassword} style={dynamicStyles.backButton}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={dynamicStyles.logoContainer}>
            <View style={dynamicStyles.logo}>
              <BookOpen size={28} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>
          
          <Text style={dynamicStyles.title}>Enter Reset Code</Text>
          <Text style={dynamicStyles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={dynamicStyles.emailText}>{email}</Text>
          </Text>
        </Animated.View>

        {/* Code Input */}
        <Animated.View 
          style={[
            dynamicStyles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={dynamicStyles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  dynamicStyles.codeInput,
                  digit && dynamicStyles.codeInputFilled,
                  isLoading && dynamicStyles.codeInputDisabled
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                editable={!isLoading}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[
              dynamicStyles.verifyButton,
              isLoading && dynamicStyles.verifyButtonDisabled,
              !isCodeComplete && dynamicStyles.verifyButtonDisabled
            ]} 
            onPress={() => handleVerifyCode()}
            disabled={isLoading || !isCodeComplete}
          >
            {isLoading ? (
              <View style={dynamicStyles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.onPrimary} />
                <Text style={[dynamicStyles.verifyButtonText, { marginLeft: 8 }]}>
                  Verifying...
                </Text>
              </View>
            ) : (
              <View style={dynamicStyles.buttonContent}>
                <CheckCircle size={20} color={colors.onPrimary} strokeWidth={2} />
                <Text style={dynamicStyles.verifyButtonText}>Verify Code</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Resend Code */}
          <View style={dynamicStyles.resendContainer}>
            <Text style={dynamicStyles.resendText}>
              Didn't receive the code?{' '}
            </Text>
            {timeLeft > 0 ? (
              <Text style={dynamicStyles.timerText}>
                Resend in {timeLeft}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode} disabled={isResending}>
                <View style={dynamicStyles.resendButton}>
                  {isResending ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <RotateCcw size={16} color={colors.primary} strokeWidth={2} />
                      <Text style={dynamicStyles.resendButtonText}>Resend Code</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Help Section */}
        <Animated.View 
          style={[
            dynamicStyles.helpSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={dynamicStyles.helpCard}>
            <Text style={dynamicStyles.helpTitle}>Need help?</Text>
            <Text style={dynamicStyles.helpText}>
              • Check your spam folder{'\n'}
              • Make sure you entered the correct email{'\n'}
              • The code expires in 10 minutes
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
  emailText: {
    fontWeight: '600',
    color: colors.text,
  },

  // Form
  formContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundSecondary,
  },
  codeInputDisabled: {
    opacity: 0.6,
  },

  // Verify Button
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyButtonText: {
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

  // Resend
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timerText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Help Section
  helpSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  helpCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
