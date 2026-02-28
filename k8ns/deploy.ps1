# Kubernetes Deployment Script for RAG Model
# This script applies all manifests in the correct order.

echo "Applying Namespace..."
kubectl apply -f namespace.yaml

echo "Applying Secret..."
kubectl apply -f secret.yaml

echo "Applying ConfigMap..."
kubectl apply -f configmap.yaml

echo "Applying Persistence (PVs & PVCs)..."
kubectl apply -f pv-chroma.yaml
kubectl apply -f pv-models.yaml
kubectl apply -f pvc.yaml
kubectl apply -f model-cache-pvc.yaml

echo "Applying Backend Deployment..."
kubectl apply -f backend-deployment.yaml

echo "Applying Backend Service..."
kubectl apply -f backend-service.yaml

echo "Applying Frontend Deployment..."
kubectl apply -f frontend-deployment.yaml

echo "Applying Frontend Service..."
kubectl apply -f frontend-service.yaml

echo "Deployment complete! Checking status..."
kubectl get all -n rag-model
