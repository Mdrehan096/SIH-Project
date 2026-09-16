"""
RETRACKAI Project Knowledge Retriever
Indexes structured markdown knowledge files in backend/ai/retrackai/knowledge/
and performs semantic TF-IDF / keyword similarity retrieval for project queries.
"""

import os
import re
import math
from typing import List, Dict, Any, Tuple


class KnowledgeRetriever:
    """Lightweight TF-IDF and Keyword-based Project Knowledge Retriever."""

    def __init__(self, knowledge_dir: str):
        self.knowledge_dir = knowledge_dir
        self.documents: List[Dict[str, Any]] = []
        self._load_and_index_knowledge()

    def _load_and_index_knowledge(self):
        if not os.path.exists(self.knowledge_dir):
            return

        for fname in os.listdir(self.knowledge_dir):
            if not fname.endswith(".md"):
                continue

            fpath = os.path.join(self.knowledge_dir, fname)
            doc_id = fname.replace(".md", "")
            try:
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()

                # Extract title from first heading
                title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
                doc_title = title_match.group(1).strip() if title_match else doc_id.replace("_", " ").title()

                # Split into section chunks by ## headings
                sections = re.split(r"\n(?=##\s+)", content)
                for sec_idx, sec_text in enumerate(sections):
                    sec_title_match = re.search(r"^##\s+(.+)$", sec_text, re.MULTILINE)
                    sec_title = sec_title_match.group(1).strip() if sec_title_match else doc_title

                    words = self._tokenize(sec_text)
                    self.documents.append({
                        "doc_id": doc_id,
                        "document": doc_title,
                        "section": sec_title,
                        "content": sec_text.strip(),
                        "words": words,
                        "filename": fname
                    })
            except Exception as e:
                print(f"Error indexing {fname}: {e}")

    def _tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^\w\s]", " ", text.lower())
        return [w for w in cleaned.split() if len(w) > 2]

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_words = self._tokenize(query)
        if not query_words or not self.documents:
            return []

        scores: List[Tuple[float, Dict[str, Any]]] = []

        for doc in self.documents:
            doc_words = doc["words"]
            if not doc_words:
                continue

            score = 0.0
            # Term Frequency & Match Boost
            for q_word in query_words:
                count = doc_words.count(q_word)
                if count > 0:
                    tf = count / len(doc_words)
                    score += tf * (1.0 + math.log(1.0 + count))

                    # Heading match bonus
                    if q_word in doc["section"].lower():
                        score += 2.5
                    if q_word in doc["document"].lower():
                        score += 3.0

            if score > 0.0:
                scores.append((score, doc))

        # Sort by score descending
        scores.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scores[:top_k]]


# Instantiate singleton retriever targeting local knowledge directory
KNOWLEDGE_BASE_DIR = os.path.join(os.path.dirname(__file__), "knowledge")
retriever = KnowledgeRetriever(knowledge_dir=KNOWLEDGE_BASE_DIR)
