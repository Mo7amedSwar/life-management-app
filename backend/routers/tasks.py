from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db

router = APIRouter()

def pre_populate_tasks(db: Session):
    count = db.query(models.Task).count()
    if count > 0:
        return
    
    tasks_data = [
        # Phase 0
        {"title": "Notion/Obsidian Second Brain setup", "phase": 0, "category": "Business"},
        {"title": "Anki app for spaced repetition", "phase": 0, "category": "Business"},
        {"title": "Daily Review habit", "phase": 0, "category": "Business"},
        {"title": "Read 'Show Your Work'", "phase": 0, "category": "Business"},
        {"title": "Read 'The Personal MBA' summary", "phase": 0, "category": "Business"},
        {"title": "LinkedIn profile setup", "phase": 0, "category": "Business"},
        {"title": "GitHub profile README", "phase": 0, "category": "Business"},
        {"title": "Weekly LinkedIn posts", "phase": 0, "category": "Business"},
        {"title": "Python Crash Course Vol.1", "phase": 0, "category": "AI/ML"},
        {"title": "Codewars daily exercises", "phase": 0, "category": "AI/ML"},
        {"title": "PROJECT: My Learning OS in Notion", "phase": 0, "category": "Business"},
        # Phase 1
        {"title": "Linux file system structure", "phase": 1, "category": "DevOps"},
        {"title": "Basic Linux commands", "phase": 1, "category": "DevOps"},
        {"title": "File permissions & users", "phase": 1, "category": "DevOps"},
        {"title": "Processes management", "phase": 1, "category": "DevOps"},
        {"title": "Shell Scripting (Bash)", "phase": 1, "category": "DevOps"},
        {"title": "Variables, loops, conditions, functions", "phase": 1, "category": "DevOps"},
        {"title": "Cron jobs & automation", "phase": 1, "category": "DevOps"},
        {"title": "Text processing: grep, awk, sed", "phase": 1, "category": "DevOps"},
        {"title": "SSH & Remote server management", "phase": 1, "category": "DevOps"},
        {"title": "Package managers", "phase": 1, "category": "DevOps"},
        {"title": "TCP/IP, DNS, HTTP/S, SSL basics", "phase": 1, "category": "DevOps"},
        {"title": "Load Balancer concepts", "phase": 1, "category": "DevOps"},
        {"title": "Python functions & decorators", "phase": 1, "category": "DevOps"},
        {"title": "File I/O, JSON, CSV", "phase": 1, "category": "DevOps"},
        {"title": "Error handling & logging", "phase": 1, "category": "DevOps"},
        {"title": "Virtual environments", "phase": 1, "category": "DevOps"},
        {"title": "OOP in Python", "phase": 1, "category": "DevOps"},
        {"title": "Python for automation (os, subprocess, pathlib)", "phase": 1, "category": "DevOps"},
        {"title": "APIs with requests library", "phase": 1, "category": "DevOps"},
        {"title": "Paramiko (SSH automation)", "phase": 1, "category": "DevOps"},
        {"title": "YAML & JSON parsing", "phase": 1, "category": "DevOps"},
        {"title": "CLI tools with argparse", "phase": 1, "category": "DevOps"},
        {"title": "NumPy basics", "phase": 1, "category": "AI/ML"},
        {"title": "Pandas basics", "phase": 1, "category": "AI/ML"},
        {"title": "Matplotlib", "phase": 1, "category": "AI/ML"},
        {"title": "Jupyter Notebooks", "phase": 1, "category": "AI/ML"},
        {"title": "Git internals", "phase": 1, "category": "DevOps"},
        {"title": "GitHub: PRs, Issues, Actions", "phase": 1, "category": "DevOps"},
        {"title": "GitLab basics", "phase": 1, "category": "DevOps"},
        {"title": "PROJECT 1: Linux SysAdmin Toolkit (Bash)", "phase": 1, "category": "DevOps"},
        {"title": "PROJECT 2: DevOps Python CLI Tool", "phase": 1, "category": "DevOps"},
        {"title": "PROJECT 3: Open Source Contribution PR", "phase": 1, "category": "DevOps"},
        # Phase 2
        {"title": "Docker architecture", "phase": 2, "category": "DevOps"},
        {"title": "Dockerfile writing (multi-stage)", "phase": 2, "category": "DevOps"},
        {"title": "Docker Compose", "phase": 2, "category": "DevOps"},
        {"title": "Docker networking & volumes", "phase": 2, "category": "DevOps"},
        {"title": "Docker Hub", "phase": 2, "category": "DevOps"},
        {"title": "Podman", "phase": 2, "category": "DevOps"},
        {"title": "Container security", "phase": 2, "category": "DevOps"},
        {"title": "Cloud concepts: IaaS, PaaS, SaaS", "phase": 2, "category": "DevOps"},
        {"title": "AWS Core Services: EC2, S3, VPC, IAM", "phase": 2, "category": "DevOps"},
        {"title": "Regions & Availability Zones", "phase": 2, "category": "DevOps"},
        {"title": "EC2 deep dive", "phase": 2, "category": "DevOps"},
        {"title": "S3 deep dive", "phase": 2, "category": "DevOps"},
        {"title": "RDS & DynamoDB basics", "phase": 2, "category": "DevOps"},
        {"title": "Lambda (Serverless)", "phase": 2, "category": "DevOps"},
        {"title": "VPC: subnets, routing, NAT", "phase": 2, "category": "DevOps"},
        {"title": "Security Groups vs NACLs", "phase": 2, "category": "DevOps"},
        {"title": "Route 53", "phase": 2, "category": "DevOps"},
        {"title": "CloudFront", "phase": 2, "category": "DevOps"},
        {"title": "K8s architecture: Pods, Nodes, Clusters", "phase": 2, "category": "DevOps"},
        {"title": "Deployments, Services, ConfigMaps", "phase": 2, "category": "DevOps"},
        {"title": "Helm Charts", "phase": 2, "category": "DevOps"},
        {"title": "kubectl mastery", "phase": 2, "category": "DevOps"},
        {"title": "EKS on AWS", "phase": 2, "category": "DevOps"},
        {"title": "OpenShift basics", "phase": 2, "category": "DevOps"},
        {"title": "AWS Cloud Practitioner exam prep", "phase": 2, "category": "DevOps"},
        {"title": "PROJECT 4: Containerized Microservices App", "phase": 2, "category": "DevOps"},
        {"title": "PROJECT 5: AWS Cloud Infrastructure", "phase": 2, "category": "DevOps"},
        {"title": "PROJECT 6: Kubernetes Deployment", "phase": 2, "category": "DevOps"},
        # Phase 3
        {"title": "Supervised vs Unsupervised vs Reinforcement Learning", "phase": 3, "category": "AI/ML"},
        {"title": "Linear Regression, Logistic Regression", "phase": 3, "category": "AI/ML"},
        {"title": "Decision Trees, Random Forests", "phase": 3, "category": "AI/ML"},
        {"title": "Model evaluation metrics", "phase": 3, "category": "AI/ML"},
        {"title": "Train/Test split, Cross-validation", "phase": 3, "category": "AI/ML"},
        {"title": "Feature engineering", "phase": 3, "category": "AI/ML"},
        {"title": "SVM, KNN, Naive Bayes", "phase": 3, "category": "AI/ML"},
        {"title": "XGBoost, LightGBM", "phase": 3, "category": "AI/ML"},
        {"title": "K-Means, DBSCAN clustering", "phase": 3, "category": "AI/ML"},
        {"title": "PCA dimensionality reduction", "phase": 3, "category": "AI/ML"},
        {"title": "Neural Networks (ANN)", "phase": 3, "category": "AI/ML"},
        {"title": "CNNs for image classification", "phase": 3, "category": "AI/ML"},
        {"title": "RNNs/LSTMs", "phase": 3, "category": "AI/ML"},
        {"title": "Transfer Learning", "phase": 3, "category": "AI/ML"},
        {"title": "PyTorch basics", "phase": 3, "category": "AI/ML"},
        {"title": "Large Language Models (LLMs)", "phase": 3, "category": "AI/ML"},
        {"title": "Prompt Engineering", "phase": 3, "category": "AI/ML"},
        {"title": "RAG (Retrieval-Augmented Generation)", "phase": 3, "category": "AI/ML"},
        {"title": "LangChain / LlamaIndex", "phase": 3, "category": "AI/ML"},
        {"title": "OpenAI API & Ollama", "phase": 3, "category": "AI/ML"},
        {"title": "Vector Databases (ChromaDB)", "phase": 3, "category": "AI/ML"},
        {"title": "Fine-tuning basics", "phase": 3, "category": "AI/ML"},
        {"title": "MLflow experiment tracking", "phase": 3, "category": "AI/ML"},
        {"title": "DVC (Data Version Control)", "phase": 3, "category": "AI/ML"},
        {"title": "Feature stores", "phase": 3, "category": "AI/ML"},
        {"title": "FastAPI for ML serving", "phase": 3, "category": "AI/ML"},
        {"title": "Docker for ML models", "phase": 3, "category": "AI/ML"},
        {"title": "BentoML / TorchServe", "phase": 3, "category": "AI/ML"},
        {"title": "Model monitoring", "phase": 3, "category": "AI/ML"},
        {"title": "Apache Airflow", "phase": 3, "category": "AI/ML"},
        {"title": "Kubeflow", "phase": 3, "category": "AI/ML"},
        {"title": "SageMaker Pipelines", "phase": 3, "category": "AI/ML"},
        {"title": "CI/CD for ML", "phase": 3, "category": "AI/ML"},
        {"title": "PROJECT 7: End-to-End ML Project", "phase": 3, "category": "AI/ML"},
        {"title": "PROJECT 8: RAG-powered AI Assistant", "phase": 3, "category": "AI/ML"},
        {"title": "PROJECT 9: MLOps Pipeline", "phase": 3, "category": "AI/ML"},
        # Phase 4
        {"title": "Jenkins pipelines & plugins", "phase": 4, "category": "DevOps"},
        {"title": "GitHub Actions workflows", "phase": 4, "category": "DevOps"},
        {"title": "GitLab CI/CD", "phase": 4, "category": "DevOps"},
        {"title": "ArgoCD (GitOps)", "phase": 4, "category": "DevOps"},
        {"title": "CI/CD for ML models", "phase": 4, "category": "DevOps"},
        {"title": "Terraform basics", "phase": 4, "category": "DevOps"},
        {"title": "Terraform on AWS", "phase": 4, "category": "DevOps"},
        {"title": "Terraform modules & state", "phase": 4, "category": "DevOps"},
        {"title": "Ansible playbooks & roles", "phase": 4, "category": "DevOps"},
        {"title": "Ansible for server config", "phase": 4, "category": "DevOps"},
        {"title": "Packer (AMI creation)", "phase": 4, "category": "DevOps"},
        {"title": "Prometheus metrics & PromQL", "phase": 4, "category": "DevOps"},
        {"title": "Grafana dashboards", "phase": 4, "category": "DevOps"},
        {"title": "ELK Stack", "phase": 4, "category": "DevOps"},
        {"title": "Jaeger (Distributed tracing)", "phase": 4, "category": "DevOps"},
        {"title": "OpenTelemetry", "phase": 4, "category": "DevOps"},
        {"title": "Istio basics", "phase": 4, "category": "DevOps"},
        {"title": "Service mesh for ML", "phase": 4, "category": "DevOps"},
        {"title": "PROJECT 10: Full DevOps Pipeline", "phase": 4, "category": "DevOps"},
        {"title": "PROJECT 11: Production MLOps Platform", "phase": 4, "category": "DevOps"},
        # Phase 5
        {"title": "DevSecOps & Container security", "phase": 5, "category": "DevOps"},
        {"title": "FinOps: Cloud cost optimization", "phase": 5, "category": "DevOps"},
        {"title": "Platform Engineering", "phase": 5, "category": "DevOps"},
        {"title": "Advanced Kubernetes patterns", "phase": 5, "category": "DevOps"},
        {"title": "AWS SAA-C03 exam prep", "phase": 5, "category": "DevOps"},
        {"title": "Terraform Associate exam prep", "phase": 5, "category": "DevOps"},
        {"title": "CKA exam prep", "phase": 5, "category": "DevOps"},
        {"title": "Google ML Engineer exam prep", "phase": 5, "category": "AI/ML"},
        {"title": "Zero to One - Peter Thiel", "phase": 5, "category": "Business"},
        {"title": "The Lean Startup - Eric Ries", "phase": 5, "category": "Business"},
        {"title": "Building a StoryBrand", "phase": 5, "category": "Business"},
        {"title": "Startup ideation in AI/DevOps", "phase": 5, "category": "Business"},
        {"title": "LinkedIn audience building (1000 followers)", "phase": 5, "category": "Business"},
        {"title": "YouTube/Newsletter launch", "phase": 5, "category": "Business"},
        {"title": "Technical articles (Medium/Hashnode)", "phase": 5, "category": "Business"},
        {"title": "Meetups & Webinars", "phase": 5, "category": "Business"},
        {"title": "Portfolio website", "phase": 5, "category": "Business"},
        {"title": "Open source contributions", "phase": 5, "category": "DevOps"},
        {"title": "PROJECT 12: SaaS AI MVP", "phase": 5, "category": "Business"},
        {"title": "PROJECT 13: Technical Content Portfolio", "phase": 5, "category": "Business"}
    ]
    
    for t_data in tasks_data:
        task = models.Task(**t_data)
        db.add(task)
    db.commit()

@router.get("/", response_model=List[schemas.Task])
def get_tasks(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).offset(skip).limit(limit).all()
    return tasks

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, completed: bool, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = completed
    db.commit()
    db.refresh(task)
    return task

@router.post("/custom", response_model=schemas.Task)
def create_custom_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict(), custom=True)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
