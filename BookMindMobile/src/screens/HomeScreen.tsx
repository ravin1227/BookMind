import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Bell,
  BookOpen,
  Clock,
  Flame,
  BookMarked,
  ChevronRight,
  Plus,
} from 'lucide-react-native';
import BottomNavBar from '../components/BottomNavBar';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();

  // Animation for header hide/show
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 120; // Approximate header height

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Mock data - will be replaced with real data later
  const currentBook = {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    chapter: 'Chapter 9: Metrics',
    currentPage: 142,
    totalPages: 350,
    progress: 73,
    timeLeft: 23,
    coverUrl: 'https://via.placeholder.com/80x100/CCCCCC/666666?text=Book+Cover',
  };

  const dailyGoal = {
    current: 24,
    target: 30,
  };

  const readingStreak = 12;

  const weekStats = {
    booksRead: 2,
    timeRead: 3.2,
  };

  // Mock recommended books from library
  const recommendedBooks = [
    {
      id: '1',
      title: 'Atomic Habits',
      author: 'James Clear',
      coverUrl: 'https://via.placeholder.com/120x160/DDDDDD/777777?text=Atomic+Habits',
    },
    {
      id: '2',
      title: 'Think Fast and Slow',
      author: 'Daniel Kahneman',
      coverUrl: 'https://via.placeholder.com/120x160/F0F0F0/999999?text=Think+Fast',
    },
    {
      id: '3',
      title: 'The 7 Habits',
      author: 'Stephen Covey',
      coverUrl: 'https://via.placeholder.com/120x160/E5E5E5/888888?text=7+Habits',
    },
    {
      id: '4',
      title: 'Deep Work',
      author: 'Cal Newport',
      coverUrl: 'https://via.placeholder.com/120x160/EEEEEE/888888?text=Deep+Work',
    },
    {
      id: '5',
      title: 'Sapiens',
      author: 'Yuval Harari',
      coverUrl: 'https://via.placeholder.com/120x160/F5F5F5/AAAAAA?text=Sapiens',
    },
    {
      id: '6',
      title: 'Mindset',
      author: 'Carol Dweck',
      coverUrl: 'https://via.placeholder.com/120x160/FAFAFA/BBBBBB?text=Mindset',
    },
    {
      id: '7',
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      coverUrl: 'https://via.placeholder.com/120x160/F8F8F8/999999?text=Power+Now',
    },
  ];

  const handleContinueReading = () => {
    navigation.navigate('ContinueReading', {
      book: currentBook,
    });
  };

  const handleBookTitlePress = () => {
    navigation.navigate('BookDetail', {
      book: currentBook,
    });
  };

  const handleNotification = () => {
    console.log('Notification tapped');
  };

  const handleBookPress = (book: any) => {
    navigation.navigate('BookDetail', { book });
  };

  const handleViewMoreBooks = () => {
    navigation.navigate('Library');
  };

  const progressPercentage = (dailyGoal.current / dailyGoal.target) * 100;
  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      <SafeAreaView style={dynamicStyles.topSafeArea} />
      {/* Animated Header Section */}
      <Animated.View
        style={[
          dynamicStyles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <SafeAreaView style={dynamicStyles.header}>
          <View style={dynamicStyles.headerContent}>
            <View style={dynamicStyles.headerLeft}>
              <View style={dynamicStyles.greetingRow}>
                <Text style={dynamicStyles.greeting}>Good morning, John!</Text>
                <TouchableOpacity style={dynamicStyles.notificationButton} onPress={handleNotification}>
                  <Bell size={24} color={colors.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>
              <Text style={dynamicStyles.subtitle}>Ready to continue your reading journey?</Text>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Continue Reading Card */}
        <View style={dynamicStyles.continueReadingCard}>
          <View style={styles.bookSection}>
            <View style={styles.bookCoverContainer}>
              <Image source={{ uri: currentBook.coverUrl }} style={styles.bookCover} />
            </View>

            <View style={styles.bookInfo}>
              <TouchableOpacity onPress={handleBookTitlePress}>
                <Text style={[styles.bookTitle, { color: colors.text }]}>{currentBook.title}</Text>
              </TouchableOpacity>
              <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>{currentBook.author}</Text>
              <View style={styles.chapterRow}>
                <BookOpen size={16} color={colors.textSecondary} strokeWidth={2} />
                <Text style={[styles.chapterInfo, { color: colors.textSecondary }]}>{currentBook.chapter}</Text>
              </View>
              <Text style={[styles.pageInfo, { color: colors.textTertiary }]}>
                Page {currentBook.currentPage} of {currentBook.totalPages}
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.text }]}>Reading Progress</Text>
              <Text style={[styles.progressPercentage, { color: colors.text }]}>{currentBook.progress}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${currentBook.progress}%` }]} />
            </View>
            <View style={styles.timeLeftRow}>
              <Clock size={16} color={colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.timeLeft, { color: colors.textSecondary }]}>~{currentBook.timeLeft} min left in chapter</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.primary }]} onPress={handleContinueReading}>
            <Text style={[styles.continueButtonText, { color: colors.onPrimary }]}>Continue Reading</Text>
            <Text style={[styles.continueButtonArrow, { color: colors.onPrimary }]}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Your Progress Today */}
        <View style={dynamicStyles.progressTodayCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress Today</Text>

          <View style={styles.progressRow}>
            <View style={styles.dailyGoalSection}>
              <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Daily Reading Goal</Text>
              <Text style={[styles.goalTime, { color: colors.text }]}>{dailyGoal.current}/{dailyGoal.target} min</Text>
              <View style={[styles.goalProgressBar, { backgroundColor: colors.borderLight }]}>
                <View style={[styles.goalProgressFill, { backgroundColor: colors.primary, width: `${progressPercentage}%` }]} />
              </View>
            </View>

            <View style={styles.streakSection}>
              <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Reading Streak</Text>
              <View style={styles.streakContent}>
                <Flame size={24} color="#F59E0B" strokeWidth={2} />
                <View style={styles.streakInfo}>
                  <Text style={[styles.streakNumber, { color: colors.text }]}>{readingStreak}</Text>
                  <Text style={[styles.streakDays, { color: colors.textSecondary }]}>days</Text>
                </View>
              </View>
              <Text style={[styles.streakMessage, { color: colors.textSecondary }]}>Keep it going!</Text>
            </View>
          </View>
        </View>

        {/* This Week Stats */}
        <View style={dynamicStyles.weekStatsCard}>
          <View style={styles.weekStatsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>This Week</Text>
            <TouchableOpacity style={[styles.analyticsButton, { backgroundColor: colors.borderLight }]} onPress={() => navigation.navigate('Analytics')}>
              <ChevronRight size={20} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: colors.backgroundSecondary }]}>
              <BookMarked size={24} color={colors.textSecondary} strokeWidth={2} />
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Books Read</Text>
                <Text style={[styles.statNumber, { color: colors.text }]}>{weekStats.booksRead}</Text>
              </View>
            </View>

            <View style={[styles.statItem, { backgroundColor: colors.backgroundSecondary }]}>
              <Clock size={24} color={colors.textSecondary} strokeWidth={2} />
              <View style={styles.statContent}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Time Read</Text>
                <Text style={[styles.statNumber, { color: colors.text }]}>{weekStats.timeRead}h</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recommended Books Section */}
        <View style={dynamicStyles.recommendedBooksCard}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 16 }]}>Next to Read</Text>

          <View style={styles.booksGrid}>
            {recommendedBooks.map((book, index) => (
              <TouchableOpacity key={book.id} style={styles.bookGridItem} onPress={() => handleBookPress(book)}>
                <Image source={{ uri: book.coverUrl }} style={styles.bookGridCover} />
              </TouchableOpacity>
            ))}

            {/* View More Button */}
            <TouchableOpacity style={[styles.viewMoreButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} onPress={handleViewMoreBooks}>
              <View style={[styles.viewMoreArrowBg, { backgroundColor: colors.border }]}>
                <ChevronRight size={20} color={colors.textSecondary} strokeWidth={2} />
              </View>
              <Text style={[styles.viewMoreText, { color: colors.textSecondary }]}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add some bottom padding for the navigation */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="home" navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topSafeArea: {
    backgroundColor: '#FFFFFF',
  },

  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingInline: 26,
  },
  headerLeft: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 20,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Main Content
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70, // Further reduced gap between header and content
  },

  // Continue Reading Card
  continueReadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  bookCoverContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  bookCover: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  bookCoverLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  chapterInfo: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
  },
  pageInfo: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Progress Section
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 4,
  },
  timeLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLeft: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
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
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  continueButtonArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Progress Today Card
  progressTodayCard: {
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },

  // Daily Goal Section
  dailyGoalSection: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  goalTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 3,
  },

  // Streak Section
  streakSection: {
    flex: 1,
    paddingLeft: 12,
  },
  streakLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 8,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 28,
  },
  streakDays: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  streakMessage: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Week Stats Card
  weekStatsCard: {
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
  weekStatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analyticsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statContent: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 14,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },

  // Recommended Books Section
  recommendedBooksCard: {
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
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  bookGridItem: {
    width: '23%',
    marginBottom: 12,
  },
  bookGridCover: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  bookGridTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 14,
  },
  bookGridAuthor: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  viewMoreButton: {
    width: '23%',
    aspectRatio: 3/4,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  viewMoreArrowBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },

});

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSafeArea: {
    backgroundColor: colors.statusBar,
  },

  // Header Styles
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingInline: 26,
  },
  headerLeft: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Cards
  continueReadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressTodayCard: {
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
  weekStatsCard: {
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
  recommendedBooksCard: {
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