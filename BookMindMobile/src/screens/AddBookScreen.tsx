import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
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
  X,
} from 'lucide-react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { launchImageLibrary, launchCamera, MediaType, ImagePickerResponse, ImagePickerOptions } from 'react-native-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { booksService } from '../services/booksService';
import { useEPUBParser } from '../utils/epubParser';
import { usePDFParser } from '../utils/pdfParser';

export default function AddBookScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { extractMetadata: extractEPUBMetadata, getBasicInfo: getEPUBBasicInfo } = useEPUBParser();
  const { extractMetadata: extractPDFMetadata, getBasicInfo: getPDFBasicInfo } = usePDFParser();
  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Business');
  const [language, setLanguage] = useState('English');
  const [coverImage, setCoverImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');

  // Reading settings state
  const [autoBookmark, setAutoBookmark] = useState(false);
  const [aiInsights, setAiInsights] = useState(true);

  // Auto-load bundled EPUB file on mount in development mode
  useEffect(() => {
    if (__DEV__ && Platform.OS === 'ios') {
      loadBundledTestFile();
    }
  }, []);

  const loadBundledTestFile = async () => {
    console.log('📱 Development Mode: Auto-loading bundled test file');

    try {
      const RNFS = require('react-native-fs');

      // Debug: Log all possible paths
      console.log('📍 MainBundlePath:', RNFS.MainBundlePath);
      console.log('📍 DocumentDirectoryPath:', RNFS.DocumentDirectoryPath);

      // Try PDF first (our current test file)
      const pdfFileName = 'Healing-Her-Heart.pdf';
      const pdfTargetPath = `${RNFS.DocumentDirectoryPath}/${pdfFileName}`;
      const pdfBundlePath = `${RNFS.MainBundlePath}/${pdfFileName}`;

      // Delete target file if it already exists
      const pdfTargetExists = await RNFS.exists(pdfTargetPath);
      if (pdfTargetExists) {
        console.log('🗑️ Removing existing PDF file at:', pdfTargetPath);
        await RNFS.unlink(pdfTargetPath);
      }

      console.log('🔍 Checking for PDF file at:', pdfBundlePath);
      const pdfExists = await RNFS.exists(pdfBundlePath);
      console.log('📦 PDF file exists at bundle path:', pdfExists);

      if (pdfExists) {
        // Copy PDF from bundle to documents
        await RNFS.copyFile(pdfBundlePath, pdfTargetPath);
        console.log('✅ Copied PDF test file from bundle to:', pdfTargetPath);

        // Get file stats
        const stat = await RNFS.stat(pdfTargetPath);

        const mockFile = {
          uri: `file://${pdfTargetPath}`,
          name: pdfFileName,
          type: 'application/pdf',
          size: parseInt(stat.size),
          fileCopyUri: `file://${pdfTargetPath}`
        };

        setSelectedFile(mockFile);

        // Extract PDF metadata and auto-fill
        const metadata = await extractPDFMetadata(`file://${pdfTargetPath}`);
        setTitle(metadata.title || 'Healing Her Heart');
        setAuthor(metadata.author || 'Unknown Author');
        if (metadata.coverImage) {
          setCoverImage(metadata.coverImage.uri);
        }

        console.log('✅ Development Mode: Auto-loaded PDF test file:', mockFile);
        return;
      }

      // Fallback to EPUB if PDF not found
      const epubFileName = 'pg55-images.epub';
      const epubTargetPath = `${RNFS.DocumentDirectoryPath}/${epubFileName}`;
      const epubBundlePath = `${RNFS.MainBundlePath}/${epubFileName}`;

      const epubTargetExists = await RNFS.exists(epubTargetPath);
      if (epubTargetExists) {
        console.log('🗑️ Removing existing EPUB file at:', epubTargetPath);
        await RNFS.unlink(epubTargetPath);
      }

      console.log('🔍 Checking for EPUB file at:', epubBundlePath);
      const epubExists = await RNFS.exists(epubBundlePath);
      console.log('📦 EPUB file exists at bundle path:', epubExists);

      if (epubExists) {
        // Copy from bundle to documents
        await RNFS.copyFile(epubBundlePath, epubTargetPath);
        console.log('✅ Copied EPUB test file from bundle to:', epubTargetPath);

        // Get file stats
        const stat = await RNFS.stat(epubTargetPath);

        const mockFile = {
          uri: `file://${epubTargetPath}`,
          name: epubFileName,
          type: 'application/epub+zip',
          size: parseInt(stat.size),
          fileCopyUri: `file://${epubTargetPath}`
        };

        setSelectedFile(mockFile);
        setTitle('Fairy Tales from the Arabian Nights');
        setAuthor('E. Dixon');

        console.log('✅ Development Mode: Auto-loaded EPUB test file:', mockFile);
        return;
      }

      // If neither found, search for any PDF or EPUB files
      console.log('📂 Listing files in MainBundlePath...');
      const files = await RNFS.readDir(RNFS.MainBundlePath);
      console.log('📂 Files in bundle (first 20):', files.slice(0, 20).map(f => f.name).join(', '));

      // Look for PDF files first
      const pdfFiles = files.filter(f => f.name.toLowerCase().includes('.pdf'));
      console.log('📄 PDF files found:', pdfFiles.map(f => f.name).join(', '));

      if (pdfFiles.length > 0) {
        const pdfFile = pdfFiles[0];
        const targetPath = `${RNFS.DocumentDirectoryPath}/${pdfFile.name}`;
        await RNFS.copyFile(pdfFile.path, targetPath);
        console.log('✅ Found and copied PDF from:', pdfFile.path);

        const stat = await RNFS.stat(targetPath);
        const mockFile = {
          uri: `file://${targetPath}`,
          name: pdfFile.name,
          type: 'application/pdf',
          size: parseInt(stat.size),
          fileCopyUri: `file://${targetPath}`
        };

        setSelectedFile(mockFile);
        const metadata = await extractPDFMetadata(`file://${targetPath}`);
        setTitle(metadata.title || pdfFile.name.replace('.pdf', ''));
        setAuthor(metadata.author || 'Unknown Author');
        return;
      }

      // Look for EPUB files
      const epubFiles = files.filter(f => f.name.toLowerCase().includes('.epub'));
      console.log('📚 EPUB files found:', epubFiles.map(f => f.name).join(', '));

      if (epubFiles.length > 0) {
        const epubFile = epubFiles[0];
        const targetPath = `${RNFS.DocumentDirectoryPath}/${epubFile.name}`;
        await RNFS.copyFile(epubFile.path, targetPath);
        console.log('✅ Found and copied EPUB from:', epubFile.path);

        const stat = await RNFS.stat(targetPath);
        const mockFile = {
          uri: `file://${targetPath}`,
          name: epubFile.name,
          type: 'application/epub+zip',
          size: parseInt(stat.size),
          fileCopyUri: `file://${targetPath}`
        };

        setSelectedFile(mockFile);
        const metadata = await extractEPUBMetadata(`file://${targetPath}`);
        setTitle(metadata.title || epubFile.name.replace('.epub', ''));
        setAuthor(metadata.author || 'Unknown Author');
        return;
      }

      throw new Error('No PDF or EPUB files found in bundle. Please add test files to Xcode project.');

    } catch (error) {
      console.error('❌ Failed to auto-load test file:', error);
      // Don't show alert, just log the error - user can still browse files manually
    }
  };
  const [syncDevices, setSyncDevices] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const genres = ['Business', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Self-Help', 'Technology', 'Philosophy', 'Art', 'Health', 'Travel'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'];

  const handleSelectGenre = () => {
    Alert.alert(
      'Select Genre',
      'Choose a genre for your book',
      genres.map(g => ({
        text: g,
        onPress: () => setGenre(g)
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const handleSelectLanguage = () => {
    Alert.alert(
      'Select Language',
      'Choose the language of your book',
      languages.map(l => ({
        text: l,
        onPress: () => setLanguage(l)
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const handleUploadCover = () => {
    Alert.alert(
      'Select Cover Image',
      'Choose how you want to add a cover image',
      [
        {
          text: 'Camera',
          onPress: () => openImagePicker('camera')
        },
        {
          text: 'Photo Library',
          onPress: () => openImagePicker('library')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const openImagePicker = (source: 'camera' | 'library') => {
    const options: ImagePickerOptions = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 1200,
      includeBase64: false,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        console.log('Image picker cancelled or error:', response.errorMessage);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setCoverImage(asset.uri || null);
        console.log('✅ Cover image selected:', asset.uri);
      }
    };

    if (source === 'camera') {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const handleChooseFile = async () => {
    // DEVELOPMENT BYPASS: In dev mode, just call the auto-load function
    if (__DEV__ && Platform.OS === 'ios') {
      loadBundledTestFile();
      return;
    }

    // PRODUCTION: Use normal file picker
    try {
      const result = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.pdf,
          'application/epub+zip',
          DocumentPicker.types.plainText,
        ],
        copyTo: 'documentDirectory',
      });

      setSelectedFile(result);

      // Extract metadata for EPUB files
      if (result.type === 'application/epub+zip' && result.fileCopyUri) {
        try {
          const metadata = await extractEPUBMetadata(result.fileCopyUri);

          // Auto-fill form with extracted metadata
          if (!title && metadata.title) {
            setTitle(metadata.title);
          }
          if (!author && metadata.author) {
            setAuthor(metadata.author);
          }
          if (!coverImage && metadata.coverImage) {
            setCoverImage(metadata.coverImage.uri);
          }

          console.log('✅ Extracted EPUB metadata:', metadata);
        } catch (error) {
          console.error('Failed to extract EPUB metadata:', error);

          // Fallback to filename-based title
          if (!title && result.name) {
            const fileName = result.name.replace(/\.[^/.]+$/, ''); // Remove extension
            setTitle(fileName);
          }
        }
      } else if (result.type === 'application/pdf' && result.fileCopyUri) {
        // Extract metadata for PDF files
        try {
          const metadata = await extractPDFMetadata(result.fileCopyUri);

          // Auto-fill form with extracted metadata
          if (!title && metadata.title) {
            setTitle(metadata.title);
          }
          if (!author && metadata.author) {
            setAuthor(metadata.author);
          }
          if (!coverImage && metadata.coverImage) {
            setCoverImage(metadata.coverImage.uri);
          }

          console.log('✅ Extracted PDF metadata:', metadata);
        } catch (error) {
          console.error('Failed to extract PDF metadata:', error);

          // Fallback to filename-based title
          if (!title && result.name) {
            const fileName = result.name.replace(/\.[^/.]+$/, ''); // Remove extension
            setTitle(fileName);
          }
        }
      } else {
        // For other file types, use filename as title
        if (!title && result.name) {
          const fileName = result.name.replace(/\.[^/.]+$/, ''); // Remove extension
          setTitle(fileName);
        }
      }

      console.log('Selected file:', result);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file picker');
      } else {
        console.error('File picker error:', error);
        Alert.alert('Error', 'Failed to select file');
      }
    }
  };

  const handleBrowseFiles = () => {
    handleChooseFile();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
  };


  const handleCancel = () => {
    if (isUploading) {
      Alert.alert(
        'Upload in Progress',
        'Are you sure you want to cancel? The upload will be stopped.',
        [
          { text: 'Continue Upload', style: 'cancel' },
          { text: 'Cancel Upload', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleAddToLibrary = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a book title');
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // DEVELOPMENT: Use direct upload
      if (__DEV__) {
        console.log('📱 Using direct upload (development mode)');
        setUploadProgress(25);

        const bookResponse = await booksService.directUpload(
          selectedFile.fileCopyUri || selectedFile.uri,
          selectedFile.name || 'book.epub',
          selectedFile.type || 'application/epub+zip',
          selectedFile.size || 0,
          title.trim(),
          author.trim() || undefined,
          {
            genre,
            language,
            auto_bookmark: autoBookmark,
            ai_insights: aiInsights,
            sync_devices: syncDevices,
          }
        );

        if (!bookResponse.success) {
          throw new Error(bookResponse.message || 'Failed to upload book');
        }

        setUploadProgress(100);
        setUploadStatus('completed');

        const createdBook = bookResponse.data?.book;
        console.log('✅ Book uploaded and processed:', createdBook);

        // Show success and navigate
        Alert.alert(
          'Success',
          'Book uploaded and processed successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      // PRODUCTION: Use R2 presigned upload
      const fileExtension = selectedFile.name?.split('.').pop()?.toLowerCase() || 'pdf';
      const presignedResponse = await booksService.getPresignedUploadUrl({
        filename: selectedFile.name || 'book.pdf',
        content_type: selectedFile.type || 'application/pdf',
        file_size: selectedFile.size || 0,
      });

      if (!presignedResponse.success) {
        throw new Error(presignedResponse.message || 'Failed to get upload URL');
      }

      const { upload_url, file_key } = presignedResponse.data!;

      // Step 2: Upload file to R2
      setUploadProgress(25);
      const uploadSuccess = await booksService.uploadFileToR2(
        upload_url,
        selectedFile.fileCopyUri || selectedFile.uri,
        selectedFile.type || 'application/pdf'
      );

      if (!uploadSuccess) {
        throw new Error('Failed to upload file');
      }

      setUploadProgress(75);
      setUploadStatus('processing');

      // Step 3: Create book record
      const bookResponse = await booksService.createBookFromUpload(
        file_key,
        title.trim(),
        author.trim() || undefined,
        fileExtension,
        selectedFile.size,
        {
          genre,
          language,
          auto_bookmark: autoBookmark,
          ai_insights: aiInsights,
          sync_devices: syncDevices,
        }
      );

      if (!bookResponse.success) {
        throw new Error(bookResponse.message || 'Failed to create book');
      }

      setUploadProgress(100);
      setUploadStatus('completed');

      // Extract and log content for testing
      const createdBook = bookResponse.data?.book;
      if (createdBook?.uuid) {
        console.log('📚 Book created successfully:', {
          uuid: createdBook.uuid,
          title: createdBook.title,
          author: createdBook.author,
          file_type: createdBook.file_type,
          processing_status: createdBook.processing_status
        });

        // Wait a moment for processing to potentially start, then try to get content
        setTimeout(async () => {
          try {
            console.log('🔄 Attempting to fetch book content for testing...');
            const contentResponse = await booksService.getBookContent(createdBook.uuid, { page: 1, words_per_page: 500 });

            if (contentResponse.success && contentResponse.data?.content) {
              const content = contentResponse.data.content;
              console.log('📖 EXTRACTED BOOK CONTENT (First 500 words):');
              console.log('=====================================');
              console.log(content.text);
              console.log('=====================================');
              console.log('📊 Content Stats:', {
                current_page: content.current_page,
                total_pages: content.total_pages,
                words_count: content.words_count,
                has_more: content.has_more
              });
            } else {
              console.log('⏳ Content not ready yet. Processing status:', createdBook.processing_status);
              console.log('🔧 Triggering manual processing...');

              // Try manual processing trigger
              try {
                const processResponse = await booksService.processBook(createdBook.uuid);
                if (processResponse.success) {
                  console.log('✅ Manual processing triggered successfully');

                  // Wait a bit more and try to get content again
                  setTimeout(async () => {
                    try {
                      const retryContentResponse = await booksService.getBookContent(createdBook.uuid, { page: 1, words_per_page: 500 });
                      if (retryContentResponse.success && retryContentResponse.data?.content) {
                        const retryContent = retryContentResponse.data.content;
                        console.log('📖 EXTRACTED BOOK CONTENT (After Manual Processing):');
                        console.log('=======================================================');
                        console.log(retryContent.text);
                        console.log('=======================================================');
                        console.log('📊 Content Stats:', {
                          current_page: retryContent.current_page,
                          total_pages: retryContent.total_pages,
                          words_count: retryContent.words_count
                        });
                      } else {
                        console.log('⏳ Content still processing... Check back in a few minutes.');
                      }
                    } catch (retryError) {
                      console.log('⚠️ Content still not ready after manual trigger:', retryError);
                    }
                  }, 5000); // Wait 5 seconds after manual trigger
                } else {
                  console.log('❌ Manual processing trigger failed:', processResponse.message);
                }
              } catch (processError) {
                console.log('❌ Could not trigger manual processing:', processError);
              }
            }
          } catch (contentError) {
            console.log('⚠️ Could not fetch content yet:', contentError);
            console.log('💡 Content will be available once processing completes.');
          }
        }, 2000); // Wait 2 seconds
      }

      Alert.alert(
        'Success!',
        'Your book has been uploaded and is being processed. Check the console logs to see extracted content.',
        [
          {
            text: 'Go to Library',
            onPress: () => {
              navigation.navigate('Library');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      Alert.alert(
        'Upload Failed',
        error.message || 'Something went wrong while uploading your book. Please try again.',
        [
          { text: 'Try Again', onPress: () => setUploadStatus('idle') },
          { text: 'Cancel', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setIsUploading(false);
    }
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

          {!selectedFile ? (
            <View style={dynamicStyles.uploadArea}>
              <View style={styles.uploadContent}>
                <FolderOpen size={48} color="#9CA3AF" strokeWidth={1.5} />
                <Text style={[styles.uploadTitle, { color: colors.text }]}>Choose File</Text>

                <TouchableOpacity
                  style={[styles.browseButton, { backgroundColor: colors.primary }]}
                  onPress={handleBrowseFiles}
                  disabled={isUploading}
                >
                  <Text style={[styles.browseButtonText, { color: colors.onPrimary }]}>Browse Files</Text>
                </TouchableOpacity>

                <Text style={[styles.supportedFormats, { color: colors.textTertiary }]}>PDF, EPUB, TXT supported (max 100MB)</Text>
              </View>
            </View>
          ) : (
            <View style={[dynamicStyles.selectedFileContainer, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.fileInfo}>
                <BookOpen size={24} color={colors.primary} strokeWidth={2} />
                <View style={styles.fileDetails}>
                  <Text style={[styles.fileName, { color: colors.text }]}>{selectedFile.name}</Text>
                  <Text style={[styles.fileSize, { color: colors.textSecondary }]}>
                    {((selectedFile.size || 0) / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                <TouchableOpacity onPress={handleRemoveFile} style={styles.removeButton} disabled={isUploading}>
                  <X size={20} color={colors.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Upload Progress */}
              {uploadStatus !== 'idle' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressText, { color: colors.text }]}>
                      {uploadStatus === 'uploading' && 'Uploading...'}
                      {uploadStatus === 'processing' && 'Processing...'}
                      {uploadStatus === 'completed' && 'Completed!'}
                      {uploadStatus === 'error' && 'Error'}
                    </Text>
                    <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
                      {uploadProgress}%
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: uploadStatus === 'error' ? '#EF4444' : colors.primary,
                          width: `${uploadProgress}%`
                        }
                      ]}
                    />
                  </View>
                  {uploadStatus === 'processing' && (
                    <Text style={[styles.processingNote, { color: colors.textTertiary }]}>
                      Your book is being processed for text extraction...
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
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
              <TouchableOpacity
                style={[styles.selectInput, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleSelectGenre}
              >
                <Text style={[styles.selectText, { color: colors.text }]}>{genre}</Text>
                <Text style={[styles.selectArrow, { color: colors.textTertiary }]}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfInput}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Language</Text>
              <TouchableOpacity
                style={[styles.selectInput, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleSelectLanguage}
              >
                <Text style={[styles.selectText, { color: colors.text }]}>{language}</Text>
                <Text style={[styles.selectArrow, { color: colors.textTertiary }]}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cover Image */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Cover Image</Text>

            {coverImage ? (
              <View style={styles.coverPreviewContainer}>
                <Image
                  source={{ uri: coverImage }}
                  style={styles.coverPreview}
                  resizeMode="cover"
                />
                <View style={styles.coverActions}>
                  <TouchableOpacity
                    style={[styles.coverActionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={handleUploadCover}
                  >
                    <Camera size={14} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={[styles.coverActionText, { color: colors.textSecondary }]}>Change</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.coverActionButton, styles.removeCoverButton, { backgroundColor: colors.error + '20', borderColor: colors.error }]}
                    onPress={() => setCoverImage(null)}
                  >
                    <X size={14} color={colors.error} strokeWidth={2} />
                    <Text style={[styles.coverActionText, { color: colors.error }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.coverUploadButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
                onPress={handleUploadCover}
              >
                <Camera size={16} color={colors.textSecondary} strokeWidth={2} />
                <Text style={[styles.coverUploadText, { color: colors.textSecondary }]}>Upload Cover</Text>
              </TouchableOpacity>
            )}
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

        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.primary },
            (isUploading || !selectedFile || !title.trim()) && styles.addButtonDisabled
          ]}
          onPress={handleAddToLibrary}
          disabled={isUploading || !selectedFile || !title.trim()}
        >
          {isUploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.onPrimary} />
              <Text style={[styles.addButtonText, { color: colors.onPrimary, marginLeft: 8 }]}>
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Processing...'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.addButtonText, { color: colors.onPrimary }]}>Add to Library</Text>
          )}
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

  // Cover Preview Styles
  coverPreviewContainer: {
    alignItems: 'center',
  },
  coverPreview: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  coverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  coverActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  coverActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeCoverButton: {
    // Additional styling handled by dynamic colors
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
  addButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Selected File Styles
  selectedFileContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },

  // Progress Styles
  progressContainer: {
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  processingNote: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
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
  selectedFileContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});