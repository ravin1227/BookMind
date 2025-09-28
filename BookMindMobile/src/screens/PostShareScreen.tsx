import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  ChevronDown,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface PostShareScreenProps {
  navigation: any;
  route: {
    params: {
      selectedText: string;
      bookTitle: string;
      author: string;
    };
  };
}

export default function PostShareScreen({ navigation, route }: PostShareScreenProps) {
  const { selectedText, bookTitle, author } = route.params;

  // Customization state
  const [selectedTemplate, setSelectedTemplate] = useState('Min');
  const [backgroundColor, setBackgroundColor] = useState('Dark');
  const [textColor, setTextColor] = useState('White');
  const [fontFamily, setFontFamily] = useState('Georgia');

  // Template options
  const templates = [
    { id: 'Min', name: 'Min', color: '#1F2937' },
    { id: 'Corp', name: 'Corp', color: '#FFFFFF' },
    { id: 'Art', name: 'Art', color: '#6B7280' },
    { id: 'Mod', name: 'Mod', color: '#374151' },
  ];

  const backgroundOptions = ['Dark', 'Light', 'Gradient', 'Pattern'];
  const textColorOptions = ['White', 'Black', 'Gray', 'Blue'];
  const fontOptions = ['Georgia', 'Arial', 'Times', 'Helvetica'];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handlePreview = () => {
    console.log('Preview tapped');
  };

  const handleShare = () => {
    console.log('Share quote card');
    // Implement sharing functionality
    navigation.goBack();
  };

  const getQuoteCardStyle = () => {
    const baseStyle = {
      backgroundColor: backgroundColor === 'Dark' ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      margin: 16,
      minHeight: 200,
      justifyContent: 'center',
      alignItems: 'center',
    };

    return baseStyle;
  };

  const getTextStyle = () => {
    return {
      color: textColor === 'White' ? '#FFFFFF' : '#1F2937',
      fontFamily: fontFamily,
      fontSize: 18,
      lineHeight: 28,
      textAlign: 'center' as const,
      marginBottom: 16,
    };
  };

  const getAuthorStyle = () => {
    return {
      color: textColor === 'White' ? '#D1D5DB' : '#6B7280',
      fontFamily: fontFamily,
      fontSize: 14,
      textAlign: 'center' as const,
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color="#1F2937" strokeWidth={2} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Quote Card</Text>

          <TouchableOpacity onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quote Card Preview */}
        <View style={getQuoteCardStyle()}>
          <Text style={getTextStyle()}>
            "{selectedText}"
          </Text>
          <Text style={getAuthorStyle()}>
            — {author}
          </Text>
          <Text style={[getAuthorStyle(), { fontSize: 12, marginTop: 4 }]}>
            {bookTitle}
          </Text>
        </View>

        {/* Template Styles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Template Styles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateRow}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateButton,
                  { backgroundColor: template.color },
                  selectedTemplate === template.id && styles.selectedTemplate
                ]}
                onPress={() => setSelectedTemplate(template.id)}
              >
                <Text style={[
                  styles.templateText,
                  { color: template.color === '#FFFFFF' ? '#1F2937' : '#FFFFFF' }
                ]}>
                  {template.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Customize Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customize</Text>

          {/* Background */}
          <View style={styles.customizeItem}>
            <Text style={styles.customizeLabel}>Background</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{backgroundColor}</Text>
              <ChevronDown size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Text Color */}
          <View style={styles.customizeItem}>
            <Text style={styles.customizeLabel}>Text Color</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{textColor}</Text>
              <ChevronDown size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Font */}
          <View style={styles.customizeItem}>
            <Text style={styles.customizeLabel}>Font</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{fontFamily}</Text>
              <ChevronDown size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },

  // Main Content
  scrollView: {
    flex: 1,
  },

  // Sections
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },

  // Template Styles
  templateRow: {
    flexDirection: 'row',
  },
  templateButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTemplate: {
    borderColor: '#3B82F6',
  },
  templateText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Customize
  customizeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  customizeLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 100,
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 8,
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});