import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  User,
  BarChart3,
  Settings,
  BookOpen,
  Bell,
  ChevronRight,
  ChevronDown,
  LogOut,
  Volume2,
  Mic,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen({ navigation }: any) {
  const { theme, setTheme, colors } = useTheme();
  const { logout, user } = useAuth();

  // Toggle states
  const [autoBookmark, setAutoBookmark] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [highlightNotifications, setHighlightNotifications] = useState(false);
  const [syncAlerts, setSyncAlerts] = useState(true);

  // Dropdown states
  const [fontSize, setFontSize] = useState('Medium');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);

  // TTS Settings
  const [selectedVoice, setSelectedVoice] = useState('Emma (US Female)');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  // Available voices
  const availableVoices = [
    'Emma (US Female)',
    'James (US Male)',
    'Sophie (UK Female)',
    'Oliver (AU Male)',
    'Isabella (US Female)',
    'David (UK Male)',
  ];

  // Mock user data
  const userProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/80x80/CCCCCC/666666?text=JD',
    stats: {
      booksRead: 12,
      pagesHighlighted: 247,
      readingStreak: 12,
      totalTime: '24h',
    },
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleChangePhoto = () => {
    console.log('Change photo tapped');
  };

  const handleEditProfile = () => {
    console.log('Edit profile tapped');
  };

  const handleChangePassword = () => {
    console.log('Change password tapped');
  };

  const handlePrivacySettings = () => {
    console.log('Privacy settings tapped');
  };

  const handleNotificationPreferences = () => {
    console.log('Notification preferences tapped');
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation will be handled automatically by AppNavigator
          }
        }
      ]
    );
  };

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={dynamicStyles.header}>
        <View style={dynamicStyles.headerContent}>
          <TouchableOpacity style={dynamicStyles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          <View style={dynamicStyles.headerTitleRow}>
            <User size={20} color={colors.text} strokeWidth={2} />
            <Text style={dynamicStyles.headerTitle}>Profile</Text>
          </View>

          <View style={dynamicStyles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={dynamicStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={dynamicStyles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{userProfile.name}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userProfile.email}</Text>

          <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleChangePhoto}>
            <Text style={[styles.changePhotoText, { color: colors.text }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
          </View>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={handleEditProfile}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Edit Profile</Text>
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={handleChangePassword}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Change Password</Text>
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={handlePrivacySettings}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Settings</Text>
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.lastSettingItem]} onPress={handleNotificationPreferences}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notification Preferences</Text>
            <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Reading Preferences */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reading Preferences</Text>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Font Size</Text>
            <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.dropdownText, { color: colors.text }]}>{fontSize}</Text>
              <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2} />
            </View>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Theme</Text>
            <TouchableOpacity
              style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setShowThemeDropdown(!showThemeDropdown)}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>{theme}</Text>
              <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Theme Dropdown Options */}
          {showThemeDropdown && (
            <View style={[styles.dropdownOptions, { backgroundColor: colors.surface }]}>
              <TouchableOpacity
                style={[styles.dropdownOption, { borderBottomColor: colors.border }, theme === 'Light' && { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => {
                  setTheme('Light');
                  setShowThemeDropdown(false);
                }}
              >
                <Text style={[styles.dropdownOptionText, { color: colors.text }, theme === 'Light' && { fontWeight: '600' }]}>
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dropdownOption, { borderBottomColor: colors.border }, theme === 'Dark' && { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => {
                  setTheme('Dark');
                  setShowThemeDropdown(false);
                }}
              >
                <Text style={[styles.dropdownOptionText, { color: colors.text }, theme === 'Dark' && { fontWeight: '600' }]}>
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-bookmark</Text>
            <Switch
              value={autoBookmark}
              onValueChange={setAutoBookmark}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={autoBookmark ? colors.onPrimary : colors.onPrimary}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>AI Insights</Text>
            <Switch
              value={aiInsights}
              onValueChange={setAiInsights}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={aiInsights ? colors.onPrimary : colors.onPrimary}
            />
          </View>
        </View>

        {/* Audio & Speech */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <Volume2 size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Audio & Speech</Text>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Text-to-Speech</Text>
            <Switch
              value={ttsEnabled}
              onValueChange={setTtsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={ttsEnabled ? colors.onPrimary : colors.onPrimary}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Voice</Text>
            <TouchableOpacity
              style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => setShowVoiceDropdown(!showVoiceDropdown)}
            >
              <Text style={[styles.dropdownText, { color: colors.text }]}>{selectedVoice}</Text>
              <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Voice Dropdown Options */}
          {showVoiceDropdown && (
            <View style={[styles.dropdownOptions, { backgroundColor: colors.surface }]}>
              {availableVoices.map((voice, index) => (
                <TouchableOpacity
                  key={voice}
                  style={[styles.dropdownOption, { borderBottomColor: colors.border }, selectedVoice === voice && { backgroundColor: colors.backgroundSecondary }]}
                  onPress={() => {
                    setSelectedVoice(voice);
                    setShowVoiceDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownOptionText, { color: colors.text }, selectedVoice === voice && { fontWeight: '600' }]}>
                    {voice}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Speech Speed</Text>
            <View style={styles.speedControls}>
              <TouchableOpacity
                style={[styles.speedButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setSpeechSpeed(Math.max(0.5, speechSpeed - 0.1))}
                disabled={speechSpeed <= 0.5}
              >
                <Text style={[styles.speedButtonText, { color: speechSpeed <= 0.5 ? colors.textTertiary : colors.text }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.speedValue, { color: colors.text }]}>{speechSpeed.toFixed(1)}x</Text>
              <TouchableOpacity
                style={[styles.speedButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setSpeechSpeed(Math.min(2.0, speechSpeed + 0.1))}
                disabled={speechSpeed >= 2.0}
              >
                <Text style={[styles.speedButtonText, { color: speechSpeed >= 2.0 ? colors.textTertiary : colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.settingItem, styles.lastSettingItem]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-play Next Chapter</Text>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={autoPlay ? colors.onPrimary : colors.onPrimary}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Daily Reading Reminder</Text>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={dailyReminder ? colors.onPrimary : colors.onPrimary}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Highlight Notifications</Text>
            <Switch
              value={highlightNotifications}
              onValueChange={setHighlightNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={highlightNotifications ? colors.onPrimary : colors.onPrimary}
            />
          </View>

          <View style={[styles.settingItem, styles.lastSettingItem]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Sync Alerts</Text>
            <Switch
              value={syncAlerts}
              onValueChange={setSyncAlerts}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={syncAlerts ? colors.onPrimary : colors.onPrimary}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={dynamicStyles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#DC2626" strokeWidth={2} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header Styles
  header: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },

  // Main Content
  scrollView: {
    flex: 1,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  changePhotoButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },

  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Settings Items
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
  },
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#1F2937',
  },
  selectedOption: {
    backgroundColor: '#F3F4F6',
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#1F2937',
  },

  // TTS Speed Controls
  speedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  speedValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '500',
  },
});

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});