import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Search,
  Filter,
  Plus,
  BookOpen,
  Clock,
  MoreVertical,
  Upload,
  Library,
  Grid3X3,
  List,
  SortAsc,
  X,
  Star,
  BookMarked,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { booksService } from '../services/booksService';
import type { Book } from '../config/api';

const { width } = Dimensions.get('window');

export default function LibraryScreen({ navigation }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // State management
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filter, setFilter] = useState('all'); // all, reading, completed, favorites
  const [viewMode, setViewMode] = useState('list'); // list, grid
  const [sortBy, setSortBy] = useState('lastRead'); // lastRead, title, author, progress
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  // Fetch books from API
  const fetchBooks = async (showLoader = true, page = 1, append = false) => {
    try {
      if (showLoader && page === 1) setIsLoading(true);
      if (page > 1) setIsLoadingMore(true);
      setError(null);

      const response = await booksService.getBooks({
        status: filter === 'all' ? undefined : filter,
        sort: sortBy === 'lastRead' ? undefined : sortBy,
        page: page,
      });

      if (response.success && response.data) {
        // Ensure data is an array
        const booksData = Array.isArray(response.data) ? response.data : [];

        if (append && page > 1) {
          setBooks(prev => [...prev, ...booksData]);
        } else {
          setBooks(booksData);
        }

        // Update pagination state
        setCurrentPage(page);
        setHasMore(response.pagination?.has_more || false);
        setTotalCount(response.pagination?.total_count || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch books');
      }
    } catch (err: any) {
      console.error('Failed to fetch books:', err);
      setError(err.message || 'Failed to load books');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  // Load more books
  const loadMoreBooks = () => {
    if (!isLoadingMore && hasMore && !isLoading) {
      fetchBooks(false, currentPage + 1, true);
    }
  };

  // Refresh books
  const handleRefresh = () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    fetchBooks(false, 1, false);
  };

  // Fetch books on mount and when returning to screen
  useFocusEffect(
    React.useCallback(() => {
      fetchBooks();
    }, [filter, sortBy])
  );

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  React.useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: isSearchVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSearchVisible]);

  const handleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const handleSort = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  const handleBookPress = (book: any) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleBookOptions = (bookId: string) => {
    Alert.alert(
      'Book Options',
      'What would you like to do with this book?',
      [
        { text: 'Continue Reading', onPress: () => console.log('Continue reading') },
        { text: 'Mark as Favorite', onPress: () => console.log('Mark favorite') },
        { text: 'Remove from Library', onPress: () => console.log('Remove book'), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    // In a real app, this would update the database
    console.log('Toggle favorite for:', bookId);
  };

  const getFilteredBooks = () => {
    // Ensure books is always an array
    const booksArray = Array.isArray(books) ? books : [];
    let filteredBooks = booksArray;

    // Apply filter based on processing status
    switch (filter) {
      case 'reading':
        filteredBooks = booksArray.filter(book => book.processing_status === 'completed');
        break;
      case 'completed':
        filteredBooks = booksArray.filter(book => book.processing_status === 'completed');
        break;
      case 'favorites':
        // Note: favorites would need to be implemented in backend
        filteredBooks = booksArray;
        break;
      default:
        filteredBooks = booksArray;
    }

    // Apply search
    if (searchQuery.trim()) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sorting (done on backend, but can re-sort client-side)
    return filteredBooks.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return (a.author || '').localeCompare(b.author || '');
        default:
          // Sort by uploaded_at (newest first)
          return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      }
    });
  };

  const renderBookItem = ({ item }: { item: Book }) => {
    const pageCount = item.metadata?.page_count || 0;
    const statusBadge = item.processing_status === 'processing' ? 'Processing...' :
                       item.processing_status === 'failed' ? 'Failed' :
                       item.processing_status === 'pending' ? 'Pending' : null;

    // Placeholder cover if none exists
    const coverUrl = item.metadata?.cover_image_path ||
                     'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';

    return (
      <Animated.View
        style={[
          dynamicStyles.bookCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={dynamicStyles.bookCardContent}
          onPress={() => handleBookPress(item)}
          activeOpacity={0.7}
        >
          <View style={dynamicStyles.bookCoverContainer}>
            <Image source={{ uri: coverUrl }} style={dynamicStyles.bookCover} />
            {statusBadge && (
              <View style={[dynamicStyles.progressOverlay,
                item.processing_status === 'failed' && { backgroundColor: '#EF4444' }
              ]}>
                <Text style={dynamicStyles.progressText}>{statusBadge}</Text>
              </View>
            )}
          </View>

          <View style={dynamicStyles.bookInfo}>
            <View style={dynamicStyles.bookHeader}>
              <Text style={dynamicStyles.bookTitle} numberOfLines={2}>{item.title}</Text>
              <TouchableOpacity
                style={dynamicStyles.favoriteButton}
                onPress={() => handleToggleFavorite(item.uuid)}
              >
                <Star
                  size={16}
                  color={colors.textTertiary}
                  fill="transparent"
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            <Text style={dynamicStyles.bookAuthor} numberOfLines={1}>
              {item.author || 'Unknown Author'}
            </Text>
            <Text style={dynamicStyles.bookCategory}>
              {item.file_type?.toUpperCase() || 'BOOK'} • {item.metadata?.language || 'EN'}
            </Text>

            <View style={dynamicStyles.bookMeta}>
              <View style={dynamicStyles.metaItem}>
                <BookOpen size={12} color={colors.textSecondary} strokeWidth={2} />
                <Text style={dynamicStyles.metaText}>{pageCount} pages</Text>
              </View>
              <View style={dynamicStyles.metaItem}>
                <Clock size={12} color={colors.textSecondary} strokeWidth={2} />
                <Text style={dynamicStyles.metaText}>
                  {new Date(item.uploaded_at).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {item.processing_status === 'completed' && (
              <View style={dynamicStyles.progressBarContainer}>
                <View style={dynamicStyles.progressBarBackground}>
                  <View
                    style={[
                      dynamicStyles.progressBarFill,
                      { width: '0%' }
                    ]}
                  />
                </View>
              </View>
            )}

            <Text style={dynamicStyles.lastRead}>
              Uploaded {new Date(item.uploaded_at).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            style={dynamicStyles.bookOptionsButton}
            onPress={() => handleBookOptions(item.uuid)}
          >
            <MoreVertical size={18} color={colors.textTertiary} strokeWidth={2} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={dynamicStyles.header}>
        <Animated.View 
          style={[
            dynamicStyles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={dynamicStyles.headerTitleRow}>
            <View style={dynamicStyles.logoContainer}>
              <Library size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View>
              <Text style={dynamicStyles.headerTitle}>My Library</Text>
              <Text style={dynamicStyles.headerSubtitle}>
                {totalCount > 0 ? `${totalCount} book${totalCount === 1 ? '' : 's'}` : '0 books'}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.headerActions}>
            <TouchableOpacity 
              style={[
                dynamicStyles.headerButton, 
                isSearchVisible && dynamicStyles.headerButtonActive
              ]} 
              onPress={handleSearch}
            >
              <Search size={20} color={isSearchVisible ? colors.primary : colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                dynamicStyles.headerButton,
                showSortOptions && dynamicStyles.headerButtonActive
              ]} 
              onPress={handleSort}
            >
              <SortAsc size={20} color={showSortOptions ? colors.primary : colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={dynamicStyles.headerButton} 
              onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? (
                <Grid3X3 size={20} color={colors.textSecondary} strokeWidth={2} />
              ) : (
                <List size={20} color={colors.textSecondary} strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Search Bar */}
      <Animated.View 
        style={[
          dynamicStyles.searchContainer,
          {
            opacity: searchAnim,
            transform: [
              {
                scaleY: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={dynamicStyles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} strokeWidth={2} />
          <TextInput
            style={dynamicStyles.searchInput}
            placeholder="Search books, authors, categories..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={isSearchVisible}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View 
        style={[
          dynamicStyles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.filterTabsContent}
        >
          <TouchableOpacity
            style={[
              dynamicStyles.filterTab,
              filter === 'all' && dynamicStyles.filterTabActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              dynamicStyles.filterText,
              filter === 'all' && dynamicStyles.filterTextActive
            ]}>
              All Books ({books.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.filterTab,
              filter === 'reading' && dynamicStyles.filterTabActive
            ]}
            onPress={() => setFilter('reading')}
          >
            <Text style={[
              dynamicStyles.filterText,
              filter === 'reading' && dynamicStyles.filterTextActive
            ]}>
              Reading ({books.filter(b => (b.progress || 0) > 0 && (b.progress || 0) < 100).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.filterTab,
              filter === 'completed' && dynamicStyles.filterTabActive
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[
              dynamicStyles.filterText,
              filter === 'completed' && dynamicStyles.filterTextActive
            ]}>
              Completed ({books.filter(b => (b.progress || 0) === 100).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              dynamicStyles.filterTab,
              filter === 'favorites' && dynamicStyles.filterTabActive
            ]}
            onPress={() => setFilter('favorites')}
          >
            <Text style={[
              dynamicStyles.filterText,
              filter === 'favorites' && dynamicStyles.filterTextActive
            ]}>
              Favorites ({books.filter(b => b.isFavorite).length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Sort Options */}
      {showSortOptions && (
        <Animated.View 
          style={[
            dynamicStyles.sortOptionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'lastRead', label: 'Last Read' },
              { key: 'title', label: 'Title' },
              { key: 'author', label: 'Author' },
              { key: 'progress', label: 'Progress' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  dynamicStyles.sortOption,
                  sortBy === option.key && dynamicStyles.sortOptionActive
                ]}
                onPress={() => {
                  setSortBy(option.key);
                  setShowSortOptions(false);
                }}
              >
                <Text style={[
                  dynamicStyles.sortOptionText,
                  sortBy === option.key && dynamicStyles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Add Book Button */}
      <Animated.View 
        style={[
          dynamicStyles.addBookSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity style={dynamicStyles.addBookButton} onPress={handleAddBook}>
          <View style={dynamicStyles.addBookIcon}>
            <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={dynamicStyles.addBookContent}>
            <Text style={dynamicStyles.addBookTitle}>Add New Book</Text>
            <Text style={dynamicStyles.addBookSubtitle}>Upload PDF or EPUB</Text>
          </View>
          <Upload size={20} color={colors.onPrimary} strokeWidth={2} />
        </TouchableOpacity>
      </Animated.View>

      {/* Books List */}
      {isLoading ? (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={dynamicStyles.loadingText}>Loading your library...</Text>
        </View>
      ) : error ? (
        <View style={dynamicStyles.errorContainer}>
          <View style={dynamicStyles.errorIcon}>
            <X size={48} color={colors.error} strokeWidth={1} />
          </View>
          <Text style={dynamicStyles.errorTitle}>Failed to Load Books</Text>
          <Text style={dynamicStyles.errorMessage}>{error}</Text>
          <TouchableOpacity style={dynamicStyles.retryButton} onPress={() => fetchBooks()}>
            <Text style={dynamicStyles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={getFilteredBooks()}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={[dynamicStyles.booksList, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onEndReached={loadMoreBooks}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={dynamicStyles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={dynamicStyles.footerLoaderText}>Loading more books...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <Animated.View
              style={[
                dynamicStyles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={dynamicStyles.emptyStateIcon}>
                <BookOpen size={48} color={colors.textTertiary} strokeWidth={1} />
              </View>
              <Text style={dynamicStyles.emptyStateTitle}>
                {searchQuery ? 'No books found' : 'No books in your library'}
              </Text>
              <Text style={dynamicStyles.emptyStateSubtitle}>
                {searchQuery
                  ? `No books match "${searchQuery}"`
                  : 'Upload your first PDF or EPUB to get started'
                }
              </Text>
              {!searchQuery && (
                <TouchableOpacity style={dynamicStyles.emptyStateButton} onPress={handleAddBook}>
                  <Text style={dynamicStyles.emptyStateButtonText}>Add Your First Book</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          }
        />
      )}

    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header Styles
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonActive: {
    backgroundColor: colors.backgroundSecondary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Search Bar
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    height: 60,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },

  // Filter Tabs
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 4,
    marginTop: -38,
  },
  filterTabsContent: {
    paddingRight: 24,
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // Sort Options
  sortOptionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sortOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortOptionActive: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary,
  },
  sortOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Add Book Section
  addBookSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  addBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBookIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addBookContent: {
    flex: 1,
  },
  addBookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
    marginBottom: 2,
  },
  addBookSubtitle: {
    fontSize: 12,
    color: colors.onPrimary,
    opacity: 0.8,
  },

  // Books List
  booksList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  bookCard: {
    marginBottom: 16,
  },
  bookCardContent: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
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
    width: 70,
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 10,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bookCategory: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  lastRead: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  bookOptionsButton: {
    padding: 8,
    marginLeft: 8,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onPrimary,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Footer Loader
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoaderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});