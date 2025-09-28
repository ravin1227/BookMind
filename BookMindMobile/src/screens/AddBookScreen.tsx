import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  Upload,
  FolderOpen,
  BookOpen,
  Camera,
  Settings,
  CheckSquare,
  Square,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function AddBookScreen({ navigation }: any) {
  const { colors } = useTheme();
  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Business');
  const [language, setLanguage] = useState('English');
  const [coverImage, setCoverImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Reading settings state
  const [autoBookmark, setAutoBookmark] = useState(false);
  const [aiInsights, setAiInsights] = useState(true);
  const [syncDevices, setSyncDevices] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleChooseFile = () => {
    console.log('Choose file tapped');
    // This would open document picker
    setSelectedFile('sample-book.pdf');
  };

  const handleBrowseFiles = () => {
    console.log('Browse files tapped');
    // This would open file browser
  };

  const handleUploadCover = () => {
    console.log('Upload cover tapped');
    // This would open image picker
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleAddToLibrary = () => {
    console.log('Add to library tapped');
    // This would process the book and add to library
    navigation.goBack();
  };

  const genreOptions = ['Business', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Biography'];
  const languageOptions = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={handleGoBack}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Add New Book</Text>

          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Upload Section */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <Upload size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Your Book</Text>
          </View>

          <View style={dynamicStyles.uploadArea}>
            <View style={styles.uploadContent}>
              <FolderOpen size={48} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={[styles.uploadTitle, { color: colors.text }]}>Choose File</Text>

              <TouchableOpacity style={[styles.browseButton, { backgroundColor: colors.primary }]} onPress={handleBrowseFiles}>
                <Text style={[styles.browseButtonText, { color: colors.onPrimary }]}>Browse Files</Text>
              </TouchableOpacity>

              <Text style={[styles.supportedFormats, { color: colors.textTertiary }]}>PDF, EPUB, MOBI supported</Text>
            </View>
          </View>
        </View>

        {/* Book Details Section */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Book Details</Text>
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="The Lean Startup"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Author */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Author</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
              value={author}
              onChangeText={setAuthor}
              placeholder="Eric Ries"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Genre and Language Row */}
          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Genre</Text>
              <View style={[styles.selectInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.selectText, { color: colors.text }]}>{genre}</Text>
                <Text style={[styles.selectArrow, { color: colors.textTertiary }]}>▼</Text>
              </View>
            </View>

            <View style={styles.halfInput}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Language</Text>
              <View style={[styles.selectInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.selectText, { color: colors.text }]}>{language}</Text>
                <Text style={[styles.selectArrow, { color: colors.textTertiary }]}>▼</Text>
              </View>
            </View>
          </View>

          {/* Cover Image */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Cover Image</Text>
            <TouchableOpacity style={[styles.coverUploadButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} onPress={handleUploadCover}>
              <Camera size={16} color={colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.coverUploadText, { color: colors.textSecondary }]}>Upload Cover</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reading Settings Section */}
        <View style={dynamicStyles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reading Settings</Text>
          </View>

          <TouchableOpacity
            style={dynamicStyles.checkboxItem}
            onPress={() => setAutoBookmark(!autoBookmark)}
          >
            {autoBookmark ? (
              <CheckSquare size={20} color={colors.primary} strokeWidth={2} />
            ) : (
              <Square size={20} color={colors.textTertiary} strokeWidth={2} />
            )}
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Auto-bookmark pages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={dynamicStyles.checkboxItem}
            onPress={() => setAiInsights(!aiInsights)}
          >
            {aiInsights ? (
              <CheckSquare size={20} color={colors.primary} strokeWidth={2} />
            ) : (
              <Square size={20} color={colors.textTertiary} strokeWidth={2} />
            )}
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>AI-powered insights</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dynamicStyles.checkboxItem, styles.lastCheckboxItem]}
            onPress={() => setSyncDevices(!syncDevices)}
          >
            {syncDevices ? (
              <CheckSquare size={20} color={colors.primary} strokeWidth={2} />
            ) : (
              <Square size={20} color={colors.textTertiary} strokeWidth={2} />
            )}
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>Sync across devices</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={dynamicStyles.bottomActions}>
        <TouchableOpacity style={[styles.cancelButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleCancel}>
          <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAddToLibrary}>
          <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Add to Library</Text>
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
  headerSpacer: {
    width: 40,
  },

  // Main Content
  scrollView: {
    flex: 1,
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

  // Upload Area
  uploadArea: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  supportedFormats: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Form Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectArrow: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  coverUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  coverUploadText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Checkboxes
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  lastCheckboxItem: {
    borderBottomWidth: 0,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1F2937',
  },

  // Bottom Actions
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  uploadArea: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
  },
});