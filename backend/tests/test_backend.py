import unittest
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.ingest import run_ingestion
from app.routers.health import get_health
from app.routers.overview import get_overview
from app.routers.investigations import list_investigations, get_investigation
from app.routers.search import search_documents
from app.routers.observations import list_observations
from app.routers.findings import list_findings
from app.routers.compare import compare_investigations
from app.routers.ranking import rank_evidence
from app.routers.assistant import ask_assistant
from app.schemas import CompareRequest, RankRequest, AssistantAskRequest

class TestIgnisBackendDirect(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        run_ingestion()

    def test_01_health_endpoint(self):
        resp = get_health()
        self.assertEqual(resp.status, "healthy")
        self.assertEqual(resp.ingested_investigations, 3)

    def test_02_overview_endpoint(self):
        resp = get_overview()
        self.assertEqual(resp.investigation_count, 3)
        self.assertGreaterEqual(resp.observation_count, 50)
        self.assertGreaterEqual(resp.source_document_count, 3)
        self.assertEqual(resp.featured_insight["investigation_id"], "PSI-69")
        self.assertIn("IGNIS RESEARCH NOTICE", resp.disclaimer)

    def test_03_investigations_list_and_detail(self):
        invs = list_investigations()
        self.assertEqual(len(invs), 3)

        # Check FLEX detail
        flex = get_investigation("PSI-69")
        self.assertEqual(flex.external_id, "PSI-69")
        self.assertEqual(flex.doi, "10.60555/mbq8-0451")
        self.assertGreaterEqual(len(flex.source_files), 2)
        self.assertGreaterEqual(flex.observation_count, 20)

        # Check SAFFIRE-I detail
        saffire = get_investigation("PSI-98")
        self.assertEqual(saffire.external_id, "PSI-98")
        self.assertEqual(saffire.doi, "10.60555/0t15-1z43")

        # Check SPICE detail
        spice = get_investigation("PSI-107")
        self.assertEqual(spice.external_id, "PSI-107")
        self.assertEqual(spice.doi, "10.60555/9kbh-e962")

    def test_04_search_endpoint(self):
        results = search_documents(q="droplet extinguishment", top_k=5)
        self.assertGreater(len(results), 0)
        top = results[0]
        self.assertTrue(top.document_title)
        self.assertTrue(top.source_url)
        self.assertIn("droplet", top.text_snippet.lower())

    def test_05_scientific_comparison_incompatibility(self):
        # Compare FLEX (liquid droplet) and SAFFIRE-I (solid fabric)
        req = CompareRequest(investigation_ids=["PSI-69", "PSI-98"])
        resp = compare_investigations(req)
        self.assertFalse(resp.is_valid_comparison)
        self.assertIn("CRITICAL INCOMPATIBILITY", resp.comparability_warning)
        self.assertIn("Droplet vs. Solid Sheet", resp.comparability_warning)
        self.assertIn("SCIENTIFIC INTEGRITY RULE", resp.recommendation)

    def test_06_scientific_comparison_within_framework(self):
        # Single investigation comparison
        req = CompareRequest(investigation_ids=["PSI-69"])
        resp = compare_investigations(req)
        self.assertTrue(resp.is_valid_comparison)
        self.assertIn("scientifically valid", resp.comparability_warning)

    def test_07_transparent_ranking(self):
        req = RankRequest(
            scenario_or_query="gaseous fire suppressants and droplet burning rates",
            target_gravity="Microgravity"
        )
        resp = rank_evidence(req)
        self.assertIn("Transparent evidence-relevance weights", resp.weighting_model_disclaimer)
        self.assertGreater(len(resp.ranked_items), 0)
        # FLEX (PSI-69) should rank highest for gaseous suppressants + droplets
        self.assertEqual(resp.ranked_items[0].investigation_id, "PSI-69")
        self.assertIn("topic_relevance", resp.ranked_items[0].factor_breakdown)
        self.assertIn("condition_match", resp.ranked_items[0].factor_breakdown)

    def test_08_assistant_grounded_answer(self):
        req = AssistantAskRequest(
            question="What did FLEX investigate about gaseous fire suppressants?",
            top_k=3
        )
        resp = ask_assistant(req)
        self.assertEqual(resp.status, "answered")
        self.assertGreater(len(resp.citations), 0)
        self.assertTrue(resp.is_offline_fallback)
        self.assertIn("FLEX", resp.answer)
        self.assertIn("CO2", resp.answer)

    def test_09_assistant_unsupported_evidence_gap(self):
        req = AssistantAskRequest(
            question="What are the fire safety protocols for antimatter warp drive containment?",
            top_k=3
        )
        resp = ask_assistant(req)
        self.assertEqual(resp.status, "insufficient_evidence")
        self.assertIn("could not find enough evidence", resp.answer)
        self.assertGreater(len(resp.limitations), 0)

    def test_10_observations_and_findings(self):
        obs = list_observations(investigation_id="PSI-69", limit=10)
        self.assertEqual(len(obs), 10)
        self.assertEqual(obs[0].investigation_id, "PSI-69")

        fnds = list_findings(investigation_id="PSI-98", limit=5)
        self.assertGreater(len(fnds), 0)
        self.assertEqual(fnds[0].evidence_class, "Published finding")

if __name__ == "__main__":
    unittest.main()
