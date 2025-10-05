import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  BookOpen, 
  Download, 
  Star, 
  Clock, 
  User,
  List,
  ChevronDown
} from 'lucide-react-native';
import { getBooksForDiscover, getBooksByCategory, searchBooks, BOOK_CATEGORIES, Book } from '../data/bookData';

const { width } = Dimensions.get('window');

interface DiscoverScreenProps {
  navigation: any;
}

// Book interface is now imported from bookData.ts

export default function DiscoverScreen({ navigation }: DiscoverScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Get books from centralized data
  const getFilteredBooks = (): Book[] => {
    let books = getBooksForDiscover();
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      books = getBooksByCategory(selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      books = searchBooks(searchQuery);
    }
    
    return books;
  };

  const books = getFilteredBooks();
  const categories = BOOK_CATEGORIES;

  const handleAddToLibrary = (book: Book) => {
    Alert.alert(
      'Add to Library',
      `Add "${book.title}" by ${book.author} to your library?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Library', 
          onPress: () => {
            // TODO: Implement actual add to library functionality
            Alert.alert('Success', `"${book.title}" has been added to your library!`);
          }
        },
      ]
    );
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetails', { book });
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderBookCard = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={[
        styles.bookCard,
        styles.bookCardList,
        { backgroundColor: colors.surface }
      ]}
      onPress={() => handleBookPress(item)}
    >
      <View style={styles.bookCoverContainerList}>
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} />
        {item.isFree ? (
          <View style={[styles.freeBadge, { backgroundColor: colors.success }]}>
            <Text style={[styles.freeBadgeText, { color: colors.surface }]}>FREE</Text>
          </View>
        ) : (
          <View style={[styles.priceBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceBadgeText, { color: colors.surface }]}>
              ${item.price?.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.bookInfo}>
        <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
          by {item.author}
        </Text>
        
        <View style={styles.bookMeta}>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.warning} fill={colors.warning} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {item.rating}
            </Text>
          </View>
          <Text style={[styles.downloadCount, { color: colors.textSecondary }]}>
            {formatDownloadCount(item.downloadCount)} downloads
          </Text>
        </View>
        
        <Text style={[styles.bookDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.bookActions}>
          <View style={styles.bookDetails}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={[styles.bookDetailText, { color: colors.textSecondary }]}>
              {item.pages} pages
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={(e) => {
              e.stopPropagation();
              handleAddToLibrary(item);
            }}
          >
            <Download size={16} color={colors.surface} />
            <Text style={[styles.addButtonText, { color: colors.surface }]}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      backgroundColor: colors.background,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    categoryButtonTextActive: {
      color: colors.surface,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    booksContainer: {
      paddingTop: 20,
    },
    bookCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bookCardList: {
      flexDirection: 'row',
    },
    bookCoverContainerList: {
      position: 'relative',
      alignItems: 'center',
      marginBottom: 12,
      marginRight: 16,
    },
    bookCoverContainer: {
      position: 'relative',
      alignItems: 'center',
      marginBottom: 12,
    },
    bookCover: {
      width: 120,
      height: 180,
      borderRadius: 8,
    },
    freeBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    freeBadgeText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    priceBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    priceBadgeText: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    bookInfo: {
      flex: 1,
    },
    bookTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
    },
    bookAuthor: {
      fontSize: 14,
      marginBottom: 8,
    },
    bookMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    ratingText: {
      fontSize: 14,
      marginLeft: 4,
    },
    downloadCount: {
      fontSize: 12,
    },
    bookDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    bookActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bookDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bookDetailText: {
      fontSize: 12,
      marginLeft: 4,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Books</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.controlsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

        </View>
      </View>

      <View style={styles.content}>
        {books.length > 0 ? (
        <FlatList
          data={books}
            renderItem={renderBookCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.booksContainer, { paddingBottom: 100 + insets.bottom }]}
            numColumns={1}
          />
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={64} color={colors.textSecondary} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No Books Found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or category filter to discover more books.
            </Text>
          </View>
        )}
      </View>

    </View>
  );
}
