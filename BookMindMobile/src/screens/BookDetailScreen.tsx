import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  Settings,
  Heart,
  Bookmark,
  MessageCircle,
  Highlighter,
  Pause,
} from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function BookDetailScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  // Mock data - will be replaced with actual book data from route params
  const bookData = {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    publishedYear: '2011',
    totalPages: 350,
    category: 'Business',
    currentPage: 142,
    progress: 73,
    timeLeftInChapter: 23,
    bookmarks: 8,
    highlights: 47,
    description: 'The Lean Startup is a methodology for developing businesses and products that aims to shorten product development cycles and rapidly discover if a proposed business model is viable. This is achieved by adopting a combination of business-hypothesis-driven experimentation, iterative product releases, and validated learning.',
    coverUrl: 'https://via.placeholder.com/200x280/CCCCCC/666666?text=Book+Cover+The+Lean+Startup',
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleContinueReading = () => {
    navigation.navigate('ContinueReading', {
      book: {
        title: bookData.title,
        author: bookData.author,
        chapter: 'Chapter 8: Business Models',
        currentPage: bookData.currentPage,
        totalPages: bookData.totalPages,
        progress: bookData.progress,
        timeLeft: bookData.timeLeftInChapter,
        coverUrl: bookData.coverUrl,
      },
    });
  };

  const handleBookmarks = () => {
    console.log('Bookmarks tapped');
  };

  const handleHighlights = () => {
    console.log('Highlights tapped');
  };

  const handleChatWithBook = () => {
    console.log('Chat with book tapped');
  };

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={dynamicStyles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={handleGoBack}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>{bookData.title}</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerActionButton, { backgroundColor: colors.surface }]}>
              <Settings size={24} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerActionButton, { backgroundColor: colors.surface }]}>
              <Heart size={24} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Book Cover Section */}
        <View style={styles.bookCoverSection}>
          <View style={styles.bookCoverContainer}>
            <Image source={{ uri: bookData.coverUrl }} style={styles.bookCover} />
          </View>
        </View>

        {/* Book Info Section */}
        <View style={styles.bookInfoSection}>
          <Text style={[styles.bookTitle, { color: colors.text }]}>{bookData.title}</Text>
          <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>{bookData.author}</Text>
          <View style={styles.bookMetaRow}>
            <Text style={[styles.bookMeta, { color: colors.textTertiary }]}>Published: {bookData.publishedYear}</Text>
            <Text style={[styles.bookMetaDivider, { color: colors.textTertiary }]}>•</Text>
            <Text style={[styles.bookMeta, { color: colors.textTertiary }]}>{bookData.totalPages} pages</Text>
          </View>
          <View style={[styles.categoryContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.category, { color: colors.textSecondary }]}>{bookData.category}</Text>
          </View>
        </View>

        {/* Reading Progress Section */}
        <View style={dynamicStyles.progressSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reading Progress</Text>

          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progress</Text>
            <Text style={[styles.progressPercentage, { color: colors.text }]}>{bookData.progress}%</Text>
          </View>

          <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${bookData.progress}%` }]} />
          </View>

          <View style={styles.progressDetailsRow}>
            <Text style={[styles.progressDetails, { color: colors.text }]}>
              Page {bookData.currentPage} of {bookData.totalPages}
            </Text>
            <Text style={[styles.timeLeft, { color: colors.textSecondary }]}>
              ~{bookData.timeLeftInChapter} min left in chapter
            </Text>
          </View>
        </View>

        {/* Continue Reading Button */}
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.primary }]} onPress={handleContinueReading}>
          <Pause size={20} color={colors.onPrimary} strokeWidth={2} />
          <Text style={[styles.continueButtonText, { color: colors.onPrimary }]}>Continue Reading</Text>
        </TouchableOpacity>

        {/* Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.surface }]} onPress={handleBookmarks}>
            <Bookmark size={20} color={colors.textSecondary} strokeWidth={2} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Bookmarks</Text>
              <Text style={[styles.actionCount, { color: colors.textSecondary }]}>({bookData.bookmarks})</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionItem, { backgroundColor: colors.surface }]} onPress={handleHighlights}>
            <Highlighter size={20} color={colors.textSecondary} strokeWidth={2} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Highlights</Text>
              <Text style={[styles.actionCount, { color: colors.textSecondary }]}>({bookData.highlights})</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Chat with Book */}
        <TouchableOpacity style={[styles.chatButton, { backgroundColor: colors.surface }]} onPress={handleChatWithBook}>
          <MessageCircle size={20} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.chatButtonText, { color: colors.text }]}>Chat with Book</Text>
        </TouchableOpacity>

        {/* Description Section */}
        <View style={dynamicStyles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{bookData.description}</Text>
        </View>

        {/* Add some bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="library" navigation={navigation} />
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
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

  // Main Content
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Book Cover Section
  bookCoverSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  bookCoverContainer: {
    alignItems: 'center',
  },
  bookCover: {
    width: 200,
    height: 280,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Book Info Section
  bookInfoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  bookMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookMeta: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  bookMetaDivider: {
    fontSize: 14,
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  categoryContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Progress Section
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 4,
  },
  progressDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressDetails: {
    fontSize: 14,
    color: '#1F2937',
  },
  timeLeft: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Continue Button
  continueButton: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionLabel: {
    fontSize: 14,
    color: '#1F2937',
    marginRight: 4,
  },
  actionCount: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Chat Button
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatButtonText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },

  // Description Section
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
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
  progressSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionSection: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});