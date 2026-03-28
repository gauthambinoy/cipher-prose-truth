import { useState, useCallback } from "react";
import { Box, Card, CardContent, Typography, Tabs, Tab, Divider } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "@/components/input/TextInput";
import FileUpload from "@/components/input/FileUpload";
import LoadingProgress from "@/components/common/LoadingProgress";
import DetectionDashboard from "@/components/analysis/DetectionDashboard";
import { useDetection } from "@/hooks/useDetection";
import { useAppStore } from "@/stores/appStore";

export default function DetectPage() {
  const [inputTab, setInputTab] = useState(0);
  const detection = useDetection();
  const { detectionResult, isAnalyzing } = useAppStore();

  const handleSubmit = useCallback(
    (text: string, mode: string) => {
      detection.mutate({ text, mode });
    },
    [detection]
  );

  const handleFileContent = useCallback(
    (text: string, _filename: string) => {
      detection.mutate({ text, mode: "deep" });
    },
    [detection]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            AI Content Detection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Advanced multi-signal analysis to detect AI-generated text with high
            accuracy.
          </Typography>
        </Box>

        {/* Input section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Tabs
              value={inputTab}
              onChange={(_, v) => setInputTab(v)}
              sx={{ mb: 2 }}
            >
              <Tab label="Paste Text" />
              <Tab label="Upload File" />
            </Tabs>
            <Divider sx={{ mb: 2 }} />

            {inputTab === 0 && (
              <TextInput
                onSubmit={handleSubmit}
                isLoading={isAnalyzing}
                placeholder="Paste text you want to check for AI generation..."
              />
            )}
            {inputTab === 1 && (
              <FileUpload
                onFileContent={handleFileContent}
                disabled={isAnalyzing}
              />
            )}
          </CardContent>
        </Card>

        {/* Loading */}
        <AnimatePresence>
          {isAnalyzing && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <LoadingProgress isLoading={isAnalyzing} />
              </CardContent>
            </Card>
          )}
        </AnimatePresence>

        {/* Error */}
        {detection.isError && (
          <Card sx={{ mb: 3, borderColor: "error.main" }}>
            <CardContent>
              <Typography color="error" variant="body2">
                {detection.error?.message || "Analysis failed. Please try again."}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {detectionResult && !isAnalyzing && (
          <DetectionDashboard result={detectionResult} />
        )}
      </Box>
    </motion.div>
  );
}
