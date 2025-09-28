import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Clock,
  MoreVertical,
  Upload,
  Library,
} from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function LibraryScreen({ navigation }: any) {
  const { colors } = useTheme();

  // Mock library data
  const [books] = useState([
    {
      id: '1',
      title: 'The Lean Startup',
      author: 'Eric Ries',
      progress: 73,
      currentPage: 142,
      totalPages: 350,
      coverUrl: 'https://via.placeholder.com/120x160/CCCCCC/666666?text=Lean+Startup',
      readingTime: '24h',
      lastRead: '2 days ago',
    },
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      progress: 45,
      currentPage: 98,
      totalPages: 220,
      coverUrl: 'https://via.placeholder.com/120x160/DDDDDD/777777?text=Atomic+Habits',
      readingTime: '12h',
      lastRead: '1 week ago',
    },
    {
      id: '3',
      title: 'Deep Work',
      author: 'Cal Newport',
      progress: 100,
      currentPage: 296,
      totalPages: 296,
      coverUrl: 'https://via.placeholder.com/120x160/EEEEEE/888888?text=Deep+Work',
      readingTime: '18h',
      lastRead: '1 month ago',
    },
    {
      id: '4',
      title: 'Think Fast and Slow',
      author: 'Daniel Kahneman',
      progress: 12,
      currentPage: 56,
      totalPages: 499,
      coverUrl: 'https://via.placeholder.com/120x160/F0F0F0/999999?text=Think+Fast',
      readingTime: '4h',
      lastRead: '3 days ago',
    },
  ]);

  const [filter, setFilter] = useState('all'); // all, reading, completed

  const handleSearch = () => {
    console.log('Search tapped');
  };

  const handleFilter = () => {
    console.log('Filter tapped');
  };

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  const handleBookPress = (book: any) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleBookOptions = (bookId: string) => {
    console.log('Book options tapped for:', bookId);
  };

  const getFilteredBooks = () => {
    switch (filter) {
      case 'reading':
        return books.filter(book => book.progress > 0 && book.progress < 100);
      case 'completed':
        return books.filter(book => book.progress === 100);
      default:
        return books;
    }
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.bookCard, { backgroundColor: colors.surface }]} onPress={() => handleBookPress(item)}>
      <View style={styles.bookCoverContainer}>
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} />
        {item.progress > 0 && (
          <View style={[styles.progressOverlay, { backgroundColor: colors.primary }]}>
            <Text style={[styles.progressText, { color: colors.onPrimary }]}>{item.progress}%</Text>
          </View>
        )}
      </View>

      <View style={styles.bookInfo}>
        <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.bookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>{item.author}</Text>

        <View style={styles.bookMeta}>
          <View style={styles.metaItem}>
            <BookOpen size={12} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.currentPage}/{item.totalPages}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.readingTime}</Text>
          </View>
        </View>

        <Text style={[styles.lastRead, { color: colors.textTertiary }]}>Last read {item.lastRead}</Text>
      </View>

      <TouchableOpacity
        style={styles.bookOptionsButton}
        onPress={() => handleBookOptions(item.id)}
      >
        <MoreVertical size={16} color={colors.textTertiary} strokeWidth={2} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={dynamicStyles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Library size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>My Library</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]} onPress={handleSearch}>
              <Search size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]} onPress={handleFilter}>
              <Filter size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, { backgroundColor: colors.surface }, filter === 'all' && { backgroundColor: colors.primary }]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, { color: colors.textSecondary }, filter === 'all' && { color: colors.onPrimary }]}>
            All Books ({books.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, { backgroundColor: colors.surface }, filter === 'reading' && { backgroundColor: colors.primary }]}
          onPress={() => setFilter('reading')}
        >
          <Text style={[styles.filterText, { color: colors.textSecondary }, filter === 'reading' && { color: colors.onPrimary }]}>
            Reading ({books.filter(b => b.progress > 0 && b.progress < 100).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, { backgroundColor: colors.surface }, filter === 'completed' && { backgroundColor: colors.primary }]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, { color: colors.textSecondary }, filter === 'completed' && { color: colors.onPrimary }]}>
            Completed ({books.filter(b => b.progress === 100).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Book Button */}
      <View style={styles.addBookSection}>
        <TouchableOpacity style={[styles.addBookButton, { backgroundColor: colors.primary }]} onPress={handleAddBook}>
          <Upload size={20} color={colors.onPrimary} strokeWidth={2} />
          <Text style={[styles.addBookText, { color: colors.onPrimary }]}>Add Book (Upload PDF)</Text>
        </TouchableOpacity>
      </View>

      {/* Books List */}
      <FlatList
        data={getFilteredBooks()}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={48} color={colors.textTertiary} strokeWidth={1} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No books found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}>
              {filter === 'all' ? 'Upload your first PDF to get started' : 'No books in this category'}
            </Text>
          </View>
        }
      />

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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
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

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#1F2937',
  },
  filterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },

  // Add Book Section
  addBookSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  addBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addBookText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Books List
  booksList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookCoverContainer: {
    position: 'relative',
    marginRight: 16,
  },
  bookCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#1F2937',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lastRead: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bookOptionsButton: {
    padding: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
});