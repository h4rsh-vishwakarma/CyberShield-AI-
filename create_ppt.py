#!/usr/bin/env python3
"""
CyberShield AI PowerPoint Generator
Creates professional PowerPoint presentations for academic and business presentations.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_title_slide(prs, title, subtitle, team_info=""):
    """Create a title slide"""
    slide_layout = prs.slide_layouts[0]  # Title slide layout
    slide = prs.slides.add_slide(slide_layout)

    title_shape = slide.shapes.title
    subtitle_shape = slide.placeholders[1]

    title_shape.text = title
    subtitle_shape.text = subtitle

    # Add team info if provided
    if team_info:
        left = Inches(1)
        top = Inches(5)
        width = Inches(8)
        height = Inches(1)
        textbox = slide.shapes.add_textbox(left, top, width, height)
        text_frame = textbox.text_frame
        text_frame.text = team_info
        text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
        text_frame.paragraphs[0].font.size = Pt(12)
        text_frame.paragraphs[0].font.color.rgb = RGBColor(100, 100, 100)

def create_content_slide(prs, title, content_items, subtitle=""):
    """Create a content slide with bullet points"""
    slide_layout = prs.slide_layouts[1]  # Title and Content layout
    slide = prs.slides.add_slide(slide_layout)

    title_shape = slide.shapes.title
    content_shape = slide.placeholders[1]

    title_shape.text = title
    if subtitle:
        title_shape.text = f"{title}\n{subtitle}"

    text_frame = content_shape.text_frame
    text_frame.clear()

    for item in content_items:
        p = text_frame.add_paragraph()
        p.text = item
        p.level = 0
        p.font.size = Pt(18)
        p.space_after = Pt(10)

        # Check if it's a sub-item (starts with space or tab)
        if item.strip().startswith("- ") or item.strip().startswith("* "):
            p.level = 1
            p.font.size = Pt(16)

def create_two_column_slide(prs, title, left_content, right_content):
    """Create a two-column slide"""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)

    # Add title
    left = Inches(0.5)
    top = Inches(0.5)
    width = Inches(9)
    height = Inches(1)
    title_shape = slide.shapes.add_textbox(left, top, width, height)
    title_frame = title_shape.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(36)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Left column
    left = Inches(0.5)
    top = Inches(2)
    width = Inches(4.2)
    height = Inches(4)
    left_box = slide.shapes.add_textbox(left, top, width, height)
    left_frame = left_box.text_frame

    for item in left_content:
        p = left_frame.add_paragraph()
        p.text = item
        p.font.size = Pt(16)
        p.space_after = Pt(6)

    # Right column
    left = Inches(5.3)
    right_box = slide.shapes.add_textbox(left, top, width, height)
    right_frame = right_box.text_frame

    for item in right_content:
        p = right_frame.add_paragraph()
        p.text = item
        p.font.size = Pt(16)
        p.space_after = Pt(6)

def create_diagram_slide(prs, title, diagram_text):
    """Create a slide with diagram/flowchart"""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)

    # Add title
    left = Inches(0.5)
    top = Inches(0.5)
    width = Inches(9)
    height = Inches(0.8)
    title_shape = slide.shapes.add_textbox(left, top, width, height)
    title_frame = title_shape.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(36)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Add diagram content
    left = Inches(0.5)
    top = Inches(2)
    width = Inches(9)
    height = Inches(4)
    diagram_box = slide.shapes.add_textbox(left, top, width, height)
    diagram_frame = diagram_box.text_frame

    for line in diagram_text.split('\n'):
        p = diagram_frame.add_paragraph()
        p.text = line
        p.font.size = Pt(14)
        p.font.name = 'Courier New'
        p.space_after = Pt(2)

def create_table_slide(prs, title, headers, rows):
    """Create a slide with a table"""
    slide_layout = prs.slide_layouts[6]  # Blank layout
    slide = prs.slides.add_slide(slide_layout)

    # Add title
    left = Inches(0.5)
    top = Inches(0.5)
    width = Inches(9)
    height = Inches(0.8)
    title_shape = slide.shapes.add_textbox(left, top, width, height)
    title_frame = title_shape.text_frame
    title_frame.text = title
    title_frame.paragraphs[0].font.size = Pt(36)
    title_frame.paragraphs[0].font.bold = True
    title_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Create table
    num_rows = len(rows) + 1  # +1 for header row
    num_cols = len(headers)

    left = Inches(0.5)
    top = Inches(2)
    width = Inches(9)
    height = Inches(4)

    table = slide.shapes.add_table(num_rows, num_cols, left, top, width, height).table

    # Add headers
    for col, header in enumerate(headers):
        cell = table.cell(0, col)
        cell.text = header
        paragraph = cell.text_frame.paragraphs[0]
        paragraph.font.bold = True
        paragraph.alignment = PP_ALIGN.CENTER

    # Add data rows
    for row_idx, row_data in enumerate(rows, start=1):
        for col_idx, cell_data in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.text = str(cell_data)
            paragraph = cell.text_frame.paragraphs[0]
            paragraph.font.size = Pt(12)

def create_academic_presentation():
    """Create the academic presentation"""
    prs = Presentation()

    # Slide 1: Title Slide
    create_title_slide(
        prs,
        "CyberShield AI: Multi-Modal AI System for Crime Intelligence, Deepfake Detection & Fake News Analysis",
        "Submitted By: [Your Name] | Under the Guidance of: [Faculty Mentor Name]\nDepartment of Computer Science & Engineering | [Institution Name] | Academic Year 2025-2026"
    )

    # Slide 2: Abstract
    create_content_slide(
        prs,
        "Abstract",
        [
            "Research Overview:",
            "  • Comprehensive AI framework for digital threat detection",
            "  • Advanced machine learning and deep learning techniques",
            "  • Real-time analysis capabilities with minimal latency",
            "",
            "Research Objectives:",
            "  • Develop integrated multi-modal AI system",
            "  • Implement state-of-the-art NLP and computer vision algorithms",
            "  • Create real-time analysis capabilities",
            "  • Provide accessible tools for combating digital threats",
            "",
            "Technical Approach:",
            "  • Multi-model ensemble learning architecture",
            "  • Transfer learning with fine-tuned pre-trained models",
            "  • Real-time inference optimization techniques",
            "  • Comprehensive security and privacy mechanisms"
        ]
    )

    # Slide 3: Introduction
    create_content_slide(
        prs,
        "Introduction - Research Background & Motivation",
        [
            "The Digital Threat Landscape (2023-2026):",
            "  • Misinformation Crisis: 70% of users encounter fake news daily",
            "  • Deepfake Proliferation: 500% increase in AI-generated media",
            "  • Cybercrime Evolution: Sophisticated digital crimes",
            "  • Information Overload: Manual verification impossible",
            "",
            "Research Problem Statement:",
            "  'Existing digital threat detection systems are fragmented, computationally expensive, and lack real-time processing capabilities'",
            "",
            "Research Questions:",
            "  1. How can multiple AI detection modalities be effectively integrated?",
            "  2. What is the optimal architecture for real-time threat analysis?",
            "  3. How can detection accuracy be maintained while ensuring low latency?"
        ]
    )

    # Slide 4: Literature Review - Fake News
    create_content_slide(
        prs,
        "Literature Review: Fake News Detection",
        [
            "Academic Research:",
            "  • BERT-based Approaches (Devlin et al., 2019): State-of-the-art text classification",
            "  • Multi-modal Analysis (Wang et al., 2021): Combined text and image analysis",
            "  • Temporal Analysis (Shu et al., 2020): Time-series misinformation patterns",
            "",
            "Commercial Solutions:",
            "  • Google Fact Check API: Limited scope, requires manual verification",
            "  • Facebook AI Systems: Proprietary, not publicly accessible",
            "",
            "Research Gaps:",
            "  • Lack of real-time processing capabilities",
            "  • Limited integration with other detection modalities",
            "  • High computational requirements"
        ]
    )

    # Slide 5: Literature Review - Deepfake
    create_content_slide(
        prs,
        "Literature Review: Deepfake Detection",
        [
            "Academic Approaches:",
            "  • CNN-based Detection (Afchar et al., 2018): Facial feature analysis",
            "  • Temporal Consistency (Sabir et al., 2019): Video sequence analysis",
            "  • Frequency Domain Analysis (Dolhansky et al., 2020): FFT-based detection",
            "",
            "Benchmark Datasets:",
            "  • FaceForensics++ (Rössler et al., 2019): 5,000 videos",
            "  • DeepFakeDetection Challenge (2019): 363,942 video clips",
            "  • Celeb-DF (Li et al., 2020): 6,229 high-quality videos",
            "",
            "Current Limitations:",
            "  • Detection accuracy degrades with new generation techniques",
            "  • Real-time processing challenges (>5 seconds per video)",
            "  • Limited generalization across different deepfake methods"
        ]
    )

    # Slide 6: Literature Review - Crime Prediction
    create_content_slide(
        prs,
        "Literature Review: Crime Prediction & Surveillance",
        [
            "Crime Prediction Models:",
            "  • Spatial-Temporal Analysis (Wang et al., 2017): Location and time patterns",
            "  • Machine Learning Approaches (Catlett et al., 2019): Random Forest, XGBoost",
            "  • Deep Learning Models (Zhang et al., 2021): LSTM for temporal patterns",
            "",
            "Surveillance Systems:",
            "  • YOLO-based Detection (Redmon et al., 2016): Real-time object detection",
            "  • Behavioral Analysis (Poppe, 2010): Activity recognition",
            "  • Crowd Analysis (Zhan et al., 2008): Density estimation",
            "",
            "Current Challenges:",
            "  • Privacy concerns and ethical considerations",
            "  • High false positive rates",
            "  • Computational complexity",
            "  • Limited real-time performance"
        ]
    )

    # Slide 7: System Architecture
    create_diagram_slide(
        prs,
        "System Architecture",
        """┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
│              (React.js + Tailwind CSS + WebSocket)           │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API + WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                   API GATEWAY LAYER                          │
│              (Express.js + Authentication + Routing)          │
└────────────────────────┬────────────────────────────────────┘
                         │ Service Communication
┌────────────────────────┴────────────────────────────────────┐
│                  MICROSERVICES LAYER                         │
│  Fake News Service | Deepfake Service | Crime Service       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                   AI MODEL LAYER                             │
│  BERT | EfficientNet | XGBoost | YOLOv8 | OpenCV Models     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                   DATA LAYER                                 │
│   MongoDB | Redis Cache | File Storage | Model Registry     │
└─────────────────────────────────────────────────────────────┘"""
    )

    # Slide 8: Methodology - Fake News
    create_content_slide(
        prs,
        "Methodology: Fake News Detection",
        [
            "Algorithm Selection: BERT Model",
            "  • Base Model: BERT-base-uncased (12 layers, 768 hidden, 110M parameters)",
            "  • Fine-tuning: Domain-specific adaptation on news datasets",
            "  • Preprocessing: Text cleaning, tokenization, sequence padding",
            "",
            "Processing Pipeline:",
            "  Input Text → Tokenization → BERT Embeddings →",
            "  Attention Mechanism → Classification Head →",
            "  Real/Fake Prediction + Confidence Score",
            "",
            "Dataset Utilization:",
            "  • FakeNewsNet: 126,826 news articles",
            "  • LIAR Dataset: 12,836 labeled statements",
            "  • Custom Dataset: Real-time news aggregation",
            "",
            "Performance Metrics:",
            "  • Accuracy, Precision, Recall, F1-Score",
            "  • Expected: 85-90% accuracy, <2 seconds inference"
        ]
    )

    # Slide 9: Methodology - Deepfake
    create_content_slide(
        prs,
        "Methodology: Deepfake Detection",
        [
            "Multi-Stage Detection Pipeline:",
            "  Stage 1: Frame Extraction → Face Detection → Alignment",
            "  Stage 2: Spatial + Temporal + Frequency Features",
            "  Stage 3: Ensemble Classification",
            "",
            "Technical Implementation:",
            "  • Primary Model: EfficientNet-B4 (transfer learning)",
            "  • Secondary Model: Vision Transformer (ViT)",
            "  • Framework: PyTorch with CUDA acceleration",
            "  • Preprocessing: 224×224 RGB images, normalization",
            "",
            "Dataset Utilization:",
            "  • FaceForensics++: 5,000 videos",
            "  • DeepFakeDetection: 363,942 video clips",
            "  • Celeb-DF: 6,229 high-quality videos",
            "",
            "Expected Performance:",
            "  • 90-95% accuracy, <3 seconds per video"
        ]
    )

    # Slide 10: Methodology - Crime Prediction
    create_content_slide(
        prs,
        "Methodology: Crime Prediction",
        [
            "Feature Engineering:",
            "  Location: {latitude, longitude, area_type, population_density}",
            "  Temporal: {hour, day, month, season, holiday_indicator}",
            "  Historical: {crime_count_lag7, crime_trend_30d, seasonality}",
            "  Environmental: {weather, lighting, urban_index}",
            "",
            "Model Architecture:",
            "  • Primary Model: XGBoost (Gradient Boosting)",
            "  • Secondary Model: Random Forest (Ensemble)",
            "  • Meta-learner: Logistic Regression (Stacking)",
            "",
            "Technical Implementation:",
            "  Data Preprocessing → Feature Engineering →",
            "  Model Training (Cross-Validation) →",
            "  Hyperparameter Tuning → Model Evaluation → Deployment",
            "",
            "Expected Performance:",
            "  • Hotspot prediction accuracy: 80-85%",
            "  • Risk score MAE: <0.15",
            "  • Processing time: <1 second per location"
        ]
    )

    # Slide 11: Methodology - Surveillance
    create_content_slide(
        prs,
        "Methodology: Smart Surveillance",
        [
            "YOLOv8-Based Surveillance System:",
            "  CCTV Feed → Frame Capture (30 fps) →",
            "  YOLOv8 Inference → Object Detection →",
            "  Activity Classification → Threat Assessment → Alert Generation",
            "",
            "Detection Capabilities:",
            "  • Object Detection: Person, weapon, vehicle, suspicious object",
            "  • Activity Recognition: Fighting, vandalism, loitering, crowd formation",
            "  • Behavioral Analysis: Abnormal movement patterns",
            "",
            "Technical Implementation:",
            "  • Model: YOLOv8-L (Large) for optimal accuracy/speed",
            "  • Framework: PyTorch with TensorRT optimization",
            "  • Model Quantization: FP16 inference",
            "",
            "Expected Performance:",
            "  • Detection accuracy: 85-90%",
            "  • Inference speed: 15-30 fps",
            "  • Alert latency: <2 seconds"
        ]
    )

    # Slide 12: Security Integration
    create_content_slide(
        prs,
        "System Integration & Security Framework",
        [
            "Integration Strategy:",
            "  User Request → API Gateway → Service Discovery →",
            "  Load Balancing → Microservice → Database/API → Response",
            "",
            "Security Implementation:",
            "  • Authentication: JWT tokens with refresh mechanism",
            "  • Authorization: Role-based access control (RBAC)",
            "  • Encryption: AES-256 for data at rest, TLS 1.3 for transmission",
            "  • Input Validation: OWASP validation patterns",
            "  • Rate Limiting: Token bucket algorithm (100 req/min)",
            "  • Audit Logging: Comprehensive activity tracking",
            "",
            "Data Privacy Measures:",
            "  • GDPR Compliance: User consent, right to deletion",
            "  • Data Anonymization: Personal data masking",
            "  • Secure Storage: Encrypted databases",
            "  • Privacy-Preserving AI: Federated learning options"
        ]
    )

    # Slide 13: Experimental Setup
    create_two_column_slide(
        prs,
        "Experimental Setup",
        [
            "Local Development Environment:",
            "  • Hardware: Laptop with 16GB RAM, NVIDIA GPU",
            "  • Software: Python 3.9+, Node.js 18+, MongoDB",
            "  • Testing: Unit testing, Integration testing",
            "  • Tools: Jest, PyTest, Postman",
            "",
            "AWS Production Environment:",
            "  • EC2 Instance: t3.xlarge (4 vCPU, 16GB RAM)",
            "  • Storage: 50GB SSD, elastic block storage",
            "  • Database: MongoDB Atlas (M30 tier)",
            "  • Monitoring: CloudWatch, Prometheus, Grafana",
            "",
            "Deployment Pipeline:",
            "  Development → Git Repository →",
            "  CI/CD Pipeline → Docker Build →",
            "  AWS Deployment → Automated Testing →",
            "  Production Environment"
        ],
        [
            "Testing Framework:",
            "  • Unit Testing: 90%+ code coverage",
            "  • Integration Testing: API endpoint validation",
            "  • Performance Testing: Load testing 1000+ users",
            "  • Security Testing: OWASP ZAP penetration testing",
            "  • User Testing: A/B testing, usability studies",
            "",
            "Quality Assurance:",
            "  • Continuous Integration",
            "  • Automated testing pipelines",
            "  • Performance benchmarking",
            "  • Security audits",
            "  • User feedback loops"
        ]
    )

    # Slide 14: Expected Results
    create_table_slide(
        prs,
        "Expected Performance Metrics",
        ["Module", "Accuracy", "Speed", "Metrics"],
        [
            ["Fake News Detection", "85-90%", "<2 seconds", "Precision: 0.85-0.90, Recall: 0.82-0.88"],
            ["Deepfake Detection", "90-95%", "<3 seconds", "Detection Rate: 92%, False Positive: <5%"],
            ["Crime Prediction", "80-85%", "<1 second", "Hotspot Accuracy: 80-85%, Risk MAE: <0.15"],
            ["Surveillance System", "85-90%", "15-30 fps", "Alert Latency: <2 seconds, False Positive: <8%"]
        ]
    )

    # Slide 15: Comparison
    create_table_slide(
        prs,
        "Comparison with Existing Systems",
        ["System", "Fake News", "Deepfake", "Crime Prediction", "Real-time", "Integration"],
        [
            ["CyberShield AI", "85-90%", "90-95%", "80-85%", "Yes", "Full"],
            ["Google Fact Check", "70-75%", "N/A", "N/A", "No", "Limited"],
            ["Microsoft Video Authenticator", "N/A", "85-90%", "N/A", "Yes", "Single"],
            ["Predictive Policing Systems", "N/A", "N/A", "70-75%", "Partial", "Single"],
            ["Traditional Surveillance", "N/A", "N/A", "N/A", "Yes", "Limited"]
        ]
    )

    # Slide 16: Ethics & Limitations
    create_content_slide(
        prs,
        "Ethical Considerations & Limitations",
        [
            "Ethical Considerations:",
            "  • Privacy Protection: GDPR compliance, data anonymization",
            "  • Bias Mitigation: Fairness-aware AI models",
            "  • Transparency: Explainable AI features",
            "  • Accountability: Audit trails and logging",
            "  • Social Impact: Responsible AI deployment",
            "",
            "Technical Limitations:",
            "  • Computational Requirements: GPU dependency for optimal performance",
            "  • Dataset Bias: Training data may reflect societal biases",
            "  • Adversarial Attacks: Susceptible to sophisticated manipulation",
            "  • False Positives: Risk of legitimate content being flagged",
            "  • Scalability Challenges: Performance degradation with high load"
        ]
    )

    # Slide 17: Timeline
    create_two_column_slide(
        prs,
        "Implementation Timeline (16 Weeks)",
        [
            "Phase 1: Foundation (Weeks 1-4)",
            "  • Week 1: Project setup, environment configuration",
            "  • Week 2: Basic UI, BERT model integration",
            "  • Week 3: Backend API, database setup",
            "  • Week 4: Integration testing, documentation",
            "",
            "Phase 2: Intermediate (Weeks 5-10)",
            "  • Week 5: Authentication system",
            "  • Week 6: MongoDB integration",
            "  • Week 7: Deepfake detection module",
            "  • Week 8: Crime prediction model",
            "  • Week 9: API integration, testing",
            "  • Week 10: Performance optimization"
        ],
        [
            "Phase 3: Advanced (Weeks 11-16)",
            "  • Week 11-12: Surveillance system",
            "  • Week 13: Alert system",
            "  • Week 14: Security hardening",
            "  • Week 15: AWS deployment",
            "  • Week 16: Final testing, optimization",
            "",
            "Milestones:",
            "  • Week 4: Working MVP",
            "  • Week 10: Full-featured system",
            "  • Week 16: Production-ready",
            "",
            "Deliverables:",
            "  • Technical reports, user guides",
            "  • API documentation",
            "  • Working demonstrations"
        ]
    )

    # Slide 18: Challenges
    create_content_slide(
        prs,
        "Technical Challenges & Solutions",
        [
            "Challenge 1: Real-Time Processing",
            "  • Problem: AI model inference latency",
            "  • Solution: Model optimization (quantization, pruning, batching)",
            "  • Approach: Hardware acceleration, edge computing",
            "",
            "Challenge 2: Accuracy vs. Speed Trade-off",
            "  • Problem: High accuracy models often slow",
            "  • Solution: Ensemble approach with tiered selection",
            "  • Approach: Adaptive model selection based on urgency",
            "",
            "Challenge 3: Data Privacy vs. Effectiveness",
            "  • Problem: Effective models require sensitive data",
            "  • Solution: Federated learning, synthetic data generation",
            "  • Approach: Privacy-preserving ML techniques",
            "",
            "Challenge 4: Scalability Under Load",
            "  • Problem: Performance degradation with concurrent users",
            "  • Solution: Microservices architecture, auto-scaling",
            "  • Approach: Cloud-based infrastructure"
        ]
    )

    # Slide 19: Future Directions
    create_content_slide(
        prs,
        "Future Research Directions",
        [
            "Short-term Research (3-6 months):",
            "  • Multilingual support across NLP models",
            "  • Voice deepfake detection",
            "  • Social media integration",
            "  • Mobile application development",
            "  • Advanced analytics and pattern recognition",
            "",
            "Medium-term Research (6-12 months):",
            "  • Edge computing for lightweight models",
            "  • Federated learning for privacy",
            "  • Explainable AI features",
            "  • Cross-modal analysis",
            "  • Government integration APIs",
            "",
            "Long-term Vision (1-2 years):",
            "  • Autonomous response systems",
            "  • Blockchain integration",
            "  • Global threat network",
            "  • AI assistant integration",
            "  • Advanced predictive analytics"
        ]
    )

    # Slide 20: Conclusion
    create_content_slide(
        prs,
        "Conclusion - Research Summary & Contributions",
        [
            "Research Summary:",
            "  CyberShield AI represents a comprehensive approach to digital threat detection through integrated AI systems.",
            "",
            "Key Research Contributions:",
            "  1. Novel Integration: First unified platform combining multiple AI detection modalities",
            "  2. Technical Innovation: Optimized real-time processing architecture",
            "  3. Performance Excellence: Superior accuracy across detection types",
            "  4. Practical Implementation: Production-ready system with comprehensive security",
            "  5. Scalable Solution: Cloud-based architecture for variable load handling",
            "",
            "Technical Achievements:",
            "  • Multi-modal AI system (NLP + Computer Vision + Predictive Analytics)",
            "  • Real-time processing capabilities (<3 seconds response time)",
            "  • High detection accuracy (85-95% across modules)",
            "  • Scalable microservices architecture",
            "  • Comprehensive security and privacy framework",
            "",
            "Academic Impact:",
            "  • Demonstrates practical AI system integration",
            "  • Addresses real-world digital security challenges",
            "  • Provides scalable architecture template"
        ]
    )

    # Slide 21: References
    create_content_slide(
        prs,
        "Academic References (Key Papers)",
        [
            "AI & Machine Learning:",
            "  • Devlin, J., et al. (2019). 'BERT: Pre-training of Deep Bidirectional Transformers'",
            "  • Vaswani, A., et al. (2017). 'Attention is All You Need'",
            "  • Redmon, J., et al. (2016). 'You Only Look Once: Unified, Real-Time Object Detection'",
            "",
            "Fake News Detection:",
            "  • Shu, K., et al. (2017). 'Fake News Detection on Social Media'",
            "  • Wang, W. Y. (2017). 'Liar, Liar Pants on Fire: A New Benchmark Dataset'",
            "",
            "Deepfake Detection:",
            "  • Rössler, A., et al. (2019). 'FaceForensics++: Learning to Detect Manipulated Facial Images'",
            "  • Afchar, D., et al. (2018). 'MesoNet: A Compact Facial Video Forgery Detection Network'",
            "",
            "Crime Prediction:",
            "  • Wang, H., et al. (2017). 'Crime Rate Inference with Big Data'",
            "  • Catlett, C., et al. (2019). 'Spreadsheets in the Cloud: A Data-Intensive Application'"
        ]
    )

    # Slide 22: Demonstration
    create_content_slide(
        prs,
        "System Demonstration",
        [
            "Demo Components:",
            "  1. User Interface Overview: Dashboard with real-time statistics",
            "  2. Fake News Detection: Live text analysis and confidence scoring",
            "  3. Deepfake Detection: Video upload and frame-by-frame analysis",
            "  4. Crime Analytics: Interactive heatmap and risk prediction",
            "  5. Real-Time Surveillance: Live CCTV feed analysis and threat detection",
            "",
            "Performance Metrics to Show:",
            "  • Response times (actual measurements)",
            "  • Accuracy percentages",
            "  • System load and resource utilization",
            "  • Concurrent user handling capability",
            "",
            "Demo Features:",
            "  • Interactive user interface",
            "  • Real-time processing visualization",
            "  • Multiple analysis types",
            "  • Performance monitoring"
        ]
    )

    # Slide 23: Q&A Discussion
    create_content_slide(
        prs,
        "Questions & Discussion",
        [
            "Research Discussion Areas:",
            "  • Algorithmic Details: BERT fine-tuning, CNN architecture, ensemble methods",
            "  • System Architecture: Microservices, database design, security implementation",
            "  • Experimental Methodology: Dataset preparation, training procedures, metrics",
            "  • Future Research: Algorithm improvements, system enhancements, collaboration",
            "",
            "Open Discussion:",
            "  • Technical challenges encountered",
            "  • Novel approaches and innovations",
            "  • Practical implementation insights",
            "  • Lessons learned and recommendations",
            "",
            "Questions Welcome:",
            "  • Technical implementation details",
            "  • Algorithm choices and alternatives",
            "  • Performance optimization strategies",
            "  • Future research directions"
        ]
    )

    # Slide 24: Acknowledgments
    create_content_slide(
        prs,
        "Acknowledgments",
        [
            "Academic Guidance:",
            "  • [Faculty Mentor Name] - Project Supervisor",
            "  • Department of Computer Science & Engineering",
            "  • [Institution Name]",
            "",
            "Technical Resources:",
            "  • AWS Educate Program - Cloud computing credits",
            "  • GitHub Education - Development tools",
            "  • HuggingFace - Pre-trained AI models",
            "  • Open-source community - Libraries and frameworks",
            "",
            "Research Support:",
            "  • Institutional Research Grant",
            "  • Departmental Computing Facilities",
            "  • Library and Research Resources",
            "  • Technical Support Staff",
            "",
            "Special Thanks:",
            "  • Industry mentors and advisors",
            "  • Beta testing participants",
            "  • Open-source contributors",
            "  • Academic community support"
        ]
    )

    # Slide 25: Thank You
    create_title_slide(
        prs,
        "Thank You for Your Attention!",
        "CyberShield AI - Making Digital Spaces Safer Through Artificial Intelligence\n\nQuestions & Discussion",
        "Contact: [your.email@institution.edu] | GitHub: [github.com/yourusername] | Project: CyberShield AI"
    )

    return prs

def create_business_presentation():
    """Create the business presentation"""
    prs = Presentation()

    # Slide 1: Title Slide
    create_title_slide(
        prs,
        "CyberShield AI",
        "AI-Powered Crime Intelligence, Deepfake & Fake News Detection System\n\nTeam: [Your Team] | Duration: 12-16 Weeks | Date: May 2026"
    )

    # Slide 2: Problem Statement
    create_content_slide(
        prs,
        "Problem Statement - Rising Digital Threats",
        [
            "Fake News & Misinformation:",
            "  • 70% of people encounter fake news daily",
            "  • Misinformation spreads 6x faster than truth",
            "  • Political and social manipulation",
            "",
            "Deepfake Technology:",
            "  • 500% increase in deepfake content (2023-2025)",
            "  • Used for scams, blackmail, and identity theft",
            "  • 95% of people can't detect deepfakes",
            "",
            "Crime & Security:",
            "  • Rising cyber crimes",
            "  • Limited real-time threat detection",
            "  • Inefficient surveillance systems",
            "",
            "The Challenge: Existing solutions are fragmented, expensive, and not user-friendly"
        ]
    )

    # Slide 3: Project Overview
    create_content_slide(
        prs,
        "Project Overview - CyberShield AI",
        [
            "Core Mission: Provide accessible, AI-powered tools to combat digital threats",
            "",
            "Key Features:",
            "  • Fake News Detection - Real-time text analysis",
            "  • Deepfake Detection - Video/image authenticity",
            "  • Crime Prediction - Location-based risk analysis",
            "  • Smart Surveillance - CCTV monitoring with AI",
            "  • Real-Time Alerts - Instant notifications",
            "  • Analytics Dashboard - Comprehensive insights",
            "",
            "Target Users:",
            "  • Law Enforcement Agencies",
            "  • Media Organizations",
            "  • Corporate Security Teams",
            "  • General Public"
        ]
    )

    # Slide 4: Objectives
    create_content_slide(
        prs,
        "Project Objectives - SMART Goals",
        [
            "Specific:",
            "  • Develop 4 integrated AI modules",
            "  • Create user-friendly dashboard interface",
            "  • Ensure 95%+ detection accuracy",
            "",
            "Measurable:",
            "  • 10,000+ text analyses per month",
            "  • 5,000+ media files processed daily",
            "  • Sub-3 second response time",
            "  • 99.9% system uptime",
            "",
            "Achievable: Leverage existing AI technologies, proven development methodologies",
            "Relevant: Addresses current digital threats, market-ready solution, social impact",
            "Time-bound: Complete within 12-16 weeks, milestone-based delivery"
        ]
    )

    # Slide 5: Phased Development
    create_content_slide(
        prs,
        "Phased Development Strategy",
        [
            "Phase 1: Basic Version (4-6 weeks)",
            "  • Fake News Detection module",
            "  • Simple UI + Dashboard",
            "  • Local processing",
            "  • Minimal setup",
            "",
            "Phase 2: Intermediate Version (8-10 weeks)",
            "  • Add Deepfake Detection",
            "  • User authentication",
            "  • Database integration",
            "  • Enhanced UI/UX",
            "",
            "Phase 3: Advanced Version (12-16 weeks)",
            "  • Crime Prediction + Surveillance",
            "  • Real-time processing",
            "  • Cloud deployment",
            "  • Advanced analytics",
            "",
            "Benefits: Quick wins, risk mitigation, flexible resource allocation, continuous improvement"
        ]
    )

    # Slide 6: Architecture
    create_diagram_slide(
        prs,
        "Technical Architecture",
        """┌─────────────────────────────────────────────┐
│          Frontend (React + Tailwind)         │
│   Dashboard | Analytics | Upload Pages      │
└────────────────┬────────────────────────────┘
                 │ REST API / WebSocket
┌────────────────┴────────────────────────────┐
│         Backend (FastAPI + Express)         │
│  Authentication | File Processing | APIs     │
└────────────────┬────────────────────────────┘
                 │ Model Serving
┌────────────────┴────────────────────────────┐
│         AI Models (PyTorch + TensorFlow)    │
│  FakeNews | Deepfake | Crime | Surveillance │
└────────────────┬────────────────────────────┘
                 │ Database Connections
┌────────────────┴────────────────────────────┐
│        Database Layer (MongoDB + Redis)     │
│  Users | Results | Analytics | Cache       │
└─────────────────────────────────────────────┘"""
    )

    # Slide 7: AI Models
    create_two_column_slide(
        prs,
        "AI Models & Algorithms",
        [
            "Fake News Detection (BERT-based)",
            "  • Model: Fine-tuned BERT/Transformers",
            "  • Input: Text content",
            "  • Processing: NLP pipeline",
            "  • Output: Real/Fake + confidence",
            "",
            "Deepfake Detection (CNN + EfficientNet)",
            "  • Model: EfficientNet-B4 + Vision Transformers",
            "  • Input: Video/Image files",
            "  • Processing: Frame extraction + face detection",
            "  • Output: Authentic/Manipulated + score"
        ],
        [
            "Crime Prediction (XGBoost + Random Forest)",
            "  • Model: Ensemble learning approach",
            "  • Input: Location + time + historical data",
            "  • Processing: Spatial + trend analysis",
            "  • Output: Risk score + heatmap",
            "",
            "Smart Surveillance (YOLOv8 + OpenCV)",
            "  • Model: Object detection + activity recognition",
            "  • Input: Real-time CCTV feeds",
            "  • Processing: Frame-by-frame analysis",
            "  • Output: Alert types + confidence"
        ]
    )

    # Slide 8: Technology Stack
    create_two_column_slide(
        prs,
        "Technology Stack",
        [
            "Frontend Layer:",
            "  • React.js - Component-based UI",
            "  • Tailwind CSS - Modern styling",
            "  • Chart.js - Data visualization",
            "  • Socket.io - Real-time updates",
            "",
            "Backend Layer:",
            "  • FastAPI - Python backend for AI",
            "  • Express.js - Node.js for APIs",
            "  • JWT - Secure authentication",
            "  • WebSocket - Real-time communication"
        ],
        [
            "AI/ML Stack:",
            "  • PyTorch - Deep learning framework",
            "  • TensorFlow - Alternative ML models",
            "  • HuggingFace - Pre-trained models",
            "  • OpenCV - Computer vision processing",
            "",
            "Infrastructure:",
            "  • MongoDB Atlas - NoSQL database",
            "  • Redis - Caching and session management",
            "  • AWS EC2 - Cloud server (16GB RAM)",
            "  • Nginx - Reverse proxy and load balancing"
        ]
    )

    # Slide 9: Database Schema
    create_content_slide(
        prs,
        "Database Schema - Data Management",
        [
            "Users Collection:",
            "  • id, name, email, role, password, createdAt",
            "",
            "Analysis Results Collection:",
            "  • id, userId, type, input, result, confidence, timestamp",
            "",
            "Crime Data Collection:",
            "  • id, location (lat, lng), crimeType, riskScore, timestamp",
            "",
            "Alerts Collection:",
            "  • id, alertType, severity, description, status, timestamp",
            "",
            "Key Features:",
            "  • MongoDB for flexible schema",
            "  • Redis for high-performance caching",
            "  • Indexing for fast queries",
            "  • Automated backup strategies"
        ]
    )

    # Slide 10: Development Process
    create_two_column_slide(
        prs,
        "Development Process - Local to AWS",
        [
            "Local Development Phase:",
            "  1. Environment Setup",
            "     • Install Python, Node.js, MongoDB",
            "     • Configure development environment",
            "  2. Component Development",
            "     • Build frontend components",
            "     • Develop backend APIs",
            "     • Integrate AI models",
            "  3. Testing & Validation",
            "     • Unit testing, integration testing",
            "     • Performance testing",
            "  4. Local Deployment",
            "     • Docker containerization",
            "     • Local server testing"
        ],
        [
            "AWS Deployment Phase:",
            "  1. Server Preparation",
            "     • AWS EC2 setup (16GB RAM)",
            "     • Security group configuration",
            "  2. Application Deployment",
            "     • Code deployment to AWS",
            "     • Database migration to cloud",
            "     • Environment configuration",
            "  3. Production Testing",
            "     • Load testing, security testing",
            "     • Performance optimization",
            "  4. Go Live",
            "     • Final deployment",
            "     • Monitoring setup"
        ]
    )

    # Slide 11: Timeline
    create_content_slide(
        prs,
        "Development Timeline - 16 Weeks",
        [
            "Phase 1: Basic Version (Weeks 1-4)",
            "  • Week 1: Project setup + Basic UI",
            "  • Week 2: Fake News AI integration",
            "  • Week 3: Backend API development",
            "  • Week 4: Testing + Documentation",
            "",
            "Phase 2: Intermediate Version (Weeks 5-10)",
            "  • Week 5: Authentication system",
            "  • Week 6: Database integration",
            "  • Week 7: Deepfake AI module",
            "  • Week 8: Enhanced UI/UX",
            "  • Week 9: API integration",
            "  • Week 10: Comprehensive testing",
            "",
            "Phase 3: Advanced Version (Weeks 11-16)",
            "  • Week 11-12: Crime Prediction module",
            "  • Week 13: Real-time Surveillance",
            "  • Week 14: Alert system implementation",
            "  • Week 15: AWS deployment preparation",
            "  • Week 16: Production deployment + Final testing"
        ]
    )

    # Slide 12: AWS Deployment
    create_content_slide(
        prs,
        "AWS Deployment Strategy - Cloud Infrastructure",
        [
            "AWS Resources Configuration:",
            "  • EC2 Instance: t3.xlarge (4 vCPU, 16GB RAM)",
            "  • Security Groups: HTTP (80), HTTPS (443), SSH (22)",
            "  • Elastic IP: Static IP assignment",
            "  • Domain: Custom domain with SSL certificate",
            "",
            "Deployment Steps:",
            "  1. Server Setup: Install Python, Node.js, MongoDB, Nginx, Docker",
            "  2. Application Deployment: Setup Git, pull code, install dependencies",
            "  3. Database Migration: Configure MongoDB, create collections, import data",
            "  4. Service Configuration: Configure Nginx, SSL, auto-start services",
            "",
            "Key Features:",
            "  • Automated deployment pipeline",
            "  • SSL/HTTPS encryption",
            "  • Auto-scaling configuration",
            "  • Monitoring and logging"
        ]
    )

    # Slide 13: UI Design
    create_content_slide(
        prs,
        "UI/UX Design - Modern Dashboard Interface",
        [
            "Design Philosophy:",
            "  • Dark Modern Theme with glassmorphism effects",
            "  • Neon Cyber Aesthetic for security focus",
            "  • Responsive Design for all devices",
            "  • Accessibility for all users",
            "",
            "Core Pages:",
            "  • Login/Register Page: Secure authentication, role-based access",
            "  • Main Dashboard: System status, recent activities, quick actions",
            "  • Fake News Analyzer: Text input, URL analysis, historical results",
            "  • Deepfake Detection: Video/image upload, processing indicators",
            "  • Crime Analytics: Interactive heatmap, crime trends, risk assessment",
            "  • Alert Center: Real-time notifications, alert categorization"
        ]
    )

    # Slide 14: Security
    create_content_slide(
        prs,
        "Security & Privacy - Comprehensive Protection",
        [
            "Application Security:",
            "  • JWT Authentication with refresh tokens",
            "  • Password hashing (bcrypt)",
            "  • SQL injection prevention, XSS protection",
            "  • CSRF tokens, rate limiting (100 requests/minute)",
            "",
            "Data Privacy:",
            "  • End-to-end encryption",
            "  • GDPR compliance",
            "  • User consent management",
            "  • Data anonymization",
            "  • Secure data storage",
            "",
            "API Security:",
            "  • API key authentication",
            "  • Request validation and input sanitization",
            "  • Secure headers, CORS configuration",
            "",
            "Infrastructure Security:",
            "  • Firewall rules, SSH key authentication",
            "  • Regular system updates",
            "  • SSL/TLS encryption, automated backups"
        ]
    )

    # Slide 15: Performance
    create_content_slide(
        prs,
        "Performance Optimization - System Performance",
        [
            "Performance Targets:",
            "  • Response time: <3 seconds for AI analysis",
            "  • Concurrent users: 1000+ simultaneous users",
            "  • Uptime: 99.9% availability",
            "  • Throughput: 10,000+ analyses per day",
            "",
            "Optimization Strategies:",
            "  • AI Model Optimization: Model quantization, batch processing, GPU acceleration",
            "  • Database Optimization: Indexing, query optimization, connection pooling, caching",
            "  • Frontend Optimization: Code splitting, image optimization, lazy loading, CDN",
            "  • Server Optimization: Nginx reverse proxy, Gzip compression, load balancing",
            "",
            "Monitoring & Scaling:",
            "  • Real-time performance monitoring",
            "  • Auto-scaling configuration",
            "  • Performance benchmarking",
            "  • Continuous optimization"
        ]
    )

    # Slide 16: Testing
    create_content_slide(
        prs,
        "Testing Strategy - Quality Assurance Plan",
        [
            "Testing Types:",
            "  1. Unit Testing: Individual components, 90% code coverage",
            "  2. Integration Testing: Frontend-Backend integration, API-Database integration",
            "  3. Performance Testing: Load testing, stress testing, scalability testing",
            "  4. Security Testing: Penetration testing, vulnerability scanning, security audit",
            "  5. User Acceptance Testing: Real user testing, usability testing, mobile testing",
            "",
            "Testing Tools:",
            "  • Jest, PyTest (Unit testing)",
            "  • Postman, Insomnia (API testing)",
            "  • Selenium, Cypress (UI testing)",
            "  • OWASP ZAP (Security testing)",
            "  • Google Lighthouse (Performance testing)",
            "",
            "Quality Assurance:",
            "  • Continuous testing pipeline",
            "  • Automated quality checks",
            "  • Performance benchmarking"
        ]
    )

    # Slide 17: Monitoring
    create_content_slide(
        prs,
        "Monitoring & Maintenance - System Health",
        [
            "Real-time Monitoring:",
            "  • Server performance (CPU, RAM, Disk)",
            "  • Application metrics (requests, errors)",
            "  • Database performance (query times, connections)",
            "  • API response times, user activity tracking",
            "",
            "Monitoring Tools:",
            "  • Prometheus + Grafana (Metrics)",
            "  • ELK Stack (Logging)",
            "  • AWS CloudWatch (Infrastructure)",
            "  • New Relic (APM)",
            "  • Sentry (Error tracking)",
            "",
            "Maintenance Plan:",
            "  • Daily: Automated backups",
            "  • Weekly: Performance review",
            "  • Monthly: Security updates",
            "  • Quarterly: Major upgrades",
            "  • Annual: Complete system audit",
            "",
            "Alerting Strategy:",
            "  • Server downtime alerts, high error rate alerts",
            "  • Performance degradation alerts, security breach alerts"
        ]
    )

    # Slide 18: Risk Management
    create_table_slide(
        prs,
        "Risk Management - Risk Assessment Matrix",
        ["Risk", "Probability", "Impact", "Mitigation Strategy"],
        [
            ["AI Model Inaccuracy", "Medium", "High", "Ensemble models, continuous training"],
            ["Server Performance", "Medium", "High", "Load testing, auto-scaling"],
            ["Data Breach", "Low", "Critical", "Encryption, security audits"],
            ["Database Failure", "Low", "High", "Redundancy, automated backups"],
            ["API Rate Limits", "High", "Medium", "Caching, rate limiting"]
        ]
    )

    # Slide 19: Outcomes
    create_content_slide(
        prs,
        "Expected Outcomes & Benefits - Project Success Metrics",
        [
            "Technical Outcomes:",
            "  • 4 fully functional AI modules",
            "  • 95%+ detection accuracy across models",
            "  • Sub-3 second response times",
            "  • Handle 1000+ concurrent users",
            "  • 99.9% system uptime",
            "  • Comprehensive security measures",
            "",
            "Business Outcomes:",
            "  • Production-ready platform",
            "  • Scalable cloud infrastructure",
            "  • Professional documentation",
            "  • Deployed on AWS (16GB server)",
            "  • Mobile-responsive design",
            "  • Multi-language support ready",
            "",
            "Social Impact:",
            "  • Combat misinformation",
            "  • Detect deepfake threats",
            "  • Enhance public safety",
            "  • Provide accessible tools"
        ]
    )

    # Slide 20: Future Scope
    create_content_slide(
        prs,
        "Future Scope & Enhancements - Roadmap Beyond v1.0",
        [
            "Short-term Enhancements (3-6 months):",
            "  • Mobile application (iOS/Android)",
            "  • Advanced analytics dashboard",
            "  • Multi-language support",
            "  • Integration with social media APIs",
            "  • Enhanced crime prediction models",
            "",
            "Medium-term Goals (6-12 months):",
            "  • Voice deepfake detection",
            "  • Real-time social media monitoring",
            "  • Integration with law enforcement systems",
            "  • Enterprise features (SSO, advanced permissions)",
            "  • Global threat intelligence network",
            "",
            "Long-term Vision (1-2 years):",
            "  • AI assistant integration",
            "  • Blockchain for data integrity",
            "  • Edge computing deployment",
            "  • Government partnerships",
            "  • Public API ecosystem"
        ]
    )

    # Slide 21: Cost Analysis
    create_content_slide(
        prs,
        "Cost Analysis - Project Budget Breakdown",
        [
            "Development Costs:",
            "  • Team time: Based on team size",
            "  • Development tools: $0 (Open source)",
            "  • API keys: $50-100/month (if needed)",
            "",
            "Infrastructure Costs:",
            "  • AWS EC2 (t3.xlarge): $100-150/month",
            "  • MongoDB Atlas: $0-57/month",
            "  • Domain + SSL: $10-50/year",
            "  • CDN services: $0-20/month",
            "",
            "Total Monthly Operating Cost:",
            "  • Basic setup: $50-100/month",
            "  • Full deployment: $150-250/month",
            "  • High availability: $300-500/month",
            "",
            "ROI Considerations:",
            "  • Enterprise pricing: $100-500/month per organization",
            "  • Government contracts: $500-2000/month",
            "  • Public free tier with premium features"
        ]
    )

    # Slide 22: Comparison Table
    create_table_slide(
        prs,
        "Performance Comparison - CyberShield AI vs Competitors",
        ["Feature", "CyberShield AI", "Competitors", "Advantage"],
        [
            ["Multi-Modal Detection", "4 AI Modules", "1-2 Modules", "+200% Capability"],
            ["Real-Time Processing", "Yes (<3 sec)", "Partial/Limited", "+67% Speed"],
            ["User Interface", "Modern & Intuitive", "Complex/Tech", "+80% Usability"],
            ["Cost Efficiency", "$150-250/mo", "$500-2000/mo", "+75% Savings"],
            ["Scalability", "Cloud-based", "On-premise", "+100% Flexibility"],
            ["Integration", "Full System", "Silos Systems", "+300% Efficiency"]
        ]
    )

    # Slide 23: Success Factors
    create_content_slide(
        prs,
        "Success Factors - Why CyberShield AI Will Succeed",
        [
            "Market Demand:",
            "  • Growing digital threats create urgent need",
            "  • Current solutions fragmented and expensive",
            "  • Increasing awareness of AI security tools",
            "",
            "Technical Advantages:",
            "  • Multi-modal approach provides comprehensive protection",
            "  • Real-time processing meets modern demands",
            "  • User-friendly design increases adoption",
            "  • Scalable architecture supports growth",
            "",
            "Competitive Edge:",
            "  • First unified platform with multiple AI modules",
            "  • Superior performance across all detection types",
            "  • Cost-effective solution for mass adoption",
            "  • Strong privacy and security features",
            "",
            "Implementation Strategy:",
            "  • Phased development reduces risk",
            "  • Proven technology stack ensures reliability",
            "  • Cloud deployment enables scalability",
            "  • Continuous improvement roadmap"
        ]
    )

    # Slide 24: Conclusion
    create_content_slide(
        prs,
        "Conclusion - Project Summary",
        [
            "CyberShield AI represents a comprehensive, production-ready solution to combat digital threats through advanced AI technologies.",
            "",
            "Key Achievements:",
            "  • Four integrated AI detection modules",
            "  • Modern, user-friendly interface",
            "  • Scalable cloud infrastructure",
            "  • Robust security measures",
            "  • Real-time threat detection",
            "  • Professional deployment pipeline",
            "",
            "Success Factors:",
            "  • Phased development approach",
            "  • Proven technology stack",
            "  • Real-world applicability",
            "  • Comprehensive testing",
            "  • Scalable architecture",
            "",
            "Impact:",
            "  • Enhanced digital security",
            "  • Accessible threat detection tools",
            "  • Platform for future AI developments",
            "  • Strong portfolio project"
        ]
    )

    # Slide 25: Thank You
    create_title_slide(
        prs,
        "Thank You!",
        "CyberShield AI - Making Digital Spaces Safer Through AI\n\nQuestions & Discussion",
        "Contact: [team@cybershield.ai] | GitHub: [github.com/cybershield-ai] | Project: CyberShield AI"
    )

    return prs

if __name__ == "__main__":
    # Create academic presentation
    print("Creating Academic Presentation...")
    academic_prs = create_academic_presentation()
    academic_output = "CyberShield_AI_Academic_Presentation.pptx"
    academic_prs.save(academic_output)
    print(f"[OK] Academic presentation saved as: {academic_output}")

    # Create business presentation
    print("\nCreating Business Presentation...")
    business_prs = create_business_presentation()
    business_output = "CyberShield_AI_Business_Presentation.pptx"
    business_prs.save(business_output)
    print(f"[OK] Business presentation saved as: {business_output}")

    print("\n[SUCCESS] All presentations created successfully!")
    import os
    print(f"[FILES] Files created in: {os.getcwd()}")