import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Search, Library, User } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavBarProps {
  activeTab: 'home' | 'discover' | 'library' | 'profile';
  onTabPress?: (tab: string) => void;
  navigation?: any;
}

export default function BottomNavBar({ activeTab, onTabPress, navigation }: BottomNavBarProps) {
  const { colors } = useTheme();
  const handleTabPress = (tab: string) => {
    if (onTabPress) {
      onTabPress(tab);
    } else if (navigation) {
      switch (tab) {
        case 'home':
          navigation.navigate('Home');
          break;
        case 'library':
          navigation.navigate('Library');
          break;
        case 'profile':
          navigation.navigate('Profile');
          break;
        default:
          console.log(`${tab} tab pressed`);
      }
    } else {
      console.log(`${tab} tab pressed`);
    }
  };

  const getIconColor = (tab: string) => {
    return activeTab === tab ? colors.text : colors.textTertiary;
  };

  const getTextStyle = (tab: string) => {
    return {
      ...styles.navLabel,
      color: activeTab === tab ? colors.text : colors.textTertiary,
      fontWeight: activeTab === tab ? '600' : '400',
    };
  };

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('home')}>
        <Home size={24} color={getIconColor('home')} strokeWidth={2} />
        <Text style={getTextStyle('home')}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('discover')}>
        <Search size={24} color={getIconColor('discover')} strokeWidth={2} />
        <Text style={getTextStyle('discover')}>Discover</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('library')}>
        <Library size={24} color={getIconColor('library')} strokeWidth={2} />
        <Text style={getTextStyle('library')}>Library</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('profile')}>
        <User size={24} color={getIconColor('profile')} strokeWidth={2} />
        <Text style={getTextStyle('profile')}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

const createStyles = (colors: any) => StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});