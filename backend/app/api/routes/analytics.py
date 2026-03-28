"""
ClarityAI analytics routes — text analysis endpoints.

POST /analytics/readability
POST /analytics/tone
POST /analytics/grammar
POST /analytics/statistics
POST /analytics/suggestions
POST /analytics/citations
POST /analytics/compare
POST /analytics/full
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models import AnalyticsResult

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# Pydantic request / response schemas
# ---------------------------------------------------------------------------


class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=100_000)


class CompareRequest(BaseModel):
    text_a: str = Field(..., min_length=1, max_length=100_000)
    text_b: str = Field(..., min_length=1, max_length=100_000)


class AnalyticsResponse(BaseModel):
    analysis_id: str
    analysis_type: str
    results: Dict[str, Any]
    processing_time_ms: int


class FullAnalyticsResponse(BaseModel):
    analysis_id: str
    readability: Dict[str, Any]
    tone: Dict[str, Any]
    grammar: Dict[str, Any]
    statistics: Dict[str, Any]
    suggestions: Dict[str, Any]
    processing_time_ms: int


# ---------------------------------------------------------------------------
# Lazy-loaded analyzer singletons
# ---------------------------------------------------------------------------

_analyzers: Dict[str, Any] = {}


def _get_analyzer(name: str):
    """Lazy-load and cache analyzer instances."""
    if name not in _analyzers:
        if name == "readability":
            from app.ml.analyzers.readability import ReadabilityAnalyzer
            _analyzers[name] = ReadabilityAnalyzer()
        elif name == "tone":
            from app.ml.analyzers.tone_analyzer import ToneAnalyzer
            _analyzers[name] = ToneAnalyzer()
        elif name == "grammar":
            from app.ml.analyzers.grammar_checker import GrammarChecker
            _analyzers[name] = GrammarChecker()
        elif name == "statistics":
            from app.ml.analyzers.text_statistics import TextStatisticsAnalyzer
            _analyzers[name] = TextStatisticsAnalyzer()
        elif name == "suggestions":
            from app.ml.analyzers.writing_suggestions import WritingSuggestionEngine
            _analyzers[name] = WritingSuggestionEngine()
        elif name == "citations":
            from app.ml.analyzers.citation_extractor import CitationExtractor
            _analyzers[name] = CitationExtractor()
        elif name == "comparison":
            from app.ml.analyzers.comparison import TextComparisonEngine
            _analyzers[name] = TextComparisonEngine()
    return _analyzers[name]


async def _run_analysis(analyzer, text: str) -> Dict[str, Any]:
    """Run a CPU-bound analyzer in a thread pool."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, analyzer.analyze, text)


async def _persist_result(
    db: AsyncSession,
    analysis_type: str,
    input_text: str,
    results: Dict[str, Any],
    processing_time_ms: int,
) -> str:
    """Save an analytics result to the database and return its ID."""
    record = AnalyticsResult(
        id=uuid.uuid4().hex,
        analysis_type=analysis_type,
        input_text=input_text,
        results_json=json.dumps(results, default=str),
        processing_time_ms=processing_time_ms,
    )
    db.add(record)
    await db.flush()
    return record.id


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@router.post("/analytics/readability", response_model=AnalyticsResponse)
async def analyze_readability(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Compute readability metrics for the provided text."""
    start = time.perf_counter()
    analyzer = _get_analyzer("readability")
    results = await _run_analysis(analyzer, request.text)
    elapsed = int((time.perf_counter() - start) * 1000)

    aid = await _persist_result(db, "readability", request.text, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="readability", results=results, processing_time_ms=elapsed)


@router.post("/analytics/tone", response_model=AnalyticsResponse)
async def analyze_tone(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Analyze tone and sentiment of the provided text."""
    start = time.perf_counter()
    analyzer = _get_analyzer("tone")
    results = await _run_analysis(analyzer, request.text)
    elapsed = int((time.perf_counter() - start) * 1000)

    aid = await _persist_result(db, "tone", request.text, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="tone", results=results, processing_time_ms=elapsed)


@router.post("/analytics/grammar", response_model=AnalyticsResponse)
async def analyze_grammar(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Check grammar and style of the provided text."""
    start = time.perf_counter()
    analyzer = _get_analyzer("grammar")
    results = await _run_analysis(analyzer, request.text)
    elapsed = int((time.perf_counter() - start) * 1000)

    aid = await _persist_result(db, "grammar", request.text, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="grammar", results=results, processing_time_ms=elapsed)


@router.post("/analytics/statistics", response_model=AnalyticsResponse)
async def analyze_statistics(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Compute comprehensive text statistics."""
    start = time.perf_counter()
    analyzer = _get_analyzer("statistics")
    results = await _run_analysis(analyzer, request.text)
    elapsed = int((time.perf_counter() - start) * 1000)

    aid = await _persist_result(db, "statistics", request.text, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="statistics", results=results, processing_time_ms=elapsed)


@router.post("/analytics/suggestions", response_model=AnalyticsResponse)
async def analyze_suggestions(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate writing improvement suggestions."""
    start = time.perf_counter()
    analyzer = _get_analyzer("suggestions")
    results = await _run_analysis(analyzer, request.text)
    elapsed = int((time.perf_counter() - start) * 1000)

    aid = await _persist_result(db, "suggestions", request.text, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="suggestions", results=results, processing_time_ms=elapsed)


@router.post("/analytics/citations", response_model=AnalyticsResponse)
async def analyze_citations(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Extract and validate citations and references."""
    start = time.perf_counter()
    analyzer = _get_analyzer("citations")
    results = await _run_analysis(analyzer, request.text)
    elapsed = int((time.perf_counter() - start) * 1000)

    aid = await _persist_result(db, "citations", request.text, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="citations", results=results, processing_time_ms=elapsed)


@router.post("/analytics/compare", response_model=AnalyticsResponse)
async def compare_texts(
    request: CompareRequest,
    db: AsyncSession = Depends(get_db),
):
    """Compare two texts side by side."""
    start = time.perf_counter()
    analyzer = _get_analyzer("comparison")
    loop = asyncio.get_running_loop()
    results = await loop.run_in_executor(None, analyzer.analyze, request.text_a, request.text_b)
    elapsed = int((time.perf_counter() - start) * 1000)

    combined_input = f"TEXT_A:\n{request.text_a[:500]}\n---\nTEXT_B:\n{request.text_b[:500]}"
    aid = await _persist_result(db, "comparison", combined_input, results, elapsed)
    return AnalyticsResponse(analysis_id=aid, analysis_type="comparison", results=results, processing_time_ms=elapsed)


@router.post("/analytics/full", response_model=FullAnalyticsResponse)
async def full_analysis(
    request: TextRequest,
    db: AsyncSession = Depends(get_db),
):
    """Run ALL analytics at once: readability, tone, grammar, statistics, suggestions."""
    start = time.perf_counter()

    readability_analyzer = _get_analyzer("readability")
    tone_analyzer = _get_analyzer("tone")
    grammar_analyzer = _get_analyzer("grammar")
    statistics_analyzer = _get_analyzer("statistics")
    suggestions_analyzer = _get_analyzer("suggestions")

    # Run all in parallel
    readability_res, tone_res, grammar_res, stats_res, suggestions_res = await asyncio.gather(
        _run_analysis(readability_analyzer, request.text),
        _run_analysis(tone_analyzer, request.text),
        _run_analysis(grammar_analyzer, request.text),
        _run_analysis(statistics_analyzer, request.text),
        _run_analysis(suggestions_analyzer, request.text),
    )

    elapsed = int((time.perf_counter() - start) * 1000)

    combined = {
        "readability": readability_res,
        "tone": tone_res,
        "grammar": grammar_res,
        "statistics": stats_res,
        "suggestions": suggestions_res,
    }
    aid = await _persist_result(db, "full", request.text, combined, elapsed)

    return FullAnalyticsResponse(
        analysis_id=aid,
        readability=readability_res,
        tone=tone_res,
        grammar=grammar_res,
        statistics=stats_res,
        suggestions=suggestions_res,
        processing_time_ms=elapsed,
    )
