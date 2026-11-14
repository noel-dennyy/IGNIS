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
from app.routers.images import list_images, get_image, compare_images
from app.services.visualization import ScientificVisualizationService
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

    # ── New tests: Images & Visualization ────────────────────────────────────

    def test_11_images_list_all(self):
        """All 8 synthetic illustration records should be present."""
        imgs = list_images()
        self.assertEqual(len(imgs), 8, "Expected 8 image records from ingest")
        # Every record must carry the synthetic label
        for img in imgs:
            self.assertIn("Synthetic", img.image_type_label)
            self.assertTrue(img.file_path.startswith("/images/experiments/"))

    def test_12_images_list_by_investigation(self):
        """Filter by investigation_id returns correct subset."""
        flex_imgs = list_images(investigation_id="PSI-69")
        self.assertEqual(len(flex_imgs), 3, "FLEX should have 3 illustrations")
        for img in flex_imgs:
            self.assertEqual(img.investigation_id, "PSI-69")

        saffire_imgs = list_images(investigation_id="PSI-98")
        self.assertEqual(len(saffire_imgs), 3, "SAFFIRE-I should have 3 illustrations")

        spice_imgs = list_images(investigation_id="PSI-107")
        self.assertEqual(len(spice_imgs), 2, "SPICE should have 2 illustrations")

    def test_13_image_detail_and_annotations(self):
        """Single image detail should include annotations."""
        imgs = list_images(investigation_id="PSI-69")
        first_id = imgs[0].id
        detail = get_image(first_id)
        self.assertEqual(detail.id, first_id)
        self.assertIsInstance(detail.annotations, list)
        self.assertGreater(len(detail.annotations), 0, "Illustrations should have annotations")
        ann = detail.annotations[0]
        self.assertTrue(ann.label)
        self.assertTrue(0 <= ann.x_pct <= 100)
        self.assertTrue(0 <= ann.y_pct <= 100)

    def test_14_image_cross_investigation_compare(self):
        """Cross-investigation compare should warn about incompatibility."""
        flex_imgs = list_images(investigation_id="PSI-69")
        saffire_imgs = list_images(investigation_id="PSI-98")
        resp = compare_images(flex_imgs[0].id, saffire_imgs[0].id)
        self.assertFalse(resp.compatible_for_visual_comparison)
        self.assertFalse(resp.shared_investigation)
        self.assertIn("DIFFERENT investigations", resp.comparison_note)

    def test_15_time_series_data(self):
        """SAFFIRE-I time series must return non-empty data with required channels."""
        svc = ScientificVisualizationService()
        result = svc.get_time_series("PSI-98")
        self.assertEqual(result["investigation_id"], "PSI-98")
        self.assertGreater(len(result["data"]), 0)
        self.assertIn("flame_spread_rate_mm_s", result["data"][0])
        self.assertIn("peak_temperature_c", result["data"][0])

    def test_16_scatter_data_flex(self):
        """FLEX scatter data must return points with d0 and K axes."""
        svc = ScientificVisualizationService()
        result = svc.get_scatter_data("flex_droplet")
        self.assertEqual(result["dataset_type"], "flex_droplet")
        self.assertGreater(len(result["points"]), 0)
        pt = result["points"][0]
        self.assertIn("initial_diameter_mm", pt)
        self.assertIn("burning_rate_k_mm2_s", pt)

    def test_17_distribution_burning_rate(self):
        """Distribution bins must cover actual data with correct statistics."""
        svc = ScientificVisualizationService()
        result = svc.get_distribution("burning_rate_k")
        self.assertIn("bins", result)
        self.assertGreater(len(result["bins"]), 0)
        stats = result["statistics"]
        self.assertGreater(stats["count"], 0)
        self.assertIn("mean", stats)
        self.assertIn("std_dev", stats)

    def test_18_insights_structure(self):
        """Scientific insights response must include all required keys."""
        svc = ScientificVisualizationService()
        for view_id in ["time_series", "scatter", "distribution", "heatmap"]:
            result = svc.get_scientific_insights(view_id)
            self.assertEqual(result["view_id"], view_id)
            self.assertTrue(result.get("what_graph_displays"), f"Missing 'what_graph_displays' for {view_id}")
            self.assertIsInstance(result.get("key_trends"), list, f"'key_trends' should be a list for {view_id}")
            self.assertGreater(len(result["key_trends"]), 0, f"No trends for {view_id}")

if __name__ == "__main__":
    unittest.main()
