export interface ReadabilityResult {
  flesch_reading_ease: number;
  flesch_kincaid_grade: number;
  gunning_fog: number;
  smog_index: number;
  coleman_liau: number;
  automated_readability: number;
  dale_chall: number;
  linsear_write: number;
  overall_grade: string;
  reading_time_seconds: number;
  reading_time_minutes: number;
  difficulty: "very_easy" | "easy" | "moderate" | "difficult" | "very_difficult";
}

export interface EmotionScore {
  emotion: string;
  score: number;
}

export interface ToneResult {
  formality: number;
  sentiment: number;
  sentiment_label: "positive" | "negative" | "neutral" | "mixed";
  emotions: EmotionScore[];
  objectivity: number;
  persuasiveness: number;
  urgency: number;
  confidence: number;
}

export interface GrammarError {
  id: string;
  message: string;
  context: string;
  offset: number;
  length: number;
  original: string;
  suggestions: string[];
  severity: "error" | "warning" | "info";
  category: string;
  rule_id: string;
}

export interface GrammarResult {
  errors: GrammarError[];
  grammar_score: number;
  style_score: number;
  total_errors: number;
  category_counts: Record<string, number>;
  corrected_text: string;
}

export interface WordCloudItem {
  text: string;
  value: number;
}

export interface POSDistribution {
  tag: string;
  label: string;
  count: number;
}

export interface CommonWord {
  word: string;
  count: number;
}

export interface TextStatistics {
  word_count: number;
  sentence_count: number;
  paragraph_count: number;
  character_count: number;
  character_count_no_spaces: number;
  unique_word_count: number;
  avg_word_length: number;
  avg_sentence_length: number;
  vocabulary_richness: number;
  reading_time_minutes: number;
  speaking_time_minutes: number;
  word_length_distribution: { length: number; count: number }[];
  sentence_length_distribution: { length: number; count: number }[];
  pos_distribution: POSDistribution[];
  word_cloud_data: WordCloudItem[];
  common_words: CommonWord[];
}

export interface WritingSuggestion {
  id: string;
  category: "clarity" | "conciseness" | "engagement" | "vocabulary" | "structure";
  severity: "high" | "medium" | "low";
  message: string;
  original: string;
  suggested: string;
  explanation: string;
  position: { start: number; end: number };
}

export interface WritingSuggestionsResult {
  suggestions: WritingSuggestion[];
  overall_score: number;
  category_scores: Record<string, number>;
}

export interface Citation {
  id: string;
  text: string;
  style_detected: string;
  is_valid: boolean;
  issues: string[];
  authors: string[];
  year?: string;
  title?: string;
}

export interface CitationResult {
  citations: Citation[];
  detected_style: string;
  total_citations: number;
  valid_count: number;
  invalid_count: number;
  missing_references: string[];
  format_consistency_score: number;
  issues: string[];
}

export interface DiffSegment {
  type: "equal" | "insert" | "delete" | "replace";
  text: string;
  text_b?: string;
}

export interface ComparisonResult {
  similarity_score: number;
  diff_data: DiffSegment[];
  common_phrases: string[];
  text_a_stats: {
    word_count: number;
    sentence_count: number;
    avg_sentence_length: number;
    vocabulary_size: number;
  };
  text_b_stats: {
    word_count: number;
    sentence_count: number;
    avg_sentence_length: number;
    vocabulary_size: number;
  };
  vocabulary_overlap: number;
}

export interface FullAnalyticsResult {
  readability: ReadabilityResult;
  tone: ToneResult;
  grammar: GrammarResult;
  statistics: TextStatistics;
  suggestions: WritingSuggestionsResult;
  citations: CitationResult;
}

export interface ExportOptions {
  format: "pdf" | "json" | "csv";
  sections: string[];
  include_charts: boolean;
  filename?: string;
}
