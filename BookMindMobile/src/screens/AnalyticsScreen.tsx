import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  ArrowLeft,
  BarChart3,
  Download,
  Settings,
  Target,
  Lightbulb,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function AnalyticsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleExportData = () => {
    console.log('Export data tapped');
  };

  const handleSettings = () => {
    console.log('Settings tapped');
  };

  // Mock highlighting data
  const highlightingColors = [
    { name: 'Important', color: '#FCD34D', percentage: 35 },
    { name: 'Questions', color: '#3B82F6', percentage: 28 },
    { name: 'Insights', color: '#10B981', percentage: 22 },
    { name: 'Quotes', color: '#8B5CF6', percentage: 15 },
  ];

  // Mock weekly highlighting trend data
  const weeklyTrend = [
    { day: 'M', active: true },
    { day: 'T', active: false },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: false },
    { day: 'S', active: false },
    { day: 'S', active: false },
  ];

  const readingStats = {
    booksRead: 12,
    pagesHighlighted: 247,
    readingStreak: 12,
    totalReadingTime: '24h 30m',
  };

  const renderColorBar = (color: string, percentage: number) => (
    <View style={styles.colorBarContainer}>
      <View style={[styles.colorBarBackground, { backgroundColor: '#E5E7EB' }]}>
        <View
          style={[
            styles.colorBarFill,
            { backgroundColor: color, width: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );

  const dynamicStyles = createStyles(colors);

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surface }]} onPress={handleGoBack}>
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <BarChart3 size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Your Highlighting Patterns</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Most Used Colors Section */}
        <View style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Used Colors:</Text>

          {highlightingColors.map((item, index) => (
            <View key={index} style={styles.colorItem}>
              <View style={styles.colorInfo}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={[styles.colorName, { color: colors.text }]}>{item.name}</Text>
              </View>
              <View style={styles.colorPercentageSection}>
                {renderColorBar(item.color, item.percentage)}
                <Text style={[styles.colorPercentage, { color: colors.text }]}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Highlighting Trends Section */}
        <View style={dynamicStyles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Highlighting Trends:</Text>

          <Text style={[styles.trendPeriod, { color: colors.textSecondary }]}>This Week</Text>

          <View style={styles.weeklyTrendContainer}>
            {weeklyTrend.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <View
                  style={[
                    styles.dayDot,
                    day.active ? styles.activeDayDot : styles.inactiveDayDot,
                  ]}
                />
                <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reading Style Section */}
        <View style={dynamicStyles.section}>
          <View style={styles.readingStyleHeader}>
            <Target size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.readingStyleTitle, { color: colors.text }]}>Your Reading Style:</Text>
          </View>

          <Text style={[styles.readingStyleLabel, { color: colors.text }]}>"Detail-oriented learner"</Text>
          <Text style={[styles.readingStyleDescription, { color: colors.textSecondary }]}>
            You highlight examples and practical applications most.
          </Text>
        </View>

        {/* Suggestion Section */}
        <View style={dynamicStyles.section}>
          <View style={styles.suggestionHeader}>
            <Lightbulb size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.suggestionTitle, { color: colors.text }]}>Suggestion:</Text>
          </View>

          <Text style={[styles.suggestionText, { color: colors.textSecondary }]}>
            Try using blue highlights for concepts you want to explore further.
          </Text>
        </View>

        {/* Reading Statistics Section */}
        <View style={dynamicStyles.section}>
          <View style={styles.statsHeader}>
            <BarChart3 size={20} color={colors.text} strokeWidth={2} />
            <Text style={[styles.statsTitle, { color: colors.text }]}>Reading Statistics</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Books read:</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{readingStats.booksRead}</Text>
            </View>
            <View style={[styles.statItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pages highlighted:</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{readingStats.pagesHighlighted}</Text>
            </View>
            <View style={[styles.statItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reading streak:</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{readingStats.readingStreak} days</Text>
            </View>
            <View style={[styles.statItem, styles.lastStatItem]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total reading time:</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{readingStats.totalReadingTime}</Text>
            </View>
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={dynamicStyles.bottomActions}>
        <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.backgroundSecondary }]} onPress={handleExportData}>
          <Download size={20} color={colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.exportButtonText, { color: colors.textSecondary }]}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingsButton, { backgroundColor: colors.primary }]} onPress={handleSettings}>
          <Settings size={20} color={colors.onPrimary} strokeWidth={2} />
          <Text style={[styles.settingsButtonText, { color: colors.onPrimary }]}>Settings</Text>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },

  // Color Items
  colorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  colorName: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  colorPercentageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 16,
  },
  colorBarContainer: {
    flex: 1,
    marginRight: 12,
  },
  colorBarBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  colorBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  colorPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    minWidth: 40,
    textAlign: 'right',
  },

  // Trend Section
  trendPeriod: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  weeklyTrendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDayDot: {
    backgroundColor: '#1F2937',
  },
  inactiveDayDot: {
    backgroundColor: '#E5E7EB',
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Reading Style Section
  readingStyleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  readingStyleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  readingStyleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  readingStyleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Suggestion Section
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  suggestionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },

  // Stats Section
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsGrid: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastStatItem: {
    borderBottomWidth: 0,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
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
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  settingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  settingsButtonText: {
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