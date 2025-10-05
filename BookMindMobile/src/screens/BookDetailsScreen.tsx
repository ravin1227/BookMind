import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Book } from '../data/bookData';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Star, 
  Clock, 
  BookOpen, 
  Calendar,
  User,
  Heart,
  Bookmark
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface BookDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      book: Book;
    };
  };
}

export default function BookDetailsScreen({ navigation, route }: BookDetailsScreenProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { book } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Determine if book is owned
  const isOwned = book.isOwned === true;

  const handleStartReading = () => {
    navigation.navigate('ContinueReading', { 
      book: book,
      content: getBookPreviewContent(book.id)
    });
  };

  const handleViewBookmarks = () => {
    Alert.alert('Bookmarks', `You have ${book.bookmarksCount || 0} bookmarks in this book.`);
  };

  const handleViewHighlights = () => {
    Alert.alert('Highlights', `You have ${book.highlightsCount || 0} highlights in this book.`);
  };

  const handleChatWithBook = () => {
    Alert.alert('Chat with Book', 'AI chat feature coming soon!');
  };

  const handleAddToLibrary = () => {
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing book: "${book.title}" by ${book.author}`,
        title: book.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReadPreview = () => {
    navigation.navigate('ContinueReading', { 
      book: book,
      content: getBookPreviewContent(book.id)
    });
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getBookPreviewContent = (bookId: string) => {
    // Mock preview content for different books
    const previewContent = {
      '1': `Chapter 1: The Great Gatsby

In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.

"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores. The abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person, and so it came about that in college I was unjustly accused of being a politician, because I was privy to the secret griefs of wild, unknown men. Most of the big shore places were closed now and there were hardly any lights except the shadowy, moving glow of a ferryboat across the Sound. And as the moon rose higher the inessential houses began to melt away until gradually I became aware of the old island here that flowered once for Dutch sailors' eyes—a fresh, green breast of the new world. Its vanished trees, the trees that had made way for Gatsby's house, had once pandered in whispers to the last and greatest of all human dreams; for a transitory enchanted moment man must have held his breath in the presence of this continent, compelled into an aesthetic contemplation he neither understood nor desired, face to face for the last time in history with something commensurate to his capacity for wonder.`,
      '2': `Chapter 1: Scout

When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem's fears of never being able to play football were assuaged, he was seldom self-conscious about his injury. His left arm was somewhat shorter than his right; when he stood or walked, the back of his hand was at right angles to his body, his thumb parallel to his thigh. He couldn't have cared less, so long as he could pass and punt.

When enough years had gone by to enable us to look back on them, we sometimes discussed the events leading to his accident. I maintain that the Ewells started it all, but Jem, who was four years my senior, said it started long before that. He said it began the summer Dill came to us, when Dill first gave us the idea of making Boo Radley come out.

I said if he wanted to take a broad view of the thing, it really began with Andrew Jackson. If General Jackson hadn't run the Creeks up the creek, Simon Finch would never have paddled up the Alabama, and where would we be if he hadn't? We were far too old to settle an argument with a fist-fight, so we consulted Atticus. Our father said we were both right.`,
      '3': `Chapter 1: The Let Them Theory

It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features. Winston kept his back turned to the telescreen. It was safer; though, as he well knew, even a back can be revealing. A kilometre away the Ministry of Truth, his place of work, towered vast and white above the grimy landscape. This, he thought with a sort of vague distaste—this was London, the capital of Airstrip One, itself a province of the state of Oceania.`,
      'default': `Chapter 1: The Beginning

The story begins in a small town where nothing ever happens. The protagonist, a young person with dreams bigger than their circumstances, finds themselves at a crossroads. Life has presented them with an opportunity that could change everything, but it comes with risks they're not sure they're ready to take.

As the morning sun filtered through the dusty windows of their small apartment, they realized that today would be different. Today, they would make a choice that would define the rest of their life. The question was: would they have the courage to take the leap, or would they continue down the safe, predictable path they had always known?

The clock on the wall ticked loudly in the silence, each second bringing them closer to the moment of decision. Outside, the city was waking up, but inside this small room, time seemed to stand still as they weighed their options.`
    };
    
    return previewContent[bookId as keyof typeof previewContent] || previewContent.default;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      marginRight: 15,
    },
    headerActions: {
      flexDirection: 'row',
      marginLeft: 'auto',
    },
    actionButton: {
      padding: 8,
      marginLeft: 8,
    },
    content: {
      flex: 1,
    },
    bookCoverSection: {
      alignItems: 'center',
      paddingVertical: 30,
      backgroundColor: colors.surface,
    },
    bookCover: {
      width: 200,
      height: 300,
      borderRadius: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    bookCoverContainer: {
      position: 'relative',
    },
    priceBadge: {
      position: 'absolute',
      top: -10,
      right: -10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    priceBadgeText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    freeBadge: {
      position: 'absolute',
      top: -10,
      right: -10,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    freeBadgeText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    bookInfo: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    bookTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    bookAuthor: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    bookMeta: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    ratingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    downloadCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    bookDescription: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 24,
    },
    bookDetails: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailIcon: {
      marginRight: 12,
    },
    detailText: {
      fontSize: 16,
      color: colors.text,
    },
    detailLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      marginRight: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 20,
      justifyContent: 'space-between',
    },
    primaryButton: {
      flex: 0.48,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    secondaryButton: {
      flex: 0.48,
      backgroundColor: colors.surface,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: '600',
    },
    secondaryButtonText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    previewSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    previewText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    readPreviewButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    readPreviewButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    readingProgressSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
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
      color: colors.text,
    },
    progressPercentage: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.borderLight,
      borderRadius: 4,
      marginBottom: 12,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pageInfo: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    timeLeft: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    interactiveFeaturesSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    featureButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderRadius: 8,
      marginBottom: 8,
    },
    featureButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark 
              size={24} 
              color={isBookmarked ? colors.primary : colors.textSecondary} 
              fill={isBookmarked ? colors.primary : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Heart 
              size={24} 
              color={isLiked ? colors.error : colors.textSecondary} 
              fill={isLiked ? colors.error : 'none'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Share2 size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bookCoverSection}>
          <View style={styles.bookCoverContainer}>
            <Image source={{ uri: book.coverUrl }} style={styles.bookCover} />
            {book.isFree ? (
              <View style={[styles.freeBadge, { backgroundColor: colors.success }]}>
                <Text style={[styles.freeBadgeText, { color: colors.surface }]}>FREE</Text>
              </View>
            ) : (
              <View style={[styles.priceBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.priceBadgeText, { color: colors.surface }]}>
                  ${book.price?.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          
          <View style={styles.bookMeta}>
            <View style={styles.ratingContainer}>
              <Star size={20} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>{book.rating}</Text>
            </View>
            <Text style={styles.downloadCount}>
              {formatDownloadCount(book.downloadCount)} downloads
            </Text>
          </View>

          <Text style={styles.bookDescription}>{book.description}</Text>

          <View style={styles.bookDetails}>
            <View style={styles.detailRow}>
              <BookOpen size={20} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailText}>{book.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={20} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Pages:</Text>
              <Text style={styles.detailText}>{book.pages}</Text>
            </View>
            <View style={styles.detailRow}>
              <Calendar size={20} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Published:</Text>
              <Text style={styles.detailText}>{book.publishedYear}</Text>
            </View>
            <View style={styles.detailRow}>
              <User size={20} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Author:</Text>
              <Text style={styles.detailText}>{book.author}</Text>
            </View>
          </View>

          {isOwned && (
            <View style={styles.readingProgressSection}>
              <Text style={styles.progressTitle}>Reading Progress</Text>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercentage}>{book.progress || 0}%</Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
                <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${book.progress || 0}%` }]} />
              </View>
              <View style={styles.progressDetails}>
                <Text style={styles.pageInfo}>
                  Page {book.currentPage || 0} of {book.pages || 0}
                </Text>
                {book.timeLeft && (
                  <Text style={styles.timeLeft}>
                    ~{book.timeLeft} min left in chapter
                  </Text>
                )}
              </View>
            </View>
          )}

          {isOwned && (
            <View style={styles.interactiveFeaturesSection}>
              <TouchableOpacity style={styles.featureButton} onPress={handleViewBookmarks}>
                <Bookmark size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.featureButtonText}>Bookmarks ({book.bookmarksCount || 0})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureButton} onPress={handleViewHighlights}>
                <BookOpen size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.featureButtonText}>Highlights ({book.highlightsCount || 0})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureButton} onPress={handleChatWithBook}>
                <BookOpen size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.featureButtonText}>Chat with Book</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <Text style={styles.previewText}>
              "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, 
              his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly 
              through the glass doors of Victory Mansions, though not quickly enough to prevent a 
              swirl of gritty dust from entering along with him..."
            </Text>
            <TouchableOpacity
              style={styles.readPreviewButton}
              onPress={handleReadPreview}
            >
              <Text style={styles.readPreviewButtonText}>Read Full Preview</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {isOwned ? (
            // Owned book - show only reading option
            <TouchableOpacity
              style={[styles.primaryButton, { flex: 1 }]}
              onPress={handleStartReading}
            >
              <BookOpen size={16} color={colors.surface} style={{ marginRight: 6 }} />
              <Text style={styles.primaryButtonText}>
                {book.currentPage && book.currentPage > 0 ? 'Continue Reading' : 'Start Reading'}
              </Text>
            </TouchableOpacity>
          ) : (
            // Non-owned book - show purchase options
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleReadPreview}
              >
                <BookOpen size={16} color={colors.text} style={{ marginRight: 6 }} />
                <Text style={styles.secondaryButtonText}>Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAddToLibrary}
              >
                <Download size={16} color={colors.surface} style={{ marginRight: 6 }} />
                <Text style={styles.primaryButtonText}>
                  {book.isFree ? 'Add to Library' : `Buy for $${book.price?.toFixed(2)}`}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
