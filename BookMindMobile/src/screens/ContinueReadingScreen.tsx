import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  PanResponder,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import Tts from 'react-native-tts';
import {
  ArrowLeft,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Bookmark,
  Star,
  Highlighter,
  Copy,
  Share,
  X,
  Play,
  Pause,
  Volume2,
  Settings,
  SkipForward,
  SkipBack,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function ContinueReadingScreen({ navigation, route }: any) {
  const { colors } = useTheme();

  // Selection state
  const [selectedText, setSelectedText] = useState('');
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [highlights, setHighlights] = useState<Array<{id: string, text: string, color: string, start: number, end: number}>>([]);
  const [showHighlightColors, setShowHighlightColors] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{start: number, end: number} | null>(null);
  const [textInputKey, setTextInputKey] = useState(0); // Force re-render to clear selection

  // TTS (Text-to-Speech) state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [sentences, setSentences] = useState([]);

  // Bottom Sheet state
  const [bottomSheetHeight] = useState(new Animated.Value(60)); // Start with handle height
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const maxBottomSheetHeight = 280; // Full expanded height
  const minBottomSheetHeight = 60;  // Handle only height

  // TTS Mock functionality (will be replaced with react-native-tts)
  const ttsRef = useRef(null);

  // Refs
  const textInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Mock data - will be replaced with actual book data
  const bookData = {
    title: 'BookMind',
    chapter: 'Chapter 8: Business Models',
    currentPage: 127,
    totalPages: 350,
    content: `The lean canvas provides a structured approach to documenting your business model assumptions. Unlike traditional business plans that can take months to write and are often outdated before they're finished, the lean canvas is designed to be completed in 20 minutes or less.

This one-page business model captures the essential elements of your startup and forces you to think through the key assumptions that need to be tested. The canvas is divided into nine boxes, each representing a critical component of your business model.

Starting with the problem box, you identify the top three problems you believe your customers have. These should be problems worth solving - ones that customers are actively seeking solutions for and would be willing to pay to solve.

The customer segments box helps you define your early adopters - the customers who feel the pain of your problem most acutely and are most likely to buy your initial solution, even if it's not perfect.`,
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    console.log('Search tapped');
  };

  const handleProfile = () => {
    console.log('Profile tapped');
  };

  const handlePreviousPage = () => {
    console.log('Previous page tapped');
  };

  const handleNextPage = () => {
    console.log('Next page tapped');
  };

  const handleLocationPin = () => {
    console.log('Location pin tapped');
  };

  const handleChat = () => {
    console.log('Chat tapped');
  };

  const handleBookmark = () => {
    console.log('Bookmark tapped');
  };

  const handleStar = () => {
    console.log('Star tapped');
  };

  // TTS Initialization
  useEffect(() => {
    initializeTTS();
    splitTextIntoSentences();
  }, []);

  const initializeTTS = async () => {
    try {
      console.log('Initializing TTS...');

      // Get available voices (simplified)
      const voices = await Tts.voices();
      console.log('Available TTS voices:', voices.length);

      // Simple English voice filtering
      const englishVoices = voices.filter(voice => {
        const lang = voice.language?.toLowerCase() || '';
        return lang.startsWith('en-') || lang === 'en';
      });

      const formattedVoices = englishVoices.slice(0, 5).map((voice, index) => ({
        id: voice.id || `voice-${index}`,
        name: voice.name || `Voice ${index + 1}`,
        language: voice.language || 'en-US',
        gender: 'neutral'
      }));

      setAvailableVoices(formattedVoices);
      if (formattedVoices.length > 0) {
        setSelectedVoice(formattedVoices[0]);
        console.log('Selected voice:', formattedVoices[0].name);
      }

      console.log('TTS initialized successfully');
    } catch (error) {
      console.error('TTS initialization failed:', error);
      // Use fallback
      const fallbackVoices = [
        { id: 'default', name: 'Default Voice', language: 'en-US', gender: 'neutral' }
      ];
      setAvailableVoices(fallbackVoices);
      setSelectedVoice(fallbackVoices[0]);
    }
  };

  const splitTextIntoSentences = () => {
    // Split content into sentences for better TTS control with improved regex
    let text = bookData.content;

    // Clean up the text first
    text = text.replace(/\s+/g, ' ').trim();

    // Split into sentences with better pattern matching
    const sentenceArray = text
      .split(/(?<=[.!?])\s+(?=[A-Z])/) // Split on sentence endings followed by capital letters
      .filter(sentence => sentence.trim().length > 10) // Filter out very short fragments
      .map(sentence => sentence.trim());

    console.log('Split into sentences:', sentenceArray.length, 'sentences');
    console.log('First few sentences:', sentenceArray.slice(0, 3));

    setSentences(sentenceArray);
  };

  // TTS Control Functions
  const handlePlayPause = () => {
    if (isPlaying) {
      handlePauseTTS();
    } else {
      handlePlayTTS();
    }
  };

  const handlePlayTTS = async () => {
    try {
      console.log('Starting TTS playback...');

      // Start from beginning if we're at the end
      if (currentSentence >= sentences.length - 1) {
        setCurrentSentence(0);
      }

      setIsPlaying(true);
      setIsPaused(false);

      // Start speaking the current sentence
      const textToSpeak = sentences[currentSentence];
      console.log('Speaking sentence:', currentSentence, textToSpeak);

      // Simple TTS call without complex settings
      await Tts.speak(textToSpeak);

      // Simple timer-based progression (no event listeners for now)
      const wordsInSentence = textToSpeak.split(' ').length;
      const estimatedTime = Math.max((wordsInSentence * 400), 2000); // 400ms per word, minimum 2 seconds

      const progressTimer = setTimeout(async () => {
        if (isPlaying) {
          if (currentSentence < sentences.length - 1) {
            // Move to next sentence
            setCurrentSentence(prev => prev + 1);

            // Small delay then continue
            setTimeout(() => {
              if (isPlaying) {
                handlePlayTTS();
              }
            }, 500);
          } else {
            // End of content
            console.log('Reached end of content');
            handleStopTTS();
          }
        }
      }, estimatedTime);

      // Store timer reference for cleanup
      if (ttsRef.current) {
        clearTimeout(ttsRef.current);
      }
      ttsRef.current = progressTimer;

    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      // Don't show alert to user - just log the error
      console.log('TTS failed, but continuing...');
    }
  };

  const handlePauseTTS = async () => {
    console.log('Pausing TTS playback...');

    // Clear any running timers
    if (ttsRef.current) {
      clearTimeout(ttsRef.current);
      ttsRef.current = null;
    }

    // Stop TTS
    try {
      await Tts.stop();
    } catch (error) {
      console.log('TTS stop error (ignored):', error);
    }

    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStopTTS = async () => {
    console.log('Stopping TTS playback...');

    // Clear any running timers
    if (ttsRef.current) {
      clearTimeout(ttsRef.current);
      ttsRef.current = null;
    }

    // Stop TTS
    try {
      await Tts.stop();
    } catch (error) {
      console.log('TTS stop error (ignored):', error);
    }

    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentence(0);
  };

  const handleNextSentence = async () => {
    if (currentSentence < sentences.length - 1) {
      const nextSentence = currentSentence + 1;
      setCurrentSentence(nextSentence);

      // If currently playing, stop current and start next
      if (isPlaying) {
        try {
          await Tts.stop();
          setTimeout(() => {
            Tts.speak(sentences[nextSentence]);
          }, 100);
        } catch (error) {
          console.error('Error skipping to next sentence:', error);
        }
      }
    }
  };

  const handlePreviousSentence = async () => {
    if (currentSentence > 0) {
      const prevSentence = currentSentence - 1;
      setCurrentSentence(prevSentence);

      // If currently playing, stop current and start previous
      if (isPlaying) {
        try {
          await Tts.stop();
          setTimeout(() => {
            Tts.speak(sentences[prevSentence]);
          }, 100);
        } catch (error) {
          console.error('Error skipping to previous sentence:', error);
        }
      }
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    console.log('TTS speed changed to:', speed);
    // Note: Speed change will take effect on next sentence
  };

  const handleVoiceChange = async (voice) => {
    try {
      setSelectedVoice(voice);
      await Tts.setDefaultVoice(voice.id);
      console.log('TTS voice changed to:', voice.name);
    } catch (error) {
      console.error('Failed to change TTS voice:', error);
    }
  };


  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (ttsRef.current) {
        clearTimeout(ttsRef.current);
      }
      try {
        Tts.stop();
      } catch (error) {
        console.log('Cleanup error (ignored):', error);
      }
    };
  }, []);

  // Bottom Sheet Controls
  const expandBottomSheet = () => {
    setIsBottomSheetExpanded(true);
    Animated.spring(bottomSheetHeight, {
      toValue: maxBottomSheetHeight,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const collapseBottomSheet = () => {
    setIsBottomSheetExpanded(false);
    Animated.spring(bottomSheetHeight, {
      toValue: minBottomSheetHeight,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const toggleBottomSheet = () => {
    if (isBottomSheetExpanded) {
      collapseBottomSheet();
    } else {
      expandBottomSheet();
    }
  };

  // Pan Gesture Handler
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      const newHeight = isBottomSheetExpanded
        ? Math.max(minBottomSheetHeight, maxBottomSheetHeight - gestureState.dy)
        : Math.min(maxBottomSheetHeight, minBottomSheetHeight - gestureState.dy);

      bottomSheetHeight.setValue(newHeight);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const velocity = gestureState.vy;
      const currentHeight = bottomSheetHeight._value;

      if (velocity > 0.5 || currentHeight < (maxBottomSheetHeight + minBottomSheetHeight) / 2) {
        collapseBottomSheet();
      } else {
        expandBottomSheet();
      }
    },
  });

  // Text selection handlers
  const handleTextSelection = (event: any) => {
    const { selection } = event.nativeEvent;
    if (selection && selection.start !== selection.end) {
      const selected = bookData.content.substring(selection.start, selection.end);
      setSelectedText(selected);
      setCurrentSelection({ start: selection.start, end: selection.end });
      setIsTextSelected(true);
      setShowHighlightColors(false);
    } else {
      setSelectedText('');
      setCurrentSelection(null);
      setIsTextSelected(false);
      setShowHighlightColors(false);
    }
  };


  const handleHighlightButton = () => {
    setShowHighlightColors(!showHighlightColors);
  };

  const handleHighlight = (color: string) => {
    if (selectedText && currentSelection) {
      const newHighlight = {
        id: Date.now().toString(),
        text: selectedText,
        color: color,
        start: currentSelection.start,
        end: currentSelection.end,
      };
      setHighlights([...highlights, newHighlight]);

      // Force re-render TextInput to completely clear selection
      setTextInputKey(prev => prev + 1);

      setIsTextSelected(false);
      setSelectedText('');
      setCurrentSelection(null);
      setShowHighlightColors(false);
    }
  };

  const handleCopy = () => {
    console.log('Copy:', selectedText);

    // Force re-render TextInput to completely clear selection
    setTextInputKey(prev => prev + 1);

    setIsTextSelected(false);
    setSelectedText('');
    setCurrentSelection(null);
    setShowHighlightColors(false);
  };

  const handleShare = () => {
    console.log('Share:', selectedText);

    // Navigate to PostShare screen with selected text
    navigation.navigate('PostShare', {
      selectedText: selectedText,
      bookTitle: bookData.title,
      author: 'Eric Ries', // This should come from book data
    });

    // Force re-render TextInput to completely clear selection
    setTextInputKey(prev => prev + 1);

    setIsTextSelected(false);
    setSelectedText('');
    setCurrentSelection(null);
    setShowHighlightColors(false);
  };

  // Function to render text with highlights and TTS highlighting
  const renderHighlightedText = () => {
    const content = bookData.content;

    // If TTS is playing, highlight current sentence
    if (isPlaying && sentences.length > 0) {
      const currentSentenceText = sentences[currentSentence];
      const sentenceStart = content.indexOf(currentSentenceText);

      if (sentenceStart !== -1) {
        const beforeSentence = content.substring(0, sentenceStart);
        const afterSentence = content.substring(sentenceStart + currentSentenceText.length);

        return (
          <Text style={[styles.contentText, { color: colors.text }]}>
            {beforeSentence}
            <Text style={[styles.currentlyReading, {
              backgroundColor: colors.primary + '40', // More visible highlighting
              color: colors.text,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
              paddingLeft: 10,
              paddingVertical: 4,
              borderRadius: 6,
              fontWeight: '600' // Make text bolder
            }]}>
              {currentSentenceText}
            </Text>
            {afterSentence}
          </Text>
        );
      }
    }

    if (highlights.length === 0) {
      return content;
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    const textSegments: JSX.Element[] = [];
    let currentPosition = 0;

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (currentPosition < highlight.start) {
        textSegments.push(
          <Text key={`text-${index}`} style={[styles.contentText, { color: colors.text }]}>
            {bookData.content.substring(currentPosition, highlight.start)}
          </Text>
        );
      }

      // Add highlighted text
      textSegments.push(
        <Text
          key={`highlight-${highlight.id}`}
          style={[styles.contentText, {
            backgroundColor: highlight.color,
            color: colors.text,
            fontStyle: 'italic',
            fontWeight: '500'
          }]}
        >
          {highlight.text}
        </Text>
      );

      currentPosition = highlight.end;
    });

    // Add remaining text after last highlight
    if (currentPosition < bookData.content.length) {
      textSegments.push(
        <Text key="text-end" style={[styles.contentText, { color: colors.text }]}>
          {bookData.content.substring(currentPosition)}
        </Text>
      );
    }

    return textSegments;
  };

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={dynamicStyles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleGoBack}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>{bookData.title}</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleSearch}>
              <Search size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleProfile}>
              <User size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Main Reading Content */}
      <ScrollView style={dynamicStyles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.contentContainer}>
          {/* Chapter Title */}
          <Text style={[styles.chapterTitle, { color: colors.text }]}>{bookData.chapter}</Text>

          {/* Content Text Container */}
          <View style={styles.textContainer}>
            {/* Visible Highlighted Text */}
            <Text style={[styles.contentText, { color: colors.text }]}>
              {renderHighlightedText()}
            </Text>

            {/* Hidden Selectable TextInput */}
            <TextInput
              key={textInputKey}
              ref={textInputRef}
              style={styles.hiddenSelectableText}
              value={bookData.content}
              editable={false}
              multiline={true}
              scrollEnabled={false}
              showSoftInputOnFocus={false}
              onSelectionChange={handleTextSelection}
              selectable={true}
              selectTextOnFocus={false}
              contextMenuHidden={true}
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Controls */}
      <View style={dynamicStyles.bottomControls}>
        {!isTextSelected ? (
          <>
            {/* Page Navigation */}
            <View style={styles.pageNavigation}>
              <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handlePreviousPage}>
                <ChevronLeft size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.pageInfo}>
                <Text style={[styles.pageText, { color: colors.textSecondary }]}>Page</Text>
                <Text style={[styles.pageNumber, { color: colors.text }]}>{bookData.currentPage}/{bookData.totalPages}</Text>
              </View>

              <TouchableOpacity style={[styles.navButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleNextPage}>
                <ChevronRight size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleLocationPin}>
                <MapPin size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleChat}>
                <MessageCircle size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleBookmark}>
                <Bookmark size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleStar}>
                <Star size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Highlight Color Options - Show when highlight button is pressed */}
            {showHighlightColors && (
              <View style={styles.highlightColorRow}>
                <TouchableOpacity
                  style={[styles.colorOptionSmall, { backgroundColor: '#FEF3C7' }]}
                  onPress={() => handleHighlight('#FEF3C7')}
                />
                <TouchableOpacity
                  style={[styles.colorOptionSmall, { backgroundColor: '#DBEAFE' }]}
                  onPress={() => handleHighlight('#DBEAFE')}
                />
                <TouchableOpacity
                  style={[styles.colorOptionSmall, { backgroundColor: '#D1FAE5' }]}
                  onPress={() => handleHighlight('#D1FAE5')}
                />
                <TouchableOpacity
                  style={[styles.colorOptionSmall, { backgroundColor: '#FCE7F3' }]}
                  onPress={() => handleHighlight('#FCE7F3')}
                />
              </View>
            )}

            {/* Selection Action Buttons */}
            <View style={styles.selectionActions}>
              <TouchableOpacity style={[styles.selectionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleHighlightButton}>
                <Highlighter size={20} color={colors.text} strokeWidth={2} />
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>Highlight</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.selectionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleCopy}>
                <Copy size={20} color={colors.text} strokeWidth={2} />
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.selectionButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleShare}>
                <Share size={20} color={colors.text} strokeWidth={2} />
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Floating Audio Button */}
      <View style={styles.floatingAudioContainer}>
        <TouchableOpacity
          style={[styles.floatingAudioButton, {
            backgroundColor: isPlaying ? colors.primary : colors.surface,
            borderColor: colors.border
          }]}
          onPress={toggleBottomSheet}
          activeOpacity={0.8}
        >
          {isPlaying ? (
            <Pause size={24} color={colors.onPrimary} strokeWidth={2} />
          ) : (
            <Volume2 size={24} color={colors.text} strokeWidth={2} />
          )}

          {/* Playing indicator */}
          {isPlaying && (
            <View style={[styles.playingDot, { backgroundColor: colors.onPrimary }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Drawer Audio Controls */}
      <Modal
        visible={isBottomSheetExpanded}
        transparent={true}
        animationType="none"
        onRequestClose={collapseBottomSheet}
      >
        <View style={styles.drawerOverlay}>
          <TouchableOpacity
            style={styles.drawerBackdrop}
            onPress={collapseBottomSheet}
            activeOpacity={1}
          />

          <View style={[styles.bottomDrawer, { backgroundColor: colors.surface }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.modalHeaderLeft}>
                <Volume2 size={24} color={colors.text} strokeWidth={2} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>Audio Controls</Text>
              </View>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity
                  style={[styles.modalSettingsButton, { backgroundColor: colors.backgroundSecondary }]}
                  onPress={() => {
                    collapseBottomSheet();
                    navigation.navigate('Profile');
                  }}
                >
                  <Settings size={18} color={colors.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalCloseButton, { backgroundColor: colors.backgroundSecondary }]}
                  onPress={collapseBottomSheet}
                >
                  <X size={18} color={colors.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Play Controls Section */}
            <View style={styles.voiceControlSection}>
              <View style={styles.playControlsRow}>
                <View style={styles.spacerContainer}></View>

                <View style={styles.centralControls}>
                  <TouchableOpacity
                    style={[styles.voiceControlButton, { backgroundColor: colors.backgroundSecondary }]}
                    onPress={handlePreviousSentence}
                    disabled={currentSentence === 0}
                  >
                    <SkipBack size={16} color={currentSentence === 0 ? colors.textTertiary : colors.text} strokeWidth={2} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.voicePlayButton, { backgroundColor: colors.primary }]}
                    onPress={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause size={20} color={colors.onPrimary} strokeWidth={2} />
                    ) : (
                      <Play size={20} color={colors.onPrimary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.voiceControlButton, { backgroundColor: colors.backgroundSecondary }]}
                    onPress={handleNextSentence}
                    disabled={currentSentence >= sentences.length - 1}
                  >
                    <SkipForward size={16} color={currentSentence >= sentences.length - 1 ? colors.textTertiary : colors.text} strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.speedButtonContainer}>
                  <TouchableOpacity
                    style={[styles.speedButton, { backgroundColor: colors.backgroundSecondary }]}
                    onPress={() => handleSpeedChange(playbackRate === 1.0 ? 1.5 : 1.0)}
                  >
                    <Text style={[styles.speedButtonText, { color: colors.text }]}>
                      {playbackRate.toFixed(1)}x
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Full Width Progress Section */}
            <View style={styles.fullWidthProgressSection}>
              <Text style={[styles.modalProgressText, { color: colors.textSecondary }]}>
                Segment {currentSentence + 1} of {sentences.length}
              </Text>
              <View style={[styles.fullWidthProgressBar, { backgroundColor: colors.borderLight }]}>
                <View
                  style={[styles.modalProgressFill, {
                    backgroundColor: colors.primary,
                    width: `${((currentSentence + 1) / sentences.length) * 100}%`
                  }]}
                />
              </View>
              <Text style={[styles.modalProgressDetails, { color: colors.textTertiary }]}>
                {isPlaying ? 'Now playing chapter content' : 'Tap play to start audio'}
              </Text>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header Styles
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
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

  // Main Content
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
    lineHeight: 28,
  },
  textContainer: {
    position: 'relative',
  },
  contentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'justify',
  },
  hiddenSelectableText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    fontSize: 16,
    color: 'transparent',
    lineHeight: 24,
    textAlign: 'justify',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    fontFamily: 'System',
  },

  // TTS Text Highlighting
  currentlyReading: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    fontWeight: '500',
  },

  // Bottom Controls
  bottomControls: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pageNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Selection Toolbar Styles
  selectionActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  highlightColorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  colorOptionSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  // TTS Control Styles
  ttsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ttsToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  ttsToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ttsControlsExpanded: {
    marginTop: 12,
    gap: 12,
  },
  ttsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ttsVoiceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ttsSpeedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ttsMainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  ttsControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ttsPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ttsBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ttsProgress: {
    flex: 1,
  },
  ttsProgressText: {
    fontSize: 10,
    marginBottom: 4,
  },
  ttsProgressBar: {
    height: 3,
    borderRadius: 1.5,
  },
  ttsProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  ttsSettingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Audio Button Styles
  floatingAudioContainer: {
    position: 'absolute',
    bottom: 135, // Above page controls
    right: 15,
    zIndex: 10,
  },
  floatingAudioButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    position: 'relative',
  },
  playingDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Bottom Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
    height: 200, // Even shorter to ensure progress bar is visible
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },

  // Modal Header
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalSettingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Play Controls Section
  voiceControlSection: {
    marginBottom: 12,
  },
  playControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  speedButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centralControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  spacerContainer: {
    flex: 1,
  },
  voiceControlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voicePlayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButton: {
    width: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Full Width Progress Section
  fullWidthProgressSection: {
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  modalProgressText: {
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  fullWidthProgressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  modalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalProgressDetails: {
    fontSize: 12,
    textAlign: 'center',
  },

});

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  bottomControls: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});